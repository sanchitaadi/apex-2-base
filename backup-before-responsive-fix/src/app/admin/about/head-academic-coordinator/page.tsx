"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Save,
  Upload,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type CoordinatorPage = {
  id?: string;
  slug: string;
  menu_label: string;
  title: string;
  eyebrow: string;
  person_name: string;
  person_role: string;
  content: string;
  image_url: string;

  hero_back_label: string;
  hero_back_url: string;

  image_label: string;
  profile_label: string;

  message_heading_line_1: string;
  message_heading_line_2: string;

  focus_section_enabled: boolean;

  focus_card_1_number: string;
  focus_card_1_title: string;
  focus_card_1_description: string;

  focus_card_2_number: string;
  focus_card_2_title: string;
  focus_card_2_description: string;

  focus_card_3_number: string;
  focus_card_3_title: string;
  focus_card_3_description: string;

  phone_number: string;
  phone_button_label: string;

  email_address: string;
  email_button_label: string;

  bottom_back_label: string;
  bottom_back_url: string;

  is_active: boolean;
};

const defaultData: CoordinatorPage = {
  slug: "head-academic-coordinator",
  menu_label: "Head Academic Coordinator",
  eyebrow: "Head Academic Coordinator’s Message",
  title: "Head Academic Coordinator’s Message",
  person_name: "Ms. Deepa Sharma",
  person_role: "Head Academic Coordinator",

  image_url:
    "https://apexpublicschool.in/wp-content/uploads/2025/10/WhatsApp-Image-2025-09-20-at-12.24.39-PM-2.jpeg",

  content: `At APEX PUBLIC SCHOOL we believe that education is not only about imparting knowledge but also about nurturing values, creativity, and a spirit of lifelong learning. As the Head Academic Coordinator, it is my privilege to work closely with our dedicated team of teachers, students, and parents to ensure that every child receives a holistic and enriching learning experience.

Our academic framework is designed to balance scholastic excellence with co-scholastic growth, encouraging students to develop critical thinking, problem-solving abilities, and confidence to meet the challenges of tomorrow. Regular monitoring of syllabus completion, innovative teaching practices, and differentiated support for learners help us maintain high academic standards while addressing individual learning needs.

We are equally committed to integrating values, skills, and sustainable practices into our curriculum so that our students emerge as responsible global citizens. With continuous collaboration between teachers, coordinators, and parents, we strive to create an atmosphere where curiosity is nurtured, talents are celebrated, and progress is measured not only in grades but in character and resilience.

I extend my heartfelt gratitude to our educators for their dedication, to parents for their trust, and to our students for their enthusiasm and hard work. Together, we will continue to build an environment of excellence and inspiration at Apex Public School.

Answer Duty’s Call

Ms. Deepa Sharma
Head Academic Coordinator`,

  hero_back_label: "About Apex",
  hero_back_url: "/about",

  image_label: "Academic Leadership",
  profile_label: "Head Academic Coordinator's Message",

  message_heading_line_1: "Academic leadership",
  message_heading_line_2: "with purpose.",

  focus_section_enabled: true,

  focus_card_1_number: "01",
  focus_card_1_title: "Holistic Learning",
  focus_card_1_description:
    "Balancing scholastic excellence with co-scholastic development and lifelong learning.",

  focus_card_2_number: "02",
  focus_card_2_title: "Innovation",
  focus_card_2_description:
    "Encouraging critical thinking, problem solving, creativity and innovative teaching practices.",

  focus_card_3_number: "03",
  focus_card_3_title: "Future Ready",
  focus_card_3_description:
    "Preparing students with the confidence and skills needed for the challenges of tomorrow.",

  phone_number: "09990061747",
  phone_button_label: "Contact school",

  email_address: "contacts.apexschool@gmail.com",
  email_button_label: "Email school",

  bottom_back_label: "Back to About Apex",
  bottom_back_url: "/about",

  is_active: true,
};

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

