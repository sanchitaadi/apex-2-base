"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type Settings = {
  id?: string;

  hero_label: string;
  hero_title_line_1: string;
  hero_title_line_2: string;
  hero_description: string;

  start_button_label: string;
  start_button_anchor: string;

  gallery_button_label: string;
  gallery_button_url: string;

  established_value: string;
  established_label: string;

  campus_value: string;
  campus_label: string;

  cbse_code: string;
  cbse_label: string;

  scroll_label: string;
  scroll_anchor: string;

  video_section_label: string;
  video_heading_line_1: string;
  video_heading_line_2: string;
  video_description: string;

  youtube_video_id: string;
  youtube_title: string;

  video_status_label: string;
  video_official_label: string;
  video_location_label: string;

  youtube_button_label: string;
  youtube_button_url: string;

  highlights_section_label: string;
  highlights_heading_line_1: string;
  highlights_heading_line_2: string;

  location_label: string;
  location_address_line_1: string;
  location_address_line_2: string;
  location_meta: string;

  location_button_label: string;
  location_button_url: string;

  is_active: boolean;
};

type Highlight = {
  id?: string;
  number: string;
  title: string;
  description: string;
  sort_order: number;
  is_active: boolean;
};

const defaultSettings: Settings = {
  hero_label: "Apex Virtual Tour",
  hero_title_line_1: "Step inside",
  hero_title_line_2: "Apex Public School.",
  hero_description:
    "Take a closer look at the school, its people and the environment in which the Apex community learns and grows.",

  start_button_label: "Start the tour",
  start_button_anchor: "#tour-video",

  gallery_button_label: "View gallery",
  gallery_button_url: "/gallery",

  established_value: "1985",
  established_label: "Established",

  campus_value: "Delhi",
  campus_label: "Burari Campus",

  cbse_code: "2730184",
  cbse_label: "CBSE Code",

  scroll_label: "Scroll to explore",
  scroll_anchor: "#tour-video",

  video_section_label: "Inside Apex",
  video_heading_line_1: "Excellence in",
  video_heading_line_2: "education & growth.",
  video_description:
    "Welcome to Apex Public School. Experience the campus, learning environment and wider school community through the official school overview.",

  youtube_video_id: "WeuEZrBm3xM",
  youtube_title:
    "Inside Apex Public School | Excellence in Education & Growth",

  video_status_label: "Official school overview",
  video_official_label: "Official Apex media",
  video_location_label: "Apex Public School · Delhi",

  youtube_button_label: "Open on YouTube",
  youtube_button_url: "https://www.youtube.com/",

  highlights_section_label: "More than a tour",
  highlights_heading_line_1: "See the places",
  highlights_heading_line_2: "behind the experience.",

  location_label: "Visit Apex",
  location_address_line_1: "Apex Road, B-Block,",
  location_address_line_2: "Sant Nagar, Burari.",
  location_meta: "Delhi – 110084 · 09990061747",

  location_button_label: "Contact the school",
  location_button_url: "/contact",

  is_active: true,
};

