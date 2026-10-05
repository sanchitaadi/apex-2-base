"use client";

import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Download,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type AccoladeDocument = {
  id: string;
  title: string;
  class_name: string | null;
  category: string;
  description: string | null;
  document_url: string | null;
  external_url: string | null;
  document_label: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type FormState = {
  title: string;
  class_name: string;
  description: string;
  document_url: string;
  external_url: string;
  document_label: string;
  sort_order: number;
  is_active: boolean;
};

const BUCKET = "academic-resources";

/*
 * IMPORTANT
 *
 * The final category for all Apexian Accolade publications
 * is monthly-newsletter.
 *
 * We ALSO read old apexian-accolade records so that anything
 * already created is not lost.
 */
const PRIMARY_CATEGORY = "monthly-newsletter";
const OLD_CATEGORY = "apexian-accolade";

const EMPTY_FORM: FormState = {
  title: "",
  class_name: "",
  description: "",
  document_url: "",
  external_url: "",
  document_label: "Read booklet",
  sort_order: 0,
  is_active: true,
};

export default function AdminApexianAccoladePage() {
  const [documents, setDocuments] = useState<
    AccoladeDocument[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState<
    string | null
  >(null);

  const [form, setForm] =
    useState<FormState>(EMPTY_FORM);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [saving, setSaving] = useState(false);

  const [busyId, setBusyId] = useState<
    string | null
  >(null);

  const [preview, setPreview] =
    useState<AccoladeDocument | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  /*
   * ============================================================
   * LOAD
   * ============================================================
   *
   * Reads BOTH categories:
   *
   * monthly-newsletter
   * apexian-accolade
   *
   * and only records whose title contains Apexian Accolade.
   */
  async function loadDocuments() {
    setLoading(true);

    const { data, error } = await supabase
      .from("academic_documents")
      .select("*")
      .or(
        `category.eq.${PRIMARY_CATEGORY},category.eq.${OLD_CATEGORY}`
      )
      .ilike("title", "%Apexian Accolade%")
      .order("sort_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Apexian Accolade load error:",
        error
      );

      alert(
        `Unable to load Apexian Accolade editions.\n\n${error.message}`
      );

      setDocuments([]);
    } else {
      setDocuments(
        (data ?? []) as AccoladeDocument[]
      );
    }

    setLoading(false);
  }

  /*
   * ============================================================
   * ADD
   * ============================================================
   */

  function openAddForm() {
    setEditingId(null);
    setSelectedFile(null);

    setForm({
      ...EMPTY_FORM,
      sort_order: documents.length,
    });

    setShowForm(true);
  }

  /*
   * ============================================================
   * EDIT
   * ============================================================
   */

  function openEditForm(
    document: AccoladeDocument
  ) {
    setEditingId(document.id);

    setSelectedFile(null);

    setForm({
      title: document.title ?? "",
      class_name: document.class_name ?? "",
      description:
        document.description ?? "",
      document_url:
        document.document_url ?? "",
      external_url:
        document.external_url ?? "",
      document_label:
        document.document_label ||
        "Read booklet",
      sort_order:
        document.sort_order ?? 0,
      is_active: document.is_active,
    });

    setShowForm(true);
  }

  /*
   * ============================================================
   * CLOSE
   * ============================================================
   */

  function closeForm() {
    if (saving) return;

    setShowForm(false);

    setEditingId(null);

    setSelectedFile(null);

    setForm(EMPTY_FORM);
  }

  /*
   * ============================================================
   * STORAGE PATH
   * ============================================================
   */

  function getStoragePath(
    url: string | null
  ) {
    if (!url) return null;

    const marker =
      `/storage/v1/object/public/${BUCKET}/`;

    const index =
      url.indexOf(marker);

    if (index === -1) return null;

    return decodeURIComponent(
      url.substring(
        index + marker.length
      )
    );
  }

  /*
   * ============================================================
   * PDF UPLOAD
   * ============================================================
   */

  async function uploadPdf(file: File) {
    if (
      file.type !==
      "application/pdf"
    ) {
      throw new Error(
        "Please select a PDF file only."
      );
    }

    /*
     * Current Supabase Free plan limit.
     */
    const MAX_SIZE =
      50 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      throw new Error(
        `This PDF is ${(
          file.size /
          1024 /
          1024
        ).toFixed(
          1
        )} MB. Your current Supabase project allows files up to 50 MB. Please compress the booklet PDF before uploading it.`
      );
    }

    const path =
      `${PRIMARY_CATEGORY}/${crypto.randomUUID()}.pdf`;

    const { error } =
      await supabase.storage
        .from(BUCKET)
        .upload(
          path,
          file,
          {
            upsert: false,
            contentType:
              "application/pdf",
          }
        );

    if (error) {
      throw new Error(
        `PDF upload failed: ${error.message}`
      );
    }

    const { data } =
      supabase.storage
        .from(BUCKET)
        .getPublicUrl(path);

    return {
      path,
      url: data.publicUrl,
    };
  }

  /*
   * ============================================================
   * SAVE
   * ============================================================
   */

  async function saveDocument(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!form.title.trim()) {
      alert(
        "Please enter the booklet title."
      );
      return;
    }

    if (
      !selectedFile &&
      !form.document_url.trim() &&
      !form.external_url.trim()
    ) {
      alert(
        "Please upload the actual booklet PDF."
      );
      return;
    }

    setSaving(true);

    try {
      let documentUrl =
        form.document_url.trim();

      let oldStoragePath:
        | string
        | null = null;

      /*
       * Find old file if replacing it.
       */
      if (
        editingId &&
        selectedFile
      ) {
        const current =
          documents.find(
            (item) =>
              item.id === editingId
          );

        oldStoragePath =
          getStoragePath(
            current?.document_url ??
              null
          );
      }

      /*
       * Upload replacement/new PDF.
       */
      if (selectedFile) {
        const uploaded =
          await uploadPdf(
            selectedFile
          );

        documentUrl =
          uploaded.url;
      }

      /*
       * IMPORTANT:
       * Regardless of whether the old record came from
       * apexian-accolade or monthly-newsletter, save it under
       * monthly-newsletter from now on.
       */
      const payload = {
        title:
          form.title.trim(),

        class_name:
          form.class_name.trim() ||
          null,

        category:
          PRIMARY_CATEGORY,

        description:
          form.description.trim() ||
          null,

        document_url:
          documentUrl || null,

        external_url:
          form.external_url.trim() ||
          null,

        document_label:
          form.document_label.trim() ||
          "Read booklet",

        sort_order:
          Number(form.sort_order) ||
          0,

        is_active:
          form.is_active,

        updated_at:
          new Date().toISOString(),
      };

      if (editingId) {
        const { error } =
          await supabase
            .from(
              "academic_documents"
            )
            .update(payload)
            .eq(
              "id",
              editingId
            );

        if (error) {
          throw new Error(
            error.message
          );
        }

        /*
         * Delete replaced old PDF.
         */
        if (
          selectedFile &&
          oldStoragePath
        ) {
          const {
            error:
              storageError,
          } =
            await supabase.storage
              .from(BUCKET)
              .remove([
                oldStoragePath,
              ]);

          if (storageError) {
            console.warn(
              "Old PDF could not be deleted:",
              storageError.message
            );
          }
        }
      } else {
        const { error } =
          await supabase
            .from(
              "academic_documents"
            )
            .insert(payload);

        if (error) {
          throw new Error(
            error.message
          );
        }
      }

      closeForm();

      await loadDocuments();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the booklet."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * ============================================================
   * PUBLISH / HIDE
   * ============================================================
   */

  async function toggleVisibility(
    document: AccoladeDocument
  ) {
    setBusyId(document.id);

    const { error } =
      await supabase
        .from(
          "academic_documents"
        )
        .update({
          is_active:
            !document.is_active,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          document.id
        );

    if (error) {
      alert(error.message);
    } else {
      await loadDocuments();
    }

    setBusyId(null);
  }

  /*
   * ============================================================
   * REORDER
   * ============================================================
   */

  async function moveDocument(
    id: string,
    direction:
      | "up"
      | "down"
  ) {
    const index =
      documents.findIndex(
        (item) =>
          item.id === id
      );

    if (index === -1) return;

    const newIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      newIndex < 0 ||
      newIndex >=
        documents.length
    ) {
      return;
    }

    const current =
      documents[index];

    const target =
      documents[newIndex];

    setBusyId(id);

    const first =
      await supabase
        .from(
          "academic_documents"
        )
        .update({
          sort_order:
            target.sort_order,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          current.id
        );

    if (first.error) {
      alert(first.error.message);
      setBusyId(null);
      return;
    }

    const second =
      await supabase
        .from(
          "academic_documents"
        )
        .update({
          sort_order:
            current.sort_order,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          target.id
        );

    if (second.error) {
      alert(second.error.message);
      setBusyId(null);
      return;
    }

    await loadDocuments();

    setBusyId(null);
  }

  /*
   * ============================================================
   * DELETE
   * ============================================================
   */

  async function deleteDocument(
    document: AccoladeDocument
  ) {
    const confirmed =
      window.confirm(
        `Delete "${document.title}"?`
      );

    if (!confirmed) return;

    setBusyId(document.id);

    try {
      const path =
        getStoragePath(
          document.document_url
        );

      if (path) {
        await supabase.storage
          .from(BUCKET)
          .remove([path]);
      }

      const { error } =
        await supabase
          .from(
            "academic_documents"
          )
          .delete()
          .eq(
            "id",
            document.id
          );

      if (error) {
        throw new Error(
          error.message
        );
      }

      await loadDocuments();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Could not delete the booklet."
      );
    } finally {
      setBusyId(null);
    }
  }

  /*
   * ============================================================
   * PAGE
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-[#f6f5f2] p-4 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-7xl">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#102a56]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#102a56]">

              <FileText className="h-3.5 w-3.5" />

              Publications

            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-[#102a56] sm:text-4xl">
              The Apexian Accolade
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Manage every Apexian Accolade booklet. Each
              uploaded PDF can be displayed as an interactive
              booklet on your website.
            </p>

          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#102a56] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0c2145]"
          >
            <Plus className="h-4 w-4" />
            Add Booklet
          </button>

        </div>

        {/* ======================================================
            LIST
        ====================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-5 py-4">

            <h2 className="font-semibold text-[#102a56]">
              Accolade Editions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              This screen reads both old and new Apexian
              Accolade records, so existing publications are not
              lost.
            </p>

          </div>

          {loading ? (

            <div className="flex min-h-[360px] items-center justify-center">

              <Loader2
                className="h-7 w-7 animate-spin text-[#102a56]"
              />

            </div>

          ) : documents.length === 0 ? (

            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#102a56]/10">

                <FileText className="h-7 w-7 text-[#102a56]" />

              </div>

              <h3 className="mt-5 text-xl font-semibold text-[#102a56]">
                No Apexian Accolade editions found
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Add an edition or check that your existing
                records are in the academic_documents table.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-slate-200">

              {documents.map(
                (document, index) => (

                  <div
                    key={document.id}
                    className="p-5 sm:p-6"
                  >

                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                      {/* LEFT */}

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                              document.is_active
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >

                            {document.is_active ? (
                              <>
                                <Check className="h-3 w-3" />
                                Published
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3" />
                                Hidden
                              </>
                            )}

                          </span>

                          {document.class_name && (
                            <span className="rounded-full bg-[#102a56]/10 px-2.5 py-1 text-xs font-semibold text-[#102a56]">
                              {document.class_name}
                            </span>
                          )}

                          {document.document_url && (
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                              PDF uploaded
                            </span>
                          )}

                          {document.category ===
                            OLD_CATEGORY && (
                            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                              Legacy record
                            </span>
                          )}

                        </div>

                        <h3 className="mt-3 text-lg font-semibold text-slate-900">
                          {document.title}
                        </h3>

                        {document.description && (
                          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                            {document.description}
                          </p>
                        )}

                        <p className="mt-2 text-xs text-slate-400">
                          Position {index + 1}
                        </p>

                      </div>

                      {/* ACTIONS */}

                      <div className="flex flex-wrap items-center gap-2">

                        <button
                          type="button"
                          disabled={
                            index === 0 ||
                            busyId ===
                              document.id
                          }
                          onClick={() =>
                            moveDocument(
                              document.id,
                              "up"
                            )
                          }
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                          title="Move up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          disabled={
                            index ===
                              documents.length -
                                1 ||
                            busyId ===
                              document.id
                          }
                          onClick={() =>
                            moveDocument(
                              document.id,
                              "down"
                            )
                          }
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                          title="Move down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          disabled={
                            !document.document_url &&
                            !document.external_url
                          }
                          onClick={() =>
                            setPreview(
                              document
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                        >
                          <Eye className="h-4 w-4" />
                          Preview
                        </button>

                        {document.document_url && (
                          <a
                            href={
                              document.document_url
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <Download className="h-4 w-4" />
                            PDF
                          </a>
                        )}

                        <button
                          type="button"
                          disabled={
                            busyId ===
                            document.id
                          }
                          onClick={() =>
                            toggleVisibility(
                              document
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                          {document.is_active ? (
                            <>
                              <EyeOff className="h-4 w-4" />
                              Hide
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4" />
                              Publish
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(
                              document
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg bg-[#102a56] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0c2145]"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={
                            busyId ===
                            document.id
                          }
                          onClick={() =>
                            deleteDocument(
                              document
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

      {/* ========================================================
          ADD / EDIT MODAL
      ======================================================== */}

      {showForm && (

        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4">

          <div className="mx-auto my-6 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div>

                <h2 className="text-lg font-semibold text-[#102a56]">
                  {editingId
                    ? "Edit Accolade Booklet"
                    : "Add Accolade Booklet"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Upload the actual PDF for the booklet.
                </p>

              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* FORM */}

            <form onSubmit={saveDocument}>

              <div className="space-y-5 p-5 sm:p-6">

                {/* TITLE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Booklet Title *
                  </label>

                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        title:
                          e.target.value,
                      })
                    }
                    placeholder="THE APEXIAN ACCOLADE – MAY – 2026"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#102a56] focus:ring-2 focus:ring-[#102a56]/10"
                  />

                </div>

                {/* EDITION */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Edition / Date
                  </label>

                  <input
                    type="text"
                    value={form.class_name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        class_name:
                          e.target.value,
                      })
                    }
                    placeholder="May 2026"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#102a56] focus:ring-2 focus:ring-[#102a56]/10"
                  />

                </div>

                {/* DESCRIPTION */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Description
                  </label>

                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        description:
                          e.target.value,
                      })
                    }
                    placeholder="Official Apexian Accolade publication."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#102a56] focus:ring-2 focus:ring-[#102a56]/10"
                  />

                </div>

                {/* PDF */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Booklet PDF
                  </label>

                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:bg-slate-100">

                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#102a56]/10">

                      <Upload className="h-5 w-5 text-[#102a56]" />

                    </div>

                    <span className="text-sm font-semibold text-slate-800">
                      {selectedFile
                        ? selectedFile.name
                        : "Choose booklet PDF"}
                    </span>

                    <span className="mt-1 text-xs text-slate-500">
                      PDF only • maximum 50 MB
                    </span>

                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={(e) => {

                        const file =
                          e.target.files?.[0] ??
                          null;

                        if (!file) return;

                        if (
                          file.type !==
                          "application/pdf"
                        ) {
                          alert(
                            "Please select a PDF file only."
                          );

                          e.target.value = "";

                          return;
                        }

                        const maxSize =
                          50 *
                          1024 *
                          1024;

                        if (
                          file.size >
                          maxSize
                        ) {
                          alert(
                            `This PDF is ${(
                              file.size /
                              1024 /
                              1024
                            ).toFixed(
                              1
                            )} MB. Please compress it to under 50 MB before uploading.`
                          );

                          e.target.value = "";

                          return;
                        }

                        setSelectedFile(
                          file
                        );
                      }}
                    />

                  </label>

                  {form.document_url &&
                    !selectedFile && (

                      <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
                        An existing booklet PDF is attached.
                        Upload another PDF to replace it.
                      </div>

                    )}

                </div>

                {/* OPTIONAL EXTERNAL URL */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    External PDF URL
                  </label>

                  <input
                    type="url"
                    value={form.external_url}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        external_url:
                          e.target.value,
                      })
                    }
                    placeholder="https://..."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#102a56] focus:ring-2 focus:ring-[#102a56]/10"
                  />

                  <p className="mt-1 text-xs text-slate-500">
                    The uploaded Supabase PDF takes priority.
                  </p>

                </div>

                {/* BUTTON LABEL */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Button Label
                  </label>

                  <input
                    type="text"
                    value={form.document_label}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        document_label:
                          e.target.value,
                      })
                    }
                    placeholder="Read booklet"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#102a56]"
                  />

                </div>

                {/* ORDER */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Display Order
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.sort_order}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        sort_order:
                          Number(
                            e.target.value
                          ) || 0,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#102a56]"
                  />

                </div>

                {/* PUBLISH */}

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        is_active:
                          e.target.checked,
                      })
                    }
                    className="mt-1 h-4 w-4"
                  />

                  <div>

                    <p className="text-sm font-semibold text-slate-800">
                      Publish on website
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Published editions appear on the public
                      Apexian Accolade page.
                    </p>

                  </div>

                </label>

              </div>

              {/* FOOTER */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#102a56] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0c2145] disabled:opacity-60"
                >

                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />

                      {editingId
                        ? "Save Changes"
                        : "Add Booklet"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ========================================================
          PREVIEW
      ======================================================== */}

      {preview && (

        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-3 sm:p-5">

          <div className="flex h-[95vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">

              <div className="min-w-0">

                <h2 className="truncate font-semibold text-[#102a56]">
                  {preview.title}
                </h2>

                {preview.class_name && (
                  <p className="text-xs text-slate-500">
                    {preview.class_name}
                  </p>
                )}

              </div>

              <button
                type="button"
                onClick={() =>
                  setPreview(null)
                }
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            <div className="min-h-0 flex-1 bg-slate-100 p-2 sm:p-4">

              {(
                preview.document_url ||
                preview.external_url
              ) ? (

                <iframe
                  src={
                    preview.document_url ||
                    preview.external_url ||
                    ""
                  }
                  title={
                    preview.title
                  }
                  className="h-full w-full rounded-xl border border-slate-200 bg-white"
                />

              ) : (

                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  No PDF available.
                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}