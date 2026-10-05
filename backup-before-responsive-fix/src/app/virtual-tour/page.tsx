"use client";

import React from "react";
import Link from "next/link";

import { motion } from "framer-motion";

import {
  ArrowDown,
  ArrowRight,
  ExternalLink,
  MapPin,
  Play,
  Sparkles,
  Video,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type VirtualTourSettings = {
  hero_label: string | null;
  hero_title_line_1: string | null;
  hero_title_line_2: string | null;
  hero_description: string | null;

  start_button_label: string | null;
  start_button_anchor: string | null;

  gallery_button_label: string | null;
  gallery_button_url: string | null;

  established_value: string | null;
  established_label: string | null;

  campus_value: string | null;
  campus_label: string | null;

  cbse_code: string | null;
  cbse_label: string | null;

  scroll_label: string | null;
  scroll_anchor: string | null;

  video_section_label: string | null;
  video_heading_line_1: string | null;
  video_heading_line_2: string | null;
  video_description: string | null;

  youtube_video_id: string | null;
  youtube_title: string | null;

  video_status_label: string | null;
  video_official_label: string | null;
  video_location_label: string | null;

  youtube_button_label: string | null;
  youtube_button_url: string | null;

  highlights_section_label: string | null;
  highlights_heading_line_1: string | null;
  highlights_heading_line_2: string | null;

  location_label: string | null;
  location_address_line_1: string | null;
  location_address_line_2: string | null;
  location_meta: string | null;

  location_button_label: string | null;
  location_button_url: string | null;
};

type VirtualTourHighlight = {
  id: string;
  number: string;
  title: string;
  description: string;
  sort_order: number;
};

const fallbackSettings: VirtualTourSettings = {
  hero_label: "Apex Virtual Tour",
  hero_title_line_1: "Step inside",
  hero_title_line_2: "Apex Public School.",
  hero_description:
    "Take a closer look at the school, its people and the environment in which the Apex community learns and grows.",

  start_button_label: "Start the tour",
  start_button_anchor: "#tour-video",

  gallery_button_label: "View gallery",
  gallery_button_url: "/gallery",

  established_value: "1985",
  established_label: "Established",

  campus_value: "Delhi",
  campus_label: "Burari Campus",

  cbse_code: "2730184",
  cbse_label: "CBSE Code",

  scroll_label: "Scroll to explore",
  scroll_anchor: "#tour-video",

  video_section_label: "Inside Apex",
  video_heading_line_1: "Excellence in",
  video_heading_line_2: "education & growth.",
  video_description:
    "Welcome to Apex Public School. Experience the campus, learning environment and wider school community through the official school overview.",

  youtube_video_id: "WeuEZrBm3xM",
  youtube_title:
    "Inside Apex Public School | Excellence in Education & Growth",

  video_status_label: "Official school overview",
  video_official_label: "Official Apex media",
  video_location_label: "Apex Public School · Delhi",

  youtube_button_label: "Open on YouTube",
  youtube_button_url: "https://www.youtube.com/",

  highlights_section_label: "More than a tour",
  highlights_heading_line_1: "See the places",
  highlights_heading_line_2: "behind the experience.",

  location_label: "Visit Apex",
  location_address_line_1: "Apex Road, B-Block,",
  location_address_line_2: "Sant Nagar, Burari.",
  location_meta: "Delhi – 110084 · 09990061747",

  location_button_label: "Contact the school",
  location_button_url: "/contact",
};

const fallbackHighlights: VirtualTourHighlight[] = [
  {
    id: "1",
    number: "01",
    title: "Campus",
    description:
      "Explore the physical spaces where Apex students learn, collaborate and grow.",
    sort_order: 1,
  },
  {
    id: "2",
    number: "02",
    title: "People",
    description:
      "See the school community that brings the academic and co-curricular experience to life.",
    sort_order: 2,
  },
  {
    id: "3",
    number: "03",
    title: "Experience",
    description:
      "A closer look at the environment behind the Apex learning experience.",
    sort_order: 3,
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export default function VirtualTourPage() {
  const [settings, setSettings] =
    React.useState<VirtualTourSettings>(fallbackSettings);

  const [highlights, setHighlights] =
    React.useState<VirtualTourHighlight[]>(fallbackHighlights);

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      try {
        const [
          { data: settingsData },
          { data: highlightsData },
        ] = await Promise.all([
          supabase
            .from("virtual_tour_settings")
            .select("*")
            .eq("is_active", true)
            .limit(1)
            .maybeSingle(),

          supabase
            .from("virtual_tour_highlights")
            .select("*")
            .eq("is_active", true)
            .order("sort_order", {
              ascending: true,
            }),
        ]);

        if (settingsData) {
          setSettings({
            ...fallbackSettings,
            ...Object.fromEntries(
              Object.entries(settingsData).map(
                ([key, value]) => [
                  key,
                  value === null ? "" : value,
                ]
              )
            ),
          });
        }

        if (
          highlightsData &&
          highlightsData.length > 0
        ) {
          setHighlights(
            highlightsData.map((item) => ({
              id: item.id,
              number: item.number,
              title: item.title,
              description: item.description,
              sort_order: item.sort_order,
            }))
          );
        }
      } catch (error) {
        console.error(
          "Virtual Tour load failed:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const videoId =
    settings.youtube_video_id ||
    fallbackSettings.youtube_video_id!;

  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F0E6] text-[#10203A]">
      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative min-h-[760px] overflow-hidden bg-[#071A38] text-white lg:min-h-screen">
        <div className="pointer-events-none absolute -right-48 -top-48 h-[700px] w-[700px] rounded-full bg-[#6ea8df]/10 blur-[150px]" />

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.055]
            [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)]
            [background-size:80px_80px]
          "
        />

        <div className="relative z-10 mx-auto flex min-h-[760px] max-w-[1500px] flex-col justify-center px-6 pb-20 pt-36 md:px-10 md:pb-28 md:pt-44 lg:min-h-screen lg:px-14">
          <Reveal>
            <div className="max-w-5xl">
              <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#F5F0E6]/45">
                <span className="h-px w-8 bg-[#F5F0E6]/35" />

                {settings.hero_label ||
                  fallbackSettings.hero_label}
              </div>

              <h1 className="mt-7 text-5xl font-semibold leading-[0.87] tracking-[-0.07em] md:text-7xl lg:text-[7vw]">
                {settings.hero_title_line_1 ||
                  fallbackSettings.hero_title_line_1}

                <br />

                <span className="text-[#F5F0E6]/28">
                  {settings.hero_title_line_2 ||
                    fallbackSettings.hero_title_line_2}
                </span>
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-7 text-white/55 md:text-lg">
                {settings.hero_description ||
                  fallbackSettings.hero_description}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-14 flex flex-wrap gap-3">
              {/* START TOUR */}

              <a
                href={
                  settings.start_button_anchor ||
                  fallbackSettings.start_button_anchor!
                }
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  rounded-full
                  bg-[rgb(245,240,230)]
                  px-6
                  py-4
                  text-sm
                  font-semibold
                  !text-[#102A56]
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:bg-white
                  hover:shadow-[0_15px_40px_rgba(245,240,230,0.12)]
                "
              >
                <span className="!text-[#102A56]">
                  {settings.start_button_label ||
                    fallbackSettings.start_button_label}
                </span>

                <Play
                  size={15}
                  fill="currentColor"
                  className="
                    !text-[#102A56]
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                />
              </a>

              {/* GALLERY */}

              <Link
                href={
                  settings.gallery_button_url ||
                  fallbackSettings.gallery_button_url!
                }
                className="
                  inline-flex
                  items-center
                  gap-3
                  rounded-full
                  border
                  border-white/15
                  bg-white/[0.035]
                  px-6
                  py-4
                  text-sm
                  font-medium
                  !text-white
                  backdrop-blur-xl
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:bg-white/[0.08]
                "
              >
                <span className="!text-white">
                  {settings.gallery_button_label ||
                    fallbackSettings.gallery_button_label}
                </span>

                <ArrowRight
                  size={15}
                  className="!text-white"
                />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-16 grid border-t border-white/10 pt-6 md:grid-cols-3">
              <div>
                <div className="text-2xl font-semibold text-white">
                  {settings.established_value ||
                    fallbackSettings.established_value}
                </div>

                <div className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/35">
                  {settings.established_label ||
                    fallbackSettings.established_label}
                </div>
              </div>

              <div className="mt-5 border-white/10 md:mt-0 md:border-l md:pl-7">
                <div className="text-2xl font-semibold text-white">
                  {settings.campus_value ||
                    fallbackSettings.campus_value}
                </div>

                <div className="mt-1 flex items-center gap-1 text-[9px] uppercase tracking-[0.2em] text-white/35">
                  <MapPin
                    size={10}
                    className="!text-white/50"
                  />

                  {settings.campus_label ||
                    fallbackSettings.campus_label}
                </div>
              </div>

              <div className="mt-5 border-white/10 md:mt-0 md:border-l md:pl-7">
                <div className="text-2xl font-semibold text-white">
                  {settings.cbse_code ||
                    fallbackSettings.cbse_code}
                </div>

                <div className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/35">
                  {settings.cbse_label ||
                    fallbackSettings.cbse_label}
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* SCROLL */}

        <a
          href={
            settings.scroll_anchor ||
            fallbackSettings.scroll_anchor!
          }
          className="
            absolute
            bottom-8
            left-1/2
            z-20
            hidden
            -translate-x-1/2
            items-center
            gap-3
            text-[9px]
            uppercase
            tracking-[0.25em]
            !text-white/35
            md:flex
          "
        >
          <span className="!text-white/35">
            {settings.scroll_label ||
              fallbackSettings.scroll_label}
          </span>

          <ArrowDown
            size={13}
            className="!text-white/40 animate-bounce"
          />
        </a>
      </section>

      {/* ==================================================
          VIDEO
      ================================================== */}

      <section
        id="tour-video"
        className="relative bg-[#F5F0E6]"
      >
        <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14 lg:py-36">
          <Reveal>
            <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:items-end">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#102A56]/40">
                  <Video
                    size={13}
                    className="!text-[#102A56]/50"
                  />

                  {settings.video_section_label ||
                    fallbackSettings.video_section_label}
                </div>

                <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[0.92] tracking-[-0.06em] text-[#102A56] md:text-6xl">
                  {settings.video_heading_line_1 ||
                    fallbackSettings.video_heading_line_1}

                  <br />

                  <span className="text-[#102A56]/30">
                    {settings.video_heading_line_2 ||
                      fallbackSettings.video_heading_line_2}
                  </span>
                </h2>
              </div>

              <div className="max-w-xl">
                <p className="text-sm leading-7 text-[#10203A]/55 md:text-base">
                  {settings.video_description ||
                    fallbackSettings.video_description}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative mt-14 overflow-hidden rounded-[2rem] border border-[#102A56]/10 bg-[#071A38] p-2 shadow-[0_30px_90px_rgba(16,42,86,0.14)] md:p-3">
              <div className="pointer-events-none absolute inset-0 z-20 rounded-[2rem] border border-white/10" />

              <div className="pointer-events-none absolute left-8 top-8 z-20 hidden items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-[9px] uppercase tracking-[0.22em] text-white/55 backdrop-blur-xl md:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8dc7ff] shadow-[0_0_10px_rgba(141,199,255,0.8)]" />

                {settings.video_status_label ||
                  fallbackSettings.video_status_label}
              </div>

              <div className="relative aspect-video overflow-hidden rounded-[1.5rem] bg-black">
                {videoId ? (
                  <iframe
  src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
  title={
    settings.youtube_title ??
    fallbackSettings.youtube_title ??
    "Apex Public School Virtual Tour"
  }
  className="absolute inset-0 h-full w-full"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowFullScreen
/>
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#173765] via-[#102A56] to-[#071A38]">
                    <div className="text-center text-white">
                      <Play
                        size={32}
                        fill="currentColor"
                        className="mx-auto !text-white"
                      />

                      <p className="mt-5 text-lg font-semibold text-white">
                        Virtual Tour
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid gap-3 px-3 pb-2 pt-4 md:grid-cols-3 md:px-4 md:pb-1">
                <div className="flex items-center gap-3 text-xs text-white/45">
                  <Sparkles
                    size={14}
                    className="!text-white/50"
                  />

                  {settings.video_official_label ||
                    fallbackSettings.video_official_label}
                </div>

                <div className="hidden text-center text-[9px] uppercase tracking-[0.2em] text-white/25 md:block">
                  {settings.video_location_label ||
                    fallbackSettings.video_location_label}
                </div>

                <a
                  href={
                    settings.youtube_button_url ||
                    fallbackSettings.youtube_button_url!
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="
                    group
                    flex
                    items-center
                    justify-start
                    gap-2
                    text-xs
                    font-medium
                    !text-white/60
                    md:justify-end
                  "
                >
                  <span className="!text-white/60">
                    {settings.youtube_button_label ||
                      fallbackSettings.youtube_button_label}
                  </span>

                  <ExternalLink
                    size={13}
                    className="
                      !text-white/60
                      transition-transform
                      group-hover:translate-x-0.5
                      group-hover:-translate-y-0.5
                    "
                  />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==================================================
          HIGHLIGHTS
      ================================================== */}

      <section className="bg-[#102A56] text-white">
        <div className="mx-auto max-w-[1500px] px-6 py-24 md:px-10 md:py-32 lg:px-14">
          <Reveal>
            <div className="max-w-4xl">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#F5F0E6]/35">
                {settings.highlights_section_label ||
                  fallbackSettings.highlights_section_label}
              </p>

              <h2 className="mt-5 text-4xl font-semibold leading-[0.92] tracking-[-0.055em] md:text-6xl">
                {settings.highlights_heading_line_1 ||
                  fallbackSettings.highlights_heading_line_1}

                <br />

                <span className="text-white/30">
                  {settings.highlights_heading_line_2 ||
                    fallbackSettings.highlights_heading_line_2}
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {highlights.map((item, index) => (
              <Reveal
                key={item.id}
                delay={index * 0.07}
              >
                <article
                  className="
                    group
                    min-h-[280px]
                    rounded-[2rem]
                    border
                    border-white/10
                    bg-white/[0.035]
                    p-7
                    transition
                    duration-500
                    hover:-translate-y-1
                    hover:border-white/20
                    hover:bg-white/[0.06]
                    md:p-9
                  "
                >
                  <span className="text-[10px] tracking-[0.28em] text-white/25">
                    {item.number}
                  </span>

                  <h3 className="mt-20 text-2xl font-semibold tracking-[-0.035em] text-white">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-white/45">
                    {item.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          LOCATION
      ================================================== */}

      <section className="bg-[#F5F0E6]">
        <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <div className="flex flex-col gap-8 border-t border-[#102A56]/10 pt-8 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[#102A56]/35">
                  <MapPin
                    size={12}
                    className="!text-[#102A56]/50"
                  />

                  {settings.location_label ||
                    fallbackSettings.location_label}
                </p>

                <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-[1] tracking-[-0.045em] text-[#102A56] md:text-5xl">
                  {settings.location_address_line_1 ||
                    fallbackSettings.location_address_line_1}

                  <br />

                  {settings.location_address_line_2 ||
                    fallbackSettings.location_address_line_2}
                </h2>

                <p className="mt-4 text-sm text-[#10203A]/50">
                  {settings.location_meta ||
                    fallbackSettings.location_meta}
                </p>
              </div>

              <Link
                href={
                  settings.location_button_url ||
                  fallbackSettings.location_button_url!
                }
                className="
                  group
                  inline-flex
                  shrink-0
                  items-center
                  gap-3
                  rounded-full
                  bg-[#102A56]
                  px-6
                  py-4
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
                  {settings.location_button_label ||
                    fallbackSettings.location_button_label}
                </span>

                <ArrowRight
                  size={16}
                  className="
                    !text-[#F5F0E6]
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}