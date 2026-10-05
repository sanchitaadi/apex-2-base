"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  Check,
  ExternalLink,
  Loader2,
  Save,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type AdmissionSettings = {
  id?: string;

  session_year: string;
  status: string;

  headline: string;
  description: string;

  classes_open: string;
  class_xi_status: string;

  application_url: string;
  admission_notice_url: string;
  fee_structure_url: string;
  admission_criteria_url: string;

  important_dates: string;

  phone: string;
  email: string;

  is_active: boolean;
};

const defaults: AdmissionSettings = {
  session_year: "2026-2027",

  status: "Admissions Open",

  headline:
    "Begin your journey at Apex.",

  description:
    "Admissions are currently open for the 2026–2027 academic session.",

  classes_open:
    "Classes I – IX",

  class_xi_status:
    "Class XI dates will be announced later.",

  application_url:
    "/admissions",

  admission_notice_url:
    "/admission-notice",

  fee_structure_url:
    "/fee-structure",

  admission_criteria_url:
    "/admission-criteria",

  important_dates:
    "Classes I–IX: Admissions Open. Class XI: Dates to be announced. Direct admission to X & XII is subject to prior CBSE approval.",

  phone:
    "09990061747",

  email:
    "contacts.apexschool@gmail.com",

  is_active: true,
};

