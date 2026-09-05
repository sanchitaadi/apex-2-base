"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  FileText,
  Loader2,
  Star,
} from "lucide-react";

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

function formatDate(date: string) {
  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function NoticeDetailPage() {
  const params = useParams();

  const slug =
    typeof params.slug === "string"
      ? params.slug
      : Array.isArray(params.slug)
        ? params.slug[0]
        : "";

  const [notice, setNotice] =
    useState<Notice | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!slug) return;

    let mounted = true;

    async function loadNotice() {
      const { data, error } =
        await supabase
          .from("notices")
          .select("*")
          .eq("slug", slug)
          .eq("is_active", true)
          .limit(1)
          .maybeSingle();

      if (!mounted) return;

      if (error) {
        console.error(
          "Notice load failed:",
          error
        );
        setNotice(null);
      } else {
        setNotice(
          data as Notice | null
        );
      }

      setLoading(false);
    }

    loadNotice();

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />

        <main className="flex min-h-screen items-center justify-center bg-[#F5F0E6]">
          <div className="flex items-center gap-3 text-sm text-[#102A56]/45">
            <Loader2
              size={20}
              className="animate-spin"
            />
            Loading notice...
          </div>
        </main>

        <Footer />
      </>
    );
  }

  if (!notice) {
    return (
      <>
        <Header />

        <main className="min-h-screen bg-[#F5F0E6] pt-40">

          <div className="mx-auto max-w-[1500px] px-6 py-24 md:px-10 lg:px-14">

            <p className="text-[10px] uppercase tracking-[0.28em] text-[#102A56]/35">
              Apex Notices
            </p>

            <h1 className="mt-6 text-5xl font-semibold tracking-[-0.06em] text-[#102A56] md:text-7xl">
              Notice not found.
            </h1>

            <Link
              href="/notices"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#102A56] px-5 py-3.5 text-sm font-semibold text-white"
            >
              <ArrowLeft size={15} />
              Back to notices
            </Link>

          </div>

        </main>

        <Footer />
      </>
    );
  }

  const paragraphs =
    (notice.content || "")
      .split(/\n\s*\n/)
      .map((part) => part.trim())
      .filter(Boolean);

  return (
    <>
      <Header />

      <main className="overflow-hidden bg-[#F5F0E6] text-[#10203A]">

        <section className="bg-[#102A56] text-white">

          <div className="mx-auto max-w-[1200px] px-6 pb-20 pt-48 md:px-10 md:pb-24">

            <Link
              href="/notices"
              className="inline-flex items-center gap-2 text-xs text-white/50 transition hover:text-white"
            >
              <ArrowLeft size={14} />
              All notices
            </Link>

            <div className="mt-10 flex flex-wrap gap-2">

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-white/65">
                {notice.category}
              </span>

              {notice.is_pinned && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-300/10 px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-amber-200">
                  <Star
                    size={10}
                    fill="currentColor"
                  />
                  Important
                </span>
              )}

            </div>

            <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[0.9] tracking-[-0.07em] md:text-7xl lg:text-[6vw]">
              {notice.title}
            </h1>

            <div className="mt-8 flex items-center gap-2 text-xs text-white/40">
              <CalendarDays size={14} />
              {formatDate(
                notice.notice_date
              )}
            </div>

          </div>

        </section>

        <section>

          <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-28">

            {notice.short_description && (
              <p className="max-w-4xl text-2xl font-medium leading-9 tracking-[-0.025em] text-[#102A56] md:text-3xl">
                {notice.short_description}
              </p>
            )}

            <div className="mt-10 max-w-4xl">

              {paragraphs.map(
                (paragraph, index) => (
                  <p
                    key={index}
                    className={`mb-7 text-lg leading-8 ${
                      index === 0
                        ? "text-[#102A56]"
                        : "text-[#10203A]/65"
                    }`}
                  >
                    {paragraph}
                  </p>
                )
              )}

            </div>

            <div className="mt-12 flex flex-wrap gap-3">

              {notice.document_url && (
                <a
                  href={
                    notice.document_url
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#102A56] px-5 py-3.5 text-sm font-semibold text-white"
                >
                  <FileText size={15} />
                  Open document
                </a>
              )}

              {notice.external_url && (
                <a
                  href={
                    notice.external_url
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#102A56]/15 px-5 py-3.5 text-sm font-semibold text-[#102A56]"
                >
                  <ExternalLink size={15} />
                  Open external link
                </a>
              )}

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}
