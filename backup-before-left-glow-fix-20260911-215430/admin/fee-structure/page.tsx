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

type FeeDocument = {
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
const CATEGORY = "fee-structure";

const EMPTY_FORM: FormState = {
  title: "",
  class_name: "",
  description: "",
  document_url: "",
  external_url: "",
  document_label: "View Fee Structure",
  sort_order: 0,
  is_active: true,
};

export default function AdminFeeStructurePage() {
  const [documents, setDocuments] = useState<FeeDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [preview, setPreview] = useState<FeeDocument | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    setLoading(true);

    const { data, error } = await supabase
      .from("academic_documents")
      .select("*")
      .eq("category", CATEGORY)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      alert(`Unable to load fee documents.\n\n${error.message}`);
      setDocuments([]);
    } else {
      setDocuments((data ?? []) as FeeDocument[]);
    }

    setLoading(false);
  }

  function openAddForm() {
    setEditingId(null);
    setSelectedFile(null);

    setForm({
      ...EMPTY_FORM,
      sort_order: documents.length,
    });

    setShowForm(true);
  }

  function openEditForm(item: FeeDocument) {
    setEditingId(item.id);
    setSelectedFile(null);

    setForm({
      title: item.title ?? "",
      class_name: item.class_name ?? "",
      description: item.description ?? "",
      document_url: item.document_url ?? "",
      external_url: item.external_url ?? "",
      document_label: item.document_label || "View Fee Structure",
      sort_order: item.sort_order ?? 0,
      is_active: item.is_active,
    });

    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setSelectedFile(null);
    setForm(EMPTY_FORM);
  }

  function getDocumentUrl(item: FeeDocument) {
    return item.document_url || item.external_url || "";
  }

  function getStoragePath(url: string | null) {
    if (!url) return null;

    const marker = `/storage/v1/object/public/${BUCKET}/`;

    const index = url.indexOf(marker);

    if (index === -1) return null;

    return decodeURIComponent(
      url.substring(index + marker.length)
    );
  }

  async function uploadPdf(file: File) {
    if (file.type !== "application/pdf") {
      throw new Error("Please upload a PDF file only.");
    }

    const extension = "pdf";

    const path = `${CATEGORY}/${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        upsert: false,
        contentType: "application/pdf",
      });

    if (error) {
      throw new Error(
        `PDF upload failed: ${error.message}`
      );
    }

    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(path);

    return {
      path,
      url: data.publicUrl,
    };
  }

  async function saveDocument(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter the fee document title.");
      return;
    }

    if (
      !selectedFile &&
      !form.document_url.trim() &&
      !form.external_url.trim()
    ) {
      alert(
        "Please upload a PDF or enter an external PDF URL."
      );
      return;
    }

    setSaving(true);

    try {
      let documentUrl = form.document_url.trim();

      let oldStoragePath: string | null = null;

      if (editingId && selectedFile) {
        const existing = documents.find(
          (item) => item.id === editingId
        );

        oldStoragePath = getStoragePath(
          existing?.document_url ?? null
        );
      }

      if (selectedFile) {
        const uploaded = await uploadPdf(selectedFile);
        documentUrl = uploaded.url;
      }

      const dataToSave = {
        title: form.title.trim(),
        class_name: form.class_name.trim() || null,
        category: CATEGORY,
        description: form.description.trim() || null,
        document_url: documentUrl || null,
        external_url: form.external_url.trim() || null,
        document_label:
          form.document_label.trim() ||
          "View Fee Structure",
        sort_order: Number(form.sort_order) || 0,
        is_active: form.is_active,
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        const { error } = await supabase
          .from("academic_documents")
          .update(dataToSave)
          .eq("id", editingId);

        if (error) {
          throw new Error(error.message);
        }

        if (selectedFile && oldStoragePath) {
          const { error: deleteError } =
            await supabase.storage
              .from(BUCKET)
              .remove([oldStoragePath]);

          if (deleteError) {
            console.warn(
              "Old PDF could not be deleted:",
              deleteError.message
            );
          }
        }
      } else {
        const { error } = await supabase
          .from("academic_documents")
          .insert(dataToSave);

        if (error) {
          throw new Error(error.message);
        }
      }

      closeForm();
      await loadDocuments();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the fee document."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisibility(item: FeeDocument) {
    setBusyId(item.id);

    const { error } = await supabase
      .from("academic_documents")
      .update({
        is_active: !item.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id);

    if (error) {
      alert(
        `Could not update document visibility.\n\n${error.message}`
      );
    } else {
      await loadDocuments();
    }

    setBusyId(null);
  }

  async function moveDocument(
    id: string,
    direction: "up" | "down"
  ) {
    const index = documents.findIndex(
      (item) => item.id === id
    );

    if (index === -1) return;

    const newIndex =
      direction === "up" ? index - 1 : index + 1;

    if (
      newIndex < 0 ||
      newIndex >= documents.length
    ) {
      return;
    }

    const current = documents[index];
    const other = documents[newIndex];

    const currentOrder = current.sort_order;
    const otherOrder = other.sort_order;

    setBusyId(id);

    const first = await supabase
      .from("academic_documents")
      .update({
        sort_order: otherOrder,
        updated_at: new Date().toISOString(),
      })
      .eq("id", current.id);

    if (first.error) {
      alert(first.error.message);
      setBusyId(null);
      return;
    }

    const second = await supabase
      .from("academic_documents")
      .update({
        sort_order: currentOrder,
        updated_at: new Date().toISOString(),
      })
      .eq("id", other.id);

    if (second.error) {
      alert(second.error.message);
      setBusyId(null);
      return;
    }

    await loadDocuments();
    setBusyId(null);
  }

  async function deleteDocument(item: FeeDocument) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.title}"?`
    );

    if (!confirmed) return;

    setBusyId(item.id);

    try {
      const storagePath = getStoragePath(
        item.document_url
      );

      if (storagePath) {
        const { error: storageError } =
          await supabase.storage
            .from(BUCKET)
            .remove([storagePath]);

        if (storageError) {
          console.warn(
            "Storage file delete warning:",
            storageError.message
          );
        }
      }

      const { error } = await supabase
        .from("academic_documents")
        .delete()
        .eq("id", item.id);

      if (error) {
        throw new Error(error.message);
      }

      await loadDocuments();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Could not delete the fee document."
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f5f2] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* PAGE HEADER */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#102a56]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#102a56]">
              <FileText className="h-3.5 w-3.5" />
              School Documents
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-[#102a56] sm:text-4xl">
              Fee Structure
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Upload and manage the fee structure documents
              displayed on the public Apex Public School website.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#102a56] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0c2145]"
          >
            <Plus className="h-4 w-4" />
            Add Fee Document
          </button>
        </div>

        {/* DOCUMENT LIST */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-[#102a56]">
              Fee Structure Documents
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Visible documents appear automatically on the
              public Fee Structure page.
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-[#102a56]" />
            </div>
          ) : documents.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 rounded-2xl bg-[#102a56]/10 p-4">
                <FileText className="h-8 w-8 text-[#102a56]" />
              </div>

              <h3 className="text-lg font-semibold text-slate-900">
                No fee documents added
              </h3>

              <p className="mt-2 max-w-md text-sm text-slate-500">
                Add your official fee structure PDF to publish
                it on the website.
              </p>

              <button
                type="button"
                onClick={openAddForm}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#102a56] px-4 py-2.5 text-sm font-semibold text-white"
              >
                <Plus className="h-4 w-4" />
                Add Document
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {documents.map((item, index) => (
                <div
                  key={item.id}
                  className="p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            item.is_active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {item.is_active ? (
                            <>
                              <Check className="h-3 w-3" />
                              Visible
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3" />
                              Hidden
                            </>
                          )}
                        </span>

                        {item.class_name ? (
                          <span className="rounded-full bg-[#102a56]/10 px-2.5 py-1 text-xs font-semibold text-[#102a56]">
                            {item.class_name}
                          </span>
                        ) : null}
                      </div>

                      <h3 className="mt-3 text-lg font-semibold text-slate-900">
                        {item.title}
                      </h3>

                      {item.description ? (
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {item.description}
                        </p>
                      ) : null}

                      <p className="mt-2 text-xs text-slate-400">
                        Position {index + 1}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">

                      {/* UP */}
                      <button
                        type="button"
                        title="Move up"
                        disabled={
                          index === 0 ||
                          busyId === item.id
                        }
                        onClick={() =>
                          moveDocument(item.id, "up")
                        }
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>

                      {/* DOWN */}
                      <button
                        type="button"
                        title="Move down"
                        disabled={
                          index === documents.length - 1 ||
                          busyId === item.id
                        }
                        onClick={() =>
                          moveDocument(item.id, "down")
                        }
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>

                      {/* PREVIEW */}
                      <button
                        type="button"
                        onClick={() => setPreview(item)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </button>

                      {/* VISIBILITY */}
                      <button
                        type="button"
                        disabled={busyId === item.id}
                        onClick={() =>
                          toggleVisibility(item)
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      >
                        {item.is_active ? (
                          <>
                            <EyeOff className="h-4 w-4" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" />
                            Show
                          </>
                        )}
                      </button>

                      {/* EDIT */}
                      <button
                        type="button"
                        onClick={() => openEditForm(item)}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#102a56] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0c2145]"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>

                      {/* DELETE */}
                      <button
                        type="button"
                        disabled={busyId === item.id}
                        onClick={() => deleteDocument(item)}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4">
          <div className="mx-auto my-6 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-[#102a56]">
                  {editingId
                    ? "Edit Fee Structure"
                    : "Add Fee Structure"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Upload the official fee structure PDF.
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

            <form onSubmit={saveDocument}>
              <div className="space-y-5 p-5 sm:p-6">

                {/* TITLE */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Title *
                  </label>

                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        title: e.target.value,
                      })
                    }
                    placeholder="Fee Structure 2026–2027"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#102a56] focus:ring-2 focus:ring-[#102a56]/10"
                  />
                </div>

                {/* CLASS */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Class / Session
                  </label>

                  <input
                    type="text"
                    value={form.class_name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        class_name: e.target.value,
                      })
                    }
                    placeholder="I TO XII 2026-27"
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
                        description: e.target.value,
                      })
                    }
                    placeholder="Fee Structure 2026–2027 for Classes I to XII."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#102a56] focus:ring-2 focus:ring-[#102a56]/10"
                  />
                </div>

                {/* FILE */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Upload PDF
                  </label>

                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center hover:bg-slate-100">
                    <div className="mb-3 rounded-full bg-[#102a56]/10 p-3">
                      <Upload className="h-6 w-6 text-[#102a56]" />
                    </div>

                    <span className="text-sm font-semibold text-slate-800">
                      {selectedFile
                        ? selectedFile.name
                        : "Choose PDF"}
                    </span>

                    <span className="mt-1 text-xs text-slate-500">
                      PDF files only
                    </span>

                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file =
                          e.target.files?.[0] ?? null;

                        if (file) {
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

                          setSelectedFile(file);
                        }
                      }}
                    />
                  </label>

                  {form.document_url && !selectedFile ? (
                    <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
                      Existing PDF is already uploaded.
                      Choose a new PDF above to replace it.
                    </div>
                  ) : null}
                </div>

                {/* EXTERNAL URL */}
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
                        external_url: e.target.value,
                      })
                    }
                    placeholder="https://example.com/file.pdf"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#102a56] focus:ring-2 focus:ring-[#102a56]/10"
                  />

                  <p className="mt-1 text-xs text-slate-500">
                    Use this only if the PDF is hosted somewhere
                    else.
                  </p>
                </div>

                {/* BUTTON */}
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
                        document_label: e.target.value,
                      })
                    }
                    placeholder="View Fee Structure"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#102a56] focus:ring-2 focus:ring-[#102a56]/10"
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
                          Number(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#102a56] focus:ring-2 focus:ring-[#102a56]/10"
                  />
                </div>

                {/* ACTIVE */}
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        is_active: e.target.checked,
                      })
                    }
                    className="mt-1 h-4 w-4"
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Show on public website
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Turn this off to save the document in Admin
                      without publishing it.
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
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {editingId
                        ? "Save Changes"
                        : "Add Document"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW */}
      {preview && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-3 sm:p-5">
          <div className="flex h-[95vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white">

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

              <div className="flex items-center gap-2">
                {(preview.document_url ||
                  preview.external_url) && (
                  <a
                    href={getDocumentUrl(preview)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#102a56] px-3 py-2 text-xs font-semibold text-white"
                  >
                    <Download className="h-4 w-4" />
                    Open PDF
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 bg-slate-100 p-2 sm:p-4">
              {getDocumentUrl(preview) ? (
                <iframe
                  src={getDocumentUrl(preview)}
                  title={preview.title}
                  className="h-full w-full rounded-xl border border-slate-200 bg-white"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-slate-500">
                    No PDF available.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}