export default function AdminHeadAcademicCoordinatorPage() {
  const [form, setForm] =
    useState<CoordinatorPage>(defaultData);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const setField = <K extends keyof CoordinatorPage>(
    key: K,
    value: CoordinatorPage[K]
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
        .eq("slug", "head-academic-coordinator")
        .maybeSingle();

      if (error) {
        console.error(error);
        setMessage(
          "Unable to load Head Academic Coordinator content."
        );
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
          ...(cleanedData as Partial<CoordinatorPage>),
        });
      }

      setLoading(false);
    };

    load();
  }, []);

  const uploadImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage("Image must be smaller than 10MB.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const path =
        `head-academic-coordinator/${Date.now()}.${extension}`;

      const { error: uploadError } =
        await supabase.storage
          .from("about")
          .upload(path, file, {
            cacheControl: "3600",
            upsert: false,
          });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicData } =
        supabase.storage
          .from("about")
          .getPublicUrl(path);

      setField("image_url", publicData.publicUrl);

      setMessage(
        "Image uploaded. Save the page to publish it."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Image upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    const payload = {
      slug: "head-academic-coordinator",

      menu_label: form.menu_label,
      title: form.title,
      eyebrow: form.eyebrow,
      person_name: form.person_name,
      person_role: form.person_role,
      content: form.content,
      image_url: form.image_url || null,

      hero_back_label: form.hero_back_label,
      hero_back_url: form.hero_back_url,

      image_label: form.image_label,
      profile_label: form.profile_label,

      message_heading_line_1:
        form.message_heading_line_1,

      message_heading_line_2:
        form.message_heading_line_2,

      focus_section_enabled:
        form.focus_section_enabled,

      focus_card_1_number:
        form.focus_card_1_number,

      focus_card_1_title:
        form.focus_card_1_title,

      focus_card_1_description:
        form.focus_card_1_description,

      focus_card_2_number:
        form.focus_card_2_number,

      focus_card_2_title:
        form.focus_card_2_title,

      focus_card_2_description:
        form.focus_card_2_description,

      focus_card_3_number:
        form.focus_card_3_number,

      focus_card_3_title:
        form.focus_card_3_title,

      focus_card_3_description:
        form.focus_card_3_description,

      phone_number: form.phone_number,
      phone_button_label:
        form.phone_button_label,

      email_address: form.email_address,
      email_button_label:
        form.email_button_label,

      bottom_back_label:
        form.bottom_back_label,

      bottom_back_url:
        form.bottom_back_url,

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

    setMessage(
      "Head Academic Coordinator page saved successfully."
    );

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-sm text-[#102A56]/60">
        Loading Head Academic Coordinator...
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
              Head Academic Coordinator
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#10203A]/60">
              Manage the coordinator profile, message,
              academic focus cards, image, contact buttons
              and navigation.
            </p>

          </div>

          <Link
            href="/about/head-academic-coordinator"
            target="_blank"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
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
            <ExternalLink size={15} />
            View page
          </Link>

        </div>

        <form onSubmit={save} className="space-y-6">

          {/* VISIBILITY */}
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

            <div className="flex items-center justify-between gap-5">

              <div>
                <h2 className="text-xl font-semibold text-[#102A56]">
                  Visibility
                </h2>

                <p className="mt-1 text-sm text-[#10203A]/55">
                  Control whether this page is publicly visible.
                </p>
              </div>

              <label className="flex cursor-pointer items-center gap-3">

                <input
                  type="checkbox"
                  checked={!!form.is_active}
                  onChange={(e) =>
                    setField(
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
                label="Menu label"
                value={form.menu_label}
                onChange={(value) =>
                  setField("menu_label", value)
                }
              />

              <InputField
                label="Eyebrow"
                value={form.eyebrow}
                onChange={(value) =>
                  setField("eyebrow", value)
                }
              />

              <InputField
                label="Person name"
                value={form.person_name}
                onChange={(value) =>
                  setField("person_name", value)
                }
              />

              <InputField
                label="Person role"
                value={form.person_role}
                onChange={(value) =>
                  setField("person_role", value)
                }
              />

            </div>

            <div className="mt-5">
              <InputField
                label="Page title"
                value={form.title}
                onChange={(value) =>
                  setField("title", value)
                }
              />
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <InputField
                label="Back button label"
                value={form.hero_back_label}
                onChange={(value) =>
                  setField(
                    "hero_back_label",
                    value
                  )
                }
              />

              <InputField
                label="Back button URL"
                value={form.hero_back_url}
                onChange={(value) =>
                  setField(
                    "hero_back_url",
                    value
                  )
                }
              />

            </div>

          </section>

          {/* IMAGE */}
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

            <h2 className="mb-6 text-xl font-semibold text-[#102A56]">
              Profile image
            </h2>

            {form.image_url ? (
              <div className="mb-5 overflow-hidden rounded-2xl border border-[#102A56]/10 bg-[#F5F0E6]">
                <img
                  src={form.image_url}
                  alt={form.person_name}
                  className="h-[420px] w-full object-cover"
                />
              </div>
            ) : null}

            <div className="flex flex-col gap-4 md:flex-row md:items-center">

              <label
                className="
                  inline-flex
                  cursor-pointer
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-[#102A56]
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                "
              >
                <Upload size={15} />

                {uploading
                  ? "Uploading..."
                  : "Upload image"}

                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadImage}
                  disabled={uploading}
                  className="hidden"
                />
              </label>

              <span className="text-xs text-[#10203A]/50">
                Recommended: high-resolution portrait image.
              </span>

            </div>

            <div className="mt-5">
              <InputField
                label="Image label"
                value={form.image_label}
                onChange={(value) =>
                  setField("image_label", value)
                }
              />
            </div>

            <div className="mt-5">
              <InputField
                label="Image URL"
                value={form.image_url}
                onChange={(value) =>
                  setField("image_url", value)
                }
              />
            </div>

          </section>

          {/* MESSAGE */}
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

            <h2 className="mb-6 text-xl font-semibold text-[#102A56]">
              Coordinator&apos;s message
            </h2>

            <InputField
              label="Message section label"
              value={form.profile_label}
              onChange={(value) =>
                setField(
                  "profile_label",
                  value
                )
              }
            />

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <InputField
                label="Heading line 1"
                value={form.message_heading_line_1}
                onChange={(value) =>
                  setField(
                    "message_heading_line_1",
                    value
                  )
                }
              />

              <InputField
                label="Heading line 2"
                value={form.message_heading_line_2}
                onChange={(value) =>
                  setField(
                    "message_heading_line_2",
                    value
                  )
                }
              />

            </div>

            <div className="mt-5">
              <TextareaField
                label="Full message"
                value={form.content}
                onChange={(value) =>
                  setField("content", value)
                }
                rows={18}
              />
            </div>

          </section>

          {/* ACADEMIC FOCUS */}
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

            <div className="mb-6 flex items-center justify-between gap-5">

              <div>
                <h2 className="text-xl font-semibold text-[#102A56]">
                  Academic focus
                </h2>

                <p className="mt-1 text-sm text-[#10203A]/55">
                  Manage the three focus cards shown below the message.
                </p>
              </div>

              <label className="flex cursor-pointer items-center gap-3">

                <input
                  type="checkbox"
                  checked={!!form.focus_section_enabled}
                  onChange={(e) =>
                    setField(
                      "focus_section_enabled",
                      e.target.checked
                    )
                  }
                  className="h-5 w-5 accent-[#102A56]"
                />

                <span className="text-sm font-semibold text-[#102A56]">
                  Show section
                </span>

              </label>

            </div>

            {/* CARD 1 */}
            <div className="rounded-2xl border border-[#102A56]/10 p-5">

              <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[#102A56]/40">
                Focus card 01
              </p>

              <div className="grid gap-5 md:grid-cols-2">

                <InputField
                  label="Number"
                  value={form.focus_card_1_number}
                  onChange={(value) =>
                    setField(
                      "focus_card_1_number",
                      value
                    )
                  }
                />

                <InputField
                  label="Title"
                  value={form.focus_card_1_title}
                  onChange={(value) =>
                    setField(
                      "focus_card_1_title",
                      value
                    )
                  }
                />

              </div>

              <div className="mt-5">
                <TextareaField
                  label="Description"
                  value={
                    form.focus_card_1_description
                  }
                  onChange={(value) =>
                    setField(
                      "focus_card_1_description",
                      value
                    )
                  }
                  rows={4}
                />
              </div>

            </div>

            {/* CARD 2 */}
            <div className="mt-5 rounded-2xl border border-[#102A56]/10 p-5">

              <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[#102A56]/40">
                Focus card 02
              </p>

              <div className="grid gap-5 md:grid-cols-2">

                <InputField
                  label="Number"
                  value={form.focus_card_2_number}
                  onChange={(value) =>
                    setField(
                      "focus_card_2_number",
                      value
                    )
                  }
                />

                <InputField
                  label="Title"
                  value={form.focus_card_2_title}
                  onChange={(value) =>
                    setField(
                      "focus_card_2_title",
                      value
                    )
                  }
                />

              </div>

              <div className="mt-5">
                <TextareaField
                  label="Description"
                  value={
                    form.focus_card_2_description
                  }
                  onChange={(value) =>
                    setField(
                      "focus_card_2_description",
                      value
                    )
                  }
                  rows={4}
                />
              </div>

            </div>

            {/* CARD 3 */}
            <div className="mt-5 rounded-2xl border border-[#102A56]/10 p-5">

              <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[#102A56]/40">
                Focus card 03
              </p>

              <div className="grid gap-5 md:grid-cols-2">

                <InputField
                  label="Number"
                  value={form.focus_card_3_number}
                  onChange={(value) =>
                    setField(
                      "focus_card_3_number",
                      value
                    )
                  }
                />

                <InputField
                  label="Title"
                  value={form.focus_card_3_title}
                  onChange={(value) =>
                    setField(
                      "focus_card_3_title",
                      value
                    )
                  }
                />

              </div>

              <div className="mt-5">
                <TextareaField
                  label="Description"
                  value={
                    form.focus_card_3_description
                  }
                  onChange={(value) =>
                    setField(
                      "focus_card_3_description",
                      value
                    )
                  }
                  rows={4}
                />
              </div>

            </div>

          </section>

          {/* CONTACT */}
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

            <h2 className="mb-6 text-xl font-semibold text-[#102A56]">
              Contact buttons
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              <InputField
                label="Phone number"
                value={form.phone_number}
                onChange={(value) =>
                  setField(
                    "phone_number",
                    value
                  )
                }
              />

              <InputField
                label="Phone button label"
                value={form.phone_button_label}
                onChange={(value) =>
                  setField(
                    "phone_button_label",
                    value
                  )
                }
              />

              <InputField
                label="Email address"
                value={form.email_address}
                onChange={(value) =>
                  setField(
                    "email_address",
                    value
                  )
                }
              />

              <InputField
                label="Email button label"
                value={form.email_button_label}
                onChange={(value) =>
                  setField(
                    "email_button_label",
                    value
                  )
                }
              />

            </div>

          </section>

          {/* BOTTOM NAVIGATION */}
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

            <h2 className="mb-6 text-xl font-semibold text-[#102A56]">
              Bottom navigation
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              <InputField
                label="Back button label"
                value={form.bottom_back_label}
                onChange={(value) =>
                  setField(
                    "bottom_back_label",
                    value
                  )
                }
              />

              <InputField
                label="Back button URL"
                value={form.bottom_back_url}
                onChange={(value) =>
                  setField(
                    "bottom_back_url",
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
                "Changes are saved to the Head Academic Coordinator CMS."}
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
                text-white
                transition
                hover:-translate-y-0.5
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <Save size={16} />

              {saving
                ? "Saving..."
                : "Save Head Academic Coordinator"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}