"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type MissionVision = {
  id?: string;
  slug: string;
  menu_label: string;
  title: string;
  eyebrow: string;
  mission: string;
  vision: string;
  content: string;

  intro_description: string;
  intro_section_label: string;
  intro_heading_line_1: string;
  intro_heading_line_2: string;

  mission_number: string;
  mission_label: string;
  mission_icon_name: string;

  vision_number: string;
  vision_label: string;
  vision_icon_name: string;

  commitment_label: string;

  back_link_label: string;
  back_link_url: string;

  footer_label: string;
  footer_title: string;
  footer_button_label: string;
  footer_button_url: string;

  is_active: boolean;
};

const defaultData: MissionVision = {
  slug: "mission-vision",
  menu_label: "Mission & Vision",
  title: "Our Mission & Vision",
  eyebrow: "ABOUT APEX",
  mission:
    "In the next three years we strive towards the holistic development of our students in a friendly learning environment while providing them with opportunities to equip them with life skills to be role models for the generations to follow",
  vision:
    "Our Vision is to develop our students into human beings who are not only educated through books but in values that make them leaders of the future World",
  content:
    "Apex Public School strives towards the holistic development of its students in a friendly learning environment while providing opportunities to equip them with life skills and values for the generations to follow.",

  intro_description:
    "Education at Apex is shaped by learning, character, values and responsibility.",
  intro_section_label: "Our direction",
  intro_heading_line_1: "Education with purpose,",
  intro_heading_line_2: "values and responsibility.",

  mission_number: "01",
  mission_label: "Our Mission",
  mission_icon_name: "Heart",

  vision_number: "02",
  vision_label: "Our Vision",
  vision_icon_name: "Eye",

  commitment_label: "Our commitment",

  back_link_label: "Back to About",
  back_link_url: "/about",

  footer_label: "Apex Public School",
  footer_title: "Answer Duty's Call",
  footer_button_label: "About Apex",
  footer_button_url: "/about",

  is_active: true,
};

