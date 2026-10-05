"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Plus,
  Trash2,
  Upload,
  Eye,
  EyeOff,
} from "lucide-react";
import { supabase } from "@/lib/supabase/browser";

type Settings = {
  id?: string;

  section_label: string;
  heading_line_1: string;
  heading_line_2: string;
  description: string;

  explore_button_label: string;
  explore_button_url: string;

  senior_secondary_label: string;
  senior_secondary_heading_line_1: string;
  senior_secondary_heading_line_2: string;
  senior_secondary_description: string;

  stream_button_label: string;
  stream_button_url: string;

  resource_label: string;

  syllabus_title: string;
  syllabus_button_label: string;
  syllabus_button_url: string;

  datesheet_title: string;
  datesheet_button_label: string;
  datesheet_button_url: string;

  faculty_label: string;
  faculty_title: string;
  faculty_button_label: string;
  faculty_button_url: string;

  closing_label: string;
  closing_heading_line_1: string;
  closing_heading_line_2: string;
  closing_button_label: string;
  closing_button_url: string;

  is_active: boolean;
};

type Stage = {
  id: string;
  number: number;
  display_number: string;
  title: string;
  classes: string;
  description: string;
  image_url: string;
  icon_name: string;
  card_size: string;
  button_label: string;
  button_url: string;
  sort_order: number;
  is_active: boolean;
};

type Stream = {
  id: string;
  title: string;
  subjects: string;
  description: string;
  image_url: string;
  icon_name: string;
  button_label: string;
  button_url: string;
  sort_order: number;
  is_active: boolean;
};

const defaultSettings: Settings = {
  section_label: "Learning at Apex",
  heading_line_1: "Learning grows",
  heading_line_2: "with every stage.",
  description:
    "From the early years to senior secondary education, Apex supports students through changing interests, deeper learning and new academic possibilities.",

  explore_button_label: "Explore academics",
  explore_button_url: "/academics",

  senior_secondary_label: "Senior Secondary",
  senior_secondary_heading_line_1: "Choose a path",
  senior_secondary_heading_line_2:
    "that feels like yours.",
  senior_secondary_description:
    "Senior secondary education opens the door to more focused study. Apex offers academic pathways in Science, Commerce and Humanities.",

  stream_button_label: "Explore",
  stream_button_url:
    "/academics/senior-secondary",

  resource_label: "Resource",

  syllabus_title: "Syllabus",
  syllabus_button_label: "View syllabus",
  syllabus_button_url:
    "/academics/syllabus",

  datesheet_title: "Datesheet",
  datesheet_button_label:
    "View datesheet",
  datesheet_button_url:
    "/academics/datesheet",

  faculty_label: "People",
  faculty_title: "Our Faculty",
  faculty_button_label:
    "Meet the faculty",
  faculty_button_url: "/faculty",

  closing_label:
    "Education beyond the syllabus",
  closing_heading_line_1:
    "Strong academics matter.",
  closing_heading_line_2:
    "So do curiosity, confidence, creativity and character.",
  closing_button_label:
    "Academic life",
  closing_button_url: "/academics",

  is_active: true,
};

