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

type CEOPage = {
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
  message_heading: string;

  preparing_enabled: boolean;
  preparing_number: string;
  preparing_heading: string;

  brilliance_enabled: boolean;
  brilliance_number: string;
  brilliance_heading: string;

  phone_number: string;
  phone_button_label: string;

  email_address: string;
  email_button_label: string;

  bottom_back_label: string;
  bottom_back_url: string;

  is_active: boolean;
};

const defaultData: CEOPage = {
  slug: "ceo",
  menu_label: "CEO",
  eyebrow:
    "FROM THE Chief Executive Officer’s DESK",
  title: "Forging Ahead Together",
  person_name: "Mr. Geoff Lyonel Jonathan",
  person_role: "Chief Executive Officer",

  content: `With immense pride and great pleasure, I welcome you to the school’s website. You could be a parent, a student, a staff member, alumni or anyone interested in gaining deeper insight into the functioning and learning environs of our exciting world. I invite you to navigate through our ‘Online School’ to help you understand lucidly why our school provides the best environment for your little ones and young adults.

Since its inception to now, our institution has marched forward to spread the light of education and pave the way for all-round excellence for every student. The key focus areas continue to remain creating opportunities, challenging minds, encouraging innovation and sustaining excitement.

Preparing our students for the future

The stringent standards followed by our school since commencement have guided us and helped us offer a contemporary, relevant, & self-motivated learning. Our children are equipped to unrelentingly identify and respond to the volatile demands across the education and employment sector. Accolades have been received through our Alumni and our children continue to do so.

We base our success on the principal of ‘3H’ (Head, Hand and Heart) as this is the way forward and prepare our children for jobs that do not even exist now and will be there in the future. Teaching them to give back to society is of utmost importance. Alumni are placed in some of the best names in the global market place. Do take out time to browse through the list of our famous alumni and faculty members.

Creating Brilliance

It is the objective here at Apex to continue being recognized as the torch bearer of leading educational methods and an institution that has students defining a future not only for them but for our country and the world as well. We have and will continually strive for brighter and more secure prospects for our children. The values and environment we provide for our children are sustainable and see them successfully through their formative years.

The investment we put into our children today will help them achieve greater heights and create the unimaginable.

I take this opportunity to thank sincerely the principal, teachers and other staff without whom these successes – both big and small would not be possible. They teach not only subjects but also inculcate values of commitment, zealousness and pride in everything they do.

Welcome once again and I sincerely hope that our website will raise your interest and encourage you into taking one more step towards making a positive difference in your life.`,

  image_url: "",

  hero_back_label: "About Apex",
  hero_back_url: "/about",

  image_label: "Apex Leadership",
  profile_label:
    "From the Chief Executive Officer's Desk",
  message_heading: "Forging Ahead Together",

  preparing_enabled: true,
  preparing_number: "02",
  preparing_heading:
    "Preparing our students for the future",

  brilliance_enabled: true,
  brilliance_number: "03",
  brilliance_heading: "Creating Brilliance",

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

export default function AdminCEOPage() {
  const [form, setForm] =
    useState<CEOPage>(defaultData);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const setField = <K extends keyof CEOPage>(
    key: K,
    value: CEOPage[K]
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
        .eq("slug", "ceo")
        .maybeSingle();

      if (error) {
        console.error(error);
        setMessage(
          "Unable to load CEO content."
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
          ...(cleanedData as Partial<CEOPage>),
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
      setMessage(
        "Image must be smaller than 10MB."
      );
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const extension =
        file.name.split(".").pop()?.toLowerCase() ||
        "jpg";

      const path =
        `ceo/${Date.now()}.${extension}`;

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

      setField(
        "image_url",
        publicData.publicUrl
      );

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
      slug: "ceo",

      menu_label: form.menu_label,
      title: form.title,
      eyebrow: form.eyebrow,

      person_name: form.person_name,
      person_role: form.person_role,

      content: form.content,
      image_url: form.image_url || null,

      hero_back_label:
        form.hero_back_label,
      hero_back_url:
        form.hero_back_url,

      image_label:
        form.image_label,

      profile_label:
        form.profile_label,

      message_heading:
        form.message_heading,

      preparing_enabled:
        form.preparing_enabled,

      preparing_number:
        form.preparing_number,

      preparing_heading:
        form.preparing_heading,

      brilliance_enabled:
        form.brilliance_enabled,

      brilliance_number:
        form.brilliance_number,

      brilliance_heading:
        form.brilliance_heading,

      phone_number:
        form.phone_number,

      phone_button_label:
        form.phone_button_label,

      email_address:
        form.email_address,

      email_button_label:
        form.email_button_label,

      bottom_back_label:
        form.bottom_back_label,

      bottom_back_url:
        form.bottom_back_url,

      is_active:
        form.is_active,

      updated_at:
        new Date().toISOString(),
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
      "CEO page saved successfully."
    );

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-sm text-[#102A56]/60">
        Loading CEO...
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
              CEO
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#10203A]/60">
              Manage the CEO profile, message, leadership
              sections, image, contact buttons and navigation.
            </p>

          </div>

          <Link
            href="/about/ceo"
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
                  Control whether the CEO page is publicly visible.
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
                label="Hero back label"
                value={form.hero_back_label}
                onChange={(value) =>
                  setField(
                    "hero_back_label",
                    value
                  )
                }
              />

              <InputField
                label="Hero back URL"
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
              CEO image
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
                  setField(
                    "image_label",
                    value
                  )
                }
              />
            </div>

            <div className="mt-5">
              <InputField
                label="Image URL"
                value={form.image_url}
                onChange={(value) =>
                  setField(
                    "image_url",
                    value
                  )
                }
              />
            </div>

          </section>

          {/* MESSAGE */}
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

            <h2 className="mb-6 text-xl font-semibold text-[#102A56]">
              CEO message
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

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

              <InputField
                label="Message heading"
                value={form.message_heading}
                onChange={(value) =>
                  setField(
                    "message_heading",
                    value
                  )
                }
              />

            </div>

            <div className="mt-5">
              <TextareaField
                label="Full CEO message"
                value={form.content}
                onChange={(value) =>
                  setField(
                    "content",
                    value
                  )
                }
                rows={25}
              />

              <p className="mt-2 text-xs leading-6 text-[#10203A]/45">
                Keep the section headings
                “Preparing our students for the future”
                and “Creating Brilliance” on their own
                lines so the public page can separate
                the sections correctly.
              </p>
            </div>

          </section>

          {/* PREPARING */}
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

            <div className="mb-6 flex items-center justify-between gap-5">

              <div>
                <h2 className="text-xl font-semibold text-[#102A56]">
                  Preparing students section
                </h2>

                <p className="mt-1 text-sm text-[#10203A]/55">
                  Manage the second CEO content section.
                </p>
              </div>

              <label className="flex cursor-pointer items-center gap-3">

                <input
                  type="checkbox"
                  checked={!!form.preparing_enabled}
                  onChange={(e) =>
                    setField(
                      "preparing_enabled",
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

            <div className="grid gap-5 md:grid-cols-2">

              <InputField
                label="Section number"
                value={form.preparing_number}
                onChange={(value) =>
                  setField(
                    "preparing_number",
                    value
                  )
                }
              />

              <InputField
                label="Section heading"
                value={form.preparing_heading}
                onChange={(value) =>
                  setField(
                    "preparing_heading",
                    value
                  )
                }
              />

            </div>

          </section>

          {/* BRILLIANCE */}
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

            <div className="mb-6 flex items-center justify-between gap-5">

              <div>
                <h2 className="text-xl font-semibold text-[#102A56]">
                  Creating Brilliance section
                </h2>

                <p className="mt-1 text-sm text-[#10203A]/55">
                  Manage the third CEO content section.
                </p>
              </div>

              <label className="flex cursor-pointer items-center gap-3">

                <input
                  type="checkbox"
                  checked={!!form.brilliance_enabled}
                  onChange={(e) =>
                    setField(
                      "brilliance_enabled",
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

            <div className="grid gap-5 md:grid-cols-2">

              <InputField
                label="Section number"
                value={form.brilliance_number}
                onChange={(value) =>
                  setField(
                    "brilliance_number",
                    value
                  )
                }
              />

              <InputField
                label="Section heading"
                value={form.brilliance_heading}
                onChange={(value) =>
                  setField(
                    "brilliance_heading",
                    value
                  )
                }
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

          {/* NAVIGATION */}
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
                "Changes are saved to the CEO CMS."}
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
                : "Save CEO"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}