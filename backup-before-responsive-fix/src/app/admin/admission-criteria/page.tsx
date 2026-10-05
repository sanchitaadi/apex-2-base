"use client";

import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Edit3,
  Eye,
  EyeOff,
  ExternalLink,
  FileText,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type CriterionDocument = {
  title: string;
  url: string | null;
  label: string;
};

type AdmissionCriterion = {
  id: string;
  section_key: string;
  section_title: string;
  eyebrow: string | null;
  description: string | null;
  content: string | null;
  requirements: string[] | null;
  documents: CriterionDocument[] | null;
  sort_order: number;
  is_active: boolean;
};

type DocumentForm = {
  title: string;
  label: string;
  externalUrl: string;
  existingUrl: string | null;
  file: File | null;
};

type FormState = {
  sectionKey: string;
  sectionTitle: string;
  eyebrow: string;
  description: string;
  content: string;
  requirements: string[];
  documents: DocumentForm[];
};

const CATEGORY = "admission-criteria";
const BUCKET = "admission-criteria";

const EMPTY_FORM: FormState = {
  sectionKey: "",
  sectionTitle: "",
  eyebrow: "",
  description: "",
  content: "",
  requirements: [],
  documents: [],
};

const EMPTY_DOCUMENT: DocumentForm = {
  title: "",
  label: "Download PDF",
  externalUrl: "",
  existingUrl: null,
  file: null,
};

