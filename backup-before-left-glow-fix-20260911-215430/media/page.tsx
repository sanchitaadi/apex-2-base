"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Camera,
  Image as ImageIcon,
  PlayCircle,
  Newspaper,
  Sparkles,
} from "lucide-react";

const mediaSections = [
  {
    title: "School Gallery",
    eyebrow: "Photography & Events",
    description:
      "Explore moments from school events, celebrations, sports, activities and life across the Apex campus.",
    href: "/gallery",
    icon: Camera,
    number: "01",
    featured: true,
  },
  {
    title: "Apex School TV",
    eyebrow: "Video & Stories",
    description:
      "Watch school videos, programmes, achievements and memorable moments from Apex Public School.",
    href: "/school-tv",
    icon: PlayCircle,
    number: "02",
    featured: false,
  },
  {
    title: "Monthly Newsletter",
    eyebrow: "Publications",
    description:
      "Read school newsletters and publications featuring stories, achievements, activities and updates.",
    href: "/monthly-newsletter",
    icon: Newspaper,
    number: "03",
    featured: false,
  },
  {
    title: "The Apexian Accolade",
    eyebrow: "Digital Booklets",
    description:
      "Explore editions of The Apexian Accolade through the interactive booklet experience on our website.",
    href: "/apexian-accolade",
    icon: BookOpen,
    number: "04",
    featured: false,
  },
];

export default function MediaPage() {
  return (
    <main className="min-h-screen bg-[#F5F0E6] text-[#10203A]">

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#102A56] text-white">

        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-48 -top-48 h-[650px] w-[650px] rounded-full border border-white/[0.06]" />

        <div className="pointer-events-none absolute -right-24 -top-24 h-[430px] w-[430px] rounded-full border border-white/[0.05]" />

        <div className="pointer-events-none absolute -left-48 bottom-[-300px] h-[600px] w-[600px] rounded-full border border-white/[0.04]" />

        {/* Glow */}
        <div className="pointer-events-none absolute right-[5%] top-[20%] h-[450px] w-[450px] rounded-full bg-[#8DB9E5]/10 blur-[140px]" />

        <div className="relative mx-auto max-w-[1500px] px-6 pb-24 pt-32 md:px-10 md:pb-32 lg:px-14 lg:pt-36">

          {/* Back */}
          <Link
            href="/"
            className="
              inline-flex
              items-center
              gap-2
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.25em]
              text-[#F5F0E6]/50
              transition
              hover:text-white
            "
          >
            <ArrowLeft size={13} />
            Apex Public School
          </Link>

          {/* Eyebrow */}
          <div className="mt-14 flex items-center gap-3">
            <span className="h-px w-10 bg-white/25" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
              Media &amp; Publications
            </p>
          </div>

          {/* Heading */}
          <h1
            className="
              mt-7
              max-w-5xl
              text-5xl
              font-semibold
              leading-[0.9]
              tracking-[-0.06em]
              md:text-7xl
              lg:text-[6.2vw]
            "
          >
            Media
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-8 text-white/55 md:text-lg">
            Discover the visual stories, videos, photographs and
            publications that capture life at Apex Public School.
          </p>

        </div>
      </section>

      {/* =========================================================
          INTRO
      ========================================================= */}

      <section className="border-b border-[#102A56]/10">

        <div className="mx-auto max-w-[1500px] px-6 py-16 md:px-10 md:py-20 lg:px-14">

          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-end">

            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#102A56]/35">
                Explore Apex
              </p>

              <h2
                className="
                  mt-5
                  text-3xl
                  font-semibold
                  leading-[0.95]
                  tracking-[-0.045em]
                  text-[#102A56]
                  md:text-5xl
                "
              >
                See Apex
                <br />
                beyond the classroom.
              </h2>

            </div>

            <p className="max-w-2xl text-sm leading-8 text-[#10203A]/55 md:text-base">
              From campus events and student achievements to
              school videos and digital publications, explore the
              stories that make up the Apex experience.
            </p>

          </div>

        </div>
      </section>

      {/* =========================================================
          MEDIA CARDS
      ========================================================= */}

      <section>

        <div className="mx-auto max-w-[1500px] px-6 py-16 md:px-10 md:py-24 lg:px-14">

          <div className="grid gap-5 md:grid-cols-2">

            {mediaSections.map((section) => {
              const Icon = section.icon;

              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[2rem]
                    border
                    border-[#102A56]/10
                    bg-white
                    p-8
                    transition-all
                    duration-500
                    hover:-translate-y-1
                    hover:shadow-[0_30px_80px_rgba(16,42,86,0.1)]
                    md:p-10
                  "
                >

                  {/* Number */}
                  <span className="absolute right-8 top-8 text-[10px] font-semibold tracking-[0.2em] text-[#102A56]/20">
                    {section.number}
                  </span>

                  {/* Icon */}
                  <div
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      bg-[#102A56]
                      text-white
                      transition
                      duration-500
                      group-hover:scale-105
                      group-hover:shadow-lg
                    "
                  >
                    <Icon
                      size={23}
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Eyebrow */}
                  <p className="mt-8 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#102A56]/35">
                    {section.eyebrow}
                  </p>

                  {/* Title */}
                  <h3 className="mt-4 max-w-xl text-3xl font-semibold leading-[0.98] tracking-[-0.04em] text-[#102A56] md:text-4xl">
                    {section.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-5 max-w-xl text-sm leading-7 text-[#10203A]/55 md:text-base">
                    {section.description}
                  </p>

                  {/* Button */}
                  <div
                    className="
                      mt-8
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
                      transition-all
                      duration-300
                      group-hover:bg-[#1B3D73]
                    "
                  >
                    Explore
                    <ArrowRight
                      size={14}
                      className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    />
                  </div>

                  {/* Bottom accent */}
                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      h-1
                      w-0
                      bg-[#102A56]
                      transition-all
                      duration-500
                      group-hover:w-full
                    "
                  />

                </Link>
              );
            })}

          </div>
        </div>
      </section>

      {/* =========================================================
          MEDIA PRINCIPLES / FOOTER BLOCK
      ========================================================= */}

      <section className="pb-20 md:pb-28 lg:pb-32">

        <div className="mx-auto max-w-[1500px] px-6 md:px-10 lg:px-14">

          <div className="rounded-[2rem] bg-[#102A56] p-8 text-white md:p-10 lg:p-12">

            <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center">

              <div>

                <div className="flex items-center gap-3">

                  <Sparkles
                    size={17}
                    className="text-white/55"
                  />

                  <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/35">
                    Apex Media
                  </p>

                </div>

                <h3 className="mt-4 max-w-3xl text-2xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-3xl">
                  Moments, stories and achievements —
                  all in one place.
                </h3>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 md:text-base">
                  The Media section brings together the visual
                  and editorial side of Apex Public School,
                  giving students, parents, alumni and visitors
                  a single place to explore the school beyond
                  the homepage.
                </p>

              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">

                <ImageIcon
                  size={27}
                  strokeWidth={1.4}
                  className="text-white/80"
                />

              </div>

            </div>

          </div>

          {/* Back */}
          <div className="mt-10 border-t border-[#102A56]/10 pt-8">

            <Link
              href="/"
              className="
                group
                inline-flex
                items-center
                gap-2
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[#102A56]/50
                transition
                hover:text-[#102A56]
              "
            >
              <ArrowLeft
                size={14}
                className="transition-transform group-hover:-translate-x-1"
              />

              Back to Apex Public School
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}