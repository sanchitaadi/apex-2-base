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

type Facility = {
  id: string;
  number: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
};

const emptyFacility: Facility = {
  id: "",
  number: "",
  title: "",
  description: "",
  image_url: "",
  icon: "Building2",
  sort_order: 0,
  is_active: true,
};

export default function CampusAdminPage() {
  const [facilities, setFacilities] =
    useState<Facility[]>([]);

  const [editing, setEditing] =
    useState<Facility | null>(null);

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
    loadFacilities();
  }, []);

  async function loadFacilities() {
    setLoading(true);
    setError("");

    const { data, error } =
      await supabase
        .from("campus_facilities")
        .select("*")
        .order("sort_order", {
          ascending: true,
        });

    if (error) {
      console.error(error);
      setError(error.message);
    } else {
      setFacilities(
        (data || []) as Facility[]
      );
    }

    setLoading(false);
  }

  function startNew() {
    setEditing({
      ...emptyFacility,
      number: String(
        facilities.length + 1
      ).padStart(2, "0"),
      sort_order: facilities.length,
    });

    setMessage("");
    setError("");
  }

  function editFacility(
    facility: Facility
  ) {
    setEditing({
      ...facility,
    });

    setMessage("");
    setError("");
  }

  function updateField(
    field: keyof Facility,
    value: string | number | boolean
  ) {
    setEditing((current) =>
      current
        ? {
            ...current,
            [field]: value,
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
    setMessage("");
    setError("");

    try {
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
          .from("campus")
          .upload(path, file, {
            upsert: false,
            cacheControl: "3600",
          });

      if (uploadError) {
        throw uploadError;
      }

      const { data } =
        supabase.storage
          .from("campus")
          .getPublicUrl(path);

      updateField(
        "image_url",
        data.publicUrl
      );

      setMessage(
        "Campus image uploaded successfully."
      );
    } catch (uploadError: any) {
      console.error(uploadError);

      setError(
        uploadError?.message ||
          "Could not upload campus image."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function saveFacility(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!editing) return;

    if (!editing.title.trim()) {
      setError(
        "Facility title is required."
      );
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        number:
          editing.number?.trim() ||
          "00",

        title:
          editing.title.trim(),

        description:
          editing.description?.trim() ||
          null,

        image_url:
          editing.image_url?.trim() ||
          null,

        icon:
          editing.icon?.trim() ||
          "Building2",

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
            .from("campus_facilities")
            .update(payload)
            .eq(
              "id",
              editing.id
            );

        if (error) throw error;
      } else {
        const { error } =
          await supabase
            .from("campus_facilities")
            .insert(payload);

        if (error) throw error;
      }

      setMessage(
        "Campus facility saved successfully."
      );

      await loadFacilities();

      setEditing(null);
    } catch (saveError: any) {
      console.error(saveError);

      setError(
        saveError?.message ||
          "Could not save campus facility."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteFacility(
    facility: Facility
  ) {
    if (
      !window.confirm(
        `Delete "${facility.title}"?`
      )
    ) {
      return;
    }

    const { error } =
      await supabase
        .from("campus_facilities")
        .delete()
        .eq(
          "id",
          facility.id
        );

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      "Campus facility deleted."
    );

    await loadFacilities();
  }

  async function toggleFacility(
    facility: Facility
  ) {
    const { error } =
      await supabase
        .from("campus_facilities")
        .update({
          is_active:
            !facility.is_active,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          facility.id
        );

    if (error) {
      setError(error.message);
      return;
    }

    await loadFacilities();
  }

  async function moveFacility(
    facility: Facility,
    direction: "up" | "down"
  ) {
    const index =
      facilities.findIndex(
        (item) =>
          item.id === facility.id
      );

    if (index < 0) return;

    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= facilities.length
    ) {
      return;
    }

    const target =
      facilities[targetIndex];

    await Promise.all([
      supabase
        .from("campus_facilities")
        .update({
          sort_order:
            target.sort_order,
        })
        .eq(
          "id",
          facility.id
        ),

      supabase
        .from("campus_facilities")
        .update({
          sort_order:
            facility.sort_order,
        })
        .eq(
          "id",
          target.id
        ),
    ]);

    await loadFacilities();
  }

  return (
    <main className="min-h-screen bg-[#071A38] text-white">

      <header className="border-b border-white/10 bg-[#0B2146]">

        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-6 md:px-10">

          <div>

            <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">
              Apex CMS
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
              Campus Management
            </h1>

            <p className="mt-2 text-sm text-white/35">
              Manage facilities, photographs and campus
              presentation.
            </p>

          </div>

          <button
            type="button"
            onClick={startNew}
            className="inline-flex items-center gap-2 rounded-full bg-[#F5F0E6] px-5 py-3 text-sm font-semibold text-[#102A56]"
          >
            <Plus size={16} />
            Add facility
          </button>

        </div>

      </header>

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

        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Loader2
              size={28}
              className="animate-spin text-white/35"
            />
          </div>
        ) : (
          <div className="grid gap-4">

            {facilities.map(
              (facility, index) => (
                <article
                  key={facility.id}
                  className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035]"
                >

                  <div className="flex flex-col gap-6 p-5 md:flex-row md:items-center md:p-6">

                    <div className="relative h-28 w-40 shrink-0 overflow-hidden rounded-2xl bg-[#0B2146]">

                      {facility.image_url ? (
                        <Image
                          src={
                            facility.image_url
                          }
                          alt={
                            facility.title
                          }
                          fill
                          sizes="160px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-white/20">
                          <ImagePlus size={28} />
                        </div>
                      )}

                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-center gap-3">

                        <span className="text-2xl font-semibold text-white/20">
                          {facility.number ||
                            String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                        </span>

                        {!facility.is_active && (
                          <span className="rounded-full bg-red-400/10 px-2 py-1 text-[8px] uppercase tracking-[0.15em] text-red-200">
                            Hidden
                          </span>
                        )}

                      </div>

                      <h2 className="mt-2 text-xl font-semibold">
                        {facility.title}
                      </h2>

                      {facility.description && (
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
                          {
                            facility.description
                          }
                        </p>
                      )}

                      <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-white/20">
                        Icon:{" "}
                        {facility.icon ||
                          "Building2"}
                      </p>

                    </div>

                    <div className="flex flex-wrap gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          moveFacility(
                            facility,
                            "up"
                          )
                        }
                        disabled={
                          index === 0
                        }
                        className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-white/40 hover:bg-white/10 disabled:opacity-20"
                      >
                        ↑
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          moveFacility(
                            facility,
                            "down"
                          )
                        }
                        disabled={
                          index ===
                          facilities.length -
                            1
                        }
                        className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-white/40 hover:bg-white/10 disabled:opacity-20"
                      >
                        ↓
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          editFacility(
                            facility
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-white/60 hover:bg-white/10 hover:text-white"
                      >
                        <Pencil size={13} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          toggleFacility(
                            facility
                          )
                        }
                        className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white/45 hover:bg-white/10 hover:text-white"
                      >
                        {facility.is_active
                          ? "Hide"
                          : "Publish"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteFacility(
                            facility
                          )
                        }
                        className="grid h-9 w-9 place-items-center rounded-xl border border-red-400/10 text-red-200/45 hover:bg-red-400/10 hover:text-red-200"
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

      </div>

      {/* =====================================================
          EDIT MODAL
      ====================================================== */}

      {editing && (
        <div className="fixed inset-0 z-[500] overflow-y-auto bg-black/75 p-4 backdrop-blur-sm md:p-8">

          <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-[#0B2146] shadow-2xl">

            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

              <div>

                <p className="text-[9px] uppercase tracking-[0.28em] text-white/30">
                  Campus CMS
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  {editing.id
                    ? "Edit facility"
                    : "Add facility"}
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
              onSubmit={saveFacility}
              className="space-y-6 p-6 md:p-8"
            >

              <div className="grid gap-5 md:grid-cols-[120px_1fr]">

                <Field
                  label="Number"
                  value={
                    editing.number ||
                    ""
                  }
                  onChange={(value) =>
                    updateField(
                      "number",
                      value
                    )
                  }
                />

                <Field
                  label="Title"
                  value={
                    editing.title
                  }
                  onChange={(value) =>
                    updateField(
                      "title",
                      value
                    )
                  }
                />

              </div>

              <TextField
                label="Description"
                value={
                  editing.description ||
                  ""
                }
                onChange={(value) =>
                  updateField(
                    "description",
                    value
                  )
                }
              />

              <Field
                label="Icon name"
                value={
                  editing.icon || ""
                }
                onChange={(value) =>
                  updateField(
                    "icon",
                    value
                  )
                }
              />

              {/* IMAGE */}

              <div>

                <label className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  Facility image
                </label>

                <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">

                  <div className="relative aspect-[16/8] bg-[#071A38]">

                    {editing.image_url ? (
                      <Image
                        src={
                          editing.image_url
                        }
                        alt={
                          editing.title
                        }
                        fill
                        sizes="900px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-white/20">
                        <ImagePlus
                          size={35}
                        />
                      </div>
                    )}

                  </div>

                  <div className="p-4">

                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#F5F0E6] px-4 py-3 text-sm font-semibold text-[#102A56] hover:bg-white">

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
                        disabled={
                          uploading
                        }
                        onChange={
                          uploadImage
                        }
                      />

                    </label>

                  </div>

                </div>

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
                      ? "Visible on website"
                      : "Hidden from website"}

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

                  Save facility

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
          onChange(
            event.target.value
          )
        }
        className="mt-3 w-full resize-y rounded-xl border border-white/10 bg-white/[0.035] px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-white/20 focus:border-white/25"
      />

    </div>
  );
}