export default function AdmissionCriteriaAdminPage() {
  const [sections, setSections] = useState<AdmissionCriterion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] =
    useState<AdmissionCriterion | null>(null);

  const [form, setForm] =
    useState<FormState>(EMPTY_FORM);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /*
  ============================================================
  SAFE HELPERS
  ============================================================
  */

  function safeRequirements(
    value: string[] | null | undefined
  ): string[] {
    return Array.isArray(value)
      ? value.filter(
          (item): item is string =>
            typeof item === "string"
        )
      : [];
  }

  function safeDocuments(
    value: CriterionDocument[] | null | undefined
  ): CriterionDocument[] {
    return Array.isArray(value)
      ? value.filter(
          (item) =>
            item &&
            typeof item === "object"
        )
      : [];
  }

  function clearMessages() {
    setMessage("");
    setError("");
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditing(null);
  }

  /*
  ============================================================
  LOAD
  ============================================================
  */

  async function loadSections() {
    setLoading(true);
    setError("");

    const { data, error: loadError } =
      await supabase
        .from("admission_criteria")
        .select(`
          id,
          section_key,
          section_title,
          eyebrow,
          description,
          content,
          requirements,
          documents,
          sort_order,
          is_active
        `)
        .order("sort_order", {
          ascending: true,
        });

    if (loadError) {
      setSections([]);
      setError(loadError.message);
    } else {
      setSections(
        (data || []) as AdmissionCriterion[]
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadSections();
  }, []);

  /*
  ============================================================
  ADD SECTION
  ============================================================
  */

  function startAdd() {
    clearMessages();

    setEditing(null);

    setForm({
      ...EMPTY_FORM,
      requirements: [],
      documents: [],
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /*
  ============================================================
  EDIT SECTION
  ============================================================
  */

  function startEdit(
    section: AdmissionCriterion
  ) {
    clearMessages();

    const requirements =
      safeRequirements(
        section.requirements
      );

    const documents =
      safeDocuments(
        section.documents
      );

    setEditing(section);

    setForm({
      sectionKey:
        section.section_key || "",

      sectionTitle:
        section.section_title || "",

      eyebrow:
        section.eyebrow || "",

      description:
        section.description || "",

      content:
        section.content || "",

      requirements,

      documents:
        documents.map(
          (document) => ({
            title:
              document.title || "",

            label:
              document.label ||
              "Download PDF",

            externalUrl:
              document.url || "",

            existingUrl:
              document.url || null,

            file: null,
          })
        ),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    clearMessages();
    resetForm();
  }

  /*
  ============================================================
  REQUIREMENTS
  ============================================================
  */

  function addRequirement() {
    setForm((current) => ({
      ...current,
      requirements: [
        ...safeRequirements(
          current.requirements
        ),
        "",
      ],
    }));
  }

  function updateRequirement(
    index: number,
    value: string
  ) {
    setForm((current) => {
      const requirements = [
        ...safeRequirements(
          current.requirements
        ),
      ];

      requirements[index] = value;

      return {
        ...current,
        requirements,
      };
    });
  }

  function removeRequirement(
    index: number
  ) {
    setForm((current) => ({
      ...current,
      requirements:
        safeRequirements(
          current.requirements
        ).filter(
          (_, i) => i !== index
        ),
    }));
  }

  /*
  ============================================================
  DOCUMENTS
  ============================================================
  */

  function addDocument() {
  setForm((current) => ({
    ...current,
    documents: [
      ...current.documents,
      {
        ...EMPTY_DOCUMENT,
      },
    ],
  }));
}

  function updateDocument(
    index: number,
    field: "title" | "label" | "externalUrl",
    value: string
  ) {
    setForm((current) => {
      const documents = [
        ...current.documents,
      ];

      if (!documents[index]) {
        return current;
      }

      documents[index] = {
        ...documents[index],
        [field]: value,
      };

      return {
        ...current,
        documents,
      };
    });
  }

  function updateDocumentFile(
    index: number,
    file: File | null
  ) {
    clearMessages();

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
        return;
      }
    }

    setForm((current) => {
      const documents = [
        ...current.documents,
      ];

      if (!documents[index]) {
        return current;
      }

      documents[index] = {
        ...documents[index],
        file,
      };

      return {
        ...current,
        documents,
      };
    });
  }

  function removeDocument(
    index: number
  ) {
    setForm((current) => ({
      ...current,
      documents:
        current.documents.filter(
          (_, i) => i !== index
        ),
    }));
  }

  /*
  ============================================================
  STORAGE
  ============================================================
  */

  function getStoragePath(
    publicUrl: string | null
  ): string | null {
    if (!publicUrl) {
      return null;
    }

    try {
      const parsed =
        new URL(publicUrl);

      const marker =
        `/storage/v1/object/public/${BUCKET}/`;

      const index =
        parsed.pathname.indexOf(
          marker
        );

      if (index === -1) {
        return null;
      }

      return decodeURIComponent(
        parsed.pathname.slice(
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

    if (!path) {
      return;
    }

    const { error: storageError } =
      await supabase.storage
        .from(BUCKET)
        .remove([path]);

    if (storageError) {
      console.error(
        "Storage delete error:",
        storageError
      );
    }
  }

  async function uploadPdf(
    file: File
  ): Promise<string> {
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

    const filePath =
      `documents/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}-${safeName}`;

    const {
      error: uploadError,
    } = await supabase.storage
      .from(BUCKET)
      .upload(
        filePath,
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
          filePath
        );

    return data.publicUrl;
  }

  /*
  ============================================================
  SAVE
  ============================================================
  */

  async function saveSection() {
    clearMessages();

    if (!form.sectionKey.trim()) {
      setError(
        "Section key is required."
      );
      return;
    }

    if (!form.sectionTitle.trim()) {
      setError(
        "Section title is required."
      );
      return;
    }

    const requirements =
      safeRequirements(
        form.requirements
      )
        .map(
          (item) => item.trim()
        )
        .filter(Boolean);

    const documents =
      safeDocuments(
        form.documents as unknown as CriterionDocument[]
      ) as unknown as DocumentForm[];

    /*
    Only keep actual document entries.
    */

    const activeDocuments =
      documents.filter(
        (document) =>
          document.title.trim() ||
          document.externalUrl.trim() ||
          document.file ||
          document.existingUrl
      );

    setSaving(true);

    const newlyUploadedUrls: string[] =
      [];

    try {
      const savedDocuments: CriterionDocument[] =
        [];

      /*
      ==========================================================
      PROCESS DOCUMENTS
      ==========================================================
      */

      for (
        const document of activeDocuments
      ) {
        if (
          !document.title.trim()
        ) {
          throw new Error(
            "Every document must have a title."
          );
        }

        let finalUrl =
          document.existingUrl ||
          document.externalUrl.trim() ||
          null;

        /*
        Upload new / replacement PDF
        */

        if (document.file) {
          finalUrl =
            await uploadPdf(
              document.file
            );

          newlyUploadedUrls.push(
            finalUrl
          );
        }

        savedDocuments.push({
          title:
            document.title.trim(),

          url: finalUrl,

          label:
            document.label.trim() ||
            "Download PDF",
        });
      }

      /*
      ==========================================================
      PAYLOAD
      ==========================================================
      */

      const payload = {
        section_key:
          form.sectionKey.trim(),

        section_title:
          form.sectionTitle.trim(),

        eyebrow:
          form.eyebrow.trim() ||
          null,

        description:
          form.description.trim() ||
          null,

        content:
          form.content.trim() ||
          null,

        requirements,

        documents:
          savedDocuments,

        sort_order:
          editing?.sort_order ??
          sections.length,

        is_active:
          editing?.is_active ??
          true,

        updated_at:
          new Date().toISOString(),
      };

      /*
      ==========================================================
      UPDATE
      ==========================================================
      */

      if (editing) {
        const {
          error: updateError,
        } = await supabase
          .from(
            "admission_criteria"
          )
          .update(payload)
          .eq(
            "id",
            editing.id
          );

        if (updateError) {
          throw updateError;
        }

        /*
        --------------------------------------------------------
        Remove old Supabase files that are no longer referenced
        --------------------------------------------------------
        */

        const newUrls =
          new Set(
            savedDocuments
              .map(
                (document) =>
                  document.url
              )
              .filter(
                (
                  url
                ): url is string =>
                  typeof url ===
                  "string"
              )
          );

        const oldDocuments =
          safeDocuments(
            editing.documents
          );

        for (
          const oldDocument of oldDocuments
        ) {
          const oldUrl =
            oldDocument.url;

          if (
            oldUrl &&
            getStoragePath(
              oldUrl
            ) &&
            !newUrls.has(oldUrl)
          ) {
            await deleteStorageFile(
              oldUrl
            );
          }
        }

        setMessage(
          "Admission criteria updated successfully."
        );
      } else {
        /*
        ========================================================
        INSERT
        ========================================================
        */

        const {
          error: insertError,
        } = await supabase
          .from(
            "admission_criteria"
          )
          .insert(payload);

        if (insertError) {
          throw insertError;
        }

        setMessage(
          "Admission criteria added successfully."
        );
      }

      resetForm();

      await loadSections();
    } catch (err: any) {
      /*
      ----------------------------------------------------------
      Remove uploaded files if database save failed
      ----------------------------------------------------------
      */

      for (
        const url of newlyUploadedUrls
      ) {
        await deleteStorageFile(
          url
        );
      }

      setError(
        err?.message ||
          "Could not save admission criteria."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
  ============================================================
  VISIBILITY
  ============================================================
  */

  async function toggleActive(
    section: AdmissionCriterion
  ) {
    clearMessages();

    const {
      error: updateError,
    } = await supabase
      .from(
        "admission_criteria"
      )
      .update({
        is_active:
          !section.is_active,

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        section.id
      );

    if (updateError) {
      setError(
        updateError.message
      );
      return;
    }

    setMessage(
      section.is_active
        ? "Criterion hidden from the website."
        : "Criterion published on the website."
    );

    await loadSections();
  }

  /*
  ============================================================
  DELETE SECTION
  ============================================================
  */

  async function deleteSection(
    section: AdmissionCriterion
  ) {
    clearMessages();

    const confirmed =
      window.confirm(
        `Delete "${section.section_title}"?\n\nUploaded PDFs belonging to this section will also be removed.`
      );

    if (!confirmed) {
      return;
    }

    setSaving(true);

    try {
      const {
        error: deleteError,
      } = await supabase
        .from(
          "admission_criteria"
        )
        .delete()
        .eq(
          "id",
          section.id
        );

      if (deleteError) {
        throw deleteError;
      }

      /*
      Remove associated Supabase files
      */

      const documents =
        safeDocuments(
          section.documents
        );

      for (
        const document of documents
      ) {
        if (
          document.url &&
          getStoragePath(
            document.url
          )
        ) {
          await deleteStorageFile(
            document.url
          );
        }
      }

      if (
        editing?.id ===
        section.id
      ) {
        resetForm();
      }

      setMessage(
        "Admission criteria section deleted successfully."
      );

      await loadSections();
    } catch (err: any) {
      setError(
        err?.message ||
          "Could not delete section."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
  ============================================================
  REORDER
  ============================================================
  */

  async function moveSection(
    section: AdmissionCriterion,
    direction: "up" | "down"
  ) {
    clearMessages();

    const index =
      sections.findIndex(
        (item) =>
          item.id === section.id
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
        sections.length
    ) {
      return;
    }

    const target =
      sections[targetIndex];

    const now =
      new Date().toISOString();

    const first =
      await supabase
        .from(
          "admission_criteria"
        )
        .update({
          sort_order:
            target.sort_order,

          updated_at: now,
        })
        .eq(
          "id",
          section.id
        );

    if (first.error) {
      setError(
        first.error.message
      );
      return;
    }

    const second =
      await supabase
        .from(
          "admission_criteria"
        )
        .update({
          sort_order:
            section.sort_order,

          updated_at: now,
        })
        .eq(
          "id",
          target.id
        );

    if (second.error) {
      setError(
        second.error.message
      );
      return;
    }

    await loadSections();
  }

  /*
  ============================================================
  RENDER
  ============================================================
  */

  const visibleRequirements =
    safeRequirements(
      form.requirements
    );

  const visibleDocuments =
    Array.isArray(
      form.documents
    )
      ? form.documents
      : [];

  return (
    <main className="min-h-screen bg-[#F4F1EA] px-5 py-8 text-[#10203A] md:px-8">

      <div className="mx-auto max-w-[1500px]">

        {/* ==================================================
            HEADER
        ================================================== */}

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
                  Admissions
                </p>
              </div>

            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[#102A56] md:text-4xl">
              Admission Criteria
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#10203A]/50">
              Manage admission sections, requirements and
              supporting PDF documents.
            </p>

          </div>

          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={loadSections}
              disabled={
                loading ||
                saving
              }
              className="
                inline-flex
                items-center
                gap-2
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

            <button
              type="button"
              onClick={startAdd}
              disabled={saving}
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#102A56]
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                disabled:opacity-50
              "
            >

              <Plus size={15} />

              Add section

            </button>

          </div>

        </div>

        {/* ==================================================
            MESSAGE
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

        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ==================================================
            EDITOR
        ================================================== */}

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
                    ? "Edit criterion"
                    : "Create criterion"}
                </p>

                <h2
                  className={
                    editing
                      ? "mt-2 text-xl font-semibold text-white"
                      : "mt-2 text-xl font-semibold text-[#102A56]"
                  }
                >
                  {editing
                    ? editing.section_title
                    : "Admission criterion"}
                </h2>

                <p
                  className={
                    editing
                      ? "mt-1 text-sm text-white/50"
                      : "mt-1 text-sm text-[#10203A]/45"
                  }
                >
                  Manage the content and upload its documents.
                </p>

              </div>

            </div>

            {editing && (
              <button
                type="button"
                onClick={cancelEdit}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm text-white"
              >
                <X size={15} />
                Cancel
              </button>
            )}

          </div>

          {/* ==================================================
              BASIC FIELDS
          ================================================== */}

          <div className="mt-7 grid gap-5 md:grid-cols-2">

            <Field
              label="Section key"
              value={
                form.sectionKey
              }
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  sectionKey:
                    value,
                }))
              }
              placeholder="classes-1-9"
              dark={!!editing}
            />

            <Field
              label="Section title"
              value={
                form.sectionTitle
              }
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  sectionTitle:
                    value,
                }))
              }
              placeholder="Criterion for Classes I to IX"
              dark={!!editing}
            />

            <Field
              label="Eyebrow"
              value={
                form.eyebrow
              }
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  eyebrow:
                    value,
                }))
              }
              placeholder="Classes Iâ€“IX"
              dark={!!editing}
            />

            <Field
              label="Description"
              value={
                form.description
              }
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  description:
                    value,
                }))
              }
              placeholder="Short description"
              dark={!!editing}
            />

          </div>

          {/* ==================================================
              CONTENT
          ================================================== */}

          <TextArea
            label="Main content"
            value={
              form.content
            }
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                content: value,
              }))
            }
            placeholder="Main admission information..."
            dark={!!editing}
          />

          {/* ==================================================
              REQUIREMENTS
          ================================================== */}

          <section className="mt-8">

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

              <div>

                <p
                  className={
                    editing
                      ? "text-[9px] font-semibold uppercase tracking-[0.23em] text-white/45"
                      : "text-[9px] font-semibold uppercase tracking-[0.23em] text-[#102A56]/35"
                  }
                >
                  Requirements
                </p>

                <p
                  className={
                    editing
                      ? "mt-1 text-xs text-white/30"
                      : "mt-1 text-xs text-[#10203A]/35"
                  }
                >
                  Add each admission requirement separately.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  addRequirement
                }
                className={
                  editing
                    ? "inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs font-semibold text-white"
                    : "inline-flex items-center justify-center gap-2 rounded-full bg-[#102A56] px-4 py-2.5 text-xs font-semibold text-white"
                }
              >
                <Plus size={14} />
                Add requirement
              </button>

            </div>

            <div className="mt-5 space-y-3">

              {visibleRequirements.length ===
              0 ? (

                <div
                  className={
                    editing
                      ? "rounded-2xl border border-dashed border-white/10 bg-white/5 p-5 text-sm text-white/30"
                      : "rounded-2xl border border-dashed border-[#102A56]/10 bg-[#F8F6F1] p-5 text-sm text-[#10203A]/35"
                  }
                >
                  No requirements added yet.
                </div>

              ) : (

                visibleRequirements.map(
                  (
                    requirement,
                    index
                  ) => (

                    <div
                      key={index}
                      className="flex gap-3"
                    >

                      <div
                        className={
                          editing
                            ? "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/5 text-xs text-white/40"
                            : "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#102A56]/5 text-xs text-[#102A56]/40"
                        }
                      >
                        {index + 1}
                      </div>

                      <textarea
                        value={
                          requirement
                        }
                        onChange={(event) =>
                          updateRequirement(
                            index,
                            event.target
                              .value
                          )
                        }
                        rows={2}
                        placeholder="Enter requirement..."
                        className={
                          editing
                            ? "min-w-0 flex-1 resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/20"
                            : "min-w-0 flex-1 resize-none rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3 text-sm leading-6 text-[#10203A] outline-none placeholder:text-[#10203A]/25"
                        }
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeRequirement(
                            index
                          )
                        }
                        className={
                          editing
                            ? "grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 text-red-200"
                            : "grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-red-500/10 text-red-500"
                        }
                        title="Remove"
                      >
                        <Trash2
                          size={15}
                        />
                      </button>

                    </div>

                  )
                )

              )}

            </div>

          </section>

          {/* ==================================================
              DOCUMENTS
          ================================================== */}

          <section className="mt-9">

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

              <div>

                <p
                  className={
                    editing
                      ? "text-[9px] font-semibold uppercase tracking-[0.23em] text-white/45"
                      : "text-[9px] font-semibold uppercase tracking-[0.23em] text-[#102A56]/35"
                  }
                >
                  Supporting documents
                </p>

                <p
                  className={
                    editing
                      ? "mt-1 text-xs text-white/30"
                      : "mt-1 text-xs text-[#10203A]/35"
                  }
                >
                  Upload PDF files directly or use an external URL.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  addDocument
                }
                className={
                  editing
                    ? "inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs font-semibold text-white"
                    : "inline-flex items-center justify-center gap-2 rounded-full bg-[#102A56] px-4 py-2.5 text-xs font-semibold text-white"
                }
              >
                <Plus size={14} />
                Add document
              </button>

            </div>

            <div className="mt-5 space-y-5">

              {visibleDocuments.length ===
              0 ? (

                <div
                  className={
                    editing
                      ? "rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-white/30"
                      : "rounded-2xl border border-dashed border-[#102A56]/10 bg-[#F8F6F1] p-6 text-sm text-[#10203A]/35"
                  }
                >
                  No supporting documents added.
                </div>

              ) : (

                visibleDocuments.map(
                  (
                    document,
                    index
                  ) => (

                    <DocumentEditor
                      key={index}
                      document={
                        document
                      }
                      index={index}
                      dark={!!editing}
                      onUpdate={
                        updateDocument
                      }
                      onFileChange={
                        updateDocumentFile
                      }
                      onRemove={
                        removeDocument
                      }
                    />

                  )
                )

              )}

            </div>

          </section>

          {/* ==================================================
              SAVE
          ================================================== */}

          <div className="mt-9 flex flex-wrap gap-3 border-t border-white/10 pt-7">

            <button
              type="button"
              onClick={
                saveSection
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
              ) : (
                <Save size={15} />
              )}

              {saving
                ? "Saving..."
                : editing
                  ? "Save changes"
                  : "Add section"}

            </button>

            {editing && (
              <button
                type="button"
                onClick={
                  cancelEdit
                }
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-white"
              >
                <X size={15} />
                Cancel
              </button>
            )}

          </div>

        </section>

        {/* ==================================================
            EXISTING SECTIONS
        ================================================== */}

        <section className="mt-10">

          <div className="mb-5">

            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#102A56]/35">
              Existing criteria
            </p>

            <p className="mt-2 text-sm text-[#10203A]/45">
              {sections.length} section
              {sections.length === 1
                ? ""
                : "s"}
            </p>

          </div>

          {loading ? (

            <div className="rounded-[2rem] bg-white py-24 text-center text-sm text-[#10203A]/40">
              Loading admission criteria...
            </div>

          ) : sections.length === 0 ? (

            <div className="rounded-[2rem] border border-dashed border-[#102A56]/15 bg-white py-24 text-center">

              <FileText
                size={32}
                className="mx-auto text-[#102A56]/20"
              />

              <p className="mt-5 text-sm text-[#10203A]/45">
                No admission criteria found.
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {sections.map(
                (
                  section,
                  index
                ) => {

                  const requirementCount =
                    safeRequirements(
                      section.requirements
                    ).length;

                  const documentCount =
                    safeDocuments(
                      section.documents
                    ).length;

                  return (
                    <article
                      key={
                        section.id
                      }
                      className="rounded-[2rem] border border-[#102A56]/10 bg-white p-5 md:p-6"
                    >

                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">

                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#102A56] text-white">

                          <span className="text-xs font-semibold">
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <span className="rounded-full bg-[#102A56]/5 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#102A56]/55">
                              {
                                section.section_key
                              }
                            </span>

                            {!section.is_active && (
                              <span className="rounded-full bg-red-50 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.17em] text-red-500">
                                Hidden
                              </span>
                            )}

                          </div>

                          <h3 className="mt-3 text-lg font-semibold text-[#102A56]">
                            {
                              section.section_title
                            }
                          </h3>

                          {section.eyebrow && (
                            <p className="mt-1 text-xs uppercase tracking-[0.15em] text-[#10203A]/30">
                              {
                                section.eyebrow
                              }
                            </p>
                          )}

                          <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#10203A]/40">

                            <span>
                              {
                                requirementCount
                              }{" "}
                              requirement
                              {requirementCount ===
                              1
                                ? ""
                                : "s"}
                            </span>

                            <span>Â·</span>

                            <span>
                              {
                                documentCount
                              }{" "}
                              document
                              {documentCount ===
                              1
                                ? ""
                                : "s"}
                            </span>

                          </div>

                        </div>

                        <div className="flex flex-wrap gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              startEdit(
                                section
                              )
                            }
                            disabled={
                              saving
                            }
                            title="Edit"
                            className="grid h-9 w-9 place-items-center rounded-xl border border-[#102A56]/10 text-[#102A56] disabled:opacity-40"
                          >
                            <Edit3
                              size={14}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              moveSection(
                                section,
                                "up"
                              )
                            }
                            disabled={
                              index ===
                                0 ||
                              saving
                            }
                            title="Move up"
                            className="grid h-9 w-9 place-items-center rounded-xl border border-[#102A56]/10 text-[#102A56] disabled:opacity-30"
                          >
                            <ArrowUp
                              size={14}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              moveSection(
                                section,
                                "down"
                              )
                            }
                            disabled={
                              index ===
                                sections.length -
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
                                section
                              )
                            }
                            disabled={
                              saving
                            }
                            title={
                              section.is_active
                                ? "Hide"
                                : "Show"
                            }
                            className="grid h-9 w-9 place-items-center rounded-xl border border-[#102A56]/10 text-[#102A56]"
                          >
                            {section.is_active ? (
                              <Eye
                                size={
                                  14
                                }
                              />
                            ) : (
                              <EyeOff
                                size={
                                  14
                                }
                              />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteSection(
                                section
                              )
                            }
                            disabled={
                              saving
                            }
                            title="Delete"
                            className="grid h-9 w-9 place-items-center rounded-xl border border-red-500/10 text-red-500"
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

/*
============================================================
FIELD COMPONENT
============================================================
*/

function Field({
  label,
  value,
  onChange,
  placeholder,
  dark,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dark: boolean;
}) {
  return (
    <div>

      <label
        className={
          dark
            ? "text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45"
            : "text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40"
        }
      >
        {label}
      </label>

      <input
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={placeholder}
        className={
          dark
            ? "mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/20"
            : "mt-3 w-full rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3.5 text-sm text-[#10203A] outline-none placeholder:text-[#10203A]/25"
        }
      />

    </div>
  );
}

/*
============================================================
TEXTAREA COMPONENT
============================================================
*/

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  dark,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dark: boolean;
}) {
  return (
    <div className="mt-5">

      <label
        className={
          dark
            ? "text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45"
            : "text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40"
        }
      >
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        rows={5}
        placeholder={placeholder}
        className={
          dark
            ? "mt-3 w-full resize-y rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm leading-6 text-white outline-none placeholder:text-white/20"
            : "mt-3 w-full resize-y rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3.5 text-sm leading-6 text-[#10203A] outline-none placeholder:text-[#10203A]/25"
        }
      />

    </div>
  );
}

