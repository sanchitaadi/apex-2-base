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
  Trash2,
  Upload,
  X,
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
  className: string;
  category: string;
  description: string;
  externalUrl: string;
};

const categories = [
  {
    value: "half-yearly",
    label: "Half-Yearly Syllabus",
  },
  {
    value: "annual",
    label: "Annual Syllabus",
  },
  {
    value: "datesheet",
    label: "Datesheet",
  },
  {
    value: "other",
    label: "Other Academic Document",
  },
];

const emptyForm: FormState = {
  title: "",
  className: "",
  category: "half-yearly",
  description: "",
  externalUrl: "",
};

const BUCKET = "academic-resources";

export default function AcademicResourcesAdminPage() {
  const [documents, setDocuments] = useState<AcademicDocument[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormState>(emptyForm);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [editingDocument, setEditingDocument] =
    useState<AcademicDocument | null>(null);

  const [editFileName, setEditFileName] = useState("");

  const addFileRef = useRef<HTMLInputElement | null>(null);
  const editFileRef = useRef<HTMLInputElement | null>(null);

  /*
  ============================================================
  HELPERS
  ============================================================
  */

  function clearMessages() {
    setMessage("");
    setError("");
  }

  function categoryLabel(value: string) {
    return (
      categories.find((item) => item.value === value)?.label || value
    );
  }

  function updateForm(
    key: keyof FormState,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function getStoragePathFromPublicUrl(
    publicUrl: string | null
  ): string | null {
    if (!publicUrl) return null;

    try {
      const url = new URL(publicUrl);

      const marker =
        "/storage/v1/object/public/academic-resources/";

      const index = url.pathname.indexOf(marker);

      if (index === -1) return null;

      return decodeURIComponent(
        url.pathname.slice(index + marker.length)
      );
    } catch {
      return null;
    }
  }

  async function removeStorageFileFromUrl(
    publicUrl: string | null
  ) {
    const path = getStoragePathFromPublicUrl(publicUrl);

    if (!path) return;

    await supabase.storage.from(BUCKET).remove([path]);
  }

  function resetAddForm() {
    setForm(emptyForm);

    if (addFileRef.current) {
      addFileRef.current.value = "";
    }
  }

  /*
  ============================================================
  LOAD DOCUMENTS
  ============================================================
  */

  async function loadDocuments() {
    setLoading(true);
    setError("");

    const { data, error: loadError } = await supabase
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
      .order("category", {
        ascending: true,
      })
      .order("sort_order", {
        ascending: true,
      });

    if (loadError) {
      setError(loadError.message);
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

  /*
  ============================================================
  ADD DOCUMENT
  ============================================================
  */

  async function addDocument() {
    clearMessages();

    if (!form.title.trim()) {
      setError("Please enter a document title.");
      return;
    }

    const file =
      addFileRef.current?.files?.[0] || null;

    if (!file && !form.externalUrl.trim()) {
      setError(
        "Please upload a PDF or enter an external URL."
      );
      return;
    }

    if (file) {
      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

      if (!isPdf) {
        setError("Only PDF files are allowed.");
        return;
      }
    }

    setSaving(true);

    let uploadedPath: string | null = null;
    let documentUrl: string | null = null;

    try {
      /*
      ----------------------------------------------------------
      UPLOAD PDF
      ----------------------------------------------------------
      */

      if (file) {
        const safeName = file.name
          .replace(
            /[^a-zA-Z0-9._-]/g,
            "-"
          )
          .replace(
            /-+/g,
            "-"
          )
          .toLowerCase();

        const storagePath =
          `documents/${Date.now()}-${safeName}`;

        const { error: uploadError } =
          await supabase.storage
            .from(BUCKET)
            .upload(
              storagePath,
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

        uploadedPath = storagePath;

        const { data: publicData } =
          supabase.storage
            .from(BUCKET)
            .getPublicUrl(storagePath);

        documentUrl =
          publicData.publicUrl;
      }

      /*
      ----------------------------------------------------------
      SORT ORDER
      ----------------------------------------------------------
      */

      const categoryDocuments =
        documents.filter(
          (item) =>
            item.category === form.category
        );

      const maxOrder =
        categoryDocuments.length > 0
          ? Math.max(
              ...categoryDocuments.map(
                (item) => item.sort_order
              )
            )
          : 0;

      /*
      ----------------------------------------------------------
      INSERT DATABASE RECORD
      ----------------------------------------------------------
      */

      const { error: insertError } =
        await supabase
          .from("academic_documents")
          .insert({
            title: form.title.trim(),

            class_name:
              form.className.trim() || null,

            category:
              form.category,

            description:
              form.description.trim() || null,

            document_url:
              documentUrl,

            external_url:
              form.externalUrl.trim() || null,

            document_label:
              file
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
            .remove([uploadedPath]);
        }

        throw insertError;
      }

      resetAddForm();

      setMessage(
        "Academic document added successfully."
      );

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

  /*
  ============================================================
  START EDITING
  ============================================================
  */

  function startEditing(
    document: AcademicDocument
  ) {
    clearMessages();

    setEditingId(document.id);
    setEditingDocument(document);

    setForm({
      title:
        document.title || "",

      className:
        document.class_name || "",

      category:
        document.category || "half-yearly",

      description:
        document.description || "",

      externalUrl:
        document.external_url || "",
    });

    setEditFileName("");

    if (editFileRef.current) {
      editFileRef.current.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /*
  ============================================================
  CANCEL EDITING
  ============================================================
  */

  function cancelEditing() {
    setEditingId(null);
    setEditingDocument(null);

    setEditFileName("");

    resetAddForm();

    if (editFileRef.current) {
      editFileRef.current.value = "";
    }

    clearMessages();
  }

  /*
  ============================================================
  UPDATE DOCUMENT
  ============================================================
  */

  async function saveEditedDocument() {
    clearMessages();

    if (!editingDocument || !editingId) {
      return;
    }

    if (!form.title.trim()) {
      setError(
        "Please enter a document title."
      );
      return;
    }

    const replacementFile =
      editFileRef.current?.files?.[0] || null;

    if (replacementFile) {
      const isPdf =
        replacementFile.type ===
          "application/pdf" ||
        replacementFile.name
          .toLowerCase()
          .endsWith(".pdf");

      if (!isPdf) {
        setError(
          "Only PDF files are allowed."
        );
        return;
      }
    }

    setSaving(true);

    let uploadedReplacementPath:
      string | null = null;

    let replacementPublicUrl:
      string | null = null;

    const oldDocumentUrl =
      editingDocument.document_url;

    try {
      /*
      ----------------------------------------------------------
      IF A NEW PDF WAS CHOSEN, UPLOAD IT FIRST
      ----------------------------------------------------------
      */

      if (replacementFile) {
        const safeName =
          replacementFile.name
            .replace(
              /[^a-zA-Z0-9._-]/g,
              "-"
            )
            .replace(
              /-+/g,
              "-"
            )
            .toLowerCase();

        const storagePath =
          `documents/${Date.now()}-${safeName}`;

        const { error: uploadError } =
          await supabase.storage
            .from(BUCKET)
            .upload(
              storagePath,
              replacementFile,
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

        uploadedReplacementPath =
          storagePath;

        const { data: publicData } =
          supabase.storage
            .from(BUCKET)
            .getPublicUrl(
              storagePath
            );

        replacementPublicUrl =
          publicData.publicUrl;
      }

      /*
      ----------------------------------------------------------
      DETERMINE WHAT URL TO SAVE
      ----------------------------------------------------------
      */

      let finalDocumentUrl =
        editingDocument.document_url;

      let finalExternalUrl =
        form.externalUrl.trim() || null;

      /*
      When a replacement PDF is uploaded,
      the PDF becomes the active document.
      */

      if (replacementPublicUrl) {
        finalDocumentUrl =
          replacementPublicUrl;

        finalExternalUrl = null;
      }

      /*
      If there was no current PDF and user
      enters an external URL, keep PDF null.
      */

      if (
        !replacementPublicUrl &&
        !editingDocument.document_url &&
        form.externalUrl.trim()
      ) {
        finalDocumentUrl = null;
      }

      /*
      ----------------------------------------------------------
      UPDATE DATABASE
      ----------------------------------------------------------
      */

      const { error: updateError } =
        await supabase
          .from("academic_documents")
          .update({
            title:
              form.title.trim(),

            class_name:
              form.className.trim() ||
              null,

            category:
              form.category,

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
            editingId
          );

      /*
      ----------------------------------------------------------
      IF DATABASE UPDATE FAILED
      DELETE NEWLY UPLOADED FILE
      ----------------------------------------------------------
      */

      if (updateError) {
        if (uploadedReplacementPath) {
          await supabase.storage
            .from(BUCKET)
            .remove([
              uploadedReplacementPath,
            ]);
        }

        throw updateError;
      }

      /*
      ----------------------------------------------------------
      DELETE OLD PDF AFTER DB UPDATE
      ----------------------------------------------------------
      */

      if (
        replacementPublicUrl &&
        oldDocumentUrl
      ) {
        await removeStorageFileFromUrl(
          oldDocumentUrl
        );
      }

      setMessage(
        "Academic document updated successfully."
      );

      setEditingId(null);
      setEditingDocument(null);
      setEditFileName("");

      resetAddForm();

      if (editFileRef.current) {
        editFileRef.current.value = "";
      }

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

  /*
  ============================================================
  DELETE DOCUMENT
  ============================================================
  */

  async function deleteDocument(
    document: AcademicDocument
  ) {
    clearMessages();

    const confirmed =
      window.confirm(
        `Delete "${document.title}"?\n\nThis will also remove the uploaded PDF from Supabase Storage when applicable.`
      );

    if (!confirmed) {
      return;
    }

    setSaving(true);

    try {
      /*
      ----------------------------------------------------------
      DELETE DATABASE RECORD FIRST
      ----------------------------------------------------------
      */

      const { error: deleteError } =
        await supabase
          .from("academic_documents")
          .delete()
          .eq(
            "id",
            document.id
          );

      if (deleteError) {
        throw deleteError;
      }

      /*
      ----------------------------------------------------------
      DELETE STORAGE FILE
      ----------------------------------------------------------
      */

      if (document.document_url) {
        await removeStorageFileFromUrl(
          document.document_url
        );
      }

      setMessage(
        "Academic document deleted successfully."
      );

      if (editingId === document.id) {
        cancelEditing();
      }

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

  /*
  ============================================================
  TOGGLE ACTIVE
  ============================================================
  */

  async function toggleActive(
    document: AcademicDocument
  ) {
    clearMessages();

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

    setMessage(
      document.is_active
        ? "Document hidden from the public website."
        : "Document published on the public website."
    );

    await loadDocuments();
  }

  /*
  ============================================================
  MOVE DOCUMENT
  ============================================================
  */

  async function moveDocument(
    document: AcademicDocument,
    direction: "up" | "down"
  ) {
    clearMessages();

    const sameCategory =
      documents
        .filter(
          (item) =>
            item.category ===
              document.category &&
            item.is_active
        )
        .sort(
          (a, b) =>
            a.sort_order -
            b.sort_order
        );

    const index =
      sameCategory.findIndex(
        (item) =>
          item.id === document.id
      );

    if (index === -1) {
      return;
    }

    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >=
        sameCategory.length
    ) {
      return;
    }

    const target =
      sameCategory[targetIndex];

    const oldOrder =
      document.sort_order;

    const newOrder =
      target.sort_order;

    const now =
      new Date().toISOString();

    /*
    ----------------------------------------------------------
    UPDATE CURRENT ITEM
    ----------------------------------------------------------
    */

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

    /*
    ----------------------------------------------------------
    UPDATE TARGET ITEM
    ----------------------------------------------------------
    */

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

  /*
  ============================================================
  FILE NAME DISPLAY
  ============================================================
  */

  function handleEditFileChange(
    file: File | undefined
  ) {
    if (!file) {
      setEditFileName("");
      return;
    }

    setEditFileName(
      file.name
    );
  }

  function handleAddFileChange(
    file: File | undefined
  ) {
    if (!file) {
      return;
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name
        .toLowerCase()
        .endsWith(".pdf");

    if (!isPdf) {
      setError(
        "Only PDF files are allowed."
      );

      if (addFileRef.current) {
        addFileRef.current.value = "";
      }

      return;
    }

    clearMessages();
  }

  /*
  ============================================================
  SHARED INPUT STYLES
  ============================================================
  */

  const inputClass = `
    mt-3
    w-full
    rounded-2xl
    border
    border-[#102A56]/10
    bg-[#F8F6F1]
    px-4
    py-3.5
    text-sm
    text-[#10203A]
    outline-none
    transition
    focus:border-[#102A56]/30
    focus:ring-2
    focus:ring-[#102A56]/5
  `;

  /*
  ============================================================
  RENDER
  ============================================================
  */

  return (
    <main className="min-h-screen bg-[#F4F1EA] px-5 py-8 text-[#10203A] md:px-8">
      <div className="mx-auto max-w-[1500px]">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#102A56]/35">
              Apex CMS
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#102A56] md:text-4xl">
              Syllabus &amp; Datesheet
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#10203A]/50">
              Add, edit, replace and manage syllabus,
              datesheet and other academic documents
              displayed on the public website.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDocuments}
            disabled={loading || saving}
            className="
              inline-flex
              items-center
              gap-2
              self-start
              rounded-full
              border
              border-[#102A56]/10
              bg-white
              px-4
              py-3
              text-sm
              font-medium
              text-[#102A56]
              disabled:opacity-50
              md:self-auto
            "
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

        {/* ==================================================
            SUCCESS MESSAGE
        ================================================== */}

        {message && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
            <Check
              size={17}
              className="mt-0.5 shrink-0"
            />

            <span>{message}</span>
          </div>
        )}

        {/* ==================================================
            ERROR MESSAGE
        ================================================== */}

        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ==================================================
            EDIT PANEL
        ================================================== */}

        {editingDocument && (
          <section className="mt-8 rounded-[2rem] border border-[#102A56]/10 bg-[#102A56] p-6 text-white shadow-sm md:p-8">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10">
                  <Edit3 size={18} />
                </div>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/45">
                    Editing document
                  </p>

                  <h2 className="mt-2 text-xl font-semibold">
                    {editingDocument.title}
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-white/55">
                    Update the document information
                    or replace the current PDF.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={cancelEditing}
                disabled={saving}
                className="
                  inline-flex
                  items-center
                  gap-2
                  self-start
                  rounded-full
                  border
                  border-white/15
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  disabled:opacity-50
                "
              >
                <X size={15} />

                Cancel
              </button>
            </div>

            {/* CURRENT DOCUMENT */}

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10">
                    <FileText size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
                      Current document
                    </p>

                    <p className="mt-1 truncate text-sm font-medium text-white/85">
                      {editingDocument.document_url
                        ? "Current uploaded PDF"
                        : editingDocument.external_url
                          ? "External document link"
                          : "No document attached"}
                    </p>
                  </div>
                </div>

                {(editingDocument.document_url ||
                  editingDocument.external_url) && (
                  <a
                    href={
                      editingDocument.document_url ||
                      editingDocument.external_url ||
                      "#"
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      bg-white
                      px-4
                      py-2.5
                      text-sm
                      font-semibold
                      !text-[#102A56]
                    "
                  >
                    <ExternalLink size={14} />

                    Open current
                  </a>
                )}
              </div>
            </div>

            {/* EDIT FORM */}

            <div className="mt-7 grid gap-5 md:grid-cols-2">

              {/* TITLE */}

              <div>
                <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                  Document title
                </label>

                <input
                  value={form.title}
                  onChange={(e) =>
                    updateForm(
                      "title",
                      e.target.value
                    )
                  }
                  className="
                    mt-3
                    w-full
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    px-4
                    py-3.5
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-white/20
                    focus:border-white/25
                  "
                  placeholder="Annual Syllabus"
                />
              </div>

              {/* CLASS */}

              <div>
                <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                  Class
                </label>

                <input
                  value={form.className}
                  onChange={(e) =>
                    updateForm(
                      "className",
                      e.target.value
                    )
                  }
                  className="
                    mt-3
                    w-full
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    px-4
                    py-3.5
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-white/20
                    focus:border-white/25
                  "
                  placeholder="Class X"
                />
              </div>

              {/* CATEGORY */}

              <div>
                <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    updateForm(
                      "category",
                      e.target.value
                    )
                  }
                  className="
                    mt-3
                    w-full
                    rounded-2xl
                    border
                    border-white/10
                    bg-[#102A56]
                    px-4
                    py-3.5
                    text-sm
                    text-white
                    outline-none
                    focus:border-white/25
                  "
                >
                  {categories.map(
                    (item) => (
                      <option
                        key={
                          item.value
                        }
                        value={
                          item.value
                        }
                      >
                        {item.label}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* EXTERNAL URL */}

              <div>
                <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                  External URL
                </label>

                <input
                  value={form.externalUrl}
                  onChange={(e) =>
                    updateForm(
                      "externalUrl",
                      e.target.value
                    )
                  }
                  className="
                    mt-3
                    w-full
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    px-4
                    py-3.5
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-white/20
                    focus:border-white/25
                  "
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* DESCRIPTION */}

            <div className="mt-5">
              <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  updateForm(
                    "description",
                    e.target.value
                  )
                }
                rows={3}
                className="
                  mt-3
                  w-full
                  resize-none
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  px-4
                  py-3.5
                  text-sm
                  leading-6
                  text-white
                  outline-none
                  placeholder:text-white/20
                  focus:border-white/25
                "
                placeholder="Optional description..."
              />
            </div>

            {/* REPLACE PDF */}

            <div className="mt-5">
              <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Replace PDF
              </label>

              <div className="mt-3 rounded-2xl border border-dashed border-white/15 bg-white/5 p-4">
                <input
                  ref={editFileRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(e) =>
                    handleEditFileChange(
                      e.target.files?.[0]
                    )
                  }
                  className="
                    block
                    w-full
                    text-sm
                    text-white/60
                    file:mr-4
                    file:rounded-full
                    file:border-0
                    file:bg-white
                    file:px-4
                    file:py-2.5
                    file:text-xs
                    file:font-semibold
                    file:!text-[#102A56]
                  "
                />

                {editFileName && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-emerald-200">
                    <Check size={14} />

                    New PDF selected:
                    <span className="font-medium">
                      {editFileName}
                    </span>
                  </div>
                )}

                {!editFileName && (
                  <p className="mt-3 text-xs leading-5 text-white/35">
                    Leave this empty to keep the current
                    PDF. Selecting a new PDF will replace
                    the existing uploaded file.
                  </p>
                )}
              </div>
            </div>

            {/* EDIT ACTIONS */}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={saveEditedDocument}
                disabled={saving}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-white
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  !text-[#102A56]
                  disabled:opacity-50
                "
              >
                {saving ? (
                  <RefreshCw
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={15} />
                )}

                {saving
                  ? "Saving..."
                  : "Save changes"}
              </button>

              <button
                type="button"
                onClick={cancelEditing}
                disabled={saving}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border
                  border-white/15
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                  disabled:opacity-50
                "
              >
                <X size={15} />

                Cancel
              </button>
            </div>
          </section>
        )}

        {/* ==================================================
            ADD DOCUMENT
        ================================================== */}

        {!editingDocument && (
          <section className="mt-8 rounded-[2rem] bg-white p-6 md:p-8">

            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#102A56] text-white">
                <Upload size={18} />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-[#102A56]">
                  Add academic document
                </h2>

                <p className="mt-1 text-sm text-[#10203A]/45">
                  Upload a PDF directly to Supabase or link
                  an external document.
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-2">

              {/* TITLE */}

              <div>
                <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40">
                  Document title
                </label>

                <input
                  value={form.title}
                  onChange={(e) =>
                    updateForm(
                      "title",
                      e.target.value
                    )
                  }
                  placeholder="Annual Syllabus"
                  className={inputClass}
                />
              </div>

              {/* CLASS */}

              <div>
                <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40">
                  Class
                </label>

                <input
                  value={form.className}
                  onChange={(e) =>
                    updateForm(
                      "className",
                      e.target.value
                    )
                  }
                  placeholder="Class X"
                  className={inputClass}
                />
              </div>

              {/* CATEGORY */}

              <div>
                <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40">
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    updateForm(
                      "category",
                      e.target.value
                    )
                  }
                  className={inputClass}
                >
                  {categories.map(
                    (item) => (
                      <option
                        key={
                          item.value
                        }
                        value={
                          item.value
                        }
                      >
                        {item.label}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* EXTERNAL URL */}

              <div>
                <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40">
                  External URL
                </label>

                <input
                  value={form.externalUrl}
                  onChange={(e) =>
                    updateForm(
                      "externalUrl",
                      e.target.value
                    )
                  }
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>
            </div>

            {/* DESCRIPTION */}

            <div className="mt-5">
              <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  updateForm(
                    "description",
                    e.target.value
                  )
                }
                rows={3}
                placeholder="Optional description..."
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* PDF UPLOAD */}

            <div className="mt-5">
              <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40">
                PDF file
              </label>

              <div className="mt-3 rounded-2xl border border-dashed border-[#102A56]/15 bg-[#F8F6F1] p-4">
                <input
                  ref={addFileRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(e) =>
                    handleAddFileChange(
                      e.target.files?.[0]
                    )
                  }
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
                  Select a PDF from your computer.
                  It will be uploaded to the
                  <span className="font-semibold">
                    {" "}academic-resources
                  </span>
                  {" "}Supabase Storage bucket.
                </p>
              </div>
            </div>

            {/* ADD BUTTON */}

            <button
              type="button"
              onClick={addDocument}
              disabled={saving}
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#102A56]
                px-6
                py-3.5
                text-sm
                font-semibold
                text-white
                disabled:opacity-50
              "
            >
              {saving ? (
                <RefreshCw
                  size={15}
                  className="animate-spin"
                />
              ) : (
                <Upload size={15} />
              )}

              {saving
                ? "Uploading..."
                : "Add document"}
            </button>
          </section>
        )}

        {/* ==================================================
            DOCUMENT LIST
        ================================================== */}

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
                No academic documents added yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {documents.map(
                (document) => (
                  <article
                    key={
                      document.id
                    }
                    className="
                      rounded-[2rem]
                      border
                      border-[#102A56]/10
                      bg-white
                      p-5
                      md:p-6
                    "
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-center">

                      {/* ICON */}

                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#102A56] text-white">
                        <FileText size={18} />
                      </div>

                      {/* CONTENT */}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="rounded-full bg-[#102A56]/5 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#102A56]/55">
                            {categoryLabel(
                              document.category
                            )}
                          </span>

                          {!document.is_active && (
                            <span className="rounded-full bg-red-50 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-red-500">
                              Hidden
                            </span>
                          )}

                          {document.document_url && (
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-emerald-700">
                              PDF
                            </span>
                          )}

                          {!document.document_url &&
                            document.external_url && (
                              <span className="rounded-full bg-amber-50 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-amber-700">
                                External link
                              </span>
                            )}
                        </div>

                        <h3 className="mt-3 text-lg font-semibold text-[#102A56]">
                          {document.title}
                        </h3>

                        {document.class_name && (
                          <p className="mt-1 text-xs font-medium text-[#10203A]/45">
                            {document.class_name}
                          </p>
                        )}

                        {document.description && (
                          <p className="mt-2 text-sm leading-6 text-[#10203A]/45">
                            {document.description}
                          </p>
                        )}

                        {document.document_url && (
                          <p className="mt-3 text-xs text-[#10203A]/30">
                            Uploaded PDF is stored in Supabase
                            Storage.
                          </p>
                        )}
                      </div>

                      {/* ACTIONS */}

                      <div className="flex flex-wrap items-center gap-2">

                        {/* OPEN */}

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
                            className="
                              grid
                              h-9
                              w-9
                              place-items-center
                              rounded-xl
                              border
                              border-[#102A56]/10
                              text-[#102A56]
                            "
                            title="Open document"
                          >
                            <ExternalLink
                              size={14}
                            />
                          </a>
                        )}

                        {/* EDIT */}

                        <button
                          type="button"
                          onClick={() =>
                            startEditing(
                              document
                            )
                          }
                          disabled={saving}
                          className="
                            grid
                            h-9
                            w-9
                            place-items-center
                            rounded-xl
                            border
                            border-[#102A56]/10
                            text-[#102A56]
                            disabled:opacity-40
                          "
                          title="Edit document"
                        >
                          <Edit3
                            size={14}
                          />
                        </button>

                        {/* MOVE UP */}

                        <button
                          type="button"
                          onClick={() =>
                            moveDocument(
                              document,
                              "up"
                            )
                          }
                          disabled={
                            !document.is_active ||
                            saving
                          }
                          className="
                            grid
                            h-9
                            w-9
                            place-items-center
                            rounded-xl
                            border
                            border-[#102A56]/10
                            text-[#102A56]
                            disabled:opacity-30
                          "
                          title="Move up"
                        >
                          <ArrowUp
                            size={14}
                          />
                        </button>

                        {/* MOVE DOWN */}

                        <button
                          type="button"
                          onClick={() =>
                            moveDocument(
                              document,
                              "down"
                            )
                          }
                          disabled={
                            !document.is_active ||
                            saving
                          }
                          className="
                            grid
                            h-9
                            w-9
                            place-items-center
                            rounded-xl
                            border
                            border-[#102A56]/10
                            text-[#102A56]
                            disabled:opacity-30
                          "
                          title="Move down"
                        >
                          <ArrowDown
                            size={14}
                          />
                        </button>

                        {/* HIDE / SHOW */}

                        <button
                          type="button"
                          onClick={() =>
                            toggleActive(
                              document
                            )
                          }
                          disabled={saving}
                          className="
                            grid
                            h-9
                            w-9
                            place-items-center
                            rounded-xl
                            border
                            border-[#102A56]/10
                            text-[#102A56]
                            disabled:opacity-40
                          "
                          title={
                            document.is_active
                              ? "Hide"
                              : "Show"
                          }
                        >
                          {document.is_active ? (
                            <Eye
                              size={14}
                            />
                          ) : (
                            <EyeOff
                              size={14}
                            />
                          )}
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            deleteDocument(
                              document
                            )
                          }
                          disabled={saving}
                          className="
                            grid
                            h-9
                            w-9
                            place-items-center
                            rounded-xl
                            border
                            border-red-500/10
                            text-red-500
                            disabled:opacity-40
                          "
                          title="Delete"
                        >
                          <Trash2
                            size={14}
                          />
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