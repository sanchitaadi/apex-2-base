"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Save,
  Upload,
} from "lucide-react";
import { supabase } from "@/lib/supabase/browser";

type HeadMistressCMS = {
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

const defaults: HeadMistressCMS = {
  slug: "head-mistress",
  menu_label: "Head Mistress",
  title: "A shared vision for excellence",
  eyebrow: "Head Mistressâ€™s Message",
  person_name: "Mrs. Kiran Chadha",
  person_role: "Headmistress",
  content: `Dear Apexian,

I am delighted to extend warm greetings to our dedicated students, esteemed parents, passionate teachers, and the entire Apex community. As the Headmistress of this esteemed institution, I am proud to present our collective goals for the academic year ahead, focusing on reading and communication, cleanliness and nutrition.

Reading forms the foundation of education and opens up a world of endless possibilities. This year, we aim to foster a love for reading among our students. We will provide diverse literary resources and encourage regular library visits.

Effective communication is an invaluable skill that transcends academic boundaries. Through interactive classroom activities we will empower our students to express themselves with confidence and articulate their thoughts effectively. We believe that proficient communication skills will prepare our students for success in all aspects of life. We are committed to instilling in our students the importance of cleanliness as a habit.

Regular cleanliness drives and educating students about personal hygiene practices will be an integral part of our school year. The saying â€œYou are what you eatâ€ holds immense truth. Nutrition plays a vital role in the physical and cognitive development of our students. We are dedicated to promote healthy eating habits and educating our students about the importance of a balanced diet.

I am confident that together, as a strong and supportive Apex community, we will achieve these goals and provide our students with a well-rounded education. I encourage parents to actively participate in their childâ€™s educational journey, collaborate with our dedicated teachers, and join hands in fostering a positive and enriching environment. Thank you for choosing Apex Public School as your partner in shaping your childâ€™s future.

Let us embark on this academic year with enthusiasm, commitment, and a shared vision for excellence.

Wishing you a successful and fulfilling year ahead!

Answer Dutyâ€™s Call

Mrs. Kiran Chadha
(Headmistress)`,
  image_url:
    "https://apexpublicschool.in/wp-content/uploads/2023/09/WhatsApp-Image-2023-09-06-at-8.30.25-AM-461x1024.jpeg",
  hero_back_label: "About Apex",
  hero_back_url: "/about",
  image_label: "School Leadership",
  profile_label: "Head Mistress's Message",
  message_heading_line_1: "A shared vision",
  message_heading_line_2: "for excellence.",
  focus_section_enabled: true,
  focus_card_1_number: "01",
  focus_card_1_title: "Reading",
  focus_card_1_description:
    "Fostering a love for reading through diverse literary resources and regular library visits.",
  focus_card_2_number: "02",
  focus_card_2_title: "Communication",
  focus_card_2_description:
    "Helping students express themselves confidently and articulate their thoughts effectively.",
  focus_card_3_number: "03",
  focus_card_3_title: "Health & Nutrition",
  focus_card_3_description:
    "Promoting cleanliness, personal hygiene and healthy eating habits for physical and cognitive development.",
  phone_number: "09990061747",
  phone_button_label: "Contact school",
  email_address: "contacts.apexschool@gmail.com",
  email_button_label: "Email school",
  bottom_back_label: "Back to About Apex",
  bottom_back_url: "/about",
  is_active: true,
};

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
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#102A56] focus:ring-2 focus:ring-[#102A56]/10"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 8,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition focus:border-[#102A56] focus:ring-2 focus:ring-[#102A56]/10"
      />
    </label>
  );
}

