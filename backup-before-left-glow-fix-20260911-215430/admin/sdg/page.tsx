"use client";

import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
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

type SdgItem = {
  id: string;
  number: number;
  short_title: string;
  title: string;
  eyebrow: string | null;
  description: string | null;
  content: string | null;
  image_url: string | null;
  button_text: string | null;
  external_url: string | null;
  sort_order: number;
  is_active: boolean;
};

type FormState = {
  number: number;
  short_title: string;
  title: string;
  eyebrow: string;
  description: string;
  content: string;
  image_url: string;
  button_text: string;
  external_url: string;
  sort_order: number;
  is_active: boolean;
};

const BUCKET = "sdg";

const EMPTY_FORM: FormState = {
  number: 1,
  short_title: "",
  title: "",
  eyebrow: "",
  description: "",
  content: "",
  image_url: "",
  button_text: "Learn More",
  external_url: "",
  sort_order: 0,
  is_active: true,
};

export default function AdminSdgPage() {
  const [items, setItems] = useState<SdgItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<FormState>(EMPTY_FORM);

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [busyId, setBusyId] =
    useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);

    const { data, error } = await supabase
      .from("sdg_items")
      .select("*")
      .order("sort_order", {
        ascending: true,
      });

    if (error) {
      console.error(error);
      alert(error.message);
      setItems([]);
    } else {
      setItems((data ?? []) as SdgItem[]);
    }

    setLoading(false);
  }

  function openAdd() {
    setEditingId(null);
    setImageFile(null);

    setForm({
      ...EMPTY_FORM,
      number: items.length + 1,
      sort_order: items.length,
    });

    setShowForm(true);
  }

  function openEdit(item: SdgItem) {
    setEditingId(item.id);
    setImageFile(null);

    setForm({
      number: item.number,
      short_title:
        item.short_title ?? "",
      title: item.title ?? "",
      eyebrow:
        item.eyebrow ?? "",
      description:
        item.description ?? "",
      content:
        item.content ?? "",
      image_url:
        item.image_url ?? "",
      button_text:
        item.button_text ||
        "Learn More",
      external_url:
        item.external_url ?? "",
      sort_order:
        item.sort_order ?? 0,
      is_active:
        item.is_active,
    });

    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setImageFile(null);
    setForm(EMPTY_FORM);
  }

  function getStoragePath(
    url: string | null
  ) {
    if (!url) return null;

    const marker =
      `/storage/v1/object/public/${BUCKET}/`;

    const index =
      url.indexOf(marker);

    if (index === -1) return null;

    return decodeURIComponent(
      url.substring(
        index + marker.length
      )
    );
  }

  async function uploadImage(
    file: File
  ) {
    if (!file.type.startsWith("image/")) {
      throw new Error(
        "Please select an image file."
      );
    }

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const path =
      `items/${crypto.randomUUID()}.${extension}`;

    const { error } =
      await supabase.storage
        .from(BUCKET)
        .upload(
          path,
          file,
          {
            upsert: false,
            contentType:
              file.type,
          }
        );

    if (error) {
      throw new Error(
        `Image upload failed: ${error.message}`
      );
    }

    const { data } =
      supabase.storage
        .from(BUCKET)
        .getPublicUrl(path);

    return {
      path,
      url: data.publicUrl,
    };
  }

  async function saveItem(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !form.short_title.trim()
    ) {
      alert(
        "Please enter the short title."
      );
      return;
    }

    if (!form.title.trim()) {
      alert(
        "Please enter the SDG title."
      );
      return;
    }

    setSaving(true);

    try {
      let imageUrl =
        form.image_url.trim();

      let oldImagePath:
        | string
        | null = null;

      if (
        editingId &&
        imageFile
      ) {
        const current =
          items.find(
            (item) =>
              item.id ===
              editingId
          );

        oldImagePath =
          getStoragePath(
            current?.image_url ??
              null
          );
      }

      if (imageFile) {
        const uploaded =
          await uploadImage(
            imageFile
          );

        imageUrl =
          uploaded.url;
      }

      const payload = {
        number:
          Number(form.number) || 1,

        short_title:
          form.short_title.trim(),

        title:
          form.title.trim(),

        eyebrow:
          form.eyebrow.trim() ||
          null,

        description:
          form.description.trim() ||
          null,

        content:
          form.content.trim() ||
          null,

        image_url:
          imageUrl || null,

        button_text:
          form.button_text.trim() ||
          "Learn More",

        external_url:
          form.external_url.trim() ||
          null,

        sort_order:
          Number(form.sort_order) || 0,

        is_active:
          form.is_active,

        updated_at:
          new Date().toISOString(),
      };

      if (editingId) {
        const { error } =
          await supabase
            .from("sdg_items")
            .update(payload)
            .eq(
              "id",
              editingId
            );

        if (error) {
          throw new Error(
            error.message
          );
        }

        if (
          imageFile &&
          oldImagePath
        ) {
          await supabase.storage
            .from(BUCKET)
            .remove([
              oldImagePath,
            ]);
        }
      } else {
        const { error } =
          await supabase
            .from("sdg_items")
            .insert(payload);

        if (error) {
          throw new Error(
            error.message
          );
        }
      }

      closeForm();
      await loadItems();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Could not save SDG item."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisibility(
    item: SdgItem
  ) {
    setBusyId(item.id);

    const { error } =
      await supabase
        .from("sdg_items")
        .update({
          is_active:
            !item.is_active,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          item.id
        );

    if (error) {
      alert(error.message);
    } else {
      await loadItems();
    }

    setBusyId(null);
  }

  async function moveItem(
    id: string,
    direction:
      | "up"
      | "down"
  ) {
    const index =
      items.findIndex(
        (item) =>
          item.id === id
      );

    if (index === -1) return;

    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= items.length
    ) {
      return;
    }

    const current =
      items[index];

    const target =
      items[targetIndex];

    setBusyId(id);

    await supabase
      .from("sdg_items")
      .update({
        sort_order:
          target.sort_order,
      })
      .eq(
        "id",
        current.id
      );

    await supabase
      .from("sdg_items")
      .update({
        sort_order:
          current.sort_order,
      })
      .eq(
        "id",
        target.id
      );

    await loadItems();

    setBusyId(null);
  }

  async function deleteItem(
    item: SdgItem
  ) {
    if (
      !window.confirm(
        `Delete ${item.title}?`
      )
    ) {
      return;
    }

    setBusyId(item.id);

    try {
      const path =
        getStoragePath(
          item.image_url
        );

      if (path) {
        await supabase.storage
          .from(BUCKET)
          .remove([path]);
      }

      const { error } =
        await supabase
          .from("sdg_items")
          .delete()
          .eq(
            "id",
            item.id
          );

      if (error) {
        throw new Error(
          error.message
        );
      }

      await loadItems();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Could not delete SDG item."
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f5f2] p-4 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#102a56]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#102a56]">
              <GlobeIcon />
              Website
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-[#102a56] sm:text-4xl">
              Sustainable Development Goals
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Manage the 17 SDG entries, descriptions,
              images and content displayed on the public page.
            </p>

          </div>

          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#102a56] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0c2145]"
          >
            <Plus className="h-4 w-4" />
            Add SDG
          </button>

        </div>

        {/* LIST */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {loading ? (

            <div className="flex min-h-[320px] items-center justify-center">

              <Loader2 className="h-7 w-7 animate-spin text-[#102a56]" />

            </div>

          ) : (

            <div className="divide-y divide-slate-200">

              {items.map(
                (item, index) => (

                  <div
                    key={item.id}
                    className="p-5 sm:p-6"
                  >

                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                      <div className="flex items-center gap-4">

                        {item.image_url ? (
                          <img
                            src={
                              item.image_url
                            }
                            alt={
                              item.title
                            }
                            className="h-16 w-16 shrink-0 rounded-xl border border-slate-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#102a56] text-lg font-semibold text-white">
                            {item.number}
                          </div>
                        )}

                        <div>

                          <div className="flex flex-wrap gap-2">

                            <span className="rounded-full bg-[#102a56]/10 px-2.5 py-1 text-xs font-semibold text-[#102a56]">
                              SDG {item.number}
                            </span>

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
                                  Published
                                </>
                              ) : (
                                <>
                                  <EyeOff className="h-3 w-3" />
                                  Hidden
                                </>
                              )}
                            </span>

                          </div>

                          <h2 className="mt-2 text-lg font-semibold text-slate-900">
                            {item.title}
                          </h2>

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="flex flex-wrap items-center gap-2">

                        <button
                          type="button"
                          disabled={
                            index === 0 ||
                            busyId ===
                              item.id
                          }
                          onClick={() =>
                            moveItem(
                              item.id,
                              "up"
                            )
                          }
                          className="rounded-lg border border-slate-200 p-2 disabled:opacity-30"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          disabled={
                            index ===
                              items.length -
                                1 ||
                            busyId ===
                              item.id
                          }
                          onClick={() =>
                            moveItem(
                              item.id,
                              "down"
                            )
                          }
                          className="rounded-lg border border-slate-200 p-2 disabled:opacity-30"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            toggleVisibility(
                              item
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium"
                        >
                          {item.is_active ? (
                            <>
                              <EyeOff className="h-4 w-4" />
                              Hide
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4" />
                              Publish
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openEdit(item)
                          }
                          className="inline-flex items-center gap-2 rounded-lg bg-[#102a56] px-3 py-2 text-sm font-semibold text-white"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteItem(
                              item
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>

          )}

        </div>

      </div>

      {/* ========================================================
          FORM
      ======================================================== */}

      {showForm && (

        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4">

          <div className="mx-auto my-6 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div>

                <h2 className="text-lg font-semibold text-[#102a56]">
                  {editingId
                    ? "Edit SDG"
                    : "Add SDG"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Everything here is editable from Admin.
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

            <form
              onSubmit={saveItem}
            >

              <div className="space-y-5 p-5 sm:p-6">

                {/* NUMBER */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    SDG Number
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="17"
                    value={form.number}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        number:
                          Number(
                            e.target.value
                          ) || 1,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#102a56]"
                  />

                </div>

                {/* SHORT TITLE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Short Title *
                  </label>

                  <input
                    type="text"
                    value={
                      form.short_title
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        short_title:
                          e.target.value,
                      })
                    }
                    placeholder="Quality Education"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#102a56]"
                  />

                </div>

                {/* TITLE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Title *
                  </label>

                  <input
                    type="text"
                    value={
                      form.title
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        title:
                          e.target.value,
                      })
                    }
                    placeholder="SDG 4 — Quality Education"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#102a56]"
                  />

                </div>

                {/* EYEBROW */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Eyebrow
                  </label>

                  <input
                    type="text"
                    value={
                      form.eyebrow
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        eyebrow:
                          e.target.value,
                      })
                    }
                    placeholder="Sustainable Development Goal 04"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#102a56]"
                  />

                </div>

                {/* DESCRIPTION */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Description
                  </label>

                  <textarea
                    rows={4}
                    value={
                      form.description
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        description:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#102a56]"
                  />

                </div>

                {/* CONTENT */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Detailed Content
                  </label>

                  <textarea
                    rows={7}
                    value={
                      form.content
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        content:
                          e.target.value,
                      })
                    }
                    placeholder="Add school-specific SDG activities, initiatives and achievements..."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm leading-7 outline-none focus:border-[#102a56]"
                  />

                </div>

                {/* IMAGE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    SDG Image
                  </label>

                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center hover:bg-slate-100">

                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#102a56]/10">

                      <Upload className="h-5 w-5 text-[#102a56]" />

                    </div>

                    <span className="text-sm font-semibold text-slate-800">

                      {imageFile
                        ? imageFile.name
                        : "Choose SDG image"}

                    </span>

                    <span className="mt-1 text-xs text-slate-500">
                      JPG, PNG or WebP
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setImageFile(
                          e.target
                            .files?.[0] ??
                            null
                        )
                      }
                    />

                  </label>

                  {form.image_url &&
                    !imageFile && (
                      <p className="mt-2 text-xs text-emerald-700">
                        Existing image is attached.
                      </p>
                    )}

                </div>

                {/* EXTERNAL URL */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Optional External URL
                  </label>

                  <input
                    type="url"
                    value={
                      form.external_url
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        external_url:
                          e.target.value,
                      })
                    }
                    placeholder="https://..."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#102a56]"
                  />

                </div>

                {/* BUTTON */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Button Text
                  </label>

                  <input
                    type="text"
                    value={
                      form.button_text
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        button_text:
                          e.target.value,
                      })
                    }
                    placeholder="Learn More"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#102a56]"
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
                    value={
                      form.sort_order
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        sort_order:
                          Number(
                            e.target.value
                          ) || 0,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#102a56]"
                  />

                </div>

                {/* PUBLISH */}

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <input
                    type="checkbox"
                    checked={
                      form.is_active
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        is_active:
                          e.target.checked,
                      })
                    }
                    className="mt-1 h-4 w-4"
                  />

                  <div>

                    <p className="text-sm font-semibold text-slate-800">
                      Publish on website
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Hidden entries remain in Admin but are not shown publicly.
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
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#102a56] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >

                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save SDG
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

function GlobeIcon() {
  return (
    <span className="inline-flex">
      <FileText className="h-3.5 w-3.5" />
    </span>
  );
}