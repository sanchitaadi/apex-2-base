"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
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

type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image_url: string;
  primary_button_text: string;
  primary_button_url: string;
  secondary_button_text: string;
  secondary_button_url: string;
  sort_order: number;
  duration: number;
  is_active: boolean;
};

const emptySlide: HeroSlide = {
  id: "",
  eyebrow: "APEX PUBLIC SCHOOL",
  title: "Learning that continues beyond the classroom.",
  description:
    "Academic growth is strengthened by culture, activities, teamwork, leadership and experience.",
  image_url: "",
  primary_button_text: "Admissions 2026–27",
  primary_button_url: "/admissions",
  secondary_button_text: "Discover Apex",
  secondary_button_url: "/about",
  sort_order: 0,
  duration: 6000,
  is_active: true,
};

export default function HeroAdminPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [editing, setEditing] = useState<HeroSlide | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadSlides();
  }, []);

  async function loadSlides() {
    setLoading(true);
    setError("");

    const { data, error: loadError } = await supabase
      .from("hero_slides")
      .select("*")
      .order("sort_order", { ascending: true });

    if (loadError) {
      console.error(loadError);
      setError(loadError.message);
    } else {
      setSlides((data || []) as HeroSlide[]);
    }

    setLoading(false);
  }

  function startNew() {
    setEditing({
      ...emptySlide,
      id: "",
      sort_order: slides.length,
    });

    setMessage("");
    setError("");
  }

  function editSlide(slide: HeroSlide) {
    setEditing({
      ...slide,
    });

    setMessage("");
    setError("");
  }

  function closeEditor() {
    if (saving || uploading) return;

    setEditing(null);
    setMessage("");
    setError("");
  }

  function updateEditing(
    key: keyof HeroSlide,
    value: string | number | boolean
  ) {
    setEditing((current) => {
      if (!current) return current;

      return {
        ...current,
        [key]: value,
      };
    });
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
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const safeName =
        file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[^a-zA-Z0-9-_]/g, "-")
          .toLowerCase();

      const filePath = `${Date.now()}-${safeName}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("hero")
        .upload(filePath, file, {
          upsert: false,
          cacheControl: "3600",
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: publicData,
      } = supabase.storage
        .from("hero")
        .getPublicUrl(filePath);

      updateEditing(
        "image_url",
        publicData.publicUrl
      );

      setMessage("Image uploaded successfully.");
    } catch (uploadError: any) {
      console.error(uploadError);

      setError(
        uploadError?.message ||
          "Could not upload image."
      );
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  }

  async function saveSlide(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!editing) return;

    if (!editing.title.trim()) {
      setError("Hero title is required.");
      return;
    }

    if (!editing.image_url.trim()) {
      setError("Please upload or provide a hero image.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        eyebrow: editing.eyebrow.trim(),
        title: editing.title.trim(),
        description:
          editing.description.trim(),
        image_url:
          editing.image_url.trim(),
        primary_button_text:
          editing.primary_button_text.trim(),
        primary_button_url:
          editing.primary_button_url.trim(),
        secondary_button_text:
          editing.secondary_button_text.trim(),
        secondary_button_url:
          editing.secondary_button_url.trim(),
        sort_order: Number(editing.sort_order),
        duration: Number(editing.duration),
        is_active: Boolean(editing.is_active),
        updated_at: new Date().toISOString(),
      };

      if (editing.id) {
        const { error: updateError } =
          await supabase
            .from("hero_slides")
            .update(payload)
            .eq("id", editing.id);

        if (updateError) {
          throw updateError;
        }

        setMessage("Hero slide updated successfully.");
      } else {
        const { error: insertError } =
          await supabase
            .from("hero_slides")
            .insert(payload);

        if (insertError) {
          throw insertError;
        }

        setMessage("Hero slide created successfully.");
      }

      await loadSlides();

      setTimeout(() => {
        setEditing(null);
        setMessage("");
      }, 900);
    } catch (saveError: any) {
      console.error(saveError);

      setError(
        saveError?.message ||
          "Could not save hero slide."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteSlide(
    slide: HeroSlide
  ) {
    const confirmed = window.confirm(
      `Delete "${slide.title}"?`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    const { error: deleteError } =
      await supabase
        .from("hero_slides")
        .delete()
        .eq("id", slide.id);

    if (deleteError) {
      console.error(deleteError);
      setError(deleteError.message);
      return;
    }

    setMessage("Hero slide deleted.");

    await loadSlides();

    if (editing?.id === slide.id) {
      setEditing(null);
    }
  }

  async function toggleSlide(
    slide: HeroSlide
  ) {
    const { error: toggleError } =
      await supabase
        .from("hero_slides")
        .update({
          is_active: !slide.is_active,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", slide.id);

    if (toggleError) {
      setError(toggleError.message);
      return;
    }

    await loadSlides();
  }

  async function moveSlide(
    slide: HeroSlide,
    direction: "up" | "down"
  ) {
    const index = slides.findIndex(
      (item) => item.id === slide.id
    );

    if (index === -1) return;

    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= slides.length
    ) {
      return;
    }

    const target = slides[targetIndex];

    await Promise.all([
      supabase
        .from("hero_slides")
        .update({
          sort_order: target.sort_order,
        })
        .eq("id", slide.id),

      supabase
        .from("hero_slides")
        .update({
          sort_order: slide.sort_order,
        })
        .eq("id", target.id),
    ]);

    await loadSlides();
  }

  return (
    <main className="min-h-screen bg-[#071A38] text-white">

      {/* =====================================================
          TOP BAR
      ====================================================== */}

      <div className="border-b border-white/10 bg-[#0B2146]">

        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-5 md:px-10">

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/35">
              Apex CMS
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
              Hero Management
            </h1>
          </div>

          <button
            type="button"
            onClick={startNew}
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[#F5F0E6]
              px-5
              py-3
              text-sm
              font-semibold
              text-[#102A56]
              transition
              hover:-translate-y-0.5
              hover:bg-white
            "
          >
            <Plus size={16} />
            Add slide
          </button>

        </div>

      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="mx-auto max-w-[1500px] px-6 py-10 md:px-10">

        {/* MESSAGE */}

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
            <Loader2 className="animate-spin text-white/50" />
          </div>
        ) : slides.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-10 text-center">

            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <ImagePlus size={24} />
            </div>

            <h2 className="mt-6 text-2xl font-semibold">
              No hero slides yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/40">
              Create your first homepage hero slide
              and upload an Apex school image.
            </p>

            <button
              type="button"
              onClick={startNew}
              className="
                mt-7
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#F5F0E6]
                px-5
                py-3
                text-sm
                font-semibold
                text-[#102A56]
              "
            >
              <Plus size={16} />
              Create first slide
            </button>

          </div>
        ) : (
          <div className="grid gap-5">

            {slides.map((slide, index) => (
              <article
                key={slide.id}
                className="
                  overflow-hidden
                  rounded-[2rem]
                  border
                  border-white/10
                  bg-white/[0.035]
                "
              >
                <div className="grid lg:grid-cols-[360px_1fr]">

                  {/* IMAGE */}

                  <div className="relative min-h-[230px] bg-[#0B2146]">

                    {slide.image_url ? (
                      <Image
                        src={slide.image_url}
                        alt={slide.title}
                        fill
                        sizes="360px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-white/20">
                        <ImagePlus size={30} />
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5">

                      <span
                        className={`
                          inline-flex
                          rounded-full
                          px-3
                          py-1
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.18em]
                          ${
                            slide.is_active
                              ? "bg-emerald-400/20 text-emerald-200"
                              : "bg-white/10 text-white/45"
                          }
                        `}
                      >
                        {slide.is_active
                          ? "Active"
                          : "Disabled"}
                      </span>

                    </div>
                  </div>

                  {/* DETAILS */}

                  <div className="p-6 md:p-8">

                    <div className="flex flex-wrap items-start justify-between gap-5">

                      <div className="min-w-0">

                        <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                          Slide {String(index + 1).padStart(2, "0")}
                        </p>

                        {slide.eyebrow && (
                          <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-white/45">
                            {slide.eyebrow}
                          </p>
                        )}

                        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                          {slide.title}
                        </h2>

                        {slide.description && (
                          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
                            {slide.description}
                          </p>
                        )}

                      </div>

                      {/* ORDER */}

                      <div className="flex items-center gap-1">

                        <button
                          type="button"
                          onClick={() =>
                            moveSlide(slide, "up")
                          }
                          disabled={index === 0}
                          className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-white/50 transition hover:bg-white/10 hover:text-white disabled:opacity-20"
                        >
                          <ArrowUp size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            moveSlide(slide, "down")
                          }
                          disabled={
                            index ===
                            slides.length - 1
                          }
                          className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-white/50 transition hover:bg-white/10 hover:text-white disabled:opacity-20"
                        >
                          <ArrowDown size={15} />
                        </button>

                      </div>

                    </div>

                    {/* META */}

                    <div className="mt-7 grid gap-3 sm:grid-cols-3">

                      <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                        <p className="text-[8px] uppercase tracking-[0.2em] text-white/25">
                          Duration
                        </p>

                        <p className="mt-2 text-sm">
                          {slide.duration / 1000}s
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                        <p className="text-[8px] uppercase tracking-[0.2em] text-white/25">
                          Primary CTA
                        </p>

                        <p className="mt-2 truncate text-sm">
                          {slide.primary_button_text ||
                            "None"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                        <p className="text-[8px] uppercase tracking-[0.2em] text-white/25">
                          Secondary CTA
                        </p>

                        <p className="mt-2 truncate text-sm">
                          {slide.secondary_button_text ||
                            "None"}
                        </p>
                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="mt-6 flex flex-wrap gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          editSlide(slide)
                        }
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-xl
                          border
                          border-white/10
                          px-4
                          py-2.5
                          text-sm
                          text-white/75
                          transition
                          hover:bg-white/10
                          hover:text-white
                        "
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          toggleSlide(slide)
                        }
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-xl
                          border
                          border-white/10
                          px-4
                          py-2.5
                          text-sm
                          text-white/75
                          transition
                          hover:bg-white/10
                          hover:text-white
                        "
                      >
                        {slide.is_active
                          ? "Disable"
                          : "Enable"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteSlide(slide)
                        }
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-xl
                          border
                          border-red-400/15
                          px-4
                          py-2.5
                          text-sm
                          text-red-200/70
                          transition
                          hover:bg-red-400/10
                          hover:text-red-200
                        "
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>

                    </div>

                  </div>

                </div>
              </article>
            ))}

          </div>
        )}

      </div>

      {/* =====================================================
          EDITOR MODAL
      ====================================================== */}

      {editing && (
        <div className="fixed inset-0 z-[500] overflow-y-auto bg-black/70 p-4 backdrop-blur-sm md:p-8">

          <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-[#0B2146] shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-8">

              <div>
                <p className="text-[9px] uppercase tracking-[0.28em] text-white/30">
                  Homepage
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  {editing.id
                    ? "Edit Hero Slide"
                    : "Create Hero Slide"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeEditor}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/50 transition hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={saveSlide}
              className="p-6 md:p-8"
            >

              <div className="grid gap-7">

                {/* IMAGE */}

                <div>

                  <label className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
                    Hero image
                  </label>

                  <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black/10">

                    <div className="relative aspect-[16/7] bg-[#071A38]">

                      {editing.image_url ? (
                        <Image
                          src={editing.image_url}
                          alt="Hero preview"
                          fill
                          sizes="900px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center text-white/20">
                          <ImagePlus size={36} />
                        </div>
                      )}

                    </div>

                    <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">

                      <div className="min-w-0">
                        <p className="text-xs text-white/40">
                          Upload an Apex school image.
                        </p>

                        {editing.image_url && (
                          <p className="mt-1 truncate text-[10px] text-white/20">
                            {editing.image_url}
                          </p>
                        )}
                      </div>

                      <label
                        className="
                          inline-flex
                          shrink-0
                          cursor-pointer
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          bg-[#F5F0E6]
                          px-4
                          py-3
                          text-sm
                          font-semibold
                          text-[#102A56]
                          transition
                          hover:bg-white
                        "
                      >
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
                          onChange={uploadImage}
                        />
                      </label>

                    </div>

                  </div>

                </div>

                {/* EYEBROW */}

                <div>
                  <label
                    htmlFor="hero-eyebrow"
                    className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35"
                  >
                    Eyebrow
                  </label>

                  <input
                    id="hero-eyebrow"
                    value={editing.eyebrow}
                    onChange={(event) =>
                      updateEditing(
                        "eyebrow",
                        event.target.value
                      )
                    }
                    placeholder="APEX PUBLIC SCHOOL"
                    className="
                      mt-3
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.035]
                      px-4
                      py-3.5
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-white/20
                      focus:border-white/25
                    "
                  />
                </div>

                {/* TITLE */}

                <div>
                  <label
                    htmlFor="hero-title"
                    className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35"
                  >
                    Main heading
                  </label>

                  <textarea
                    id="hero-title"
                    required
                    rows={3}
                    value={editing.title}
                    onChange={(event) =>
                      updateEditing(
                        "title",
                        event.target.value
                      )
                    }
                    placeholder="Learning that continues beyond the classroom."
                    className="
                      mt-3
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.035]
                      px-4
                      py-3.5
                      text-lg
                      font-semibold
                      leading-7
                      text-white
                      outline-none
                      placeholder:text-white/20
                      focus:border-white/25
                    "
                  />
                </div>

                {/* DESCRIPTION */}

                <div>
                  <label
                    htmlFor="hero-description"
                    className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35"
                  >
                    Description
                  </label>

                  <textarea
                    id="hero-description"
                    rows={3}
                    value={editing.description}
                    onChange={(event) =>
                      updateEditing(
                        "description",
                        event.target.value
                      )
                    }
                    placeholder="Academic growth is strengthened by culture..."
                    className="
                      mt-3
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.035]
                      px-4
                      py-3.5
                      text-sm
                      leading-6
                      text-white
                      outline-none
                      placeholder:text-white/20
                      focus:border-white/25
                    "
                  />
                </div>

                {/* CTAs */}

                <div className="grid gap-5 md:grid-cols-2">

                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/30">
                      Primary button
                    </p>

                    <input
                      value={
                        editing.primary_button_text
                      }
                      onChange={(event) =>
                        updateEditing(
                          "primary_button_text",
                          event.target.value
                        )
                      }
                      placeholder="Admissions 2026–27"
                      className="
                        mt-4
                        w-full
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.035]
                        px-4
                        py-3
                        text-sm
                        text-white
                        outline-none
                      "
                    />

                    <input
                      value={
                        editing.primary_button_url
                      }
                      onChange={(event) =>
                        updateEditing(
                          "primary_button_url",
                          event.target.value
                        )
                      }
                      placeholder="/admissions"
                      className="
                        mt-3
                        w-full
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.035]
                        px-4
                        py-3
                        text-sm
                        text-white/80
                        outline-none
                      "
                    />

                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/30">
                      Secondary button
                    </p>

                    <input
                      value={
                        editing.secondary_button_text
                      }
                      onChange={(event) =>
                        updateEditing(
                          "secondary_button_text",
                          event.target.value
                        )
                      }
                      placeholder="Discover Apex"
                      className="
                        mt-4
                        w-full
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.035]
                        px-4
                        py-3
                        text-sm
                        text-white
                        outline-none
                      "
                    />

                    <input
                      value={
                        editing.secondary_button_url
                      }
                      onChange={(event) =>
                        updateEditing(
                          "secondary_button_url",
                          event.target.value
                        )
                      }
                      placeholder="/about"
                      className="
                        mt-3
                        w-full
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.035]
                        px-4
                        py-3
                        text-sm
                        text-white/80
                        outline-none
                      "
                    />

                  </div>

                </div>

                {/* OPTIONS */}

                <div className="grid gap-5 md:grid-cols-3">

                  {/* ORDER */}

                  <div>
                    <label className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
                      Order
                    </label>

                    <input
                      type="number"
                      min={0}
                      value={editing.sort_order}
                      onChange={(event) =>
                        updateEditing(
                          "sort_order",
                          Number(event.target.value)
                        )
                      }
                      className="
                        mt-3
                        w-full
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.035]
                        px-4
                        py-3
                        text-sm
                        text-white
                        outline-none
                      "
                    />
                  </div>

                  {/* DURATION */}

                  <div>
                    <label className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
                      Slide duration (ms)
                    </label>

                    <input
                      type="number"
                      min={2000}
                      step={500}
                      value={editing.duration}
                      onChange={(event) =>
                        updateEditing(
                          "duration",
                          Number(event.target.value)
                        )
                      }
                      className="
                        mt-3
                        w-full
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.035]
                        px-4
                        py-3
                        text-sm
                        text-white
                        outline-none
                      "
                    />
                  </div>

                  {/* ACTIVE */}

                  <div>
                    <label className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
                      Visibility
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        updateEditing(
                          "is_active",
                          !editing.is_active
                        )
                      }
                      className={`
                        mt-3
                        flex
                        w-full
                        items-center
                        justify-between
                        rounded-xl
                        border
                        px-4
                        py-3
                        text-sm
                        transition
                        ${
                          editing.is_active
                            ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                            : "border-white/10 bg-white/[0.035] text-white/40"
                        }
                      `}
                    >
                      <span>
                        {editing.is_active
                          ? "Visible"
                          : "Hidden"}
                      </span>

                      <span
                        className={`
                          h-2.5
                          w-2.5
                          rounded-full
                          ${
                            editing.is_active
                              ? "bg-emerald-300"
                              : "bg-white/20"
                          }
                        `}
                      />
                    </button>
                  </div>

                </div>

                {/* SAVE */}

                <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={closeEditor}
                    disabled={
                      saving || uploading
                    }
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-white/10
                      px-5
                      py-3
                      text-sm
                      text-white/60
                      transition
                      hover:bg-white/10
                      hover:text-white
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      saving || uploading
                    }
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-[#F5F0E6]
                      px-6
                      py-3
                      text-sm
                      font-semibold
                      text-[#102A56]
                      transition
                      hover:bg-white
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
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
                        Save slide
                      </>
                    )}
                  </button>

                </div>

              </div>

            </form>
          </div>
        </div>
      )}
    </main>
  );
}