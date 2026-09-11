"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
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

type Activity = {
  id: string;
  title: string;
  slug: string | null;
  category: string;
  description: string | null;
  image_url: string | null;
  event_date: string | null;
  external_url: string | null;
  document_url: string | null;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type FormState = {
  id: string | null;
  title: string;
  category: string;
  description: string;
  event_date: string;
  external_url: string;
  document_url: string;
  image_url: string;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
};

const BUCKET = "gallery";
const IMAGE_PREFIX = "activities";

const CATEGORIES = [
  { value: "general", label: "General Activities" },
  { value: "cultural", label: "Cultural Activities" },
  { value: "sports", label: "Sports & Games" },
  { value: "excursions", label: "Educational Excursions" },
  { value: "life-skills", label: "Life Skills" },
  { value: "arts", label: "Art, Music & Dance" },
  { value: "projects", label: "Projects & Experiential Learning" },
  { value: "workshops", label: "Workshops & Training" },
  { value: "social", label: "Social Awareness" },
  { value: "competitions", label: "Competitions" },
];

const EMPTY_FORM: FormState = {
  id: null,
  title: "",
  category: "general",
  description: "",
  event_date: "",
  external_url: "",
  document_url: "",
  image_url: "",
  sort_order: 0,
  is_featured: false,
  is_active: true,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function makeStoragePath(file: File) {
  const extension =
    file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ||
    "jpg";

  return `${IMAGE_PREFIX}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
}

function getPublicStorageUrl(path: string) {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function getStoragePathFromUrl(url: string | null) {
  if (!url) return null;

  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);

  if (index === -1) return null;

  return url.substring(index + marker.length);
}

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);

  const nextSortOrder = useMemo(() => {
    if (!activities.length) return 1;

    return (
      Math.max(
        ...activities.map((activity) => Number(activity.sort_order) || 0)
      ) + 1
    );
  }, [activities]);

  async function loadActivities() {
    setLoading(true);

    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert(`Could not load activities: ${error.message}`);
      setActivities([]);
    } else {
      setActivities((data || []) as Activity[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadActivities();
  }, []);

  function startNew() {
    setForm({
      ...EMPTY_FORM,
      sort_order: nextSortOrder,
    });
    setShowForm(true);
  }

  function startEdit(activity: Activity) {
    setForm({
      id: activity.id,
      title: activity.title,
      category: activity.category || "general",
      description: activity.description || "",
      event_date: activity.event_date || "",
      external_url: activity.external_url || "",
      document_url: activity.document_url || "",
      image_url: activity.image_url || "",
      sort_order: activity.sort_order || 0,
      is_featured: activity.is_featured,
      is_active: activity.is_active,
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function closeForm() {
    if (saving || uploadingImage || uploadingDocument) return;

    setShowForm(false);
    setForm(EMPTY_FORM);
  }

  async function handleImageUpload(file: File | undefined) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Please keep the image below 10 MB.");
      return;
    }

    setUploadingImage(true);

    try {
      const path = makeStoragePath(file);

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const publicUrl = getPublicStorageUrl(path);

      setForm((current) => ({
        ...current,
        image_url: publicUrl,
      }));
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to upload the image."
      );
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleDocumentUpload(file: File | undefined) {
    if (!file) return;

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      alert("Please select a PDF file.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert("Please keep the PDF below 50 MB.");
      return;
    }

    setUploadingDocument(true);

    try {
      const extension = "pdf";
      const path = `${IMAGE_PREFIX}/documents/${Date.now()}-${crypto.randomUUID()}.${extension}`;

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: "application/pdf",
        });

      if (error) {
        throw error;
      }

      const publicUrl = getPublicStorageUrl(path);

      setForm((current) => ({
        ...current,
        document_url: publicUrl,
      }));
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to upload the PDF."
      );
    } finally {
      setUploadingDocument(false);
    }
  }

  async function saveActivity() {
    if (!form.title.trim()) {
      alert("Activity title is required.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        slug: slugify(form.title),
        category: form.category || "general",
        description: form.description.trim() || null,
        image_url: form.image_url.trim() || null,
        event_date: form.event_date || null,
        external_url: form.external_url.trim() || null,
        document_url: form.document_url.trim() || null,
        sort_order: Number(form.sort_order) || 0,
        is_featured: Boolean(form.is_featured),
        is_active: Boolean(form.is_active),
        updated_at: new Date().toISOString(),
      };

      if (form.id) {
        const { error } = await supabase
          .from("activities")
          .update(payload)
          .eq("id", form.id);

        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase.from("activities").insert({
          ...payload,
          created_at: new Date().toISOString(),
        });

        if (error) {
          throw error;
        }
      }

      await loadActivities();
      setShowForm(false);
      setForm(EMPTY_FORM);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to save the activity."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(activity: Activity) {
    const { error } = await supabase
      .from("activities")
      .update({
        is_active: !activity.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", activity.id);

    if (error) {
      alert(error.message);
      return;
    }

    setActivities((current) =>
      current.map((item) =>
        item.id === activity.id
          ? { ...item, is_active: !item.is_active }
          : item
      )
    );
  }

  async function toggleFeatured(activity: Activity) {
    const { error } = await supabase
      .from("activities")
      .update({
        is_featured: !activity.is_featured,
        updated_at: new Date().toISOString(),
      })
      .eq("id", activity.id);

    if (error) {
      alert(error.message);
      return;
    }

    setActivities((current) =>
      current.map((item) =>
        item.id === activity.id
          ? { ...item, is_featured: !item.is_featured }
          : item
      )
    );
  }

  async function moveActivity(activity: Activity, direction: -1 | 1) {
    const index = activities.findIndex((item) => item.id === activity.id);
    const targetIndex = index + direction;

    if (index < 0 || targetIndex < 0 || targetIndex >= activities.length) {
      return;
    }

    const target = activities[targetIndex];

    const firstSort = activity.sort_order;
    const secondSort = target.sort_order;

    const { error: firstError } = await supabase
      .from("activities")
      .update({
        sort_order: secondSort,
        updated_at: new Date().toISOString(),
      })
      .eq("id", activity.id);

    if (firstError) {
      alert(firstError.message);
      return;
    }

    const { error: secondError } = await supabase
      .from("activities")
      .update({
        sort_order: firstSort,
        updated_at: new Date().toISOString(),
      })
      .eq("id", target.id);

    if (secondError) {
      alert(secondError.message);
      await loadActivities();
      return;
    }

    await loadActivities();
  }

  async function deleteActivity(activity: Activity) {
    const confirmed = window.confirm(
      `Delete "${activity.title}" permanently?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("activities")
      .delete()
      .eq("id", activity.id);

    if (error) {
      alert(error.message);
      return;
    }

    const imagePath = getStoragePathFromUrl(activity.image_url);

    if (imagePath) {
      await supabase.storage.from(BUCKET).remove([imagePath]);
    }

    const documentPath = getStoragePathFromUrl(activity.document_url);

    if (documentPath) {
      await supabase.storage.from(BUCKET).remove([documentPath]);
    }

    setActivities((current) =>
      current.filter((item) => item.id !== activity.id)
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f0e6] px-5 py-8 text-[#102a56] md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="flex flex-col gap-5 border-b border-[#102a56]/10 pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#102a56]/50">
              Website Content
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.035em]">
              Activities
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#102a56]/60">
              Manage the activities displayed on the public Activities page.
            </p>
          </div>

         <button
  type="button"
  onClick={startNew}
  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#102a56] px-6 py-3 text-sm font-semibold text-[#f5f0e6] transition hover:bg-[#193c78]"
>
  <Plus className="h-4 w-4 text-[#f5f0e6]" />
  <span className="text-[#f5f0e6]">Add Activity</span>
</button>
        </div>

        {/* FORM */}
        {showForm && (
          <section className="mt-8 rounded-[30px] border border-[#102a56]/10 bg-white/65 p-6 shadow-[0_20px_70px_rgba(16,42,86,0.07)] md:p-8">
            <div className="flex items-center justify-between gap-4 border-b border-[#102a56]/10 pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#102a56]/45">
                  {form.id ? "Edit activity" : "New activity"}
                </p>

                <h2 className="mt-1 text-2xl font-semibold">
                  {form.id ? "Update activity" : "Create activity"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#102a56]/10 bg-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-7 grid gap-6 lg:grid-cols-2">
              {/* TITLE */}
              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-semibold">
                  Activity Title *
                </label>

                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="e.g. Annual Day Celebration"
                  className="w-full rounded-2xl border border-[#102a56]/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#102a56]/45"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      category: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-[#102a56]/15 bg-white px-4 py-3 text-sm outline-none"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* DATE */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Event Date
                </label>

                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#102a56]/40" />

                  <input
                    type="date"
                    value={form.event_date}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        event_date: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-[#102a56]/15 bg-white py-3 pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-semibold">
                  Description
                </label>

                <textarea
                  rows={6}
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Describe the activity..."
                  className="w-full resize-y rounded-2xl border border-[#102a56]/15 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-[#102a56]/45"
                />
              </div>

              {/* IMAGE */}
              <div className="lg:col-span-2 rounded-2xl border border-[#102a56]/10 bg-white/70 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-semibold">Activity Image</p>
                    <p className="mt-1 text-xs leading-5 text-[#102a56]/50">
                      Recommended: landscape image, preferably 1600 × 1000 or
                      larger.
                    </p>
                  </div>

                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#102a56] px-4 py-2.5 text-sm font-semibold text-[#f5f0e6]">
                    {uploadingImage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}

                    {uploadingImage ? "Uploading..." : "Upload Image"}

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingImage}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        void handleImageUpload(file);
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-[180px_1fr]">
                  <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-[#102a56]/5">
                    {form.image_url ? (
                      <img
                        src={form.image_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-[#102a56]/20" />
                      </div>
                    )}
                  </div>

                  <input
                    value={form.image_url}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        image_url: event.target.value,
                      }))
                    }
                    placeholder="Or paste image URL"
                    className="h-fit w-full rounded-2xl border border-[#102a56]/15 bg-white px-4 py-3 text-sm outline-none"
                  />
                </div>
              </div>

              {/* DOCUMENT */}
              <div className="lg:col-span-2 rounded-2xl border border-[#102a56]/10 bg-white/70 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold">Related PDF</p>
                    <p className="mt-1 text-xs text-[#102a56]/50">
                      Optional supporting document.
                    </p>
                  </div>

                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#102a56] px-4 py-2.5 text-sm font-semibold text-[#f5f0e6]">
                    {uploadingDocument ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}

                    {uploadingDocument ? "Uploading..." : "Upload PDF"}

                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      className="hidden"
                      disabled={uploadingDocument}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        void handleDocumentUpload(file);
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>
                </div>

                <div className="mt-4">
                  <input
                    value={form.document_url}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        document_url: event.target.value,
                      }))
                    }
                    placeholder="Or paste PDF URL"
                    className="w-full rounded-2xl border border-[#102a56]/15 bg-white px-4 py-3 text-sm outline-none"
                  />
                </div>

                {form.document_url && (
                  <a
                    href={form.document_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold underline"
                  >
                    <FileText className="h-4 w-4" />
                    Open current document
                  </a>
                )}
              </div>

              {/* EXTERNAL URL */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Related Link
                </label>

                <input
                  type="url"
                  value={form.external_url}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      external_url: event.target.value,
                    }))
                  }
                  placeholder="https://..."
                  className="w-full rounded-2xl border border-[#102a56]/15 bg-white px-4 py-3 text-sm outline-none"
                />
              </div>

              {/* SORT */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Sort Order
                </label>

                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      sort_order: Number(event.target.value),
                    }))
                  }
                  className="w-full rounded-2xl border border-[#102a56]/15 bg-white px-4 py-3 text-sm outline-none"
                />
              </div>

              {/* TOGGLES */}
              <div className="lg:col-span-2 grid gap-3 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      is_featured: !current.is_featured,
                    }))
                  }
                  className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                    form.is_featured
                      ? "border-[#102a56] bg-[#102a56] text-[#f5f0e6]"
                      : "border-[#102a56]/10 bg-white"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold">Featured Activity</p>
                    <p
                      className={`mt-1 text-xs ${
                        form.is_featured
                          ? "text-white/65"
                          : "text-[#102a56]/50"
                      }`}
                    >
                      Show in the featured section.
                    </p>
                  </div>

                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${
                      form.is_featured
                        ? "bg-white/15"
                        : "bg-[#102a56]/5"
                    }`}
                  >
                    {form.is_featured && <Check className="h-4 w-4" />}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      is_active: !current.is_active,
                    }))
                  }
                  className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                    form.is_active
                      ? "border-[#102a56]/15 bg-white"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {form.is_active ? "Published" : "Hidden"}
                    </p>
                    <p className="mt-1 text-xs text-[#102a56]/50">
                      Controls public visibility.
                    </p>
                  </div>

                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#102a56]/5">
                    {form.is_active ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#102a56]/10 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-full border border-[#102a56]/15 bg-white px-5 py-3 text-sm font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void saveActivity()}
                disabled={saving || uploadingImage || uploadingDocument}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#102a56] px-6 py-3 text-sm font-semibold text-[#f5f0e6] disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {saving ? "Saving..." : "Save Activity"}
              </button>
            </div>
          </section>
        )}

        {/* LIST */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#102a56]/45">
                Published content
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                {activities.length}{" "}
                {activities.length === 1 ? "activity" : "activities"}
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center rounded-[28px] border border-[#102a56]/10 bg-white/55 py-24">
              <Loader2 className="h-7 w-7 animate-spin" />
            </div>
          ) : activities.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-[#102a56]/20 bg-white/40 px-6 py-24 text-center">
              <ImageIcon className="mx-auto h-10 w-10 text-[#102a56]/25" />
              <h3 className="mt-5 text-2xl font-semibold">
                No activities yet
              </h3>
              <p className="mt-2 text-sm text-[#102a56]/50">
                Add your first activity using the button above.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <article
                  key={activity.id}
                  className="rounded-[26px] border border-[#102a56]/10 bg-white/65 p-4 shadow-[0_10px_40px_rgba(16,42,86,0.04)]"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
                    {/* THUMB */}
                    <div className="h-28 w-full shrink-0 overflow-hidden rounded-2xl bg-[#102a56]/5 sm:w-44">
                      {activity.image_url ? (
                        <img
                          src={activity.image_url}
                          alt={activity.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-[#102a56]/20" />
                        </div>
                      )}
                    </div>

                    {/* DETAILS */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#102a56]/7 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em]">
                          {activity.category}
                        </span>

                        {activity.is_featured && (
                          <span className="rounded-full bg-[#102a56] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#f5f0e6]">
                            Featured
                          </span>
                        )}

                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                            activity.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {activity.is_active ? "Published" : "Hidden"}
                        </span>
                      </div>

                      <h3 className="mt-3 truncate text-xl font-semibold">
                        {activity.title}
                      </h3>

                      {activity.description && (
                        <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-[#102a56]/55">
                          {activity.description}
                        </p>
                      )}

                      {activity.event_date && (
                        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-[#102a56]/50">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {activity.event_date}
                        </div>
                      )}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                      <button
                        type="button"
                        onClick={() => void moveActivity(activity, -1)}
                        disabled={index === 0}
                        title="Move up"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#102a56]/10 bg-white disabled:opacity-30"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => void moveActivity(activity, 1)}
                        disabled={index === activities.length - 1}
                        title="Move down"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#102a56]/10 bg-white disabled:opacity-30"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => void toggleFeatured(activity)}
                        title={
                          activity.is_featured
                            ? "Remove featured"
                            : "Make featured"
                        }
                        className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                          activity.is_featured
                            ? "border-[#102a56] bg-[#102a56] text-[#f5f0e6]"
                            : "border-[#102a56]/10 bg-white"
                        }`}
                      >
                        ✦
                      </button>

                      <button
                        type="button"
                        onClick={() => void toggleActive(activity)}
                        title={
                          activity.is_active ? "Hide activity" : "Publish activity"
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#102a56]/10 bg-white"
                      >
                        {activity.is_active ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => startEdit(activity)}
                        title="Edit"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#102a56]/10 bg-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => void deleteActivity(activity)}
                        title="Delete"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}