function Toggle({
  value,
  onChange,
  onLabel = "Published",
  offLabel = "Hidden",
}: {
  value: boolean;
  onChange: () => void;
  onLabel?: string;
  offLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
        value
          ? "bg-emerald-100 text-emerald-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {value ? <Eye size={14} /> : <EyeOff size={14} />}
      {value ? onLabel : offLabel}
    </button>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

export default function AdminHeadMistressPage() {
  const [form, setForm] = useState<HeadMistressCMS>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase
        .from("about_pages")
        .select("*")
        .eq("slug", "head-mistress")
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setForm({
          ...defaults,
          ...Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
              key,
              value === null ? "" : value,
            ]),
          ),
          is_active: data.is_active !== false,
          focus_section_enabled: data.focus_section_enabled !== false,
        } as HeadMistressCMS);
      }
    } catch (error) {
      console.error("Head Mistress CMS load error:", error);
      setMessage(
        error instanceof Error
          ? `Could not load Head Mistress CMS: ${error.message}`
          : "Could not load Head Mistress CMS.",
      );
    } finally {
      setLoading(false);
    }
  }

  function setField<K extends keyof HeadMistressCMS>(
    field: K,
    value: HeadMistressCMS[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function savePage() {
    setSaving(true);
    setMessage("");

    try {
      const payload = {
        slug: "head-mistress",
        menu_label: form.menu_label || "",
        title: form.title || "",
        eyebrow: form.eyebrow || "",
        person_name: form.person_name || "",
        person_role: form.person_role || "",
        content: form.content || "",
        image_url: form.image_url || "",

        hero_back_label: form.hero_back_label || "",
        hero_back_url: form.hero_back_url || "/about",

        image_label: form.image_label || "",
        profile_label: form.profile_label || "",

        message_heading_line_1: form.message_heading_line_1 || "",
        message_heading_line_2: form.message_heading_line_2 || "",

        focus_section_enabled: form.focus_section_enabled,

        focus_card_1_number: form.focus_card_1_number || "01",
        focus_card_1_title: form.focus_card_1_title || "",
        focus_card_1_description: form.focus_card_1_description || "",

        focus_card_2_number: form.focus_card_2_number || "02",
        focus_card_2_title: form.focus_card_2_title || "",
        focus_card_2_description: form.focus_card_2_description || "",

        focus_card_3_number: form.focus_card_3_number || "03",
        focus_card_3_title: form.focus_card_3_title || "",
        focus_card_3_description: form.focus_card_3_description || "",

        phone_number: form.phone_number || "",
        phone_button_label: form.phone_button_label || "Contact school",

        email_address: form.email_address || "",
        email_button_label: form.email_button_label || "Email school",

        bottom_back_label:
          form.bottom_back_label || "Back to About Apex",
        bottom_back_url: form.bottom_back_url || "/about",

        is_active: form.is_active,
        updated_at: new Date().toISOString(),
      };

      if (form.id) {
        const { error } = await supabase
          .from("about_pages")
          .update(payload)
          .eq("id", form.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("about_pages")
          .insert(payload)
          .select("*")
          .single();

        if (error) throw error;

        if (data) {
          setForm({
            ...defaults,
            ...data,
            is_active: data.is_active !== false,
            focus_section_enabled:
              data.focus_section_enabled !== false,
          });
        }
      }

      setMessage(
        "Head Mistress page saved successfully. The public page now uses the saved CMS content.",
      );

      await loadData();
    } catch (error) {
      console.error("Head Mistress CMS save error:", error);
      setMessage(
        error instanceof Error
          ? `Could not save Head Mistress page: ${error.message}`
          : "Could not save Head Mistress page.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage(file: File) {
    if (!file.type.startsWith("image/")) {
      setMessage("Please choose an image file.");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setMessage("Image must be smaller than 15MB.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const path =
        `head-mistress/head-mistress-${Date.now()}.${extension}`;

      const { error } = await supabase.storage
        .from("about-pages")
        .upload(path, file, {
          upsert: true,
          contentType: file.type,
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from("about-pages")
        .getPublicUrl(path);

      setField("image_url", data.publicUrl);

      setMessage(
        "New Head Mistress photo uploaded. Click Save Head Mistress to publish the change.",
      );
    } catch (error) {
      console.error("Head Mistress image upload error:", error);
      setMessage(
        error instanceof Error
          ? `Image upload failed: ${error.message}`
          : "Image upload failed.",
      );
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-slate-500">
            Loading Head Mistress CMSâ€¦
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Website / About Apex
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Head Mistress CMS
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Complete editor for the public Head Mistress page. Change
            the photo, message, headings, focus cards, contact details,
            links and publication status from this panel.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="/about/head-mistress"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View public page
          </a>

          <button
            type="button"
            onClick={() => void savePage()}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#102A56] px-5 py-3 text-sm font-semibold !text-[#F5F0E6] transition hover:bg-[#16386E] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={16} className="!text-[#F5F0E6]" />
            <span className="!text-[#F5F0E6]">
              {saving ? "Savingâ€¦" : "Save Head Mistress"}
            </span>
          </button>
        </div>
      </div>

      {message && (
        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
          <Check size={16} className="mt-0.5 shrink-0 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* VISIBILITY */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <SectionTitle
            title="Page visibility"
            description="Control whether the Head Mistress page is published."
          />

          <Toggle
            value={form.is_active}
            onChange={() => setField("is_active", !form.is_active)}
          />
        </div>
      </section>

      {/* BASIC INFO */}
      <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle
          title="Head Mistress information"
          description="These values are shown in the hero and profile areas of the public page."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Menu label"
            value={form.menu_label}
            onChange={(value) => setField("menu_label", value)}
          />

          <Field
            label="Eyebrow"
            value={form.eyebrow}
            onChange={(value) => setField("eyebrow", value)}
          />

          <Field
            label="Page title"
            value={form.title}
            onChange={(value) => setField("title", value)}
          />

          <Field
            label="Person name"
            value={form.person_name}
            onChange={(value) => setField("person_name", value)}
          />

          <Field
            label="Person role"
            value={form.person_role}
            onChange={(value) => setField("person_role", value)}
          />

          <Field
            label="Profile label"
            value={form.profile_label}
            onChange={(value) => setField("profile_label", value)}
          />

          <Field
            label="Photo label"
            value={form.image_label}
            onChange={(value) => setField("image_label", value)}
          />
        </div>
      </section>

      {/* MESSAGE */}
      <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle
          title="Head Mistress message"
          description="Edit the complete message shown beside the photograph."
        />

        <TextArea
          label="Message"
          value={form.content}
          onChange={(value) => setField("content", value)}
          rows={20}
        />
      </section>

      {/* IMAGE */}
      <section className="rounded-2xl border border-[#102A56]/10 bg-white p-6 shadow-sm">
        <SectionTitle
          title="Head Mistress photograph"
          description="This is the photograph used on the public Head Mistress page."
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
          <div>
            <div className="overflow-hidden rounded-2xl bg-[#E9E2D5]">
              {form.image_url ? (
                <img
                  src={form.image_url}
                  alt={form.person_name || "Head Mistress"}
                  className="h-[460px] w-full object-cover object-center"
                />
              ) : (
                <div className="grid h-[460px] place-items-center text-slate-400">
                  <ImageIcon size={42} />
                </div>
              )}
            </div>

            <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#102A56] px-4 py-3 text-sm font-semibold !text-[#F5F0E6] transition hover:bg-[#16386E]">
              <Upload size={16} className="!text-[#F5F0E6]" />
              <span className="!text-[#F5F0E6]">
                {uploading ? "Uploadingâ€¦" : "Change photo"}
              </span>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (file) {
                    void uploadImage(file);
                  }

                  event.target.value = "";
                }}
              />
            </label>
          </div>

          <div className="space-y-5">
            <Field
              label="Image URL"
              value={form.image_url}
              onChange={(value) => setField("image_url", value)}
            />

            <div className="rounded-2xl bg-[#F4F1EA] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#102A56]/40">
                How it works
              </p>
              <p className="mt-3 text-sm leading-7 text-[#10203A]/60">
                Uploading a new image stores it in the{" "}
                <strong>about-pages</strong> Supabase bucket and puts
                the resulting public URL into the CMS record. Click
                <strong> Save Head Mistress </strong>
                to publish that new URL to the public page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MESSAGE HEADING */}
      <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle
          title="Message heading"
          description="Control the large two-line heading above the message."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Heading line 1"
            value={form.message_heading_line_1}
            onChange={(value) =>
              setField("message_heading_line_1", value)
            }
          />

          <Field
            label="Heading line 2"
            value={form.message_heading_line_2}
            onChange={(value) =>
              setField("message_heading_line_2", value)
            }
          />
        </div>
      </section>

      {/* FOCUS CARDS */}
      <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <SectionTitle
            title="Focus areas"
            description="Edit the three cards displayed below the Head Mistress message."
          />

          <Toggle
            value={form.focus_section_enabled}
            onChange={() =>
              setField(
                "focus_section_enabled",
                !form.focus_section_enabled,
              )
            }
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              number: "focus_card_1_number",
              title: "focus_card_1_title",
              description: "focus_card_1_description",
              label: "Focus card 1",
            },
            {
              number: "focus_card_2_number",
              title: "focus_card_2_title",
              description: "focus_card_2_description",
              label: "Focus card 2",
            },
            {
              number: "focus_card_3_number",
              title: "focus_card_3_title",
              description: "focus_card_3_description",
              label: "Focus card 3",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="space-y-4 rounded-2xl bg-slate-50 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                {card.label}
              </p>

              <Field
                label="Number"
                value={
                  form[
                    card.number as keyof HeadMistressCMS
                  ] as string
                }
                onChange={(value) =>
                  setField(
                    card.number as keyof HeadMistressCMS,
                    value as never,
                  )
                }
              />

              <Field
                label="Title"
                value={
                  form[
                    card.title as keyof HeadMistressCMS
                  ] as string
                }
                onChange={(value) =>
                  setField(
                    card.title as keyof HeadMistressCMS,
                    value as never,
                  )
                }
              />

              <TextArea
                label="Description"
                value={
                  form[
                    card.description as keyof HeadMistressCMS
                  ] as string
                }
                onChange={(value) =>
                  setField(
                    card.description as keyof HeadMistressCMS,
                    value as never,
                  )
                }
                rows={6}
              />
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle
          title="Contact buttons"
          description="These values control the phone and email buttons below the message."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Phone
            </p>

            <Field
              label="Phone number"
              value={form.phone_number}
              onChange={(value) => setField("phone_number", value)}
            />

            <Field
              label="Button label"
              value={form.phone_button_label}
              onChange={(value) =>
                setField("phone_button_label", value)
              }
            />
          </div>

          <div className="space-y-4 rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Email
            </p>

            <Field
              label="Email address"
              value={form.email_address}
              onChange={(value) => setField("email_address", value)}
            />

            <Field
              label="Button label"
              value={form.email_button_label}
              onChange={(value) =>
                setField("email_button_label", value)
              }
            />
          </div>
        </div>
      </section>

      {/* NAVIGATION */}
      <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle
          title="Navigation links"
          description="Edit the links used by the two About navigation controls."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Hero back link label"
            value={form.hero_back_label}
            onChange={(value) => setField("hero_back_label", value)}
          />

          <Field
            label="Hero back link URL"
            value={form.hero_back_url}
            onChange={(value) => setField("hero_back_url", value)}
          />

          <Field
            label="Bottom back link label"
            value={form.bottom_back_label}
            onChange={(value) =>
              setField("bottom_back_label", value)
            }
          />

          <Field
            label="Bottom back link URL"
            value={form.bottom_back_url}
            onChange={(value) =>
              setField("bottom_back_url", value)
            }
          />
        </div>
      </section>

      {/* SAVE BAR */}
      <div className="sticky bottom-4 z-30">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Head Mistress CMS
            </p>
            <p className="text-xs text-slate-500">
              Changes are saved to the head-mistress record in
              Supabase.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void savePage()}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#102A56] px-6 py-3 text-sm font-semibold !text-[#F5F0E6] transition hover:bg-[#16386E] disabled:opacity-50"
          >
            <Save
              size={16}
              className="!text-[#F5F0E6]"
            />
            <span className="!text-[#F5F0E6]">
              {saving ? "Savingâ€¦" : "Save changes"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}


