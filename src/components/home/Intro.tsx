"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Heart,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

import { supabase } from "@/lib/supabase/browser";

type AboutContent = {
  id: string;
  section_key: string;

  eyebrow: string | null;
  title: string | null;
  subtitle: string | null;
  content: string | null;

  image_url: string | null;

  founder_name: string | null;
  founder_role: string | null;
  founder_story: string | null;
  founder_image_url: string | null;

  mission: string | null;
  vision: string | null;

  established_date: string | null;
  institution_type: string | null;
  campus_area: string | null;

  about_button_label: string | null;
  about_button_url: string | null;

  image_alt: string | null;

  glance_label: string | null;
  glance_text: string | null;

  beginnings_label: string | null;
  founder_year: string | null;
  founder_heading: string | null;

  founder_story_button_label: string | null;
  founder_story_button_url: string | null;
  founder_image_alt: string | null;

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

  sort_order: number;
  is_active: boolean;
};

const fallbackAbout: AboutContent = {
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

  founder_name:
    "Late Mr. Anthony M. Jonathan",

  founder_role:
    "Founder Principal",

  founder_story:
    "Late Mr. Anthony M. Jonathan was the founder principal and an educationist whose vision shaped Apex Public School.",

  founder_image_url: null,

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

  image_alt:
    "Apex Public School",

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

  founder_image_alt:
    "Founder",

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
        y: 25,
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

function valueOrFallback(
  value: string | null | undefined,
  fallback: string
) {
  return value?.trim() ? value : fallback;
}

export default function Intro() {
  const [about, setAbout] =
    useState<AboutContent>(fallbackAbout);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadAbout() {
      try {
        const { data, error } = await supabase
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
            "About content load failed:",
            error
          );
          return;
        }

        if (data) {
          setAbout({
            ...fallbackAbout,
            ...data,
          } as AboutContent);
        }
      } catch (error) {
        console.error(
          "Unexpected about content error:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAbout();

    return () => {
      mounted = false;
    };
  }, []);

  if (!about.is_active) {
    return null;
  }

  const establishedDate = valueOrFallback(
    about.established_date,
    about.default_established_date ||
      fallbackAbout.default_established_date!
  );

  const founderYear =
    valueOrFallback(
      about.founder_year,
      establishedDate.split(" ")[2] || "1985"
    );

  const campusArea = valueOrFallback(
    about.campus_area,
    about.default_campus_area ||
      fallbackAbout.default_campus_area!
  );

  const aboutButtonLabel = valueOrFallback(
    about.about_button_label,
    fallbackAbout.about_button_label!
  );

  const aboutButtonUrl = valueOrFallback(
    about.about_button_url,
    fallbackAbout.about_button_url!
  );

  const founderButtonLabel = valueOrFallback(
    about.founder_story_button_label,
    fallbackAbout.founder_story_button_label!
  );

  const founderButtonUrl = valueOrFallback(
    about.founder_story_button_url,
    fallbackAbout.founder_story_button_url!
  );

  const imageAlt = valueOrFallback(
    about.image_alt,
    fallbackAbout.image_alt!
  );

  const founderImageAlt = valueOrFallback(
    about.founder_image_alt,
    fallbackAbout.founder_image_alt!
  );

  const mainImage =
    about.image_url || fallbackAbout.image_url!;

  return (
    <section
      id="about"
      className="
        overflow-hidden
        bg-[#F5F0E6]
        pt-28
        text-[#10203A]
        md:pt-32
        lg:pt-36
      "
    >
      <div
        className="
          mx-auto
          max-w-[1500px]
          px-6
          pb-20
          pt-10
          md:px-10
          md:pb-28
          md:pt-12
          lg:px-14
          lg:pb-32
          lg:pt-14
        "
      >
        {/* INTRO */}

        <div className="grid gap-12 lg:grid-cols-[1fr_0.75fr] lg:items-end">

          <Reveal>
            <div>
              <div
                className="
                  flex
                  items-center
                  gap-3
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.3em]
                  text-[#102A56]/40
                "
              >
                <span className="h-px w-9 bg-[#102A56]/25" />

                {valueOrFallback(
                  about.eyebrow,
                  fallbackAbout.eyebrow!
                )}
              </div>

              <h1
                className="
                  mt-7
                  max-w-5xl
                  text-4xl
                  font-semibold
                  leading-[0.92]
                  tracking-[-0.06em]
                  text-[#102A56]
                  md:text-6xl
                  lg:text-[5vw]
                "
              >
                {valueOrFallback(
                  about.title,
                  fallbackAbout.title!
                )}
              </h1>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <p
                className="
                  max-w-xl
                  text-base
                  leading-7
                  text-[#10203A]/55
                  md:text-lg
                "
              >
                {valueOrFallback(
                  about.subtitle,
                  about.content ||
                    fallbackAbout.content!
                )}
              </p>

              <p
                className="
                  mt-5
                  max-w-xl
                  text-sm
                  leading-7
                  text-[#10203A]/45
                "
              >
                {valueOrFallback(
                  about.content,
                  fallbackAbout.content!
                )}
              </p>

              <Link
                href={aboutButtonUrl}
                className="
                  group
                  mt-7
                  inline-flex
                  items-center
                  gap-3
                  rounded-full
                  bg-[#102A56]
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  !text-white
                  shadow-[0_10px_30px_rgba(16,42,86,0.16)]
                  ring-1
                  ring-[#102A56]/10
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-[#1B3D73]
                  hover:!text-white
                  hover:shadow-[0_16px_38px_rgba(16,42,86,0.22)]
                "
              >
                <span className="!text-white">
                  {aboutButtonLabel}
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
                    strokeWidth={2.3}
                    className="!text-[#102A56]"
                  />
                </span>
              </Link>
            </div>
          </Reveal>
        </div>

        {/* IMAGE + STORY */}

        <div className="mt-16 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">

          {/* MAIN IMAGE */}

          <Reveal>
            <div
              className="
                relative
                min-h-[560px]
                overflow-hidden
                rounded-[2rem]
                bg-[#102A56]
              "
            >
              <Image
                src={mainImage}
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="
                  object-cover
                  object-center
                  transition
                  duration-700
                  hover:scale-[1.02]
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-[#071A38]/75
                  via-transparent
                  to-[#102A56]/5
                "
              />

              <div
                className="
                  absolute
                  left-6
                  top-6
                  rounded-full
                  border
                  border-white/20
                  bg-black/10
                  px-4
                  py-2
                  text-[10px]
                  uppercase
                  tracking-[0.24em]
                  text-white/80
                  backdrop-blur-sm
                  md:left-8
                  md:top-8
                "
              >
                {establishedDate}
              </div>

              <div
                className="
                  absolute
                  bottom-7
                  left-6
                  right-6
                  md:left-8
                  md:right-8
                "
              >
                <p
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.25em]
                    text-white/50
                  "
                >
                  {valueOrFallback(
                    about.glance_label,
                    fallbackAbout.glance_label!
                  )}
                </p>

                <p
                  className="
                    mt-3
                    max-w-2xl
                    text-2xl
                    font-medium
                    leading-tight
                    tracking-[-0.035em]
                    text-white
                    md:text-4xl
                  "
                >
                  {valueOrFallback(
                    about.glance_text,
                    fallbackAbout.glance_text!
                  )}
                </p>
              </div>
            </div>
          </Reveal>

          {/* STORY */}

          <Reveal delay={0.1}>
            <div
              className="
                flex
                min-h-[560px]
                flex-col
                justify-between
                rounded-[2rem]
                bg-[#102A56]
                p-7
                text-white
                md:p-10
              "
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.28em]
                      text-white/35
                    "
                  >
                    {valueOrFallback(
                      about.beginnings_label,
                      fallbackAbout.beginnings_label!
                    )}
                  </span>

                  <span
                    className="
                      text-sm
                      font-semibold
                      text-[#DCE7F5]
                    "
                  >
                    {founderYear}
                  </span>
                </div>

                <h2
                  className="
                    mt-14
                    max-w-xl
                    text-4xl
                    font-semibold
                    leading-[0.95]
                    tracking-[-0.05em]
                    md:text-5xl
                  "
                >
                  {valueOrFallback(
                    about.founder_heading,
                    fallbackAbout.founder_heading!
                  )}
                </h2>

                <p
                  className="
                    mt-7
                    max-w-xl
                    text-sm
                    leading-7
                    text-white/60
                    md:text-base
                  "
                >
                  {valueOrFallback(
                    about.founder_story,
                    fallbackAbout.founder_story!
                  )}
                </p>
              </div>

              {/* FOUNDER */}

              <div className="mt-12">
                <div className="flex items-center gap-4">
                  <div
                    className="
                      relative
                      h-14
                      w-14
                      shrink-0
                      overflow-hidden
                      rounded-full
                      border
                      border-white/10
                      bg-white/[0.08]
                    "
                  >
                    {about.founder_image_url ? (
                      <Image
                        src={about.founder_image_url}
                        alt={founderImageAlt}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className="
                          grid
                          h-full
                          w-full
                          place-items-center
                          text-[10px]
                          text-white/30
                        "
                      >
                        AMJ
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-base font-semibold">
                      {valueOrFallback(
                        about.founder_name,
                        fallbackAbout.founder_name!
                      )}
                    </p>

                    <p
                      className="
                        mt-1
                        text-[9px]
                        uppercase
                        tracking-[0.2em]
                        text-white/35
                      "
                    >
                      {valueOrFallback(
                        about.founder_role,
                        fallbackAbout.founder_role!
                      )}
                    </p>
                  </div>
                </div>

                <Link
                  href={founderButtonUrl}
                  className="
                    group
                    mt-7
                    inline-flex
                    items-center
                    gap-2
                    !text-white/75
                    text-sm
                    font-medium
                    transition
                    hover:!text-white
                  "
                >
                  <span>
                    {founderButtonLabel}
                  </span>

                  <ArrowRight
                    size={14}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>

        {/* VALUES */}

        <Reveal delay={0.05}>
          <div className="mt-5 grid gap-5 md:grid-cols-3">

            <ValueCard
              icon={<BookOpen size={18} strokeWidth={1.6} />}
              title={valueOrFallback(
                about.values_learning_title,
                fallbackAbout.values_learning_title!
              )}
              description={valueOrFallback(
                about.values_learning_description,
                fallbackAbout.values_learning_description!
              )}
            />

            <ValueCard
              icon={<Heart size={18} strokeWidth={1.6} />}
              title={valueOrFallback(
                about.values_character_title,
                fallbackAbout.values_character_title!
              )}
              description={valueOrFallback(
                about.values_character_description,
                fallbackAbout.values_character_description!
              )}
            />

            <ValueCard
              icon={<Users size={18} strokeWidth={1.6} />}
              title={valueOrFallback(
                about.values_community_title,
                fallbackAbout.values_community_title!
              )}
              description={valueOrFallback(
                about.values_community_description,
                fallbackAbout.values_community_description!
              )}
            />

          </div>
        </Reveal>

        {/* SCHOOL FACTS */}

        <Reveal delay={0.08}>
          <div className="mt-5 grid gap-5 md:grid-cols-3">

            <FactCard
              dark
              label={valueOrFallback(
                about.established_label,
                fallbackAbout.established_label!
              )}
              value={establishedDate}
            />

            <FactCard
              label={valueOrFallback(
                about.institution_label,
                fallbackAbout.institution_label!
              )}
              value={valueOrFallback(
                about.institution_type,
                fallbackAbout.institution_type!
              )}
            />

            <FactCard
              label={valueOrFallback(
                about.campus_label,
                fallbackAbout.campus_label!
              )}
              value={campusArea}
            />

          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        rounded-[2rem]
        border
        border-[#102A56]/10
        bg-white/[0.52]
        p-7
        transition
        duration-500
        hover:-translate-y-1
        hover:bg-white
        md:p-8
      "
    >
      <div
        className="
          grid
          h-11
          w-11
          place-items-center
          rounded-full
          border
          border-[#102A56]/10
          bg-[#102A56]/[0.035]
          text-[#102A56]
        "
      >
        {icon}
      </div>

      <h3
        className="
          mt-7
          text-xl
          font-semibold
          tracking-[-0.03em]
          text-[#102A56]
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-3
          text-sm
          leading-6
          text-[#10203A]/50
        "
      >
        {description}
      </p>
    </div>
  );
}

function FactCard({
  label,
  value,
  dark = false,
}: {
  label: string;
  value: string;
  dark?: boolean;
}) {
  return (
    <div
      className={
        dark
          ? `
            rounded-[2rem]
            bg-[#102A56]
            p-7
            text-white
            md:p-8
          `
          : `
            rounded-[2rem]
            bg-[#E9E2D5]
            p-7
            text-[#102A56]
            md:p-8
          `
      }
    >
      <p
        className={
          dark
            ? `
              text-[9px]
              uppercase
              tracking-[0.24em]
              text-white/30
            `
            : `
              text-[9px]
              uppercase
              tracking-[0.24em]
              text-[#102A56]/35
            `
        }
      >
        {label}
      </p>

      <p
        className={
          dark
            ? "mt-4 text-2xl font-semibold"
            : "mt-4 text-lg font-semibold leading-6"
        }
      >
        {value}
      </p>
    </div>
  );
}