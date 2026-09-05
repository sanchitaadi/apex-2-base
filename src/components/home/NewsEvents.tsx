"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  Loader2,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

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
  image_url: string | null;
  external_url: string | null;
  homepage_button_label: string | null;
  homepage_button_url: string | null;
  is_pinned: boolean;
  is_active: boolean;
  sort_order: number;
};

const fallbackNotices: Notice[] = [
  {
    id: "fallback-1",
    title: "Admissions Open 2026–2027",
    slug: "admissions-open-2026-2027",
    category: "Admission",
    short_description:
      "Admissions are currently open for Classes I to IX.",
    content: null,
    notice_date: "2026-07-01",
    expiry_date: null,
    document_url: null,
    image_url: null,
    external_url: "/admissions",
    homepage_button_label: "View admissions",
    homepage_button_url: "/admissions",
    is_pinned: true,
    is_active: true,
    sort_order: 0,
  },
  {
    id: "fallback-2",
    title: "SLFRC Election Notice",
    slug: "slfrc-election-notice",
    category: "General",
    short_description:
      "Important school notice regarding the SLFRC election.",
    content: null,
    notice_date: "2026-07-04",
    expiry_date: null,
    document_url: null,
    image_url: null,
    external_url: "/notices",
    homepage_button_label: "Read notice",
    homepage_button_url: "/notices",
    is_pinned: false,
    is_active: true,
    sort_order: 1,
  },
  {
    id: "fallback-3",
    title: "Summer Vacation Notice 2026",
    slug: "summer-vacation-notice-2026",
    category: "Holiday",
    short_description:
      "Important information for students and parents regarding summer vacation.",
    content: null,
    notice_date: "2026-05-22",
    expiry_date: null,
    document_url: null,
    image_url: null,
    external_url: "/notices",
    homepage_button_label: "Read notice",
    homepage_button_url: "/notices",
    is_pinned: false,
    is_active: true,
    sort_order: 2,
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
        y: 22,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-60px",
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
  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function NewsEvents() {
  const [notices, setNotices] =
    useState<Notice[]>(fallbackNotices);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadNotices() {
      try {
        const { data, error } = await supabase
          .from("notices")
          .select(
            `
              id,
              title,
              slug,
              category,
              short_description,
              content,
              notice_date,
              expiry_date,
              document_url,
              image_url,
              external_url,
              homepage_button_label,
              homepage_button_url,
              is_pinned,
              is_active,
              sort_order
            `
          )
          .eq("is_active", true)
          .order("is_pinned", { ascending: false })
          .order("notice_date", { ascending: false })
          .order("sort_order", { ascending: true })
          .limit(8);

        if (!mounted) return;

        if (error) {
          console.error("Homepage notices load failed:", {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          });

          // Keep the existing fallback notices visible when Supabase is
          // temporarily unavailable or RLS has not yet been configured.
          setLoading(false);
          return;
        }

        const normalized: Notice[] = (data || [])
          .map((row: any, index: number) => ({
            id: String(row.id ?? `notice-${index}`),
            title: String(row.title ?? "School Notice"),
            slug: String(
              row.slug ??
                String(row.title ?? `notice-${index}`)
                  .toLowerCase()
                  .trim()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-+|-+$/g, "")
            ),
            category: String(row.category ?? "General"),
            short_description:
              row.short_description ??
              row.description ??
              row.summary ??
              null,
            content: row.content ?? row.description ?? null,
            notice_date:
              row.notice_date ??
              row.date ??
              (typeof row.created_at === "string"
                ? row.created_at.slice(0, 10)
                : null) ??
              new Date().toISOString().slice(0, 10),
            expiry_date: row.expiry_date ?? null,
            document_url: row.document_url ?? null,
            image_url: row.image_url ?? null,
            external_url: row.external_url ?? null,
            homepage_button_label:
              row.homepage_button_label ?? "Read more",
            homepage_button_url:
              row.homepage_button_url ??
              (row.slug ? `/notices/${row.slug}` : "/notices"),
            is_pinned: Boolean(
              row.is_pinned ?? row.pinned ?? row.featured ?? false
            ),
            is_active:
              row.is_active === undefined
                ? true
                : Boolean(row.is_active),
            sort_order: Number(row.sort_order ?? index),
          }))
          .filter((notice) => notice.is_active)
          .sort((a, b) => {
            if (a.is_pinned !== b.is_pinned) {
              return a.is_pinned ? -1 : 1;
            }

            const dateA = new Date(`${a.notice_date}T00:00:00`).getTime();
            const dateB = new Date(`${b.notice_date}T00:00:00`).getTime();

            if (!Number.isNaN(dateA) && !Number.isNaN(dateB) && dateA !== dateB) {
              return dateB - dateA;
            }

            return a.sort_order - b.sort_order;
          })
          .slice(0, 8);

        if (normalized.length > 0) {
          setNotices(normalized);
        }

        setLoading(false);
      } catch (error) {
        console.error("Homepage notices unexpected error:", error);

        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadNotices();

    return () => {
      mounted = false;
    };
  }, []);

  const featured = useMemo(() => {
    return notices.slice(0, 1)[0];
  }, [notices]);

  const secondary = useMemo(() => {
    return notices.slice(1, 4);
  }, [notices]);

  return (
    <section
      id="notices"
      className="
        scroll-mt-36
        bg-[#102A56]
        text-white
      "
    >
      <div
        className="
          mx-auto
          max-w-[1500px]
          px-6
          py-20
          md:px-10
          md:py-28
          lg:px-14
          lg:py-32
        "
      >
        {/* =================================================
            HEADER
        ================================================== */}

        <Reveal>
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

            <div className="max-w-3xl">

              <div
                className="
                  flex
                  items-center
                  gap-3
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.3em]
                  text-white/35
                "
              >
                <span className="h-px w-9 bg-white/20" />

                Notices & Events
              </div>

              <h2
                className="
                  mt-6
                  text-4xl
                  font-semibold
                  leading-[0.92]
                  tracking-[-0.06em]
                  text-white
                  md:text-6xl
                "
              >
                What&apos;s happening
                <br />
                at Apex.
              </h2>

              <p
                className="
                  mt-6
                  max-w-2xl
                  text-sm
                  leading-7
                  !text-white/55
                  md:text-base
                "
              >
                Stay informed about school announcements,
                admissions, activities, holidays and important
                communications.
              </p>

            </div>

            {/* VIEW ALL NOTICES */}

            <Link
              href="/notices"
              className="
                group
                inline-flex
                shrink-0
                items-center
                gap-3
                rounded-full
                border
                border-white/20
                bg-white/[0.035]
                px-6
                py-3.5
                text-sm
                font-semibold
                !text-white
                backdrop-blur-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-white/[0.10]
                hover:!text-white
                hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)]
              "
            >
              <span className="!text-white">
                View all notices
              </span>

              <span
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F5F0E6]
                  !text-[#102A56]
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                "
              >
                <ArrowRight
                  size={14}
                  strokeWidth={2.4}
                  className="!text-[#102A56]"
                />
              </span>
            </Link>

          </div>
        </Reveal>

        {/* =================================================
            LOADING
        ================================================== */}

        {loading ? (
          <div
            className="
              mt-12
              flex
              min-h-[360px]
              items-center
              justify-center
              rounded-[2rem]
              border
              border-white/10
              bg-white/[0.035]
            "
          >
            <div className="flex items-center gap-3 !text-white/45">
              <Loader2
                size={18}
                className="animate-spin"
              />

              Loading notices...
            </div>
          </div>
        ) : (
          <div className="mt-12 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">

            {/* =================================================
                FEATURED NOTICE
            ================================================== */}

            {featured && (
              <Reveal>
                <article
                  className="
                    group
                    relative
                    flex
                    min-h-[500px]
                    flex-col
                    justify-between
                    overflow-hidden
                    rounded-[2rem]
                    bg-[#F5F0E6]
                    p-7
                    !text-[#102A56]
                    md:p-10
                  "
                >
                  <div>

                    <div className="flex flex-wrap items-center justify-between gap-3">

                      <span
                        className="
                          rounded-full
                          bg-[#102A56]/[0.07]
                          px-3
                          py-1.5
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.16em]
                          !text-[#102A56]/70
                        "
                      >
                        {featured.category}
                      </span>

                      {featured.is_pinned && (
                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[0.16em]
                            text-amber-700/80
                          "
                        >
                          <Star
                            size={11}
                            fill="currentColor"
                          />
                          Important
                        </span>
                      )}

                    </div>

                    <p
                      className="
                        mt-10
                        flex
                        items-center
                        gap-2
                        text-[10px]
                        uppercase
                        tracking-[0.2em]
                        !text-[#102A56]/40
                      "
                    >
                      <CalendarDays size={12} />

                      {formatDate(
                        featured.notice_date
                      )}
                    </p>

                    <h3
                      className="
                        mt-6
                        max-w-2xl
                        text-4xl
                        font-semibold
                        leading-[0.95]
                        tracking-[-0.055em]
                        !text-[#102A56]
                        md:text-5xl
                      "
                    >
                      {featured.title}
                    </h3>

                    {featured.image_url && (
                      <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-[#102A56]/10">
                        <img
                          src={featured.image_url}
                          alt={featured.title}
                          className="h-64 w-full object-cover md:h-80"
                        />
                      </div>
                    )}

                    {featured.short_description && (
                      <p
                        className="
                          mt-6
                          max-w-xl
                          text-sm
                          leading-7
                          !text-[#10203A]/55
                          md:text-base
                        "
                      >
                        {featured.short_description}
                      </p>
                    )}

                  </div>

                  {/* FEATURED ACTION */}

                  <div className="mt-10 flex flex-wrap gap-3">

                    {featured.external_url ? (
                      <a
                        href={featured.external_url}
                        className="
                          group/button
                          inline-flex
                          items-center
                          gap-3
                          rounded-full
                          bg-[#102A56]
                          px-6
                          py-3.5
                          text-sm
                          font-semibold
                          !text-[#F5F0E6]
                          shadow-[0_8px_24px_rgba(16,42,86,0.15)]
                          transition-all
                          duration-300
                          hover:-translate-y-1
                          hover:bg-[#1B3D73]
                        "
                      >
                        <span className="!text-[#F5F0E6]">
                          Open notice
                        </span>

                        <span
                          className="
                            flex
                            h-6
                            w-6
                            items-center
                            justify-center
                            rounded-full
                            bg-[#F5F0E6]
                            !text-[#102A56]
                          "
                        >
                          <ArrowRight
                            size={13}
                            className="!text-[#102A56]"
                          />
                        </span>
                      </a>
                    ) : featured.document_url ? (
                      <a
                        href={featured.document_url}
                        target="_blank"
                        rel="noreferrer"
                        className="
                          inline-flex
                          items-center
                          gap-3
                          rounded-full
                          bg-[#102A56]
                          px-6
                          py-3.5
                          text-sm
                          font-semibold
                          !text-[#F5F0E6]
                          transition-all
                          duration-300
                          hover:-translate-y-1
                          hover:bg-[#1B3D73]
                        "
                      >
                        <span className="!text-[#F5F0E6]">
                          View document
                        </span>

                        <FileText
                          size={14}
                          className="!text-[#F5F0E6]"
                        />
                      </a>
                    ) : (
                      <Link
                        href={featured.homepage_button_url || "/notices"}
                        className="
                          group/button
                          inline-flex
                          items-center
                          gap-3
                          rounded-full
                          bg-[#102A56]
                          px-6
                          py-3.5
                          text-sm
                          font-semibold
                          !text-[#F5F0E6]
                          shadow-[0_8px_24px_rgba(16,42,86,0.15)]
                          transition-all
                          duration-300
                          hover:-translate-y-1
                          hover:bg-[#1B3D73]
                        "
                      >
                        <span className="!text-[#F5F0E6]">
                          {featured.homepage_button_label || "Read notice"}
                        </span>

                        <span
                          className="
                            flex
                            h-6
                            w-6
                            items-center
                            justify-center
                            rounded-full
                            bg-[#F5F0E6]
                            !text-[#102A56]
                          "
                        >
                          <ArrowRight
                            size={13}
                            className="!text-[#102A56]"
                          />
                        </span>
                      </Link>
                    )}

                  </div>

                  <div
                    className="
                      pointer-events-none
                      absolute
                      bottom-0
                      right-0
                      h-44
                      w-44
                      translate-x-12
                      translate-y-12
                      rounded-full
                      bg-[#102A56]/[0.04]
                    "
                  />

                </article>
              </Reveal>
            )}

            {/* =================================================
                SECONDARY NOTICES
            ================================================== */}

            <div className="grid gap-4">

              {secondary.map(
                (notice, index) => (
                  <Reveal
                    key={notice.id}
                    delay={
                      0.05 +
                      index * 0.06
                    }
                  >
                    <article
                      className="
                        group
                        rounded-[1.75rem]
                        border
                        border-white/10
                        bg-white/[0.035]
                        p-6
                        transition
                        duration-500
                        hover:-translate-y-1
                        hover:bg-white/[0.055]
                        md:p-7
                      "
                    >
                      <div className="flex items-start gap-5">

                        {notice.image_url && (
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white/10">
                            <img
                              src={notice.image_url}
                              alt={notice.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}

                        <div className="shrink-0">

                          <p
                            className="
                              text-[9px]
                              font-semibold
                              uppercase
                              tracking-[0.18em]
                              !text-white/35
                            "
                          >
                            {formatDate(
                              notice.notice_date
                            )}
                          </p>

                          <div className="mt-4 h-px w-7 bg-white/15" />

                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <span
                              className="
                                rounded-full
                                bg-white/[0.06]
                                px-2.5
                                py-1
                                text-[8px]
                                uppercase
                                tracking-[0.15em]
                                !text-white/55
                              "
                            >
                              {notice.category}
                            </span>

                            {notice.is_pinned && (
                              <Star
                                size={11}
                                className="text-amber-200/70"
                                fill="currentColor"
                              />
                            )}

                          </div>

                          <h3
                            className="
                              mt-3
                              text-lg
                              font-semibold
                              leading-tight
                              tracking-[-0.025em]
                              !text-white
                            "
                          >
                            {notice.title}
                          </h3>

                          {notice.short_description && (
                            <p
                              className="
                                mt-2
                                line-clamp-2
                                text-xs
                                leading-6
                                !text-white/40
                              "
                            >
                              {notice.short_description}
                            </p>
                          )}

                          <div className="mt-5">

                            <Link
                              href={notice.homepage_button_url || "/notices"}
                              className="
                                group/link
                                inline-flex
                                items-center
                                gap-2
                                text-xs
                                font-medium
                                !text-white/60
                                transition
                                hover:!text-white
                              "
                            >
                              {notice.homepage_button_label || "Read more"}

                              <ArrowRight
                                size={13}
                                className="
                                  transition-transform
                                  group-hover/link:translate-x-1
                                "
                              />
                            </Link>

                          </div>

                        </div>
                      </div>
                    </article>
                  </Reveal>
                )
              )}

              {secondary.length === 0 && (
                <div
                  className="
                    rounded-[1.75rem]
                    border
                    border-white/10
                    bg-white/[0.035]
                    p-7
                    text-sm
                    !text-white/40
                  "
                >
                  More notices will appear here.
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </section>
  );
}