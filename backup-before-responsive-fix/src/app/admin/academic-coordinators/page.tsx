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
  GraduationCap,
  RefreshCw,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type AcademicCoordinator = {
  id: string;
  class_name: string;
  coordinator_name: string;
  designation: string | null;
  session: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

type FormState = {
  className: string;
  coordinatorName: string;
  designation: string;
  session: string;
  description: string;
};

const BUCKET = "academic-coordinators";

const EMPTY_FORM: FormState = {
  className: "",
  coordinatorName: "",
  designation: "Academic Coordinator",
  session: "2025–2026",
  description: "",
};

const classOptions = [
  "Class I",
  "Class II",
  "Class III",
  "Class IV",
  "Class V",
  "Class VI",
  "Class VII",
  "Class VIII",
  "Class IX",
  "Class X",
  "Class XI",
  "Class XII",
];

export default function AcademicCoordinatorsAdminPage() {
  const [coordinators, setCoordinators] =
    useState<AcademicCoordinator[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editing, setEditing] =
    useState<AcademicCoordinator | null>(null);

  const [form, setForm] =
    useState<FormState>(EMPTY_FORM);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [selectedFileName, setSelectedFileName] =
    useState("");

  const addFileRef =
    useRef<HTMLInputElement | null>(null);

  const editFileRef =
    useRef<HTMLInputElement | null>(null);

  function clearMessages() {
    setMessage("");
    setError("");
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setSelectedFileName("");

    if (addFileRef.current) {
      addFileRef.current.value = "";
    }

    if (editFileRef.current) {
      editFileRef.current.value = "";
    }
  }

  async function loadCoordinators() {
    setLoading(true);
    setError("");

    const { data, error: loadError } =
      await supabase
        .from("academic_coordinators")
        .select(`
          id,
          class_name,
          coordinator_name,
          designation,
          session,
          description,
          image_url,
          sort_order,
          is_active
        `)
        .order("sort_order", {
          ascending: true,
        });

    if (loadError) {
      setError(loadError.message);
      setCoordinators([]);
    } else {
      setCoordinators(
        (data || []) as AcademicCoordinator[]
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadCoordinators();
  }, []);

  function startEdit(
    coordinator: AcademicCoordinator
  ) {
    clearMessages();

    setEditing(coordinator);

    setForm({
      className:
        coordinator.class_name || "",

      coordinatorName:
        coordinator.coordinator_name || "",

      designation:
        coordinator.designation ||
        "Academic Coordinator",

      session:
        coordinator.session ||
        "2025–2026",

      description:
        coordinator.description ||
        "",
    });

    setSelectedFileName("");

    if (editFileRef.current) {
      editFileRef.current.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    setEditing(null);
    resetForm();
    clearMessages();
  }

  function getStoragePath(
    publicUrl: string | null
  ) {
    if (!publicUrl) return null;

    try {
      const url = new URL(publicUrl);

      const marker =
        `/storage/v1/object/public/${BUCKET}/`;

      const index =
        url.pathname.indexOf(marker);

      if (index === -1) {
        return null;
      }

      return decodeURIComponent(
        url.pathname.slice(
          index + marker.length
        )
      );
    } catch {
      return null;
    }
  }

  async function removeImage(
    publicUrl: string | null
  ) {
    const path = getStoragePath(publicUrl);

    if (!path) return;

    await supabase.storage
      .from(BUCKET)
      .remove([path]);
  }

  function validateImage(file: File | null) {
    if (!file) return true;

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select an image file."
      );
      return false;
    }

    return true;
  }

  async function saveCoordinator() {
    clearMessages();

    if (!form.className.trim()) {
      setError("Please select a class.");
      return;
    }

    if (!form.coordinatorName.trim()) {
      setError(
        "Coordinator name is required."
      );
      return;
    }

    if (!form.session.trim()) {
      setError(
        "Academic session is required."
      );
      return;
    }

    const file = editing
      ? editFileRef.current?.files?.[0] ||
        null
      : addFileRef.current?.files?.[0] ||
        null;

    if (!validateImage(file)) {
      return;
    }

    setSaving(true);

    let uploadedPath:
      | string
      | null = null;

    let newImageUrl:
      | string
      | null = null;

    try {
      /*
      ========================================================
      UPLOAD IMAGE
      ========================================================
      */

      if (file) {
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

        uploadedPath =
          `coordinators/${Date.now()}-${safeName}`;

        const {
          error: uploadError,
        } = await supabase.storage
          .from(BUCKET)
          .upload(
            uploadedPath,
            file,
            {
              cacheControl: "3600",
              upsert: false,
            }
          );

        if (uploadError) {
          throw uploadError;
        }

        const { data } =
          supabase.storage
            .from(BUCKET)
            .getPublicUrl(
              uploadedPath
            );

        newImageUrl =
          data.publicUrl;
      }

      /*
      ========================================================
      ADD
      ========================================================
      */

      if (!editing) {
        const maxOrder =
          coordinators.length > 0
            ? Math.max(
                ...coordinators.map(
                  (item) =>
                    item.sort_order
                )
              )
            : 0;

        const {
          error: insertError,
        } = await supabase
          .from(
            "academic_coordinators"
          )
          .insert({
            class_name:
              form.className.trim(),

            coordinator_name:
              form.coordinatorName.trim(),

            designation:
              form.designation.trim() ||
              "Academic Coordinator",

            session:
              form.session.trim(),

            description:
              form.description.trim() ||
              null,

            image_url:
              newImageUrl,

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
              .remove([
                uploadedPath,
              ]);
          }

          throw insertError;
        }

        setMessage(
          "Academic coordinator added successfully."
        );

        resetForm();

        await loadCoordinators();

        return;
      }

      /*
      ========================================================
      UPDATE
      ========================================================
      */

      const oldImageUrl =
        editing.image_url;

      const finalImageUrl =
        newImageUrl ||
        oldImageUrl ||
        null;

      const {
        error: updateError,
      } = await supabase
        .from(
          "academic_coordinators"
        )
        .update({
          class_name:
            form.className.trim(),

          coordinator_name:
            form.coordinatorName.trim(),

          designation:
            form.designation.trim() ||
            "Academic Coordinator",

          session:
            form.session.trim(),

          description:
            form.description.trim() ||
            null,

          image_url:
            finalImageUrl,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          editing.id
        );

      if (updateError) {
        if (uploadedPath) {
          await supabase.storage
            .from(BUCKET)
            .remove([
              uploadedPath,
            ]);
        }

        throw updateError;
      }

      if (
        newImageUrl &&
        oldImageUrl
      ) {
        await removeImage(
          oldImageUrl
        );
      }

      setMessage(
        "Academic coordinator updated successfully."
      );

      setEditing(null);
      resetForm();

      await loadCoordinators();
    } catch (err: any) {
      setError(
        err?.message ||
          "Could not save academic coordinator."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(
    coordinator: AcademicCoordinator
  ) {
    clearMessages();

    const {
      error: updateError,
    } = await supabase
      .from(
        "academic_coordinators"
      )
      .update({
        is_active:
          !coordinator.is_active,

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        coordinator.id
      );

    if (updateError) {
      setError(
        updateError.message
      );
      return;
    }

    await loadCoordinators();
  }

  async function deleteCoordinator(
    coordinator: AcademicCoordinator
  ) {
    clearMessages();

    const confirmed =
      window.confirm(
        `Delete "${coordinator.coordinator_name}"?`
      );

    if (!confirmed) return;

    setSaving(true);

    try {
      const {
        error: deleteError,
      } = await supabase
        .from(
          "academic_coordinators"
        )
        .delete()
        .eq(
          "id",
          coordinator.id
        );

      if (deleteError) {
        throw deleteError;
      }

      if (coordinator.image_url) {
        await removeImage(
          coordinator.image_url
        );
      }

      if (
        editing?.id ===
        coordinator.id
      ) {
        cancelEdit();
      }

      setMessage(
        "Academic coordinator deleted successfully."
      );

      await loadCoordinators();
    } catch (err: any) {
      setError(
        err?.message ||
          "Could not delete coordinator."
      );
    } finally {
      setSaving(false);
    }
  }

  async function moveCoordinator(
    coordinator: AcademicCoordinator,
    direction: "up" | "down"
  ) {
    const index =
      coordinators.findIndex(
        (item) =>
          item.id ===
          coordinator.id
      );

    if (index === -1) return;

    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >=
        coordinators.length
    ) {
      return;
    }

    const target =
      coordinators[targetIndex];

    const oldOrder =
      coordinator.sort_order;

    const newOrder =
      target.sort_order;

    const now =
      new Date().toISOString();

    const first =
      await supabase
        .from(
          "academic_coordinators"
        )
        .update({
          sort_order:
            newOrder,
          updated_at: now,
        })
        .eq(
          "id",
          coordinator.id
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
          "academic_coordinators"
        )
        .update({
          sort_order:
            oldOrder,
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

    await loadCoordinators();
  }

  return (
    <main className="min-h-screen bg-[#F4F1EA] px-5 py-8 text-[#10203A] md:px-8">

      <div className="mx-auto max-w-[1500px]">

        {/* HEADER */}

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>

            <div className="flex items-center gap-3">

              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#102A56] text-white">
                <GraduationCap size={18} />
              </div>

              <div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#102A56]/35">
                  Apex CMS
                </p>

                <p className="mt-1 text-[9px] uppercase tracking-[0.22em] text-[#102A56]/25">
                  Academic Team
                </p>

              </div>

            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[#102A56] md:text-4xl">
              Academic Coordinators
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#10203A]/50">
              Manage class-wise academic coordinators,
              photos, session information and visibility.
            </p>

          </div>

          <button
            type="button"
            onClick={loadCoordinators}
            disabled={loading || saving}
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

        </div>

        {/* MESSAGES */}

        {message && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
            <Check size={17} />
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* FORM */}

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
                <GraduationCap size={18} />
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
                    ? "Edit coordinator"
                    : "Add coordinator"}
                </p>

                <h2
                  className={
                    editing
                      ? "mt-2 text-xl font-semibold text-white"
                      : "mt-2 text-xl font-semibold text-[#102A56]"
                  }
                >
                  {editing
                    ? editing.coordinator_name
                    : "Academic Coordinator"}
                </h2>

              </div>

            </div>

            {editing && (
              <button
                type="button"
                onClick={cancelEdit}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-medium text-white"
              >
                <X size={15} />
                Cancel
              </button>
            )}

          </div>

          {/* FIELDS */}

          <div className="mt-7 grid gap-5 md:grid-cols-2">

            <div>

              <label
                className={
                  editing
                    ? "text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45"
                    : "text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40"
                }
              >
                Class
              </label>

              <select
                value={
                  form.className
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    className:
                      e.target.value,
                  })
                }
                className={
                  editing
                    ? "mt-3 w-full rounded-2xl border border-white/10 bg-[#102A56] px-4 py-3.5 text-sm text-white outline-none"
                    : "mt-3 w-full rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3.5 text-sm text-[#10203A] outline-none"
                }
              >

                <option value="">
                  Select class
                </option>

                {classOptions.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}

              </select>

            </div>

            <div>

              <label
                className={
                  editing
                    ? "text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45"
                    : "text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40"
                }
              >
                Coordinator name
              </label>

              <input
                value={
                  form.coordinatorName
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    coordinatorName:
                      e.target.value,
                  })
                }
                placeholder="Ms. Mahima Balodi"
                className={
                  editing
                    ? "mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/20"
                    : "mt-3 w-full rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3.5 text-sm text-[#10203A] outline-none"
                }
              />

            </div>

            <div>

              <label
                className={
                  editing
                    ? "text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45"
                    : "text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40"
                }
              >
                Designation
              </label>

              <input
                value={
                  form.designation
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    designation:
                      e.target.value,
                  })
                }
                className={
                  editing
                    ? "mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none"
                    : "mt-3 w-full rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3.5 text-sm text-[#10203A] outline-none"
                }
              />

            </div>

            <div>

              <label
                className={
                  editing
                    ? "text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45"
                    : "text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40"
                }
              >
                Academic session
              </label>

              <input
                value={form.session}
                onChange={(e) =>
                  setForm({
                    ...form,
                    session:
                      e.target.value,
                  })
                }
                placeholder="2025–2026"
                className={
                  editing
                    ? "mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none"
                    : "mt-3 w-full rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3.5 text-sm text-[#10203A] outline-none"
                }
              />

            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="mt-5">

            <label
              className={
                editing
                  ? "text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45"
                  : "text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40"
              }
            >
              Description
            </label>

            <textarea
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
              rows={3}
              placeholder="Optional coordinator information..."
              className={
                editing
                  ? "mt-3 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm leading-6 text-white outline-none placeholder:text-white/20"
                  : "mt-3 w-full resize-none rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3.5 text-sm leading-6 text-[#10203A] outline-none"
              }
            />

          </div>

          {/* IMAGE */}

          <div className="mt-5">

            <label
              className={
                editing
                  ? "text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45"
                  : "text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40"
              }
            >
              {editing
                ? "Replace photo"
                : "Coordinator photo"}
            </label>

            <div
              className={
                editing
                  ? "mt-3 rounded-2xl border border-dashed border-white/15 bg-white/5 p-5"
                  : "mt-3 rounded-2xl border border-dashed border-[#102A56]/15 bg-[#F8F6F1] p-5"
              }
            >

              <input
                ref={
                  editing
                    ? editFileRef
                    : addFileRef
                }
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file =
                    e.target.files?.[0] ||
                    null;

                  if (
                    !validateImage(
                      file
                    )
                  ) {
                    e.target.value =
                      "";
                    return;
                  }

                  setSelectedFileName(
                    file?.name ||
                      ""
                  );

                  clearMessages();
                }}
                className={
                  editing
                    ? "block w-full text-sm text-white/60 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2.5 file:text-xs file:font-semibold file:!text-[#102A56]"
                    : "block w-full text-sm text-[#10203A]/60 file:mr-4 file:rounded-full file:border-0 file:bg-[#102A56] file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-white"
                }
              />

              {selectedFileName ? (
                <p
                  className={
                    editing
                      ? "mt-3 text-xs text-emerald-200"
                      : "mt-3 text-xs text-emerald-700"
                  }
                >
                  Selected:
                  {" "}
                  <span className="font-semibold">
                    {
                      selectedFileName
                    }
                  </span>
                </p>
              ) : (
                <p
                  className={
                    editing
                      ? "mt-3 text-xs leading-5 text-white/35"
                      : "mt-3 text-xs leading-5 text-[#10203A]/40"
                  }
                >
                  {editing
                    ? "Leave empty to keep the current photo."
                    : "Upload a coordinator photo to Supabase Storage."}
                </p>
              )}

            </div>

          </div>

          {/* SAVE */}

          <button
            type="button"
            onClick={
              saveCoordinator
            }
            disabled={saving}
            className={
              editing
                ? "mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold !text-[#102A56] disabled:opacity-50"
                : "mt-7 inline-flex items-center gap-2 rounded-full bg-[#102A56] px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-50"
            }
          >
            {saving ? (
              <RefreshCw
                size={15}
                className="animate-spin"
              />
            ) : editing ? (
              <Save size={15} />
            ) : (
              <Upload size={15} />
            )}

            {saving
              ? "Saving..."
              : editing
                ? "Save changes"
                : "Add coordinator"}
          </button>

        </section>

        {/* LIST */}

        <section className="mt-10">

          <div className="mb-5">

            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#102A56]/35">
              Existing coordinators
            </p>

            <p className="mt-2 text-sm text-[#10203A]/45">
              {coordinators.length} coordinator
              {coordinators.length === 1
                ? ""
                : "s"}
            </p>

          </div>

          {loading ? (

            <div className="rounded-[2rem] bg-white py-24 text-center text-sm text-[#10203A]/40">
              Loading academic coordinators...
            </div>

          ) : coordinators.length === 0 ? (

            <div className="rounded-[2rem] border border-dashed border-[#102A56]/15 bg-white py-24 text-center">

              <GraduationCap
                size={34}
                className="mx-auto text-[#102A56]/20"
              />

              <p className="mt-5 text-sm text-[#10203A]/45">
                No academic coordinators found.
              </p>

            </div>

          ) : (

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              {coordinators.map(
                (
                  coordinator,
                  index
                ) => (
                  <article
                    key={
                      coordinator.id
                    }
                    className="overflow-hidden rounded-[2rem] border border-[#102A56]/10 bg-white"
                  >

                    {/* IMAGE */}

                    <div className="aspect-[4/3] bg-[#102A56]/5">

                      {coordinator.image_url ? (

                        <img
                          src={
                            coordinator.image_url
                          }
                          alt={
                            coordinator.coordinator_name
                          }
                          className="h-full w-full object-cover"
                        />

                      ) : (

                        <div className="grid h-full place-items-center bg-[#102A56] text-white">

                          <GraduationCap
                            size={36}
                            className="text-white/30"
                          />

                        </div>

                      )}

                    </div>

                    {/* DETAILS */}

                    <div className="p-6">

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="rounded-full bg-[#102A56]/5 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#102A56]/55">
                          {
                            coordinator.class_name
                          }
                        </span>

                        {!coordinator.is_active && (
                          <span className="rounded-full bg-red-50 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-red-500">
                            Hidden
                          </span>
                        )}

                      </div>

                      <h3 className="mt-4 text-xl font-semibold text-[#102A56]">
                        {
                          coordinator.coordinator_name
                        }
                      </h3>

                      <p className="mt-1 text-sm text-[#10203A]/45">
                        {
                          coordinator.designation
                        }
                      </p>

                      <p className="mt-1 text-xs text-[#10203A]/30">
                        {
                          coordinator.session
                        }
                      </p>

                      {/* ACTIONS */}

                      <div className="mt-5 flex flex-wrap gap-2">

                        {coordinator.image_url && (
                          <a
                            href={
                              coordinator.image_url
                            }
                            target="_blank"
                            rel="noreferrer"
                            title="Open photo"
                            className="grid h-9 w-9 place-items-center rounded-xl border border-[#102A56]/10 text-[#102A56]"
                          >
                            <ExternalLink
                              size={14}
                            />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            startEdit(
                              coordinator
                            )
                          }
                          disabled={saving}
                          title="Edit"
                          className="grid h-9 w-9 place-items-center rounded-xl border border-[#102A56]/10 text-[#102A56]"
                        >
                          <Edit3
                            size={14}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            moveCoordinator(
                              coordinator,
                              "up"
                            )
                          }
                          disabled={
                            index === 0 ||
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
                            moveCoordinator(
                              coordinator,
                              "down"
                            )
                          }
                          disabled={
                            index ===
                              coordinators.length -
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
                              coordinator
                            )
                          }
                          disabled={saving}
                          title={
                            coordinator.is_active
                              ? "Hide"
                              : "Show"
                          }
                          className="grid h-9 w-9 place-items-center rounded-xl border border-[#102A56]/10 text-[#102A56]"
                        >
                          {coordinator.is_active ? (
                            <Eye
                              size={14}
                            />
                          ) : (
                            <EyeOff
                              size={14}
                            />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteCoordinator(
                              coordinator
                            )
                          }
                          disabled={saving}
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
                )
              )}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}