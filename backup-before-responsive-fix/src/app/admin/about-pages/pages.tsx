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

type AboutPage = {
  id: string;
  slug: string;
  menu_label: string;
  title: string;
  eyebrow: string | null;
  person_name: string | null;
  person_role: string | null;
  content: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

const emptyPage: AboutPage = {
  id: "",
  slug: "",
  menu_label: "",
  title: "",
  eyebrow: "",
  person_name: "",
  person_role: "",
  content: "",
  image_url: "",
  sort_order: 0,
  is_active: true,
};

export default function AboutPagesAdmin() {
  const [pages, setPages] =
    useState<AboutPage[]>([]);

  const [editing, setEditing] =
    useState<AboutPage | null>(null);

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
    loadPages();
  }, []);

  async function loadPages() {
    setLoading(true);

    const { data, error } =
      await supabase
        .from("about_pages")
        .select("*")
        .order("sort_order", {
          ascending: true,
        });

    if (error) {
      console.error(error);
      setError(error.message);
    } else {
      setPages(
        (data || []) as AboutPage[]
      );
    }

    setLoading(false);
  }

  function startNew() {
    setEditing({
      ...emptyPage,
      sort_order: pages.length,
    });

    setError("");
    setMessage("");
  }

  function editPage(page: AboutPage) {
    setEditing({ ...page });
    setError("");
    setMessage("");
  }

  function updateField(
    key: keyof AboutPage,
    value: string | number | boolean
  ) {
    setEditing((current) =>
      current
        ? {
            ...current,
            [key]: value,
          }
        : null
    );
  }

  async function uploadImage(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file || !editing) return;

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() || "jpg";

      const cleanName =
        file.name
          .replace(/\.[^/.]+$/, "")
          .replace(
            /[^a-zA-Z0-9-_]/g,
            "-"
          )
          .toLowerCase();

      const path =
        `${Date.now()}-${cleanName}.${extension}`;

      const { error: uploadError } =
        await supabase.storage
          .from("about-pages")
          .upload(path, file, {
            upsert: false,
            cacheControl: "3600",
          });

      if (uploadError) {
        throw uploadError;
      }

      const { data } =
        supabase.storage
          .from("about-pages")
          .getPublicUrl(path);

      updateField(
        "image_url",
        data.publicUrl
      );

      setMessage(
        "Image uploaded successfully."
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

  async function savePage(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!editing) return;

    if (
      !editing.menu_label.trim() ||
      !editing.title.trim()
    ) {
      setError(
        "Menu label and page title are required."
      );
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        slug:
          editing.slug.trim() ||
          editing.menu_label
            .trim()
            .toLowerCase()
            .replace(
              /[^a-z0-9]+/g,
              "-"
            )
            .replace(
              /^-|-\$/g,
              ""
            ),

        menu_label:
          editing.menu_label.trim(),

        title:
          editing.title.trim(),

        eyebrow:
          editing.eyebrow?.trim() ||
          null,

        person_name:
          editing.person_name?.trim() ||
          null,

        person_role:
          editing.person_role?.trim() ||
          null,

        content:
          editing.content?.trim() ||
          null,

        image_url:
          editing.image_url?.trim() ||
          null,

        sort_order:
          Number(editing.sort_order),

        is_active:
          Boolean(editing.is_active),

        updated_at:
          new Date().toISOString(),
      };

      if (editing.id) {
        const { error } =
          await supabase
            .from("about_pages")
            .update(payload)
            .eq(
              "id",
              editing.id
            );

        if (error) throw error;
      } else {
        const { error } =
          await supabase
            .from("about_pages")
            .insert(payload);

        if (error) throw error;
      }

      setMessage(
        "About page saved successfully."
      );

      await loadPages();

      setEditing(null);
    } catch (saveError: any) {
      console.error(saveError);

      setError(
        saveError?.message ||
          "Could not save page."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deletePage(
    page: AboutPage
  ) {
    if (
      !window.confirm(
        `Delete "${page.menu_label}"?`
      )
    ) {
      return;
    }

    const { error } =
      await supabase
        .from("about_pages")
        .delete()
        .eq(
          "id",
          page.id
        );

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      "About page deleted."
    );

    await loadPages();
  }

  async function togglePage(
    page: AboutPage
  ) {
    const { error } =
      await supabase
        .from("about_pages")
        .update({
          is_active:
            !page.is_active,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          page.id
        );

    if (error) {
      setError(error.message);
      return;
    }

    await loadPages();
  }

  return (
    <main className="min-h-screen bg-[#071A38] text-white">

      <div className="border-b border-white/10 bg-[#0B2146]">

        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-6 md:px-10">

          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">
              Apex CMS
            </p>

            <h1 className="mt-2 text-2xl font-semibold">
              About Pages
            </h1>
          </div>

          <button
            type="button"
            onClick={startNew}
            className="inline-flex items-center gap-2 rounded-full bg-[#F5F0E6] px-5 py-3 text-sm font-semibold text-[#102A56]"
          >
            <Plus size={16} />
            Add page
          </button>

        </div>

      </div>

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
              className="animate-spin text-white/40"
              size={28}
            />
          </div>
        ) : (
          <div className="grid gap-4">

            {pages.map((page, index) => (
              <div
                key={page.id}
                className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 md:p-6"
              >

                <div className="flex flex-wrap items-center gap-5">

                  {page.image_url ? (
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={page.image_url}
                        alt={page.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.025]">
                      <ImagePlus
                        size={22}
                        className="text-white/20"
                      />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-2">

                      <span className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <h2 className="text-lg font-semibold">
                        {page.menu_label}
                      </h2>

                      {!page.is_active && (
                        <span className="rounded-full bg-red-400/10 px-2 py-1 text-[8px] uppercase tracking-[0.15em] text-red-200">
                          Hidden
                        </span>
                      )}

                    </div>

                    <p className="mt-1 text-sm text-white/45">
                      {page.title}
                    </p>

                    {page.person_name && (
                      <p className="mt-1 text-xs text-white/25">
                        {page.person_name}
                        {page.person_role
                          ? ` · ${page.person_role}`
                          : ""}
                      </p>
                    )}

                    <p className="mt-2 text-[10px] text-white/20">
                      /about/{page.slug}
                    </p>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        editPage(page)
                      }
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-white/65 hover:bg-white/10 hover:text-white"
                    >
                      <Pencil size={13} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        togglePage(page)
                      }
                      className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white/50 hover:bg-white/10 hover:text-white"
                    >
                      {page.is_active
                        ? "Disable"
                        : "Enable"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deletePage(page)
                      }
                      className="grid h-9 w-9 place-items-center rounded-xl border border-red-400/10 text-red-200/45 hover:bg-red-400/10 hover:text-red-200"
                    >
                      <Trash2 size={14} />
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* EDITOR */}

      {editing && (
        <div className="fixed inset-0 z-[500] overflow-y-auto bg-black/75 p-4 backdrop-blur-sm md:p-8">

          <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-[#0B2146]">

            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

              <div>
                <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                  About CMS
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  {editing.id
                    ? "Edit About page"
                    : "Create About page"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditing(null)
                }
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/45 hover:bg-white/10 hover:text-white"
              >
                <X size={17} />
              </button>

            </div>

            <form
              onSubmit={savePage}
              className="space-y-6 p-6 md:p-8"
            >

              <Field
                label="Menu label"
                value={editing.menu_label}
                onChange={(value) =>
                  updateField(
                    "menu_label",
                    value
                  )
                }
              />

              <Field
                label="URL slug"
                value={editing.slug}
                onChange={(value) =>
                  updateField(
                    "slug",
                    value
                  )
                }
              />

              <Field
                label="Eyebrow"
                value={
                  editing.eyebrow || ""
                }
                onChange={(value) =>
                  updateField(
                    "eyebrow",
                    value
                  )
                }
              />

              <Field
                label="Page title"
                value={editing.title}
                onChange={(value) =>
                  updateField(
                    "title",
                    value
                  )
                }
              />

              <div className="grid gap-5 md:grid-cols-2">

                <Field
                  label="Person name"
                  value={
                    editing.person_name ||
                    ""
                  }
                  onChange={(value) =>
                    updateField(
                      "person_name",
                      value
                    )
                  }
                />

                <Field
                  label="Person role"
                  value={
                    editing.person_role ||
                    ""
                  }
                  onChange={(value) =>
                    updateField(
                      "person_role",
                      value
                    )
                  }
                />

              </div>

              {/* IMAGE */}

              <div>

                <label className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  Page image
                </label>

                <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">

                  <div className="relative aspect-[16/7] bg-[#071A38]">

                    {editing.image_url ? (
                      <Image
                        src={
                          editing.image_url
                        }
                        alt={editing.title}
                        fill
                        sizes="900px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center">
                        <ImagePlus
                          size={35}
                          className="text-white/20"
                        />
                      </div>
                    )}

                  </div>

                  <div className="p-4">

                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#F5F0E6] px-4 py-3 text-sm font-semibold text-[#102A56]">

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
                          Upload image
                        </>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploading}
                        onChange={
                          uploadImage
                        }
                      />

                    </label>

                  </div>

                </div>

              </div>

              <div>

                <label className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  Page content
                </label>

                <textarea
                  rows={14}
                  value={
                    editing.content || ""
                  }
                  onChange={(event) =>
                    updateField(
                      "content",
                      event.target.value
                    )
                  }
                  className="mt-3 w-full resize-y rounded-xl border border-white/10 bg-white/[0.035] px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-white/20 focus:border-white/25"
                  placeholder="Write the page content here..."
                />

              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <div>

                  <label className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
                    Display order
                  </label>

                  <input
                    type="number"
                    min={0}
                    value={
                      editing.sort_order
                    }
                    onChange={(event) =>
                      updateField(
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

                  <label className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
                    Visibility
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      updateField(
                        "is_active",
                        !editing.is_active
                      )
                    }
                    className="mt-3 flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3.5 text-sm text-white/65"
                  >
                    {editing.is_active
                      ? "Visible"
                      : "Hidden"}

                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        editing.is_active
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
                    setEditing(null)
                  }
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm text-white/50 hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving || uploading
                  }
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

                  Save page
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
          onChange(
            event.target.value
          )
        }
        className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/25"
      />

    </div>
  );
}