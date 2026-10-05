"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Eye,
  EyeOff,
  Loader2,
  Save,
} from "lucide-react";
import { supabase } from "@/lib/supabase/browser";

type NewsEventsSettings = {
  id?: string;

  section_label: string;
  heading_line_1: string;
  heading_line_2: string;
  description: string;

  view_all_label: string;
  view_all_url: string;

  featured_button_label: string;
  secondary_button_label: string;

  max_items: number;
  is_active: boolean;
};

const DEFAULT_SETTINGS: NewsEventsSettings = {
  section_label: "Notices & Events",
  heading_line_1: "What's happening",
  heading_line_2: "at Apex.",
  description:
    "Stay informed about school announcements, admissions, activities, holidays and important communications.",

  view_all_label: "View all notices",
  view_all_url: "/notices",

  featured_button_label: "Read notice",
  secondary_button_label: "Read more",

  max_items: 4,
  is_active: true,
};

export default function AdminNewsEventsPage() {
  const [settings, setSettings] =
    useState<NewsEventsSettings>(DEFAULT_SETTINGS);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase
        .from("news_events_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(
          "News & Events settings load failed:",
          {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          }
        );
      }

      if (data) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...data,
        });
      }

      setLoading(false);
    }

    void loadSettings();
  }, []);

  function updateField<
    K extends keyof NewsEventsSettings
  >(
    field: K,
    value: NewsEventsSettings[K]
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  }

  async function saveSettings() {
    setSaving(true);
    setSaved(false);

    try {
      const payload = {
        section_label:
          settings.section_label.trim(),

        heading_line_1:
          settings.heading_line_1.trim(),

        heading_line_2:
          settings.heading_line_2.trim(),

        description:
          settings.description.trim(),

        view_all_label:
          settings.view_all_label.trim(),

        view_all_url:
          settings.view_all_url.trim() || "/notices",

        featured_button_label:
          settings.featured_button_label.trim(),

        secondary_button_label:
          settings.secondary_button_label.trim(),

        max_items:
          Math.min(
            8,
            Math.max(
              1,
              Number(settings.max_items) || 4
            )
          ),

        is_active:
          settings.is_active,

        updated_at:
          new Date().toISOString(),
      };

      const { data: existing, error: existingError } =
        await supabase
          .from("news_events_settings")
          .select("id")
          .limit(1)
          .maybeSingle();

      if (existingError) {
        throw existingError;
      }

      if (existing?.id) {
        const { error } = await supabase
          .from("news_events_settings")
          .update(payload)
          .eq("id", existing.id);

        if (error) {
          throw error;
        }

        setSettings((current) => ({
          ...current,
          id: existing.id,
          ...payload,
        }));
      } else {
        const { data, error } =
          await supabase
            .from("news_events_settings")
            .insert(payload)
            .select("*")
            .single();

        if (error) {
          throw error;
        }

        if (data) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...data,
          });
        }
      }

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error(
        "News & Events settings save failed:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to save News & Events settings."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="grid min-h-[calc(100vh-72px)] place-items-center bg-[#F4F1EA]">
        <div className="flex items-center gap-3 text-sm text-[#102A56]/50">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading News & Events settings...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F1EA] px-5 py-8 text-[#10203A] md:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="flex flex-col gap-5 border-b border-[#102A56]/10 pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#102A56]/40">
              Homepage CMS
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-[#102A56]">
              News & Events
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#102A56]/55">
              Control the News & Events section shown on the Apex
              homepage. Individual notices are managed from Admin →
              Notices.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void saveSettings()}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#102A56] px-6 py-3 text-sm font-semibold text-[#F5F0E6] transition hover:bg-[#193C78] disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saved ? (
              <Check className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            {saving
              ? "Saving..."
              : saved
              ? "Saved"
              : "Save Changes"}
          </button>
        </div>

        {/* SECTION CONTENT */}
        <section className="mt-8 rounded-[28px] border border-[#102A56]/10 bg-white/70 p-6 shadow-[0_20px_70px_rgba(16,42,86,0.05)] md:p-8">
          <SectionHeader
            eyebrow="Section Content"
            title="Homepage heading"
            description="These fields control the main heading and introduction."
          />

          <div className="mt-7 space-y-6">
            <Field
              label="Section Label"
              value={settings.section_label}
              onChange={(value) =>
                updateField(
                  "section_label",
                  value
                )
              }
              placeholder="Notices & Events"
            />

            <div className="grid gap-6 md:grid-cols-2">
              <Field
                label="Heading Line 1"
                value={settings.heading_line_1}
                onChange={(value) =>
                  updateField(
                    "heading_line_1",
                    value
                  )
                }
                placeholder="What's happening"
              />

              <Field
                label="Heading Line 2"
                value={settings.heading_line_2}
                onChange={(value) =>
                  updateField(
                    "heading_line_2",
                    value
                  )
                }
                placeholder="at Apex."
              />
            </div>

            <TextArea
              label="Section Description"
              value={settings.description}
              onChange={(value) =>
                updateField(
                  "description",
                  value
                )
              }
              rows={5}
              placeholder="Stay informed..."
            />
          </div>
        </section>

        {/* BUTTONS */}
        <section className="mt-6 rounded-[28px] border border-[#102A56]/10 bg-white/70 p-6 shadow-[0_20px_70px_rgba(16,42,86,0.05)] md:p-8">
          <SectionHeader
            eyebrow="Buttons"
            title="Homepage actions"
            description="Control the text and destination of the buttons displayed in this section."
          />

          <div className="mt-7 grid gap-6 md:grid-cols-2">
            {/* VIEW ALL */}
            <div className="rounded-2xl border border-[#102A56]/10 bg-[#F4F1EA]/70 p-5">
              <p className="text-sm font-semibold text-[#102A56]">
                View All button
              </p>

              <div className="mt-5 space-y-4">
                <Field
                  label="Button Label"
                  value={settings.view_all_label}
                  onChange={(value) =>
                    updateField(
                      "view_all_label",
                      value
                    )
                  }
                  placeholder="View all notices"
                />

                <Field
                  label="Button URL"
                  value={settings.view_all_url}
                  onChange={(value) =>
                    updateField(
                      "view_all_url",
                      value
                    )
                  }
                  placeholder="/notices"
                />
              </div>
            </div>

            {/* FEATURED */}
            <div className="rounded-2xl border border-[#102A56]/10 bg-[#F4F1EA]/70 p-5">
              <p className="text-sm font-semibold text-[#102A56]">
                Featured notice button
              </p>

              <div className="mt-5">
                <Field
                  label="Button Label"
                  value={
                    settings.featured_button_label
                  }
                  onChange={(value) =>
                    updateField(
                      "featured_button_label",
                      value
                    )
                  }
                  placeholder="Read notice"
                />
              </div>
            </div>

            {/* SECONDARY */}
            <div className="rounded-2xl border border-[#102A56]/10 bg-[#F4F1EA]/70 p-5">
              <p className="text-sm font-semibold text-[#102A56]">
                Secondary notice button
              </p>

              <div className="mt-5">
                <Field
                  label="Button Label"
                  value={
                    settings.secondary_button_label
                  }
                  onChange={(value) =>
                    updateField(
                      "secondary_button_label",
                      value
                    )
                  }
                  placeholder="Read more"
                />
              </div>
            </div>

            {/* ITEM COUNT */}
            <div className="rounded-2xl border border-[#102A56]/10 bg-[#F4F1EA]/70 p-5">
              <p className="text-sm font-semibold text-[#102A56]">
                Homepage notice count
              </p>

              <p className="mt-1 text-xs leading-5 text-[#102A56]/45">
                Maximum number of notices shown in the section.
              </p>

              <input
                type="number"
                min={1}
                max={8}
                value={settings.max_items}
                onChange={(event) =>
                  updateField(
                    "max_items",
                    Number(event.target.value)
                  )
                }
                className="mt-5 w-full rounded-2xl border border-[#102A56]/12 bg-white px-4 py-3 text-sm text-[#10203A] outline-none focus:border-[#102A56]/30"
              />
            </div>
          </div>
        </section>

        {/* STATUS */}
        <section className="mt-6 rounded-[28px] border border-[#102A56]/10 bg-white/70 p-6 shadow-[0_20px_70px_rgba(16,42,86,0.05)] md:p-8">
          <SectionHeader
            eyebrow="Visibility"
            title="Homepage section status"
            description="Hide the entire News & Events section without deleting its content."
          />

          <button
            type="button"
            onClick={() =>
              updateField(
                "is_active",
                !settings.is_active
              )
            }
            className={`mt-7 flex w-full items-center justify-between rounded-2xl border p-5 text-left transition ${
              settings.is_active
                ? "border-emerald-200 bg-emerald-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`grid h-11 w-11 place-items-center rounded-full ${
                  settings.is_active
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {settings.is_active ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-[#102A56]">
                  {settings.is_active
                    ? "Section is published"
                    : "Section is hidden"}
                </p>

                <p className="mt-1 text-xs text-[#102A56]/50">
                  {settings.is_active
                    ? "The News & Events section is visible on the homepage."
                    : "The News & Events section is hidden from the homepage."}
                </p>
              </div>
            </div>

            <div
              className={`h-6 w-11 rounded-full p-1 ${
                settings.is_active
                  ? "bg-emerald-600"
                  : "bg-red-500"
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full bg-white transition-transform ${
                  settings.is_active
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </div>
          </button>
        </section>

        {/* INFO */}
        <section className="mt-6 rounded-[28px] border border-[#102A56]/10 bg-[#102A56] p-6 text-[#F5F0E6] md:p-8">
          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#F5F0E6]/40">
            How this works
          </p>

          <div className="mt-4 grid gap-6 md:grid-cols-3">
            <InfoItem
              title="Individual notices"
              text="Create and edit announcements from Admin → Notices."
            />

            <InfoItem
              title="Homepage display"
              text="The newest active notices are automatically displayed here."
            />

            <InfoItem
              title="Section design"
              text="Use this page to control the homepage News & Events text and buttons."
            />
          </div>
        </section>

        {/* BOTTOM SAVE */}
        <div className="sticky bottom-5 z-20 mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => void saveSettings()}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-[#102A56] px-7 py-4 text-sm font-semibold text-[#F5F0E6] shadow-[0_15px_40px_rgba(16,42,86,0.20)] transition hover:bg-[#193C78] disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saved ? (
              <Check className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            {saving
              ? "Saving..."
              : saved
              ? "Saved"
              : "Save Changes"}
          </button>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#102A56]/40">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#102A56]">
        {title}
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#102A56]/50">
        {description}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-[#102A56]/65">
        {label}
      </label>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-2xl border border-[#102A56]/12 bg-white px-4 py-3 text-sm text-[#10203A] outline-none transition focus:border-[#102A56]/35"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-[#102A56]/65">
        {label}
      </label>

      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full resize-y rounded-2xl border border-[#102A56]/12 bg-white px-4 py-3 text-sm leading-6 text-[#10203A] outline-none transition focus:border-[#102A56]/35"
      />
    </div>
  );
}

function InfoItem({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div>
      <p className="text-sm font-semibold">
        {title}
      </p>

      <p className="mt-2 text-xs leading-6 text-[#F5F0E6]/45">
        {text}
      </p>
    </div>
  );
}