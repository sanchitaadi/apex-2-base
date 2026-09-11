"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  Heart,
  Target,
  Users,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase/browser";

type AboutContent = {
  id: string;
  section_key: string;

  eyebrow: string | null;
  title: string | null;
  subtitle: string | null;
  content: string | null;

  image_url: string | null;
  image_alt: string | null;

  founder_name: string | null;
  founder_role: string | null;
  founder_story: string | null;
  founder_image_url: string | null;
  founder_image_alt: string | null;

  mission: string | null;
  vision: string | null;

  established_date: string | null;
  institution_type: string | null;
  campus_area: string | null;

  about_button_label: string | null;
  about_button_url: string | null;

  glance_label: string | null;
  glance_text: string | null;

  beginnings_label: string | null;
  founder_year: string | null;
  founder_heading: string | null;

  founder_story_button_label: string | null;
  founder_story_button_url: string | null;

  values_learning_title: string | null;
  values_learning_description: string | null;

  values_character_title: string | null;
  values_character_description: string | null;

  values_community_title: string | null;
  values_community_description: string | null;

  established_label: string | null;
  institution_label: string | null;
  campus_label: string | null;

  default_established_date: string | null;
  default_campus_area: string | null;

  story_label: string | null;
  story_heading_line_1: string | null;
  story_heading_line_2: string | null;
  story_secondary_text: string | null;

  history_label: string | null;
  history_heading: string | null;
  history_image_alt: string | null;

  founder_section_label: string | null;
  founder_section_heading_line_1: string | null;
  founder_section_heading_line_2: string | null;

  direction_label: string | null;
  direction_heading_line_1: string | null;
  direction_heading_line_2: string | null;

  mission_label: string | null;
  vision_label: string | null;

  values_label: string | null;
  values_heading_line_1: string | null;
  values_heading_line_2: string | null;

  value_learning_number: string | null;
  value_character_number: string | null;
  value_community_number: string | null;

  facts_enabled: boolean | null;

  cta_label: string | null;
  cta_heading_line_1: string | null;
  cta_heading_line_2: string | null;
  cta_button_label: string | null;
  cta_button_url: string | null;

  sort_order: number;
  is_active: boolean;
};

