"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Download,
  ExternalLink,
  FileText,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase/browser";

type AdmissionNotice = {
  id: string;
  title: string;
  session: string;
  eyebrow: string | null;
  description: string | null;
  admissions_status: string | null;
  classes_open: string | null;
  class_xi_status: string | null;
  stream_note: string | null;
  direct_admission_note: string | null;
  notice_image_url: string | null;
  notice_pdf_url: string | null;
  image_alt: string | null;
  button_text: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
};

export default function AdmissionNoticePage() {
  const [notices, setNotices] = useState<AdmissionNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void loadNotices();
  }, []);

  async function loadNotices() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("admission_notices")
      .select(
        "id,title,session,eyebrow,description,admissions_status,classes_open,class_xi_status,stream_note,direct_admission_note,notice_image_url,notice_pdf_url,image_alt,button_text,sort_order,is_active,created_at"
      )
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Public admission notices error:", error);
      setNotices([]);
      setError(error.message);
    } else {
      setNotices((data ?? []) as AdmissionNotice[]);
    }

    setLoading(false);
  }

  const grouped = useMemo(() => {
    const currentYear = new Date().getFullYear();

    const current = notices.filter((notice) => {
      const session = notice.session.toLowerCase();
      return (
        session.includes(String(currentYear)) ||
        session.includes(String(currentYear + 1))
      );
    });

    const previous = notices.filter(
      (notice) => !current.some((item) => item.id === notice.id)
    );

    return { current, previous };
  }, [notices]);

  return (
    <main className="min-h-screen bg-[#f4f1ea] text-[#102a56]">
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
              View the official admission notices published by Apex Public
              School.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        {loading ? (
          <div className="flex min-h-[420px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#102a56]" />
          </div>
        ) : error ? (
          <div className="mx-auto max-w-3xl rounded-[30px] border border-red-200 bg-white px-8 py-16 text-center shadow-sm">
            <FileText className="mx-auto h-10 w-10 text-red-500" />
            <h2 className="mt-5 text-2xl font-semibold text-[#102a56]">
              Admission notices could not be loaded
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Check the public SELECT policy for the admission_notices table,
              then refresh this page.
            </p>
            <button
              type="button"
              onClick={() => void loadNotices()}
              className="mt-6 rounded-xl bg-[#102a56] px-5 py-3 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        ) : notices.length === 0 ? (
          <div className="mx-auto max-w-3xl rounded-[30px] border border-[#d8d4cc] bg-white px-8 py-16 text-center shadow-[0_20px_60px_rgba(16,42,86,0.06)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#102a56]">
              <FileText className="h-7 w-7 text-white" />
            </div>

            <h2 className="mt-7 text-2xl font-semibold">
              No admission notice published
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500">
              Publish an active admission notice from the CMS and it will
              automatically appear here. You do not need to hardcode a PDF in
              this page.
            </p>
          </div>
        ) : (
          <div className="space-y-20">
            {grouped.current.length > 0 && (
              <NoticeSection
                label="Current Session"
                heading="Admission Notice"
                description="Official admission information for the current academic session."
                notices={grouped.current}
                featured
              />
            )}

            {grouped.previous.length > 0 && (
              <NoticeSection
                label="Previous Notices"
                heading="Previous Admission Notices"
                description="Previous official admission notices are retained here for reference."
                notices={grouped.previous}
              />
            )}
          </div>
        )}
      </section>

      {!loading && !error && notices.length > 0 && (
        <section className="border-t border-[#ddd9d1] bg-white/50">
          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
            <div className="flex gap-3">
              <FileText className="mt-1 h-4 w-4 shrink-0 text-[#102a56]" />
              <p className="max-w-3xl text-xs leading-6 text-slate-500">
                Please refer to the official admission notice for complete
                information, dates and instructions.
              </p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function NoticeSection({
  label,
  heading,
  description,
  notices,
  featured = false,
}: {
  label: string;
  heading: string;
  description: string;
  notices: AdmissionNotice[];
  featured?: boolean;
}) {
  return (
    <section>
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <span
            className={`h-2 w-2 rounded-full ${
              featured ? "bg-[#102a56]" : "bg-slate-400"
            }`}
          />
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#102a56]">
            {label}
          </span>
        </div>

        <h2 className="text-3xl font-semibold tracking-tight text-[#102a56] sm:text-4xl">
          {heading}
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          {description}
        </p>
      </div>

      <div className="space-y-10">
        {notices.map((notice) => (
          <AdmissionNoticeCard
            key={notice.id}
            notice={notice}
            featured={featured}
          />
        ))}
      </div>
    </section>
  );
}

function AdmissionNoticeCard({
  notice,
  featured = false,
}: {
  notice: AdmissionNotice;
  featured?: boolean;
}) {
  const pdfUrl = notice.notice_pdf_url?.trim() || "";
  const imageUrl = notice.notice_image_url?.trim() || "";

  return (
    <article
      className={[
        "overflow-hidden rounded-[30px] border bg-white shadow-[0_20px_60px_rgba(16,42,86,0.07)]",
        featured ? "border-[#cfc9bc]" : "border-[#dedbd4]",
      ].join(" ")}
    >
      <div className="px-6 py-7 sm:px-9 sm:py-9">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl">
            {notice.eyebrow && (
              <div className="mb-4 inline-flex items-center rounded-full bg-[#102a56]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#102a56]">
                {notice.eyebrow}
              </div>
            )}

            <h3 className="text-2xl font-semibold tracking-tight text-[#102a56] sm:text-3xl">
              {notice.title}
            </h3>

            <p className="mt-2 text-sm font-medium text-slate-500">
              Academic Session: {notice.session}
            </p>

            {notice.description && (
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                {notice.description}
              </p>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {notice.admissions_status && (
                <Info label="Admission Status" value={notice.admissions_status} />
              )}
              {notice.classes_open && (
                <Info label="Classes Open" value={notice.classes_open} />
              )}
              {notice.class_xi_status && (
                <Info label="Class XI" value={notice.class_xi_status} />
              )}
              {notice.stream_note && (
                <Info label="Stream" value={notice.stream_note} />
              )}
            </div>

            {notice.direct_admission_note && (
              <div className="mt-4 rounded-2xl bg-[#f7f5ef] p-4 text-sm leading-6 text-slate-600">
                {notice.direct_admission_note}
              </div>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            {pdfUrl && (
              <>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#102a56]/20 bg-white px-4 py-3 text-sm font-semibold text-[#102a56] hover:bg-[#102a56]/5"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open
                </a>

                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-2 rounded-xl bg-[#102a56] px-4 py-3 text-sm font-semibold !text-white hover:bg-[#0b2042]"
                >
                  <Download className="h-4 w-4 !text-white" />
                  <span className="!text-white">Download PDF</span>
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {imageUrl && (
        <div className="border-t border-slate-200 bg-[#f5f3ee] p-4 sm:p-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <img
              src={imageUrl}
              alt={notice.image_alt || notice.title}
              className="mx-auto max-h-[720px] w-full object-contain"
            />
          </div>
        </div>
      )}

      {pdfUrl ? (
        <div className="border-y border-slate-200 bg-[#f1f0ed] p-3 sm:p-5 lg:p-7">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=0&view=FitH`}
              title={notice.title}
              className="block h-[70vh] min-h-[520px] w-full sm:h-[820px] lg:h-[1000px]"
            />
          </div>
        </div>
      ) : (
        <div className="border-y border-slate-200 bg-slate-50 px-6 py-16 text-center">
          <FileText className="mx-auto h-10 w-10 text-slate-400" />
          <h4 className="mt-4 text-lg font-semibold text-[#102a56]">
            Notice published
          </h4>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            The admission notice is live. The official PDF can be attached
            later from the CMS.
          </p>
        </div>
      )}

      <div className="flex items-center gap-3 px-6 py-5 sm:px-9">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#102a56]/8">
          <FileText className="h-4 w-4 text-[#102a56]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#102a56]">
            Official Admission Notice
          </p>
          <p className="text-xs text-slate-500">
            {pdfUrl ? "PDF document" : "Published from CMS"}
          </p>
        </div>
      </div>
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[#102a56]">{value}</p>
    </div>
  );
}
