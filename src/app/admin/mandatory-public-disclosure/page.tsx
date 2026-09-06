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
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type DisclosureDocument = {
  id: string;
  description: string | null;
  document_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

type FormState = {
  description: string;
  documentUrl: string;
};

const BUCKET = "academic-resources";

const EMPTY_FORM: FormState = {
  description: "",
  documentUrl: "",
};

export default function MandatoryPublicDisclosureAdminPage() {
  const [documents, setDocuments] = useState<DisclosureDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [editing, setEditing] =
    useState<DisclosureDocument | null>(null);

  const [form, setForm] =
    useState<FormState>(EMPTY_FORM);

  const [selectedFileName, setSelectedFileName] =
    useState("");

  const addFileRef =
    useRef<HTMLInputElement | null>(null);

  const editFileRef =
    useRef<HTMLInputElement | null>(null);

  function clearMessages() {
    setMessage("");
    setError("");
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setSelectedFileName("");

    if (addFileRef.current) {
      addFileRef.current.value = "";
    }

    if (editFileRef.current) {
      editFileRef.current.value = "";
    }
  }

  function getStoragePath(publicUrl: string | null) {
    if (!publicUrl) return null;

    try {
      const url = new URL(publicUrl);

      const marker =
        `/storage/v1/object/public/${BUCKET}/`;

      const index =
        url.pathname.indexOf(marker);

      if (index === -1) {
        return null;
      }

      return decodeURIComponent(
        url.pathname.slice(
          index + marker.length
        )
      );
    } catch {
      return null;
    }
  }

  async function removeStorageFile(
    publicUrl: string | null
  ) {
    const path = getStoragePath(publicUrl);

    if (!path) return;

    await supabase.storage
      .from(BUCKET)
      .remove([path]);
  }

  function validatePdf(file: File | null) {
    if (!file) return true;

    const valid =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!valid) {
      setError("Only PDF files are allowed.");
      return false;
    }

    return true;
  }

  // =========================================================
  // LOAD DOCUMENTS
  // =========================================================

  async function loadDocuments() {
    setLoading(true);
    clearMessages();

    const { data, error: loadError } =
      await supabase
        .from("mandatory_public_disclosures")
        .select(
          `
            id,
            description,
            document_url,
            is_active,
            sort_order,
            created_at,
            updated_at
          `
        )
        .order("sort_order", {
          ascending: true,
        });

    if (loadError) {
      setDocuments([]);
      setError(loadError.message);
    } else {
      setDocuments(
        (data || []) as DisclosureDocument[]
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  // =========================================================
  // ADD DOCUMENT
  // =========================================================

  async function addDocument() {
    clearMessages();

    if (!form.description.trim()) {
      setError(
        "Please enter a document description."
      );
      return;
    }

    const file =
      addFileRef.current?.files?.[0] || null;

    if (!file && !form.documentUrl.trim()) {
      setError(
        "Please upload a PDF or enter a document URL."
      );
      return;
    }

    if (!validatePdf(file)) {
      return;
    }

    setSaving(true);

    let uploadedPath: string | null = null;
    let finalDocumentUrl =
      form.documentUrl.trim() || null;

    try {
      // -----------------------------------------------------
      // UPLOAD PDF
      // -----------------------------------------------------

      if (file) {
        const safeName = file.name
          .replace(/[^a-zA-Z0-9._-]/g, "-")
          .replace(/-+/g, "-")
          .toLowerCase();

        uploadedPath =
          `mandatory-disclosure/${Date.now()}-${safeName}`;

        const { error: uploadError } =
          await supabase.storage
            .from(BUCKET)
            .upload(
              uploadedPath,
              file,
              {
                cacheControl: "3600",
                upsert: false,
                contentType: "application/pdf",
              }
            );

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicData } =
          supabase.storage
            .from(BUCKET)
            .getPublicUrl(uploadedPath);

        finalDocumentUrl =
          publicData.publicUrl;
      }

      // -----------------------------------------------------
      // SORT ORDER
      // -----------------------------------------------------

      const maxOrder =
        documents.length > 0
          ? Math.max(
              ...documents.map(
                (item) => item.sort_order || 0
              )
            )
          : 0;

      // -----------------------------------------------------
      // INSERT INTO CORRECT TABLE
      // -----------------------------------------------------

      const { error: insertError } =
        await supabase
          .from("mandatory_public_disclosures")
          .insert({
            description:
              form.description.trim(),

            document_url:
              finalDocumentUrl,

            is_active: true,

            sort_order:
              maxOrder + 1,

            updated_at:
              new Date().toISOString(),
          });

      if (insertError) {
        if (uploadedPath) {
          await supabase.storage
            .from(BUCKET)
            .remove([uploadedPath]);
        }

        throw insertError;
      }

      setMessage(
        "Mandatory disclosure added successfully."
      );

      resetForm();

      await loadDocuments();
    } catch (err: any) {
      setError(
        err?.message ||
          "Could not add mandatory disclosure."
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // START EDIT
  // =========================================================

  function startEdit(
    document: DisclosureDocument
  ) {
    clearMessages();

    setEditing(document);

    setForm({
      description:
        document.description || "",

      documentUrl:
        document.document_url || "",
    });

    setSelectedFileName("");

    if (editFileRef.current) {
      editFileRef.current.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================================================
  // CANCEL EDIT
  // =========================================================

  function cancelEdit() {
    setEditing(null);
    resetForm();
    clearMessages();
  }

  // =========================================================
  // SAVE EDIT
  // =========================================================

  async function saveEdit() {
    if (!editing) return;

    clearMessages();

    if (!form.description.trim()) {
      setError(
        "Please enter a document description."
      );
      return;
    }

    const replacementFile =
      editFileRef.current?.files?.[0] || null;

    if (!validatePdf(replacementFile)) {
      return;
    }

    setSaving(true);

    let replacementPath: string | null = null;
    let replacementUrl: string | null = null;

    try {
      // -----------------------------------------------------
      // UPLOAD REPLACEMENT PDF
      // -----------------------------------------------------

      if (replacementFile) {
        const safeName =
          replacementFile.name
            .replace(
              /[^a-zA-Z0-9._-]/g,
              "-"
            )
            .replace(/-+/g, "-")
            .toLowerCase();

        replacementPath =
          `mandatory-disclosure/${Date.now()}-${safeName}`;

        const { error: uploadError } =
          await supabase.storage
            .from(BUCKET)
            .upload(
              replacementPath,
              replacementFile,
              {
                cacheControl: "3600",
                upsert: false,
                contentType: "application/pdf",
              }
            );

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicData } =
          supabase.storage
            .from(BUCKET)
            .getPublicUrl(
              replacementPath
            );

        replacementUrl =
          publicData.publicUrl;
      }

      const finalDocumentUrl =
        replacementUrl ||
        editing.document_url ||
        form.documentUrl.trim() ||
        null;

      // -----------------------------------------------------
      // UPDATE CORRECT TABLE
      // -----------------------------------------------------

      const { error: updateError } =
        await supabase
          .from("mandatory_public_disclosures")
          .update({
            description:
              form.description.trim(),

            document_url:
              finalDocumentUrl,

            updated_at:
              new Date().toISOString(),
          })
          .eq("id", editing.id);

      if (updateError) {
        if (replacementPath) {
          await supabase.storage
            .from(BUCKET)
            .remove([replacementPath]);
        }

        throw updateError;
      }

      // -----------------------------------------------------
      // DELETE OLD PDF
      // -----------------------------------------------------

      if (
        replacementUrl &&
        editing.document_url
      ) {
        await removeStorageFile(
          editing.document_url
        );
      }

      setMessage(
        "Mandatory disclosure updated successfully."
      );

      setEditing(null);
      resetForm();

      await loadDocuments();
    } catch (err: any) {
      setError(
        err?.message ||
          "Could not update mandatory disclosure."
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // TOGGLE ACTIVE
  // =========================================================

  async function toggleActive(
    document: DisclosureDocument
  ) {
    clearMessages();

    const { error: updateError } =
      await supabase
        .from("mandatory_public_disclosures")
        .update({
          is_active:
            !document.is_active,

          updated_at:
            new Date().toISOString(),
        })
        .eq("id", document.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage(
      document.is_active
        ? "Disclosure hidden from the website."
        : "Disclosure published on the website."
    );

    await loadDocuments();
  }

  // =========================================================
  // DELETE
  // =========================================================

  async function deleteDocument(
    document: DisclosureDocument
  ) {
    clearMessages();

    const confirmed =
      window.confirm(
        `Delete "${document.description}"?\n\nThis will delete the database record and uploaded PDF when applicable.`
      );

    if (!confirmed) {
      return;
    }

    setSaving(true);

    try {
      const { error: deleteError } =
        await supabase
          .from("mandatory_public_disclosures")
          .delete()
          .eq("id", document.id);

      if (deleteError) {
        throw deleteError;
      }

      if (document.document_url) {
        await removeStorageFile(
          document.document_url
        );
      }

      if (
        editing?.id === document.id
      ) {
        setEditing(null);
        resetForm();
      }

      setMessage(
        "Mandatory disclosure deleted successfully."
      );

      await loadDocuments();
    } catch (err: any) {
      setError(
        err?.message ||
          "Could not delete mandatory disclosure."
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // MOVE DOCUMENT
  // =========================================================

  async function moveDocument(
    document: DisclosureDocument,
    direction: "up" | "down"
  ) {
    clearMessages();

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
      targetIndex >= documents.length
    ) {
      return;
    }

    const target =
      documents[targetIndex];

    const oldOrder =
      document.sort_order;

    const newOrder =
      target.sort_order;

    const timestamp =
      new Date().toISOString();

    // -------------------------------------------------------
    // UPDATE FIRST
    // -------------------------------------------------------

    const firstUpdate =
      await supabase
        .from(
          "mandatory_public_disclosures"
        )
        .update({
          sort_order: newOrder,
          updated_at: timestamp,
        })
        .eq("id", document.id);

    if (firstUpdate.error) {
      setError(
        firstUpdate.error.message
      );
      return;
    }

    // -------------------------------------------------------
    // UPDATE SECOND
    // -------------------------------------------------------

    const secondUpdate =
      await supabase
        .from(
          "mandatory_public_disclosures"
        )
        .update({
          sort_order: oldOrder,
          updated_at: timestamp,
        })
        .eq("id", target.id);

    if (secondUpdate.error) {
      setError(
        secondUpdate.error.message
      );
      return;
    }

    await loadDocuments();
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="min-h-screen bg-[#F4F1EA] px-5 py-8 text-[#10203A] md:px-8">
      <div className="mx-auto max-w-[1500px]">

        {/* HEADER */}

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#102A56] text-white">
                <ShieldCheck size={18} />
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#102A56]/35">
                  Apex CMS
                </p>

                <p className="mt-1 text-[9px] uppercase tracking-[0.22em] text-[#102A56]/25">
                  Compliance
                </p>
              </div>
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[#102A56] md:text-4xl">
              Mandatory Public Disclosure
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#10203A]/50">
              Manage the official CBSE mandatory
              public disclosure document published
              on the Apex Public School website.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDocuments}
            disabled={loading || saving}
            className="inline-flex items-center gap-2 rounded-full border border-[#102A56]/10 bg-white px-4 py-3 text-sm font-medium text-[#102A56] disabled:opacity-50"
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
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
            <Check size={17} />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* FORM */}

        <section
          className={
            editing
              ? "mt-8 rounded-[2rem] bg-[#102A56] p-6 md:p-8"
              : "mt-8 rounded-[2rem] bg-white p-6 md:p-8"
          }
        >
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div className="flex items-start gap-4">

              <div
                className={
                  editing
                    ? "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-white"
                    : "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#102A56] text-white"
                }
              >
                {editing ? (
                  <Edit3 size={18} />
                ) : (
                  <Upload size={18} />
                )}
              </div>

              <div>
                <p
                  className={
                    editing
                      ? "text-[9px] font-semibold uppercase tracking-[0.25em] text-white/45"
                      : "text-[9px] font-semibold uppercase tracking-[0.25em] text-[#102A56]/35"
                  }
                >
                  {editing
                    ? "Editing disclosure"
                    : "Add disclosure"}
                </p>

                <h2
                  className={
                    editing
                      ? "mt-2 text-xl font-semibold text-white"
                      : "mt-2 text-xl font-semibold text-[#102A56]"
                  }
                >
                  {editing
                    ? editing.description
                    : "New mandatory disclosure"}
                </h2>

                <p
                  className={
                    editing
                      ? "mt-1 text-sm leading-6 text-white/50"
                      : "mt-1 text-sm leading-6 text-[#10203A]/45"
                  }
                >
                  {editing
                    ? "Update the disclosure information or replace the PDF."
                    : "Upload the official PDF document for public display."}
                </p>
              </div>
            </div>

            {editing && (
              <button
                type="button"
                onClick={cancelEdit}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
              >
                <X size={15} />
                Cancel
              </button>
            )}
          </div>

          {/* DESCRIPTION */}

          <div className="mt-7">
            <label
              className={
                editing
                  ? "text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45"
                  : "text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40"
              }
            >
              Document description
            </label>

            <input
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value,
                })
              }
              placeholder="Mandatory Public Disclosure 2026-2027"
              className={
                editing
                  ? "mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/20"
                  : "mt-3 w-full rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3.5 text-sm text-[#10203A] outline-none"
              }
            />
          </div>

          {/* URL */}

          <div className="mt-5">
            <label
              className={
                editing
                  ? "text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45"
                  : "text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40"
              }
            >
              Document URL
            </label>

            <input
              value={form.documentUrl}
              onChange={(e) =>
                setForm({
                  ...form,
                  documentUrl:
                    e.target.value,
                })
              }
              placeholder="https://..."
              className={
                editing
                  ? "mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/20"
                  : "mt-3 w-full rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3.5 text-sm text-[#10203A] outline-none"
              }
            />

            <p
              className={
                editing
                  ? "mt-2 text-xs text-white/35"
                  : "mt-2 text-xs text-[#10203A]/40"
              }
            >
              You can use an existing public PDF URL,
              or upload a PDF below.
            </p>
          </div>

          {/* PDF */}

          <div className="mt-5">
            <label
              className={
                editing
                  ? "text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45"
                  : "text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40"
              }
            >
              {editing
                ? "Replace PDF"
                : "Upload PDF"}
            </label>

            <div
              className={
                editing
                  ? "mt-3 rounded-2xl border border-dashed border-white/15 bg-white/5 p-5"
                  : "mt-3 rounded-2xl border border-dashed border-[#102A56]/15 bg-[#F8F6F1] p-5"
              }
            >
              <input
                ref={
                  editing
                    ? editFileRef
                    : addFileRef
                }
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => {
                  const file =
                    e.target.files?.[0] ||
                    null;

                  if (!validatePdf(file)) {
                    e.target.value = "";
                    return;
                  }

                  setSelectedFileName(
                    file?.name || ""
                  );

                  clearMessages();
                }}
                className={
                  editing
                    ? "block w-full text-sm text-white/60 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2.5 file:text-xs file:font-semibold file:!text-[#102A56]"
                    : "block w-full text-sm text-[#10203A]/60 file:mr-4 file:rounded-full file:border-0 file:bg-[#102A56] file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-white"
                }
              />

              {selectedFileName ? (
                <p
                  className={
                    editing
                      ? "mt-3 text-xs text-emerald-200"
                      : "mt-3 text-xs text-emerald-700"
                  }
                >
                  Selected:{" "}
                  <span className="font-semibold">
                    {selectedFileName}
                  </span>
                </p>
              ) : (
                <p
                  className={
                    editing
                      ? "mt-3 text-xs leading-5 text-white/35"
                      : "mt-3 text-xs leading-5 text-[#10203A]/40"
                  }
                >
                  {editing
                    ? "Leave empty to keep the current PDF."
                    : "Select the official PDF to upload it to Supabase Storage."}
                </p>
              )}
            </div>
          </div>

          {/* BUTTON */}

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={
                editing
                  ? saveEdit
                  : addDocument
              }
              disabled={saving}
              className={
                editing
                  ? "inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold !text-[#102A56] disabled:opacity-50"
                  : "inline-flex items-center gap-2 rounded-full bg-[#102A56] px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-50"
              }
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
                  : "Add disclosure"}
            </button>

            {editing && (
              <button
                type="button"
                onClick={cancelEdit}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                <X size={15} />
                Cancel
              </button>
            )}
          </div>
        </section>

        {/* EXISTING DOCUMENTS */}

        <section className="mt-10">

          <div className="mb-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#102A56]/35">
              Existing disclosure documents
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
              Loading disclosure documents...
            </div>
          ) : documents.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-[#102A56]/15 bg-white py-24 text-center">

              <FileText
                size={32}
                className="mx-auto text-[#102A56]/20"
              />

              <p className="mt-5 text-sm text-[#10203A]/45">
                No disclosure documents found.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {documents.map(
                (document, index) => (
                  <article
                    key={document.id}
                    className="rounded-[2rem] border border-[#102A56]/10 bg-white p-5 md:p-6"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center">

                      {/* ICON */}

                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#102A56] text-white">
                        <FileText size={18} />
                      </div>

                      {/* DETAILS */}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="rounded-full bg-[#102A56]/5 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#102A56]/55">
                            #{String(index + 1).padStart(2, "0")}
                          </span>

                          {document.document_url && (
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.17em] text-emerald-700">
                              PDF
                            </span>
                          )}

                          {!document.is_active && (
                            <span className="rounded-full bg-red-50 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.17em] text-red-500">
                              Hidden
                            </span>
                          )}

                          {document.is_active && (
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.17em] text-blue-700">
                              Published
                            </span>
                          )}

                        </div>

                        <h3 className="mt-3 text-lg font-semibold text-[#102A56] md:text-xl">
                          {document.description ||
                            "Mandatory Public Disclosure"}
                        </h3>

                        {document.document_url && (
                          <p className="mt-2 max-w-4xl truncate text-sm text-[#10203A]/40">
                            {document.document_url}
                          </p>
                        )}

                      </div>

                      {/* ACTIONS */}

                      <div className="flex flex-wrap items-center gap-2">

                        {document.document_url && (
                          <a
                            href={
                              document.document_url
                            }
                            target="_blank"
                            rel="noopener noreferrer"
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
                            startEdit(document)
                          }
                          disabled={saving}
                          title="Edit"
                          className="grid h-9 w-9 place-items-center rounded-xl border border-[#102A56]/10 text-[#102A56] disabled:opacity-40"
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
                          disabled={
                            index === 0 ||
                            saving
                          }
                          title="Move up"
                          className="grid h-9 w-9 place-items-center rounded-xl border border-[#102A56]/10 text-[#102A56] disabled:opacity-30"
                        >
                          <ArrowUp size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            moveDocument(
                              document,
                              "down"
                            )
                          }
                          disabled={
                            index ===
                              documents.length -
                                1 ||
                            saving
                          }
                          title="Move down"
                          className="grid h-9 w-9 place-items-center rounded-xl border border-[#102A56]/10 text-[#102A56] disabled:opacity-30"
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
                          disabled={saving}
                          title={
                            document.is_active
                              ? "Hide"
                              : "Publish"
                          }
                          className="grid h-9 w-9 place-items-center rounded-xl border border-[#102A56]/10 text-[#102A56] disabled:opacity-40"
                        >
                          {document.is_active ? (
                            <Eye size={14} />
                          ) : (
                            <EyeOff size={14} />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteDocument(
                              document
                            )
                          }
                          disabled={saving}
                          title="Delete"
                          className="grid h-9 w-9 place-items-center rounded-xl border border-red-500/10 text-red-500 disabled:opacity-40"
                        >
                          <Trash2 size={14} />
                        </button>

                      </div>
                    </div>
                  </article>
                )
              )}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}