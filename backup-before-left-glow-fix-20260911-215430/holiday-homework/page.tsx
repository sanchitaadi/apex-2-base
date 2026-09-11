import {
  ArrowUpRight,
  BookOpen,
  FileText,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type HomeworkDocument = {
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

export default async function HolidayHomeworkPage() {
  const { data, error } = await supabase
    .from("academic_documents")
    .select(`
      id,
      title,
      class_name,
      category,
      description,
      document_url,
      external_url,
      document_label,
      sort_order
    `)
    .eq("category", "holiday-homework")
    .eq("is_active", true)
    .order("sort_order", {
      ascending: true,
    });

  const documents =
    !error && data
      ? (data as HomeworkDocument[])
      : [];

  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#10203A]">
      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative overflow-hidden bg-[#102A56]">
        <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full border border-white/10" />
        <div className="absolute -right-40 top-16 h-[520px] w-[520px] rounded-full border border-white/10" />

        <div className="relative mx-auto max-w-[1500px] px-6 py-24 md:px-10 md:py-32">
          <p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-[#F5F0E6]/50">
            Academic Resources
          </p>

          <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.055em] text-white md:text-7xl">
            Holiday Homework
          </h1>

          <p className="mt-7 max-w-2xl text-sm leading-7 text-white/55 md:text-base">
            Holiday Homework 2026–2027 for students of Apex
            Public School.
          </p>
        </div>
      </section>

      {/* ==================================================
          DOCUMENTS
      ================================================== */}

      <section className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28">
        <div className="max-w-3xl">
          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#102A56]/35">
            Session 2026–2027
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#102A56] md:text-5xl">
            Download Holiday Homework
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#10203A]/55 md:text-base">
            Select your class below to view or download the
            holiday homework published by the school.
          </p>
        </div>

        {documents.length === 0 ? (
          <div className="mt-12 rounded-[2.5rem] bg-[#102A56] p-10 text-white md:p-14">
            <p className="text-sm text-white/60">
              Holiday homework documents are currently unavailable.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((document, index) => {
              const url =
                document.document_url ||
                document.external_url ||
                "";

              return (
                <article
                  key={document.id}
                  className="
                    group
                    rounded-[2rem]
                    border
                    border-[#102A56]/10
                    bg-white
                    p-6
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_25px_70px_rgba(16,42,86,0.08)]
                    md:p-7
                  "
                >
                  {/* TOP ROW */}

                  <div className="flex items-start justify-between gap-4">
                    <div
                      className="
                        grid
                        h-12
                        w-12
                        place-items-center
                        rounded-2xl
                        bg-[#102A56]
                        !text-[#F5F0E6]
                      "
                    >
                      <BookOpen
                        size={20}
                        className="!text-[#F5F0E6]"
                      />
                    </div>

                    <span className="text-[10px] font-semibold tracking-[0.2em] text-[#102A56]/20">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* CLASS */}

                  <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#102A56]/35">
                    {document.class_name ||
                      "Academic Resource"}
                  </p>

                  {/* TITLE */}

                  <h3 className="mt-3 text-xl font-semibold tracking-[-0.025em] text-[#102A56]">
                    {document.title}
                  </h3>

                  {/* DESCRIPTION */}

                  {document.description && (
                    <p className="mt-3 text-sm leading-6 text-[#10203A]/50">
                      {document.description}
                    </p>
                  )}

                  {/* DOWNLOAD BUTTON */}

                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        mt-7
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        bg-[#102A56]
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        !text-[#F5F0E6]
                        transition
                        duration-300
                        hover:-translate-y-0.5
                        hover:bg-[#1B3D73]
                      "
                    >
                      <span className="!text-[#F5F0E6]">
                        {document.document_label ||
                          "Download PDF"}
                      </span>

                      <ArrowUpRight
                        size={15}
                        className="
                          !text-[#F5F0E6]
                          transition-transform
                          duration-300
                          group-hover:translate-x-0.5
                        "
                      />
                    </a>
                  ) : (
                    <div
                      className="
                        mt-7
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        bg-[#102A56]/5
                        px-5
                        py-3
                        text-sm
                        font-medium
                        !text-[#102A56]/40
                      "
                    >
                      <FileText
                        size={15}
                        className="!text-[#102A56]/40"
                      />

                      <span className="!text-[#102A56]/40">
                        Document unavailable
                      </span>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ==================================================
          SCHOOL NOTE
      ================================================== */}

      <section className="mx-auto max-w-[1500px] px-6 pb-20 md:px-10 md:pb-28">
        <div className="rounded-[2.5rem] bg-[#102A56] p-8 md:p-10">
          <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/35">
            Apex Public School
          </p>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-white/55">
            Students should refer to the document applicable to
            their class and academic session.
          </p>
        </div>
      </section>
    </main>
  );
}