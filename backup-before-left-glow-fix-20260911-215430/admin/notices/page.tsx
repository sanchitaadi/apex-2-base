"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Save,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase/browser";

const NOTICE_BUCKET = "apex-notices";

type Notice = {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string | null;
  content: string | null;
  notice_date: string;
  expiry_date: string | null;
  document_url: string | null;
  image_url: string | null;
  external_url: string | null;
  is_pinned: boolean;
  is_active: boolean;
  sort_order: number;
};

const categories = [
  "General",
  "Academic",
  "Admission",
  "Holiday",
  "PTA",
  "Examination",
  "Sports",
  "Event",
  "Circular",
];

const emptyNotice: Notice = {
  id: "",
  title: "",
  slug: "",
  category: "General",
  short_description: "",
  content: "",
  notice_date: new Date().toISOString().slice(0, 10),
  expiry_date: null,
  document_url: "",
  image_url: "",
  external_url: "",
  is_pinned: false,
  is_active: true,
  sort_order: 0,
};

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NoticesAdminPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [editing, setEditing] = useState<Notice | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"image" | "pdf" | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    void loadNotices();
  }, []);

  async function loadNotices() {
    setLoading(true);
    setError("");

    const { data, error: loadError } = await supabase
      .from("notices")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("notice_date", { ascending: false });

    if (loadError) {
      console.error("Notices load error:", loadError);
      setError(loadError.message);
      setLoading(false);
      return;
    }

    setNotices(
      (data || []).map((row: any, index: number) => ({
        id: String(row.id ?? ""),
        title: String(row.title ?? ""),
        slug: String(row.slug ?? makeSlug(row.title ?? `notice-${index + 1}`)),
        category: String(row.category ?? "General"),
        short_description:
          row.short_description ?? row.description ?? row.summary ?? null,
        content: row.content ?? row.description ?? null,
        notice_date:
          row.notice_date ??
          (typeof row.created_at === "string"
            ? row.created_at.slice(0, 10)
            : new Date().toISOString().slice(0, 10)),
        expiry_date: row.expiry_date ?? null,
        document_url: row.document_url ?? null,
        image_url: row.image_url ?? null,
        external_url: row.external_url ?? null,
        is_pinned: Boolean(row.is_pinned),
        is_active:
          row.is_active === undefined ? true : Boolean(row.is_active),
        sort_order: Number(row.sort_order ?? index),
      })),
    );

    setLoading(false);
  }

  function startNew() {
    setEditing({
      ...emptyNotice,
      sort_order: notices.length,
      notice_date: new Date().toISOString().slice(0, 10),
    });
    setMessage("");
    setError("");
  }

  function editNotice(notice: Notice) {
    setEditing({ ...notice });
    setMessage("");
    setError("");
  }

  function updateField(
    field: keyof Notice,
    value: string | number | boolean | null,
  ) {
    setEditing((current) => {
      if (!current) return null;

      return {
        ...current,
        [field]: value,
      };
    });
  }

  async function uploadAsset(
    event: ChangeEvent<HTMLInputElement>,
    type: "image" | "pdf",
  ) {
    const file = event.target.files?.[0];

    if (!file || !editing) {
      event.target.value = "";
      return;
    }

    const isImage = type === "image";
    const valid =
      isImage
        ? file.type.startsWith("image/")
        : file.type === "application/pdf" ||
          file.name.toLowerCase().endsWith(".pdf");

    if (!valid) {
      setError(
        isImage
          ? "Please select an image file."
          : "Please select a PDF file.",
      );
      event.target.value = "";
      return;
    }

    const maxBytes = isImage
      ? 15 * 1024 * 1024
      : 25 * 1024 * 1024;

    if (file.size > maxBytes) {
      setError(
        isImage
          ? "Image must be smaller than 15MB."
          : "PDF must be smaller than 25MB.",
      );
      event.target.value = "";
      return;
    }

    setUploading(type);
    setMessage("");
    setError("");

    try {
      const extension = isImage
        ? file.name.split(".").pop()?.toLowerCase() || "jpg"
        : "pdf";

      const cleanName =
        file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[^a-zA-Z0-9-_]/g, "-")
          .toLowerCase()
          .slice(0, 80) || (isImage ? "notice-image" : "notice");

      const folder = isImage ? "images" : "documents";
      const path = `${folder}/${Date.now()}-${cleanName}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(NOTICE_BUCKET)
        .upload(path, file, {
          upsert: false,
          cacheControl: "3600",
          contentType: isImage ? file.type : "application/pdf",
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(NOTICE_BUCKET)
        .getPublicUrl(path);

      updateField(
        isImage ? "image_url" : "document_url",
        data.publicUrl,
      );

      setMessage(
        isImage
          ? "Notice image uploaded. Click Save notice."
          : "Notice PDF uploaded. Click Save notice.",
      );
    } catch (uploadError: any) {
      console.error("Notice upload error:", uploadError);

      const uploadMessage =
        uploadError?.message || "Could not upload file.";

      if (
        String(uploadMessage).toLowerCase().includes("bucket not found")
      ) {
        setError(
          'Storage bucket "apex-notices" was not found. Create this exact bucket in the same Supabase project used by the website.',
        );
      } else {
        setError(uploadMessage);
      }
    } finally {
      setUploading(null);
      event.target.value = "";
    }
  }

  async function saveNotice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editing) return;

    if (!editing.title.trim()) {
      setError("Notice title is required.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        title: editing.title.trim(),
        slug: editing.slug.trim() || makeSlug(editing.title),
        category: editing.category.trim() || "General",
        short_description:
          editing.short_description?.trim() || null,
        content: editing.content?.trim() || null,
        notice_date:
          editing.notice_date || new Date().toISOString().slice(0, 10),
        expiry_date: editing.expiry_date || null,
        document_url: editing.document_url?.trim() || null,
        image_url: editing.image_url?.trim() || null,
        external_url: editing.external_url?.trim() || null,
        is_pinned: Boolean(editing.is_pinned),
        is_active: Boolean(editing.is_active),
        sort_order: Number(editing.sort_order || 0),
        updated_at: new Date().toISOString(),
      };

      if (editing.id) {
        const { error: updateError } = await supabase
          .from("notices")
          .update(payload)
          .eq("id", editing.id);

        if (updateError) throw updateError;

        setMessage("Notice updated successfully.");
      } else {
        const { error: insertError } = await supabase
          .from("notices")
          .insert(payload);

        if (insertError) throw insertError;

        setMessage("Notice created successfully.");
      }

      setEditing(null);
      await loadNotices();
    } catch (saveError: any) {
      console.error("Notice save error:", saveError);
      setError(
        saveError?.message || "Could not save notice.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteNotice(notice: Notice) {
    if (!window.confirm(`Delete "${notice.title}"?`)) return;

    const { error: deleteError } = await supabase
      .from("notices")
      .delete()
      .eq("id", notice.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setMessage("Notice deleted.");
    await loadNotices();
  }

  async function toggleNotice(notice: Notice) {
    const { error: toggleError } = await supabase
      .from("notices")
      .update({
        is_active: !notice.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", notice.id);

    if (toggleError) {
      setError(toggleError.message);
      return;
    }

    await loadNotices();
  }

  async function togglePinned(notice: Notice) {
    const { error: pinError } = await supabase
      .from("notices")
      .update({
        is_pinned: !notice.is_pinned,
        updated_at: new Date().toISOString(),
      })
      .eq("id", notice.id);

    if (pinError) {
      setError(pinError.message);
      return;
    }

    await loadNotices();
  }

  async function moveNotice(
    notice: Notice,
    direction: "up" | "down",
  ) {
    const index = notices.findIndex((item) => item.id === notice.id);
    if (index === -1) return;

    const targetIndex =
      direction === "up" ? index - 1 : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= notices.length
    ) {
      return;
    }

    const target = notices[targetIndex];

    const [first, second] = await Promise.all([
      supabase
        .from("notices")
        .update({
          sort_order: target.sort_order,
          updated_at: new Date().toISOString(),
        })
        .eq("id", notice.id),

      supabase
        .from("notices")
        .update({
          sort_order: notice.sort_order,
          updated_at: new Date().toISOString(),
        })
        .eq("id", target.id),
    ]);

    if (first.error || second.error) {
      setError(
        first.error?.message ||
          second.error?.message ||
          "Could not reorder notices.",
      );
      return;
    }

    await loadNotices();
  }

  const filteredNotices = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notices;

    return notices.filter((notice) =>
      [
        notice.title,
        notice.slug,
        notice.category,
        notice.short_description || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [notices, search]);

  return (
    <main className="min-h-screen bg-[#071A38] text-white">
      <div className="border-b border-white/10 bg-[#0B2146]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-6 py-6 md:px-10">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">
              Apex CMS
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
              Notice Management
            </h1>
            <p className="mt-2 text-xs text-white/35">
              Image + PDF uploads use the <strong>apex-notices</strong> bucket.
            </p>
          </div>

          <button
            type="button"
            onClick={startNew}
            className="inline-flex items-center gap-2 rounded-full bg-[#F5F0E6] px-5 py-3 text-sm font-semibold !text-[#102A56] transition hover:bg-white"
          >
            <Plus size={16} className="!text-[#102A56]" />
            <span className="!text-[#102A56]">
              Add notice
            </span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-6 py-10 md:px-10">
        {message && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            <Check size={16} />
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Published and draft notices
            </h2>
            <p className="mt-1 text-xs text-white/35">
              Upload a photo and the official PDF for every notice.
            </p>
          </div>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search notices..."
            className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/25 md:w-80"
          />
        </div>

        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Loader2
              size={28}
              className="animate-spin text-white/35"
            />
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-12 text-center">
            <FileText
              size={30}
              className="mx-auto text-white/25"
            />
            <p className="mt-4 text-sm text-white/40">
              No notices found.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredNotices.map((notice, index) => (
              <article
                key={notice.id}
                className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035]"
              >
                <div className="flex flex-col gap-5 p-5 md:p-6">
                  <div className="flex flex-col gap-5 md:flex-row md:items-start">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white/[0.05]">
                      {notice.image_url ? (
                        <img
                          src={notice.image_url}
                          alt={notice.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-xs text-white/25">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#F5F0E6]/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] text-[#F5F0E6]/65">
                          {notice.category}
                        </span>

                        {notice.is_pinned && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-300/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] text-amber-200">
                            <Star size={10} fill="currentColor" />
                            Pinned
                          </span>
                        )}

                        {!notice.is_active && (
                          <span className="rounded-full bg-red-400/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] text-red-200">
                            Hidden
                          </span>
                        )}

                        {notice.document_url && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-300/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] text-emerald-200">
                            <FileText size={10} />
                            PDF
                          </span>
                        )}
                      </div>

                      <h2 className="mt-3 text-lg font-semibold md:text-xl">
                        {notice.title}
                      </h2>

                      {notice.short_description && (
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
                          {notice.short_description}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-4 text-[10px] text-white/25">
                        <span>
                          Notice date: {notice.notice_date}
                        </span>

                        {notice.expiry_date && (
                          <span>
                            Expires: {notice.expiry_date}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={() =>
                        void moveNotice(notice, "up")
                      }
                      disabled={index === 0}
                      className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-white/40 hover:bg-white/10 disabled:opacity-20"
                    >
                      <ArrowUp size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        void moveNotice(notice, "down")
                      }
                      disabled={
                        index === filteredNotices.length - 1
                      }
                      className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-white/40 hover:bg-white/10 disabled:opacity-20"
                    >
                      <ArrowDown size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => editNotice(notice)}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-white/65 hover:bg-white/10 hover:text-white"
                    >
                      <Pencil size={13} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => void togglePinned(notice)}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-white/50 hover:bg-white/10 hover:text-white"
                    >
                      <Star
                        size={13}
                        fill={
                          notice.is_pinned
                            ? "currentColor"
                            : "none"
                        }
                      />
                      {notice.is_pinned ? "Unpin" : "Pin"}
                    </button>

                    <button
                      type="button"
                      onClick={() => void toggleNotice(notice)}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-white/50 hover:bg-white/10 hover:text-white"
                    >
                      {notice.is_active ? (
                        <EyeOff size={13} />
                      ) : (
                        <Eye size={13} />
                      )}
                      {notice.is_active ? "Hide" : "Publish"}
                    </button>

                    {notice.document_url && (
                      <a
                        href={notice.document_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-white/50 hover:bg-white/10 hover:text-white"
                      >
                        <FileText size={13} />
                        PDF
                      </a>
                    )}

                    {notice.external_url && (
                      <a
                        href={notice.external_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-white/50 hover:bg-white/10 hover:text-white"
                      >
                        <ExternalLink size={13} />
                        Link
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => void deleteNotice(notice)}
                      className="grid h-9 w-9 place-items-center rounded-xl border border-red-400/10 text-red-200/45 hover:bg-red-400/10 hover:text-red-200"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[500] overflow-y-auto bg-black/75 p-4 backdrop-blur-sm md:p-8">
          <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-[#0B2146] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-8">
              <div>
                <p className="text-[9px] uppercase tracking-[0.28em] text-white/30">
                  Notices CMS
                </p>
                <h2 className="mt-1 text-xl font-semibold">
                  {editing.id ? "Edit notice" : "Create notice"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setEditing(null)}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/45 hover:bg-white/10 hover:text-white"
              >
                <X size={17} />
              </button>
            </div>

            <form
              onSubmit={saveNotice}
              className="space-y-6 p-6 md:p-8"
            >
              <div>
                <label className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  Notice title
                </label>
                <input
                  value={editing.title}
                  onChange={(event) => {
                    updateField(
                      "title",
                      event.target.value,
                    );

                    if (!editing.id) {
                      updateField(
                        "slug",
                        makeSlug(event.target.value),
                      );
                    }
                  }}
                  className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/20"
                  placeholder="Summer Vacation Notice 2026"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
                    Slug
                  </label>
                  <input
                    value={editing.slug}
                    onChange={(event) =>
                      updateField(
                        "slug",
                        event.target.value,
                      )
                    }
                    className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
                    Category
                  </label>
                  <select
                    value={editing.category}
                    onChange={(event) =>
                      updateField(
                        "category",
                        event.target.value,
                      )
                    }
                    className="mt-3 w-full rounded-xl border border-white/10 bg-[#0B2146] px-4 py-3.5 text-sm text-white outline-none"
                  >
                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  Short description
                </label>
                <textarea
                  rows={3}
                  value={editing.short_description || ""}
                  onChange={(event) =>
                    updateField(
                      "short_description",
                      event.target.value,
                    )
                  }
                  className="mt-3 w-full resize-y rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/20"
                />
              </div>

              <div>
                <label className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  Full notice content
                </label>
                <textarea
                  rows={9}
                  value={editing.content || ""}
                  onChange={(event) =>
                    updateField(
                      "content",
                      event.target.value,
                    )
                  }
                  className="mt-3 w-full resize-y rounded-xl border border-white/10 bg-white/[0.035] px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-white/20"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
                    Notice date
                  </label>
                  <input
                    type="date"
                    value={editing.notice_date}
                    onChange={(event) =>
                      updateField(
                        "notice_date",
                        event.target.value,
                      )
                    }
                    className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
                    Expiry date
                  </label>
                  <input
                    type="date"
                    value={editing.expiry_date || ""}
                    onChange={(event) =>
                      updateField(
                        "expiry_date",
                        event.target.value || null,
                      )
                    }
                    className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3.5 text-sm text-white outline-none"
                  />
                </div>
              </div>

              {/* IMAGE */}
              <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                <div className="flex items-center gap-3">
                  <ImageIcon
                    size={18}
                    className="text-[#F5F0E6]"
                  />
                  <div>
                    <h3 className="font-semibold">
                      Notice image
                    </h3>
                    <p className="text-xs text-white/35">
                      Bucket: apex-notices / images
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-[240px_1fr]">
                  <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                    {editing.image_url ? (
                      <img
                        src={editing.image_url}
                        alt={editing.title || "Notice image"}
                        className="h-60 w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-60 place-items-center text-xs text-white/25">
                        No notice image
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#F5F0E6] px-4 py-3 text-sm font-semibold !text-[#102A56] hover:bg-white">
                      {uploading === "image" ? (
                        <>
                          <Loader2
                            size={15}
                            className="animate-spin !text-[#102A56]"
                          />
                          <span className="!text-[#102A56]">
                            Uploading...
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload
                            size={15}
                            className="!text-[#102A56]"
                          />
                          <span className="!text-[#102A56]">
                            Upload image
                          </span>
                        </>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={Boolean(uploading)}
                        onChange={(event) =>
                          void uploadAsset(event, "image")
                        }
                      />
                    </label>

                    <input
                      type="url"
                      value={editing.image_url || ""}
                      onChange={(event) =>
                        updateField(
                          "image_url",
                          event.target.value,
                        )
                      }
                      placeholder="Or paste image URL"
                      className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20"
                    />

                    {editing.image_url && (
                      <button
                        type="button"
                        onClick={() =>
                          updateField("image_url", "")
                        }
                        className="mt-3 text-xs font-semibold text-red-200"
                      >
                        Remove image
                      </button>
                    )}
                  </div>
                </div>
              </section>

              {/* PDF */}
              <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                <div className="flex items-center gap-3">
                  <FileText
                    size={18}
                    className="text-[#F5F0E6]"
                  />
                  <div>
                    <h3 className="font-semibold">
                      Notice PDF
                    </h3>
                    <p className="text-xs text-white/35">
                      Bucket: apex-notices / documents
                    </p>
                  </div>
                </div>

                <label className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#F5F0E6] px-4 py-3 text-sm font-semibold !text-[#102A56] hover:bg-white">
                  {uploading === "pdf" ? (
                    <>
                      <Loader2
                        size={15}
                        className="animate-spin !text-[#102A56]"
                      />
                      <span className="!text-[#102A56]">
                        Uploading PDF...
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload
                        size={15}
                        className="!text-[#102A56]"
                      />
                      <span className="!text-[#102A56]">
                        Upload PDF
                      </span>
                    </>
                  )}

                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    className="hidden"
                    disabled={Boolean(uploading)}
                    onChange={(event) =>
                      void uploadAsset(event, "pdf")
                    }
                  />
                </label>

                <input
                  type="url"
                  value={editing.document_url || ""}
                  onChange={(event) =>
                    updateField(
                      "document_url",
                      event.target.value,
                    )
                  }
                  placeholder="Or paste PDF URL"
                  className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/20"
                />

                {editing.document_url && (
                  <div className="mt-3 flex flex-wrap gap-3">
                    <a
                      href={editing.document_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-[#F5F0E6]"
                    >
                      <Eye size={13} />
                      Preview PDF
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        updateField(
                          "document_url",
                          null,
                        )
                      }
                      className="text-xs font-semibold text-red-200"
                    >
                      Remove PDF
                    </button>
                  </div>
                )}
              </section>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
                    External link
                  </label>
                  <input
                    type="url"
                    value={editing.external_url || ""}
                    onChange={(event) =>
                      updateField(
                        "external_url",
                        event.target.value,
                      )
                    }
                    className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
                    Display order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editing.sort_order}
                    onChange={(event) =>
                      updateField(
                        "sort_order",
                        Number(event.target.value),
                      )
                    }
                    className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3.5 text-sm text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    updateField(
                      "is_active",
                      !editing.is_active,
                    )
                  }
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-4 py-4 text-sm"
                >
                  <div className="text-left">
                    <p className="text-white/75">
                      Published
                    </p>
                    <p className="mt-1 text-[10px] text-white/25">
                      Visible on website
                    </p>
                  </div>

                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      editing.is_active
                        ? "bg-emerald-300"
                        : "bg-white/20"
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateField(
                      "is_pinned",
                      !editing.is_pinned,
                    )
                  }
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-4 py-4 text-sm"
                >
                  <div className="text-left">
                    <p className="text-white/75">
                      Pin notice
                    </p>
                    <p className="mt-1 text-[10px] text-white/25">
                      Keep it at the top
                    </p>
                  </div>

                  <Star
                    size={17}
                    className={
                      editing.is_pinned
                        ? "text-amber-200"
                        : "text-white/20"
                    }
                    fill={
                      editing.is_pinned
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm text-white/50 hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || Boolean(uploading)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F5F0E6] px-6 py-3 text-sm font-semibold text-[#102A56] hover:bg-white disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={15} />
                      Save notice
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
