"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Loader2,
  Save,
} from "lucide-react";
import { supabase } from "@/lib/supabase/browser";

type ContactSettings = {
  id: string;

  hero_label: string;
  hero_title: string;
  hero_description: string;

  location_label: string;
  location_description: string;

  phone_label: string;
  phone_description: string;

  email_label: string;
  email_description: string;

  form_label: string;
  form_title: string;
  form_description: string;

  enquiries_title: string;
  enquiries_description: string;

  general_title: string;
  general_description: string;

  closing_title: string;
  closing_description: string;

  updated_at: string;
};

const DEFAULT_VALUES: Omit<ContactSettings, "id" | "updated_at"> = {
  hero_label: "Contact Apex",
  hero_title: "Let's stay connected.",
  hero_description:
    "Whether you are a parent, student, prospective family or member of the Apex community, we are here to help.",

  location_label: "Our location",
  location_description:
    "Visit the Apex Public School campus for admissions, enquiries and school-related information.",

  phone_label: "Contact us",
  phone_description:
    "Call the school for admissions, general enquiries and important school-related information.",

  email_label: "Write some words",
  email_description:
    "Send us your question, enquiry or message and the school team can get back to you.",

  form_label: "Write to Apex",
  form_title: "Tell us what you need.",
  form_description:
    "Use the form to send a message to the school.",

  enquiries_title: "School enquiries",
  enquiries_description:
    "Contact the school during working hours.",

  general_title: "General enquiries",
  general_description:
    "Admissions, academics and school information.",

  closing_title: "Questions, ideas or enquiries?",
  closing_description:
    "We're here to hear from you.",
};