function InputField({
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
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#102A56]">
        {label}
      </span>

      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
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
          transition
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
  rows = 7,
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
          transition
          focus:border-[#102A56]/30
          focus:ring-2
          focus:ring-[#102A56]/10
        "
      />
    </label>
  );
}

export default function AdminMissionVisionPage() {
  const [form, setForm] = useState<MissionVision>(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const setField = <K extends keyof MissionVision>(
    key: K,
    value: MissionVision[K]
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("about_pages")
        .select("*")
        .eq("slug", "mission-vision")
        .maybeSingle();

      if (error) {
        console.error(error);
        setMessage("Unable to load Mission & Vision content.");
        setLoading(false);
        return;
      }

      if (data) {
        const cleanedData = Object.fromEntries(
          Object.entries(data).map(([key, value]) => [
            key,
            value === null ? "" : value,
          ])
        );

        setForm({
          ...defaultData,
          ...(cleanedData as Partial<MissionVision>),
        });
      }

      setLoading(false);
    };

    load();
  }, []);

  const save = async (event: FormEvent) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    const payload = {
      slug: "mission-vision",
      menu_label: form.menu_label,
      title: form.title,
      eyebrow: form.eyebrow,
      mission: form.mission,
      vision: form.vision,
      content: form.content,

      intro_description: form.intro_description,
      intro_section_label: form.intro_section_label,
      intro_heading_line_1: form.intro_heading_line_1,
      intro_heading_line_2: form.intro_heading_line_2,

      mission_number: form.mission_number,
      mission_label: form.mission_label,
      mission_icon_name: form.mission_icon_name,

      vision_number: form.vision_number,
      vision_label: form.vision_label,
      vision_icon_name: form.vision_icon_name,

      commitment_label: form.commitment_label,

      back_link_label: form.back_link_label,
      back_link_url: form.back_link_url,

      footer_label: form.footer_label,
      footer_title: form.footer_title,
      footer_button_label: form.footer_button_label,
      footer_button_url: form.footer_button_url,

      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("about_pages")
      .upsert(payload, {
        onConflict: "slug",
      });

    if (error) {
      console.error(error);
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setMessage("Mission & Vision saved successfully.");
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-sm text-[#102A56]/60">
        Loading Mission & Vision...
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
              href="/admin/about"
              className="
                mb-4
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                text-[#102A56]/60
                transition
                hover:text-[#102A56]
              "
            >
              <ArrowLeft size={15} />
              About
            </Link>

            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#102A56]/40">
              About Apex
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-[#102A56]">
              Mission & Vision
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#10203A]/60">
              Manage all text, labels and navigation used on the Mission &
              Vision page.
            </p>
          </div>

          <Link
            href="/about/mission-vision"
            target="_blank"
            className="
              inline-flex
              items-center
              justify-center
              rounded-full
              border
              border-[#102A56]/10
              bg-white
              px-5
              py-3
              text-sm
              font-semibold
              text-[#102A56]
            "
          >
            View page
          </Link>
        </div>

        <form onSubmit={save} className="space-y-6">

          {/* STATUS */}
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between gap-5">
              <div>
                <h2 className="text-xl font-semibold text-[#102A56]">
                  Visibility
                </h2>

                <p className="mt-1 text-sm text-[#10203A]/55">
                  Control whether this page is visible publicly.
                </p>
              </div>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={!!form.is_active}
                  onChange={(e) =>
                    setField("is_active", e.target.checked)
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
                label="Menu label"
                value={form.menu_label}
                onChange={(value) => setField("menu_label", value)}
              />

              <InputField
                label="Eyebrow"
                value={form.eyebrow}
                onChange={(value) => setField("eyebrow", value)}
              />
            </div>

            <div className="mt-5">
              <InputField
                label="Page title"
                value={form.title}
                onChange={(value) => setField("title", value)}
              />
            </div>

            <div className="mt-5">
              <TextareaField
                label="Hero description"
                value={form.intro_description}
                onChange={(value) =>
                  setField("intro_description", value)
                }
                rows={4}
              />
            </div>
          </section>

          {/* INTRO */}
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-6 text-xl font-semibold text-[#102A56]">
              Direction section
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Section label"
                value={form.intro_section_label}
                onChange={(value) =>
                  setField("intro_section_label", value)
                }
              />

              <div />

              <InputField
                label="Heading line 1"
                value={form.intro_heading_line_1}
                onChange={(value) =>
                  setField("intro_heading_line_1", value)
                }
              />

              <InputField
                label="Heading line 2"
                value={form.intro_heading_line_2}
                onChange={(value) =>
                  setField("intro_heading_line_2", value)
                }
              />
            </div>
          </section>

          {/* MISSION */}
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-6 text-xl font-semibold text-[#102A56]">
              Mission
            </h2>

            <div className="grid gap-5 md:grid-cols-3">
              <InputField
                label="Number"
                value={form.mission_number}
                onChange={(value) =>
                  setField("mission_number", value)
                }
              />

              <InputField
                label="Label"
                value={form.mission_label}
                onChange={(value) =>
                  setField("mission_label", value)
                }
              />

              <InputField
                label="Icon name"
                value={form.mission_icon_name}
                onChange={(value) =>
                  setField("mission_icon_name", value)
                }
              />
            </div>

            <div className="mt-5">
              <TextareaField
                label="Mission text"
                value={form.mission}
                onChange={(value) => setField("mission", value)}
                rows={9}
              />
            </div>
          </section>

          {/* VISION */}
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-6 text-xl font-semibold text-[#102A56]">
              Vision
            </h2>

            <div className="grid gap-5 md:grid-cols-3">
              <InputField
                label="Number"
                value={form.vision_number}
                onChange={(value) =>
                  setField("vision_number", value)
                }
              />

              <InputField
                label="Label"
                value={form.vision_label}
                onChange={(value) =>
                  setField("vision_label", value)
                }
              />

              <InputField
                label="Icon name"
                value={form.vision_icon_name}
                onChange={(value) =>
                  setField("vision_icon_name", value)
                }
              />
            </div>

            <div className="mt-5">
              <TextareaField
                label="Vision text"
                value={form.vision}
                onChange={(value) => setField("vision", value)}
                rows={9}
              />
            </div>
          </section>

          {/* COMMITMENT */}
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-6 text-xl font-semibold text-[#102A56]">
              Commitment
            </h2>

            <InputField
              label="Section label"
              value={form.commitment_label}
              onChange={(value) =>
                setField("commitment_label", value)
              }
            />

            <div className="mt-5">
              <TextareaField
                label="Commitment text"
                value={form.content}
                onChange={(value) => setField("content", value)}
                rows={8}
              />
            </div>
          </section>

          {/* NAVIGATION */}
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-6 text-xl font-semibold text-[#102A56]">
              Navigation
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Back button label"
                value={form.back_link_label}
                onChange={(value) =>
                  setField("back_link_label", value)
                }
              />

              <InputField
                label="Back button URL"
                value={form.back_link_url}
                onChange={(value) =>
                  setField("back_link_url", value)
                }
              />
            </div>
          </section>

          {/* FOOTER CTA */}
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-6 text-xl font-semibold text-[#102A56]">
              Footer CTA
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Footer label"
                value={form.footer_label}
                onChange={(value) =>
                  setField("footer_label", value)
                }
              />

              <InputField
                label="Footer title"
                value={form.footer_title}
                onChange={(value) =>
                  setField("footer_title", value)
                }
              />

              <InputField
                label="Button label"
                value={form.footer_button_label}
                onChange={(value) =>
                  setField("footer_button_label", value)
                }
              />

              <InputField
                label="Button URL"
                value={form.footer_button_url}
                onChange={(value) =>
                  setField("footer_button_url", value)
                }
              />
            </div>
          </section>

          {/* SAVE */}
          <div className="sticky bottom-5 z-20 flex flex-col gap-3 rounded-2xl border border-[#102A56]/10 bg-[#F5F0E6]/95 p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-[#10203A]/60">
              {message || "Changes are saved to the Mission & Vision CMS."}
            </p>

            <button
              type="submit"
              disabled={saving}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#102A56]
                px-6
                py-3
                text-sm
                font-semibold
                !text-[#F5F0E6]
                transition
                hover:-translate-y-0.5
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Mission & Vision"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}