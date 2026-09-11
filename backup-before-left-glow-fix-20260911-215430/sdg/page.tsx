"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Globe2,
  Loader2,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type SdgItem = {
  id: string;
  number: number;
  short_title: string;
  title: string;
  eyebrow: string | null;
  description: string | null;
  content: string | null;
  image_url: string | null;
  button_text: string | null;
  external_url: string | null;
  sort_order: number;
};

export default function SdgPage() {
  const [items, setItems] = useState<SdgItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] =
    useState<SdgItem | null>(null);

  useEffect(() => {
    loadSdg();
  }, []);

  async function loadSdg() {
    setLoading(true);

    const { data, error } = await supabase
      .from("sdg_items")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", {
        ascending: true,
      });

    if (error) {
      console.error("SDG loading error:", error);
      setItems([]);
    } else {
      setItems((data ?? []) as SdgItem[]);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#F5F0E6] text-[#10203A]">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#102A56] text-white">

        <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full border border-white/10" />

        <div className="pointer-events-none absolute right-[-120px] top-[-120px] h-[360px] w-[360px] rounded-full bg-[#8DB9E5]/10 blur-[120px]" />

        <div className="relative mx-auto max-w-[1500px] px-6 pb-24 pt-32 md:px-10 md:pb-32 lg:px-14 lg:pt-36">

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50 transition hover:text-white"
          >
            <ArrowLeft size={13} />
            Apex Public School
          </Link>

          <div className="mt-14 flex items-center gap-3">

            <span className="h-px w-10 bg-white/30" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
              Sustainable Development
            </span>

          </div>

          <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[0.9] tracking-[-0.06em] md:text-7xl lg:text-[6.2vw]">
            Sustainable
            <br />
            Development Goals
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-8 text-white/60 md:text-lg">
            Explore the 17 Sustainable Development Goals and
            discover how education, responsibility and action
            contribute to a more sustainable future.
          </p>

        </div>
      </section>

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="border-b border-[#102A56]/10">

        <div className="mx-auto max-w-[1500px] px-6 py-16 md:px-10 md:py-20 lg:px-14">

          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-end">

            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#102A56]/35">
                The 2030 Agenda
              </p>

              <h2 className="mt-5 text-3xl font-semibold leading-[0.95] tracking-[-0.045em] text-[#102A56] md:text-5xl">
                17 goals.
                <br />
                One shared future.
              </h2>

            </div>

            <p className="max-w-2xl text-sm leading-8 text-[#10203A]/55 md:text-base">
              Sustainable development connects education,
              equality, health, environmental responsibility,
              innovation and stronger communities. Explore each
              goal below.
            </p>

          </div>

        </div>
      </section>

      {/* =====================================================
          SDG GRID
      ===================================================== */}

      <section>

        <div className="mx-auto max-w-[1500px] px-6 py-16 md:px-10 md:py-24 lg:px-14">

          {loading ? (

            <div className="flex min-h-[400px] items-center justify-center">

              <Loader2
                className="h-8 w-8 animate-spin text-[#102A56]"
              />

            </div>

          ) : items.length === 0 ? (

            <div className="rounded-[2rem] border border-[#102A56]/10 bg-white px-8 py-16 text-center">

              <Globe2 className="mx-auto h-10 w-10 text-[#102A56]" />

              <h3 className="mt-5 text-2xl font-semibold text-[#102A56]">
                SDG information is being prepared
              </h3>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500">
                Sustainable Development Goal content will
                appear here after it is published from Admin.
              </p>

            </div>

          ) : (

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {items.map((item) => (

                <article
                  key={item.id}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[2rem]
                    border
                    border-[#102A56]/10
                    bg-white
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_24px_70px_rgba(16,42,86,0.1)]
                  "
                >

                  {/* Image */}

                  {item.image_url ? (
                    <div className="aspect-[16/10] overflow-hidden bg-[#eeeae1]">

                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />

                    </div>
                  ) : (
                    <div className="flex aspect-[16/10] items-center justify-center bg-[#102A56]">

                      <span className="text-7xl font-semibold tracking-[-0.08em] text-white/90">
                        {String(
                          item.number
                        ).padStart(2, "0")}
                      </span>

                    </div>
                  )}

                  {/* Content */}

                  <div className="p-7 md:p-8">

                    <div className="flex items-center justify-between gap-4">

                      <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#102A56]/35">
                        SDG{" "}
                        {String(
                          item.number
                        ).padStart(2, "0")}
                      </span>

                      <span className="h-px flex-1 bg-[#102A56]/8" />

                    </div>

                    <h3 className="mt-5 min-h-[68px] text-2xl font-semibold leading-[1.05] tracking-[-0.035em] text-[#102A56]">
                      {item.short_title}
                    </h3>

                    {item.description && (
                      <p className="mt-4 min-h-[70px] text-sm leading-7 text-[#10203A]/55">
                        {item.description}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setSelected(item)
                      }
                      className="
                        mt-6
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
                      Explore goal
                      <ArrowRight
                        size={14}
                      />
                    </button>

                  </div>

                  {/* Accent */}

                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#102A56] transition-all duration-500 group-hover:w-full" />

                </article>

              ))}

            </div>

          )}

        </div>
      </section>

      {/* =====================================================
          MODAL
      ===================================================== */}

      {selected && (

        <div
          className="
            fixed
            inset-0
            z-[200]
            flex
            items-center
            justify-center
            bg-[#07152d]/80
            p-4
            backdrop-blur-sm
          "
        >

          <div
            className="
              max-h-[90vh]
              w-full
              max-w-4xl
              overflow-auto
              rounded-[2rem]
              bg-[#F5F0E6]
              shadow-[0_40px_120px_rgba(0,0,0,0.35)]
            "
          >

            {/* Header */}

            <div className="flex items-center justify-between bg-[#102A56] px-6 py-5 text-white md:px-8">

              <div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/45">
                  Sustainable Development Goal{" "}
                  {selected.number}
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                  {selected.short_title}
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelected(null)
                }
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/10 hover:bg-white/20"
                aria-label="Close"
              >
                <X size={18} />
              </button>

            </div>

            {/* Image */}

            {selected.image_url && (
              <div className="max-h-[460px] overflow-hidden bg-[#eeeae1]">

                <img
                  src={selected.image_url}
                  alt={selected.title}
                  className="max-h-[460px] w-full object-contain"
                />

              </div>
            )}

            {/* Content */}

            <div className="p-7 md:p-10">

              {selected.eyebrow && (
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#102A56]/40">
                  {selected.eyebrow}
                </p>
              )}

              <h3 className="mt-4 text-3xl font-semibold tracking-tight text-[#102A56]">
                {selected.title}
              </h3>

              {selected.description && (
                <p className="mt-5 text-base leading-8 text-[#10203A]/65">
                  {selected.description}
                </p>
              )}

              {selected.content && (
                <div className="mt-7 whitespace-pre-line text-sm leading-8 text-[#10203A]/70">
                  {selected.content}
                </div>
              )}

              {selected.external_url && (
                <a
                  href={
                    selected.external_url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#102A56] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#1B3D73]"
                >
                  {selected.button_text ||
                    "Learn More"}

                  <ArrowRight size={14} />
                </a>
              )}

            </div>

          </div>
        </div>
      )}

    </main>
  );
}