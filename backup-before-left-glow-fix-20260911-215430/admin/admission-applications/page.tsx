"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Download,
  Eye,
  FileText,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type Application = {
  id: string;
  application_number: string;
  session: string;
  status: string;

  student_name: string;
  date_of_birth: string | null;
  gender: string | null;

  class_applying_for: string;
  stream: string | null;

  previous_school: string | null;
  previous_class: string | null;
  previous_result: string | null;

  father_name: string | null;
  mother_name: string | null;
  guardian_name: string | null;

  parent_mobile: string;
  parent_email: string | null;

  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;

  photograph_path: string | null;
  marksheet_path: string | null;
  birth_certificate_path: string | null;
  other_document_paths: string[];

  declaration_accepted: boolean;

  admin_notes: string | null;

  created_at: string;
  updated_at: string;
};

const STATUSES = [
  "new",
  "under_review",
  "shortlisted",
  "approved",
  "rejected",
  "archived",
];

export default function AdmissionApplicationsPage() {
  const [applications, setApplications] =
    useState<Application[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [classFilter, setClassFilter] =
    useState("all");

  const [selected, setSelected] =
    useState<Application | null>(null);

  const [status, setStatus] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [fileLoading, setFileLoading] =
    useState("");

  async function loadApplications() {
    setLoading(true);
    setError("");

    const {
      data,
      error: loadError,
    } = await supabase
      .from(
        "admission_applications"
      )
      .select("*")
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

    if (loadError) {
      setApplications([]);
      setError(
        loadError.message
      );
    } else {
      setApplications(
        (data || []) as Application[]
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadApplications();
  }, []);

  const classes =
    useMemo(
      () =>
        Array.from(
          new Set(
            applications.map(
              (item) =>
                item.class_applying_for
            )
          )
        ),
      [applications]
    );

  const filtered =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLowerCase();

      return applications.filter(
        (application) => {

          const matchesSearch =
            !searchValue ||
            application.student_name
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            application.application_number
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            application.parent_mobile
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            (
              application.parent_email ||
              ""
            )
              .toLowerCase()
              .includes(
                searchValue
              );

          const matchesStatus =
            statusFilter === "all" ||
            application.status ===
              statusFilter;

          const matchesClass =
            classFilter === "all" ||
            application.class_applying_for ===
              classFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesClass
          );
        }
      );
    }, [
      applications,
      search,
      statusFilter,
      classFilter,
    ]);

  function openApplication(
    application: Application
  ) {
    setSelected(application);
    setStatus(application.status);
    setNotes(
      application.admin_notes ||
        ""
    );
    setMessage("");
    setError("");
  }

  function closeApplication() {
    setSelected(null);
    setMessage("");
    setError("");
  }

  async function saveApplication() {
    if (!selected) return;

    setSaving(true);
    setError("");
    setMessage("");

    const {
      data,
      error: updateError,
    } = await supabase
      .from(
        "admission_applications"
      )
      .update({
        status,
        admin_notes:
          notes.trim() ||
          null,
        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        selected.id
      )
      .select("*")
      .single();

    if (updateError) {
      setError(
        updateError.message
      );
    } else {
      setSelected(
        data as Application
      );

      setMessage(
        "Application updated successfully."
      );

      await loadApplications();
    }

    setSaving(false);
  }

  async function deleteApplication(
    application: Application
  ) {
    const confirmed =
      window.confirm(
        `Delete application ${application.application_number} for ${application.student_name}?`
      );

    if (!confirmed) {
      return;
    }

    setSaving(true);

    const {
      error: deleteError,
    } = await supabase
      .from(
        "admission_applications"
      )
      .delete()
      .eq(
        "id",
        application.id
      );

    if (deleteError) {
      setError(
        deleteError.message
      );
    } else {
      if (
        selected?.id ===
        application.id
      ) {
        setSelected(null);
      }

      setMessage(
        "Application deleted."
      );

      await loadApplications();
    }

    setSaving(false);
  }

  async function downloadFile(
    path: string | null,
    label: string
  ) {
    if (!path) return;

    setFileLoading(path);
    setError("");

    const {
      data,
      error: signedError,
    } = await supabase.storage
      .from(
        "admission-applications"
      )
      .createSignedUrl(
        path,
        300
      );

    if (signedError) {
      setError(
        signedError.message
      );
      setFileLoading("");
      return;
    }

    if (data?.signedUrl) {
      window.open(
        data.signedUrl,
        "_blank",
        "noopener,noreferrer"
      );
    }

    setFileLoading("");
  }

  return (
    <main className="min-h-screen bg-[#F4F1EA] px-5 py-8 text-[#10203A] md:px-8">

      <div className="mx-auto max-w-[1600px]">

        {/* HEADER */}

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>

            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#102A56]/35">
              Apex CMS
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#102A56] md:text-4xl">
              Admission Applications
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#10203A]/50">
              Review and manage online admission applications
              submitted through the school website.
            </p>

          </div>

          <button
            type="button"
            onClick={
              loadApplications
            }
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-[#102A56]/10 bg-white px-4 py-3 text-sm font-medium text-[#102A56]"
          >

            <RefreshCw
              size={15}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh

          </button>

        </div>

        {/* MESSAGE */}

        {message && (
          <div className="mt-6 rounded-2xl bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* FILTERS */}

        <section className="mt-8 rounded-[2rem] bg-white p-5 md:p-6">

          <div className="grid gap-4 lg:grid-cols-[1fr_200px_220px]">

            <div className="relative">

              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#102A56]/30"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search student, application number, mobile or email..."
                className="w-full rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] py-3.5 pl-11 pr-4 text-sm outline-none"
              />

            </div>

            <select
              value={
                statusFilter
              }
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3.5 text-sm outline-none"
            >

              <option value="all">
                All statuses
              </option>

              {STATUSES.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {formatStatus(
                      item
                    )}
                  </option>
                )
              )}

            </select>

            <select
              value={
                classFilter
              }
              onChange={(event) =>
                setClassFilter(
                  event.target.value
                )
              }
              className="rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3.5 text-sm outline-none"
            >

              <option value="all">
                All classes
              </option>

              {classes.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}

            </select>

          </div>

        </section>

        {/* TABLE */}

        <section className="mt-6 overflow-hidden rounded-[2rem] bg-white">

          {loading ? (

            <div className="py-24 text-center text-sm text-[#10203A]/40">
              <Loader2
                size={25}
                className="mx-auto animate-spin"
              />
              <p className="mt-4">
                Loading applications...
              </p>
            </div>

          ) : filtered.length ===
            0 ? (

            <div className="py-24 text-center">

              <UserRound
                size={32}
                className="mx-auto text-[#102A56]/20"
              />

              <p className="mt-5 text-sm text-[#10203A]/45">
                No applications found.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px] border-collapse">

                <thead>

                  <tr className="border-b border-[#102A56]/10 bg-[#FAF8F3]">

                    <th className="px-6 py-4 text-left text-[9px] font-semibold uppercase tracking-[0.18em] text-[#102A56]/35">
                      Applicant
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] font-semibold uppercase tracking-[0.18em] text-[#102A56]/35">
                      Class
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] font-semibold uppercase tracking-[0.18em] text-[#102A56]/35">
                      Parent
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] font-semibold uppercase tracking-[0.18em] text-[#102A56]/35">
                      Submitted
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] font-semibold uppercase tracking-[0.18em] text-[#102A56]/35">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-[9px] font-semibold uppercase tracking-[0.18em] text-[#102A56]/35">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filtered.map(
                    (application) => (
                      <tr
                        key={
                          application.id
                        }
                        className="border-b border-[#102A56]/6 last:border-0"
                      >

                        <td className="px-6 py-5">

                          <p className="font-semibold text-[#102A56]">
                            {
                              application.student_name
                            }
                          </p>

                          <p className="mt-1 text-xs text-[#10203A]/35">
                            {
                              application.application_number
                            }
                          </p>

                        </td>

                        <td className="px-6 py-5">

                          <p className="text-sm text-[#10203A]/65">
                            {
                              application.class_applying_for
                            }
                          </p>

                          {application.stream && (
                            <p className="mt-1 text-xs text-[#10203A]/35">
                              {
                                application.stream
                              }
                            </p>
                          )}

                        </td>

                        <td className="px-6 py-5">

                          <p className="text-sm text-[#10203A]/65">
                            {
                              application.father_name ||
                              application.mother_name ||
                              application.guardian_name ||
                              "—"
                            }
                          </p>

                          <p className="mt-1 text-xs text-[#10203A]/35">
                            {
                              application.parent_mobile
                            }
                          </p>

                        </td>

                        <td className="px-6 py-5 text-sm text-[#10203A]/50">
                          {new Date(
                            application.created_at
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>

                        <td className="px-6 py-5">

                          <span
                            className={statusClass(
                              application.status
                            )}
                          >
                            {formatStatus(
                              application.status
                            )}
                          </span>

                        </td>

                        <td className="px-6 py-5">

                          <div className="flex justify-end gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                openApplication(
                                  application
                                )
                              }
                              className="grid h-9 w-9 place-items-center rounded-xl border border-[#102A56]/10 text-[#102A56]"
                              title="View"
                            >
                              <Eye
                                size={14}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                deleteApplication(
                                  application
                                )
                              }
                              className="grid h-9 w-9 place-items-center rounded-xl border border-red-500/10 text-red-500"
                              title="Delete"
                            >
                              <Trash2
                                size={14}
                              />
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>

      {/* ==================================================
          APPLICATION DRAWER
      ================================================== */}

      {selected && (
        <div className="fixed inset-0 z-[100]">

          <button
            type="button"
            onClick={
              closeApplication
            }
            className="absolute inset-0 bg-[#07172F]/60 backdrop-blur-sm"
            aria-label="Close"
          />

          <aside className="absolute right-0 top-0 h-full w-full max-w-[720px] overflow-y-auto bg-[#F4F1EA] shadow-2xl">

            {/* DRAWER HEADER */}

            <div className="sticky top-0 z-10 border-b border-[#102A56]/10 bg-[#F4F1EA]/95 px-6 py-5 backdrop-blur md:px-8">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/35">
                    Application
                  </p>

                  <h2 className="mt-2 text-xl font-semibold text-[#102A56]">
                    {
                      selected.student_name
                    }
                  </h2>

                  <p className="mt-1 text-xs text-[#10203A]/40">
                    {
                      selected.application_number
                    }
                  </p>

                </div>

                <button
                  type="button"
                  onClick={
                    closeApplication
                  }
                  className="grid h-10 w-10 place-items-center rounded-xl border border-[#102A56]/10 bg-white text-[#102A56]"
                >
                  <X size={17} />
                </button>

              </div>

            </div>

            <div className="space-y-5 p-6 md:p-8">

              {/* STATUS */}

              <section className="rounded-[1.75rem] bg-white p-5">

                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/35">
                  Application status
                </p>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target
                        .value
                    )
                  }
                  className="mt-3 w-full rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3.5 text-sm"
                >

                  {STATUSES.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {formatStatus(
                          item
                        )}
                      </option>
                    )
                  )}

                </select>

              </section>

              {/* STUDENT */}

              <DetailSection
                title="Student"
              >

                <Detail
                  label="Name"
                  value={
                    selected.student_name
                  }
                />

                <Detail
                  label="Date of birth"
                  value={
                    selected.date_of_birth ||
                    "—"
                  }
                />

                <Detail
                  label="Gender"
                  value={
                    selected.gender ||
                    "—"
                  }
                />

                <Detail
                  label="Class"
                  value={
                    selected.class_applying_for
                  }
                />

                <Detail
                  label="Stream"
                  value={
                    selected.stream ||
                    "—"
                  }
                />

              </DetailSection>

              {/* PREVIOUS SCHOOL */}

              <DetailSection
                title="Previous School"
              >

                <Detail
                  label="School"
                  value={
                    selected.previous_school ||
                    "—"
                  }
                />

                <Detail
                  label="Previous class"
                  value={
                    selected.previous_class ||
                    "—"
                  }
                />

                <Detail
                  label="Result"
                  value={
                    selected.previous_result ||
                    "—"
                  }
                />

              </DetailSection>

              {/* PARENT */}

              <DetailSection
                title="Parent / Guardian"
              >

                <Detail
                  label="Father"
                  value={
                    selected.father_name ||
                    "—"
                  }
                />

                <Detail
                  label="Mother"
                  value={
                    selected.mother_name ||
                    "—"
                  }
                />

                <Detail
                  label="Guardian"
                  value={
                    selected.guardian_name ||
                    "—"
                  }
                />

                <Detail
                  label="Mobile"
                  value={
                    selected.parent_mobile
                  }
                />

                <Detail
                  label="Email"
                  value={
                    selected.parent_email ||
                    "—"
                  }
                />

              </DetailSection>

              {/* ADDRESS */}

              <DetailSection
                title="Address"
              >

                <Detail
                  label="Address"
                  value={
                    selected.address ||
                    "—"
                  }
                />

                <Detail
                  label="City"
                  value={
                    selected.city ||
                    "—"
                  }
                />

                <Detail
                  label="State"
                  value={
                    selected.state ||
                    "—"
                  }
                />

                <Detail
                  label="PIN"
                  value={
                    selected.pincode ||
                    "—"
                  }
                />

              </DetailSection>

              {/* DOCUMENTS */}

              <DetailSection
                title="Uploaded Documents"
              >

                <DocumentButton
                  label="Student Photograph"
                  path={
                    selected.photograph_path
                  }
                  loading={
                    fileLoading ===
                    selected.photograph_path
                  }
                  onClick={() =>
                    downloadFile(
                      selected.photograph_path,
                      "Student photograph"
                    )
                  }
                />

                <DocumentButton
                  label="Previous Marksheet"
                  path={
                    selected.marksheet_path
                  }
                  loading={
                    fileLoading ===
                    selected.marksheet_path
                  }
                  onClick={() =>
                    downloadFile(
                      selected.marksheet_path,
                      "Previous marksheet"
                    )
                  }
                />

                <DocumentButton
                  label="Birth Certificate"
                  path={
                    selected.birth_certificate_path
                  }
                  loading={
                    fileLoading ===
                    selected.birth_certificate_path
                  }
                  onClick={() =>
                    downloadFile(
                      selected.birth_certificate_path,
                      "Birth certificate"
                    )
                  }
                />

                {(
                  selected.other_document_paths ||
                  []
                ).map(
                  (
                    path,
                    index
                  ) => (
                    <DocumentButton
                      key={path}
                      label={`Other document ${index + 1}`}
                      path={path}
                      loading={
                        fileLoading ===
                        path
                      }
                      onClick={() =>
                        downloadFile(
                          path,
                          `Other document ${index + 1}`
                        )
                      }
                    />
                  )
                )}

              </DetailSection>

              {/* NOTES */}

              <section className="rounded-[1.75rem] bg-white p-5">

                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/35">
                  Admin notes
                </p>

                <textarea
                  value={notes}
                  onChange={(event) =>
                    setNotes(
                      event.target.value
                    )
                  }
                  rows={6}
                  placeholder="Add internal notes..."
                  className="mt-3 w-full resize-y rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3.5 text-sm leading-6 outline-none"
                />

              </section>

              {/* SAVE */}

              <button
                type="button"
                onClick={
                  saveApplication
                }
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#102A56] px-6 py-4 text-sm font-semibold text-white disabled:opacity-50"
              >

                {saving ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Check size={16} />
                )}

                {saving
                  ? "Saving..."
                  : "Save application"}

              </button>

            </div>

          </aside>

        </div>
      )}

    </main>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.75rem] bg-white p-5">

      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/35">
        {title}
      </p>

      <div className="mt-4 space-y-4">
        {children}
      </div>

    </section>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <p className="text-[9px] uppercase tracking-[0.15em] text-[#102A56]/30">
        {label}
      </p>

      <p className="mt-1 text-sm leading-6 text-[#10203A]/65">
        {value}
      </p>

    </div>
  );
}