const fallback: AboutContent = {
  id: "fallback",
  section_key: "main",

  eyebrow: "ABOUT APEX",

  title:
    "A school built around the growth of the whole person.",

  subtitle:
    "Learning, character, confidence and responsibility.",

  content:
    "Apex Public School is a co-educational institution focused on the mental, physical, moral and social growth of its students.",

  image_url:
    "https://apexpublicschool.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-02-at-1.06.01-PM-22.jpeg",

  image_alt:
    "Apex Public School",

  founder_name:
    "Late Mr. Anthony M. Jonathan",

  founder_role:
    "Founder Principal",

  founder_story:
    "Late Mr. Anthony M. Jonathan was the founder principal and an educationist whose vision shaped Apex Public School.",

  founder_image_url: null,

  founder_image_alt:
    "Apex founder",

  mission:
    "To develop students through academic learning, character, confidence and responsible participation in the community.",

  vision:
    "To provide an environment where students can grow intellectually, physically, morally and socially.",

  established_date:
    "29 July 1985",

  institution_type:
    "Unaided Christian Minority Institution",

  campus_area:
    "4 acres",

  about_button_label:
    "Discover our story",

  about_button_url:
    "/about",

  glance_label:
    "The school at a glance",

  glance_text:
    "A place where academic learning and personal development belong together.",

  beginnings_label:
    "Our beginnings",

  founder_year:
    "1985",

  founder_heading:
    "Founded with education, values and purpose.",

  founder_story_button_label:
    "Read the founder's story",

  founder_story_button_url:
    "/about",

  values_learning_title:
    "Learning",

  values_learning_description:
    "Building curiosity, understanding and the confidence to keep learning.",

  values_character_title:
    "Character",

  values_character_description:
    "Developing responsibility, discipline, confidence and respect for others.",

  values_community_title:
    "Community",

  values_community_description:
    "Creating a school environment where students, families and educators grow together.",

  established_label:
    "Established",

  institution_label:
    "Institution",

  campus_label:
    "Campus",

  default_established_date:
    "29 July 1985",

  default_campus_area:
    "4 acres",

  story_label:
    "Our story",

  story_heading_line_1:
    "More than a",

  story_heading_line_2:
    "classroom.",

  story_secondary_text:
    "Learning at Apex extends beyond the classroom through character, confidence, responsibility and experience.",

  history_label:
    "Apex Public School",

  history_heading:
    "Education shaped by values, opportunity and experience.",

  history_image_alt:
    "Apex Public School campus",

  founder_section_label:
    "The founder",

  founder_section_heading_line_1:
    "A vision that",

  founder_section_heading_line_2:
    "became Apex.",

  direction_label:
    "Direction",

  direction_heading_line_1:
    "What guides",

  direction_heading_line_2:
    "Apex.",

  mission_label:
    "Mission",

  vision_label:
    "Vision",

  values_label:
    "Our values",

  values_heading_line_1:
    "The foundations",

  values_heading_line_2:
    "of everyday learning.",

  value_learning_number:
    "01",

  value_character_number:
    "02",

  value_community_number:
    "03",

  facts_enabled: true,

  cta_label:
    "Discover more",

  cta_heading_line_1:
    "See how Apex turns",

  cta_heading_line_2:
    "values into experience.",

  cta_button_label:
    "Explore Academics",

  cta_button_url:
    "/academics",

  sort_order: 0,

  is_active: true,
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
        y: 28,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-80px",
      }}
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

function text(
  value: string | null | undefined,
  fallbackValue: string
) {
  return value?.trim()
    ? value
    : fallbackValue;
}

