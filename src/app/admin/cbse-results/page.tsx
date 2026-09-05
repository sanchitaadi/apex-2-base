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
  Image as ImageIcon,
  RefreshCw,
  Save,
  Trash2,
  Trophy,
  Upload,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type ResultBanner = {
  id: string;
  title: string;
  session: string;
  exam: string;
  description: string | null;
  image_url: string | null;
  pdf_url: string | null;
  highest_score: string | null;
  total_distinctions: string | null;
  sort_order: number;
  is_active: boolean;
};

type FormState = {
  title: string;
  session: string;
  exam: string;
  description: string;
  highestScore: string;
  totalDistinctions: string;
  pdfUrl: string;
};

const BUCKET = "cbse-results";

export default function CBSEResultsAdminPage() {
  const [banners, setBanners] =
    useState<ResultBanner[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editing, setEditing] =
    useState<ResultBanner | null>(null);

  const [form, setForm] =
    useState<FormState>({
      title: "",
      session: "",
      exam: "CBSE Board Results",
      description: "",
      highestScore: "",
      totalDistinctions: "",
      pdfUrl: "",
    });

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const fileRef =
    useRef<HTMLInputElement | null>(null);

  async function loadBanners() {
    setLoading(true);
    setError("");

    const { data, error: loadError } =
      await supabase
        .from("cbse_result_banners")
        .select("*")
        .order("sort_order", {
          ascending: true,
        });

    if (loadError) {
      setError(loadError.message);
      setBanners([]);
    } else {
      setBanners(
        (data || []) as ResultBanner[]
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadBanners();
  }, []);

  function resetForm() {
    setForm({
      title: "",
      session: "",
      exam: "CBSE Board Results",
      description: "",
      highestScore: "",
      totalDistinctions: "",
      pdfUrl: "",
    });

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  function startEdit(
    banner: ResultBanner
  ) {
    setEditing(banner);

    setForm({
      title: banner.title,
      session: banner.session,
      exam: banner.exam,
      description:
        banner.description || "",
      highestScore:
        banner.highest_score || "",
      totalDistinctions:
        banner.total_distinctions || "",
      pdfUrl:
        banner.pdf_url || "",
    });

    if (fileRef.current) {
      fileRef.current.value = "";
    }

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    setEditing(null);
    resetForm();
    setMessage("");
    setError("");
  }

  function storagePathFromUrl(
    publicUrl: string | null
  ) {
    if (!publicUrl) return null;

    try {
      const url = new URL(publicUrl);

      const marker =
        "/storage/v1/object/public/cbse-results/";

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

  async function removeStorageFile(
    publicUrl: string | null
  ) {
    const path =
      storagePathFromUrl(publicUrl);

    if (!path) return;

    await supabase.storage
      .from(BUCKET)
      .remove([path]);
  }

  async function saveBanner() {
    setSaving(true);
    setMessage("");
    setError("");

    if (!form.title.trim()) {
      setError(
        "Please enter a result title."
      );
      setSaving(false);
      return;
    }

    if (!form.session.trim()) {
      setError(
        "Please enter the result session."
      );
      setSaving(false);
      return;
    }

    const file =
      fileRef.current?.files?.[0] ||
      null;

    if (file) {
      const isImage =
        file.type.startsWith("image/");

      if (!isImage) {
        setError(
          "The result banner must be an image."
        );
        setSaving(false);
        return;
      }
    }

    let newImageUrl:
      string | null = null;

    let uploadedPath:
      string | null = null;

    try {
      /*
      ========================================================
      UPLOAD NEW BANNER
      ========================================================
      */

      if (file) {
        const extension =
          file.name
            .split(".")
            .pop() || "jpg";

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
          `banners/${Date.now()}-${safeName}.${extension}`;

        const { error: uploadError } =
          await supabase.storage
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

        const { data: publicData } =
          supabase.storage
            .from(BUCKET)
            .getPublicUrl(
              uploadedPath
            );

        newImageUrl =
          publicData.publicUrl;
      }

      /*
      ========================================================
      CREATE
      ========================================================
      */

      if (!editing) {
        const maxOrder =
          banners.length > 0
            ? Math.max(
                ...banners.map(
                  (item) =>
                    item.sort_order
                )
              )
            : 0;

        const {
          error: insertError,
        } = await supabase
          .from(
            "cbse_result_banners"
          )
          .insert({
            title:
              form.title.trim(),

            session:
              form.session.trim(),

            exam:
              form.exam.trim() ||
              "CBSE Board Results",

            description:
              form.description.trim() ||
              null,

            image_url:
              newImageUrl,

            pdf_url:
              form.pdfUrl.trim() ||
              null,

            highest_score:
              form.highestScore.trim() ||
              null,

            total_distinctions:
              form.totalDistinctions.trim() ||
              null,

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
          "Result banner added successfully."
        );

        resetForm();

        await loadBanners();

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
          "cbse_result_banners"
        )
        .update({
          title:
            form.title.trim(),

          session:
            form.session.trim(),

          exam:
            form.exam.trim() ||
            "CBSE Board Results",

          description:
            form.description.trim() ||
            null,

          image_url:
            finalImageUrl,

          pdf_url:
            form.pdfUrl.trim() ||
            null,

          highest_score:
            form.highestScore.trim() ||
            null,

          total_distinctions:
            form.totalDistinctions.trim() ||
            null,

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

      /*
      --------------------------------------------------------
      DELETE OLD IMAGE AFTER SUCCESSFUL REPLACEMENT
      --------------------------------------------------------
      */

      if (
        newImageUrl &&
        oldImageUrl
      ) {
        await removeStorageFile(
          oldImageUrl
        );
      }

      setMessage(
        "Result banner updated successfully."
      );

      setEditing(null);
      resetForm();

      await loadBanners();

    } catch (err: any) {
      setError(
        err?.message ||
          "Could not save result banner."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleBanner(
    banner: ResultBanner
  ) {
    setError("");

    const { error: updateError } =
      await supabase
        .from(
          "cbse_result_banners"
        )
        .update({
          is_active:
            !banner.is_active,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          banner.id
        );

    if (updateError) {
      setError(
        updateError.message
      );
      return;
    }

    await loadBanners();
  }

  async function deleteBanner(
    banner: ResultBanner
  ) {
    const confirmed =
      window.confirm(
        `Delete "${banner.title}"?`
      );

    if (!confirmed) return;

    setSaving(true);

    try {
      const {
        error: deleteError,
      } = await supabase
        .from(
          "cbse_result_banners"
        )
        .delete()
        .eq(
          "id",
          banner.id
        );

      if (deleteError) {
        throw deleteError;
      }

      if (banner.image_url) {
        await removeStorageFile(
          banner.image_url
        );
      }

      setMessage(
        "Result banner deleted successfully."
      );

      await loadBanners();

    } catch (err: any) {
      setError(
        err?.message ||
          "Could not delete result banner."
      );
    } finally {
      setSaving(false);
    }
  }

  async function moveBanner(
    banner: ResultBanner,
    direction: "up" | "down"
  ) {
    const index =
      banners.findIndex(
        (item) =>
          item.id === banner.id
      );

    if (index === -1) return;

    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >=
        banners.length
    ) {
      return;
    }

    const target =
      banners[targetIndex];

    const oldOrder =
      banner.sort_order;

    const newOrder =
      target.sort_order;

    const now =
      new Date().toISOString();

    const first =
      await supabase
        .from(
          "cbse_result_banners"
        )
        .update({
          sort_order:
            newOrder,
          updated_at:
            now,
        })
        .eq(
          "id",
          banner.id
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
          "cbse_result_banners"
        )
        .update({
          sort_order:
            oldOrder,
          updated_at:
            now,
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

    await loadBanners();
  }

  return (
    <main className="min-h-screen bg-[#F4F1EA] px-5 py-8 text-[#10203A] md:px-8">

      <div className="mx-auto max-w-[1500px]">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>

            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#102A56]/35">
              Apex CMS
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#102A56] md:text-4xl">
              CBSE Results
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#10203A]/50">
              Manage the visual result banners published
              on the school's CBSE Results page.
            </p>

          </div>

          <button
            type="button"
            onClick={loadBanners}
            className="inline-flex items-center gap-2 rounded-full border border-[#102A56]/10 bg-white px-4 py-3 text-sm font-medium text-[#102A56]"
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
          <div className="mt-6 flex items-center gap-2 rounded-2xl bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
            <Check size={16} />
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ==================================================
            EDIT / ADD
        ================================================== */}

        <section className="mt-8 rounded-[2rem] bg-white p-6 md:p-8">

          <div className="flex items-start gap-4">

            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#102A56] text-white">
              {editing ? (
                <Edit3 size={18} />
              ) : (
                <Trophy size={18} />
              )}
            </div>

            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#102A56]/35">
                {editing
                  ? "Edit result banner"
                  : "Add result banner"}
              </p>

              <h2 className="mt-2 text-xl font-semibold text-[#102A56]">
                {editing
                  ? editing.title
                  : "New CBSE result"}
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#10203A]/45">
                Upload the result artwork and enter
                the information displayed around it.
              </p>

            </div>

          </div>

          {/* FORM */}

          <div className="mt-7 grid gap-5 md:grid-cols-2">

            {/* TITLE */}

            <div>

              <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40">
                Result title
              </label>

              <input
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title:
                      e.target.value,
                  })
                }
                placeholder="CBSE Class XII Results"
                className="mt-3 w-full rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3.5 text-sm outline-none"
              />

            </div>

            {/* SESSION */}

            <div>

              <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40">
                Session
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
                placeholder="2024–2025"
                className="mt-3 w-full rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3.5 text-sm outline-none"
              />

            </div>

            {/* EXAM */}

            <div>

              <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40">
                Exam
              </label>

              <input
                value={form.exam}
                onChange={(e) =>
                  setForm({
                    ...form,
                    exam:
                      e.target.value,
                  })
                }
                placeholder="CBSE Board Results"
                className="mt-3 w-full rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3.5 text-sm outline-none"
              />

            </div>

            {/* HIGHEST SCORE */}

            <div>

              <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40">
                Highest score
              </label>

              <input
                value={
                  form.highestScore
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    highestScore:
                      e.target.value,
                  })
                }
                placeholder="93%"
                className="mt-3 w-full rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3.5 text-sm outline-none"
              />

            </div>

            {/* DISTINCTIONS */}

            <div>

              <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40">
                Total distinctions
              </label>

              <input
                value={
                  form.totalDistinctions
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    totalDistinctions:
                      e.target.value,
                  })
                }
                placeholder="638"
                className="mt-3 w-full rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3.5 text-sm outline-none"
              />

            </div>

            {/* PDF */}

            <div>

              <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40">
                Complete result PDF URL
              </label>

              <input
                value={form.pdfUrl}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pdfUrl:
                      e.target.value,
                  })
                }
                placeholder="https://..."
                className="mt-3 w-full rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3.5 text-sm outline-none"
              />

            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="mt-5">

            <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40">
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
              placeholder="Short description of the result..."
              className="mt-3 w-full resize-none rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3.5 text-sm outline-none"
            />

          </div>

          {/* IMAGE */}

          <div className="mt-5">

            <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40">
              {editing
                ? "Replace result banner"
                : "Result banner image"}
            </label>

            <div className="mt-3 rounded-2xl border border-dashed border-[#102A56]/15 bg-[#F8F6F1] p-5">

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="
                  block
                  w-full
                  text-sm
                  text-[#10203A]/60
                  file:mr-4
                  file:rounded-full
                  file:border-0
                  file:bg-[#102A56]
                  file:px-4
                  file:py-2.5
                  file:text-xs
                  file:font-semibold
                  file:text-white
                "
              />

              <p className="mt-3 text-xs leading-5 text-[#10203A]/40">
                Use the school's original result artwork
                or upload a new modern result banner.
                When editing, leave this empty to keep
                the current image.
              </p>

            </div>

          </div>

          {/* BUTTONS */}

          <div className="mt-6 flex flex-wrap gap-3">

            <button
              type="button"
              onClick={saveBanner}
              disabled={saving}
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#102A56]
                px-6
                py-3.5
                text-sm
                font-semibold
                text-white
                disabled:opacity-50
              "
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
                  : "Add result"}
            </button>

            {editing && (
              <button
                type="button"
                onClick={cancelEdit}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full border border-[#102A56]/10 bg-white px-6 py-3.5 text-sm font-semibold text-[#102A56]"
              >
                <X size={15} />
                Cancel
              </button>
            )}

          </div>

        </section>

        {/* ==================================================
            EXISTING BANNERS
        ================================================== */}

        <section className="mt-10">

          <div className="mb-5">

            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#102A56]/35">
              Existing result banners
            </p>

            <p className="mt-2 text-sm text-[#10203A]/45">
              {banners.length} result
              {banners.length === 1
                ? ""
                : "s"}
            </p>

          </div>

          {loading ? (

            <div className="rounded-[2rem] bg-white py-24 text-center text-sm text-[#10203A]/40">
              Loading results...
            </div>

          ) : banners.length === 0 ? (

            <div className="rounded-[2rem] border border-dashed border-[#102A56]/15 bg-white py-24 text-center">

              <ImageIcon
                size={32}
                className="mx-auto text-[#102A56]/20"
              />

              <p className="mt-5 text-sm text-[#10203A]/45">
                No result banners have been added.
              </p>

            </div>

          ) : (

            <div className="space-y-6">

              {banners.map(
                (banner) => (
                  <article
                    key={
                      banner.id
                    }
                    className="overflow-hidden rounded-[2rem] border border-[#102A56]/10 bg-white"
                  >

                    {/* PREVIEW */}

                    {banner.image_url && (
                      <div className="bg-[#0B2146] p-3 md:p-5">

                        <div className="overflow-hidden rounded-[1.5rem] bg-black">

                          <img
                            src={
                              banner.image_url
                            }
                            alt={
                              banner.title
                            }
                            className="block max-h-[700px] w-full object-contain"
                          />

                        </div>

                      </div>
                    )}

                    {/* INFORMATION */}

                    <div className="p-6 md:p-8">

                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">

                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#102A56] text-[#F5F0E6]">
                          <Trophy
                            size={19}
                          />
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <span className="rounded-full bg-[#102A56]/5 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#102A56]/55">
                              {banner.session}
                            </span>

                            {!banner.is_active && (
                              <span className="rounded-full bg-red-50 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-red-500">
                                Hidden
                              </span>
                            )}

                          </div>

                          <h3 className="mt-3 text-xl font-semibold text-[#102A56]">
                            {banner.title}
                          </h3>

                          <p className="mt-1 text-sm text-[#10203A]/45">
                            {banner.exam}
                          </p>

                          {(banner.highest_score ||
                            banner.total_distinctions) && (
                            <div className="mt-3 flex flex-wrap gap-2">

                              {banner.highest_score && (
                                <span className="rounded-full bg-[#F4F1EA] px-3 py-1 text-xs text-[#10203A]/55">
                                  Highest:{" "}
                                  <strong>
                                    {
                                      banner.highest_score
                                    }
                                  </strong>
                                </span>
                              )}

                              {banner.total_distinctions && (
                                <span className="rounded-full bg-[#F4F1EA] px-3 py-1 text-xs text-[#10203A]/55">
                                  Distinctions:{" "}
                                  <strong>
                                    {
                                      banner.total_distinctions
                                    }
                                  </strong>
                                </span>
                              )}

                            </div>
                          )}

                        </div>

                        {/* ACTIONS */}

                        <div className="flex flex-wrap gap-2">

                          {banner.image_url && (
                            <a
                              href={
                                banner.image_url
                              }
                              target="_blank"
                              rel="noreferrer"
                              title="Open banner"
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
                                banner
                              )
                            }
                            className="grid h-9 w-9 place-items-center rounded-xl border border-[#102A56]/10 text-[#102A56]"
                            title="Edit"
                          >
                            <Edit3
                              size={14}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              moveBanner(
                                banner,
                                "up"
                              )
                            }
                            className="grid h-9 w-9 place-items-center rounded-xl border border-[#102A56]/10 text-[#102A56]"
                            title="Move up"
                          >
                            <ArrowUp
                              size={14}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              moveBanner(
                                banner,
                                "down"
                              )
                            }
                            className="grid h-9 w-9 place-items-center rounded-xl border border-[#102A56]/10 text-[#102A56]"
                            title="Move down"
                          >
                            <ArrowDown
                              size={14}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              toggleBanner(
                                banner
                              )
                            }
                            className="grid h-9 w-9 place-items-center rounded-xl border border-[#102A56]/10 text-[#102A56]"
                            title={
                              banner.is_active
                                ? "Hide"
                                : "Show"
                            }
                          >
                            {banner.is_active ? (
                              <Eye size={14} />
                            ) : (
                              <EyeOff
                                size={14}
                              />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteBanner(
                                banner
                              )
                            }
                            className="grid h-9 w-9 place-items-center rounded-xl border border-red-500/10 text-red-500"
                            title="Delete"
                          >
                            <Trash2
                              size={14}
                            />
                          </button>

                        </div>

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