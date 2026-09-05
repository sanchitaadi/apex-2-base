"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Maximize2,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type AdmissionDocument = {
  id: string;
  title: string;
  class_name: string | null;
  category: string;
  description: string | null;
  document_url: string | null;
  external_url: string | null;
  document_label: string | null;
  sort_order: number;
  is_active: boolean;
};

const CATEGORY = "admission-notice";

export default function AdmissionNoticePage() {
  const [documents, setDocuments] = useState<AdmissionDocument[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    setLoading(true);

    const { data, error } = await supabase
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
          sort_order,
          is_active
        `
      )
      .eq("category", CATEGORY)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error(
        "Admission notice loading error:",
        error
      );
      setDocuments([]);
    } else {
      setDocuments((data ?? []) as AdmissionDocument[]);
    }

    setLoading(false);
  }

  function getDocumentUrl(document: AdmissionDocument) {
    return (
      document.document_url?.trim() ||
      document.external_url?.trim() ||
      ""
    );
  }

  const currentDocuments = useMemo(() => {
    return documents.filter((document) => {
      const text =
        `${document.title} ${document.class_name ?? ""}`.toLowerCase();

      return (
        text.includes("2026") ||
        text.includes("2026-27") ||
        text.includes("2026–27")
      );
    });
  }, [documents]);

  const previousDocuments = useMemo(() => {
    return documents.filter((document) => {
      const text =
        `${document.title} ${document.class_name ?? ""}`.toLowerCase();

      return (
        text.includes("2025") ||
        text.includes("2025-26") ||
        text.includes("2025–26")
      );
    });
  }, [documents]);

  const otherDocuments = useMemo(() => {
    const currentIds = new Set(
      currentDocuments.map((document) => document.id)
    );

    const previousIds = new Set(
      previousDocuments.map((document) => document.id)
    );

    return documents.filter(
      (document) =>
        !currentIds.has(document.id) &&
        !previousIds.has(document.id)
    );
  }, [
    documents,
    currentDocuments,
    previousDocuments,
  ]);

  return (
    <main className="min-h-screen bg-[#f4f1ea] text-[#102a56]">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#102a56]">

        <div className="pointer-events-none absolute inset-0">

          <div className="absolute -right-32 -top-32 h-[430px] w-[430px] rounded-full border border-white/10" />

          <div className="absolute -right-16 -top-16 h-[300px] w-[300px] rounded-full border border-white/10" />

          <div className="absolute bottom-[-170px] left-[-120px] h-[360px] w-[360px] rounded-full border border-white/5" />

        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">

          <div className="max-w-4xl">

            <div className="mb-7 flex items-center gap-4">

              <div className="h-px w-12 bg-white/50" />

              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
                Admissions
              </span>

            </div>

            <h1 className="text-5xl font-semibold leading-[1.03] tracking-[-0.035em] text-white sm:text-6xl lg:text-7xl">
              Admission Notice
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              View the official admission notices published by
              Apex Public School.
            </p>

          </div>

        </div>
      </section>

      {/* =========================================================
          DOCUMENT AREA
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">

        {loading ? (

          <div className="flex min-h-[420px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#102a56]" />
          </div>

        ) : documents.length === 0 ? (

          <div className="mx-auto max-w-3xl rounded-[30px] border border-[#d8d4cc] bg-white px-8 py-16 text-center shadow-[0_20px_60px_rgba(16,42,86,0.06)]">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#102a56]">
              <FileText className="h-7 w-7 text-white" />
            </div>

            <h2 className="mt-7 text-2xl font-semibold text-[#102a56]">
              Admission Notice
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500">
              The current admission notice is not available
              at the moment.
            </p>

          </div>

        ) : (

          <div className="space-y-20">

            {/* =====================================================
                CURRENT SESSION
            ===================================================== */}
            {currentDocuments.length > 0 && (
              <section>

                <div className="mb-8">

                  <div className="mb-4 flex items-center gap-3">

                    <span className="h-2 w-2 rounded-full bg-[#102a56]" />

                    <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#102a56]">
                      Current Session
                    </span>

                  </div>

                  <h2 className="text-3xl font-semibold tracking-tight text-[#102a56] sm:text-4xl">
                    Admission Notice 2026–2027
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                    Official admission notice for the current
                    academic session.
                  </p>

                </div>

                <div className="space-y-10">

                  {currentDocuments.map((document) => (
                    <AdmissionDocumentCard
                      key={document.id}
                      document={document}
                      featured
                    />
                  ))}

                </div>

              </section>
            )}

            {/* =====================================================
                PREVIOUS SESSION
            ===================================================== */}
            {previousDocuments.length > 0 && (
              <section>

                <div className="mb-8">

                  <div className="mb-4 flex items-center gap-3">

                    <span className="h-2 w-2 rounded-full bg-slate-400" />

                    <span className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                      Previous Session
                    </span>

                  </div>

                  <h2 className="text-3xl font-semibold tracking-tight text-[#102a56] sm:text-4xl">
                    Previous Admission Notices
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                    Previous official admission notices are
                    retained here for reference.
                  </p>

                </div>

                <div className="space-y-10">

                  {previousDocuments.map((document) => (
                    <AdmissionDocumentCard
                      key={document.id}
                      document={document}
                    />
                  ))}

                </div>

              </section>
            )}

            {/* =====================================================
                OTHER
            ===================================================== */}
            {otherDocuments.length > 0 && (
              <section>

                <div className="mb-8">

                  <div className="mb-4 flex items-center gap-3">

                    <span className="h-2 w-2 rounded-full bg-slate-400" />

                    <span className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                      Admission Documents
                    </span>

                  </div>

                  <h2 className="text-3xl font-semibold tracking-tight text-[#102a56] sm:text-4xl">
                    Additional Notices
                  </h2>

                </div>

                <div className="space-y-10">

                  {otherDocuments.map((document) => (
                    <AdmissionDocumentCard
                      key={document.id}
                      document={document}
                    />
                  ))}

                </div>

              </section>
            )}

          </div>

        )}

      </section>

      {/* =========================================================
          FOOTNOTE
      ========================================================= */}
      {!loading && documents.length > 0 && (
        <section className="border-t border-[#ddd9d1] bg-white/50">

          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">

            <div className="flex gap-3">

              <FileText className="mt-1 h-4 w-4 shrink-0 text-[#102a56]" />

              <p className="max-w-3xl text-xs leading-6 text-slate-500">
                Please refer to the official admission notice
                for complete information, dates and instructions.
              </p>

            </div>

          </div>

        </section>
      )}

    </main>
  );
}

/* ===============================================================
   DOCUMENT CARD
=============================================================== */

function AdmissionDocumentCard({
  document,
  featured = false,
}: {
  document: AdmissionDocument;
  featured?: boolean;
}) {
  const url =
    document.document_url?.trim() ||
    document.external_url?.trim() ||
    "";

  return (
    <article
      className={[
        "overflow-hidden rounded-[30px] border bg-white shadow-[0_20px_60px_rgba(16,42,86,0.07)]",
        featured
          ? "border-[#cfc9bc]"
          : "border-[#dedbd4]",
      ].join(" ")}
    >

      {/* =========================================================
          DOCUMENT HEADER
      ========================================================= */}
      <div className="px-6 py-7 sm:px-9 sm:py-9">

        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

          <div className="max-w-3xl">

            {document.class_name && (
              <div
                className={[
                  "mb-4 inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em]",
                  featured
                    ? "bg-[#102a56]/10 text-[#102a56]"
                    : "bg-slate-100 text-slate-600",
                ].join(" ")}
              >
                {document.class_name}
              </div>
            )}

            <h3 className="text-2xl font-semibold tracking-tight text-[#102a56] sm:text-3xl">
              {document.title}
            </h3>

            {document.description && (
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                {document.description}
              </p>
            )}

          </div>

          {/* ACTIONS */}
          {url && (
            <div className="flex shrink-0 flex-wrap gap-3">

              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#102a56]/20 bg-white px-4 py-3 text-sm font-semibold text-[#102a56] transition hover:bg-[#102a56]/5"
              >
                <Maximize2 className="h-4 w-4" />
                Open Fullscreen
              </a>

              <a
  href={url}
  target="_blank"
  rel="noopener noreferrer"
  download
  className="
    inline-flex
    items-center
    gap-2
    rounded-xl
    bg-[#102A56]
    px-4
    py-3
    text-sm
    font-semibold
    !text-[#F5F0E6]
    transition
    duration-300
    hover:bg-[#0b2042]
    hover:-translate-y-0.5
  "
>
  <Download className="h-4 w-4 !text-[#F5F0E6]" />

  <span className="!text-[#F5F0E6]">
    Download PDF
  </span>
</a>

            </div>
          )}

        </div>
      </div>

      {/* =========================================================
          PDF VIEWER
      ========================================================= */}
      {url ? (

        <div
          className={[
            "border-y p-3 sm:p-5 lg:p-7",
            featured
              ? "border-[#ded9d0] bg-[#eeece7]"
              : "border-slate-200 bg-[#f1f0ed]",
          ].join(" ")}
        >

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <iframe
              src={url}
              title={document.title}
              className="block h-[680px] w-full sm:h-[820px] lg:h-[1000px]"
              loading="lazy"
            />

          </div>

        </div>

      ) : (

        <div className="border-y border-slate-200 bg-slate-50 px-6 py-20 text-center">

          <FileText className="mx-auto h-10 w-10 text-slate-400" />

          <h4 className="mt-4 text-lg font-semibold text-slate-50">
            Document unavailable
          </h4>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            No PDF has been attached to this admission notice.
          </p>

        </div>

      )}

      {/* =========================================================
          FOOTER
      ========================================================= */}
      {url && (
        <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-9">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#102a56]/8">
              <FileText className="h-4 w-4 text-[#102a56]" />
            </div>

            <div>

              <p className="text-sm font-semibold text-[#102a56]">
                Official Admission Notice
              </p>

              <p className="text-xs text-slate-500">
                PDF document
              </p>

            </div>

          </div>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#102a56] transition hover:underline"
          >
            Open document in new tab
            <ExternalLink className="h-4 w-4" />
          </a>

        </div>
      )}

    </article>
  );
}