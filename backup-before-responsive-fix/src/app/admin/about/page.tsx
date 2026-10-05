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

  eyebrow: string;
  title: string;
  subtitle: string;
  content: string;

  image_url: string;
  image_alt: string;

  founder_name: string;
  founder_role: string;
  founder_story: string;
  founder_image_url: string;
  founder_image_alt: string;

  mission: string;
  vision: string;

  established_date: string;
  institution_type: string;
  campus_area: string;

  about_button_label: string;
  about_button_url: string;

  glance_label: string;
  glance_text: string;

  beginnings_label: string;
  founder_year: string;
  founder_heading: string;

  founder_story_button_label: string;
  founder_story_button_url: string;

  values_learning_title: string;
  values_learning_description: string;

  values_character_title: string;
  values_character_description: string;

  values_community_title: string;
  values_community_description: string;

  established_label: string;
  institution_label: string;
  campus_label: string;

  default_established_date: string;
  default_campus_area: string;

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

  founder_image_alt: "Founder",

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

  sort_order: 0,

  is_active: true,
};

export default function AdminAboutPage() {
  const [about, setAbout] =
    useState<AboutContent>(defaultAbout);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [uploadingMain, setUploadingMain] =
    useState(false);

  const [uploadingFounder, setUploadingFounder] =
    useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadAbout();
  }, []);

  async function loadAbout() {
    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase
        .from("about_content")
        .select("*")
        .eq("section_key", "main")
        .order("sort_order", {
          ascending: true,
        })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("About load error:", error);
        setMessage(
          "Could not load About content."
        );
        return;
      }

      if (data) {
        const cleanedData = Object.fromEntries(
          Object.entries(data).map(
            ([key, value]) => [
              key,
              value === null ? "" : value,
            ]
          )
        );

        setAbout({
          ...defaultAbout,
          ...cleanedData,
        } as AboutContent);
      }
    } catch (error) {
      console.error(
        "Unexpected About load error:",
        error
      );

      setMessage(
        "Could not load About content."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateField<K extends keyof AboutContent>(
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

        eyebrow: about.eyebrow || "",
        title: about.title || "",
        subtitle: about.subtitle || "",
        content: about.content || "",

        image_url: about.image_url || "",
        image_alt: about.image_alt || "",

        founder_name: about.founder_name || "",
        founder_role: about.founder_role || "",
        founder_story: about.founder_story || "",
        founder_image_url:
          about.founder_image_url || "",
        founder_image_alt:
          about.founder_image_alt || "",

        mission: about.mission || "",
        vision: about.vision || "",

        established_date:
          about.established_date || "",
        institution_type:
          about.institution_type || "",
        campus_area: about.campus_area || "",

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
          about.founder_story_button_label || "",

        founder_story_button_url:
          about.founder_story_button_url || "",

        values_learning_title:
          about.values_learning_title || "",

        values_learning_description:
          about.values_learning_description || "",

        values_character_title:
          about.values_character_title || "",

        values_character_description:
          about.values_character_description || "",

        values_community_title:
          about.values_community_title || "",

        values_community_description:
          about.values_community_description || "",

        established_label:
          about.established_label || "",

        institution_label:
          about.institution_label || "",

        campus_label:
          about.campus_label || "",

        default_established_date:
          about.default_established_date || "",

        default_campus_area:
          about.default_campus_area || "",

        sort_order:
          Number(about.sort_order) || 0,

        is_active:
          Boolean(about.is_active),

        updated_at:
          new Date().toISOString(),
      };

      let error = null;

      if (about.id) {
        const result = await supabase
          .from("about_content")
          .update(payload)
          .eq("id", about.id);

        error = result.error;
      } else {
        const result = await supabase
          .from("about_content")
          .insert(payload)
          .select()
          .single();

        error = result.error;

        if (result.data) {
          const cleanedData =
            Object.fromEntries(
              Object.entries(result.data).map(
                ([key, value]) => [
                  key,
                  value === null ? "" : value,
                ]
              )
            );

          setAbout({
            ...defaultAbout,
            ...cleanedData,
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
    } catch (error) {
      console.error(error);

      setMessage(
        "Could not save About section. Check your Supabase columns and RLS policies."
      );
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage(
    file: File,
    type: "main" | "founder"
  ) {
    if (!file.type.startsWith("image/")) {
      setMessage(
        "Please select an image file."
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
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
          ?.toLowerCase() || "jpg";

      const path =
        type === "main"
          ? `main-${Date.now()}.${extension}`
          : `founder-${Date.now()}.${extension}`;

      const { error: uploadError } =
        await supabase.storage
          .from("about")
          .upload(path, file, {
            upsert: true,
            contentType: file.type,
          });

      if (uploadError) {
        throw uploadError;
      }

      const { data } =
        supabase.storage
          .from("about")
          .getPublicUrl(path);

      const publicUrl = data.publicUrl;

      if (!publicUrl) {
        throw new Error(
          "Supabase did not return a public URL."
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
          ? "Main About image uploaded. Click Save About to publish the URL."
          : "Founder image uploaded. Click Save About to publish the URL."
      );
    } catch (error) {
      console.error(
        "About image upload error:",
        error
      );

      setMessage(
        "Image upload failed. Make sure the 'about' Supabase storage bucket exists and the current user has permission to upload."
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
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    void uploadImage(file, type);

    event.target.value = "";
  }

  if (loading) {
    return (
      <div className="p-8">
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

      {/* HEADER */}

      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Website / Content
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            About Apex
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Manage the complete homepage About
            section, including its copy, images,
            founder story, values and school facts.
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

      {/* VISIBILITY */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Homepage visibility
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Control whether the About section
              appears on the homepage.
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
                Visible
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

      {/* INTRODUCTION */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle
          title="Introduction"
          description="The main text displayed at the top of the homepage About section."
        />

        <div className="mt-6 space-y-5">

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
            rows={5}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="About button label"
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
              label="About button URL"
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
        </div>
      </section>

      {/* MAIN IMAGE */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle
          title="Main About image"
          description="The large image displayed on the left side of the homepage About section."
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">

          <div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              {about.image_url ? (
                <img
                  src={about.image_url}
                  alt={about.image_alt || "Apex Public School"}
                  className="h-64 w-full object-cover"
                />
              ) : (
                <div className="flex h-64 items-center justify-center">
                  <ImageIcon
                    size={42}
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
              transition
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
                disabled={uploadingMain}
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
              value={about.image_url}
              onChange={(value) =>
                updateField(
                  "image_url",
                  value
                )
              }
            />

            <Field
              label="Image alt text"
              value={about.image_alt}
              onChange={(value) =>
                updateField(
                  "image_alt",
                  value
                )
              }
              placeholder="Apex Public School"
            />

            <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              Uploading an image updates the URL in
              the form. Click <strong>Save About</strong>
              to store it in the CMS record.
            </div>
          </div>
        </div>
      </section>

      {/* SCHOOL AT A GLANCE */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle
          title="School at a glance"
          description="Text displayed over the bottom of the main About image."
        />

        <div className="mt-6 space-y-5">
          <Field
            label="Glance label"
            value={about.glance_label}
            onChange={(value) =>
              updateField(
                "glance_label",
                value
              )
            }
          />

          <TextArea
            label="Glance text"
            value={about.glance_text}
            onChange={(value) =>
              updateField(
                "glance_text",
                value
              )
            }
            rows={4}
          />
        </div>
      </section>

      {/* FOUNDER */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle
          title="Founder story"
          description="Manage everything displayed in the founder card."
        />

        <div className="mt-6 space-y-6">

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Beginnings label"
              value={about.beginnings_label}
              onChange={(value) =>
                updateField(
                  "beginnings_label",
                  value
                )
              }
            />

            <Field
              label="Founder year"
              value={about.founder_year}
              onChange={(value) =>
                updateField(
                  "founder_year",
                  value
                )
              }
            />
          </div>

          <Field
            label="Founder heading"
            value={about.founder_heading}
            onChange={(value) =>
              updateField(
                "founder_heading",
                value
              )
            }
          />

          <TextArea
            label="Founder story"
            value={about.founder_story}
            onChange={(value) =>
              updateField(
                "founder_story",
                value
              )
            }
            rows={6}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Founder name"
              value={about.founder_name}
              onChange={(value) =>
                updateField(
                  "founder_name",
                  value
                )
              }
            />

            <Field
              label="Founder role"
              value={about.founder_role}
              onChange={(value) =>
                updateField(
                  "founder_role",
                  value
                )
              }
            />
          </div>

          {/* FOUNDER IMAGE */}

          <div className="grid gap-6 lg:grid-cols-[180px_1fr]">

            <div>
              <div className="
                flex
                h-40
                w-40
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
                      "Founder"
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon
                    size={36}
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
                  : "Upload"}

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
                placeholder="Founder"
              />
            </div>
          </div>

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
        </div>
      </section>

      {/* VALUES */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle
          title="Values"
          description="The three value cards displayed below the founder section."
        />

        <div className="mt-6 grid gap-5 lg:grid-cols-3">

          <ValueEditor
            label="Learning"
            title={
              about.values_learning_title
            }
            description={
              about.values_learning_description
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
            title={
              about.values_character_title
            }
            description={
              about.values_character_description
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
            title={
              about.values_community_title
            }
            description={
              about.values_community_description
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
      </section>

      {/* SCHOOL FACTS */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle
          title="School facts"
          description="The three fact cards displayed at the bottom of the homepage About section."
        />

        <div className="mt-6 grid gap-5 lg:grid-cols-3">

          <FactEditor
            label="Established"
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
            label="Institution"
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
            label="Campus"
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
      </section>

      {/* MISSION / VISION */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle
          title="Additional About content"
          description="Mission and vision remain available for the dedicated About page and other About content."
        />

        <div className="mt-6 space-y-5">

          <TextArea
            label="Mission"
            value={about.mission}
            onChange={(value) =>
              updateField(
                "mission",
                value
              )
            }
            rows={5}
          />

          <TextArea
            label="Vision"
            value={about.vision}
            onChange={(value) =>
              updateField(
                "vision",
                value
              )
            }
            rows={5}
          />
        </div>
      </section>

      {/* DEFAULT FALLBACK VALUES */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle
          title="Fallback values"
          description="Defaults used when a corresponding school fact is empty."
        />

        <div className="mt-6 grid gap-5 md:grid-cols-2">
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
            placeholder="29 July 1985"
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
            placeholder="4 acres"
          />
        </div>
      </section>

      {/* FINAL SAVE */}

      <div className="sticky bottom-4 z-20">
        <div className="
          flex
          flex-col
          gap-3
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
              About homepage section
            </p>

            <p className="text-xs text-slate-500">
              Save your changes to publish them to
              the homepage.
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
          onChange(event.target.value)
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
          onChange(event.target.value)
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

function ValueEditor({
  label,
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: {
  label: string;
  title: string | null | undefined;
  description: string | null | undefined;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
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

function FactEditor({
  label,
  labelValue,
  value,
  onLabelChange,
  onValueChange,
}: {
  label: string;
  labelValue: string | null | undefined;
  value: string | null | undefined;
  onLabelChange: (value: string) => void;
  onValueChange: (value: string) => void;
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