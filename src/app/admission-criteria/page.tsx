import {
  ArrowUpRight,
  CheckCircle2,
  FileText,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type Requirement = string;

type CriterionDocument = {
  title: string;
  url: string | null;
  label: string;
};

type AdmissionCriterion = {
  id: string;
  section_key: string;
  section_title: string;
  eyebrow: string | null;
  description: string | null;
  content: string | null;
  requirements: Requirement[];
  documents: CriterionDocument[];
  sort_order: number;
};

export default async function AdmissionCriteriaPage() {
  const { data, error } = await supabase
    .from("admission_criteria")
    .select(`
      id,
      section_key,
      section_title,
      eyebrow,
      description,
      content,
      requirements,
      documents,
      sort_order
    `)
    .eq("is_active", true)
    .order("sort_order", {
      ascending: true,
    });

  const sections =
    !error && data
      ? (data as AdmissionCriterion[])
      : [];

  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#10203A]">

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative overflow-hidden bg-[#102A56]">

        <div className="absolute -left-32 -top-32 h-[430px] w-[430px] rounded-full border border-white/10" />

        <div className="absolute -right-40 top-16 h-[520px] w-[520px] rounded-full border border-white/10" />

        <div className="relative mx-auto max-w-[1500px] px-6 py-24 md:px-10 md:py-32">

          <div className="flex items-start gap-5">

            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-[#F5F0E6]">
              <GraduationCap size={24} />
            </div>

            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-[#F5F0E6]/50">
                Admissions
              </p>

              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl lg:text-7xl">
                Admission Criteria
              </h1>

              <p className="mt-6 max-w-3xl text-sm leading-7 text-white/55 md:text-base">
                Admission requirements and criteria published by
                Apex Public School for the applicable academic
                session.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* ==================================================
          INTRO
      ================================================== */}

      <section className="mx-auto max-w-[1500px] px-6 pt-14 md:px-10 md:pt-20">

        <div className="rounded-[2rem] border border-[#102A56]/10 bg-white p-7 md:p-10">

          <div className="flex items-start gap-4">

            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#102A56] text-white">
              <ShieldCheck size={18} />
            </div>

            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#102A56]/35">
                Apex Public School
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#102A56]">
                Admission information
              </h2>

              <p className="mt-3 max-w-4xl text-sm leading-7 text-[#10203A]/50">
                Please read the criteria applicable to the class
                for which admission is being sought and refer to
                the latest school notification where applicable.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          SECTIONS
      ================================================== */}

      <section className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28">

        <div className="space-y-7">

          {sections.map(
            (section, index) => (
              <article
                key={section.id}
                className="overflow-hidden rounded-[2.25rem] border border-[#102A56]/10 bg-white"
              >

                {/* HEADER */}

                <div className="border-b border-[#102A56]/10 bg-[#102A56] p-7 text-white md:p-9">

                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                    <div>

                      <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/35">
                        {section.eyebrow ||
                          `Criterion ${String(index + 1).padStart(2, "0")}`}
                      </p>

                      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
                        {section.section_title}
                      </h2>

                    </div>

                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10">
                      <GraduationCap
                        size={18}
                      />
                    </div>

                  </div>

                  {section.description && (
                    <p className="mt-5 max-w-4xl text-sm leading-7 text-white/55">
                      {section.description}
                    </p>
                  )}

                </div>

                {/* BODY */}

                <div className="p-7 md:p-9">

                  {section.content && (
                    <div className="rounded-2xl bg-[#F4F1EA] p-5 md:p-6">

                      <p className="text-sm leading-7 text-[#10203A]/65">
                        {section.content}
                      </p>

                    </div>
                  )}

                  {/* REQUIREMENTS */}

                  {section.requirements?.length > 0 && (
                    <div className="mt-7">

                      <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#102A56]/35">
                        Admission requirements
                      </p>

                      <div className="mt-4 space-y-3">

                        {section.requirements.map(
                          (item, requirementIndex) => (
                            <div
                              key={`${section.id}-${requirementIndex}`}
                              className="flex items-start gap-3 rounded-2xl border border-[#102A56]/8 bg-[#FAF8F3] p-4"
                            >

                              <CheckCircle2
                                size={17}
                                className="mt-0.5 shrink-0 text-[#102A56]"
                              />

                              <p className="text-sm leading-6 text-[#10203A]/65">
                                {item}
                              </p>

                            </div>
                          )
                        )}

                      </div>

                    </div>
                  )}

                  {/* DOCUMENTS */}

                  {section.documents?.length > 0 && (
                    <div className="mt-8">

                      <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#102A56]/35">
                        Supporting documents
                      </p>

                      <div className="mt-4 grid gap-3 md:grid-cols-2">

                        {section.documents.map(
                          (
                            document,
                            documentIndex
                          ) => {

                            const hasUrl =
                              !!document.url;

                            return (
                              <div
                                key={`${section.id}-document-${documentIndex}`}
                                className="flex items-center gap-4 rounded-2xl border border-[#102A56]/10 bg-white p-4"
                              >

                                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#102A56]/5 text-[#102A56]">
                                  <FileText
                                    size={16}
                                  />
                                </div>

                                <div className="min-w-0 flex-1">

                                  <p className="text-sm font-medium text-[#102A56]">
                                    {document.title}
                                  </p>

                                  <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-[#10203A]/35">
                                    {document.label}
                                  </p>

                                </div>

                                {hasUrl ? (
                                  <a
                                    href={
                                      document.url ||
                                      "#"
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#102A56] text-white"
                                    aria-label={
                                      `Open ${document.title}`
                                    }
                                  >
                                    <ArrowUpRight
                                      size={15}
                                    />
                                  </a>
                                ) : (
                                  <span className="rounded-full bg-[#102A56]/5 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#102A56]/35">
                                    School document
                                  </span>
                                )}

                              </div>
                            );
                          }
                        )}

                      </div>

                    </div>
                  )}

                </div>

              </article>
            )
          )}

        </div>

      </section>

      {/* ==================================================
          CONTACT / NOTE
      ================================================== */}

      <section className="mx-auto max-w-[1500px] px-6 pb-20 md:px-10 md:pb-28">

        <div className="rounded-[2.5rem] bg-[#102A56] p-8 md:p-10">

          <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/35">
            Admission Enquiries
          </p>

          <h3 className="mt-4 text-2xl font-semibold text-white">
            Apex Public School
          </h3>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/55">
            Apex Road, B-Block, Sant Nagar, Burari,
            Delhi – 110084
          </p>

          <div className="mt-5 flex flex-wrap gap-3">

            <a
              href="tel:09990061747"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold !text-[#102A56]"
            >
              Call 09990061747
            </a>

            <a
              href="mailto:contacts.apexschool@gmail.com"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white"
            >
              Email the school
            </a>

          </div>

        </div>

      </section>

    </main>
  );
}