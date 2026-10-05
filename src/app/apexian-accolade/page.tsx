"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  FileText,
  Loader2,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";
import PdfFlipbook from "@/components/PdfFlipbook";

type AccoladeDocument = {
  id: string;
  title: string;
  class_name: string | null;
  description: string | null;
  document_url: string | null;
  external_url: string | null;
  document_label: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string | null;
};

const CATEGORY = "monthly-newsletter";

const MONTHS = [
  "All Months",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getYear(date?: string | null) {
  if (!date) return null;

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return String(parsed.getFullYear());
}

function getMonth(date?: string | null) {
  if (!date) return null;

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "long",
  });
}

function formatDate(date?: string | null) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ApexianAccoladePage() {
  const [documents, setDocuments] = useState<AccoladeDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDocument, setSelectedDocument] =
    useState<AccoladeDocument | null>(null);

  const [selectedYear, setSelectedYear] =
    useState("All Years");

  const [selectedMonth, setSelectedMonth] =
    useState("All Months");

  useEffect(() => {
    loadAccoladeDocuments();
  }, []);

  async function loadAccoladeDocuments() {
    setLoading(true);

    const { data, error } = await supabase
      .from("academic_documents")
      .select(
        `
        id,
        title,
        class_name,
        description,
        document_url,
        external_url,
        document_label,
        sort_order,
        is_active,
        created_at
        `
      )
      .eq("category", CATEGORY)
      .eq("is_active", true)
      .ilike("title", "%Apexian Accolade%")
      .order("created_at", { ascending: false })
      .order("sort_order", { ascending: true });

    if (error) {
      console.error(
        "Apexian Accolade loading error:",
        error
      );

      setDocuments([]);
    } else {
      setDocuments(
        (data ?? []) as AccoladeDocument[]
      );
    }

    setLoading(false);
  }

  /*
   * AVAILABLE YEARS
   */

  const years = useMemo(() => {
    const uniqueYears = Array.from(
      new Set(
        documents
          .map((document) =>
            getYear(document.created_at)
          )
          .filter(Boolean) as string[]
      )
    );

    uniqueYears.sort(
      (a, b) => Number(b) - Number(a)
    );

    return ["All Years", ...uniqueYears];
  }, [documents]);

  /*
   * FILTERED DOCUMENTS
   */

  const filteredDocuments = useMemo(() => {
    return documents
      .filter((document) => {
        const year = getYear(document.created_at);
        const month = getMonth(document.created_at);

        const yearMatches =
          selectedYear === "All Years" ||
          year === selectedYear;

        const monthMatches =
          selectedMonth === "All Months" ||
          month === selectedMonth;

        return yearMatches && monthMatches;
      })
      .sort((a, b) => {
        const dateA = a.created_at
          ? new Date(a.created_at).getTime()
          : 0;

        const dateB = b.created_at
          ? new Date(b.created_at).getTime()
          : 0;

        if (dateA !== dateB) {
          return dateB - dateA;
        }

        return (
          (a.sort_order ?? 0) -
          (b.sort_order ?? 0)
        );
      });
  }, [
    documents,
    selectedYear,
    selectedMonth,
  ]);

  /*
   * RESET MONTH WHEN YEAR CHANGES
   */

  function handleYearChange(value: string) {
    setSelectedYear(value);

    if (value === "All Years") {
      return;
    }

    /*
     * Keep selected month if it exists for
     * the selected year.
     */
  }

  return (
    <main className="min-h-screen bg-[#F5F0E6] text-[#10203A]">

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#102A56] text-white">

        {/* Decorative circles */}

        <div className="pointer-events-none absolute -right-48 -top-48 h-[650px] w-[650px] rounded-full border border-white/[0.05]" />

        <div className="pointer-events-none absolute -right-24 -top-24 h-[450px] w-[450px] rounded-full border border-white/[0.05]" />

        <div className="pointer-events-none absolute -left-48 bottom-[-300px] h-[600px] w-[600px] rounded-full border border-white/[0.04]" />

        {/* Glow */}

        <div className="pointer-events-none absolute right-[-5%] top-[10%] h-[500px] w-[500px] rounded-full bg-[#8DB9E5]/10 blur-[150px]" />

        <div className="relative mx-auto max-w-[1500px] px-6 pb-24 pt-32 md:px-10 md:pb-32 lg:px-14 lg:pt-36">

          {/* Back */}

          <Link
            href="/"
            className="
              inline-flex
              items-center
              gap-2
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.25em]
              text-[#F5F0E6]/50
              transition
              hover:text-white
            "
          >
            <ArrowLeft size={13} />
            Apex Public School
          </Link>

          {/* Eyebrow */}

          <div className="mt-14 flex items-center gap-3">
            <span className="h-px w-10 bg-white/25" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
              School Publication
            </p>
          </div>

          {/* Heading */}

          <h1
            className="
              mt-7
              max-w-5xl
              text-5xl
              font-semibold
              leading-[0.9]
              tracking-[-0.06em]
              sm:text-6xl
              md:text-7xl
              lg:text-[6.2vw]
            "
          >
            The Apexian Accolade
          </h1>

          {/* Description */}

          <p className="mt-8 max-w-2xl text-base leading-8 text-white/55 md:text-lg">
            Explore the official editions of The Apexian
            Accolade, presented as interactive digital
            booklets on the Apex Public School website.
          </p>

        </div>
      </section>

      {/* =========================================================
          PUBLICATION CONTENT
      ========================================================= */}

      <section>
        <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14 lg:py-32">

          {/* INTRO */}

          <div className="mb-12">

            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#102A56]/35">
              Official Editions
            </p>

            <h2 className="mt-5 max-w-4xl text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#102A56] md:text-5xl">
              Every edition.
              <br />
              One Apex archive.
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#10203A]/55 md:text-base">
              Select an edition below to open its complete
              booklet in an interactive page-turning reader.
            </p>

          </div>

          {/* =====================================================
              LOADING
          ===================================================== */}

          {loading ? (
            <div className="flex min-h-[360px] items-center justify-center">
              <Loader2
                className="h-8 w-8 animate-spin text-[#102A56]"
              />
            </div>

          ) : documents.length === 0 ? (

            /* EMPTY STATE */

            <div className="rounded-[2rem] border border-[#102A56]/10 bg-white px-8 py-16 text-center shadow-[0_20px_60px_rgba(16,42,86,0.06)]">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#102A56] text-white">
                <BookOpen
                  size={26}
                  strokeWidth={1.5}
                />
              </div>

              <h3 className="mt-6 text-2xl font-semibold tracking-tight text-[#102A56]">
                No Apexian Accolade editions available
              </h3>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500">
                Published Apexian Accolade booklets will
                automatically appear here when added through
                the Admin panel.
              </p>

            </div>

          ) : (

            <>

              {/* =================================================
                  YEAR + MONTH FILTERS
              ================================================= */}

              <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center">

                {/* YEAR */}

                <select
                  value={selectedYear}
                  onChange={(e) =>
                    handleYearChange(e.target.value)
                  }
                  className="
                    rounded-full
                    border
                    border-[#102A56]/15
                    bg-white
                    px-5
                    py-3
                    text-sm
                    font-medium
                    text-[#102A56]
                    outline-none
                    shadow-sm
                    transition
                    focus:border-[#102A56]/40
                  "
                >
                  {years.map((year) => (
                    <option
                      key={year}
                      value={year}
                    >
                      {year}
                    </option>
                  ))}
                </select>

                {/* MONTH */}

                <select
                  value={selectedMonth}
                  onChange={(e) =>
                    setSelectedMonth(e.target.value)
                  }
                  className="
                    rounded-full
                    border
                    border-[#102A56]/15
                    bg-white
                    px-5
                    py-3
                    text-sm
                    font-medium
                    text-[#102A56]
                    outline-none
                    shadow-sm
                    transition
                    focus:border-[#102A56]/40
                  "
                >
                  {MONTHS.map((month) => (
                    <option
                      key={month}
                      value={month}
                    >
                      {month}
                    </option>
                  ))}
                </select>

                {/* CLEAR */}

                <button
                  type="button"
                  onClick={() => {
                    setSelectedYear("All Years");
                    setSelectedMonth("All Months");
                  }}
                  className="
                    rounded-full
                    bg-[#102A56]
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#1B3D73]
                  "
                >
                  Clear Filters
                </button>

              </div>

              {/* FILTER RESULT */}

              <div className="mb-8 flex items-center justify-between">

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#102A56]/35">
                    Publications
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#102A56]">
                    {selectedYear === "All Years" &&
                    selectedMonth === "All Months"
                      ? "All Editions"
                      : `${selectedMonth === "All Months" ? "" : selectedMonth + " "}${
                          selectedYear === "All Years"
                            ? ""
                            : selectedYear
                        } Editions`}
                  </h3>
                </div>

                <span className="rounded-full bg-[#102A56]/[0.06] px-4 py-2 text-xs font-semibold text-[#102A56]/60">
                  {filteredDocuments.length}{" "}
                  {filteredDocuments.length === 1
                    ? "Edition"
                    : "Editions"}
                </span>

              </div>

              {/* =================================================
                  DOCUMENTS
              ================================================= */}

              {filteredDocuments.length === 0 ? (

                <div className="rounded-[2rem] border border-[#102A56]/10 bg-white px-8 py-16 text-center">

                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#102A56]/[0.06] text-[#102A56]">
                    <FileText size={24} />
                  </div>

                  <h3 className="mt-6 text-2xl font-semibold text-[#102A56]">
                    No editions found
                  </h3>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
                    There are no Apexian Accolade editions
                    for the selected year and month.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedYear("All Years");
                      setSelectedMonth("All Months");
                    }}
                    className="mt-6 rounded-full bg-[#102A56] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1B3D73]"
                  >
                    Show All Editions
                  </button>

                </div>

              ) : (

                <DocumentGrid
                  documents={filteredDocuments}
                  onOpen={setSelectedDocument}
                />

              )}

            </>
          )}

        </div>
      </section>

      {/* =========================================================
          FLIPBOOK MODAL
      ========================================================= */}

      {selectedDocument && (

        <div
          className="
            fixed
            inset-0
            z-[200]
            flex
            items-center
            justify-center
            bg-[#07152d]/90
            p-2
            backdrop-blur-sm
            sm:p-4
          "
        >

          <div
            className="
              flex
              h-[97vh]
              w-full
              max-w-[1500px]
              flex-col
              overflow-hidden
              rounded-[24px]
              bg-[#F5F0E6]
              shadow-[0_40px_120px_rgba(0,0,0,0.4)]
            "
          >

            {/* Modal Header */}

            <div className="flex shrink-0 items-center justify-between gap-4 bg-[#102A56] px-4 py-3 text-white sm:px-6">

              <div className="min-w-0">

                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
                  The Apexian Accolade
                </p>

                <h2 className="truncate text-sm font-semibold sm:text-base">
                  {selectedDocument.title}
                </h2>

                {selectedDocument.created_at && (
                  <p className="mt-0.5 text-[10px] text-white/40">
                    {formatDate(
                      selectedDocument.created_at
                    )}
                  </p>
                )}

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedDocument(null)
                }
                aria-label="Close booklet"
                className="
                  grid
                  h-10
                  w-10
                  shrink-0
                  place-items-center
                  rounded-full
                  border
                  border-white/10
                  bg-white/10
                  text-white
                  transition
                  hover:bg-white/20
                "
              >
                <X size={18} />
              </button>

            </div>

            {/* Reader */}

            <div className="min-h-0 flex-1 overflow-auto bg-[#e8e5de] p-2 sm:p-4 lg:p-6">

              {selectedDocument.document_url ? (

                <PdfFlipbook
                  pdfUrl={
                    selectedDocument.document_url
                  }
                  title={
                    selectedDocument.title
                  }
                  className="mx-auto"
                />

              ) : (

                <div className="flex min-h-full items-center justify-center">

                  <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-sm">

                    <FileText
                      className="mx-auto h-10 w-10 text-[#102A56]"
                    />

                    <h3 className="mt-5 text-xl font-semibold text-[#102A56]">
                      Booklet PDF not uploaded
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      Upload the actual booklet PDF from the
                      Monthly Newsletter Admin section.
                    </p>

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </main>
  );
}

/* ===============================================================
   DOCUMENT GRID
=============================================================== */

function DocumentGrid({
  documents,
  onOpen,
}: {
  documents: AccoladeDocument[];
  onOpen: (
    document: AccoladeDocument
  ) => void;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

      {documents.map(
        (document, index) => {

          const hasPdf =
            Boolean(
              document.document_url?.trim()
            );

          return (

            <article
              key={document.id}
              className="
                group
                relative
                overflow-hidden
                rounded-[2rem]
                border
                border-[#102A56]/10
                bg-white
                p-7
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_24px_70px_rgba(16,42,86,0.1)]
                md:p-8
              "
            >

              {/* Number */}

              <span className="absolute right-7 top-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#102A56]/20">
                {String(index + 1).padStart(
                  2,
                  "0"
                )}
              </span>

              {/* Icon */}

              <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#102A56] text-white transition-transform duration-300 group-hover:scale-105">

                <BookOpen
                  size={18}
                  strokeWidth={1.5}
                />

              </div>

              {/* Date */}

              {document.created_at && (

                <p className="mt-8 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#102A56]/35">
                  {formatDate(
                    document.created_at
                  )}
                </p>

              )}

              {/* Edition */}

              {document.class_name && (

                <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#102A56]/30">
                  {document.class_name}
                </p>

              )}

              {/* Title */}

              <h4 className="mt-4 min-h-[74px] text-2xl font-semibold leading-[1.05] tracking-[-0.035em] text-[#102A56]">
                {document.title}
              </h4>

              {/* Description */}

              <p className="mt-5 min-h-[54px] text-sm leading-7 text-[#10203A]/50">
                {document.description ||
                  "Read the official Apexian Accolade publication."}
              </p>

              {/* Button */}

              {hasPdf ? (

                <button
                  type="button"
                  onClick={() =>
                    onOpen(document)
                  }
                  className="
                    mt-7
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-[#102A56]
                    px-5
                    py-3.5
                    text-sm
                    font-semibold
                    text-white
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#1B3D73]
                  "
                >
                  Read booklet

                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </button>

              ) : (

                <div
                  className="
                    mt-7
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-slate-100
                    px-5
                    py-3.5
                    text-sm
                    font-semibold
                    text-slate-500
                  "
                >
                  PDF not uploaded

                  <FileText size={14} />

                </div>

              )}

              {/* Bottom accent */}

              <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#102A56] transition-all duration-500 group-hover:w-full" />

            </article>

          );
        }
      )}

    </div>
  );
}