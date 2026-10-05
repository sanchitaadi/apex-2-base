"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileText,
  GraduationCap,
  Loader2,
  Upload,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type RegistrationSettings = {
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

type ApplicationForm = {
  studentName: string;
  dateOfBirth: string;
  gender: string;

  classApplyingFor: string;
  stream: string;

  previousSchool: string;
  previousClass: string;
  previousResult: string;

  fatherName: string;
  motherName: string;
  guardianName: string;

  parentMobile: string;
  parentEmail: string;

  address: string;
  city: string;
  state: string;
  pincode: string;

  declarationAccepted: boolean;
};

const INITIAL_FORM: ApplicationForm = {
  studentName: "",
  dateOfBirth: "",
  gender: "",

  classApplyingFor: "",
  stream: "",

  previousSchool: "",
  previousClass: "",
  previousResult: "",

  fatherName: "",
  motherName: "",
  guardianName: "",

  parentMobile: "",
  parentEmail: "",

  address: "",
  city: "",
  state: "Delhi",
  pincode: "",

  declarationAccepted: false,
};

export default function OnlineRegistrationPage() {
  const [settings, setSettings] =
    useState<RegistrationSettings | null>(null);

  const [form, setForm] =
    useState<ApplicationForm>(INITIAL_FORM);

  const [photograph, setPhotograph] =
    useState<File | null>(null);

  const [marksheet, setMarksheet] =
    useState<File | null>(null);

  const [birthCertificate, setBirthCertificate] =
    useState<File | null>(null);

  const [otherDocuments, setOtherDocuments] =
    useState<File[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [applicationNumber, setApplicationNumber] =
    useState("");

  useEffect(() => {
    async function loadSettings() {
      const { data } =
        await supabase
          .from(
            "admission_registration_settings"
          )
          .select("*")
          .limit(1)
          .maybeSingle();

      if (data) {
        setSettings(
          data as RegistrationSettings
        );
      }

      setLoading(false);
    }

    loadSettings();
  }, []);

  function update(
    field: keyof ApplicationForm,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function validateFile(
    file: File | null,
    image = false
  ) {
    if (!file) return true;

    if (image) {
      if (!file.type.startsWith("image/")) {
        setError(
          "Please upload a valid image file."
        );
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError(
          "Photo must be smaller than 5 MB."
        );
        return false;
      }

      return true;
    }

    const validPdf =
      file.type === "application/pdf" ||
      file.name
        .toLowerCase()
        .endsWith(".pdf");

    if (!validPdf) {
      setError(
        "Only PDF documents are allowed."
      );
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(
        "PDF must be smaller than 10 MB."
      );
      return false;
    }

    return true;
  }

  function generateApplicationNumber() {
    const random =
      Math.floor(
        100000 +
          Math.random() *
            900000
      );

    return `APS-${new Date().getFullYear()}-${random}`;
  }

  async function uploadFile(
    file: File,
    applicationId: string,
    folder: string
  ) {
    const safeName =
      file.name
        .replace(
          /[^a-zA-Z0-9._-]/g,
          "-"
        )
        .toLowerCase();

    const path =
      `${applicationId}/${folder}/${Date.now()}-${safeName}`;

    const {
      error: uploadError,
    } = await supabase.storage
      .from(
        "admission-applications"
      )
      .upload(
        path,
        file,
        {
          upsert: false,
          cacheControl: "3600",
        }
      );

    if (uploadError) {
      throw uploadError;
    }

    return path;
  }

  async function submitApplication() {
    setError("");
    setSuccess("");

    if (!settings?.is_open) {
      setError(
        "Online registration is currently closed."
      );
      return;
    }

    if (!form.studentName.trim()) {
      setError(
        "Please enter the student's name."
      );
      return;
    }

    if (!form.classApplyingFor) {
      setError(
        "Please select the class."
      );
      return;
    }

    if (!form.parentMobile.trim()) {
      setError(
        "Please enter a parent mobile number."
      );
      return;
    }

    if (
      form.parentEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.parentEmail
      )
    ) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    if (
      !form.declarationAccepted
    ) {
      setError(
        "Please accept the declaration."
      );
      return;
    }

    if (
      !validateFile(
        photograph,
        true
      )
    ) {
      return;
    }

    if (
      !validateFile(
        marksheet,
        false
      )
    ) {
      return;
    }

    if (
      !validateFile(
        birthCertificate,
        false
      )
    ) {
      return;
    }

    for (
      const file of otherDocuments
    ) {
      if (
        !validateFile(
          file,
          false
        )
      ) {
        return;
      }
    }

    setSubmitting(true);

    const applicationNumber =
      generateApplicationNumber();

    try {
      /*
      ========================================================
      CREATE APPLICATION
      ========================================================
      */

      const {
        data: application,
        error: insertError,
      } = await supabase
        .from(
          "admission_applications"
        )
        .insert({
          application_number:
            applicationNumber,

          session:
            settings.session,

          status:
            "new",

          student_name:
            form.studentName.trim(),

          date_of_birth:
            form.dateOfBirth ||
            null,

          gender:
            form.gender ||
            null,

          class_applying_for:
            form.classApplyingFor,

          stream:
            form.stream ||
            null,

          previous_school:
            form.previousSchool.trim() ||
            null,

          previous_class:
            form.previousClass.trim() ||
            null,

          previous_result:
            form.previousResult.trim() ||
            null,

          father_name:
            form.fatherName.trim() ||
            null,

          mother_name:
            form.motherName.trim() ||
            null,

          guardian_name:
            form.guardianName.trim() ||
            null,

          parent_mobile:
            form.parentMobile.trim(),

          parent_email:
            form.parentEmail.trim() ||
            null,

          address:
            form.address.trim() ||
            null,

          city:
            form.city.trim() ||
            null,

          state:
            form.state.trim() ||
            null,

          pincode:
            form.pincode.trim() ||
            null,

          declaration_accepted:
            true,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      if (!application) {
        throw new Error(
          "Application could not be created."
        );
      }

      const applicationId =
        application.id;

      let photographPath:
        | string
        | null = null;

      let marksheetPath:
        | string
        | null = null;

      let birthCertificatePath:
        | string
        | null = null;

      const otherPaths: string[] = [];

      /*
      ========================================================
      UPLOAD PHOTO
      ========================================================
      */

      if (photograph) {
        photographPath =
          await uploadFile(
            photograph,
            applicationId,
            "photograph"
          );
      }

      /*
      ========================================================
      UPLOAD MARKSHEET
      ========================================================
      */

      if (marksheet) {
        marksheetPath =
          await uploadFile(
            marksheet,
            applicationId,
            "marksheet"
          );
      }

      /*
      ========================================================
      BIRTH CERTIFICATE
      ========================================================
      */

      if (birthCertificate) {
        birthCertificatePath =
          await uploadFile(
            birthCertificate,
            applicationId,
            "birth-certificate"
          );
      }

      /*
      ========================================================
      OTHER DOCUMENTS
      ========================================================
      */

      for (
        const file of otherDocuments
      ) {
        const path =
          await uploadFile(
            file,
            applicationId,
            "other"
          );

        otherPaths.push(path);
      }

      /*
      ========================================================
      SAVE FILE PATHS
      ========================================================
      */

      const {
        error: updateError,
      } = await supabase
        .from(
          "admission_applications"
        )
        .update({
          photograph_path:
            photographPath,

          marksheet_path:
            marksheetPath,

          birth_certificate_path:
            birthCertificatePath,

          other_document_paths:
            otherPaths,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          applicationId
        );

      if (updateError) {
        throw updateError;
      }

      setApplicationNumber(
        applicationNumber
      );

      setSuccess(
        settings.application_success_message
      );

      setForm(
        INITIAL_FORM
      );

      setPhotograph(null);
      setMarksheet(null);
      setBirthCertificate(null);
      setOtherDocuments([]);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err: any) {
      setError(
        err?.message ||
          "Your application could not be submitted."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#F4F1EA]">
        <Loader2
          className="animate-spin text-[#102A56]"
          size={30}
        />
      </main>
    );
  }

  if (!settings?.is_open) {
    return (
      <main className="min-h-screen bg-[#F4F1EA] px-6 py-24 text-[#10203A]">

        <div className="mx-auto max-w-[1000px] text-center">

          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#102A56] text-white">
            <GraduationCap size={28} />
          </div>

          <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#102A56]/35">
            Apex Public School
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#102A56] md:text-6xl">
            Online Registration
          </h1>

          <div className="mx-auto mt-8 max-w-xl rounded-[2rem] bg-white p-8">

            <AlertCircle
              size={25}
              className="mx-auto text-[#102A56]/40"
            />

            <p className="mt-5 text-sm leading-7 text-[#10203A]/55">
              Online registration is currently closed.
              Please contact Apex Public School for current
              admission information.
            </p>

          </div>

        </div>

      </main>
    );
  }

  const classes =
    Array.isArray(
      settings.open_classes
    )
      ? settings.open_classes
      : [];

  const streams =
    Array.isArray(
      settings.class_xi_streams
    )
      ? settings.class_xi_streams
      : [];

  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#10203A]">

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="bg-[#102A56]">

        <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-28">

          <p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-white/40">
            Admissions · {settings.session}
          </p>

          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
            {settings.title}
          </h1>

          {settings.description && (
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/55 md:text-base">
              {settings.description}
            </p>
          )}

        </div>

      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24">

        {/* SUCCESS */}

        {success && (
          <div className="rounded-[2rem] bg-emerald-50 p-8">

            <div className="flex items-start gap-4">

              <CheckCircle2
                size={28}
                className="shrink-0 text-emerald-700"
              />

              <div>

                <h2 className="text-2xl font-semibold text-emerald-900">
                  Application submitted
                </h2>

                <p className="mt-3 text-sm leading-7 text-emerald-800/70">
                  {success}
                </p>

                <div className="mt-6 rounded-2xl bg-white px-5 py-4">

                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-800/40">
                    Application number
                  </p>

                  <p className="mt-2 text-2xl font-semibold tracking-[0.05em] text-[#102A56]">
                    {applicationNumber}
                  </p>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">

            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <span>{error}</span>

          </div>
        )}

        {!success && (
          <>
            {/* INSTRUCTIONS */}

            {settings.instructions && (
              <div className="mb-8 rounded-[2rem] border border-[#102A56]/10 bg-white p-7 md:p-9">

                <div className="flex items-start gap-4">

                  <FileText
                    size={22}
                    className="mt-1 shrink-0 text-[#102A56]"
                  />

                  <div>

                    <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#102A56]/35">
                      Before you begin
                    </p>

                    <p className="mt-3 text-sm leading-7 text-[#10203A]/60">
                      {settings.instructions}
                    </p>

                  </div>

                </div>

              </div>
            )}

            <div className="space-y-7">

              {/* STUDENT */}

              <FormSection
                number="01"
                title="Student Details"
              >

                <div className="grid gap-5 md:grid-cols-2">

                  <Field
                    label="Student name *"
                    value={
                      form.studentName
                    }
                    onChange={(value) =>
                      update(
                        "studentName",
                        value
                      )
                    }
                  />

                  <Field
                    label="Date of birth"
                    type="date"
                    value={
                      form.dateOfBirth
                    }
                    onChange={(value) =>
                      update(
                        "dateOfBirth",
                        value
                      )
                    }
                  />

                  <SelectField
                    label="Gender"
                    value={
                      form.gender
                    }
                    onChange={(value) =>
                      update(
                        "gender",
                        value
                      )
                    }
                    options={[
                      "Male",
                      "Female",
                      "Other",
                    ]}
                  />

                  <SelectField
                    label="Class applying for *"
                    value={
                      form.classApplyingFor
                    }
                    onChange={(value) => {
                      update(
                        "classApplyingFor",
                        value
                      );

                      if (
                        value !==
                        "Class XI"
                      ) {
                        update(
                          "stream",
                          ""
                        );
                      }
                    }}
                    options={
                      settings.class_xi_enabled
                        ? [
                            ...classes,
                            "Class XI",
                          ]
                        : classes
                    }
                  />

                  {form.classApplyingFor ===
                    "Class XI" && (
                    <SelectField
                      label="Stream"
                      value={
                        form.stream
                      }
                      onChange={(value) =>
                        update(
                          "stream",
                          value
                        )
                      }
                      options={
                        streams
                      }
                    />
                  )}

                  <Field
                    label="Previous school"
                    value={
                      form.previousSchool
                    }
                    onChange={(value) =>
                      update(
                        "previousSchool",
                        value
                      )
                    }
                  />

                  <Field
                    label="Previous class"
                    value={
                      form.previousClass
                    }
                    onChange={(value) =>
                      update(
                        "previousClass",
                        value
                      )
                    }
                  />

                  <Field
                    label="Previous result / percentage"
                    value={
                      form.previousResult
                    }
                    onChange={(value) =>
                      update(
                        "previousResult",
                        value
                      )
                    }
                  />

                </div>

              </FormSection>

              {/* PARENTS */}

              <FormSection
                number="02"
                title="Parent / Guardian Details"
              >

                <div className="grid gap-5 md:grid-cols-2">

                  <Field
                    label="Father's name"
                    value={
                      form.fatherName
                    }
                    onChange={(value) =>
                      update(
                        "fatherName",
                        value
                      )
                    }
                  />

                  <Field
                    label="Mother's name"
                    value={
                      form.motherName
                    }
                    onChange={(value) =>
                      update(
                        "motherName",
                        value
                      )
                    }
                  />

                  <Field
                    label="Guardian name"
                    value={
                      form.guardianName
                    }
                    onChange={(value) =>
                      update(
                        "guardianName",
                        value
                      )
                    }
                  />

                  <Field
                    label="Parent mobile *"
                    type="tel"
                    value={
                      form.parentMobile
                    }
                    onChange={(value) =>
                      update(
                        "parentMobile",
                        value
                      )
                    }
                  />

                  <Field
                    label="Parent email"
                    type="email"
                    value={
                      form.parentEmail
                    }
                    onChange={(value) =>
                      update(
                        "parentEmail",
                        value
                      )
                    }
                  />

                </div>

              </FormSection>

              {/* ADDRESS */}

              <FormSection
                number="03"
                title="Address"
              >

                <div className="space-y-5">

                  <TextArea
                    label="Full address"
                    value={
                      form.address
                    }
                    onChange={(value) =>
                      update(
                        "address",
                        value
                      )
                    }
                  />

                  <div className="grid gap-5 md:grid-cols-3">

                    <Field
                      label="City"
                      value={
                        form.city
                      }
                      onChange={(value) =>
                        update(
                          "city",
                          value
                        )
                      }
                    />

                    <Field
                      label="State"
                      value={
                        form.state
                      }
                      onChange={(value) =>
                        update(
                          "state",
                          value
                        )
                      }
                    />

                    <Field
                      label="PIN code"
                      value={
                        form.pincode
                      }
                      onChange={(value) =>
                        update(
                          "pincode",
                          value
                        )
                      }
                    />

                  </div>

                </div>

              </FormSection>

              {/* DOCUMENTS */}

              <FormSection
                number="04"
                title="Documents"
              >

                <div className="space-y-5">

                  <FileUpload
                    label="Student Photograph"
                    hint="Image file, maximum 5 MB."
                    file={
                      photograph
                    }
                    accept="image/*"
                    onChange={
                      setPhotograph
                    }
                  />

                  <FileUpload
                    label="Previous Marksheet / Report Card"
                    hint="PDF, maximum 10 MB."
                    file={
                      marksheet
                    }
                    accept=".pdf,application/pdf"
                    onChange={
                      setMarksheet
                    }
                  />

                  <FileUpload
                    label="Birth Certificate"
                    hint="PDF, maximum 10 MB."
                    file={
                      birthCertificate
                    }
                    accept=".pdf,application/pdf"
                    onChange={
                      setBirthCertificate
                    }
                  />

                  <div>

                    <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40">
                      Other supporting documents
                    </label>

                    <input
                      type="file"
                      multiple
                      accept=".pdf,application/pdf"
                      onChange={(event) =>
                        setOtherDocuments(
                          Array.from(
                            event.target
                              .files ||
                              []
                          )
                        )
                      }
                      className="mt-3 block w-full rounded-2xl border border-dashed border-[#102A56]/15 bg-[#F8F6F1] px-4 py-4 text-sm"
                    />

                    {otherDocuments.length >
                      0 && (
                      <p className="mt-2 text-xs text-[#102A56]/50">
                        {
                          otherDocuments.length
                        }{" "}
                        file
                        {otherDocuments.length ===
                        1
                          ? ""
                          : "s"}{" "}
                        selected
                      </p>
                    )}

                  </div>

                </div>

              </FormSection>

              {/* DECLARATION */}

              <FormSection
                number="05"
                title="Declaration"
              >

                <label className="flex items-start gap-3 rounded-2xl bg-[#F4F1EA] p-5">

                  <input
                    type="checkbox"
                    checked={
                      form.declarationAccepted
                    }
                    onChange={(event) =>
                      update(
                        "declarationAccepted",
                        event.target
                          .checked
                      )
                    }
                    className="mt-1 h-4 w-4 accent-[#102A56]"
                  />

                  <span className="text-sm leading-6 text-[#10203A]/65">
                    I confirm that the information
                    provided in this application is
                    accurate to the best of my knowledge,
                    and I agree to the school's admission
                    process and verification requirements.
                  </span>

                </label>

              </FormSection>

              {/* SUBMIT */}

              <div className="rounded-[2rem] bg-[#102A56] p-7 md:p-9">

                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                  <div>

                    <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/35">
                      Ready to submit
                    </p>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-white/55">
                      Please check all information and
                      documents before submitting your
                      application.
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={
                      submitApplication
                    }
                    disabled={
                      submitting
                    }
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-full
                      bg-white
                      px-7
                      py-4
                      text-sm
                      font-semibold
                      !text-[#102A56]
                      disabled:opacity-50
                    "
                  >

                    {submitting ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <ArrowRight
                        size={17}
                      />
                    )}

                    {submitting
                      ? "Submitting..."
                      : "Submit application"}

                  </button>

                </div>

              </div>

            </div>
          </>
        )}

      </section>

    </main>
  );
}

/*
============================================================
FORM SECTION
============================================================
*/

function FormSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-[#102A56]/10 bg-white p-6 md:p-9">

      <div className="flex items-center gap-4">

        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#102A56] text-white">
          <span className="text-xs font-semibold">
            {number}
          </span>
        </div>

        <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#102A56] md:text-2xl">
          {title}
        </h2>

      </div>

      <div className="mt-7">
        {children}
      </div>

    </section>
  );
}

/*
============================================================
FIELD
============================================================
*/

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>

      <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="
          mt-3
          w-full
          rounded-2xl
          border
          border-[#102A56]/10
          bg-[#F8F6F1]
          px-4
          py-3.5
          text-sm
          text-[#10203A]
          outline-none
          focus:border-[#102A56]/30
        "
      />

    </div>
  );
}

/*
============================================================
SELECT
============================================================
*/

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>

      <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="
          mt-3
          w-full
          rounded-2xl
          border
          border-[#102A56]/10
          bg-[#F8F6F1]
          px-4
          py-3.5
          text-sm
          text-[#10203A]
          outline-none
        "
      >

        <option value="">
          Select
        </option>

        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          )
        )}

      </select>

    </div>
  );
}

/*
============================================================
TEXTAREA
============================================================
*/

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
    <div>

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
        className="
          mt-3
          w-full
          resize-y
          rounded-2xl
          border
          border-[#102A56]/10
          bg-[#F8F6F1]
          px-4
          py-3.5
          text-sm
          leading-6
          text-[#10203A]
          outline-none
        "
      />

    </div>
  );
}

/*
============================================================
FILE UPLOAD
============================================================
*/

function FileUpload({
  label,
  hint,
  file,
  accept,
  onChange,
}: {
  label: string;
  hint: string;
  file: File | null;
  accept: string;
  onChange: (
    file: File | null
  ) => void;
}) {
  return (
    <div>

      <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40">
        {label}
      </label>

      <div className="mt-3 rounded-2xl border border-dashed border-[#102A56]/15 bg-[#F8F6F1] p-4">

        <div className="flex items-center gap-3">

          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#102A56] text-white">
            <Upload size={16} />
          </div>

          <input
            type="file"
            accept={accept}
            onChange={(event) =>
              onChange(
                event.target
                  .files?.[0] ||
                  null
              )
            }
            className="min-w-0 flex-1 text-sm"
          />

        </div>

        {file && (
          <p className="mt-3 text-xs text-emerald-700">
            Selected:
            {" "}
            <span className="font-semibold">
              {file.name}
            </span>
          </p>
        )}

        <p className="mt-2 text-[10px] text-[#10203A]/35">
          {hint}
        </p>

      </div>

    </div>
  );
}