"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Upload, ExternalLink } from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type ManagerPage = {
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

  leadership_label: string;
  leadership_heading: string;
  leadership_text_1: string;
  leadership_text_2: string;

  phone_number: string;
  phone_button_label: string;
  email_address: string;
  email_button_label: string;

  bottom_back_label: string;
  bottom_back_url: string;

  is_active: boolean;
};

const defaultData: ManagerPage = {
  slug: "manager-vp-admin",
  menu_label: "Manager / VP Admin",
  title: "Manager / VP – Admin",
  eyebrow: "School Administration",
  person_name: "Mr. Arvind Kumar Tejyan",
  person_role: "Manager / VP – Admin",

  content:
    "Mr. Arvind Kumar Tejyan serves as Manager / Vice Principal – Administration at Apex Public School. The school’s official School Management Committee records state that he was appointed Manager of Apex Public School with effect from 18 August 2025, as an additional charge while serving as Vice Principal (Administration).",

  image_url: "",

  hero_back_label: "About Apex",
  hero_back_url: "/about",

  image_label: "School Administration",
  profile_label: "Manager's Profile",

  leadership_label: "Leadership",
  leadership_heading: "Administration at Apex",

  leadership_text_1:
    "The official Apex Public School School Management Committee records state that Mr. Arvind Kumar Tejyan was appointed Manager of Apex Public School with effect from 18 August 2025, as an additional charge while serving as Vice Principal (Administration).",

  leadership_text_2:
    "The school's official faculty listing also identifies him as Manager and VP – Admin.",

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

export default function AdminManagerVPAdminPage() {
  const [form, setForm] = useState<ManagerPage>(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const setField = <K extends keyof ManagerPage>(
    key: K,
    value: ManagerPage[K]
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
        .eq("slug", "manager-vp-admin")
        .maybeSingle();

      if (error) {
        console.error(error);
        setMessage("Unable to load Manager / VP Admin content.");
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
          ...(cleanedData as Partial<ManagerPage>),
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

      const path = `manager-vp-admin/${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("about")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: publicData,
      } = supabase.storage
        .from("about")
        .getPublicUrl(path);

      setField("image_url", publicData.publicUrl);
      setMessage("Image uploaded. Save the page to publish it.");
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
      slug: "manager-vp-admin",

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

      leadership_label: form.leadership_label,
      leadership_heading: form.leadership_heading,
      leadership_text_1: form.leadership_text_1,
      leadership_text_2: form.leadership_text_2,

      phone_number: form.phone_number,
      phone_button_label: form.phone_button_label,
      email_address: form.email_address,
      email_button_label: form.email_button_label,

      bottom_back_label: form.bottom_back_label,
      bottom_back_url: form.bottom_back_url,

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

    setMessage("Manager / VP Admin saved successfully.");
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-sm text-[#102A56]/60">
        Loading Manager / VP Admin...
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
              Manager / VP Admin
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#10203A]/60">
              Manage the Manager / VP – Admin leadership page,
              profile, image, leadership information and contact
              buttons.
            </p>
          </div>

          <Link
            href="/about/manager-vp-admin"
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
                label="Hero back button label"
                value={form.hero_back_label}
                onChange={(value) =>
                  setField("hero_back_label", value)
                }
              />

              <InputField
                label="Hero back button URL"
                value={form.hero_back_url}
                onChange={(value) =>
                  setField("hero_back_url", value)
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

                {uploading ? "Uploading..." : "Upload image"}

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

          {/* PROFILE */}
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

            <h2 className="mb-6 text-xl font-semibold text-[#102A56]">
              Manager profile
            </h2>

            <InputField
              label="Profile section label"
              value={form.profile_label}
              onChange={(value) =>
                setField("profile_label", value)
              }
            />

            <div className="mt-5">
              <TextareaField
                label="Profile content"
                value={form.content}
                onChange={(value) =>
                  setField("content", value)
                }
                rows={10}
              />
            </div>

          </section>

          {/* LEADERSHIP */}
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

            <h2 className="mb-6 text-xl font-semibold text-[#102A56]">
              Leadership section
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              <InputField
                label="Section label"
                value={form.leadership_label}
                onChange={(value) =>
                  setField("leadership_label", value)
                }
              />

              <InputField
                label="Section heading"
                value={form.leadership_heading}
                onChange={(value) =>
                  setField("leadership_heading", value)
                }
              />

            </div>

            <div className="mt-5">
              <TextareaField
                label="Leadership text 1"
                value={form.leadership_text_1}
                onChange={(value) =>
                  setField("leadership_text_1", value)
                }
                rows={7}
              />
            </div>

            <div className="mt-5">
              <TextareaField
                label="Leadership text 2"
                value={form.leadership_text_2}
                onChange={(value) =>
                  setField("leadership_text_2", value)
                }
                rows={5}
              />
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
                  setField("phone_number", value)
                }
              />

              <InputField
                label="Phone button label"
                value={form.phone_button_label}
                onChange={(value) =>
                  setField("phone_button_label", value)
                }
              />

              <InputField
                label="Email address"
                value={form.email_address}
                onChange={(value) =>
                  setField("email_address", value)
                }
              />

              <InputField
                label="Email button label"
                value={form.email_button_label}
                onChange={(value) =>
                  setField("email_button_label", value)
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
                  setField("bottom_back_label", value)
                }
              />

              <InputField
                label="Back button URL"
                value={form.bottom_back_url}
                onChange={(value) =>
                  setField("bottom_back_url", value)
                }
              />

            </div>

          </section>

          {/* SAVE */}
          <div className="sticky bottom-5 z-20 flex flex-col gap-3 rounded-2xl border border-[#102A56]/10 bg-[#F5F0E6]/95 p-4 backdrop-blur md:flex-row md:items-center md:justify-between">

            <p className="text-sm text-[#10203A]/60">
              {message ||
                "Changes are saved to the Manager / VP Admin CMS."}
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
                : "Save Manager / VP Admin"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}