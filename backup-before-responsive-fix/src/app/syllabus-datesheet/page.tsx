import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Download,
  ExternalLink,
  FileText,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type AcademicDocument = {
  id: string;
  title: string;
  class_name: string | null;
  category: string;
  description: string | null;
  document_url: string | null;
  external_url: string | null;
  document_label: string | null;
  sort_order: number;
};

function ResourceCard({
  document,
}: {
  document: AcademicDocument;
}) {
  const url =
    document.document_url ||
    document.external_url;

  return (
    <a
      href={url || "#"}
      target="_blank"
      rel="noreferrer"
      className="
        group
        flex
        items-center
        justify-between
        gap-4
        rounded-[1.5rem]
        border
        border-[#102A56]/10
        bg-white
        px-5
        py-5
        transition
        duration-300
        hover:-translate-y-0.5
        hover:border-[#102A56]/20
        hover:shadow-[0_15px_45px_rgba(16,42,86,0.07)]
      "
    >
      <div className="flex min-w-0 items-center gap-4">

        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#102A56] text-white">
          <FileText
            size={16}
            strokeWidth={1.5}
          />
        </div>

        <div className="min-w-0">

          <span className="block truncate text-sm font-semibold text-[#102A56]">
            {document.title}
          </span>

          {document.class_name && (
            <span className="mt-1 block text-xs text-[#10203A]/45">
              {document.class_name}
            </span>
          )}

        </div>
      </div>

      {document.document_url ? (
        <Download
          size={16}
          className="shrink-0 text-[#102A56]/30 transition group-hover:text-[#102A56]"
        />
      ) : (
        <ExternalLink
          size={16}
          className="shrink-0 text-[#102A56]/30 transition group-hover:text-[#102A56]"
        />
      )}

    </a>
  );
}

export default async function SyllabusDatesheetPage() {
  const { data } =
    await supabase
      .from("academic_documents")
      .select(
        `
          id,
          title,
          class_name,
          category,
          description,
          document_url,
          external_url,
          document_label,
          sort_order
        `
      )
      .eq("is_active", true)
      .order("category", {
        ascending: true,
      })
      .order("sort_order", {
        ascending: true,
      });

  const documents =
    (data || []) as AcademicDocument[];

  const halfYearly =
    documents.filter(
      (item) =>
        item.category ===
        "half-yearly"
    );

  const annual =
    documents.filter(
      (item) =>
        item.category === "annual"
    );

  const datesheet =
    documents.filter(
      (item) =>
        item.category ===
        "datesheet"
    );

  return (
    <main className="min-h-screen bg-[#F5F0E6] text-[#10203A]">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#102A56] text-white">

        <div className="pointer-events-none absolute -right-48 -top-48 h-[650px] w-[650px] rounded-full bg-[#8DB9E5]/10 blur-[140px]" />

        <div className="relative mx-auto max-w-[1500px] px-6 pb-24 pt-36 md:px-10 md:pb-32 lg:px-14 lg:pt-40">

          <Link
            href="/academics"
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50 transition hover:text-white"
          >
            <ArrowLeft size={13} />
            Academics
          </Link>

          <div className="mt-14 flex items-center gap-3">

            <span className="h-px w-10 bg-white/25" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
              Academic Resources
            </p>

          </div>

          <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[0.9] tracking-[-0.06em] md:text-7xl lg:text-[6.2vw]">
            Syllabus &
            <br />
            Datesheet
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-8 text-white/55 md:text-lg">
            Access the latest academic syllabus and
            examination documents published by Apex Public School.
          </p>

        </div>
      </section>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <section>

        <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14 lg:py-32">

          {/* DATE SHEET */}

          <section>

            <div className="mb-8 flex items-center gap-3">

              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#102A56] text-white">
                <CalendarDays size={18} />
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.25em] text-[#102A56]/30">
                  Examination
                </p>

                <h2 className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-[#102A56]">
                  Datesheet
                </h2>
              </div>

            </div>

            {datesheet.length === 0 ? (

              <div className="rounded-[2rem] bg-[#102A56] p-8 text-white md:p-10">
                <p className="text-sm leading-7 text-white/55">
                  Datesheet will be uploaded soon.
                </p>
              </div>

            ) : (

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {datesheet.map(
                  (document) => (
                    <ResourceCard
                      key={document.id}
                      document={document}
                    />
                  )
                )}
              </div>

            )}

          </section>

          {/* HALF YEARLY */}

          <section className="mt-20">

            <div className="mb-8">

              <p className="text-[9px] uppercase tracking-[0.28em] text-[#102A56]/35">
                Half-Yearly Syllabus
              </p>

              <h2 className="mt-5 text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#102A56] md:text-5xl">
                Half-Yearly
                <br />
                syllabus.
              </h2>

            </div>

            {halfYearly.length === 0 ? (

              <div className="rounded-[2rem] border border-[#102A56]/10 bg-white p-8">
                <p className="text-sm text-[#10203A]/45">
                  No Half-Yearly syllabus documents
                  have been published yet.
                </p>
              </div>

            ) : (

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                {halfYearly.map(
                  (document) => (
                    <ResourceCard
                      key={document.id}
                      document={document}
                    />
                  )
                )}

              </div>

            )}

          </section>

          {/* ANNUAL */}

          <section className="mt-20">

            <div className="mb-8">

              <p className="text-[9px] uppercase tracking-[0.28em] text-[#102A56]/35">
                Tentative Annual Syllabus
              </p>

              <h2 className="mt-5 text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#102A56] md:text-5xl">
                Annual syllabus
                <br />
                by class.
              </h2>

            </div>

            {annual.length === 0 ? (

              <div className="rounded-[2rem] border border-[#102A56]/10 bg-white p-8">
                <p className="text-sm text-[#10203A]/45">
                  No annual syllabus documents
                  have been published yet.
                </p>
              </div>

            ) : (

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                {annual.map(
                  (document) => (
                    <ResourceCard
                      key={document.id}
                      document={document}
                    />
                  )
                )}

              </div>

            )}

          </section>

          {/* ADMIN CTA */}

          <section className="mt-20">

            <div className="rounded-[2rem] bg-[#102A56] p-8 text-white md:p-10 lg:p-12">

              <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">

                <div>

                  <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                    Academic resources
                  </p>

                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.035em] md:text-3xl">
                    Documents are updated by the school.
                  </h3>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/50">
                    Syllabus and datesheet documents published
                    in the Apex CMS automatically appear on
                    this page.
                  </p>

                </div>

                <Link
                  href="/admin/academic-resources"
                  className="
                    inline-flex
                    shrink-0
                    items-center
                    gap-2
                    rounded-full
                    bg-[#F5F0E6]
                    px-6
                    py-3.5
                    text-sm
                    font-semibold
                    !text-[#102A56]
                    transition
                    hover:-translate-y-0.5
                    hover:bg-white
                  "
                >
                  Manage resources
                  <ArrowRight size={14} />
                </Link>

              </div>

            </div>

          </section>

          {/* BACK */}

          <div className="mt-12 border-t border-[#102A56]/10 pt-8">

            <Link
              href="/academics"
              className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#102A56]/50 transition hover:text-[#102A56]"
            >
              <ArrowLeft
                size={14}
                className="transition-transform group-hover:-translate-x-1"
              />
              Back to Academics
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}