/*
============================================================
DOCUMENT EDITOR
============================================================
*/

function DocumentEditor({
  document,
  index,
  dark,
  onUpdate,
  onFileChange,
  onRemove,
}: {
  document: DocumentForm;
  index: number;
  dark: boolean;
  onUpdate: (
    index: number,
    field:
      | "title"
      | "label"
      | "externalUrl",
    value: string
  ) => void;
  onFileChange: (
    index: number,
    file: File | null
  ) => void;
  onRemove: (
    index: number
  ) => void;
}) {
  return (
    <div
      className={
        dark
          ? "rounded-[1.75rem] border border-white/10 bg-white/5 p-5 md:p-6"
          : "rounded-[1.75rem] border border-[#102A56]/10 bg-[#FAF8F3] p-5 md:p-6"
      }
    >

      {/* HEADER */}

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          <div
            className={
              dark
                ? "grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white"
                : "grid h-10 w-10 place-items-center rounded-xl bg-[#102A56] text-white"
            }
          >
            <FileText size={17} />
          </div>

          <div>

            <p
              className={
                dark
                  ? "text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40"
                  : "text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/35"
              }
            >
              Document{" "}
              {index + 1}
            </p>

            <p
              className={
                dark
                  ? "mt-1 text-xs text-white/30"
                  : "mt-1 text-xs text-[#10203A]/35"
              }
            >
              PDF or external link
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={() =>
            onRemove(index)
          }
          className={
            dark
              ? "grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-red-200"
              : "grid h-9 w-9 place-items-center rounded-xl border border-red-500/10 text-red-500"
          }
          title="Remove document"
        >
          <Trash2 size={14} />
        </button>

      </div>

      {/* TITLE */}

      <div className="mt-5">

        <label
          className={
            dark
              ? "text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40"
              : "text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40"
          }
        >
          Document title
        </label>

        <input
          value={
            document.title
          }
          onChange={(event) =>
            onUpdate(
              index,
              "title",
              event.target.value
            )
          }
          placeholder="Admission Notification 2026â€“2027"
          className={
            dark
              ? "mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/20"
              : "mt-3 w-full rounded-2xl border border-[#102A56]/10 bg-white px-4 py-3.5 text-sm text-[#10203A] outline-none"
          }
        />

      </div>

      {/* BUTTON LABEL */}

      <div className="mt-5">

        <label
          className={
            dark
              ? "text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40"
              : "text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40"
          }
        >
          Button label
        </label>

        <input
          value={
            document.label
          }
          onChange={(event) =>
            onUpdate(
              index,
              "label",
              event.target.value
            )
          }
          placeholder="Download PDF"
          className={
            dark
              ? "mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/20"
              : "mt-3 w-full rounded-2xl border border-[#102A56]/10 bg-white px-4 py-3.5 text-sm text-[#10203A] outline-none"
          }
        />

      </div>

      {/* CURRENT DOCUMENT */}

      {document.existingUrl && (
        <div
          className={
            dark
              ? "mt-5 rounded-2xl border border-white/10 bg-white/5 p-4"
              : "mt-5 rounded-2xl border border-[#102A56]/10 bg-white p-4"
          }
        >

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex min-w-0 items-center gap-3">

              <div
                className={
                  dark
                    ? "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-white"
                    : "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#102A56]/5 text-[#102A56]"
                }
              >
                <FileText size={15} />
              </div>

              <div className="min-w-0">

                <p
                  className={
                    dark
                      ? "text-[8px] font-semibold uppercase tracking-[0.18em] text-white/30"
                      : "text-[8px] font-semibold uppercase tracking-[0.18em] text-[#102A56]/30"
                  }
                >
                  Current document
                </p>

                <p
                  className={
                    dark
                      ? "mt-1 truncate text-xs text-white/50"
                      : "mt-1 truncate text-xs text-[#10203A]/50"
                  }
                >
                  Existing uploaded PDF or link
                </p>

              </div>

            </div>

            <a
              href={
                document.existingUrl
              }
              target="_blank"
              rel="noreferrer"
              className={
                dark
                  ? "inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold !text-[#102A56]"
                  : "inline-flex shrink-0 items-center gap-2 rounded-full bg-[#102A56] px-4 py-2 text-xs font-semibold text-white"
              }
            >
              <ExternalLink
                size={13}
              />
              Open
            </a>

          </div>

        </div>
      )}

      {/* UPLOAD */}

      <div className="mt-5">

        <label
          className={
            dark
              ? "text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40"
              : "text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40"
          }
        >
          Upload / Replace PDF
        </label>

        <div
          className={
            dark
              ? "mt-3 rounded-2xl border border-dashed border-white/15 bg-white/5 p-4"
              : "mt-3 rounded-2xl border border-dashed border-[#102A56]/15 bg-white p-4"
          }
        >

          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={(event) =>
              onFileChange(
                index,
                event.target
                  .files?.[0] ||
                  null
              )
            }
            className={
              dark
                ? "block w-full text-sm text-white/60 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2.5 file:text-xs file:font-semibold file:!text-[#102A56]"
                : "block w-full text-sm text-[#10203A]/60 file:mr-4 file:rounded-full file:border-0 file:bg-[#102A56] file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-white"
            }
          />

          {document.file ? (

            <p
              className={
                dark
                  ? "mt-3 text-xs text-emerald-200"
                  : "mt-3 text-xs text-emerald-700"
              }
            >
              New PDF selected:
              {" "}
              <span className="font-semibold">
                {
                  document.file.name
                }
              </span>
            </p>

          ) : (

            <p
              className={
                dark
                  ? "mt-3 text-xs leading-5 text-white/30"
                  : "mt-3 text-xs leading-5 text-[#10203A]/35"
              }
            >
              Leave empty to keep the current document.
              Choose a PDF to replace it.
            </p>

          )}

        </div>

      </div>

      {/* EXTERNAL URL */}

      <div className="mt-5">

        <label
          className={
            dark
              ? "text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40"
              : "text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40"
          }
        >
          External URL
        </label>

        <input
          value={
            document.externalUrl
          }
          onChange={(event) =>
            onUpdate(
              index,
              "externalUrl",
              event.target.value
            )
          }
          placeholder="https://..."
          className={
            dark
              ? "mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/20"
              : "mt-3 w-full rounded-2xl border border-[#102A56]/10 bg-white px-4 py-3.5 text-sm text-[#10203A] outline-none"
          }
        />

        <p
          className={
            dark
              ? "mt-2 text-[10px] text-white/25"
              : "mt-2 text-[10px] text-[#10203A]/30"
          }
        >
          Use this only when the document is hosted externally.
        </p>

      </div>

    </div>
  );
}