export default function AboutPage() {
  const [about, setAbout] =
    useState<AboutContent>(fallback);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadAbout() {
      try {
        const { data, error } =
          await supabase
            .from("about_content")
            .select("*")
            .eq("section_key", "main")
            .eq("is_active", true)
            .order("sort_order", {
              ascending: true,
            })
            .limit(1)
            .maybeSingle();

        if (!mounted) return;

        if (error) {
          console.error(
            "About page load failed:",
            error
          );
          return;
        }

        if (data) {
          const cleanedData =
            Object.fromEntries(
              Object.entries(data).map(
                ([key, value]) => [
                  key,
                  value === null
                    ? ""
                    : value,
                ]
              )
            );

          setAbout({
            ...fallback,
            ...cleanedData,
            facts_enabled:
              data.facts_enabled !==
              false,
            is_active:
              data.is_active !==
              false,
          } as AboutContent);
        }
      } catch (error) {
        console.error(
          "About page error:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadAbout();

    return () => {
      mounted = false;
    };
  }, []);

  if (!about.is_active) {
    return null;
  }

  const establishedYear =
    text(
      about.established_date,
      fallback.established_date!
    ).match(/\d{4}/)?.[0] ||
    "1985";

  const imageUrl =
    about.image_url ||
    fallback.image_url!;

  const imageAlt = text(
    about.image_alt,
    fallback.image_alt!
  );

  const historyImageAlt = text(
    about.history_image_alt,
    fallback.history_image_alt!
  );

  const founderImageAlt = text(
    about.founder_image_alt,
    fallback.founder_image_alt!
  );

  return (
    <>
      <Header />

      <main className="overflow-hidden bg-[#F5F0E6] text-[#10203A]">

        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="relative min-h-[720px] overflow-hidden bg-[#071A38] text-white">

          <div className="absolute inset-0">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />

            <div className="absolute inset-0 bg-black/25" />

            <div className="absolute inset-0 bg-gradient-to-r from-[#071A38]/90 via-[#102A56]/48 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#071A38] to-transparent" />
          </div>

          <div className="relative z-10 mx-auto flex min-h-[720px] max-w-[1500px] items-end px-6 pb-16 pt-48 md:px-10 lg:px-14 lg:pb-20">

            <Reveal>
              <div className="max-w-5xl">

                <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#F5F0E6]/55">

                  <span className="h-px w-9 bg-white/30" />

                  {text(
                    about.eyebrow,
                    fallback.eyebrow!
                  )}

                </div>

                <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[0.88] tracking-[-0.07em] md:text-7xl lg:text-[7vw]">
                  {text(
                    about.title,
                    fallback.title!
                  )}
                </h1>

                <p className="mt-8 max-w-2xl text-base leading-7 text-white/65 md:text-lg">
                  {text(
                    about.subtitle,
                    fallback.subtitle!
                  )}
                </p>

              </div>
            </Reveal>

          </div>
        </section>

        {/* =====================================================
            INTRO / STORY
        ====================================================== */}

        <section className="bg-[#F5F0E6]">

          <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14 lg:py-32">

            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">

              <Reveal>
                <div>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#102A56]/40">
                    {text(
                      about.story_label,
                      fallback.story_label!
                    )}
                  </p>

                  <h2 className="mt-6 text-4xl font-semibold leading-[0.94] tracking-[-0.055em] text-[#102A56] md:text-6xl">
                    {text(
                      about.story_heading_line_1,
                      fallback.story_heading_line_1!
                    )}

                    <br />

                    {text(
                      about.story_heading_line_2,
                      fallback.story_heading_line_2!
                    )}
                  </h2>

                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div>

                  <p className="max-w-3xl text-xl leading-8 text-[#10203A]/70 md:text-2xl md:leading-9">
                    {text(
                      about.content,
                      fallback.content!
                    )}
                  </p>

                  <p className="mt-6 max-w-3xl text-sm leading-7 text-[#10203A]/45">
                    {text(
                      about.story_secondary_text,
                      fallback.story_secondary_text!
                    )}
                  </p>

                </div>
              </Reveal>

            </div>
          </div>
        </section>

        {/* =====================================================
            HISTORY
        ====================================================== */}

        <section className="bg-[#102A56] text-white">

          <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14 lg:py-32">

            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">

              <Reveal>
                <div className="relative min-h-[560px] overflow-hidden rounded-[2rem]">

                  <Image
                    src={imageUrl}
                    alt={historyImageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#071A38]/85 via-black/10 to-transparent" />

                  <div className="absolute left-6 top-6 rounded-full border border-white/20 bg-black/10 px-4 py-2 text-[9px] uppercase tracking-[0.25em] text-white/75 backdrop-blur-sm">
                    Since {establishedYear}
                  </div>

                  <div className="absolute bottom-7 left-6 right-6 md:left-8 md:right-8">

                    <p className="text-[9px] uppercase tracking-[0.25em] text-white/40">
                      {text(
                        about.history_label,
                        fallback.history_label!
                      )}
                    </p>

                    <p className="mt-3 max-w-2xl text-3xl font-medium leading-tight tracking-[-0.04em] md:text-5xl">
                      {text(
                        about.history_heading,
                        fallback.history_heading!
                      )}
                    </p>

                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.1}>

                <div className="flex min-h-[560px] flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 md:p-10">

                  <div>

                    <div className="flex items-center justify-between">

                      <span className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                        {text(
                          about.beginnings_label,
                          fallback.beginnings_label!
                        )}
                      </span>

                      <span className="text-xl font-semibold text-white/75">
                        {establishedYear}
                      </span>

                    </div>

                    <h2 className="mt-14 text-4xl font-semibold leading-[0.94] tracking-[-0.055em] md:text-5xl">
                      {text(
                        about.founder_heading,
                        fallback.founder_heading!
                      )}
                    </h2>

                    <p className="mt-7 text-sm leading-7 text-white/55 md:text-base">
                      {text(
                        about.founder_story,
                        fallback.founder_story!
                      )}
                    </p>

                  </div>

                  <div className="border-t border-white/10 pt-7">

                    <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                      Founder
                    </p>

                    <p className="mt-3 text-xl font-semibold">
                      {text(
                        about.founder_name,
                        fallback.founder_name!
                      )}
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/30">
                      {text(
                        about.founder_role,
                        fallback.founder_role!
                      )}
                    </p>

                  </div>

                </div>

              </Reveal>

            </div>
          </div>
        </section>

        {/* =====================================================
            FOUNDER
        ====================================================== */}

        <section className="bg-[#E9E2D5]">

          <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14 lg:py-32">

            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">

              <Reveal>

                <div>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#102A56]/40">
                    {text(
                      about.founder_section_label,
                      fallback.founder_section_label!
                    )}
                  </p>

                  <h2 className="mt-6 text-4xl font-semibold leading-[0.93] tracking-[-0.055em] text-[#102A56] md:text-6xl">

                    {text(
                      about.founder_section_heading_line_1,
                      fallback.founder_section_heading_line_1!
                    )}

                    <br />

                    {text(
                      about.founder_section_heading_line_2,
                      fallback.founder_section_heading_line_2!
                    )}

                  </h2>

                </div>

              </Reveal>

              <Reveal delay={0.1}>

                <div className="grid gap-6 md:grid-cols-[280px_1fr] md:items-center">

                  <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#102A56]">

                    {about.founder_image_url ? (
                      <Image
                        src={
                          about.founder_image_url
                        }
                        alt={
                          founderImageAlt
                        }
                        fill
                        sizes="280px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-end p-6 text-white">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.22em] text-white/35">
                            Founder
                          </p>

                          <p className="mt-2 text-2xl font-semibold">
                            {text(
                              about.founder_name,
                              fallback.founder_name!
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                  </div>

                  <div>

                    <p className="text-lg leading-8 text-[#10203A]/65 md:text-xl md:leading-9">
                      {text(
                        about.founder_story,
                        fallback.founder_story!
                      )}
                    </p>

                    <div className="mt-7">

                      <p className="text-xl font-semibold text-[#102A56]">
                        {text(
                          about.founder_name,
                          fallback.founder_name!
                        )}
                      </p>

                      <p className="mt-1 text-[9px] uppercase tracking-[0.22em] text-[#102A56]/40">
                        {text(
                          about.founder_role,
                          fallback.founder_role!
                        )}
                      </p>

                    </div>

                  </div>

                </div>

              </Reveal>

            </div>
          </div>
        </section>

        {/* =====================================================
            MISSION / VISION
        ====================================================== */}

        <section className="bg-[#F5F0E6]">

          <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14 lg:py-32">

            <Reveal>

              <div className="mb-12">

                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#102A56]/40">
                  {text(
                    about.direction_label,
                    fallback.direction_label!
                  )}
                </p>

                <h2 className="mt-5 text-4xl font-semibold leading-[0.94] tracking-[-0.055em] text-[#102A56] md:text-6xl">

                  {text(
                    about.direction_heading_line_1,
                    fallback.direction_heading_line_1!
                  )}

                  <br />

                  {text(
                    about.direction_heading_line_2,
                    fallback.direction_heading_line_2!
                  )}

                </h2>

              </div>

            </Reveal>

            <div className="grid gap-5 md:grid-cols-2">

              <Reveal delay={0.05}>

                <div className="min-h-[360px] rounded-[2rem] bg-[#102A56] p-7 text-white md:p-10">

                  <div className="flex items-start justify-between">

                    <span className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                      01
                    </span>

                    <div className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.05]">
                      <Target
                        size={18}
                        strokeWidth={1.5}
                      />
                    </div>

                  </div>

                  <div className="mt-24">

                    <p className="text-[9px] uppercase tracking-[0.25em] text-white/35">
                      {text(
                        about.mission_label,
                        fallback.mission_label!
                      )}
                    </p>

                    <p className="mt-5 max-w-xl text-xl leading-8 text-white/70 md:text-2xl md:leading-9">
                      {text(
                        about.mission,
                        fallback.mission!
                      )}
                    </p>

                  </div>

                </div>

              </Reveal>

              <Reveal delay={0.1}>

                <div className="min-h-[360px] rounded-[2rem] bg-[#E9E2D5] p-7 text-[#102A56] md:p-10">

                  <div className="flex items-start justify-between">

                    <span className="text-[9px] uppercase tracking-[0.25em] text-[#102A56]/30">
                      02
                    </span>

                    <div className="grid h-11 w-11 place-items-center rounded-full border border-[#102A56]/10 bg-[#102A56]/[0.035]">
                      <BookOpen
                        size={18}
                        strokeWidth={1.5}
                      />
                    </div>

                  </div>

                  <div className="mt-24">

                    <p className="text-[9px] uppercase tracking-[0.25em] text-[#102A56]/35">
                      {text(
                        about.vision_label,
                        fallback.vision_label!
                      )}
                    </p>

                    <p className="mt-5 max-w-xl text-xl leading-8 text-[#102A56]/65 md:text-2xl md:leading-9">
                      {text(
                        about.vision,
                        fallback.vision!
                      )}
                    </p>

                  </div>

                </div>

              </Reveal>

            </div>
          </div>
        </section>

        {/* =====================================================
            VALUES
        ====================================================== */}

        <section className="bg-[#102A56] text-white">

          <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14">

            <Reveal>

              <div className="mb-12 max-w-3xl">

                <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">
                  {text(
                    about.values_label,
                    fallback.values_label!
                  )}
                </p>

                <h2 className="mt-5 text-4xl font-semibold leading-[0.94] tracking-[-0.055em] md:text-6xl">

                  {text(
                    about.values_heading_line_1,
                    fallback.values_heading_line_1!
                  )}

                  <br />

                  {text(
                    about.values_heading_line_2,
                    fallback.values_heading_line_2!
                  )}

                </h2>

              </div>

            </Reveal>

            <div className="grid gap-4 md:grid-cols-3">

              <Reveal delay={0.03}>
                <ValueCard
                  icon={
                    <BookOpen size={19} />
                  }
                  number={text(
                    about.value_learning_number,
                    fallback.value_learning_number!
                  )}
                  title={text(
                    about.values_learning_title,
                    fallback.values_learning_title!
                  )}
                  text={text(
                    about.values_learning_description,
                    fallback.values_learning_description!
                  )}
                />
              </Reveal>

              <Reveal delay={0.08}>
                <ValueCard
                  icon={
                    <Heart size={19} />
                  }
                  number={text(
                    about.value_character_number,
                    fallback.value_character_number!
                  )}
                  title={text(
                    about.values_character_title,
                    fallback.values_character_title!
                  )}
                  text={text(
                    about.values_character_description,
                    fallback.values_character_description!
                  )}
                />
              </Reveal>

              <Reveal delay={0.13}>
                <ValueCard
                  icon={
                    <Users size={19} />
                  }
                  number={text(
                    about.value_community_number,
                    fallback.value_community_number!
                  )}
                  title={text(
                    about.values_community_title,
                    fallback.values_community_title!
                  )}
                  text={text(
                    about.values_community_description,
                    fallback.values_community_description!
                  )}
                />
              </Reveal>

            </div>
          </div>
        </section>

        {/* =====================================================
            FACTS
        ====================================================== */}

        {about.facts_enabled !== false && (
          <section className="bg-[#F5F0E6]">

            <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14">

              <div className="grid gap-4 md:grid-cols-3">

                <Reveal delay={0.03}>
                  <FactCard
                    icon={
                      <CalendarDays
                        size={18}
                      />
                    }
                    label={text(
                      about.established_label,
                      fallback.established_label!
                    )}
                    value={text(
                      about.established_date,
                      fallback.established_date!
                    )}
                  />
                </Reveal>

                <Reveal delay={0.08}>
                  <FactCard
                    icon={
                      <Building2
                        size={18}
                      />
                    }
                    label={text(
                      about.institution_label,
                      fallback.institution_label!
                    )}
                    value={text(
                      about.institution_type,
                      fallback.institution_type!
                    )}
                  />
                </Reveal>

                <Reveal delay={0.13}>
                  <FactCard
                    icon={
                      <Users
                        size={18}
                      />
                    }
                    label={text(
                      about.campus_label,
                      fallback.campus_label!
                    )}
                    value={text(
                      about.campus_area,
                      fallback.campus_area!
                    )}
                  />
                </Reveal>

              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            CTA
        ====================================================== */}

        <section className="bg-[#071A38] text-white">

          <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14">

            <Reveal>

              <div className="flex flex-col justify-between gap-10 border-t border-white/10 pt-8 md:flex-row md:items-end">

                <div>

                  <p className="text-[9px] uppercase tracking-[0.28em] text-white/30">
                    {text(
                      about.cta_label,
                      fallback.cta_label!
                    )}
                  </p>

                  <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[0.93] tracking-[-0.055em] md:text-6xl">

                    {text(
                      about.cta_heading_line_1,
                      fallback.cta_heading_line_1!
                    )}

                    <br />

                    {text(
                      about.cta_heading_line_2,
                      fallback.cta_heading_line_2!
                    )}

                  </h2>

                </div>

                <Link
  href={
    about.cta_button_url ||
    fallback.cta_button_url!
  }
  className="
    group
    inline-flex
    items-center
    gap-3
    rounded-full
    bg-[#F5F0E6]
    px-6
    py-4
    text-sm
    font-semibold
    !text-[#102A56]
    transition
    duration-300
    hover:-translate-y-0.5
    hover:bg-white
  "
>
  <span className="!text-[#102A56]">
    {about.cta_button_label ||
      fallback.cta_button_label}
  </span>

  <ArrowRight
    size={15}
    className="
      !text-[#102A56]
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

      <Footer />

      {loading && (
        <div className="pointer-events-none fixed bottom-5 right-5 z-[200] rounded-full border border-white/10 bg-[#102A56]/90 px-4 py-2 text-[9px] uppercase tracking-[0.18em] text-white/45 shadow-xl backdrop-blur-md">
          Loading Apex
        </div>
      )}
    </>
  );
}

function ValueCard({
  icon,
  number,
  title,
  text: bodyText,
}: {
  icon: React.ReactNode;
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="group min-h-[280px] rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 transition duration-500 hover:-translate-y-1 hover:bg-white/[0.055] md:p-8">

      <div className="flex items-start justify-between">

        <span className="text-[9px] uppercase tracking-[0.2em] text-white/25">
          {number}
        </span>

        <div className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/75 transition duration-500 group-hover:scale-110">
          {icon}
        </div>

      </div>

      <h3 className="mt-24 text-2xl font-semibold tracking-[-0.035em]">
        {title}
      </h3>

      <p className="mt-3 max-w-sm text-sm leading-6 text-white/45">
        {bodyText}
      </p>

    </div>
  );
}

function FactCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[2rem] border border-[#102A56]/10 bg-white/[0.55] p-7 md:p-8">

      <div className="flex items-start justify-between">

        <p className="text-[9px] uppercase tracking-[0.23em] text-[#102A56]/35">
          {label}
        </p>

        <div className="text-[#102A56]/50">
          {icon}
        </div>

      </div>

      <p className="mt-8 text-xl font-semibold leading-7 tracking-[-0.03em] text-[#102A56]">
        {value}
      </p>

    </div>
  );
}