function DocumentButton({
  label,
  path,
  loading,
  onClick,
}: {
  label: string;
  path: string | null;
  loading: boolean;
  onClick: () => void;
}) {
  if (!path) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-[#102A56]/10 bg-[#F8F6F1] p-4 text-left"
    >

      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#102A56] text-white">
        {loading ? (
          <Loader2
            size={16}
            className="animate-spin"
          />
        ) : (
          <FileText size={16} />
        )}
      </div>

      <div className="min-w-0 flex-1">

        <p className="text-sm font-medium text-[#102A56]">
          {label}
        </p>

        <p className="mt-1 text-[10px] text-[#10203A]/35">
          Private uploaded document
        </p>

      </div>

      <Download
        size={16}
        className="text-[#102A56]/40"
      />

    </button>
  );
}

function formatStatus(
  status: string
) {
  return status
    .replace(
      "_",
      " "
    )
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    );
}

function statusClass(
  status: string
) {
  switch (status) {
    case "approved":
      return "rounded-full bg-emerald-50 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-emerald-700";

    case "rejected":
      return "rounded-full bg-red-50 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-red-600";

    case "shortlisted":
      return "rounded-full bg-blue-50 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-blue-700";

    case "under_review":
      return "rounded-full bg-amber-50 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-amber-700";

    case "archived":
      return "rounded-full bg-gray-100 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-gray-500";

    default:
      return "rounded-full bg-[#102A56]/5 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#102A56]";
  }
}