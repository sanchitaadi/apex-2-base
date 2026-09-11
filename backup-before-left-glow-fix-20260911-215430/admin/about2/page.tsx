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

type AboutContent = {
  id?: string;
  section_key: string;

  /* MAIN */
  eyebrow: string;
  title: string;
  subtitle: string;
  content: string;

  /* MAIN IMAGE */
  image_url: string;
  image_alt: string;

  /* FOUNDER */
  founder_name: string;
  founder_role: string;
  founder_story: string;
  founder_image_url: string;
  founder_image_alt: string;

  /* MISSION / VISION */
  mission: string;
  vision: string;

  /* FACTS */
  established_date: string;
  institution_type: string;
  campus_area: string;

  /* HOMEPAGE CTA */
  about_button_label: string;
  about_button_url: string;

  /* HOMEPAGE GLANCE */
  glance_label: string;
  glance_text: string;

  /* HOMEPAGE FOUNDER CARD */
  beginnings_label: string;
  founder_year: string;
  founder_heading: string;
  founder_story_button_label: string;
  founder_story_button_url: string;

  /* HOMEPAGE VALUES */
  values_learning_title: string;
  values_learning_description: string;
  values_character_title: string;
  values_character_description: string;
  values_community_title: string;
  values_community_description: string;

  /* FACT LABELS */
  established_label: string;
  institution_label: string;
  campus_label: string;

  /* FALLBACKS */
  default_established_date: string;
  default_campus_area: string;

  /* ABOUT PAGE — STORY */
  story_label: string;
  story_heading_line_1: string;
  story_heading_line_2: string;
  story_secondary_text: string;

  /* ABOUT PAGE — HISTORY */
  history_label: string;
  history_heading: string;
  history_image_alt: string;

  /* ABOUT PAGE — FOUNDER SECTION */
  founder_section_label: string;
  founder_section_heading_line_1: string;
  founder_section_heading_line_2: string;

  /* ABOUT PAGE — DIRECTION */
  direction_label: string;
  direction_heading_line_1: string;
  direction_heading_line_2: string;
  mission_label: string;
  vision_label: string;

  /* ABOUT PAGE — VALUES */
  values_label: string;
  values_heading_line_1: string;
  values_heading_line_2: string;
  value_learning_number: string;
  value_character_number: string;
  value_community_number: string;

  /* ABOUT PAGE — FACTS */
  facts_enabled: boolean;

  /* ABOUT PAGE — CTA */
  cta_label: string;
  cta_heading_line_1: string;
  cta_heading_line_2: string;
  cta_button_label: string;
  cta_button_url: string;

  sort_order: number;
  is_active: boolean;
};

