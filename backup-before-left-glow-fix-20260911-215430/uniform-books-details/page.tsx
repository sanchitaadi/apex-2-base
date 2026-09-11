import {
  ArrowUpRight,
  BookOpen,
  FileText,
  Shirt,
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
  is_active: boolean;
};

export default async function UniformBooksDetailsPage() {
  const { data } = await supabase
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
      sort_order,
      is_active
    `)
    .eq("category", "uniform-books")
    .eq("is_active", true)
    .order("sort_order", {
      ascending: true,
    });

  const documents = (data || []) as AcademicDocument[];

  const getUrl = (document: AcademicDocument) =>
    document.document_url || document.external_url || "";

  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#10203A]">
      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative overflow-hidden bg-[#102A56]">
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full border border-white" />
          <div className="absolute -right-20 top-20 h-96 w-96 rounded-full border border-white" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
          <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-[#F5F0E6]/55">
            Academic Resources
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
            Uniform &amp; Books Details
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/55 md:text-base">
            Access the latest book list and school uniform
            information published by Apex Public School.
          </p>
        </div>
      </section>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <section className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-28">
        <div className="max-w-3xl">
          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#102A56]/35">
            Downloads
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#102A56] md:text-5xl">
            School information &amp; resources
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#10203A]/55 md:text-base">
            Click on a document below to view or download
            the latest information.
          </p>
        </div>

        {documents.length === 0 ? (
          <div className="mt-12 rounded-[2rem] bg-[#102A56] p-8 text-white/75 md:p-12">
            <p className="text-sm text-white/60">
              No documents are currently available.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {documents.map((document, index) => {
              const url = getUrl(document);

              const isBooks = document.title
                .toLowerCase()
                .includes("book");

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
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_25px_70px_rgba(16,42,86,0.10)]
                    md:p-9
                  "
                >
                  {/* NUMBER */}

                  <div className="absolute right-7 top-7 text-[11px] font-semibold tracking-[0.2em] text-[#102A56]/15">
                    0{index + 1}
                  </div>

                  {/* ICON */}

                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#102A56] text-[#F5F0E6]">
                    {isBooks ? (
                      <BookOpen size={21} />
                    ) : (
                      <Shirt size={21} />
                    )}
                  </div>

                  {/* CATEGORY */}

                  <p className="mt-8 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#102A56]/35">
                    {isBooks ? "Books" : "Uniform"}
                  </p>

                  {/* TITLE */}

                  <h3 className="mt-3 max-w-md text-2xl font-semibold tracking-[-0.03em] text-[#102A56]">
                    {document.title}
                  </h3>

                  {/* DESCRIPTION */}

                  {document.description && (
                    <p className="mt-4 max-w-xl text-sm leading-7 text-[#10203A]/50">
                      {document.description}
                    </p>
                  )}

                  {/* DOWNLOAD */}

                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        mt-8
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
                        {document.document_label || "Download PDF"}
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
                        mt-8
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        bg-[#102A56]/5
                        px-5
                        py-3
                        text-sm
                        font-medium
                        text-[#102A56]/40
                      "
                    >
                      <FileText size={15} />
                      Document unavailable
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ==================================================
          OFFICIAL PAGE NOTE
      ================================================== */}

      <section className="mx-auto max-w-[1400px] px-6 pb-20 md:px-10 md:pb-28">
        <div className="rounded-[2rem] bg-[#102A56] p-8 md:p-10">
          <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/35">
            Apex Public School
          </p>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/60">
            Please refer to the latest documents published by
            the school for current book and uniform information.
          </p>
        </div>
      </section>
    </main>
  );
}