const defaultHighlights: Highlight[] = [
  {
    number: "01",
    title: "Campus",
    description:
      "Explore the physical spaces where Apex students learn, collaborate and grow.",
    sort_order: 1,
    is_active: true,
  },
  {
    number: "02",
    title: "People",
    description:
      "See the school community that brings the academic and co-curricular experience to life.",
    sort_order: 2,
    is_active: true,
  },
  {
    number: "03",
    title: "Experience",
    description:
      "A closer look at the environment behind the Apex learning experience.",
    sort_order: 3,
    is_active: true,
  },
];

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#102A56]">
        {label}
      </span>

      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          rounded-xl
          border
          border-[#102A56]/10
          bg-white
          px-4
          py-3
          text-sm
          text-[#10203A]
          outline-none
          focus:border-[#102A56]/30
          focus:ring-2
          focus:ring-[#102A56]/10
        "
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  rows = 5,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#102A56]">
        {label}
      </span>

      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="
          w-full
          resize-y
          rounded-xl
          border
          border-[#102A56]/10
          bg-white
          px-4
          py-3
          text-sm
          leading-7
          text-[#10203A]
          outline-none
          focus:border-[#102A56]/30
          focus:ring-2
          focus:ring-[#102A56]/10
        "
      />
    </label>
  );
}

export default function AdminVirtualTourPage() {
  const [settings, setSettings] =
    useState<Settings>(defaultSettings);

  const [highlights, setHighlights] =
    useState<Highlight[]>(defaultHighlights);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const setSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const [
        { data: settingsData, error: settingsError },
        { data: highlightsData, error: highlightsError },
      ] = await Promise.all([
        supabase
          .from("virtual_tour_settings")
          .select("*")
          .limit(1)
          .maybeSingle(),

        supabase
          .from("virtual_tour_highlights")
          .select("*")
          .order("sort_order", {
            ascending: true,
          }),
      ]);

      if (settingsError) {
        console.error(settingsError);
      }

      if (highlightsError) {
        console.error(highlightsError);
      }

      if (settingsData) {
        setSettings({
          ...defaultSettings,
          ...Object.fromEntries(
            Object.entries(settingsData).map(
              ([key, value]) => [
                key,
                value === null ? "" : value,
              ]
            )
          ),
        });
      }

      if (
        highlightsData &&
        highlightsData.length > 0
      ) {
        setHighlights(
          highlightsData.map((item) => ({
            id: item.id,
            number: item.number ?? "",
            title: item.title ?? "",
            description:
              item.description ?? "",
            sort_order:
              item.sort_order ?? 0,
            is_active:
              item.is_active ?? true,
          }))
        );
      }

      setLoading(false);
    };

    load();
  }, []);

  const updateHighlight = (
    index: number,
    key: keyof Highlight,
    value: string | number | boolean
  ) => {
    setHighlights((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [key]: value,
            }
          : item
      )
    );
  };

  const addHighlight = () => {
    const nextNumber =
      highlights.length + 1;

    setHighlights((current) => [
      ...current,
      {
        number: String(nextNumber).padStart(
          2,
          "0"
        ),
        title: "",
        description: "",
        sort_order: nextNumber,
        is_active: true,
      },
    ]);
  };

  const removeHighlight = (index: number) => {
    setHighlights((current) =>
      current.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  };

  const save = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const settingsPayload = {
        ...settings,
        updated_at:
          new Date().toISOString(),
      };

      const {
        data: savedSettings,
        error: settingsError,
      } = await supabase
        .from("virtual_tour_settings")
        .upsert(settingsPayload)
        .select()
        .maybeSingle();

      if (settingsError) {
        throw settingsError;
      }

      if (!savedSettings) {
        throw new Error(
          "Virtual Tour settings could not be saved."
        );
      }

      const { error: deleteError } =
        await supabase
          .from("virtual_tour_highlights")
          .delete()
          .neq("id", "00000000-0000-0000-0000-000000000000");

      if (deleteError) {
        throw deleteError;
      }

      if (highlights.length > 0) {
        const highlightPayload =
          highlights.map(
            (item, index) => ({
              number: item.number,
              title: item.title,
              description:
                item.description,
              sort_order:
                Number(item.sort_order) ||
                index + 1,
              is_active:
                item.is_active,
              updated_at:
                new Date().toISOString(),
            })
          );

        const {
          error: highlightsError,
        } = await supabase
          .from("virtual_tour_highlights")
          .insert(highlightPayload);

        if (highlightsError) {
          throw highlightsError;
        }
      }

      setMessage(
        "Virtual Tour saved successfully."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save Virtual Tour."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-sm text-[#102A56]/60">
        Loading Virtual Tour...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E6] px-5 py-8 md:px-8 lg:px-10">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

          <div>

            <Link
              href="/admin"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#102A56]/60 hover:text-[#102A56]"
            >
              <ArrowLeft size={15} />
              Admin
            </Link>

            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#102A56]/40">
              Media
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-[#102A56]">
              Virtual Tour
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#10203A]/60">
              Manage the complete Virtual Tour page,
              including its YouTube video, highlights,
              statistics, location and links.
            </p>

          </div>

          <Link
            href="/virtual-tour"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full border border-[#102A56]/10 bg-white px-5 py-3 text-sm font-semibold text-[#102A56]"
          >
            <ExternalLink size={15} />
            View page
          </Link>

        </div>

        <form
          onSubmit={save}
          className="space-y-6"
        >

          {/* VISIBILITY */}
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

            <div className="flex items-center justify-between gap-5">

              <div>
                <h2 className="text-xl font-semibold text-[#102A56]">
                  Visibility
                </h2>

                <p className="mt-1 text-sm text-[#10203A]/55">
                  Control whether the Virtual Tour page is publicly visible.
                </p>
              </div>

              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  checked={settings.is_active}
                  onChange={(e) =>
                    setSetting(
                      "is_active",
                      e.target.checked
                    )
                  }
                  className="h-5 w-5 accent-[#102A56]"
                />

                <span className="text-sm font-semibold text-[#102A56]">
                  Published
                </span>

              </label>

            </div>

          </section>

          {/* HERO */}
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

            <h2 className="mb-6 text-xl font-semibold text-[#102A56]">
              Hero
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              <InputField
                label="Hero label"
                value={settings.hero_label}
                onChange={(value) =>
                  setSetting(
                    "hero_label",
                    value
                  )
                }
              />

              <InputField
                label="Hero title line 1"
                value={settings.hero_title_line_1}
                onChange={(value) =>
                  setSetting(
                    "hero_title_line_1",
                    value
                  )
                }
              />

              <InputField
                label="Hero title line 2"
                value={settings.hero_title_line_2}
                onChange={(value) =>
                  setSetting(
                    "hero_title_line_2",
                    value
                  )
                }
              />

            </div>

            <div className="mt-5">
              <TextareaField
                label="Hero description"
                value={settings.hero_description}
                onChange={(value) =>
                  setSetting(
                    "hero_description",
                    value
                  )
                }
              />
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <InputField
                label="Start button label"
                value={settings.start_button_label}
                onChange={(value) =>
                  setSetting(
                    "start_button_label",
                    value
                  )
                }
              />

              <InputField
                label="Start button anchor"
                value={settings.start_button_anchor}
                onChange={(value) =>
                  setSetting(
                    "start_button_anchor",
                    value
                  )
                }
              />

              <InputField
                label="Gallery button label"
                value={settings.gallery_button_label}
                onChange={(value) =>
                  setSetting(
                    "gallery_button_label",
                    value
                  )
                }
              />

              <InputField
                label="Gallery button URL"
                value={settings.gallery_button_url}
                onChange={(value) =>
                  setSetting(
                    "gallery_button_url",
                    value
                  )
                }
              />

            </div>

          </section>

          {/* HERO STATS */}
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

            <h2 className="mb-6 text-xl font-semibold text-[#102A56]">
              Hero statistics
            </h2>

            <div className="grid gap-5 md:grid-cols-3">

              <InputField
                label="Established value"
                value={settings.established_value}
                onChange={(value) =>
                  setSetting(
                    "established_value",
                    value
                  )
                }
              />

              <InputField
                label="Established label"
                value={settings.established_label}
                onChange={(value) =>
                  setSetting(
                    "established_label",
                    value
                  )
                }
              />

              <div />

              <InputField
                label="Campus value"
                value={settings.campus_value}
                onChange={(value) =>
                  setSetting(
                    "campus_value",
                    value
                  )
                }
              />

              <InputField
                label="Campus label"
                value={settings.campus_label}
                onChange={(value) =>
                  setSetting(
                    "campus_label",
                    value
                  )
                }
              />

              <div />

              <InputField
                label="CBSE code"
                value={settings.cbse_code}
                onChange={(value) =>
                  setSetting(
                    "cbse_code",
                    value
                  )
                }
              />

              <InputField
                label="CBSE label"
                value={settings.cbse_label}
                onChange={(value) =>
                  setSetting(
                    "cbse_label",
                    value
                  )
                }
              />

              <div />

            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <InputField
                label="Scroll label"
                value={settings.scroll_label}
                onChange={(value) =>
                  setSetting(
                    "scroll_label",
                    value
                  )
                }
              />

              <InputField
                label="Scroll anchor"
                value={settings.scroll_anchor}
                onChange={(value) =>
                  setSetting(
                    "scroll_anchor",
                    value
                  )
                }
              />

            </div>

          </section>

          {/* VIDEO */}
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

            <h2 className="mb-6 text-xl font-semibold text-[#102A56]">
              Virtual Tour video
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              <InputField
                label="Section label"
                value={settings.video_section_label}
                onChange={(value) =>
                  setSetting(
                    "video_section_label",
                    value
                  )
                }
              />

              <InputField
                label="YouTube video ID"
                value={settings.youtube_video_id}
                onChange={(value) =>
                  setSetting(
                    "youtube_video_id",
                    value
                  )
                }
              />

              <InputField
                label="Heading line 1"
                value={settings.video_heading_line_1}
                onChange={(value) =>
                  setSetting(
                    "video_heading_line_1",
                    value
                  )
                }
              />

              <InputField
                label="Heading line 2"
                value={settings.video_heading_line_2}
                onChange={(value) =>
                  setSetting(
                    "video_heading_line_2",
                    value
                  )
                }
              />

              <InputField
                label="Video title"
                value={settings.youtube_title}
                onChange={(value) =>
                  setSetting(
                    "youtube_title",
                    value
                  )
                }
              />

              <InputField
                label="Status label"
                value={settings.video_status_label}
                onChange={(value) =>
                  setSetting(
                    "video_status_label",
                    value
                  )
                }
              />

              <InputField
                label="Official media label"
                value={settings.video_official_label}
                onChange={(value) =>
                  setSetting(
                    "video_official_label",
                    value
                  )
                }
              />

              <InputField
                label="Video location label"
                value={settings.video_location_label}
                onChange={(value) =>
                  setSetting(
                    "video_location_label",
                    value
                  )
                }
              />

            </div>

            <div className="mt-5">
              <TextareaField
                label="Video description"
                value={settings.video_description}
                onChange={(value) =>
                  setSetting(
                    "video_description",
                    value
                  )
                }
              />
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <InputField
                label="YouTube button label"
                value={settings.youtube_button_label}
                onChange={(value) =>
                  setSetting(
                    "youtube_button_label",
                    value
                  )
                }
              />

              <InputField
                label="YouTube button URL"
                value={settings.youtube_button_url}
                onChange={(value) =>
                  setSetting(
                    "youtube_button_url",
                    value
                  )
                }
              />

            </div>

          </section>

          {/* HIGHLIGHTS HEADER */}
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

            <h2 className="mb-6 text-xl font-semibold text-[#102A56]">
              Highlights section
            </h2>

            <div className="grid gap-5 md:grid-cols-3">

              <InputField
                label="Section label"
                value={settings.highlights_section_label}
                onChange={(value) =>
                  setSetting(
                    "highlights_section_label",
                    value
                  )
                }
              />

              <InputField
                label="Heading line 1"
                value={settings.highlights_heading_line_1}
                onChange={(value) =>
                  setSetting(
                    "highlights_heading_line_1",
                    value
                  )
                }
              />

              <InputField
                label="Heading line 2"
                value={settings.highlights_heading_line_2}
                onChange={(value) =>
                  setSetting(
                    "highlights_heading_line_2",
                    value
                  )
                }
              />

            </div>

          </section>

          {/* HIGHLIGHTS */}
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-semibold text-[#102A56]">
                  Tour highlights
                </h2>

                <p className="mt-1 text-sm text-[#10203A]/55">
                  Add, remove, reorder and edit the cards shown in the Virtual Tour.
                </p>
              </div>

              <button
                type="button"
                onClick={addHighlight}
                className="inline-flex items-center gap-2 rounded-full bg-[#102A56] px-4 py-3 text-sm font-semibold text-white"
              >
                <Plus size={15} />
                Add highlight
              </button>

            </div>

            <div className="space-y-5">

              {highlights.map(
                (highlight, index) => (
                  <div
                    key={
                      highlight.id ??
                      `new-${index}`
                    }
                    className="rounded-2xl border border-[#102A56]/10 p-5"
                  >

                    <div className="mb-5 flex items-center justify-between">

                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#102A56]/40">
                        Highlight {index + 1}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          removeHighlight(
                            index
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
                      >
                        <Trash2 size={13} />
                        Remove
                      </button>

                    </div>

                    <div className="grid gap-5 md:grid-cols-3">

                      <InputField
                        label="Number"
                        value={
                          highlight.number
                        }
                        onChange={(value) =>
                          updateHighlight(
                            index,
                            "number",
                            value
                          )
                        }
                      />

                      <InputField
                        label="Title"
                        value={
                          highlight.title
                        }
                        onChange={(value) =>
                          updateHighlight(
                            index,
                            "title",
                            value
                          )
                        }
                      />

                      <InputField
                        label="Sort order"
                        value={String(
                          highlight.sort_order
                        )}
                        onChange={(value) =>
                          updateHighlight(
                            index,
                            "sort_order",
                            Number(value) ||
                              0
                          )
                        }
                      />

                    </div>

                    <div className="mt-5">
                      <TextareaField
                        label="Description"
                        value={
                          highlight.description
                        }
                        onChange={(value) =>
                          updateHighlight(
                            index,
                            "description",
                            value
                          )
                        }
                        rows={4}
                      />
                    </div>

                    <label className="mt-5 flex items-center gap-3 text-sm font-semibold text-[#102A56]">

                      <input
                        type="checkbox"
                        checked={
                          highlight.is_active
                        }
                        onChange={(e) =>
                          updateHighlight(
                            index,
                            "is_active",
                            e.target.checked
                          )
                        }
                        className="h-5 w-5 accent-[#102A56]"
                      />

                      Published

                    </label>

                  </div>
                )
              )}

            </div>

          </section>

          {/* LOCATION */}
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

            <h2 className="mb-6 text-xl font-semibold text-[#102A56]">
              Location
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              <InputField
                label="Location label"
                value={settings.location_label}
                onChange={(value) =>
                  setSetting(
                    "location_label",
                    value
                  )
                }
              />

              <InputField
                label="Location meta"
                value={settings.location_meta}
                onChange={(value) =>
                  setSetting(
                    "location_meta",
                    value
                  )
                }
              />

            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <InputField
                label="Address line 1"
                value={
                  settings.location_address_line_1
                }
                onChange={(value) =>
                  setSetting(
                    "location_address_line_1",
                    value
                  )
                }
              />

              <InputField
                label="Address line 2"
                value={
                  settings.location_address_line_2
                }
                onChange={(value) =>
                  setSetting(
                    "location_address_line_2",
                    value
                  )
                }
              />

            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <InputField
                label="Button label"
                value={
                  settings.location_button_label
                }
                onChange={(value) =>
                  setSetting(
                    "location_button_label",
                    value
                  )
                }
              />

              <InputField
                label="Button URL"
                value={
                  settings.location_button_url
                }
                onChange={(value) =>
                  setSetting(
                    "location_button_url",
                    value
                  )
                }
              />

            </div>

          </section>

          {/* SAVE */}
          <div className="sticky bottom-5 z-20 flex flex-col gap-3 rounded-2xl border border-[#102A56]/10 bg-[#F5F0E6]/95 p-4 backdrop-blur md:flex-row md:items-center md:justify-between">

            <p className="text-sm text-[#10203A]/60">
              {message ||
                "Changes are saved to the Virtual Tour CMS."}
            </p>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#102A56] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              <Save size={16} />

              {saving
                ? "Saving..."
                : "Save Virtual Tour"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}