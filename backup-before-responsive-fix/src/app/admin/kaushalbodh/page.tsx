"use client";

import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Check,
  Eye,
  EyeOff,
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

type GalleryImage = {
  url: string;
  caption?: string;
};

type Item = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  event_date: string | null;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  gallery_images: GalleryImage[];
};

type FormState = {
  id: string | null;
  title: string;
  description: string;
  image_url: string;
  event_date: string;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  gallery_images: GalleryImage[];
};

const EMPTY_FORM: FormState = {
  id: null,
  title: "",
  description: "",
  image_url: "",
  event_date: "",
  sort_order: 1,
  is_featured: false,
  is_active: true,
  gallery_images: [],
};

const BUCKET = "gallery";

function getPublicUrl(path: string) {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export default function AdminKaushalBodhPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  async function loadItems() {
    setLoading(true);

    const { data, error } = await supabase
      .from("kaushal_bodh")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("event_date", { ascending: false });

    if (error) {
      console.error(error);
      alert(error.message);
      setItems([]);
    } else {
      const normalized = ((data || []) as Item[]).map((item) => ({
        ...item,
        gallery_images: Array.isArray(item.gallery_images)
          ? item.gallery_images
          : [],
      }));

      setItems(normalized);
    }

    setLoading(false);
  }

  useEffect(() => {
    void loadItems();
  }, []);

  function createNew() {
    const nextOrder =
      items.length > 0
        ? Math.max(...items.map((item) => item.sort_order || 0)) + 1
        : 1;

    setForm({
      ...EMPTY_FORM,
      sort_order: nextOrder,
    });

    setShowForm(true);
  }

  function editItem(item: Item) {
    setForm({
      id: item.id,
      title: item.title,
      description: item.description || "",
      image_url: item.image_url || "",
      event_date: item.event_date || "",
      sort_order: item.sort_order || 0,
      is_featured: item.is_featured,
      is_active: item.is_active,
      gallery_images: Array.isArray(item.gallery_images)
        ? item.gallery_images
        : [],
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function closeForm() {
    if (saving || uploadingCover || uploadingGallery) return;

    setShowForm(false);
    setForm(EMPTY_FORM);
  }

  async function uploadCover(file: File | undefined) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Please keep the image under 10 MB.");
      return;
    }

    setUploadingCover(true);

    try {
      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const path = `kaushal-bodh/covers/${Date.now()}-${crypto.randomUUID()}.${extension}`;

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      setForm((current) => ({
        ...current,
        image_url: getPublicUrl(path),
      }));
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploadingCover(false);
    }
  }

  async function uploadGalleryImages(files: FileList | null) {
    if (!files || files.length === 0) return;

    const selectedFiles = Array.from(files);

    const invalid = selectedFiles.find(
      (file) =>
        !file.type.startsWith("image/") ||
        file.size > 10 * 1024 * 1024
    );

    if (invalid) {
      alert(
        `"${invalid.name}" is invalid or larger than 10 MB. Please choose image files below 10 MB each.`
      );
      return;
    }

    setUploadingGallery(true);

    try {
      const uploaded: GalleryImage[] = [];

      for (const file of selectedFiles) {
        const extension =
          file.name.split(".").pop()?.toLowerCase() || "jpg";

        const path = `kaushal-bodh/gallery/${Date.now()}-${crypto.randomUUID()}.${extension}`;

        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          throw error;
        }

        uploaded.push({
          url: getPublicUrl(path),
          caption: file.name.replace(/\.[^/.]+$/, ""),
        });
      }

      setForm((current) => ({
        ...current,
        gallery_images: [...current.gallery_images, ...uploaded],
      }));
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Gallery upload failed."
      );
    } finally {
      setUploadingGallery(false);
    }
  }

  function updateCaption(index: number, caption: string) {
    setForm((current) => ({
      ...current,
      gallery_images: current.gallery_images.map((image, imageIndex) =>
        imageIndex === index
          ? {
              ...image,
              caption,
            }
          : image
      ),
    }));
  }

  function removeGalleryImage(index: number) {
    setForm((current) => ({
      ...current,
      gallery_images: current.gallery_images.filter(
        (_, imageIndex) => imageIndex !== index
      ),
    }));
  }

  function moveGalleryImage(index: number, direction: -1 | 1) {
    const newIndex = index + direction;

    if (
      newIndex < 0 ||
      newIndex >= form.gallery_images.length
    ) {
      return;
    }

    setForm((current) => {
      const images = [...current.gallery_images];

      const temp = images[index];
      images[index] = images[newIndex];
      images[newIndex] = temp;

      return {
        ...current,
        gallery_images: images,
      };
    });
  }

  async function saveItem() {
    if (!form.title.trim()) {
      alert("Title is required.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        image_url: form.image_url.trim() || null,
        event_date: form.event_date || null,
        sort_order: Number(form.sort_order) || 0,
        is_featured: form.is_featured,
        is_active: form.is_active,
        gallery_images: form.gallery_images,
        updated_at: new Date().toISOString(),
      };

      if (form.id) {
        const { error } = await supabase
          .from("kaushal_bodh")
          .update(payload)
          .eq("id", form.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("kaushal_bodh")
          .insert({
            ...payload,
            created_at: new Date().toISOString(),
          });

        if (error) throw error;
      }

      setShowForm(false);
      setForm(EMPTY_FORM);

      await loadItems();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Unable to save.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(item: Item) {
    const { error } = await supabase
      .from("kaushal_bodh")
      .update({
        is_active: !item.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id);

    if (error) {
      alert(error.message);
      return;
    }

    setItems((current) =>
      current.map((entry) =>
        entry.id === item.id
          ? {
              ...entry,
              is_active: !entry.is_active,
            }
          : entry
      )
    );
  }

  async function toggleFeatured(item: Item) {
    const { error } = await supabase
      .from("kaushal_bodh")
      .update({
        is_featured: !item.is_featured,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id);

    if (error) {
      alert(error.message);
      return;
    }

    setItems((current) =>
      current.map((entry) =>
        entry.id === item.id
          ? {
              ...entry,
              is_featured: !entry.is_featured,
            }
          : entry
      )
    );
  }

  async function moveItem(item: Item, direction: -1 | 1) {
    const index = items.findIndex((entry) => entry.id === item.id);
    const targetIndex = index + direction;

    if (
      index < 0 ||
      targetIndex < 0 ||
      targetIndex >= items.length
    ) {
      return;
    }

    const target = items[targetIndex];

    const currentOrder = item.sort_order;
    const targetOrder = target.sort_order;

    const { error: firstError } = await supabase
      .from("kaushal_bodh")
      .update({
        sort_order: targetOrder,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id);

    if (firstError) {
      alert(firstError.message);
      return;
    }

    const { error: secondError } = await supabase
      .from("kaushal_bodh")
      .update({
        sort_order: currentOrder,
        updated_at: new Date().toISOString(),
      })
      .eq("id", target.id);

    if (secondError) {
      alert(secondError.message);
    }

    await loadItems();
  }

  async function deleteItem(item: Item) {
    const confirmed = window.confirm(
      `Delete "${item.title}" permanently?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("kaushal_bodh")
      .delete()
      .eq("id", item.id);

    if (error) {
      alert(error.message);
      return;
    }

    setItems((current) =>
      current.filter((entry) => entry.id !== item.id)
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f0e6] px-5 py-8 text-[#102a56] md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="flex flex-col gap-5 border-b border-[#102a56]/10 pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#102a56]/45">
              Website Content
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em]">
              Kaushal Bodh
            </h1>

            <p className="mt-3 text-sm text-[#102a56]/55">
              Manage Kaushal Bodh events and their photographs.
            </p>
          </div>

          <button
            type="button"
            onClick={createNew}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#102a56] px-6 py-3 text-sm font-semibold text-[#f5f0e6]"
          >
            <Plus className="h-4 w-4 text-[#f5f0e6]" />
            <span>Add Gallery Entry</span>
          </button>
        </div>

        {/* FORM */}
        {showForm && (
          <section className="mt-8 rounded-[30px] border border-[#102a56]/10 bg-white/65 p-6 shadow-[0_20px_70px_rgba(16,42,86,0.07)] md:p-8">
            <div className="flex items-center justify-between border-b border-[#102a56]/10 pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#102a56]/45">
                  {form.id ? "Edit entry" : "New entry"}
                </p>

                <h2 className="mt-1 text-2xl font-semibold">
                  {form.id
                    ? "Update Gallery Entry"
                    : "Add Gallery Entry"}
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
                  Title *
                </label>

                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="KAUSHAL BODH 01-07-2026"
                  className="w-full rounded-2xl border border-[#102a56]/15 bg-white px-4 py-3 text-sm outline-none"
                />
              </div>

              {/* DATE */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Event Date
                </label>

                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#102a56]/35" />

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

              {/* DESCRIPTION */}
              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-semibold">
                  Description
                </label>

                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Kaushal Bodh gallery description..."
                  className="w-full rounded-2xl border border-[#102a56]/15 bg-white px-4 py-3 text-sm leading-6 outline-none"
                />
              </div>

              {/* COVER IMAGE */}
              <div className="lg:col-span-2 rounded-2xl border border-[#102a56]/10 bg-white/70 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold">
                      Cover Image
                    </p>

                    <p className="mt-1 text-xs text-[#102a56]/45">
                      Main image shown for this Kaushal Bodh entry.
                    </p>
                  </div>

                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#102a56] px-4 py-2.5 text-sm font-semibold text-[#f5f0e6]">
                    {uploadingCover ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}

                    {uploadingCover
                      ? "Uploading..."
                      : "Upload Cover"}

                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingCover}
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        void uploadCover(file);
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-[200px_1fr]">
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

              {/* GALLERY PHOTOS */}
              <div className="lg:col-span-2 rounded-2xl border border-[#102a56]/10 bg-white/70 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold">
                      Kaushal Bodh Gallery
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#102a56]/45">
                      Upload multiple photographs. They will appear directly
                      on the public Kaushal Bodh page.
                    </p>
                  </div>

                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#102a56] px-4 py-2.5 text-sm font-semibold text-[#f5f0e6]">
                    {uploadingGallery ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}

                    {uploadingGallery
                      ? "Uploading..."
                      : "Upload Photos"}

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={uploadingGallery}
                      className="hidden"
                      onChange={(event) => {
                        void uploadGalleryImages(event.target.files);
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>
                </div>

                {form.gallery_images.length === 0 ? (
                  <div className="mt-5 rounded-2xl border border-dashed border-[#102a56]/15 bg-[#102a56]/[0.02] py-14 text-center">
                    <ImageIcon className="mx-auto h-9 w-9 text-[#102a56]/20" />

                    <p className="mt-3 text-sm text-[#102a56]/45">
                      No gallery photos uploaded yet.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {form.gallery_images.map((image, index) => (
                      <div
                        key={`${image.url}-${index}`}
                        className="overflow-hidden rounded-2xl border border-[#102a56]/10 bg-white"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-[#102a56]/5">
                          <img
                            src={image.url}
                            alt={image.caption || ""}
                            className="h-full w-full object-cover"
                          />

                          <span className="absolute left-3 top-3 rounded-full bg-[#102a56] px-2.5 py-1 text-[10px] font-bold text-[#f5f0e6]">
                            {index + 1}
                          </span>
                        </div>

                        <div className="p-3">
                          <input
                            value={image.caption || ""}
                            onChange={(event) =>
                              updateCaption(
                                index,
                                event.target.value
                              )
                            }
                            placeholder="Photo caption"
                            className="w-full rounded-xl border border-[#102a56]/10 bg-[#f5f0e6]/40 px-3 py-2 text-xs outline-none"
                          />

                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                moveGalleryImage(index, -1)
                              }
                              disabled={index === 0}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#102a56]/10 bg-white disabled:opacity-30"
                              title="Move left"
                            >
                              <ArrowUp className="h-3.5 w-3.5 -rotate-90" />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                moveGalleryImage(index, 1)
                              }
                              disabled={
                                index ===
                                form.gallery_images.length - 1
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#102a56]/10 bg-white disabled:opacity-30"
                              title="Move right"
                            >
                              <ArrowDown className="h-3.5 w-3.5 -rotate-90" />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                removeGalleryImage(index)
                              }
                              className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600"
                              title="Remove"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* TOGGLES */}
              <div className="grid gap-3 lg:col-span-2 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      is_featured: !current.is_featured,
                    }))
                  }
                  className={`flex items-center justify-between rounded-2xl border p-4 text-left ${
                    form.is_featured
                      ? "border-[#102a56] bg-[#102a56] text-[#f5f0e6]"
                      : "border-[#102a56]/10 bg-white"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold">
                      Featured Entry
                    </p>

                    <p
                      className={`mt-1 text-xs ${
                        form.is_featured
                          ? "text-white/60"
                          : "text-[#102a56]/45"
                      }`}
                    >
                      Highlight this entry.
                    </p>
                  </div>

                  {form.is_featured && (
                    <Check className="h-5 w-5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      is_active: !current.is_active,
                    }))
                  }
                  className="flex items-center justify-between rounded-2xl border border-[#102a56]/10 bg-white p-4 text-left"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {form.is_active ? "Published" : "Hidden"}
                    </p>

                    <p className="mt-1 text-xs text-[#102a56]/45">
                      Controls public visibility.
                    </p>
                  </div>

                  {form.is_active ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-[#102a56]/10 pt-6">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-full border border-[#102a56]/15 bg-white px-5 py-3 text-sm font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void saveItem()}
                disabled={
                  saving ||
                  uploadingCover ||
                  uploadingGallery
                }
                className="inline-flex items-center gap-2 rounded-full bg-[#102a56] px-6 py-3 text-sm font-semibold text-[#f5f0e6] disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {saving ? "Saving..." : "Save Entry"}
              </button>
            </div>
          </section>
        )}

        {/* ENTRIES */}
        <section className="mt-8">
          {loading ? (
            <div className="flex items-center justify-center rounded-[30px] border border-[#102a56]/10 bg-white/50 py-24">
              <Loader2 className="h-7 w-7 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-[30px] border border-dashed border-[#102a56]/20 bg-white/40 py-24 text-center">
              <ImageIcon className="mx-auto h-10 w-10 text-[#102a56]/20" />

              <h2 className="mt-5 text-2xl font-semibold">
                No gallery entries
              </h2>

              <p className="mt-2 text-sm text-[#102a56]/50">
                Add the first Kaushal Bodh gallery entry.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <article
                  key={item.id}
                  className="rounded-[26px] border border-[#102a56]/10 bg-white/65 p-4"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
                    <div className="h-28 w-full overflow-hidden rounded-2xl bg-[#102a56]/5 sm:w-44">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-[#102a56]/20" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                            item.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.is_active
                            ? "Published"
                            : "Hidden"}
                        </span>

                        {item.is_featured && (
                          <span className="rounded-full bg-[#102a56] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#f5f0e6]">
                            Featured
                          </span>
                        )}

                        <span className="rounded-full bg-[#102a56]/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em]">
                          {item.gallery_images.length} Photos
                        </span>
                      </div>

                      <h3 className="mt-3 text-xl font-semibold">
                        {item.title}
                      </h3>

                      {item.event_date && (
                        <p className="mt-2 flex items-center gap-2 text-xs text-[#102a56]/45">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {item.event_date}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          void moveItem(item, -1)
                        }
                        disabled={index === 0}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#102a56]/10 bg-white disabled:opacity-30"
                        title="Move up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void moveItem(item, 1)
                        }
                        disabled={
                          index === items.length - 1
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#102a56]/10 bg-white disabled:opacity-30"
                        title="Move down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void toggleFeatured(item)
                        }
                        className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                          item.is_featured
                            ? "border-[#102a56] bg-[#102a56] text-[#f5f0e6]"
                            : "border-[#102a56]/10 bg-white"
                        }`}
                        title="Featured"
                      >
                        ✦
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void toggleActive(item)
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#102a56]/10 bg-white"
                        title="Visibility"
                      >
                        {item.is_active ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => editItem(item)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#102a56]/10 bg-white"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void deleteItem(item)
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600"
                        title="Delete"
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