"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  GraduationCap,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

import { supabase } from "@/lib/supabase/browser";

type Stage = {
  id: string;
  number?: string | null;
  title: string;
  classes: string | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
};

type Stream = {
  id: string;
  title: string;
  subjects: string | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
};

type Resource = {
  id: string;
  title: string;
  description: string | null;
  resource_type: string;
  url: string | null;
  file_url: string | null;
  sort_order: number;
  is_active: boolean;
};

const fallbackStages: Stage[] = [
  {
    id: "fallback-1",
    number: "01",
    title: "Primary School",
    classes: "Classes I – V",
    description:
      "Building strong foundations through curiosity, confidence, communication and joyful learning.",
    sort_order: 0,
    is_active: true,
  },
  {
    id: "fallback-2",
    number: "02",
    title: "Middle School",
    classes: "Classes VI – VIII",
    description:
      "Developing deeper subject understanding, independent thinking and collaborative learning.",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "fallback-3",
    number: "03",
    title: "Secondary School",
    classes: "Classes IX – X",
    description:
      "Preparing students for board-level learning with focused academic development and discipline.",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "fallback-4",
    number: "04",
    title: "Senior Secondary",
    classes: "Classes XI – XII",
    description:
      "Specialised academic pathways through Science, Commerce and Humanities.",
    sort_order: 3,
    is_active: true,
  },
];

const fallbackStreams: Stream[] = [
  {
    id: "fallback-s1",
    title: "Science",
    subjects:
      "English · Chemistry · Physics · Mathematics",
    description:
      "A focused pathway for students pursuing scientific and mathematical study.",
    sort_order: 0,
    is_active: true,
  },
  {
    id: "fallback-s2",
    title: "Commerce",
    subjects:
      "English · Accountancy · Business Studies · Mathematics",
    description:
      "A pathway centred on commerce, business and financial understanding.",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "fallback-s3",
    title: "Humanities",
    subjects:
      "English · History · Geography · Sociology",
    description:
      "A broad academic pathway exploring society, people, history and the world around us.",
    sort_order: 2,
    is_active: true,
  },
];

