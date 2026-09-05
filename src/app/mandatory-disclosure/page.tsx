import {
  ArrowUpRight,
  FileCheck2,
  FileText,
  ShieldCheck,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type DisclosureDocument = {
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

export default async function MandatoryDisclosurePage() {
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
    .eq("category", "mandatory-disclosure")
    .eq("is_active", true)
    .order("sort_order", {
      ascending: true,
    });

  const documents: DisclosureDocument[] =
    !error && data
      ? (data as DisclosureDocument[])
      : [];

  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#10203A]">
      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative overflow-hidden bg-[#102A56]">
        <div className="absolute -left-32 -top-32 h-[430px] w-[430px] rounded-full border border-white/10" />

        <div className="absolute -right-40 top-10 h-[520px] w-[520px] rounded-full border border-white/10" />

        <div className="absolute bottom-[-180px] left-[35%] h-[360px] w-[360px] rounded-full border border-white/[0.06]" />

        <div className="relative mx-auto max-w-[1500px] px-6 py-24 md:px-10 md:py-32">
          <div className="max-w-5xl">
            <div className="flex items-start gap-5">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/10 !text-[#F5F0E6]">
                <ShieldCheck
                  size={24}
                  className="!text-[#F5F0E6]"
                />
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-[#F5F0E6]/50">
                  CBSE Compliance
                </p>

                <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl lg:text-7xl">
                  Mandatory Public Disclosure
                </h1>

                <p className="mt-6 max-w-3xl text-sm leading-7 text-white/55 md:text-base">
                  Official school information and disclosure
                  documents published by Apex Public School.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SCHOOL INFORMATION
      ================================================== */}

      <section className="mx-auto max-w-[1500px] px-6 pt-12 md:px-10 md:pt-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[1.75rem] border border-[#102A56]/10 bg-white p-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#102A56]/35">
              CBSE Affiliation No.
            </p>

            <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#102A56]">
              2730184
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-[#102A56]/10 bg-white p-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#102A56]/35">
              School Code
            </p>

            <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#102A56]">
              85037
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-[#102A56]/10 bg-white p-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#102A56]/35">
              Academic Session
            </p>

            <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#102A56]">
              2026–27
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-[#102A56]/10 bg-white p-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#102A56]/35">
              Campus Area
            </p>

            <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#102A56]">
              16,187 sq.m.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          DOCUMENT LIST
      ================================================== */}

      <section className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28">
        <div className="max-w-4xl">
          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#102A56]/35">
            Official Documents
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-[#102A56] md:text-5xl">
            Disclosure documents
          </h2>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-[#10203A]/55 md:text-base">
            Access the official disclosure information and
            supporting documents published by Apex Public School.
          </p>
        </div>

        {documents.length === 0 ? (
          <div className="mt-12 rounded-[2rem] bg-[#102A56] p-10 text-white md:p-14">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/10 !text-[#F5F0E6]">
                <FileText
                  size={20}
                  className="!text-[#F5F0E6]"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">
                  Documents unavailable
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-7 text-white/50">
                  No mandatory disclosure documents are currently
                  published.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-12 space-y-4">
            {documents.map((document, index) => {
              const url =
                document.document_url ||
                document.external_url ||
                "";

              const isExternal =
                !document.document_url &&
                !!document.external_url;

              return (
                <article
                  key={document.id}
                  className="
                    group
                    rounded-[2rem]
                    border
                    border-[#102A56]/10
                    bg-white
                    p-5
                    transition
                    duration-300
                    hover:-translate-y-0.5
                    hover:shadow-[0_25px_70px_rgba(16,42,86,0.08)]
                    md:p-7
                  "
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                    {/* ICON */}

                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#102A56] !text-[#F5F0E6]">
                      {isExternal ? (
                        <ArrowUpRight
                          size={19}
                          className="!text-[#F5F0E6]"
                        />
                      ) : (
                        <FileCheck2
                          size={19}
                          className="!text-[#F5F0E6]"
                        />
                      )}
                    </div>

                    {/* INFORMATION */}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#102A56]/5 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#102A56]/55">
                          Document{" "}
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        {document.document_url && (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                            PDF
                          </span>
                        )}

                        {isExternal && (
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-amber-700">
                            Website
                          </span>
                        )}
                      </div>

                      <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-[#102A56] md:text-xl">
                        {document.title}
                      </h3>

                      {document.description && (
                        <p className="mt-2 max-w-4xl text-sm leading-6 text-[#10203A]/45">
                          {document.description}
                        </p>
                      )}
                    </div>

                    {/* OPEN */}

                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="
                          group
                          inline-flex
                          shrink-0
                          items-center
                          justify-center
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
                          hover:shadow-[0_12px_30px_rgba(16,42,86,0.18)]
                        "
                      >
                        <span className="!text-[#F5F0E6]">
                          {document.document_label ||
                            "View document"}
                        </span>

                        <ArrowUpRight
                          size={15}
                          className="
                            !text-[#F5F0E6]
                            transition-transform
                            duration-300
                            group-hover:translate-x-1
                          "
                        />
                      </a>
                    ) : (
                      <span
                        className="
                          inline-flex
                          shrink-0
                          items-center
                          gap-2
                          rounded-full
                          bg-[#102A56]/5
                          px-5
                          py-3
                          text-sm
                          font-medium
                          !text-[#102A56]/35
                        "
                      >
                        <span className="!text-[#102A56]/35">
                          Unavailable
                        </span>
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ==================================================
          SCHOOL DETAILS
      ================================================== */}

      <section className="mx-auto max-w-[1500px] px-6 pb-20 md:px-10 md:pb-28">
        <div className="overflow-hidden rounded-[2.5rem] bg-[#102A56]">
          <div className="grid gap-0 lg:grid-cols-[1fr_1.4fr]">
            <div className="border-b border-white/10 p-8 lg:border-b-0 lg:border-r lg:p-10">
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/35">
                Apex Public School
              </p>

              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-white">
                Official school details
              </h3>
            </div>

            <div className="p-8 lg:p-10">
              <div className="space-y-5">
                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-white/30">
                    Address
                  </p>

                  <p className="mt-2 text-sm leading-7 text-white/60">
                    Apex Road, B-Block, Sant Nagar,
                    Burari, Delhi – 110084
                  </p>
                </div>

                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-white/30">
                    Phone
                  </p>

                  <p className="mt-2 text-sm text-white/60">
                    09990061747
                  </p>
                </div>

                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-white/30">
                    Email
                  </p>

                  <p className="mt-2 text-sm text-white/60">
                    contacts.apexschool@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}