const defaultAbout: AboutContent = {
  section_key: "main",

  eyebrow: "ABOUT APEX",

  title:
    "A school built around the growth of the whole person.",

  subtitle:
    "Learning, character, confidence and responsibility.",

  content:
    "Apex Public School is a co-educational institution focused on the mental, physical, moral and social growth of its students.",

  image_url:
    "https://apexpublicschool.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-02-at-1.06.01-PM-22.jpeg",

  image_alt: "Apex Public School",

  founder_name:
    "Late Mr. Anthony M. Jonathan",

  founder_role:
    "Founder Principal",

  founder_story:
    "Late Mr. Anthony M. Jonathan was the founder principal and an educationist whose vision shaped Apex Public School.",

  founder_image_url: "",

  founder_image_alt:
    "Apex founder",

  mission:
    "To develop students through academic learning, character, confidence and responsible participation in the community.",

  vision:
    "To provide an environment where students can grow intellectually, physically, morally and socially.",

  established_date:
    "29 July 1985",

  institution_type:
    "Unaided Christian Minority Institution",

  campus_area:
    "4 acres",

  about_button_label:
    "Discover our story",

  about_button_url:
    "/about",

  glance_label:
    "The school at a glance",

  glance_text:
    "A place where academic learning and personal development belong together.",

  beginnings_label:
    "Our beginnings",

  founder_year:
    "1985",

  founder_heading:
    "Founded with education, values and purpose.",

  founder_story_button_label:
    "Read the founder's story",

  founder_story_button_url:
    "/about",

  values_learning_title:
    "Learning",

  values_learning_description:
    "Building curiosity, understanding and the confidence to keep learning.",

  values_character_title:
    "Character",

  values_character_description:
    "Developing responsibility, discipline, confidence and respect for others.",

  values_community_title:
    "Community",

  values_community_description:
    "Creating a school environment where students, families and educators grow together.",

  established_label:
    "Established",

  institution_label:
    "Institution",

  campus_label:
    "Campus",

  default_established_date:
    "29 July 1985",

  default_campus_area:
    "4 acres",

  story_label:
    "Our story",

  story_heading_line_1:
    "More than a",

  story_heading_line_2:
    "classroom.",

  story_secondary_text:
    "Learning at Apex extends beyond the classroom through character, confidence, responsibility and experience.",

  history_label:
    "Apex Public School",

  history_heading:
    "Education shaped by values, opportunity and experience.",

  history_image_alt:
    "Apex Public School campus",

  founder_section_label:
    "The founder",

  founder_section_heading_line_1:
    "A vision that",

  founder_section_heading_line_2:
    "became Apex.",

  direction_label:
    "Direction",

  direction_heading_line_1:
    "What guides",

  direction_heading_line_2:
    "Apex.",

  mission_label:
    "Mission",

  vision_label:
    "Vision",

  values_label:
    "Our values",

  values_heading_line_1:
    "The foundations",

  values_heading_line_2:
    "of everyday learning.",

  value_learning_number:
    "01",

  value_character_number:
    "02",

  value_community_number:
    "03",

  facts_enabled: true,

  cta_label:
    "Discover more",

  cta_heading_line_1:
    "See how Apex turns",

  cta_heading_line_2:
    "values into experience.",

  cta_button_label:
    "Explore Academics",

  cta_button_url:
    "/academics",

  sort_order: 0,

  is_active: true,
};