export default function AdminContactPage() {
  const [settings, setSettings] = useState<
    Omit<ContactSettings, "id" | "updated_at">
  >(DEFAULT_VALUES);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase
        .from("contact_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Contact settings load failed:", error);
      }

      if (data) {
        setSettings({
          hero_label: data.hero_label ?? DEFAULT_VALUES.hero_label,
          hero_title: data.hero_title ?? DEFAULT_VALUES.hero_title,
          hero_description:
            data.hero_description ?? DEFAULT_VALUES.hero_description,

          location_label:
            data.location_label ?? DEFAULT_VALUES.location_label,
          location_description:
            data.location_description ??
            DEFAULT_VALUES.location_description,

          phone_label:
            data.phone_label ?? DEFAULT_VALUES.phone_label,
          phone_description:
            data.phone_description ??
            DEFAULT_VALUES.phone_description,

          email_label:
            data.email_label ?? DEFAULT_VALUES.email_label,
          email_description:
            data.email_description ??
            DEFAULT_VALUES.email_description,

          form_label:
            data.form_label ?? DEFAULT_VALUES.form_label,
          form_title:
            data.form_title ?? DEFAULT_VALUES.form_title,
          form_description:
            data.form_description ??
            DEFAULT_VALUES.form_description,

          enquiries_title:
            data.enquiries_title ??
            DEFAULT_VALUES.enquiries_title,
          enquiries_description:
            data.enquiries_description ??
            DEFAULT_VALUES.enquiries_description,

          general_title:
            data.general_title ??
            DEFAULT_VALUES.general_title,
          general_description:
            data.general_description ??
            DEFAULT_VALUES.general_description,

          closing_title:
            data.closing_title ??
            DEFAULT_VALUES.closing_title,
          closing_description:
            data.closing_description ??
            DEFAULT_VALUES.closing_description,
        });
      }

      setLoading(false);
    }

    void loadSettings();
  }, []);

  function update(
    field: keyof typeof settings,
    value: string
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

    const { data: existing } = await supabase
      .from("contact_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    let error;

    if (existing?.id) {
      ({ error } = await supabase
        .from("contact_settings")
        .update({
          ...settings,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id));
    } else {
      ({ error } = await supabase
        .from("contact_settings")
        .insert({
          ...settings,
          updated_at: new Date().toISOString(),
        }));
    }

    if (error) {
      console.error(error);
      alert(error.message);
      setSaving(false);
      return;
    }

    setSaved(true);
    setSaving(false);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  }

  if (loading) {
    return (
      <main className="grid min-h-[calc(100vh-72px)] place-items-center bg-[#F4F1EA]">
        <div className="flex items-center gap-3 text-sm text-[#102A56]/50">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading contact settings...
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
              Website Content
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em]">
              Contact Page
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#102A56]/55">
              Control the text displayed throughout the public Contact page.
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
              : "Save Contact Page"}
          </button>
        </div>

        {/* HERO */}
        <section className="mt-8 rounded-[28px] border border-[#102A56]/10 bg-white/70 p-6 md:p-8">
          <SectionTitle
            eyebrow="Hero"
            title="Contact hero"
          />

          <div className="mt-6 space-y-5">
            <Field
              label="Hero Label"
              value={settings.hero_label}
              onChange={(value) =>
                update("hero_label", value)
              }
            />

            <Field
              label="Hero Title"
              value={settings.hero_title}
              onChange={(value) =>
                update("hero_title", value)
              }
            />

            <TextAreaField
              label="Hero Description"
              value={settings.hero_description}
              onChange={(value) =>
                update("hero_description", value)
              }
              rows={4}
            />
          </div>
        </section>

        {/* CONTACT CARDS */}
        <section className="mt-6 rounded-[28px] border border-[#102A56]/10 bg-white/70 p-6 md:p-8">
          <SectionTitle
            eyebrow="Contact Cards"
            title="Location, phone and email"
          />

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <CardEditor
              number="01"
              title="Location"
              label={settings.location_label}
              description={settings.location_description}
              onLabel={(value) =>
                update("location_label", value)
              }
              onDescription={(value) =>
                update("location_description", value)
              }
            />

            <CardEditor
              number="02"
              title="Phone"
              label={settings.phone_label}
              description={settings.phone_description}
              onLabel={(value) =>
                update("phone_label", value)
              }
              onDescription={(value) =>
                update("phone_description", value)
              }
            />

            <CardEditor
              number="03"
              title="Email"
              label={settings.email_label}
              description={settings.email_description}
              onLabel={(value) =>
                update("email_label", value)
              }
              onDescription={(value) =>
                update("email_description", value)
              }
            />
          </div>
        </section>

        {/* FORM */}
        <section className="mt-6 rounded-[28px] border border-[#102A56]/10 bg-white/70 p-6 md:p-8">
          <SectionTitle
            eyebrow="Enquiry Form"
            title="Form content"
          />

          <div className="mt-6 space-y-5">
            <Field
              label="Form Label"
              value={settings.form_label}
              onChange={(value) =>
                update("form_label", value)
              }
            />

            <Field
              label="Form Title"
              value={settings.form_title}
              onChange={(value) =>
                update("form_title", value)
              }
            />

            <TextAreaField
              label="Form Description"
              value={settings.form_description}
              onChange={(value) =>
                update("form_description", value)
              }
              rows={3}
            />
          </div>
        </section>

        {/* INFO BLOCKS */}
        <section className="mt-6 rounded-[28px] border border-[#102A56]/10 bg-white/70 p-6 md:p-8">
          <SectionTitle
            eyebrow="Information"
            title="Enquiry information"
          />

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <CardEditor
              number="01"
              title="School Enquiries"
              label={settings.enquiries_title}
              description={settings.enquiries_description}
              onLabel={(value) =>
                update("enquiries_title", value)
              }
              onDescription={(value) =>
                update(
                  "enquiries_description",
                  value
                )
              }
            />

            <CardEditor
              number="02"
              title="General Enquiries"
              label={settings.general_title}
              description={settings.general_description}
              onLabel={(value) =>
                update("general_title", value)
              }
              onDescription={(value) =>
                update(
                  "general_description",
                  value
                )
              }
            />
          </div>
        </section>

        {/* CLOSING */}
        <section className="mt-6 rounded-[28px] border border-[#102A56]/10 bg-white/70 p-6 md:p-8">
          <SectionTitle
            eyebrow="Closing Section"
            title="Bottom message"
          />

          <div className="mt-6 space-y-5">
            <Field
              label="Closing Title"
              value={settings.closing_title}
              onChange={(value) =>
                update("closing_title", value)
              }
            />

            <TextAreaField
              label="Closing Description"
              value={settings.closing_description}
              onChange={(value) =>
                update("closing_description", value)
              }
              rows={3}
            />
          </div>
        </section>

        {/* SAVE */}
        <div className="sticky bottom-5 z-20 mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => void saveSettings()}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-[#102A56] px-7 py-4 text-sm font-semibold text-[#F5F0E6] shadow-[0_15px_40px_rgba(16,42,86,0.20)] disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            {saving ? "Saving..." : "Save Contact Page"}
          </button>
        </div>
      </div>
    </main>
  );
}

function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#102A56]/40">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#102A56]">
        {title}
      </h2>
    </div>
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
      <label className="mb-2 block text-xs font-semibold text-[#102A56]/65">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-2xl border border-[#102A56]/12 bg-white px-4 py-3 text-sm text-[#10203A] outline-none transition focus:border-[#102A56]/35"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-[#102A56]/65">
        {label}
      </label>

      <textarea
        value={value}
        rows={rows}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full resize-y rounded-2xl border border-[#102A56]/12 bg-white px-4 py-3 text-sm leading-6 text-[#10203A] outline-none transition focus:border-[#102A56]/35"
      />
    </div>
  );
}

function CardEditor({
  number,
  title,
  label,
  description,
  onLabel,
  onDescription,
}: {
  number: string;
  title: string;
  label: string;
  description: string;
  onLabel: (value: string) => void;
  onDescription: (value: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-[#102A56]/10 bg-[#F4F1EA]/70 p-5">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#102A56]/35">
            {number}
          </span>

          <h3 className="mt-2 text-lg font-semibold text-[#102A56]">
            {title}
          </h3>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <Field
          label="Label"
          value={label}
          onChange={onLabel}
        />

        <TextAreaField
          label="Description"
          value={description}
          onChange={onDescription}
          rows={5}
        />
      </div>
    </div>
  );
}