export default function AdmissionsAdminPage() {
  const [form, setForm] =
    useState<AdmissionSettings>(
      defaults
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    setError("");

    const { data, error } =
      await supabase
        .from("admission_settings")
        .select("*")
        .eq("is_active", true)
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

    if (error) {
      console.error(error);

      setError(error.message);
    } else if (data) {
      setForm({
        ...defaults,
        ...(data as Partial<AdmissionSettings>),
      });
    }

    setLoading(false);
  }

  function updateField(
    field: keyof AdmissionSettings,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveSettings(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        session_year:
          form.session_year.trim(),

        status:
          form.status.trim(),

        headline:
          form.headline.trim(),

        description:
          form.description.trim(),

        classes_open:
          form.classes_open.trim(),

        class_xi_status:
          form.class_xi_status.trim(),

        application_url:
          form.application_url.trim(),

        admission_notice_url:
          form.admission_notice_url.trim(),

        fee_structure_url:
          form.fee_structure_url.trim(),

        admission_criteria_url:
          form.admission_criteria_url.trim(),

        important_dates:
          form.important_dates.trim(),

        phone:
          form.phone.trim(),

        email:
          form.email.trim(),

        is_active:
          form.is_active,

        updated_at:
          new Date().toISOString(),
      };

      if (form.id) {
        const { error } =
          await supabase
            .from("admission_settings")
            .update(payload)
            .eq("id", form.id);

        if (error) {
          throw error;
        }
      } else {
        const { data, error } =
          await supabase
            .from("admission_settings")
            .insert(payload)
            .select()
            .single();

        if (error) {
          throw error;
        }

        if (data) {
          setForm({
            ...defaults,
            ...(data as Partial<AdmissionSettings>),
          });
        }
      }

      await loadSettings();

      setMessage(
        "Admission settings saved successfully."
      );
    } catch (saveError: any) {
      console.error(saveError);

      setError(
        saveError?.message ||
          "Could not save admission settings."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#071A38] text-white">

        <div className="flex items-center gap-3 text-sm text-white/45">

          <Loader2
            size={18}
            className="animate-spin"
          />

          Loading Admissions CMS...

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#071A38] text-white">

      {/* HEADER */}

      <div className="border-b border-white/10 bg-[#0B2146]">

        <div className="mx-auto max-w-[1200px] px-6 py-6 md:px-10">

          <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">
            Apex CMS
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
            Admissions Management
          </h1>

          <p className="mt-2 text-sm text-white/35">
            Control all public admission information from
            one place.
          </p>

        </div>

      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-10 md:px-10">

        {message && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">

            <Check size={16} />

            {message}

          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <form
          onSubmit={saveSettings}
          className="space-y-6"
        >

          {/* STATUS */}

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">

            <p className="text-[9px] uppercase tracking-[0.28em] text-white/30">
              Admission status
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Current admission cycle
            </h2>

            <div className="mt-7 grid gap-5 md:grid-cols-2">

              <Field
                label="Session"
                value={
                  form.session_year
                }
                onChange={(value) =>
                  updateField(
                    "session_year",
                    value
                  )
                }
              />

              <Field
                label="Status"
                value={
                  form.status
                }
                onChange={(value) =>
                  updateField(
                    "status",
                    value
                  )
                }
              />

            </div>

          </section>

          {/* MAIN CONTENT */}

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">

            <p className="text-[9px] uppercase tracking-[0.28em] text-white/30">
              Public content
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Admission messaging
            </h2>

            <div className="mt-7 space-y-5">

              <Field
                label="Headline"
                value={
                  form.headline
                }
                onChange={(value) =>
                  updateField(
                    "headline",
                    value
                  )
                }
              />

              <Field
                label="Description"
                textarea
                rows={5}
                value={
                  form.description
                }
                onChange={(value) =>
                  updateField(
                    "description",
                    value
                  )
                }
              />

            </div>

          </section>

          {/* CLASSES */}

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">

            <p className="text-[9px] uppercase tracking-[0.28em] text-white/30">
              Eligibility / classes
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Classes currently open
            </h2>

            <div className="mt-7 space-y-5">

              <Field
                label="Classes open"
                value={
                  form.classes_open
                }
                onChange={(value) =>
                  updateField(
                    "classes_open",
                    value
                  )
                }
              />

              <Field
                label="Class XI status"
                textarea
                rows={3}
                value={
                  form.class_xi_status
                }
                onChange={(value) =>
                  updateField(
                    "class_xi_status",
                    value
                  )
                }
              />

              <Field
                label="Important dates / conditions"
                textarea
                rows={5}
                value={
                  form.important_dates
                }
                onChange={(value) =>
                  updateField(
                    "important_dates",
                    value
                  )
                }
              />

            </div>

          </section>

          {/* LINKS */}

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">

            <p className="text-[9px] uppercase tracking-[0.28em] text-white/30">
              Links
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Admission resources
            </h2>

            <div className="mt-7 space-y-5">

              <Field
                label="Application URL"
                value={
                  form.application_url
                }
                onChange={(value) =>
                  updateField(
                    "application_url",
                    value
                  )
                }
              />

              <Field
                label="Admission notice URL"
                value={
                  form.admission_notice_url
                }
                onChange={(value) =>
                  updateField(
                    "admission_notice_url",
                    value
                  )
                }
              />

              <Field
                label="Fee structure URL"
                value={
                  form.fee_structure_url
                }
                onChange={(value) =>
                  updateField(
                    "fee_structure_url",
                    value
                  )
                }
              />

              <Field
                label="Admission criteria URL"
                value={
                  form.admission_criteria_url
                }
                onChange={(value) =>
                  updateField(
                    "admission_criteria_url",
                    value
                  )
                }
              />

            </div>

          </section>

          {/* CONTACT */}

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">

            <p className="text-[9px] uppercase tracking-[0.28em] text-white/30">
              Admission contact
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Contact details
            </h2>

            <div className="mt-7 grid gap-5 md:grid-cols-2">

              <Field
                label="Phone"
                value={
                  form.phone
                }
                onChange={(value) =>
                  updateField(
                    "phone",
                    value
                  )
                }
              />

              <Field
                label="Email"
                value={
                  form.email
                }
                onChange={(value) =>
                  updateField(
                    "email",
                    value
                  )
                }
              />

            </div>

          </section>

          {/* PUBLISH */}

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">

            <button
              type="button"
              onClick={() =>
                updateField(
                  "is_active",
                  !form.is_active
                )
              }
              className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4 text-left"
            >

              <div>

                <p className="text-sm font-medium">
                  Publish admissions
                </p>

                <p className="mt-1 text-xs text-white/30">
                  Show the current admission cycle on
                  the public website.
                </p>

              </div>

              <span
                className={`h-3 w-3 rounded-full ${
                  form.is_active
                    ? "bg-emerald-300"
                    : "bg-white/20"
                }`}
              />

            </button>

          </section>

          {/* SAVE */}

          <div className="flex justify-end pb-12">

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-[#F5F0E6] px-7 py-3.5 text-sm font-semibold text-[#102A56] transition hover:bg-white disabled:opacity-50"
            >

              {saving ? (
                <>
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={15} />
                  Save admissions
                </>
              )}

            </button>

          </div>

        </form>

      </div>

    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea = false,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  rows?: number;
}) {
  const classes = `
    mt-3
    w-full
    rounded-xl
    border
    border-white/10
    bg-white/[0.035]
    px-4
    py-3.5
    text-sm
    leading-6
    text-white
    outline-none
    placeholder:text-white/20
    focus:border-white/25
  `;

  return (
    <div>

      <label className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
        {label}
      </label>

      {textarea ? (
        <textarea
          rows={rows}
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className={`${classes} resize-y`}
        />
      ) : (
        <input
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className={classes}
        />
      )}

    </div>
  );
}