export default function AdminAboutPage() {
  const [about, setAbout] =
    useState<AboutContent>(
      defaultAbout
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploadingMain, setUploadingMain] =
    useState(false);

  const [uploadingFounder, setUploadingFounder] =
    useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    void loadAbout();
  }, []);

  async function loadAbout() {
    setLoading(true);
    setMessage("");

    try {
      const { data, error } =
        await supabase
          .from("about_content")
          .select("*")
          .eq("section_key", "main")
          .order("sort_order", {
            ascending: true,
          })
          .limit(1)
          .maybeSingle();

      if (error) {
        console.error(
          "About load error:",
          error
        );

        setMessage(
          `Could not load About content: ${error.message}`
        );

        return;
      }

      if (data) {
        const cleanedData =
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

        setAbout({
          ...defaultAbout,
          ...cleanedData,
          facts_enabled:
            data.facts_enabled !==
            false,
          is_active:
            data.is_active !== false,
        } as AboutContent);
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Could not load About content."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateField<
    K extends keyof AboutContent
  >(
    field: K,
    value: AboutContent[K]
  ) {
    setAbout((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveAbout() {
    setSaving(true);
    setMessage("");

    try {
      const payload = {
        section_key: "main",

        eyebrow:
          about.eyebrow || "",
        title:
          about.title || "",
        subtitle:
          about.subtitle || "",
        content:
          about.content || "",

        image_url:
          about.image_url || "",
        image_alt:
          about.image_alt || "",

        founder_name:
          about.founder_name || "",
        founder_role:
          about.founder_role || "",
        founder_story:
          about.founder_story || "",
        founder_image_url:
          about.founder_image_url || "",
        founder_image_alt:
          about.founder_image_alt || "",

        mission:
          about.mission || "",
        vision:
          about.vision || "",

        established_date:
          about.established_date || "",
        institution_type:
          about.institution_type || "",
        campus_area:
          about.campus_area || "",

        about_button_label:
          about.about_button_label || "",
        about_button_url:
          about.about_button_url || "",

        glance_label:
          about.glance_label || "",
        glance_text:
          about.glance_text || "",

        beginnings_label:
          about.beginnings_label || "",
        founder_year:
          about.founder_year || "",
        founder_heading:
          about.founder_heading || "",

        founder_story_button_label:
          about.founder_story_button_label ||
          "",

        founder_story_button_url:
          about.founder_story_button_url ||
          "",

        values_learning_title:
          about.values_learning_title ||
          "",

        values_learning_description:
          about.values_learning_description ||
          "",

        values_character_title:
          about.values_character_title ||
          "",

        values_character_description:
          about.values_character_description ||
          "",

        values_community_title:
          about.values_community_title ||
          "",

        values_community_description:
          about.values_community_description ||
          "",

        established_label:
          about.established_label ||
          "",

        institution_label:
          about.institution_label ||
          "",

        campus_label:
          about.campus_label ||
          "",

        default_established_date:
          about.default_established_date ||
          "",

        default_campus_area:
          about.default_campus_area ||
          "",

        story_label:
          about.story_label || "",

        story_heading_line_1:
          about.story_heading_line_1 ||
          "",

        story_heading_line_2:
          about.story_heading_line_2 ||
          "",

        story_secondary_text:
          about.story_secondary_text ||
          "",

        history_label:
          about.history_label || "",

        history_heading:
          about.history_heading ||
          "",

        history_image_alt:
          about.history_image_alt ||
          "",

        founder_section_label:
          about.founder_section_label ||
          "",

        founder_section_heading_line_1:
          about.founder_section_heading_line_1 ||
          "",

        founder_section_heading_line_2:
          about.founder_section_heading_line_2 ||
          "",

        direction_label:
          about.direction_label ||
          "",

        direction_heading_line_1:
          about.direction_heading_line_1 ||
          "",

        direction_heading_line_2:
          about.direction_heading_line_2 ||
          "",

        mission_label:
          about.mission_label || "",

        vision_label:
          about.vision_label || "",

        values_label:
          about.values_label || "",

        values_heading_line_1:
          about.values_heading_line_1 ||
          "",

        values_heading_line_2:
          about.values_heading_line_2 ||
          "",

        value_learning_number:
          about.value_learning_number ||
          "01",

        value_character_number:
          about.value_character_number ||
          "02",

        value_community_number:
          about.value_community_number ||
          "03",

        facts_enabled:
          Boolean(
            about.facts_enabled
          ),

        cta_label:
          about.cta_label || "",

        cta_heading_line_1:
          about.cta_heading_line_1 ||
          "",

        cta_heading_line_2:
          about.cta_heading_line_2 ||
          "",

        cta_button_label:
          about.cta_button_label ||
          "",

        cta_button_url:
          about.cta_button_url ||
          "",

        sort_order:
          Number(
            about.sort_order
          ) || 0,

        is_active:
          Boolean(
            about.is_active
          ),

        updated_at:
          new Date().toISOString(),
      };

      let error = null;

      if (about.id) {
        const result =
          await supabase
            .from("about_content")
            .update(payload)
            .eq(
              "id",
              about.id
            );

        error = result.error;
      } else {
        const result =
          await supabase
            .from("about_content")
            .insert(payload)
            .select()
            .single();

        error = result.error;

        if (result.data) {
          const cleanedData =
            Object.fromEntries(
              Object.entries(
                result.data
              ).map(
                ([key, value]) => [
                  key,
                  value === null
                    ? ""
                    : value,
                ]
              )
            );

          setAbout({
            ...defaultAbout,
            ...cleanedData,
            facts_enabled:
              result.data.facts_enabled !==
              false,
            is_active:
              result.data.is_active !==
              false,
          } as AboutContent);
        }
      }

      if (error) {
        console.error(
          "About save error:",
          error
        );

        throw error;
      }

      setMessage(
        "About section saved successfully."
      );

      await loadAbout();
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? `Could not save About section: ${error.message}`
          : "Could not save About section."
      );
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage(
    file: File,
    type: "main" | "founder"
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

    if (type === "main") {
      setUploadingMain(true);
    } else {
      setUploadingFounder(true);
    }

    try {
      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() ||
        "jpg";

      const fileName =
        `${type}-${Date.now()}.${extension}`;

      const { error } =
        await supabase.storage
          .from("about")
          .upload(
            fileName,
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
          .getPublicUrl(
            fileName
          );

      const publicUrl =
        data.publicUrl;

      if (!publicUrl) {
        throw new Error(
          "No public image URL was returned."
        );
      }

      if (type === "main") {
        updateField(
          "image_url",
          publicUrl
        );
      } else {
        updateField(
          "founder_image_url",
          publicUrl
        );
      }

      setMessage(
        type === "main"
          ? "Main image uploaded. Click Save About."
          : "Founder image uploaded. Click Save About."
      );
    } catch (error) {
      console.error(
        "Image upload error:",
        error
      );

      setMessage(
        error instanceof Error
          ? `Image upload failed: ${error.message}`
          : "Image upload failed."
      );
    } finally {
      if (type === "main") {
        setUploadingMain(false);
      } else {
        setUploadingFounder(false);
      }
    }
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
    type: "main" | "founder"
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    void uploadImage(file, type);

    event.target.value = "";
  }

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-slate-500">
            Loading About CMS...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 md:p-8">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Website / Content
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            About Apex
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Manage the homepage About section and
            the complete About page from one CMS
            record.
          </p>
        </div>

        <button
          type="button"
          onClick={saveAbout}
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
            transition
            hover:opacity-90
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <Save size={16} />

          {saving
            ? "Saving..."
            : "Save About"}
        </button>
      </div>

      {/* MESSAGE */}

      {message && (
        <div className="
          rounded-xl
          border
          border-slate-200
          bg-slate-50
          px-4
          py-3
          text-sm
          leading-6
          text-slate-700
        ">
          {message}
        </div>
      )}

      {/* =====================================================
          VISIBILITY
      ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              About visibility
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Controls whether CMS-driven About
              sections are active.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              updateField(
                "is_active",
                !about.is_active
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
                about.is_active
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }
            `}
          >
            {about.is_active ? (
              <>
                <Eye size={15} />
                Published
              </>
            ) : (
              <>
                <EyeOff size={15} />
                Hidden
              </>
            )}
          </button>
        </div>
      </section>

      {/* =====================================================
          MAIN INTRODUCTION
      ====================================================== */}

      <SettingsSection
        title="Main About introduction"
        description="Used by the homepage About section and the About page hero."
      >

        <Field
          label="Eyebrow"
          value={about.eyebrow}
          onChange={(value) =>
            updateField(
              "eyebrow",
              value
            )
          }
          placeholder="ABOUT APEX"
        />

        <Field
          label="Main title"
          value={about.title}
          onChange={(value) =>
            updateField(
              "title",
              value
            )
          }
        />

        <Field
          label="Subtitle"
          value={about.subtitle}
          onChange={(value) =>
            updateField(
              "subtitle",
              value
            )
          }
        />

        <TextArea
          label="Main description"
          value={about.content}
          onChange={(value) =>
            updateField(
              "content",
              value
            )
          }
          rows={6}
        />

        <div className="grid gap-5 md:grid-cols-2">

          <Field
            label="Homepage About button label"
            value={
              about.about_button_label
            }
            onChange={(value) =>
              updateField(
                "about_button_label",
                value
              )
            }
          />

          <Field
            label="Homepage About button URL"
            value={
              about.about_button_url
            }
            onChange={(value) =>
              updateField(
                "about_button_url",
                value
              )
            }
            placeholder="/about"
          />

        </div>
      </SettingsSection>

      {/* =====================================================
          MAIN IMAGE
      ====================================================== */}

      <SettingsSection
        title="Main About image"
        description="Large image used throughout the About presentation."
      >

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">

          <div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">

              {about.image_url ? (
                <img
                  src={about.image_url}
                  alt={
                    about.image_alt ||
                    "Apex Public School"
                  }
                  className="h-64 w-full object-cover"
                />
              ) : (
                <div className="flex h-64 items-center justify-center">
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
              bg-white
              px-4
              py-3
              text-sm
              font-semibold
              text-slate-700
              hover:bg-slate-50
            ">

              <Upload size={16} />

              {uploadingMain
                ? "Uploading..."
                : "Upload image"}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={
                  uploadingMain
                }
                onChange={(event) =>
                  handleImageChange(
                    event,
                    "main"
                  )
                }
              />

            </label>
          </div>

          <div className="space-y-5">

            <Field
              label="Image URL"
              value={
                about.image_url
              }
              onChange={(value) =>
                updateField(
                  "image_url",
                  value
                )
              }
            />

            <Field
              label="Image alt text"
              value={
                about.image_alt
              }
              onChange={(value) =>
                updateField(
                  "image_alt",
                  value
                )
              }
            />

          </div>
        </div>
      </SettingsSection>

      {/* =====================================================
          HOMEPAGE GLANCE
      ====================================================== */}

      <SettingsSection
        title="Homepage — School at a glance"
        description="Controls the text displayed over the main homepage About image."
      >

        <Field
          label="Glance label"
          value={
            about.glance_label
          }
          onChange={(value) =>
            updateField(
              "glance_label",
              value
            )
          }
        />

        <TextArea
          label="Glance text"
          value={
            about.glance_text
          }
          onChange={(value) =>
            updateField(
              "glance_text",
              value
            )
          }
          rows={4}
        />

      </SettingsSection>

      {/* =====================================================
          FOUNDER
      ====================================================== */}

      <SettingsSection
        title="Founder"
        description="Founder details shared across the homepage and About page."
      >

        <div className="grid gap-5 md:grid-cols-2">

          <Field
            label="Founder name"
            value={
              about.founder_name
            }
            onChange={(value) =>
              updateField(
                "founder_name",
                value
              )
            }
          />

          <Field
            label="Founder role"
            value={
              about.founder_role
            }
            onChange={(value) =>
              updateField(
                "founder_role",
                value
              )
            }
          />

        </div>

        <TextArea
          label="Founder story"
          value={
            about.founder_story
          }
          onChange={(value) =>
            updateField(
              "founder_story",
              value
            )
          }
          rows={7}
        />

        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">

          <div>
            <div className="
              flex
              h-48
              w-48
              items-center
              justify-center
              overflow-hidden
              rounded-full
              border
              border-slate-200
              bg-slate-100
            ">

              {about.founder_image_url ? (
                <img
                  src={
                    about.founder_image_url
                  }
                  alt={
                    about.founder_image_alt ||
                    "Apex founder"
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon
                  size={40}
                  className="text-slate-300"
                />
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
              bg-white
              px-3
              py-2.5
              text-sm
              font-semibold
              text-slate-700
              hover:bg-slate-50
            ">

              <Upload size={15} />

              {uploadingFounder
                ? "Uploading..."
                : "Upload founder image"}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={
                  uploadingFounder
                }
                onChange={(event) =>
                  handleImageChange(
                    event,
                    "founder"
                  )
                }
              />

            </label>
          </div>

          <div className="space-y-5">

            <Field
              label="Founder image URL"
              value={
                about.founder_image_url
              }
              onChange={(value) =>
                updateField(
                  "founder_image_url",
                  value
                )
              }
            />

            <Field
              label="Founder image alt text"
              value={
                about.founder_image_alt
              }
              onChange={(value) =>
                updateField(
                  "founder_image_alt",
                  value
                )
              }
            />

          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">

          <Field
            label="Homepage beginnings label"
            value={
              about.beginnings_label
            }
            onChange={(value) =>
              updateField(
                "beginnings_label",
                value
              )
            }
          />

          <Field
            label="Founder year"
            value={
              about.founder_year
            }
            onChange={(value) =>
              updateField(
                "founder_year",
                value
              )
            }
          />

        </div>

        <Field
          label="Homepage founder heading"
          value={
            about.founder_heading
          }
          onChange={(value) =>
            updateField(
              "founder_heading",
              value
            )
          }
        />

        <div className="grid gap-5 md:grid-cols-2">

          <Field
            label="Founder story button label"
            value={
              about.founder_story_button_label
            }
            onChange={(value) =>
              updateField(
                "founder_story_button_label",
                value
              )
            }
          />

          <Field
            label="Founder story button URL"
            value={
              about.founder_story_button_url
            }
            onChange={(value) =>
              updateField(
                "founder_story_button_url",
                value
              )
            }
            placeholder="/about"
          />

        </div>
      </SettingsSection>

      {/* =====================================================
          ABOUT PAGE STORY
      ====================================================== */}

      <SettingsSection
        title="About page — Story"
        description="Controls the introductory story section on /about."
      >

        <Field
          label="Story label"
          value={
            about.story_label
          }
          onChange={(value) =>
            updateField(
              "story_label",
              value
            )
          }
        />

        <div className="grid gap-5 md:grid-cols-2">

          <Field
            label="Story heading line 1"
            value={
              about.story_heading_line_1
            }
            onChange={(value) =>
              updateField(
                "story_heading_line_1",
                value
              )
            }
          />

          <Field
            label="Story heading line 2"
            value={
              about.story_heading_line_2
            }
            onChange={(value) =>
              updateField(
                "story_heading_line_2",
                value
              )
            }
          />

        </div>

        <TextArea
          label="Story secondary text"
          value={
            about.story_secondary_text
          }
          onChange={(value) =>
            updateField(
              "story_secondary_text",
              value
            )
          }
          rows={5}
        />

      </SettingsSection>

      {/* =====================================================
          ABOUT PAGE HISTORY
      ====================================================== */}

      <SettingsSection
        title="About page — History"
        description="Controls the history image caption and supporting text."
      >

        <Field
          label="History label"
          value={
            about.history_label
          }
          onChange={(value) =>
            updateField(
              "history_label",
              value
            )
          }
        />

        <TextArea
          label="History heading"
          value={
            about.history_heading
          }
          onChange={(value) =>
            updateField(
              "history_heading",
              value
            )
          }
          rows={4}
        />

        <Field
          label="History image alt text"
          value={
            about.history_image_alt
          }
          onChange={(value) =>
            updateField(
              "history_image_alt",
              value
            )
          }
        />

      </SettingsSection>

      {/* =====================================================
          ABOUT PAGE FOUNDER
      ====================================================== */}

      <SettingsSection
        title="About page — Founder section"
        description="Controls the dedicated founder section on /about."
      >

        <Field
          label="Founder section label"
          value={
            about.founder_section_label
          }
          onChange={(value) =>
            updateField(
              "founder_section_label",
              value
            )
          }
        />

        <div className="grid gap-5 md:grid-cols-2">

          <Field
            label="Founder heading line 1"
            value={
              about.founder_section_heading_line_1
            }
            onChange={(value) =>
              updateField(
                "founder_section_heading_line_1",
                value
              )
            }
          />

          <Field
            label="Founder heading line 2"
            value={
              about.founder_section_heading_line_2
            }
            onChange={(value) =>
              updateField(
                "founder_section_heading_line_2",
                value
              )
            }
          />

        </div>

      </SettingsSection>

      {/* =====================================================
          MISSION / VISION
      ====================================================== */}

      <SettingsSection
        title="Mission & Vision"
        description="Controls the mission and vision displayed on the About page."
      >

        <div className="grid gap-5 md:grid-cols-2">

          <Field
            label="Mission label"
            value={
              about.mission_label
            }
            onChange={(value) =>
              updateField(
                "mission_label",
                value
              )
            }
          />

          <Field
            label="Vision label"
            value={
              about.vision_label
            }
            onChange={(value) =>
              updateField(
                "vision_label",
                value
              )
            }
          />

        </div>

        <TextArea
          label="Mission"
          value={
            about.mission
          }
          onChange={(value) =>
            updateField(
              "mission",
              value
            )
          }
          rows={6}
        />

        <TextArea
          label="Vision"
          value={
            about.vision
          }
          onChange={(value) =>
            updateField(
              "vision",
              value
            )
          }
          rows={6}
        />

        <div className="grid gap-5 md:grid-cols-2">

          <Field
            label="Direction label"
            value={
              about.direction_label
            }
            onChange={(value) =>
              updateField(
                "direction_label",
                value
              )
            }
          />

          <div />

          <Field
            label="Direction heading line 1"
            value={
              about.direction_heading_line_1
            }
            onChange={(value) =>
              updateField(
                "direction_heading_line_1",
                value
              )
            }
          />

          <Field
            label="Direction heading line 2"
            value={
              about.direction_heading_line_2
            }
            onChange={(value) =>
              updateField(
                "direction_heading_line_2",
                value
              )
            }
          />

        </div>

      </SettingsSection>

      {/* =====================================================
          VALUES
      ====================================================== */}

      <SettingsSection
        title="Values"
        description="Manage the three values shown on both the homepage and About page."
      >

        <div className="grid gap-5 lg:grid-cols-3">

          <ValueEditor
            label="Learning"
            number={
              about.value_learning_number
            }
            title={
              about.values_learning_title
            }
            description={
              about.values_learning_description
            }
            onNumberChange={(value) =>
              updateField(
                "value_learning_number",
                value
              )
            }
            onTitleChange={(value) =>
              updateField(
                "values_learning_title",
                value
              )
            }
            onDescriptionChange={(value) =>
              updateField(
                "values_learning_description",
                value
              )
            }
          />

          <ValueEditor
            label="Character"
            number={
              about.value_character_number
            }
            title={
              about.values_character_title
            }
            description={
              about.values_character_description
            }
            onNumberChange={(value) =>
              updateField(
                "value_character_number",
                value
              )
            }
            onTitleChange={(value) =>
              updateField(
                "values_character_title",
                value
              )
            }
            onDescriptionChange={(value) =>
              updateField(
                "values_character_description",
                value
              )
            }
          />

          <ValueEditor
            label="Community"
            number={
              about.value_community_number
            }
            title={
              about.values_community_title
            }
            description={
              about.values_community_description
            }
            onNumberChange={(value) =>
              updateField(
                "value_community_number",
                value
              )
            }
            onTitleChange={(value) =>
              updateField(
                "values_community_title",
                value
              )
            }
            onDescriptionChange={(value) =>
              updateField(
                "values_community_description",
                value
              )
            }
          />

        </div>

        <Field
          label="Values section label"
          value={
            about.values_label
          }
          onChange={(value) =>
            updateField(
              "values_label",
              value
            )
          }
        />

        <div className="grid gap-5 md:grid-cols-2">

          <Field
            label="Values heading line 1"
            value={
              about.values_heading_line_1
            }
            onChange={(value) =>
              updateField(
                "values_heading_line_1",
                value
              )
            }
          />

          <Field
            label="Values heading line 2"
            value={
              about.values_heading_line_2
            }
            onChange={(value) =>
              updateField(
                "values_heading_line_2",
                value
              )
            }
          />

        </div>

      </SettingsSection>

      {/* =====================================================
          SCHOOL FACTS
      ====================================================== */}

      <SettingsSection
        title="School facts"
        description="Controls the Established, Institution and Campus cards."
      >

        <div className="grid gap-5 lg:grid-cols-3">

          <FactEditor
            cardName="Established"
            labelValue={
              about.established_label
            }
            value={
              about.established_date
            }
            onLabelChange={(value) =>
              updateField(
                "established_label",
                value
              )
            }
            onValueChange={(value) =>
              updateField(
                "established_date",
                value
              )
            }
          />

          <FactEditor
            cardName="Institution"
            labelValue={
              about.institution_label
            }
            value={
              about.institution_type
            }
            onLabelChange={(value) =>
              updateField(
                "institution_label",
                value
              )
            }
            onValueChange={(value) =>
              updateField(
                "institution_type",
                value
              )
            }
          />

          <FactEditor
            cardName="Campus"
            labelValue={
              about.campus_label
            }
            value={
              about.campus_area
            }
            onLabelChange={(value) =>
              updateField(
                "campus_label",
                value
              )
            }
            onValueChange={(value) =>
              updateField(
                "campus_area",
                value
              )
            }
          />

        </div>

        <div className="grid gap-5 md:grid-cols-2">

          <Field
            label="Default established date"
            value={
              about.default_established_date
            }
            onChange={(value) =>
              updateField(
                "default_established_date",
                value
              )
            }
          />

          <Field
            label="Default campus area"
            value={
              about.default_campus_area
            }
            onChange={(value) =>
              updateField(
                "default_campus_area",
                value
              )
            }
          />

        </div>

        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Show facts on About page
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Hide the complete school facts section
              without deleting its content.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              updateField(
                "facts_enabled",
                !about.facts_enabled
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
                about.facts_enabled
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-200 text-slate-600"
              }
            `}
          >
            {about.facts_enabled ? (
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

      </SettingsSection>

      {/* =====================================================
          ABOUT PAGE CTA
      ====================================================== */}

      <SettingsSection
        title="About page closing CTA"
        description="Controls the final call-to-action section at the bottom of /about."
      >

        <Field
          label="CTA label"
          value={
            about.cta_label
          }
          onChange={(value) =>
            updateField(
              "cta_label",
              value
            )
          }
        />

        <div className="grid gap-5 md:grid-cols-2">

          <Field
            label="CTA heading line 1"
            value={
              about.cta_heading_line_1
            }
            onChange={(value) =>
              updateField(
                "cta_heading_line_1",
                value
              )
            }
          />

          <Field
            label="CTA heading line 2"
            value={
              about.cta_heading_line_2
            }
            onChange={(value) =>
              updateField(
                "cta_heading_line_2",
                value
              )
            }
          />

        </div>

        <div className="grid gap-5 md:grid-cols-2">

          <Field
            label="CTA button label"
            value={
              about.cta_button_label
            }
            onChange={(value) =>
              updateField(
                "cta_button_label",
                value
              )
            }
          />

          <Field
            label="CTA button URL"
            value={
              about.cta_button_url
            }
            onChange={(value) =>
              updateField(
                "cta_button_url",
                value
              )
            }
          />

        </div>

      </SettingsSection>

      {/* =====================================================
          SAVE BAR
      ====================================================== */}

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
              About CMS
            </p>

            <p className="text-xs text-slate-500">
              All changes are saved to the same
              <code className="mx-1 rounded bg-slate-100 px-1">
                about_content
              </code>
              record.
            </p>
          </div>

          <button
            type="button"
            onClick={saveAbout}
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
              transition
              hover:opacity-90
              disabled:cursor-not-allowed
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

/* =========================================================
   SECTION
========================================================= */

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      <div className="space-y-5">
        {children}
      </div>

    </section>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string | null | undefined;
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

/* =========================================================
   TEXT AREA
========================================================= */

function TextArea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string | null | undefined;
  onChange: (value: string) => void;
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
          leading-6
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

/* =========================================================
   VALUE EDITOR
========================================================= */

function ValueEditor({
  label,
  number,
  title,
  description,
  onNumberChange,
  onTitleChange,
  onDescriptionChange,
}: {
  label: string;
  number: string | null | undefined;
  title: string | null | undefined;
  description: string | null | undefined;
  onNumberChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (
    value: string
  ) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
        {label}
      </p>

      <div className="mt-5 space-y-4">

        <Field
          label="Number"
          value={number}
          onChange={onNumberChange}
          placeholder="01"
        />

        <Field
          label="Title"
          value={title}
          onChange={onTitleChange}
        />

        <TextArea
          label="Description"
          value={description}
          onChange={onDescriptionChange}
          rows={5}
        />

      </div>
    </div>
  );
}

/* =========================================================
   FACT EDITOR
========================================================= */

function FactEditor({
  cardName,
  labelValue,
  value,
  onLabelChange,
  onValueChange,
}: {
  cardName: string;
  labelValue: string | null | undefined;
  value: string | null | undefined;
  onLabelChange: (value: string) => void;
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
        {cardName}
      </p>

      <div className="mt-5 space-y-4">

        <Field
          label="Card label"
          value={labelValue}
          onChange={onLabelChange}
        />

        <Field
          label="Value"
          value={value}
          onChange={onValueChange}
        />

      </div>
    </div>
  );
}