export default function AdminAcademicsPage() {
  const [settings, setSettings] =
    useState<Settings>(defaultSettings);

  const [stages, setStages] =
    useState<Stage[]>([]);

  const [streams, setStreams] =
    useState<Stream[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [savingSettings, setSavingSettings] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [uploading, setUploading] =
    useState<string | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setMessage("");

    try {
      const [
        settingsResult,
        stagesResult,
        streamsResult,
      ] = await Promise.all([
        supabase
          .from("academics_home_settings")
          .select("*")
          .order("updated_at", {
            ascending: false,
          })
          .limit(1)
          .maybeSingle(),

        supabase
          .from("academic_stages")
          .select("*")
          .order("sort_order", {
            ascending: true,
          }),

        supabase
          .from("academic_streams")
          .select("*")
          .order("sort_order", {
            ascending: true,
          }),
      ]);

      if (settingsResult.error) {
        console.error(
          "Settings load error:",
          settingsResult.error
        );
      }

      if (stagesResult.error) {
        console.error(
          "Stages load error:",
          stagesResult.error
        );
      }

      if (streamsResult.error) {
        console.error(
          "Streams load error:",
          streamsResult.error
        );
      }

      if (settingsResult.data) {
        const cleanedSettings =
          Object.fromEntries(
            Object.entries(
              settingsResult.data
            ).map(([key, value]) => [
              key,
              value === null ? "" : value,
            ])
          );

        setSettings({
          ...defaultSettings,
          ...cleanedSettings,
        } as Settings);
      }

      if (stagesResult.data) {
        setStages(
          stagesResult.data.map(
            (stage, index) => ({
              id: stage.id,

              number:
                Number(stage.number) ||
                index + 1,

              display_number:
                stage.display_number ??
                "",

              title:
                stage.title ?? "",

              classes:
                stage.classes ?? "",

              description:
                stage.description ??
                "",

              image_url:
                stage.image_url ??
                "",

              icon_name:
                stage.icon_name ??
                "BookOpen",

              card_size:
                stage.card_size ??
                "small",

              button_label:
                stage.button_label ??
                "Learn more",

              button_url:
                stage.button_url ??
                "/academics",

              sort_order:
                Number(
                  stage.sort_order
                ) ||
                index + 1,

              is_active:
                stage.is_active !==
                false,
            })
          )
        );
      }

      if (streamsResult.data) {
        setStreams(
          streamsResult.data.map(
            (stream, index) => ({
              id: stream.id,

              title:
                stream.title ?? "",

              subjects:
                stream.subjects ??
                "",

              description:
                stream.description ??
                "",

              image_url:
                stream.image_url ??
                "",

              icon_name:
                stream.icon_name ??
                "FlaskConical",

              button_label:
                stream.button_label ??
                "Explore",

              button_url:
                stream.button_url ??
                "/academics/senior-secondary",

              sort_order:
                Number(
                  stream.sort_order
                ) ||
                index + 1,

              is_active:
                stream.is_active !==
                false,
            })
          )
        );
      }
    } catch (error) {
      console.error(
        "Academics CMS load error:",
        error
      );

      setMessage(
        "Could not load Academics CMS."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateSetting(
    field: keyof Settings,
    value: string | boolean
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateStage(
    id: string,
    field: keyof Stage,
    value:
      | string
      | number
      | boolean
  ) {
    setStages((current) =>
      current.map((stage) =>
        stage.id === id
          ? {
              ...stage,
              [field]: value,
            }
          : stage
      )
    );
  }

  function updateStream(
    id: string,
    field: keyof Stream,
    value:
      | string
      | number
      | boolean
  ) {
    setStreams((current) =>
      current.map((stream) =>
        stream.id === id
          ? {
              ...stream,
              [field]: value,
            }
          : stream
      )
    );
  }

  async function saveSettings() {
    setSavingSettings(true);
    setMessage("");

    try {
      const payload = {
        section_label:
          settings.section_label || "",
        heading_line_1:
          settings.heading_line_1 || "",
        heading_line_2:
          settings.heading_line_2 || "",
        description:
          settings.description || "",

        explore_button_label:
          settings.explore_button_label ||
          "",
        explore_button_url:
          settings.explore_button_url ||
          "/academics",

        senior_secondary_label:
          settings.senior_secondary_label ||
          "",
        senior_secondary_heading_line_1:
          settings.senior_secondary_heading_line_1 ||
          "",
        senior_secondary_heading_line_2:
          settings.senior_secondary_heading_line_2 ||
          "",
        senior_secondary_description:
          settings.senior_secondary_description ||
          "",

        stream_button_label:
          settings.stream_button_label ||
          "Explore",
        stream_button_url:
          settings.stream_button_url ||
          "/academics/senior-secondary",

        resource_label:
          settings.resource_label ||
          "Resource",

        syllabus_title:
          settings.syllabus_title ||
          "Syllabus",
        syllabus_button_label:
          settings.syllabus_button_label ||
          "View syllabus",
        syllabus_button_url:
          settings.syllabus_button_url ||
          "/academics/syllabus",

        datesheet_title:
          settings.datesheet_title ||
          "Datesheet",
        datesheet_button_label:
          settings.datesheet_button_label ||
          "View datesheet",
        datesheet_button_url:
          settings.datesheet_button_url ||
          "/academics/datesheet",

        faculty_label:
          settings.faculty_label ||
          "People",
        faculty_title:
          settings.faculty_title ||
          "Our Faculty",
        faculty_button_label:
          settings.faculty_button_label ||
          "Meet the faculty",
        faculty_button_url:
          settings.faculty_button_url ||
          "/faculty",

        closing_label:
          settings.closing_label || "",
        closing_heading_line_1:
          settings.closing_heading_line_1 ||
          "",
        closing_heading_line_2:
          settings.closing_heading_line_2 ||
          "",
        closing_button_label:
          settings.closing_button_label ||
          "",
        closing_button_url:
          settings.closing_button_url ||
          "/academics",

        is_active:
          settings.is_active,

        updated_at:
          new Date().toISOString(),
      };

      if (settings.id) {
        const { error } =
          await supabase
            .from(
              "academics_home_settings"
            )
            .update(payload)
            .eq(
              "id",
              settings.id
            );

        if (error) {
          throw error;
        }
      } else {
        const { data, error } =
          await supabase
            .from(
              "academics_home_settings"
            )
            .insert(payload)
            .select()
            .single();

        if (error) {
          throw error;
        }

        if (data) {
          setSettings({
            ...defaultSettings,
            ...data,
          } as Settings);
        }
      }

      setMessage(
        "Academics section settings saved successfully."
      );
    } catch (error) {
      console.error(
        "Settings save error:",
        error
      );

      setMessage(
        "Could not save Academics section settings."
      );
    } finally {
      setSavingSettings(false);
    }
  }

  async function saveStage(stage: Stage) {
    try {
      const { error } =
        await supabase
          .from("academic_stages")
          .update({
            number:
              Number(stage.number) ||
              1,

            display_number:
              stage.display_number ||
              String(
                stage.number
              ).padStart(2, "0"),

            title:
              stage.title || "",

            classes:
              stage.classes || "",

            description:
              stage.description ||
              "",

            image_url:
              stage.image_url || "",

            icon_name:
              stage.icon_name ||
              "BookOpen",

            card_size:
              stage.card_size ||
              "small",

            button_label:
              stage.button_label ||
              "Learn more",

            button_url:
              stage.button_url ||
              "/academics",

            sort_order:
              Number(
                stage.sort_order
              ) || stage.number,

            is_active:
              Boolean(
                stage.is_active
              ),
          })
          .eq(
            "id",
            stage.id
          );

      if (error) {
        throw error;
      }

      setMessage(
        `"${stage.title}" saved successfully.`
      );
    } catch (error) {
      console.error(
        "Stage save error:",
        error
      );

      setMessage(
        "Could not save academic stage."
      );
    }
  }

  async function saveStream(
    stream: Stream
  ) {
    try {
      const { error } =
        await supabase
          .from(
            "academic_streams"
          )
          .update({
            title:
              stream.title || "",

            subjects:
              stream.subjects || "",

            description:
              stream.description ||
              "",

            image_url:
              stream.image_url || "",

            icon_name:
              stream.icon_name ||
              "FlaskConical",

            button_label:
              stream.button_label ||
              "Explore",

            button_url:
              stream.button_url ||
              "/academics/senior-secondary",

            sort_order:
              Number(
                stream.sort_order
              ) || 1,

            is_active:
              Boolean(
                stream.is_active
              ),
          })
          .eq(
            "id",
            stream.id
          );

      if (error) {
        throw error;
      }

      setMessage(
        `"${stream.title}" saved successfully.`
      );
    } catch (error) {
      console.error(
        "Stream save error:",
        error
      );

      setMessage(
        "Could not save academic stream."
      );
    }
  }

  async function addStage() {
    const nextNumber =
      stages.length > 0
        ? Math.max(
            ...stages.map(
              (stage) =>
                Number(
                  stage.number
                ) || 0
            )
          ) + 1
        : 1;

    const { data, error } =
      await supabase
        .from("academic_stages")
        .insert({
          number: nextNumber,

          display_number:
            String(
              nextNumber
            ).padStart(2, "0"),

          title: "New Stage",

          classes: "",

          description: "",

          image_url: "",

          icon_name:
            "BookOpen",

          card_size:
            "small",

          button_label:
            "Learn more",

          button_url:
            "/academics",

          sort_order:
            nextNumber,

          is_active:
            true,
        })
        .select()
        .single();

    if (error) {
      console.error(
        "Add stage error:",
        error
      );

      setMessage(
        `Could not add stage: ${error.message}`
      );

      return;
    }

    if (data) {
      setStages((current) => [
        ...current,
        {
          id: data.id,
          number:
            Number(
              data.number
            ) || nextNumber,
          display_number:
            data.display_number ??
            String(
              nextNumber
            ).padStart(2, "0"),
          title:
            data.title ?? "",
          classes:
            data.classes ?? "",
          description:
            data.description ?? "",
          image_url:
            data.image_url ?? "",
          icon_name:
            data.icon_name ??
            "BookOpen",
          card_size:
            data.card_size ??
            "small",
          button_label:
            data.button_label ??
            "Learn more",
          button_url:
            data.button_url ??
            "/academics",
          sort_order:
            Number(
              data.sort_order
            ) || nextNumber,
          is_active:
            data.is_active !==
            false,
        },
      ]);
    }
  }

  async function addStream() {
    const nextOrder =
      streams.length > 0
        ? Math.max(
            ...streams.map(
              (stream) =>
                Number(
                  stream.sort_order
                ) || 0
            )
          ) + 1
        : 1;

    const { data, error } =
      await supabase
        .from(
          "academic_streams"
        )
        .insert({
          title:
            "New Stream",

          subjects: "",

          description: "",

          image_url: "",

          icon_name:
            "FlaskConical",

          button_label:
            "Explore",

          button_url:
            "/academics/senior-secondary",

          sort_order:
            nextOrder,

          is_active:
            true,
        })
        .select()
        .single();

    if (error) {
      console.error(
        "Add stream error:",
        error
      );

      setMessage(
        `Could not add stream: ${error.message}`
      );

      return;
    }

    if (data) {
      setStreams((current) => [
        ...current,
        {
          id: data.id,
          title:
            data.title ?? "",
          subjects:
            data.subjects ?? "",
          description:
            data.description ?? "",
          image_url:
            data.image_url ?? "",
          icon_name:
            data.icon_name ??
            "FlaskConical",
          button_label:
            data.button_label ??
            "Explore",
          button_url:
            data.button_url ??
            "/academics/senior-secondary",
          sort_order:
            Number(
              data.sort_order
            ) || nextOrder,
          is_active:
            data.is_active !==
            false,
        },
      ]);
    }
  }

  async function deleteStage(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Delete this academic stage?"
      );

    if (!confirmed) {
      return;
    }

    const { error } =
      await supabase
        .from("academic_stages")
        .delete()
        .eq("id", id);

    if (error) {
      console.error(
        "Delete stage error:",
        error
      );

      setMessage(
        "Could not delete stage."
      );

      return;
    }

    setStages((current) =>
      current.filter(
        (stage) =>
          stage.id !== id
      )
    );

    setMessage(
      "Academic stage deleted."
    );
  }

  async function deleteStream(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Delete this academic stream?"
      );

    if (!confirmed) {
      return;
    }

    const { error } =
      await supabase
        .from(
          "academic_streams"
        )
        .delete()
        .eq("id", id);

    if (error) {
      console.error(
        "Delete stream error:",
        error
      );

      setMessage(
        "Could not delete stream."
      );

      return;
    }

    setStreams((current) =>
      current.filter(
        (stream) =>
          stream.id !== id
      )
    );

    setMessage(
      "Academic stream deleted."
    );
  }

  async function uploadImage(
    file: File,
    type: "stage" | "stream",
    id: string
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

    setUploading(
      `${type}-${id}`
    );

    try {
      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() ||
        "jpg";

      const path =
        `academics/${type}-${id}-${Date.now()}.${extension}`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from(
          "academic-resources"
        )
        .upload(
          path,
          file,
          {
            upsert: true,
            contentType:
              file.type,
          }
        );

      if (uploadError) {
        throw uploadError;
      }

      const { data } =
        supabase.storage
          .from(
            "academic-resources"
          )
          .getPublicUrl(
            path
          );

      const url =
        data.publicUrl;

      if (type === "stage") {
        const { error } =
          await supabase
            .from(
              "academic_stages"
            )
            .update({
              image_url: url,
            })
            .eq(
              "id",
              id
            );

        if (error) {
          throw error;
        }

        setStages((current) =>
          current.map(
            (stage) =>
              stage.id === id
                ? {
                    ...stage,
                    image_url:
                      url,
                  }
                : stage
          )
        );
      } else {
        const { error } =
          await supabase
            .from(
              "academic_streams"
            )
            .update({
              image_url: url,
            })
            .eq(
              "id",
              id
            );

        if (error) {
          throw error;
        }

        setStreams((current) =>
          current.map(
            (stream) =>
              stream.id === id
                ? {
                    ...stream,
                    image_url:
                      url,
                  }
                : stream
          )
        );
      }

      setMessage(
        "Image uploaded successfully."
      );
    } catch (error) {
      console.error(
        "Image upload error:",
        error
      );

      setMessage(
        "Image upload failed."
      );
    } finally {
      setUploading(null);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-slate-500">
            Loading Academics CMS...
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

          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Academics
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Manage the complete homepage Academics
            section, including the heading, school
            stages, senior secondary streams,
            resources and closing CTA.
          </p>
        </div>

        <button
          type="button"
          onClick={saveSettings}
          disabled={
            savingSettings
          }
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

          {savingSettings
            ? "Saving..."
            : "Save section"}
        </button>
      </div>

      {/* MESSAGE */}

      {message && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {message}
        </div>
      )}

      {/* VISIBILITY */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Homepage visibility
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Hide or show the entire Academics
              section.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              updateSetting(
                "is_active",
                !settings.is_active
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
                settings.is_active
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }
            `}
          >
            {settings.is_active ? (
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

      {/* HEADER */}

      <SettingsSection title="Academics header">
        <Field
          label="Section label"
          value={
            settings.section_label
          }
          onChange={(value) =>
            updateSetting(
              "section_label",
              value
            )
          }
        />

        <Field
          label="Heading line 1"
          value={
            settings.heading_line_1
          }
          onChange={(value) =>
            updateSetting(
              "heading_line_1",
              value
            )
          }
        />

        <Field
          label="Heading line 2"
          value={
            settings.heading_line_2
          }
          onChange={(value) =>
            updateSetting(
              "heading_line_2",
              value
            )
          }
        />

        <TextArea
          label="Description"
          value={
            settings.description
          }
          onChange={(value) =>
            updateSetting(
              "description",
              value
            )
          }
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Explore button label"
            value={
              settings.explore_button_label
            }
            onChange={(value) =>
              updateSetting(
                "explore_button_label",
                value
              )
            }
          />

          <Field
            label="Explore button URL"
            value={
              settings.explore_button_url
            }
            onChange={(value) =>
              updateSetting(
                "explore_button_url",
                value
              )
            }
          />
        </div>
      </SettingsSection>

      {/* STAGES */}

      <section>
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              School stages
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add, edit, reorder or hide academic
              stages shown on the homepage.
            </p>
          </div>

          <button
            type="button"
            onClick={addStage}
            className="
              inline-flex
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
            "
          >
            <Plus size={15} />
            Add stage
          </button>
        </div>

        <div className="space-y-5">
          {stages.map((stage) => (
            <StageEditor
              key={stage.id}
              stage={stage}
              uploading={
                uploading ===
                `stage-${stage.id}`
              }
              onChange={
                updateStage
              }
              onSave={
                saveStage
              }
              onDelete={
                deleteStage
              }
              onUpload={(file) =>
                uploadImage(
                  file,
                  "stage",
                  stage.id
                )
              }
            />
          ))}
        </div>
      </section>

      {/* SENIOR SECONDARY SETTINGS */}

      <SettingsSection title="Senior Secondary section">
        <Field
          label="Section label"
          value={
            settings.senior_secondary_label
          }
          onChange={(value) =>
            updateSetting(
              "senior_secondary_label",
              value
            )
          }
        />

        <Field
          label="Heading line 1"
          value={
            settings.senior_secondary_heading_line_1
          }
          onChange={(value) =>
            updateSetting(
              "senior_secondary_heading_line_1",
              value
            )
          }
        />

        <Field
          label="Heading line 2"
          value={
            settings.senior_secondary_heading_line_2
          }
          onChange={(value) =>
            updateSetting(
              "senior_secondary_heading_line_2",
              value
            )
          }
        />

        <TextArea
          label="Description"
          value={
            settings.senior_secondary_description
          }
          onChange={(value) =>
            updateSetting(
              "senior_secondary_description",
              value
            )
          }
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Default stream button label"
            value={
              settings.stream_button_label
            }
            onChange={(value) =>
              updateSetting(
                "stream_button_label",
                value
              )
            }
          />

          <Field
            label="Default stream button URL"
            value={
              settings.stream_button_url
            }
            onChange={(value) =>
              updateSetting(
                "stream_button_url",
                value
              )
            }
          />
        </div>
      </SettingsSection>

      {/* STREAM BACKGROUND PHOTOS */}

      <section className="space-y-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/45">
            Senior secondary / Stream backgrounds
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#102A56]">
            Change the photos behind Science, Commerce and Humanities
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            These are the background photographs displayed directly behind each senior-secondary stream card on the public Academics section. Upload a new photo here and it will replace that stream&apos;s background.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {streams.map((stream) => {
            const isUploading =
              uploading === `stream-${stream.id}`;

            return (
              <article
                key={`background-${stream.id}`}
                className="overflow-hidden rounded-2xl border border-[#102A56]/10 bg-white shadow-sm"
              >
                <div className="relative h-52 overflow-hidden bg-[#E9E2D5]">
                  {stream.image_url ? (
                    <img
                      src={stream.image_url}
                      alt={`${stream.title} background`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-sm text-slate-400">
                      No background photo
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071A38]/90 via-[#071A38]/35 to-transparent px-4 pb-4 pt-12">
                    <p className="text-lg font-semibold !text-white">
                      {stream.title}
                    </p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.18em] !text-white/55">
                      Stream background
                    </p>
                  </div>
                </div>

                <div className="p-4">
                  <label
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#102A56] px-4 py-3 text-sm font-semibold !text-[#F5F0E6] transition hover:opacity-90 ${
                      isUploading
                        ? "pointer-events-none opacity-60"
                        : ""
                    }`}
                  >
                    <Upload size={15} className="!text-[#F5F0E6]" />
                    <span className="!text-[#F5F0E6]">
                      {isUploading
                        ? "Uploading..."
                        : "Change background photo"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isUploading}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        event.target.value = "";
                        if (file) {
                          void uploadImage(
                            file,
                            "stream",
                            stream.id
                          );
                        }
                      }}
                    />
                  </label>

                  <div className="mt-3">
                    <Field
                      label="Background image URL"
                      value={stream.image_url}
                      onChange={(value) =>
                        updateStream(
                          stream.id,
                          "image_url",
                          value
                        )
                      }
                      placeholder="https://..."
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => void saveStream(stream)}
                    disabled={isUploading}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#102A56]/10 bg-[#F5F0E6] px-4 py-3 text-sm font-semibold !text-[#102A56] transition hover:bg-[#E9E2D5] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save size={14} className="!text-[#102A56]" />
                    <span className="!text-[#102A56]">Save background</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* STREAMS */}

      <section>
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Academic streams
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage Science, Commerce, Humanities
              and additional streams.
            </p>
          </div>

          <button
            type="button"
            onClick={addStream}
            className="
              inline-flex
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
            "
          >
            <Plus size={15} />
            Add stream
          </button>
        </div>

        <div className="space-y-5">
          {streams.map((stream) => (
            <StreamEditor
              key={stream.id}
              stream={stream}
              uploading={
                uploading ===
                `stream-${stream.id}`
              }
              onChange={
                updateStream
              }
              onSave={
                saveStream
              }
              onDelete={
                deleteStream
              }
              onUpload={(file) =>
                uploadImage(
                  file,
                  "stream",
                  stream.id
                )
              }
            />
          ))}
        </div>
      </section>

      {/* RESOURCES */}

      <SettingsSection title="Academic resources">
        <Field
          label="Resource label"
          value={
            settings.resource_label
          }
          onChange={(value) =>
            updateSetting(
              "resource_label",
              value
            )
          }
        />

        <div className="grid gap-5 lg:grid-cols-3">
          <ResourceEditor
            title={
              settings.syllabus_title
            }
            buttonLabel={
              settings.syllabus_button_label
            }
            buttonUrl={
              settings.syllabus_button_url
            }
            onTitle={(value) =>
              updateSetting(
                "syllabus_title",
                value
              )
            }
            onButtonLabel={(value) =>
              updateSetting(
                "syllabus_button_label",
                value
              )
            }
            onButtonUrl={(value) =>
              updateSetting(
                "syllabus_button_url",
                value
              )
            }
          />

          <ResourceEditor
            title={
              settings.datesheet_title
            }
            buttonLabel={
              settings.datesheet_button_label
            }
            buttonUrl={
              settings.datesheet_button_url
            }
            onTitle={(value) =>
              updateSetting(
                "datesheet_title",
                value
              )
            }
            onButtonLabel={(value) =>
              updateSetting(
                "datesheet_button_label",
                value
              )
            }
            onButtonUrl={(value) =>
              updateSetting(
                "datesheet_button_url",
                value
              )
            }
          />

          <ResourceEditor
            title={
              settings.faculty_title
            }
            buttonLabel={
              settings.faculty_button_label
            }
            buttonUrl={
              settings.faculty_button_url
            }
            onTitle={(value) =>
              updateSetting(
                "faculty_title",
                value
              )
            }
            onButtonLabel={(value) =>
              updateSetting(
                "faculty_button_label",
                value
              )
            }
            onButtonUrl={(value) =>
              updateSetting(
                "faculty_button_url",
                value
              )
            }
          />
        </div>
      </SettingsSection>

      {/* CLOSING */}

      <SettingsSection title="Closing CTA">
        <Field
          label="Closing label"
          value={
            settings.closing_label
          }
          onChange={(value) =>
            updateSetting(
              "closing_label",
              value
            )
          }
        />

        <Field
          label="Heading line 1"
          value={
            settings.closing_heading_line_1
          }
          onChange={(value) =>
            updateSetting(
              "closing_heading_line_1",
              value
            )
          }
        />

        <TextArea
          label="Heading line 2"
          value={
            settings.closing_heading_line_2
          }
          onChange={(value) =>
            updateSetting(
              "closing_heading_line_2",
              value
            )
          }
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Button label"
            value={
              settings.closing_button_label
            }
            onChange={(value) =>
              updateSetting(
                "closing_button_label",
                value
              )
            }
          />

          <Field
            label="Button URL"
            value={
              settings.closing_button_url
            }
            onChange={(value) =>
              updateSetting(
                "closing_button_url",
                value
              )
            }
          />
        </div>

        <button
          type="button"
          onClick={saveSettings}
          disabled={
            savingSettings
          }
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-[#102A56]
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            disabled:opacity-50
          "
        >
          <Save size={15} />

          {savingSettings
            ? "Saving..."
            : "Save Academics"}
        </button>
      </SettingsSection>

    </div>
  );
}

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        {title}
      </h2>

      <div className="space-y-5">
        {children}
      </div>
    </section>
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
}: {
  label: string;
  value: string | null | undefined;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <textarea
        value={value ?? ""}
        rows={4}
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
          focus:border-[#102A56]
          focus:ring-2
          focus:ring-[#102A56]/10
        "
      />
    </label>
  );
}

function StageEditor({
  stage,
  uploading,
  onChange,
  onSave,
  onDelete,
  onUpload,
}: {
  stage: Stage;
  uploading: boolean;

  onChange: (
    id: string,
    field: keyof Stage,
    value:
      | string
      | number
      | boolean
  ) => void;

  onSave: (
    stage: Stage
  ) => void;

  onDelete: (
    id: string
  ) => void;

  onUpload: (
    file: File
  ) => void;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">

        {/* IMAGE */}

        <div>
          <div className="overflow-hidden rounded-xl bg-slate-100">
            {stage.image_url ? (
              <img
                src={
                  stage.image_url
                }
                alt={
                  stage.title ||
                  "Academic stage"
                }
                className="h-56 w-full object-cover"
              />
            ) : (
              <div className="flex h-56 items-center justify-center text-sm text-slate-400">
                No image
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
            <Upload size={15} />

            {uploading
              ? "Uploading..."
              : "Upload image"}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(event) => {
                const file =
                  event.target.files?.[0];

                if (file) {
                  onUpload(file);
                }

                event.target.value =
                  "";
              }}
            />
          </label>
        </div>

        {/* FIELDS */}

        <div className="grid gap-4 md:grid-cols-2">

          <Field
            label="Database number"
            value={String(
              stage.number
            )}
            onChange={(value) =>
              onChange(
                stage.id,
                "number",
                Number(value) || 1
              )
            }
          />

          <Field
            label="Display number"
            value={
              stage.display_number
            }
            onChange={(value) =>
              onChange(
                stage.id,
                "display_number",
                value
              )
            }
            placeholder="01"
          />

          <Field
            label="Title"
            value={
              stage.title
            }
            onChange={(value) =>
              onChange(
                stage.id,
                "title",
                value
              )
            }
          />

          <Field
            label="Classes"
            value={
              stage.classes
            }
            onChange={(value) =>
              onChange(
                stage.id,
                "classes",
                value
              )
            }
            placeholder="Classes I – V"
          />

          <Field
            label="Icon"
            value={
              stage.icon_name
            }
            onChange={(value) =>
              onChange(
                stage.id,
                "icon_name",
                value
              )
            }
            placeholder="BookOpen"
          />

          <Field
            label="Card size"
            value={
              stage.card_size
            }
            onChange={(value) =>
              onChange(
                stage.id,
                "card_size",
                value
              )
            }
            placeholder="large / small"
          />

          <Field
            label="Button label"
            value={
              stage.button_label
            }
            onChange={(value) =>
              onChange(
                stage.id,
                "button_label",
                value
              )
            }
          />

          <Field
            label="Button URL"
            value={
              stage.button_url
            }
            onChange={(value) =>
              onChange(
                stage.id,
                "button_url",
                value
              )
            }
          />

          <Field
            label="Image URL"
            value={
              stage.image_url
            }
            onChange={(value) =>
              onChange(
                stage.id,
                "image_url",
                value
              )
            }
          />

          <Field
            label="Sort order"
            value={String(
              stage.sort_order
            )}
            onChange={(value) =>
              onChange(
                stage.id,
                "sort_order",
                Number(value) || 1
              )
            }
          />

          <div className="md:col-span-2">
            <TextArea
              label="Description"
              value={
                stage.description
              }
              onChange={(value) =>
                onChange(
                  stage.id,
                  "description",
                  value
                )
              }
            />
          </div>

          <div className="flex items-center">
            <button
              type="button"
              onClick={() =>
                onChange(
                  stage.id,
                  "is_active",
                  !stage.is_active
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
                  stage.is_active
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }
              `}
            >
              {stage.is_active ? (
                <>
                  <Eye
                    size={14}
                  />
                  Published
                </>
              ) : (
                <>
                  <EyeOff
                    size={14}
                  />
                  Hidden
                </>
              )}
            </button>
          </div>

          <div className="flex justify-end gap-2 md:col-span-2">

            <button
              type="button"
              onClick={() =>
                onDelete(
                  stage.id
                )
              }
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-red-200
                px-4
                py-2.5
                text-sm
                font-semibold
                text-red-600
                hover:bg-red-50
              "
            >
              <Trash2 size={14} />
              Delete
            </button>

            <button
              type="button"
              onClick={() =>
                onSave(stage)
              }
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-[#102A56]
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                hover:opacity-90
              "
            >
              <Save size={14} />
              Save stage
            </button>

          </div>
        </div>
      </div>
    </article>
  );
}

function StreamEditor({
  stream,
  uploading,
  onChange,
  onSave,
  onDelete,
  onUpload,
}: {
  stream: Stream;
  uploading: boolean;

  onChange: (
    id: string,
    field: keyof Stream,
    value:
      | string
      | number
      | boolean
  ) => void;

  onSave: (
    stream: Stream
  ) => void;

  onDelete: (
    id: string
  ) => void;

  onUpload: (
    file: File
  ) => void;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">

        {/* IMAGE */}

        <div>
          <div className="overflow-hidden rounded-xl bg-slate-100">
            {stream.image_url ? (
              <img
                src={
                  stream.image_url
                }
                alt={
                  stream.title ||
                  "Academic stream"
                }
                className="h-52 w-full object-cover"
              />
            ) : (
              <div className="flex h-52 items-center justify-center text-sm text-slate-400">
                No image
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
            <Upload size={15} />

            {uploading
              ? "Uploading..."
              : "Upload image"}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(event) => {
                const file =
                  event.target.files?.[0];

                if (file) {
                  onUpload(file);
                }

                event.target.value =
                  "";
              }}
            />
          </label>
        </div>

        {/* FIELDS */}

        <div className="grid gap-4 md:grid-cols-2">

          <Field
            label="Title"
            value={
              stream.title
            }
            onChange={(value) =>
              onChange(
                stream.id,
                "title",
                value
              )
            }
          />

          <Field
            label="Subjects"
            value={
              stream.subjects
            }
            onChange={(value) =>
              onChange(
                stream.id,
                "subjects",
                value
              )
            }
          />

          <Field
            label="Icon"
            value={
              stream.icon_name
            }
            onChange={(value) =>
              onChange(
                stream.id,
                "icon_name",
                value
              )
            }
            placeholder="FlaskConical"
          />

          <Field
            label="Button label"
            value={
              stream.button_label
            }
            onChange={(value) =>
              onChange(
                stream.id,
                "button_label",
                value
              )
            }
          />

          <Field
            label="Button URL"
            value={
              stream.button_url
            }
            onChange={(value) =>
              onChange(
                stream.id,
                "button_url",
                value
              )
            }
          />

          <Field
            label="Image URL"
            value={
              stream.image_url
            }
            onChange={(value) =>
              onChange(
                stream.id,
                "image_url",
                value
              )
            }
          />

          <Field
            label="Sort order"
            value={String(
              stream.sort_order
            )}
            onChange={(value) =>
              onChange(
                stream.id,
                "sort_order",
                Number(value) || 1
              )
            }
          />

          <div className="md:col-span-2">
            <TextArea
              label="Description"
              value={
                stream.description
              }
              onChange={(value) =>
                onChange(
                  stream.id,
                  "description",
                  value
                )
              }
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() =>
                onChange(
                  stream.id,
                  "is_active",
                  !stream.is_active
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
                  stream.is_active
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }
              `}
            >
              {stream.is_active ? (
                <>
                  <Eye
                    size={14}
                  />
                  Published
                </>
              ) : (
                <>
                  <EyeOff
                    size={14}
                  />
                  Hidden
                </>
              )}
            </button>
          </div>

          <div className="flex justify-end gap-2 md:col-span-2">

            <button
              type="button"
              onClick={() =>
                onDelete(
                  stream.id
                )
              }
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-red-200
                px-4
                py-2.5
                text-sm
                font-semibold
                text-red-600
                hover:bg-red-50
              "
            >
              <Trash2 size={14} />
              Delete
            </button>

            <button
              type="button"
              onClick={() =>
                onSave(stream)
              }
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-[#102A56]
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                hover:opacity-90
              "
            >
              <Save size={14} />
              Save stream
            </button>

          </div>
        </div>
      </div>
    </article>
  );
}

function ResourceEditor({
  title,
  buttonLabel,
  buttonUrl,
  onTitle,
  onButtonLabel,
  onButtonUrl,
}: {
  title: string;
  buttonLabel: string;
  buttonUrl: string;

  onTitle: (
    value: string
  ) => void;

  onButtonLabel: (
    value: string
  ) => void;

  onButtonUrl: (
    value: string
  ) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

      <Field
        label="Title"
        value={title}
        onChange={onTitle}
      />

      <div className="mt-4">
        <Field
          label="Button label"
          value={buttonLabel}
          onChange={
            onButtonLabel
          }
        />
      </div>

      <div className="mt-4">
        <Field
          label="Button URL"
          value={buttonUrl}
          onChange={
            onButtonUrl
          }
        />
      </div>

    </div>
  );
}