const fallbackResources: Resource[] = [
  {
    id: "fallback-r1",
    title: "Syllabus & Datesheet",
    description:
      "Subject syllabus and examination datesheets.",
    resource_type: "Link",
    url: "/syllabus-datesheet",
    file_url: null,
    sort_order: 0,
    is_active: true,
  },
  {
    id: "fallback-r2",
    title: "Faculty",
    description:
      "Meet the teaching and academic team.",
    resource_type: "Link",
    url: "/faculty",
    file_url: null,
    sort_order: 1,
    is_active: true,
  },
  {
    id: "fallback-r3",
    title: "Holiday Homework",
    description:
      "Class-wise holiday homework and academic assignments.",
    resource_type: "Link",
    url: "/holiday-homework",
    file_url: null,
    sort_order: 2,
    is_active: true,
  },
  {
    id: "fallback-r4",
    title: "CBSE Results",
    description:
      "Academic results and examination information.",
    resource_type: "Link",
    url: "/cbse-results",
    file_url: null,
    sort_order: 3,
    is_active: true,
  },
];

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 24,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-70px",
      }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export default function AcademicsPage() {
  const [stages, setStages] =
    useState<Stage[]>(fallbackStages);

  const [streams, setStreams] =
    useState<Stream[]>(fallbackStreams);

  const [resources, setResources] =
    useState<Resource[]>(
      fallbackResources
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadAcademicContent() {
      const [
        stageResult,
        streamResult,
        resourceResult,
      ] = await Promise.all([
        supabase
          .from("academic_stages")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", {
            ascending: true,
          }),

        supabase
          .from("academic_streams")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", {
            ascending: true,
          }),

        supabase
          .from("academic_resources")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", {
            ascending: true,
          }),
      ]);

      if (!mounted) return;

      if (stageResult.error) {
        console.error(
          "Academic stages load failed:",
          {
            message:
              stageResult.error.message,
            code: stageResult.error.code,
            details:
              stageResult.error.details,
            hint:
              stageResult.error.hint,
          }
        );
      } else if (
        stageResult.data &&
        stageResult.data.length > 0
      ) {
        setStages(
          stageResult.data as Stage[]
        );
      }

      if (streamResult.error) {
        console.error(
          "Academic streams load failed:",
          {
            message:
              streamResult.error.message,
            code: streamResult.error.code,
            details:
              streamResult.error.details,
            hint:
              streamResult.error.hint,
          }
        );
      } else if (
        streamResult.data &&
        streamResult.data.length > 0
      ) {
        setStreams(
          streamResult.data as Stream[]
        );
      }

      if (resourceResult.error) {
        console.error(
          "Academic resources load failed:",
          {
            message:
              resourceResult.error.message,
            code: resourceResult.error.code,
            details:
              resourceResult.error.details,
            hint:
              resourceResult.error.hint,
          }
        );
      } else if (
        resourceResult.data &&
        resourceResult.data.length > 0
      ) {
        setResources(
          resourceResult.data as Resource[]
        );
      }

      setLoading(false);
    }

    loadAcademicContent();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>

      <main className="overflow-hidden bg-[#F5F0E6] text-[#10203A]">

        {/* =================================================
            HERO
        ================================================== */}

        <section className="bg-[#102A56] text-white">

          <div className="mx-auto max-w-[1500px] px-6 pb-20 pt-44 md:px-10 md:pb-24 lg:px-14">

            <Reveal>

              <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/35">

                <span className="h-px w-9 bg-white/20" />

                Academic Journey

              </p>

              <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[0.88] tracking-[-0.07em] md:text-7xl lg:text-[7vw]">
                Learning that
                <br />
                grows with every stage.
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-7 text-white/50 md:text-lg">
                From foundational learning to specialised
                senior secondary pathways, Apex supports
                students through every stage of their academic
                journey.
              </p>

            </Reveal>

          </div>

        </section>

        {/* =================================================
            STAGES
        ================================================== */}

        <section className="bg-[#F5F0E6]">

          <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14 lg:py-32">

            <Reveal>

              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">

                <div>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#102A56]/40">
                    School stages
                  </p>

                  <h2 className="mt-5 max-w-md text-4xl font-semibold leading-[0.94] tracking-[-0.055em] text-[#102A56] md:text-6xl">
                    A clear path
                    <br />
                    from I to XII.
                  </h2>

                </div>

                <div className="flex items-end">

                  <p className="max-w-2xl text-lg leading-8 text-[#10203A]/55">
                    Each academic stage is designed around
                    the changing needs of students as they
                    grow in knowledge, confidence,
                    independence and responsibility.
                  </p>

                </div>

              </div>

            </Reveal>

            <div className="mt-14 grid gap-4">

              {stages.map((stage, index) => (
                <Reveal
                  key={stage.id}
                  delay={
                    Math.min(index, 5) *
                    0.05
                  }
                >

                  <article className="group grid gap-6 rounded-[2rem] border border-[#102A56]/10 bg-white/[0.5] p-6 transition duration-500 hover:-translate-y-1 hover:bg-white md:grid-cols-[90px_0.8fr_1.2fr] md:items-center md:p-8">

                    <div>

                      <p className="text-3xl font-semibold tracking-[-0.04em] text-[#102A56]/20">
                        {stage.number ||
                          String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                      </p>

                    </div>

                    <div>

                      <h3 className="text-2xl font-semibold tracking-[-0.035em] text-[#102A56]">
                        {stage.title}
                      </h3>

                      {stage.classes && (
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#102A56]/40">
                          {stage.classes}
                        </p>
                      )}

                    </div>

                    <div className="flex items-center justify-between gap-5">

                      <p className="max-w-xl text-sm leading-7 text-[#10203A]/50">
                        {stage.description}
                      </p>

                      <div className="hidden h-10 w-10 shrink-0 place-items-center rounded-full border border-[#102A56]/10 text-[#102A56]/40 transition group-hover:translate-x-1 group-hover:text-[#102A56] md:grid">
                        <ArrowRight
                          size={15}
                        />
                      </div>

                    </div>

                  </article>

                </Reveal>
              ))}

            </div>

          </div>

        </section>

        {/* =================================================
            SENIOR SECONDARY
        ================================================== */}

        <section className="bg-[#102A56] text-white">

          <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14 lg:py-32">

            <Reveal>

              <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">

                <div>

                  <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">
                    Senior Secondary
                  </p>

                  <h2 className="mt-6 text-4xl font-semibold leading-[0.94] tracking-[-0.055em] md:text-6xl">
                    Choose the
                    <br />
                    direction that fits.
                  </h2>

                </div>

                <p className="max-w-2xl text-lg leading-8 text-white/50">
                  Students entering Classes XI and XII
                  can pursue a specialised pathway aligned
                  with their interests and future academic
                  goals.
                </p>

              </div>

            </Reveal>

            <div className="mt-14 grid gap-4 md:grid-cols-3">

              {streams.map(
                (stream, index) => (
                  <Reveal
                    key={stream.id}
                    delay={
                      index * 0.07
                    }
                  >

                    <article className="group flex min-h-[360px] flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 transition duration-500 hover:-translate-y-1 hover:bg-white/[0.055] md:p-8">

                      <div>

                        <div className="flex items-start justify-between">

                          <span className="text-[9px] uppercase tracking-[0.22em] text-white/25">
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <div className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/60">
                            <GraduationCap
                              size={17}
                              strokeWidth={
                                1.5
                              }
                            />
                          </div>

                        </div>

                        <h3 className="mt-20 text-3xl font-semibold tracking-[-0.045em]">
                          {stream.title}
                        </h3>

                        {stream.subjects && (
                          <p className="mt-5 text-sm leading-6 text-white/55">
                            {stream.subjects}
                          </p>
                        )}

                      </div>

                      {stream.description && (
                        <p className="mt-8 border-t border-white/10 pt-6 text-xs leading-6 text-white/35">
                          {
                            stream.description
                          }
                        </p>
                      )}

                    </article>

                  </Reveal>
                )
              )}

            </div>

          </div>

        </section>

        {/* =================================================
            RESOURCES
        ================================================== */}

        <section className="bg-[#E9E2D5]">

          <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14 lg:py-32">

            <Reveal>

              <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">

                <div>

                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#102A56]/40">
                    Academic resources
                  </p>

                  <h2 className="mt-5 text-4xl font-semibold leading-[0.94] tracking-[-0.055em] text-[#102A56] md:text-6xl">
                    Everything students
                    <br />
                    need, in one place.
                  </h2>

                </div>

                <p className="max-w-md text-sm leading-7 text-[#10203A]/45">
                  Syllabus, datesheets, faculty information,
                  holiday homework and results can all be
                  accessed from the academic resources below.
                </p>

              </div>

            </Reveal>

            <div className="mt-14 grid gap-4 md:grid-cols-2">

              {resources.map(
                (resource, index) => {
                  const destination =
                    resource.url ||
                    resource.file_url ||
                    "#";

                  return (
                    <Reveal
                      key={resource.id}
                      delay={
                        index * 0.05
                      }
                    >

                      <a
                        href={destination}
                        target={
                          destination.startsWith(
                            "http"
                          )
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          destination.startsWith(
                            "http"
                          )
                            ? "noreferrer"
                            : undefined
                        }
                        className="group flex min-h-[150px] items-center justify-between rounded-[2rem] border border-[#102A56]/10 bg-white/[0.52] p-7 transition duration-500 hover:-translate-y-1 hover:bg-white md:p-8"
                      >

                        <div className="flex items-start gap-5">

                          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#102A56]/10 bg-[#102A56]/[0.035] text-[#102A56]">
                            <BookOpen
                              size={18}
                              strokeWidth={1.5}
                            />
                          </div>

                          <div>

                            <p className="text-xl font-semibold tracking-[-0.03em] text-[#102A56]">
                              {resource.title}
                            </p>

                            {resource.description && (
                              <p className="mt-2 max-w-md text-sm leading-6 text-[#10203A]/45">
                                {
                                  resource.description
                                }
                              </p>
                            )}

                          </div>

                        </div>

                        <ArrowRight
                          size={18}
                          className="shrink-0 text-[#102A56]/35 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#102A56]"
                        />

                      </a>

                    </Reveal>
                  );
                }
              )}

            </div>

          </div>

        </section>

        {/* =================================================
            ACADEMIC CTA
        ================================================== */}

        <section className="bg-[#F5F0E6]">

          <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14">

            <Reveal>

              <div className="rounded-[2rem] bg-[#102A56] p-7 text-white md:p-10 lg:p-14">

                <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">

                  <div>

                    <p className="text-[10px] uppercase tracking-[0.28em] text-white/30">
                      Continue exploring
                    </p>

                    <h2 className="mt-6 max-w-3xl text-4xl font-semibold leading-[0.94] tracking-[-0.055em] md:text-6xl">
                      Learning extends
                      beyond the classroom.
                    </h2>

                    <p className="mt-6 max-w-xl text-sm leading-7 text-white/45 md:text-base">
                      Discover the people, activities and
                      experiences that make the Apex academic
                      journey complete.
                    </p>

                  </div>

                  <div className="flex flex-wrap gap-3">

                    <Link
                      href="/faculty"
                      className="inline-flex items-center gap-2 rounded-full bg-[#F5F0E6] px-5 py-3.5 text-sm font-semibold text-[#102A56] transition hover:-translate-y-1 hover:bg-white"
                    >
                      Meet the faculty

                      <ArrowRight
                        size={15}
                      />
                    </Link>

                    <Link
                      href="/notices"
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3.5 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
                    >
                      Academic notices
                    </Link>

                  </div>

                </div>

              </div>

            </Reveal>

          </div>

        </section>

      </main>


      {loading && (
        <div className="pointer-events-none fixed bottom-5 right-5 z-[200] flex items-center gap-2 rounded-full border border-white/10 bg-[#102A56]/90 px-4 py-2 text-[9px] uppercase tracking-[0.17em] text-white/45 shadow-xl backdrop-blur-md">
          <Loader2
            size={12}
            className="animate-spin"
          />
          Loading academics
        </div>
      )}
    </>
  );
}