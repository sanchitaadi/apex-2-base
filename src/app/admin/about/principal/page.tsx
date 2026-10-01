"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Upload,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type PrincipalCMS = {
  id?: string;

  slug: string;
  menu_label: string;
  title: string;
  eyebrow: string;
  person_name: string;
  person_role: string;
  content: string;
  image_url: string;

  back_link_label: string;
  back_link_url: string;

  message_label: string;
  image_label: string;

  philosophy_section_enabled: boolean;

  philosophy_card_1_number: string;
  philosophy_card_1_title: string;
  philosophy_card_1_text: string;

  philosophy_card_2_number: string;
  philosophy_card_2_title: string;
  philosophy_card_2_text: string;

  contact_section_enabled: boolean;

  contact_phone: string;
  contact_phone_label: string;

  contact_email: string;
  contact_email_label: string;

  bottom_back_label: string;
  bottom_back_url: string;

  is_active: boolean;
};

const defaults: PrincipalCMS = {
  slug: "principal",

  menu_label: "Principal",

  eyebrow: "Principal’s Message",

  title: "Leading with purpose",

  person_name: "Mrs. Dorothy Jonathan",

  person_role: "Principal",

  content: `“Education is not the learning of facts but the training of the mind to think”
- Albert Einstein

Apex Public School greets all of you, the parents, the students and the readers.`,

  image_url:
    "https://apexpublicschool.in/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-11-at-10.53.46.jpeg",

  back_link_label: "About Apex",
  back_link_url: "/about",

  message_label: "Principal's Message",
  image_label: "School Leadership",

  philosophy_section_enabled: true,

  philosophy_card_1_number: "01",
  philosophy_card_1_title:
    "Holistic development",
  philosophy_card_1_text:
    "Students are encouraged to channelize their potential in the pursuit of excellence within a holistic, student-centric environment.",

  philosophy_card_2_number: "02",
  philosophy_card_2_title:
    "Love, logic and character",
  philosophy_card_2_text:
    "The school combines trusting relationships with responsibility, self-control, good decision making, confidence and strong moral values.",

  contact_section_enabled: true,

  contact_phone: "09990061747",
  contact_phone_label: "Contact school",

  contact_email:
    "contacts.apexschool@gmail.com",
  contact_email_label: "Email school",

  bottom_back_label:
    "Back to About Apex",
  bottom_back_url: "/about",

  is_active: true,
};

