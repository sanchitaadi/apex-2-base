"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import {
  Check,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type Album = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  cover_image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

type GalleryImage = {
  id: string;
  album_id: string;
  image_url: string;
  caption: string | null;
  alt_text: string | null;
  sort_order: number;
  is_active: boolean;
};

const emptyAlbum: Album = {
  id: "",
  title: "",
  slug: "",
  description: "",
  category: "General",
  cover_image_url: "",
  sort_order: 0,
  is_active: true,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function GalleryAdminPage() {
  const [albums, setAlbums] =
    useState<Album[]>([]);

  const [images, setImages] =
    useState<GalleryImage[]>([]);

  const [selectedAlbum, setSelectedAlbum] =
    useState<Album | null>(null);

  const [editingAlbum, setEditingAlbum] =
    useState<Album | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadAlbums();
  }, []);

  async function loadAlbums() {
    setLoading(true);

    const { data, error } =
      await supabase
        .from("gallery_albums")
        .select("*")
        .order("sort_order", {
          ascending: true,
        });

    if (error) {
      setError(error.message);
    } else {
      const result =
        (data || []) as Album[];

      setAlbums(result);

      if (
        selectedAlbum &&
        result.some(
          (album) =>
            album.id === selectedAlbum.id
        )
      ) {
        setSelectedAlbum(
          result.find(
            (album) =>
              album.id ===
              selectedAlbum.id
          ) || null
        );
      }
    }

    setLoading(false);
  }

  async function loadImages(
    albumId: string
  ) {
    const { data, error } =
      await supabase
        .from("gallery_images")
        .select("*")
        .eq("album_id", albumId)
        .order("sort_order", {
          ascending: true,
        });

    if (error) {
      setError(error.message);
    } else {
      setImages(
        (data || []) as GalleryImage[]
      );
    }
  }

  function openAlbum(album: Album) {
    setSelectedAlbum(album);
    setMessage("");
    setError("");
    loadImages(album.id);
  }

  function startNewAlbum() {
    setEditingAlbum({
      ...emptyAlbum,
      sort_order: albums.length,
    });

    setMessage("");
    setError("");
  }

  function editAlbum(album: Album) {
    setEditingAlbum({
      ...album,
    });

    setMessage("");
    setError("");
  }

  function updateAlbum(
    field: keyof Album,
    value: string | number | boolean
  ) {
    setEditingAlbum((current) =>
      current
        ? {
            ...current,
            [field]: value,
          }
        : null
    );
  }

  async function saveAlbum(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!editingAlbum) return;

    if (!editingAlbum.title.trim()) {
      setError("Album title is required.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        title:
          editingAlbum.title.trim(),

        slug:
          editingAlbum.slug.trim() ||
          slugify(
            editingAlbum.title
          ),

        description:
          editingAlbum.description?.trim() ||
          null,

        category:
          editingAlbum.category?.trim() ||
          "General",

        cover_image_url:
          editingAlbum.cover_image_url?.trim() ||
          null,

        sort_order:
          Number(
            editingAlbum.sort_order
          ),

        is_active:
          Boolean(
            editingAlbum.is_active
          ),

        updated_at:
          new Date().toISOString(),
      };

      if (editingAlbum.id) {
        const { error } =
          await supabase
            .from("gallery_albums")
            .update(payload)
            .eq(
              "id",
              editingAlbum.id
            );

        if (error) throw error;

        setMessage(
          "Album updated successfully."
        );
      } else {
        const { error } =
          await supabase
            .from("gallery_albums")
            .insert(payload);

        if (error) throw error;

        setMessage(
          "Album created successfully."
        );
      }

      await loadAlbums();

      setEditingAlbum(null);
    } catch (saveError: any) {
      console.error(saveError);

      setError(
        saveError?.message ||
          "Could not save album."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteAlbum(
    album: Album
  ) {
    if (
      !window.confirm(
        `Delete "${album.title}" and all its images?`
      )
    ) {
      return;
    }

    const { error } =
      await supabase
        .from("gallery_albums")
        .delete()
        .eq(
          "id",
          album.id
        );

    if (error) {
      setError(error.message);
      return;
    }

    if (
      selectedAlbum?.id === album.id
    ) {
      setSelectedAlbum(null);
      setImages([]);
    }

    setMessage(
      "Album deleted successfully."
    );

    await loadAlbums();
  }

  async function toggleAlbum(
    album: Album
  ) {
    const { error } =
      await supabase
        .from("gallery_albums")
        .update({
          is_active:
            !album.is_active,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          album.id
        );

    if (error) {
      setError(error.message);
      return;
    }

    await loadAlbums();
  }

  async function uploadImages(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = event.target.files;

    if (
      !files ||
      files.length === 0 ||
      !selectedAlbum
    ) {
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const startOrder =
        images.length;

      for (
        let i = 0;
        i < files.length;
        i++
      ) {
        const file = files[i];

        if (
          !file.type.startsWith(
            "image/"
          )
        ) {
          continue;
        }

        const extension =
          file.name
            .split(".")
            .pop()
            ?.toLowerCase() ||
          "jpg";

        const cleanName =
          file.name
            .replace(/\.[^/.]+$/, "")
            .replace(
              /[^a-zA-Z0-9-_]/g,
              "-"
            )
            .toLowerCase();

        const path =
          `${selectedAlbum.id}/${Date.now()}-${i}-${cleanName}.${extension}`;

        const { error: uploadError } =
          await supabase.storage
            .from("gallery")
            .upload(
              path,
              file,
              {
                upsert: false,
                cacheControl:
                  "3600",
              }
            );

        if (uploadError) {
          throw uploadError;
        }

        const { data } =
          supabase.storage
            .from("gallery")
            .getPublicUrl(
              path
            );

        const {
          error: insertError,
        } = await supabase
          .from("gallery_images")
          .insert({
            album_id:
              selectedAlbum.id,

            image_url:
              data.publicUrl,

            caption: null,

            alt_text:
              selectedAlbum.title,

            sort_order:
              startOrder + i,

            is_active: true,
          });

        if (insertError) {
          throw insertError;
        }
      }

      await loadImages(
        selectedAlbum.id
      );

      await updateCoverIfNeeded();

      setMessage(
        "Images uploaded successfully."
      );
    } catch (uploadError: any) {
      console.error(uploadError);

      setError(
        uploadError?.message ||
          "Image upload failed."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function updateCoverIfNeeded() {
    if (!selectedAlbum) return;

    const { data } =
      await supabase
        .from("gallery_images")
        .select("image_url")
        .eq(
          "album_id",
          selectedAlbum.id
        )
        .eq("is_active", true)
        .order("sort_order", {
          ascending: true,
        })
        .limit(1)
        .maybeSingle();

    if (!data?.image_url) return;

    await supabase
      .from("gallery_albums")
      .update({
        cover_image_url:
          data.image_url,
        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        selectedAlbum.id
      );
  }

  async function deleteImage(
    image: GalleryImage
  ) {
    if (
      !window.confirm(
        "Delete this gallery image?"
      )
    ) {
      return;
    }

    const { error } =
      await supabase
        .from("gallery_images")
        .delete()
        .eq(
          "id",
          image.id
        );

    if (error) {
      setError(error.message);
      return;
    }

    if (selectedAlbum) {
      await loadImages(
        selectedAlbum.id
      );
    }

    setMessage(
      "Image deleted."
    );
  }

  async function toggleImage(
    image: GalleryImage
  ) {
    const { error } =
      await supabase
        .from("gallery_images")
        .update({
          is_active:
            !image.is_active,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          image.id
        );

    if (error) {
      setError(error.message);
      return;
    }

    if (selectedAlbum) {
      await loadImages(
        selectedAlbum.id
      );
    }
  }

  async function updateImageCaption(
    image: GalleryImage,
    caption: string
  ) {
    const { error } =
      await supabase
        .from("gallery_images")
        .update({
          caption:
            caption.trim() ||
            null,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          image.id
        );

    if (error) {
      setError(error.message);
      return;
    }

    setImages((current) =>
      current.map(
        (item) =>
          item.id === image.id
            ? {
                ...item,
                caption:
                  caption.trim() ||
                  null,
              }
            : item
      )
    );
  }

  return (
    <main className="min-h-screen bg-[#071A38] text-white">

      {/* HEADER */}

      <header className="border-b border-white/10 bg-[#0B2146]">

        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-6 md:px-10">

          <div>

            <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">
              Apex CMS
            </p>

            <h1 className="mt-2 text-2xl font-semibold">
              Gallery Management
            </h1>

            <p className="mt-2 text-sm text-white/35">
              Create albums and upload school photographs.
            </p>

          </div>

          <button
            onClick={startNewAlbum}
            className="inline-flex items-center gap-2 rounded-full bg-[#F5F0E6] px-5 py-3 text-sm font-semibold text-[#102A56]"
          >
            <Plus size={16} />
            Add album
          </button>

        </div>

      </header>

      <div className="mx-auto max-w-[1500px] px-6 py-10 md:px-10">

        {message && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            <Check size={16} />
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Loader2
              size={28}
              className="animate-spin text-white/35"
            />
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">

            {/* ALBUMS */}

            <section>

              <div className="mb-5">

                <p className="text-[9px] uppercase tracking-[0.28em] text-white/30">
                  Albums
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Gallery albums
                </h2>

              </div>

              <div className="grid gap-3">

                {albums.map(
                  (album) => (
                    <article
                      key={album.id}
                      className={`
                        overflow-hidden
                        rounded-2xl
                        border
                        ${
                          selectedAlbum?.id ===
                          album.id
                            ? "border-white/25 bg-white/[0.08]"
                            : "border-white/10 bg-white/[0.035]"
                        }
                      `}
                    >

                      <button
                        type="button"
                        onClick={() =>
                          openAlbum(
                            album
                          )
                        }
                        className="flex w-full items-center gap-4 p-4 text-left"
                      >

                        <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-[#102A56]">

                          {album.cover_image_url ? (
                            <Image
                              src={
                                album.cover_image_url
                              }
                              alt={
                                album.title
                              }
                              fill
                              sizes="96px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="grid h-full place-items-center text-white/20">
                              <ImagePlus
                                size={22}
                              />
                            </div>
                          )}

                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="font-semibold">
                              {album.title}
                            </h3>

                            {!album.is_active && (
                              <span className="rounded-full bg-red-400/10 px-2 py-1 text-[8px] uppercase tracking-[0.15em] text-red-200">
                                Hidden
                              </span>
                            )}

                          </div>

                          <p className="mt-1 text-xs text-white/35">
                            {album.category}
                          </p>

                        </div>

                      </button>

                      <div className="flex gap-2 border-t border-white/10 p-3">

                        <button
                          onClick={() =>
                            editAlbum(
                              album
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-white/60 hover:bg-white/10 hover:text-white"
                        >
                          <Pencil size={13} />
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            toggleAlbum(
                              album
                            )
                          }
                          className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white/45 hover:bg-white/10 hover:text-white"
                        >
                          {album.is_active
                            ? "Hide"
                            : "Publish"}
                        </button>

                        <button
                          onClick={() =>
                            deleteAlbum(
                              album
                            )
                          }
                          className="grid h-9 w-9 place-items-center rounded-xl border border-red-400/10 text-red-200/45 hover:bg-red-400/10 hover:text-red-200"
                        >
                          <Trash2
                            size={14}
                          />
                        </button>

                      </div>

                    </article>
                  )
                )}

              </div>

            </section>

            {/* IMAGES */}

            <section>

              {!selectedAlbum ? (
                <div className="flex min-h-[500px] items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.035] p-10 text-center">

                  <div>

                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-white/10">
                      <ImagePlus
                        size={27}
                        className="text-white/30"
                      />
                    </div>

                    <h2 className="mt-6 text-xl font-semibold">
                      Select an album
                    </h2>

                    <p className="mt-2 text-sm text-white/35">
                      Choose an album to manage its photographs.
                    </p>

                  </div>

                </div>
              ) : (
                <div>

                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

                    <div>

                      <p className="text-[9px] uppercase tracking-[0.28em] text-white/30">
                        {selectedAlbum.category}
                      </p>

                      <h2 className="mt-2 text-2xl font-semibold">
                        {selectedAlbum.title}
                      </h2>

                    </div>

                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#F5F0E6] px-5 py-3 text-sm font-semibold text-[#102A56] hover:bg-white">

                      {uploading ? (
                        <>
                          <Loader2
                            size={15}
                            className="animate-spin"
                          />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={15} />
                          Upload images
                        </>
                      )}

                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        disabled={
                          uploading
                        }
                        onChange={
                          uploadImages
                        }
                      />

                    </label>

                  </div>

                  <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-3">

                    {images.map(
                      (image) => (
                        <div
                          key={image.id}
                          className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]"
                        >

                          <div className="relative aspect-square">

                            <Image
                              src={
                                image.image_url
                              }
                              alt={
                                image.alt_text ||
                                selectedAlbum.title
                              }
                              fill
                              sizes="(max-width: 768px) 50vw, 30vw"
                              className="object-cover"
                            />

                          </div>

                          <div className="p-3">

                            <input
                              defaultValue={
                                image.caption ||
                                ""
                              }
                              onBlur={(event) =>
                                updateImageCaption(
                                  image,
                                  event.target.value
                                )
                              }
                              placeholder="Add caption..."
                              className="w-full bg-transparent text-xs text-white outline-none placeholder:text-white/20"
                            />

                            <div className="mt-3 flex gap-2">

                              <button
                                onClick={() =>
                                  toggleImage(
                                    image
                                  )
                                }
                                className="flex-1 rounded-lg border border-white/10 px-2 py-2 text-[10px] text-white/45 hover:bg-white/10 hover:text-white"
                              >
                                {image.is_active
                                  ? "Hide"
                                  : "Publish"}
                              </button>

                              <button
                                onClick={() =>
                                  deleteImage(
                                    image
                                  )
                                }
                                className="grid h-8 w-8 place-items-center rounded-lg border border-red-400/10 text-red-200/45 hover:bg-red-400/10 hover:text-red-200"
                              >
                                <Trash2
                                  size={12}
                                />
                              </button>

                            </div>

                          </div>

                        </div>
                      )
                    )}

                  </div>

                  {images.length === 0 && (
                    <div className="mt-5 rounded-[2rem] border border-white/10 bg-white/[0.025] p-10 text-center">

                      <ImagePlus
                        size={27}
                        className="mx-auto text-white/20"
                      />

                      <p className="mt-4 text-sm text-white/35">
                        No images in this album yet.
                      </p>

                    </div>
                  )}

                </div>
              )}

            </section>

          </div>
        )}

      </div>

      {/* ALBUM EDITOR */}

      {editingAlbum && (
        <div className="fixed inset-0 z-[500] overflow-y-auto bg-black/75 p-4 backdrop-blur-sm md:p-8">

          <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-[#0B2146] shadow-2xl">

            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

              <div>

                <p className="text-[9px] uppercase tracking-[0.28em] text-white/30">
                  Gallery CMS
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  {editingAlbum.id
                    ? "Edit album"
                    : "Create album"}
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingAlbum(
                    null
                  )
                }
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/45 hover:bg-white/10 hover:text-white"
              >
                <X size={17} />
              </button>

            </div>

            <form
              onSubmit={saveAlbum}
              className="space-y-6 p-6 md:p-8"
            >

              <Field
                label="Album title"
                value={
                  editingAlbum.title
                }
                onChange={(value) =>
                  updateAlbum(
                    "title",
                    value
                  )
                }
              />

              <Field
                label="Slug"
                value={
                  editingAlbum.slug
                }
                onChange={(value) =>
                  updateAlbum(
                    "slug",
                    value
                  )
                }
              />

              <Field
                label="Category"
                value={
                  editingAlbum.category ||
                  ""
                }
                onChange={(value) =>
                  updateAlbum(
                    "category",
                    value
                  )
                }
              />

              <TextField
                label="Description"
                value={
                  editingAlbum.description ||
                  ""
                }
                onChange={(value) =>
                  updateAlbum(
                    "description",
                    value
                  )
                }
              />

              <Field
                label="Cover image URL"
                value={
                  editingAlbum.cover_image_url ||
                  ""
                }
                onChange={(value) =>
                  updateAlbum(
                    "cover_image_url",
                    value
                  )
                }
              />

              <div className="grid gap-5 md:grid-cols-2">

                <div>

                  <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/35">
                    Display order
                  </label>

                  <input
                    type="number"
                    min={0}
                    value={
                      editingAlbum.sort_order
                    }
                    onChange={(event) =>
                      updateAlbum(
                        "sort_order",
                        Number(
                          event.target.value
                        )
                      )
                    }
                    className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3.5 text-sm text-white outline-none"
                  />

                </div>

                <div>

                  <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/35">
                    Visibility
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      updateAlbum(
                        "is_active",
                        !editingAlbum.is_active
                      )
                    }
                    className="mt-3 flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3.5 text-sm text-white/65"
                  >
                    {editingAlbum.is_active
                      ? "Published"
                      : "Hidden"}

                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        editingAlbum.is_active
                          ? "bg-emerald-300"
                          : "bg-white/20"
                      }`}
                    />

                  </button>

                </div>

              </div>

              <div className="flex justify-end gap-3 border-t border-white/10 pt-6">

                <button
                  type="button"
                  onClick={() =>
                    setEditingAlbum(
                      null
                    )
                  }
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm text-white/50 hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#F5F0E6] px-6 py-3 text-sm font-semibold text-[#102A56] hover:bg-white disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={15} />
                  )}

                  Save album

                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </main>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>

      <label className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/25"
      />

    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>

      <label className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
        {label}
      </label>

      <textarea
        rows={5}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-3 w-full resize-y rounded-xl border border-white/10 bg-white/[0.035] px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-white/20 focus:border-white/25"
      />

    </div>
  );
}