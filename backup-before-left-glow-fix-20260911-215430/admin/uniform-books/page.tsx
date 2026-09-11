"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Edit3,
  Eye,
  EyeOff,
  ExternalLink,
  FileText,
  RefreshCw,
  Save,
  Shirt,
  Trash2,
  Upload,
  X,
  BookOpen,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type AcademicDocument = {
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
};

type FormState = {
  title: string;
  description: string;
  externalUrl: string;
};

const BUCKET = "academic-resources";

export default function UniformBooksAdminPage() {
  const [documents, setDocuments] = useState<
    AcademicDocument[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editing, setEditing] =
    useState<AcademicDocument | null>(null);

  const [form, setForm] =
    useState<FormState>({
      title: "",
      description: "",
      externalUrl: "",
    });

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const fileRef =
    useRef<HTMLInputElement | null>(null);

  async function loadDocuments() {
    setLoading(true);
    setError("");

    const { data, error: loadError } =
      await supabase
        .from("academic_documents")
        .select(`
          id,
          title,
          class_name,
          category,
          description,
          document_url,
          external_url,
          document_label,
          sort_order,
          is_active
        `)
        .eq(
          "category",
          "uniform-books"
        )
        .order("sort_order", {
          ascending: true,
        });

    if (loadError) {
      setError(
        loadError.message
      );
      setDocuments([]);
    } else {
      setDocuments(
        (data || []) as AcademicDocument[]
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  function startEdit(
    document: AcademicDocument
  ) {
    setMessage("");
    setError("");

    setEditing(document);

    setForm({
      title:
        document.title || "",

      description:
        document.description || "",

      externalUrl:
        document.external_url || "",
    });

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  function cancelEdit() {
    setEditing(null);

    setForm({
      title: "",
      description: "",
      externalUrl: "",
    });

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  function getStoragePath(
    publicUrl: string | null
  ): string | null {
    if (!publicUrl) return null;

    try {
      const url = new URL(publicUrl);

      const marker =
        "/storage/v1/object/public/academic-resources/";

      const index =
        url.pathname.indexOf(marker);

      if (index === -1) return null;

      return decodeURIComponent(
        url.pathname.slice(
          index + marker.length
        )
      );
    } catch {
      return null;
    }
  }

  async function deleteStorageFile(
    publicUrl: string | null
  ) {
    const path =
      getStoragePath(publicUrl);

    if (!path) return;

    await supabase.storage
      .from(BUCKET)
      .remove([path]);
  }

  async function saveEdit() {
    if (!editing) return;

    setSaving(true);
    setError("");
    setMessage("");

    const file =
      fileRef.current?.files?.[0] ||
      null;

    if (!form.title.trim()) {
      setError(
        "Document title is required."
      );
      setSaving(false);
      return;
    }

    if (file) {
      const isPdf =
        file.type ===
          "application/pdf" ||
        file.name
          .toLowerCase()
          .endsWith(".pdf");

      if (!isPdf) {
        setError(
          "Only PDF files are allowed."
        );
        setSaving(false);
        return;
      }
    }

    let newFileUrl:
      string | null = null;

    let newStoragePath:
      string | null = null;

    try {
      /*
      ========================================
      UPLOAD REPLACEMENT PDF
      ========================================
      */

      if (file) {
        const safeName =
          file.name
            .replace(
              /[^a-zA-Z0-9._-]/g,
              "-"
            )
            .replace(
              /-+/g,
              "-"
            )
            .toLowerCase();

        newStoragePath =
          `uniform-books/${Date.now()}-${safeName}`;

        const { error: uploadError } =
          await supabase.storage
            .from(BUCKET)
            .upload(
              newStoragePath,
              file,
              {
                cacheControl: "3600",
                upsert: false,
                contentType:
                  "application/pdf",
              }
            );

        if (uploadError) {
          throw uploadError;
        }

        const { data } =
          supabase.storage
            .from(BUCKET)
            .getPublicUrl(
              newStoragePath
            );

        newFileUrl =
          data.publicUrl;
      }

      const finalDocumentUrl =
        newFileUrl ||
        editing.document_url ||
        null;

      const finalExternalUrl =
        newFileUrl
          ? null
          : form.externalUrl.trim() ||
            null;

      /*
      ========================================
      UPDATE DATABASE
      ========================================
      */

      const {
        error: updateError,
      } = await supabase
        .from("academic_documents")
        .update({
          title:
            form.title.trim(),

          description:
            form.description.trim() ||
            null,

          document_url:
            finalDocumentUrl,

          external_url:
            finalExternalUrl,

          document_label:
            finalDocumentUrl
              ? "Download PDF"
              : "Open document",

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          editing.id
        );

      if (updateError) {
        if (newStoragePath) {
          await supabase.storage
            .from(BUCKET)
            .remove([
              newStoragePath,
            ]);
        }

        throw updateError;
      }

      /*
      ========================================
      REMOVE OLD PDF
      ========================================
      */

      if (
        newFileUrl &&
        editing.document_url
      ) {
        await deleteStorageFile(
          editing.document_url
        );
      }

      setMessage(
        "Document updated successfully."
      );

      cancelEdit();

      await loadDocuments();
    } catch (err: any) {
      setError(
        err?.message ||
          "Could not update document."
      );
    } finally {
      setSaving(false);
    }
  }

  async function addDocument() {
    setSaving(true);
    setError("");
    setMessage("");

    const file =
      fileRef.current?.files?.[0] ||
      null;

    if (!form.title.trim()) {
      setError(
        "Document title is required."
      );
      setSaving(false);
      return;
    }

    if (!file && !form.externalUrl.trim()) {
      setError(
        "Choose a PDF or enter an external URL."
      );
      setSaving(false);
      return;
    }

    let documentUrl:
      string | null = null;

    let uploadedPath:
      string | null = null;

    try {
      if (file) {
        const safeName =
          file.name
            .replace(
              /[^a-zA-Z0-9._-]/g,
              "-"
            )
            .replace(
              /-+/g,
              "-"
            )
            .toLowerCase();

        uploadedPath =
          `uniform-books/${Date.now()}-${safeName}`;

        const { error: uploadError } =
          await supabase.storage
            .from(BUCKET)
            .upload(
              uploadedPath,
              file,
              {
                cacheControl: "3600",
                upsert: false,
                contentType:
                  "application/pdf",
              }
            );

        if (uploadError) {
          throw uploadError;
        }

        const { data } =
          supabase.storage
            .from(BUCKET)
            .getPublicUrl(
              uploadedPath
            );

        documentUrl =
          data.publicUrl;
      }

      const maxOrder =
        documents.length > 0
          ? Math.max(
              ...documents.map(
                (item) =>
                  item.sort_order
              )
            )
          : 0;

      const {
        error: insertError,
      } = await supabase
        .from("academic_documents")
        .insert({
          title:
            form.title.trim(),

          class_name: null,

          category:
            "uniform-books",

          description:
            form.description.trim() ||
            null,

          document_url:
            documentUrl,

          external_url:
            form.externalUrl.trim() ||
            null,

          document_label:
            documentUrl
              ? "Download PDF"
              : "Open document",

          sort_order:
            maxOrder + 1,

          is_active: true,

          updated_at:
            new Date().toISOString(),
        });

      if (insertError) {
        if (uploadedPath) {
          await supabase.storage
            .from(BUCKET)
            .remove([
              uploadedPath,
            ]);
        }

        throw insertError;
      }

      setMessage(
        "Document added successfully."
      );

      setForm({
        title: "",
        description: "",
        externalUrl: "",
      });

      if (fileRef.current) {
        fileRef.current.value = "";
      }

      await loadDocuments();
    } catch (err: any) {
      setError(
        err?.message ||
          "Could not add document."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(
    document: AcademicDocument
  ) {
    const { error: updateError } =
      await supabase
        .from("academic_documents")
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

    if (updateError) {
      setError(
        updateError.message
      );
      return;
    }

    await loadDocuments();
  }

  async function deleteDocument(
    document: AcademicDocument
  ) {
    const confirmed =
      window.confirm(
        `Delete "${document.title}"?`
      );

    if (!confirmed) return;

    setSaving(true);
    setError("");

    try {
      const {
        error: deleteError,
      } = await supabase
        .from("academic_documents")
        .delete()
        .eq(
          "id",
          document.id
        );

      if (deleteError) {
        throw deleteError;
      }

      if (document.document_url) {
        await deleteStorageFile(
          document.document_url
        );
      }

      setMessage(
        "Document deleted successfully."
      );

      await loadDocuments();
    } catch (err: any) {
      setError(
        err?.message ||
          "Could not delete document."
      );
    } finally {
      setSaving(false);
    }
  }

  async function moveDocument(
    document: AcademicDocument,
    direction: "up" | "down"
  ) {
    const index =
      documents.findIndex(
        (item) =>
          item.id === document.id
      );

    if (index === -1) return;

    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >=
        documents.length
    ) {
      return;
    }

    const target =
      documents[targetIndex];

    const oldOrder =
      document.sort_order;

    const newOrder =
      target.sort_order;

    const now =
      new Date().toISOString();

    const firstUpdate =
      await supabase
        .from("academic_documents")
        .update({
          sort_order:
            newOrder,
          updated_at:
            now,
        })
        .eq(
          "id",
          document.id
        );

    if (firstUpdate.error) {
      setError(
        firstUpdate.error.message
      );
      return;
    }

    const secondUpdate =
      await supabase
        .from("academic_documents")
        .update({
          sort_order:
            oldOrder,
          updated_at:
            now,
        })
        .eq(
          "id",
          target.id
        );

    if (secondUpdate.error) {
      setError(
        secondUpdate.error.message
      );
      return;
    }

    await loadDocuments();
  }

  return (
    <main className="min-h-screen bg-[#F4F1EA] px-5 py-8 text-[#10203A] md:px-8">

      <div className="mx-auto max-w-[1500px]">

        {/* HEADER */}

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#102A56]/35">
              Apex CMS
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#102A56] md:text-4xl">
              Uniform &amp; Books
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#10203A]/50">
              Manage the school's book list and uniform
              documents.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDocuments}
            className="inline-flex items-center gap-2 rounded-full border border-[#102A56]/10 bg-white px-4 py-3 text-sm font-medium text-[#102A56]"
          >
            <RefreshCw
              size={15}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

        </div>

        {/* MESSAGES */}

        {message && (
          <div className="mt-6 flex items-center gap-2 rounded-2xl bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
            <Check size={16} />
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ADD / EDIT PANEL */}

        <section className="mt-8 rounded-[2rem] bg-white p-6 md:p-8">

          <div className="flex items-start gap-4">

            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#102A56] text-white">
              {editing ? (
                <Edit3 size={18} />
              ) : (
                <Upload size={18} />
              )}
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#102A56]/35">
                {editing
                  ? "Edit document"
                  : "Add document"}
              </p>

              <h2 className="mt-2 text-xl font-semibold text-[#102A56]">
                {editing
                  ? editing.title
                  : "Uniform & books document"}
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#10203A]/45">
                {editing
                  ? "Change the information or replace the current PDF."
                  : "Upload a PDF or link to an external document."}
              </p>
            </div>

          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2">

            <div>
              <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40">
                Title
              </label>

              <input
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title:
                      e.target.value,
                  })
                }
                placeholder="Book List 2026–2027"
                className="mt-3 w-full rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3.5 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40">
                External URL
              </label>

              <input
                value={
                  form.externalUrl
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    externalUrl:
                      e.target.value,
                  })
                }
                placeholder="https://..."
                className="mt-3 w-full rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3.5 text-sm outline-none"
              />
            </div>

          </div>

          <div className="mt-5">
            <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40">
              Description
            </label>

            <textarea
              value={
                form.description
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value,
                })
              }
              rows={3}
              placeholder="Optional description..."
              className="mt-3 w-full resize-none rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3.5 text-sm outline-none"
            />
          </div>

          <div className="mt-5">

            <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40">
              {editing
                ? "Replace PDF"
                : "PDF file"}
            </label>

            <div className="mt-3 rounded-2xl border border-dashed border-[#102A56]/15 bg-[#F8F6F1] p-4">

              <input
                ref={fileRef}
                type="file"
                accept="application/pdf,.pdf"
                className="
                  block
                  w-full
                  text-sm
                  text-[#10203A]/60
                  file:mr-4
                  file:rounded-full
                  file:border-0
                  file:bg-[#102A56]
                  file:px-4
                  file:py-2.5
                  file:text-xs
                  file:font-semibold
                  file:text-white
                "
              />

              <p className="mt-3 text-xs leading-5 text-[#10203A]/40">
                {editing
                  ? "Leave empty to keep the current PDF. Choose another PDF to replace it."
                  : "The PDF will be uploaded to Supabase Storage."}
              </p>

            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">

            <button
              type="button"
              onClick={
                editing
                  ? saveEdit
                  : addDocument
              }
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-[#102A56] px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw
                  size={15}
                  className="animate-spin"
                />
              ) : editing ? (
                <Save size={15} />
              ) : (
                <Upload size={15} />
              )}

              {saving
                ? "Saving..."
                : editing
                  ? "Save changes"
                  : "Add document"}
            </button>

            {editing && (
              <button
                type="button"
                onClick={cancelEdit}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full border border-[#102A56]/10 bg-white px-6 py-3.5 text-sm font-semibold text-[#102A56]"
              >
                <X size={15} />
                Cancel
              </button>
            )}

          </div>

        </section>

        {/* DOCUMENTS */}

        <section className="mt-8">

          <div className="mb-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#102A56]/35">
              Published resources
            </p>

            <p className="mt-2 text-sm text-[#10203A]/45">
              {documents.length} document
              {documents.length === 1
                ? ""
                : "s"}
            </p>
          </div>

          {loading ? (
            <div className="rounded-[2rem] bg-white py-24 text-center text-sm text-[#10203A]/40">
              Loading documents...
            </div>
          ) : documents.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-[#102A56]/15 bg-white py-24 text-center">
              <FileText
                size={30}
                className="mx-auto text-[#102A56]/25"
              />

              <p className="mt-5 text-sm text-[#10203A]/45">
                No uniform or book documents found.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {documents.map(
                (document) => {

                  const isBook =
                    document.title
                      .toLowerCase()
                      .includes("book");

                  return (
                    <article
                      key={document.id}
                      className="rounded-[2rem] border border-[#102A56]/10 bg-white p-5 md:p-6"
                    >

                      <div className="flex flex-col gap-5 md:flex-row md:items-center">

                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#102A56] text-white">
                          {isBook ? (
                            <BookOpen size={18} />
                          ) : (
                            <Shirt size={18} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <span className="rounded-full bg-[#102A56]/5 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#102A56]/55">
                              {isBook
                                ? "Book List"
                                : "Uniform"}
                            </span>

                            {!document.is_active && (
                              <span className="rounded-full bg-red-50 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-red-500">
                                Hidden
                              </span>
                            )}

                          </div>

                          <h3 className="mt-3 text-lg font-semibold text-[#102A56]">
                            {document.title}
                          </h3>

                          {document.description && (
                            <p className="mt-2 text-sm leading-6 text-[#10203A]/45">
                              {document.description}
                            </p>
                          )}

                        </div>

                        <div className="flex flex-wrap items-center gap-2">

                          {(document.document_url ||
                            document.external_url) && (
                            <a
                              href={
                                document.document_url ||
                                document.external_url ||
                                "#"
                              }
                              target="_blank"
                              rel="noreferrer"
                              title="Open document"
                              className="grid h-9 w-9 place-items-center rounded-xl border border-[#102A56]/10 text-[#102A56]"
                            >
                              <ExternalLink
                                size={14}
                              />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              startEdit(
                                document
                              )
                            }
                            className="grid h-9 w-9 place-items-center rounded-xl border border-[#102A56]/10 text-[#102A56]"
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              moveDocument(
                                document,
                                "up"
                              )
                            }
                            className="grid h-9 w-9 place-items-center rounded-xl border border-[#102A56]/10 text-[#102A56]"
                            title="Move up"
                          >
                            <ArrowUp
                              size={14}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              moveDocument(
                                document,
                                "down"
                              )
                            }
                            className="grid h-9 w-9 place-items-center rounded-xl border border-[#102A56]/10 text-[#102A56]"
                            title="Move down"
                          >
                            <ArrowDown
                              size={14}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              toggleActive(
                                document
                              )
                            }
                            className="grid h-9 w-9 place-items-center rounded-xl border border-[#102A56]/10 text-[#102A56]"
                            title={
                              document.is_active
                                ? "Hide"
                                : "Show"
                            }
                          >
                            {document.is_active ? (
                              <Eye size={14} />
                            ) : (
                              <EyeOff
                                size={14}
                              />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteDocument(
                                document
                              )
                            }
                            className="grid h-9 w-9 place-items-center rounded-xl border border-red-500/10 text-red-500"
                            title="Delete"
                          >
                            <Trash2
                              size={14}
                            />
                          </button>

                        </div>

                      </div>

                    </article>
                  );
                }
              )}

            </div>
          )}

        </section>

      </div>

    </main>
  );
}