export default function PrincipalAdminPage() {
  const [principal, setPrincipal] =
    useState<PrincipalCMS>(
      defaults
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    void loadPrincipal();
  }, []);

  async function loadPrincipal() {
    setLoading(true);

    try {
      const { data, error } =
        await supabase
          .from("about_pages")
          .select("*")
          .eq("slug", "principal")
          .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        const cleaned =
          Object.fromEntries(
            Object.entries(data).map(
              ([key, value]) => [
                key,
                value === null
                  ? ""
                  : value,
              ]
            )
          );

        setPrincipal({
          ...defaults,
          ...cleaned,
          is_active:
            data.is_active !== false,
          philosophy_section_enabled:
            data.philosophy_section_enabled !==
            false,
          contact_section_enabled:
            data.contact_section_enabled !==
            false,
        } as PrincipalCMS);
      }
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? `Could not load Principal CMS: ${error.message}`
          : "Could not load Principal CMS."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateField<K extends keyof PrincipalCMS>(
    field: K,
    value: PrincipalCMS[K]
  ) {
    setPrincipal((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function savePrincipal() {
    setSaving(true);
    setMessage("");

    try {
      const payload = {
        slug: "principal",

        menu_label:
          principal.menu_label || "",

        title:
          principal.title || "",

        eyebrow:
          principal.eyebrow || "",

        person_name:
          principal.person_name || "",

        person_role:
          principal.person_role || "",

        content:
          principal.content || "",

        image_url:
          principal.image_url || "",

        back_link_label:
          principal.back_link_label || "",

        back_link_url:
          principal.back_link_url ||
          "/about",

        message_label:
          principal.message_label || "",

        image_label:
          principal.image_label || "",

        philosophy_section_enabled:
          Boolean(
            principal.philosophy_section_enabled
          ),

        philosophy_card_1_number:
          principal.philosophy_card_1_number ||
          "01",

        philosophy_card_1_title:
          principal.philosophy_card_1_title ||
          "",

        philosophy_card_1_text:
          principal.philosophy_card_1_text ||
          "",

        philosophy_card_2_number:
          principal.philosophy_card_2_number ||
          "02",

        philosophy_card_2_title:
          principal.philosophy_card_2_title ||
          "",

        philosophy_card_2_text:
          principal.philosophy_card_2_text ||
          "",

        contact_section_enabled:
          Boolean(
            principal.contact_section_enabled
          ),

        contact_phone:
          principal.contact_phone || "",

        contact_phone_label:
          principal.contact_phone_label ||
          "Contact school",

        contact_email:
          principal.contact_email || "",

        contact_email_label:
          principal.contact_email_label ||
          "Email school",

        bottom_back_label:
          principal.bottom_back_label ||
          "Back to About Apex",

        bottom_back_url:
          principal.bottom_back_url ||
          "/about",

        is_active:
          Boolean(
            principal.is_active
          ),

        updated_at:
          new Date().toISOString(),
      };

      let error = null;

      if (principal.id) {
        const result =
          await supabase
            .from("about_pages")
            .update(payload)
            .eq(
              "id",
              principal.id
            );

        error = result.error;
      } else {
        const result =
          await supabase
            .from("about_pages")
            .insert(payload)
            .select()
            .single();

        error = result.error;

        if (result.data) {
          setPrincipal({
            ...defaults,
            ...result.data,
          });
        }
      }

      if (error) {
        throw error;
      }

      setMessage(
        "Principal page saved successfully."
      );

      await loadPrincipal();
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? `Could not save Principal page: ${error.message}`
          : "Could not save Principal page."
      );
    } finally {
      setSaving(false);
    }
  }

  async function uploadPrincipalImage(
    file: File
  ) {
    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setMessage(
        "Please select an image file."
      );
      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      setMessage(
        "Image must be smaller than 10MB."
      );
      return;
    }

    setUploading(true);

    try {
      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() ||
        "jpg";

      const path =
        `principal/principal-${Date.now()}.${extension}`;

      const { error } =
        await supabase.storage
          .from("about")
          .upload(
            path,
            file,
            {
              upsert: true,
              contentType:
                file.type,
            }
          );

      if (error) {
        throw error;
      }

      const { data } =
        supabase.storage
          .from("about")
          .getPublicUrl(path);

      updateField(
        "image_url",
        data.publicUrl
      );

      setMessage(
        "Principal image uploaded. Click Save Principal to publish it."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? `Image upload failed: ${error.message}`
          : "Image upload failed."
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
            Loading Principal CMS...
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
            Website / About
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Principal
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Manage the complete Principal page,
            including the message, image, philosophy,
            contact buttons and navigation.
          </p>
        </div>

        <button
          type="button"
          onClick={savePrincipal}
          disabled={saving}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#102A56]
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            hover:opacity-90
            disabled:opacity-50
          "
        >
          <Save size={16} />

          {saving
            ? "Saving..."
            : "Save Principal"}
        </button>

      </div>

      {/* MESSAGE */}

      {message && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
          {message}
        </div>
      )}

      {/* VISIBILITY */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="text-lg font-semibold">
              Page visibility
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Publish or hide the Principal page.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              updateField(
                "is_active",
                !principal.is_active
              )
            }
            className={`
              inline-flex
              items-center
              gap-2
              rounded-full
              px-4
              py-2
              text-sm
              font-semibold
              ${
                principal.is_active
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }
            `}
          >
            {principal.is_active ? (
              <>
                <Eye size={14} />
                Published
              </>
            ) : (
              <>
                <EyeOff size={14} />
                Hidden
              </>
            )}
          </button>

        </div>
      </section>

      {/* MAIN CONTENT */}

      <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <SectionTitle
          title="Principal information"
          description="Core content used by the Principal page."
        />

        <Field
          label="Menu label"
          value={
            principal.menu_label
          }
          onChange={(value) =>
            updateField(
              "menu_label",
              value
            )
          }
        />

        <Field
          label="Eyebrow"
          value={
            principal.eyebrow
          }
          onChange={(value) =>
            updateField(
              "eyebrow",
              value
            )
          }
        />

        <Field
          label="Page title"
          value={
            principal.title
          }
          onChange={(value) =>
            updateField(
              "title",
              value
            )
          }
        />

        <div className="grid gap-5 md:grid-cols-2">

          <Field
            label="Person name"
            value={
              principal.person_name
            }
            onChange={(value) =>
              updateField(
                "person_name",
                value
              )
            }
          />

          <Field
            label="Person role"
            value={
              principal.person_role
            }
            onChange={(value) =>
              updateField(
                "person_role",
                value
              )
            }
          />

        </div>

        <Field
          label="Hero image label"
          value={
            principal.image_label
          }
          onChange={(value) =>
            updateField(
              "image_label",
              value
            )
          }
        />

        <Field
          label="Message label"
          value={
            principal.message_label
          }
          onChange={(value) =>
            updateField(
              "message_label",
              value
            )
          }
        />

        <TextArea
          label="Principal's message"
          value={
            principal.content
          }
          onChange={(value) =>
            updateField(
              "content",
              value
            )
          }
          rows={18}
        />

      </section>

      {/* IMAGE */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <SectionTitle
          title="Principal image"
          description="Manage the photograph displayed on the page."
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr]">

          <div>

            <div className="overflow-hidden rounded-2xl bg-slate-100">

              {principal.image_url ? (
                <img
                  src={
                    principal.image_url
                  }
                  alt={
                    principal.person_name
                  }
                  className="h-80 w-full object-cover"
                />
              ) : (
                <div className="flex h-80 items-center justify-center">
                  <ImageIcon
                    size={40}
                    className="text-slate-300"
                  />
                </div>
              )}

            </div>

            <label className="
              mt-3
              flex
              cursor-pointer
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-300
              px-4
              py-3
              text-sm
              font-semibold
              hover:bg-slate-50
            ">

              <Upload size={16} />

              {uploading
                ? "Uploading..."
                : "Upload image"}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(
                  event
                ) => {
                  const file =
                    event.target.files?.[0];

                  if (file) {
                    void uploadPrincipalImage(
                      file
                    );
                  }

                  event.target.value =
                    "";
                }}
              />

            </label>

          </div>

          <div className="space-y-5">

            <Field
              label="Image URL"
              value={
                principal.image_url
              }
              onChange={(value) =>
                updateField(
                  "image_url",
                  value
                )
              }
            />

            <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              The image can be uploaded to the
              <strong> about </strong>
              Supabase bucket or an existing image URL
              can be used.
            </div>

          </div>

        </div>
      </section>

      {/* PHILOSOPHY */}

      <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between gap-4">

          <SectionTitle
            title="School philosophy"
            description="The two philosophy cards displayed below the Principal message."
          />

          <button
            type="button"
            onClick={() =>
              updateField(
                "philosophy_section_enabled",
                !principal.philosophy_section_enabled
              )
            }
            className={`
              inline-flex
              items-center
              gap-2
              rounded-full
              px-4
              py-2
              text-sm
              font-semibold
              ${
                principal.philosophy_section_enabled
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }
            `}
          >
            {principal.philosophy_section_enabled ? (
              <>
                <Eye size={14} />
                Visible
              </>
            ) : (
              <>
                <EyeOff size={14} />
                Hidden
              </>
            )}
          </button>

        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          <PhilosophyEditor
            label="Philosophy card 1"
            number={
              principal.philosophy_card_1_number
            }
            title={
              principal.philosophy_card_1_title
            }
            text={
              principal.philosophy_card_1_text
            }
            onNumberChange={(value) =>
              updateField(
                "philosophy_card_1_number",
                value
              )
            }
            onTitleChange={(value) =>
              updateField(
                "philosophy_card_1_title",
                value
              )
            }
            onTextChange={(value) =>
              updateField(
                "philosophy_card_1_text",
                value
              )
            }
          />

          <PhilosophyEditor
            label="Philosophy card 2"
            number={
              principal.philosophy_card_2_number
            }
            title={
              principal.philosophy_card_2_title
            }
            text={
              principal.philosophy_card_2_text
            }
            onNumberChange={(value) =>
              updateField(
                "philosophy_card_2_number",
                value
              )
            }
            onTitleChange={(value) =>
              updateField(
                "philosophy_card_2_title",
                value
              )
            }
            onTextChange={(value) =>
              updateField(
                "philosophy_card_2_text",
                value
              )
            }
          />

        </div>
      </section>

      {/* CONTACT */}

      <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between gap-4">

          <SectionTitle
            title="Contact buttons"
            description="Phone and email buttons shown below the Principal message."
          />

          <button
            type="button"
            onClick={() =>
              updateField(
                "contact_section_enabled",
                !principal.contact_section_enabled
              )
            }
            className={`
              inline-flex
              items-center
              gap-2
              rounded-full
              px-4
              py-2
              text-sm
              font-semibold
              ${
                principal.contact_section_enabled
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }
            `}
          >
            {principal.contact_section_enabled ? (
              <>
                <Eye size={14} />
                Visible
              </>
            ) : (
              <>
                <EyeOff size={14} />
                Hidden
              </>
            )}
          </button>

        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          <div className="space-y-4 rounded-2xl bg-slate-50 p-5">

            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Phone
            </p>

            <Field
              label="Phone number"
              value={
                principal.contact_phone
              }
              onChange={(value) =>
                updateField(
                  "contact_phone",
                  value
                )
              }
            />

            <Field
              label="Button label"
              value={
                principal.contact_phone_label
              }
              onChange={(value) =>
                updateField(
                  "contact_phone_label",
                  value
                )
              }
            />

          </div>

          <div className="space-y-4 rounded-2xl bg-slate-50 p-5">

            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Email
            </p>

            <Field
              label="Email address"
              value={
                principal.contact_email
              }
              onChange={(value) =>
                updateField(
                  "contact_email",
                  value
                )
              }
            />

            <Field
              label="Button label"
              value={
                principal.contact_email_label
              }
              onChange={(value) =>
                updateField(
                  "contact_email_label",
                  value
                )
              }
            />

          </div>

        </div>
      </section>

      {/* NAVIGATION */}

      <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <SectionTitle
          title="Navigation"
          description="Control the links back to the About page."
        />

        <div className="grid gap-5 md:grid-cols-2">

          <Field
            label="Hero back button label"
            value={
              principal.back_link_label
            }
            onChange={(value) =>
              updateField(
                "back_link_label",
                value
              )
            }
          />

          <Field
            label="Hero back button URL"
            value={
              principal.back_link_url
            }
            onChange={(value) =>
              updateField(
                "back_link_url",
                value
              )
            }
          />

          <Field
            label="Bottom back link label"
            value={
              principal.bottom_back_label
            }
            onChange={(value) =>
              updateField(
                "bottom_back_label",
                value
              )
            }
          />

          <Field
            label="Bottom back link URL"
            value={
              principal.bottom_back_url
            }
            onChange={(value) =>
              updateField(
                "bottom_back_url",
                value
              )
            }
          />

        </div>
      </section>

      {/* SAVE */}

      <div className="sticky bottom-4 z-30">

        <div className="
          flex
          flex-col
          gap-4
          rounded-2xl
          border
          border-slate-200
          bg-white/95
          p-4
          shadow-xl
          backdrop-blur
          md:flex-row
          md:items-center
          md:justify-between
        ">

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Principal CMS
            </p>

            <p className="text-xs text-slate-500">
              Save changes to publish them on the Principal page.
            </p>
          </div>

          <button
            type="button"
            onClick={savePrincipal}
            disabled={saving}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#102A56]
              px-6
              py-3
              text-sm
              font-semibold
              text-white
              hover:opacity-90
              disabled:opacity-50
            "
          >
            <Save size={16} />

            {saving
              ? "Saving..."
              : "Save changes"}
          </button>

        </div>
      </div>

    </div>
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
      <h2 className="text-lg font-semibold text-slate-900">
        {title}
      </h2>

      <p className="mt-1 text-sm leading-6 text-slate-500">
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
  value:
    | string
    | null
    | undefined;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">

      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <input
        type="text"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="
          w-full
          rounded-xl
          border
          border-slate-300
          bg-white
          px-4
          py-3
          text-sm
          text-slate-900
          outline-none
          transition
          placeholder:text-slate-400
          focus:border-[#102A56]
          focus:ring-2
          focus:ring-[#102A56]/10
        "
      />

    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 5,
}: {
  label: string;
  value:
    | string
    | null
    | undefined;
  onChange: (
    value: string
  ) => void;
  rows?: number;
}) {
  return (
    <label className="block">

      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <textarea
        value={value ?? ""}
        rows={rows}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="
          w-full
          resize-y
          rounded-xl
          border
          border-slate-300
          bg-white
          px-4
          py-3
          text-sm
          leading-7
          text-slate-900
          outline-none
          transition
          focus:border-[#102A56]
          focus:ring-2
          focus:ring-[#102A56]/10
        "
      />

    </label>
  );
}

function PhilosophyEditor({
  label,
  number,
  title,
  text,
  onNumberChange,
  onTitleChange,
  onTextChange,
}: {
  label: string;
  number:
    | string
    | null
    | undefined;
  title:
    | string
    | null
    | undefined;
  text:
    | string
    | null
    | undefined;
  onNumberChange: (
    value: string
  ) => void;
  onTitleChange: (
    value: string
  ) => void;
  onTextChange: (
    value: string
  ) => void;
}) {
  return (
    <div className="
      rounded-2xl
      border
      border-slate-200
      bg-slate-50
      p-5
    ">

      <p className="
        text-xs
        font-semibold
        uppercase
        tracking-[0.15em]
        text-slate-400
      ">
        {label}
      </p>

      <div className="mt-5 space-y-4">

        <Field
          label="Number"
          value={number}
          onChange={
            onNumberChange
          }
        />

        <Field
          label="Title"
          value={title}
          onChange={
            onTitleChange
          }
        />

        <TextArea
          label="Text"
          value={text}
          onChange={
            onTextChange
          }
          rows={7}
        />

      </div>
    </div>
  );
}