"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ExternalLink,
  FileText,
  Loader2,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import { supabase } from "@/lib/supabase/browser";

type Notice = {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string | null;
  content: string | null;
  notice_date: string;
  expiry_date: string | null;
  document_url: string | null;
  external_url: string | null;
  is_pinned: boolean;
  is_active: boolean;
  sort_order: number;
};

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
        y: 25,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
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

function formatDate(date: string) {
  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function NoticesPage() {
  const [notices, setNotices] =
    useState<Notice[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadNotices() {
      const { data, error } =
        await supabase
          .from("notices")
          .select("*")
          .eq("is_active", true)
          .or(
            "expiry_date.is.null,expiry_date.gte." +
              new Date()
                .toISOString()
                .slice(0, 10)
          )
          .order("is_pinned", {
            ascending: false,
          })
          .order("sort_order", {
            ascending: true,
          })
          .order("notice_date", {
            ascending: false,
          });

      if (!mounted) return;

      if (error) {
        console.error(
          "Notices load failed:",
          error
        );

        setNotices([]);
      } else {
        setNotices(
          (data || []) as Notice[]
        );
      }

      setLoading(false);
    }

    loadNotices();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <Header />

      <main className="overflow-hidden bg-[#F5F0E6] text-[#10203A]">

        {/* =================================================
            HERO
        ================================================== */}

        <section className="bg-[#102A56] text-white">

          <div className="mx-auto max-w-[1500px] px-6 pb-20 pt-48 md:px-10 md:pb-24 lg:px-14">

            <Reveal>

              <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">

                <span className="h-px w-9 bg-white/25" />

                Apex Public School
              </p>

              <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[0.88] tracking-[-0.07em] md:text-7xl lg:text-[7vw]">
                Notices &
                <br />
                announcements.
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-7 text-white/55 md:text-lg">
                Important school communications,
                circulars, updates and announcements
                for the Apex community.
              </p>

            </Reveal>

          </div>

        </section>

        {/* =================================================
            NOTICE LIST
        ================================================== */}

        <section>

          <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14">

            {loading ? (
              <div className="flex min-h-[400px] items-center justify-center">

                <div className="flex items-center gap-3 text-sm text-[#102A56]/45">

                  <Loader2
                    size={20}
                    className="animate-spin"
                  />

                  Loading notices...

                </div>

              </div>
            ) : notices.length === 0 ? (
              <div className="rounded-[2rem] border border-[#102A56]/10 bg-white/[0.45] p-12 text-center">

                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#102A56]/[0.05] text-[#102A56]">

                  <FileText size={23} />

                </div>

                <h2 className="mt-6 text-2xl font-semibold text-[#102A56]">
                  No current notices
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#10203A]/45">
                  New school announcements will
                  appear here when published.
                </p>

              </div>
            ) : (
              <div className="grid gap-4">

                {notices.map(
                  (notice, index) => (
                    <Reveal
                      key={notice.id}
                      delay={
                        Math.min(
                          index,
                          5
                        ) * 0.04
                      }
                    >

                      <article
                        className={`
                          group
                          rounded-[2rem]
                          border
                          p-6
                          transition
                          duration-500
                          md:p-8
                          ${
                            notice.is_pinned
                              ? "border-[#102A56]/20 bg-[#102A56] text-white"
                              : "border-[#102A56]/10 bg-white/[0.48] text-[#10203A] hover:-translate-y-1 hover:bg-white"
                          }
                        `}
                      >

                        <div className="grid gap-7 lg:grid-cols-[120px_1fr_auto] lg:items-center">

                          {/* DATE */}

                          <div>

                            <p
                              className={`text-[9px] font-semibold uppercase tracking-[0.23em] ${
                                notice.is_pinned
                                  ? "text-white/35"
                                  : "text-[#102A56]/35"
                              }`}
                            >
                              {formatDate(
                                notice.notice_date
                              )}
                            </p>

                            <div
                              className={`mt-4 h-px w-9 ${
                                notice.is_pinned
                                  ? "bg-white/20"
                                  : "bg-[#102A56]/15"
                              }`}
                            />

                          </div>

                          {/* CONTENT */}

                          <div>

                            <div className="flex flex-wrap items-center gap-2">

                              <span
                                className={`rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] ${
                                  notice.is_pinned
                                    ? "bg-white/10 text-white/65"
                                    : "bg-[#102A56]/[0.06] text-[#102A56]/55"
                                }`}
                              >
                                {notice.category}
                              </span>

                              {notice.is_pinned && (
                                <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.15em] text-amber-200/80">

                                  <Star
                                    size={10}
                                    fill="currentColor"
                                  />

                                  Important

                                </span>
                              )}

                            </div>

                            <h2
                              className={`mt-4 text-2xl font-semibold leading-tight tracking-[-0.03em] ${
                                notice.is_pinned
                                  ? "text-white"
                                  : "text-[#102A56]"
                              }`}
                            >
                              {notice.title}
                            </h2>

                            {notice.short_description && (
                              <p
                                className={`mt-3 max-w-3xl text-sm leading-6 ${
                                  notice.is_pinned
                                    ? "text-white/55"
                                    : "text-[#10203A]/45"
                                }`}
                              >
                                {
                                  notice.short_description
                                }
                              </p>
                            )}

                          </div>

                          {/* ACTIONS */}

                          <div className="flex flex-wrap gap-2">

                            {notice.document_url && (
                              <a
                                href={
                                  notice.document_url
                                }
                                target="_blank"
                                rel="noreferrer"
                                className={`
                                  inline-flex
                                  items-center
                                  gap-2
                                  rounded-full
                                  px-4
                                  py-3
                                  text-xs
                                  font-semibold
                                  transition
                                  ${
                                    notice.is_pinned
                                      ? "bg-[#F5F0E6] text-[#102A56] hover:bg-white"
                                      : "bg-[#102A56] text-white hover:bg-[#1B3D73]"
                                  }
                                `}
                              >
                                <FileText
                                  size={14}
                                />
                                View document
                              </a>
                            )}

                            {notice.external_url && (
                              <a
                                href={
                                  notice.external_url
                                }
                                target="_blank"
                                rel="noreferrer"
                                className={`
                                  inline-flex
                                  items-center
                                  gap-2
                                  rounded-full
                                  border
                                  px-4
                                  py-3
                                  text-xs
                                  font-semibold
                                  transition
                                  ${
                                    notice.is_pinned
                                      ? "border-white/15 text-white/75 hover:bg-white/10"
                                      : "border-[#102A56]/10 text-[#102A56]/65 hover:bg-[#102A56]/[0.05]"
                                  }
                                `}
                              >
                                <ExternalLink
                                  size={14}
                                />
                                Open link
                              </a>
                            )}

                            {!notice.document_url &&
                              !notice.external_url && (
                                <Link
                                  href={`/notices/${notice.slug}`}
                                  className={`
                                    group/link
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    px-4
                                    py-3
                                    text-xs
                                    font-semibold
                                    transition
                                    ${
                                      notice.is_pinned
                                        ? "border-white/15 text-white/75 hover:bg-white/10"
                                        : "border-[#102A56]/10 text-[#102A56]/65 hover:bg-[#102A56]/[0.05]"
                                    }
                                  `}
                                >
                                  Read notice

                                  <ArrowRight
                                    size={14}
                                    className="transition-transform group-hover/link:translate-x-1"
                                  />
                                </Link>
                              )}

                          </div>

                        </div>

                      </article>

                    </Reveal>
                  )
                )}

              </div>
            )}

          </div>

        </section>

        {/* =================================================
            CTA
        ================================================== */}

        <section className="bg-[#E9E2D5]">

          <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-24 lg:px-14">

            <div className="flex flex-col justify-between gap-8 border-t border-[#102A56]/10 pt-8 sm:flex-row sm:items-end">

              <div>

                <p className="text-[9px] uppercase tracking-[0.25em] text-[#102A56]/35">
                  Apex community
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-[#102A56] md:text-4xl">
                  Stay informed with Apex.
                </h2>

              </div>

              <Link
  href="/contact"
  className="
    group
    inline-flex
    items-center
    gap-2
    rounded-full
    bg-[#102A56]
    px-5
    py-3.5
    text-sm
    font-semibold
    !text-[#F5F0E6]
    transition
    duration-300
    hover:-translate-y-1
    hover:bg-[#1B3D73]
  "
>
  <span className="!text-[#F5F0E6]">
    Contact the school
  </span>

  <ArrowRight
    size={15}
    className="
      !text-[#F5F0E6]
      transition-transform
      duration-300
      group-hover:translate-x-1
    "
  />
</Link>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}