"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Loader2,
  Save,
  ShieldCheck,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type Settings = {
  id: string;
  session: string;
  is_open: boolean;
  title: string;
  description: string | null;
  instructions: string | null;
  application_success_message: string;
  open_classes: string[];
  class_xi_enabled: boolean;
  class_xi_streams: string[];
};

const CLASS_OPTIONS = [
  "Class I",
  "Class II",
  "Class III",
  "Class IV",
  "Class V",
  "Class VI",
  "Class VII",
  "Class VIII",
  "Class IX",
];

const STREAM_OPTIONS = [
  "Science",
  "Commerce",
  "Humanities",
];

export default function AdmissionRegistrationSettingsPage() {
  const [settings, setSettings] =
    useState<Settings | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function load() {
      const {
        data,
        error: loadError,
      } = await supabase
        .from(
          "admission_registration_settings"
        )
        .select("*")
        .limit(1)
        .maybeSingle();

      if (loadError) {
        setError(
          loadError.message
        );
      } else if (data) {
        setSettings(
          data as Settings
        );
      }

      setLoading(false);
    }

    load();
  }, []);

  function toggleClass(
    className: string
  ) {
    if (!settings) return;

    const current =
      Array.isArray(
        settings.open_classes
      )
        ? settings.open_classes
        : [];

    const exists =
      current.includes(
        className
      );

    setSettings({
      ...settings,
      open_classes: exists
        ? current.filter(
            (item) =>
              item !==
              className
          )
        : [
            ...current,
            className,
          ],
    });
  }

  function toggleStream(
    stream: string
  ) {
    if (!settings) return;

    const current =
      Array.isArray(
        settings.class_xi_streams
      )
        ? settings.class_xi_streams
        : [];

    const exists =
      current.includes(
        stream
      );

    setSettings({
      ...settings,
      class_xi_streams: exists
        ? current.filter(
            (item) =>
              item !==
              stream
          )
        : [
            ...current,
            stream,
          ],
    });
  }

  async function save() {
    if (!settings) return;

    setSaving(true);
    setError("");
    setMessage("");

    const {
      error: updateError,
    } = await supabase
      .from(
        "admission_registration_settings"
      )
      .update({
        session:
          settings.session.trim(),

        is_open:
          settings.is_open,

        title:
          settings.title.trim(),

        description:
          settings.description?.trim() ||
          null,

        instructions:
          settings.instructions?.trim() ||
          null,

        application_success_message:
          settings.application_success_message.trim(),

        open_classes:
          settings.open_classes,

        class_xi_enabled:
          settings.class_xi_enabled,

        class_xi_streams:
          settings.class_xi_streams,

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        settings.id
      );

    if (updateError) {
      setError(
        updateError.message
      );
    } else {
      setMessage(
        "Registration settings saved successfully."
      );
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#F4F1EA]">
        <Loader2
          size={28}
          className="animate-spin text-[#102A56]"
        />
      </main>
    );
  }

  if (!settings) {
    return (
      <main className="p-8">
        Registration settings were not found.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F1EA] px-5 py-8 text-[#10203A] md:px-8">

      <div className="mx-auto max-w-[1200px]">

        <div>

          <div className="flex items-center gap-3">

            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#102A56] text-white">
              <ShieldCheck size={18} />
            </div>

            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#102A56]/35">
                Apex CMS
              </p>

              <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#102A56]/25">
                Admission settings
              </p>

            </div>

          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[#102A56] md:text-4xl">
            Online Registration Settings
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#10203A]/50">
            Control the admission registration form without changing
            website code.
          </p>

        </div>

        {message && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
            <Check size={17} />
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="mt-8 rounded-[2rem] bg-white p-6 md:p-8">

          <div className="grid gap-5 md:grid-cols-2">

            <Field
              label="Academic session"
              value={
                settings.session
              }
              onChange={(value) =>
                setSettings({
                  ...settings,
                  session:
                    value,
                })
              }
            />

            <Field
              label="Registration title"
              value={
                settings.title
              }
              onChange={(value) =>
                setSettings({
                  ...settings,
                  title:
                    value,
                })
              }
            />

          </div>

          <TextArea
            label="Description"
            value={
              settings.description ||
              ""
            }
            onChange={(value) =>
              setSettings({
                ...settings,
                description:
                  value,
              })
            }
          />

          <TextArea
            label="Instructions"
            value={
              settings.instructions ||
              ""
            }
            onChange={(value) =>
              setSettings({
                ...settings,
                instructions:
                  value,
              })
            }
          />

          <TextArea
            label="Success message"
            value={
              settings.application_success_message
            }
            onChange={(value) =>
              setSettings({
                ...settings,
                application_success_message:
                  value,
              })
            }
          />

          {/* OPEN / CLOSE */}

          <div className="mt-7 rounded-2xl bg-[#F4F1EA] p-5">

            <div className="flex items-center justify-between gap-4">

              <div>

                <p className="text-sm font-semibold text-[#102A56]">
                  Registration status
                </p>

                <p className="mt-1 text-xs text-[#10203A]/40">
                  Turn online applications on or off.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSettings({
                    ...settings,
                    is_open:
                      !settings.is_open,
                  })
                }
                className={
                  settings.is_open
                    ? "rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white"
                    : "rounded-full bg-[#102A56] px-5 py-2.5 text-xs font-semibold text-white"
                }
              >
                {settings.is_open
                  ? "Open"
                  : "Closed"}
              </button>

            </div>

          </div>

          {/* CLASSES */}

          <div className="mt-8">

            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#102A56]/35">
              Classes open for registration
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">

              {CLASS_OPTIONS.map(
                (className) => {

                  const active =
                    settings.open_classes.includes(
                      className
                    );

                  return (
                    <button
                      type="button"
                      key={
                        className
                      }
                      onClick={() =>
                        toggleClass(
                          className
                        )
                      }
                      className={
                        active
                          ? "rounded-2xl bg-[#102A56] px-4 py-4 text-left text-sm font-semibold text-white"
                          : "rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-4 text-left text-sm text-[#10203A]/45"
                      }
                    >
                      {className}
                    </button>
                  );
                }
              )}

            </div>

          </div>

          {/* CLASS XI */}

          <div className="mt-8 rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] p-5">

            <div className="flex items-center justify-between gap-4">

              <div>

                <p className="text-sm font-semibold text-[#102A56]">
                  Enable Class XI
                </p>

                <p className="mt-1 text-xs text-[#10203A]/40">
                  Show Class XI and stream selection on the public form.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSettings({
                    ...settings,
                    class_xi_enabled:
                      !settings.class_xi_enabled,
                  })
                }
                className={
                  settings.class_xi_enabled
                    ? "rounded-full bg-[#102A56] px-5 py-2.5 text-xs font-semibold text-white"
                    : "rounded-full bg-[#102A56]/10 px-5 py-2.5 text-xs font-semibold text-[#102A56]"
                }
              >
                {settings.class_xi_enabled
                  ? "Enabled"
                  : "Disabled"}
              </button>

            </div>

            {settings.class_xi_enabled && (
              <div className="mt-5 grid gap-3 sm:grid-cols-3">

                {STREAM_OPTIONS.map(
                  (stream) => {

                    const active =
                      settings.class_xi_streams.includes(
                        stream
                      );

                    return (
                      <button
                        type="button"
                        key={stream}
                        onClick={() =>
                          toggleStream(
                            stream
                          )
                        }
                        className={
                          active
                            ? "rounded-2xl bg-[#102A56] px-4 py-4 text-left text-sm font-semibold text-white"
                            : "rounded-2xl border border-[#102A56]/10 bg-white px-4 py-4 text-left text-sm text-[#10203A]/45"
                        }
                      >
                        {stream}
                      </button>
                    );
                  }
                )}

              </div>
            )}

          </div>

          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#102A56] px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-50"
          >

            {saving ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : (
              <Save size={16} />
            )}

            {saving
              ? "Saving..."
              : "Save settings"}

          </button>

        </section>

      </div>

    </main>
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

      <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="mt-3 w-full rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3.5 text-sm outline-none"
      />

    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-5">

      <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        rows={4}
        className="mt-3 w-full resize-y rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3.5 text-sm leading-6 outline-none"
      />

    </div>
  );
}