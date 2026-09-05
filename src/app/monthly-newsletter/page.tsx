"use client";

import { useEffect, useState } from "react";
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

type NewsletterDocument = {
  id: string;
  title: string;
  class_name: string | null;
  description: string | null;
  document_url: string | null;
  external_url: string | null;
  document_label: string | null;
  sort_order: number;
  is_active: boolean;
};

const CATEGORY = "monthly-newsletter";

export default function MonthlyNewsletterPage() {
  const [documents, setDocuments] = useState<
    NewsletterDocument[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [selected, setSelected] =
    useState<NewsletterDocument | null>(null);

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
      .order("sort_order", { ascending: true });

    if (error) {
      console.error(error);
      setDocuments([]);
    } else {
      setDocuments(
        (data ?? []) as NewsletterDocument[]
      );
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#F5F0E6] text-[#10203A]">

      {/* HERO */}

      <section className="relative overflow-hidden bg-[#102A56] text-white">

        <div className="pointer-events-none absolute -right-48 -top-48 h-[650px] w-[650px] rounded-full bg-[#8DB9E5]/10 blur-[140px]" />

        <div className="pointer-events-none absolute -left-48 bottom-[-300px] h-[600px] w-[600px] rounded-full bg-[#F5F0E6]/[0.05] blur-[140px]" />

        <div className="relative mx-auto max-w-[1500px] px-6 pb-24 pt-32 md:px-10 md:pb-32 lg:px-14 lg:pt-36">

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50 hover:text-white"
          >
            <ArrowLeft size={13} />
            Apex Public School
          </Link>

          <div className="mt-14 flex items-center gap-3">

            <span className="h-px w-10 bg-white/25" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
              Publications &amp; Updates
            </p>

          </div>

          <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[0.9] tracking-[-0.06em] md:text-7xl lg:text-[6.2vw]">
            Monthly Newsletter
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-8 text-white/55 md:text-lg">
            Explore the newsletters, school stories,
            achievements, activities and highlights from
            Apex Public School.
          </p>

        </div>
      </section>

      {/* CONTENT */}

      <section>

        <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14 lg:py-32">

          <div className="mb-12">

            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#102A56]/35">
              Apex Publications
            </p>

            <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#102A56] md:text-5xl">
              Stories and highlights
              <br />
              from Apex.
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#10203A]/55 md:text-base">
              Select any publication to open the complete
              booklet directly on this website.
            </p>

          </div>

          {loading ? (

            <div className="flex min-h-[360px] items-center justify-center">

              <Loader2
                className="h-8 w-8 animate-spin text-[#102A56]"
              />

            </div>

          ) : documents.length === 0 ? (

            <div className="rounded-[2rem] border border-[#102A56]/10 bg-white px-8 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#102A56] text-white">

                <BookOpen size={26} />

              </div>

              <h3 className="mt-6 text-2xl font-semibold text-[#102A56]">
                No newsletters available
              </h3>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500">
                Publications will appear here when they are
                published from the Admin panel.
              </p>

            </div>

          ) : (

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

                      <span className="absolute right-7 top-7 text-[10px] font-semibold tracking-[0.18em] text-[#102A56]/20">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#102A56] text-white">
                        <BookOpen size={18} />
                      </div>

                      {document.class_name && (
                        <p className="mt-8 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#102A56]/35">
                          {document.class_name}
                        </p>
                      )}

                      <h3 className="mt-4 min-h-[76px] text-2xl font-semibold leading-[1.05] tracking-[-0.035em] text-[#102A56]">
                        {document.title}
                      </h3>

                      <p className="mt-5 min-h-[52px] text-sm leading-7 text-[#10203A]/50">
                        {document.description ||
                          "Read the official Apex Public School publication."}
                      </p>

                      {hasPdf ? (

                        <button
                          type="button"
                          onClick={() =>
                            setSelected(document)
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
                            transition
                            hover:-translate-y-0.5
                            hover:bg-[#1B3D73]
                          "
                        >
                          Read newsletter

                          <ArrowRight size={14} />

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

                      <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#102A56] transition-all duration-500 group-hover:w-full" />

                    </article>
                  );
                }
              )}

            </div>

          )}

        </div>
      </section>

      {/* 3D BOOKLET MODAL */}

      {selected &&
        selected.document_url && (

          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#07152d]/90 p-2 backdrop-blur-sm sm:p-4">

            <div className="flex h-[97vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-[24px] bg-[#F5F0E6] shadow-[0_40px_120px_rgba(0,0,0,0.4)]">

              {/* HEADER */}

              <div className="flex shrink-0 items-center justify-between gap-4 bg-[#102A56] px-4 py-3 text-white sm:px-6">

                <div className="min-w-0">

                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
                    Apex Public School
                  </p>

                  <h2 className="truncate text-sm font-semibold sm:text-base">
                    {selected.title}
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelected(null)
                  }
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
                    hover:bg-white/20
                  "
                >
                  <X size={18} />
                </button>

              </div>

              {/* BOOK */}

              <div className="min-h-0 flex-1 overflow-auto bg-[#e8e5de] p-2 sm:p-4 lg:p-6">

                <PdfFlipbook
                  pdfUrl={
                    selected.document_url
                  }
                  title={
                    selected.title
                  }
                  className="mx-auto"
                />

              </div>

            </div>

          </div>
        )}

    </main>
  );
}