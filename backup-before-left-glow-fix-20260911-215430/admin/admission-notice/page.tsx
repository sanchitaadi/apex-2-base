"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Eye,
  EyeOff,
  FileText,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase/browser";

type AdmissionNotice = {
  id: string;
  title: string;
  session: string;
  eyebrow: string | null;
  description: string | null;
  admissions_status: string | null;
  classes_open: string | null;
  class_xi_status: string | null;
  stream_note: string | null;
  direct_admission_note: string | null;
  notice_image_url: string | null;
  notice_pdf_url: string | null;
  image_alt: string | null;
  button_text: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

type FormState = {
  title: string;
  session: string;
  eyebrow: string;
  description: string;
  admissions_status: string;
  classes_open: string;
  class_xi_status: string;
  stream_note: string;
  direct_admission_note: string;
  notice_image_url: string;
  notice_pdf_url: string;
  image_alt: string;
  button_text: string;
  sort_order: number;
  is_active: boolean;
};

/*
  IMPORTANT:
  This is the ONLY storage bucket used by this page.
  It is intentionally separate from all other school buckets.
*/
const BUCKET = "apex-admission-notices";

const EMPTY_FORM: FormState = {
  title: "",
  session: "",
  eyebrow: "Admissions Open",
  description: "",
  admissions_status: "",
  classes_open: "",
  class_xi_status: "",
  stream_note: "",
  direct_admission_note: "",
  notice_image_url: "",
  notice_pdf_url: "",
  image_alt: "Apex Public School Admission Notice",
  button_text: "View Admission Notice",
  sort_order: 0,
  is_active: true,
};

export default function AdminAdmissionNoticePage() {
  const [notices, setNotices] = useState<AdmissionNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    void loadNotices();
  }, []);

  async function loadNotices() {
    setLoading(true);

    const { data, error } = await supabase
      .from("admission_notices")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admission notices load error:", error);
      alert(`Unable to load admission notices.\n\n${error.message}`);
      setNotices([]);
    } else {
      setNotices((data ?? []) as AdmissionNotice[]);
    }

    setLoading(false);
  }

  function openAdd() {
    setEditingId(null);
    setImageFile(null);
    setPdfFile(null);
    setForm({
      ...EMPTY_FORM,
      sort_order: notices.length,
    });
    setShowForm(true);
  }

  function openEdit(item: AdmissionNotice) {
    setEditingId(item.id);
    setImageFile(null);
    setPdfFile(null);

    setForm({
      title: item.title ?? "",
      session: item.session ?? "",
      eyebrow: item.eyebrow ?? "",
      description: item.description ?? "",
      admissions_status: item.admissions_status ?? "",
      classes_open: item.classes_open ?? "",
      class_xi_status: item.class_xi_status ?? "",
      stream_note: item.stream_note ?? "",
      direct_admission_note: item.direct_admission_note ?? "",
      notice_image_url: item.notice_image_url ?? "",
      notice_pdf_url: item.notice_pdf_url ?? "",
      image_alt: item.image_alt || "Apex Public School Admission Notice",
      button_text: item.button_text || "View Admission Notice",
      sort_order: item.sort_order ?? 0,
      is_active: item.is_active,
    });

    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setImageFile(null);
    setPdfFile(null);
    setForm(EMPTY_FORM);
  }

  function getStoragePath(url: string | null) {
    if (!url) return null;

    const marker = `/storage/v1/object/public/${BUCKET}/`;
    const index = url.indexOf(marker);

    if (index === -1) return null;

    return decodeURIComponent(url.substring(index + marker.length));
  }

  async function uploadFile(file: File, folder: "images" | "pdf") {
    const extension =
      file.name.split(".").pop()?.toLowerCase() ||
      (folder === "pdf" ? "pdf" : "bin");

    const path = `${folder}/${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        upsert: false,
        cacheControl: "3600",
        contentType: file.type,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(path);

    if (!data.publicUrl) {
      throw new Error("Supabase did not return a public file URL.");
    }

    return {
      path,
      url: data.publicUrl,
    };
  }

  async function saveNotice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter a title.");
      return;
    }

    if (!form.session.trim()) {
      alert("Please enter the academic session.");
      return;
    }

    setSaving(true);

    try {
      let imageUrl = form.notice_image_url.trim();
      let pdfUrl = form.notice_pdf_url.trim();

      let oldImagePath: string | null = null;
      let oldPdfPath: string | null = null;

      if (editingId) {
        const current = notices.find((item) => item.id === editingId);

        oldImagePath = getStoragePath(current?.notice_image_url ?? null);
        oldPdfPath = getStoragePath(current?.notice_pdf_url ?? null);
      }

      if (imageFile) {
        if (!imageFile.type.startsWith("image/")) {
          throw new Error("The admission notice image must be an image file.");
        }

        const uploaded = await uploadFile(imageFile, "images");
        imageUrl = uploaded.url;
      }

      if (pdfFile) {
        if (pdfFile.type !== "application/pdf") {
          throw new Error("The admission notice must be a PDF file.");
        }

        const uploaded = await uploadFile(pdfFile, "pdf");
        pdfUrl = uploaded.url;
      }

      const payload = {
        title: form.title.trim(),
        session: form.session.trim(),
        eyebrow: form.eyebrow.trim() || null,
        description: form.description.trim() || null,
        admissions_status: form.admissions_status.trim() || null,
        classes_open: form.classes_open.trim() || null,
        class_xi_status: form.class_xi_status.trim() || null,
        stream_note: form.stream_note.trim() || null,
        direct_admission_note: form.direct_admission_note.trim() || null,
        notice_image_url: imageUrl || null,
        notice_pdf_url: pdfUrl || null,
        image_alt:
          form.image_alt.trim() || "Apex Public School Admission Notice",
        button_text:
          form.button_text.trim() || "View Admission Notice",
        sort_order: Number.isFinite(Number(form.sort_order))
          ? Number(form.sort_order)
          : 0,
        is_active: form.is_active,
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        const { error } = await supabase
          .from("admission_notices")
          .update(payload)
          .eq("id", editingId);

        if (error) throw new Error(error.message);

        if (imageFile && oldImagePath) {
          await supabase.storage.from(BUCKET).remove([oldImagePath]);
        }

        if (pdfFile && oldPdfPath) {
          await supabase.storage.from(BUCKET).remove([oldPdfPath]);
        }
      } else {
        const { error } = await supabase
          .from("admission_notices")
          .insert(payload);

        if (error) throw new Error(error.message);
      }

      closeForm();
      await loadNotices();
    } catch (error) {
      console.error("Admission notice save error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the notice."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisibility(item: AdmissionNotice) {
    setBusyId(item.id);

    const { error } = await supabase
      .from("admission_notices")
      .update({
        is_active: !item.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id);

    if (error) {
      alert(error.message);
    } else {
      await loadNotices();
    }

    setBusyId(null);
  }

  async function moveNotice(id: string, direction: "up" | "down") {
    const index = notices.findIndex((item) => item.id === id);
    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= notices.length) return;

    const current = notices[index];
    const target = notices[targetIndex];

    setBusyId(id);

    const first = await supabase
      .from("admission_notices")
      .update({
        sort_order: target.sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", current.id);

    if (first.error) {
      alert(first.error.message);
      setBusyId(null);
      return;
    }

    const second = await supabase
      .from("admission_notices")
      .update({
        sort_order: current.sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", target.id);

    if (second.error) {
      alert(second.error.message);
      setBusyId(null);
      return;
    }

    await loadNotices();
    setBusyId(null);
  }

  async function deleteNotice(item: AdmissionNotice) {
    if (!window.confirm(`Delete "${item.title}" for ${item.session}?`)) {
      return;
    }

    setBusyId(item.id);

    try {
      const imagePath = getStoragePath(item.notice_image_url);
      const pdfPath = getStoragePath(item.notice_pdf_url);

      if (imagePath) {
        await supabase.storage.from(BUCKET).remove([imagePath]);
      }

      if (pdfPath) {
        await supabase.storage.from(BUCKET).remove([pdfPath]);
      }

      const { error } = await supabase
        .from("admission_notices")
        .delete()
        .eq("id", item.id);

      if (error) throw new Error(error.message);

      await loadNotices();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Could not delete the admission notice."
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f5f2] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#102a56]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#102a56]">
              <FileText className="h-3.5 w-3.5" />
              Admissions CMS
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-[#102a56] sm:text-4xl">
              Admission Notice
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Manage admission content and optionally upload the official PDF.
              Published notices automatically appear on the public website.
            </p>
          </div>

          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#102a56] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0c2145]"
          >
            <Plus className="h-4 w-4" />
            Add Admission Notice
          </button>
        </div>

        <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          <strong>Storage:</strong> admission PDFs and images use the separate
          <code className="mx-1 rounded bg-white px-1.5 py-0.5">
            {BUCKET}
          </code>
          bucket.
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-[#102a56]" />
            </div>
          ) : notices.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <FileText className="h-10 w-10 text-[#102a56]" />
              <h2 className="mt-4 text-xl font-semibold text-[#102a56]">
                No admission notices
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Click “Add Admission Notice” to create one.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {notices.map((notice, index) => (
                <div key={notice.id} className="p-5 sm:p-6">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex min-w-0 gap-4">
                      {notice.notice_image_url ? (
                        <img
                          src={notice.notice_image_url}
                          alt={notice.image_alt || notice.title}
                          className="h-24 w-24 shrink-0 rounded-xl border border-slate-200 object-contain bg-slate-50 p-1"
                        />
                      ) : (
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-[#102a56]/10">
                          <ImageIcon className="h-7 w-7 text-[#102a56]" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                              notice.is_active
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {notice.is_active ? (
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

                          <span className="rounded-full bg-[#102a56]/10 px-2.5 py-1 text-xs font-semibold text-[#102a56]">
                            {notice.session}
                          </span>

                          {notice.notice_pdf_url && (
                            <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                              PDF attached
                            </span>
                          )}
                        </div>

                        <h2 className="mt-3 break-words text-lg font-semibold text-slate-900">
                          {notice.title}
                        </h2>

                        {notice.classes_open && (
                          <p className="mt-1 text-sm text-slate-500">
                            {notice.classes_open}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={index === 0 || busyId === notice.id}
                        onClick={() => void moveNotice(notice.id, "up")}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                        aria-label="Move notice up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        disabled={
                          index === notices.length - 1 ||
                          busyId === notice.id
                        }
                        onClick={() => void moveNotice(notice.id, "down")}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                        aria-label="Move notice down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        disabled={busyId === notice.id}
                        onClick={() => void toggleVisibility(notice)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        {notice.is_active ? (
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

                      <button
                        type="button"
                        onClick={() => openEdit(notice)}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#102a56] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0c2145]"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={busyId === notice.id}
                        onClick={() => void deleteNotice(notice)}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
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

      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4">
          <div className="mx-auto my-6 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-[#102a56]">
                  {editingId ? "Edit Admission Notice" : "Add Admission Notice"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Changes are saved to the CMS database.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={saveNotice}>
              <div className="max-h-[75vh] space-y-6 overflow-y-auto p-5 sm:p-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Title *">
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="Admission Notice 2026-27"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Academic Session *">
                    <input
                      type="text"
                      value={form.session}
                      onChange={(e) =>
                        setForm({ ...form, session: e.target.value })
                      }
                      placeholder="2026-2027"
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field label="Eyebrow">
                  <input
                    type="text"
                    value={form.eyebrow}
                    onChange={(e) =>
                      setForm({ ...form, eyebrow: e.target.value })
                    }
                    placeholder="Admissions Open"
                    className={inputClass}
                  />
                </Field>

                <Field label="Description">
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Admission information..."
                    className={inputClass}
                  />
                </Field>

                <div className="rounded-2xl border border-[#ddd9d1] bg-[#f8f6f1] p-5">
                  <h3 className="mb-5 text-base font-semibold text-[#102a56]">
                    Admission Details
                  </h3>

                  <div className="space-y-5">
                    <Field label="Admission Status">
                      <input
                        type="text"
                        value={form.admissions_status}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            admissions_status: e.target.value,
                          })
                        }
                        placeholder="ADMISSIONS OPEN"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Classes Open">
                      <input
                        type="text"
                        value={form.classes_open}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            classes_open: e.target.value,
                          })
                        }
                        placeholder="Classes I to IX : Open"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Class XI Status">
                      <input
                        type="text"
                        value={form.class_xi_status}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            class_xi_status: e.target.value,
                          })
                        }
                        placeholder="Class XI : Dates will be announced later."
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Stream Note">
                      <input
                        type="text"
                        value={form.stream_note}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            stream_note: e.target.value,
                          })
                        }
                        placeholder="All Streams"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Direct Admission Note">
                      <textarea
                        rows={3}
                        value={form.direct_admission_note}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            direct_admission_note:
                              e.target.value,
                          })
                        }
                        placeholder="Direct Admission to Classes X & XII..."
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="mb-1 text-base font-semibold text-[#102a56]">
                    Notice Files
                  </h3>
                  <p className="mb-5 text-xs leading-5 text-slate-500">
                    You do not have to upload anything while creating the
                    notice. Add the PDF whenever you are ready.
                  </p>

                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Admission Notice Image
                      </label>

                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center hover:bg-slate-100">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#102a56]/10">
                          <Upload className="h-5 w-5 text-[#102a56]" />
                        </div>

                        <span className="text-sm font-semibold text-slate-800">
                          {imageFile
                            ? imageFile.name
                            : "Choose image (optional)"}
                        </span>

                        <span className="mt-1 text-xs text-slate-500">
                          JPG, PNG or WebP
                        </span>

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            setImageFile(e.target.files?.[0] ?? null)
                          }
                        />
                      </label>

                      {form.notice_image_url && !imageFile && (
                        <p className="mt-2 text-xs text-emerald-700">
                          Existing image will be kept unless you upload a new
                          one.
                        </p>
                      )}
                    </div>

                    <Field label="External Notice Image URL">
                      <input
                        type="url"
                        value={form.notice_image_url}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            notice_image_url: e.target.value,
                          })
                        }
                        placeholder="https://..."
                        className={inputClass}
                      />
                    </Field>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Official Admission PDF
                      </label>

                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center hover:bg-slate-100">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#102a56]/10">
                          <FileText className="h-5 w-5 text-[#102a56]" />
                        </div>

                        <span className="text-sm font-semibold text-slate-800">
                          {pdfFile
                            ? pdfFile.name
                            : "Choose PDF (optional)"}
                        </span>

                        <span className="mt-1 text-xs text-slate-500">
                          PDF only
                        </span>

                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;

                            if (file && file.type !== "application/pdf") {
                              alert("Please select a PDF file.");
                              e.target.value = "";
                              return;
                            }

                            setPdfFile(file);
                          }}
                        />
                      </label>

                      {form.notice_pdf_url && !pdfFile && (
                        <p className="mt-2 text-xs text-emerald-700">
                          Existing PDF will be kept unless you upload a new
                          one.
                        </p>
                      )}
                    </div>

                    <Field label="External PDF URL">
                      <input
                        type="url"
                        value={form.notice_pdf_url}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            notice_pdf_url: e.target.value,
                          })
                        }
                        placeholder="https://..."
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Image Alt Text">
                    <input
                      type="text"
                      value={form.image_alt}
                      onChange={(e) =>
                        setForm({ ...form, image_alt: e.target.value })
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Button Text">
                    <input
                      type="text"
                      value={form.button_text}
                      onChange={(e) =>
                        setForm({ ...form, button_text: e.target.value })
                      }
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Display Order">
                    <input
                      type="number"
                      min="0"
                      value={form.sort_order}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          sort_order: Number(e.target.value) || 0,
                        })
                      }
                      className={inputClass}
                    />
                  </Field>

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
                        Turn this off to save the notice without publishing it.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

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
                      {editingId ? "Save Changes" : "Add Notice"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#102a56] focus:ring-2 focus:ring-[#102a56]/10";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}
