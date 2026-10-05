"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  FlaskConical,
  GraduationCap,
  Library,
  Calculator,
  Palette,
  FileText,
  Users,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type AcademicsSettings = {
  section_label: string;
  heading_line_1: string;
  heading_line_2: string;
  description: string;

  explore_button_label: string;
  explore_button_url: string;

  senior_secondary_label: string;
  senior_secondary_heading_line_1: string;
  senior_secondary_heading_line_2: string;
  senior_secondary_description: string;

  stream_button_label: string;
  stream_button_url: string;

  resource_label: string;

  syllabus_title: string;
  syllabus_button_label: string;
  syllabus_button_url: string;

  datesheet_title: string;
  datesheet_button_label: string;
  datesheet_button_url: string;

  faculty_label: string;
  faculty_title: string;
  faculty_button_label: string;
  faculty_button_url: string;

  closing_label: string;
  closing_heading_line_1: string;
  closing_heading_line_2: string;
  closing_button_label: string;
  closing_button_url: string;

  is_active: boolean;
};

type AcademicStage = {
  id: string;
  number: number;
  display_number: string | null;
  title: string;
  classes: string;
  description: string;
  image_url: string;
  icon_name: string;
  card_size: string;
  button_label: string;
  button_url: string;
  sort_order: number;
  is_active: boolean;
};

type AcademicStream = {
  id: string;
  title: string;
  subjects: string;
  description: string;
  image_url: string;
  icon_name: string;
  button_label: string;
  button_url: string;
  sort_order: number;
  is_active: boolean;
};

const fallbackSettings: AcademicsSettings = {
  section_label: "Learning at Apex",
  heading_line_1: "Learning grows",
  heading_line_2: "with every stage.",
  description:
    "From the early years to senior secondary education, Apex supports students through changing interests, deeper learning and new academic possibilities.",

  explore_button_label: "Explore academics",
  explore_button_url: "/academics",

  senior_secondary_label: "Senior Secondary",
  senior_secondary_heading_line_1: "Choose a path",
  senior_secondary_heading_line_2:
    "that feels like yours.",
  senior_secondary_description:
    "Senior secondary education opens the door to more focused study. Apex offers academic pathways in Science, Commerce and Humanities.",

  stream_button_label: "Explore",
  stream_button_url:
    "/academics/senior-secondary",

  resource_label: "Resource",

  syllabus_title: "Syllabus",
  syllabus_button_label: "View syllabus",
  syllabus_button_url:
    "/academics/syllabus",

  datesheet_title: "Datesheet",
  datesheet_button_label: "View datesheet",
  datesheet_button_url:
    "/academics/datesheet",

  faculty_label: "People",
  faculty_title: "Our Faculty",
  faculty_button_label: "Meet the faculty",
  faculty_button_url: "/faculty",

  closing_label:
    "Education beyond the syllabus",
  closing_heading_line_1:
    "Strong academics matter.",
  closing_heading_line_2:
    "So do curiosity, confidence, creativity and character.",
  closing_button_label: "Academic life",
  closing_button_url: "/academics",

  is_active: true,
};

const fallbackStages: AcademicStage[] = [
  {
    id: "fallback-stage-1",
    number: 1,
    display_number: "01",
    title: "Primary School",
    classes: "Classes I â€“ V",
    description:
      "Building strong foundations through curiosity, confidence, communication and joyful learning.",
    image_url:
      "https://apexpublicschool.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-02-at-1.06.01-PM-22.jpeg",
    icon_name: "BookOpen",
    card_size: "large",
    button_label: "Learn more",
    button_url: "/academics",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "fallback-stage-2",
    number: 2,
    display_number: "02",
    title: "Middle School",
    classes: "Classes VI â€“ VIII",
    description:
      "Developing independent thinking, wider knowledge, practical understanding and responsibility.",
    image_url:
      "https://apexpublicschool.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-02-at-1.06.01-PM-28.jpeg",
    icon_name: "GraduationCap",
    card_size: "small",
    button_label: "Learn more",
    button_url: "/academics",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "fallback-stage-3",
    number: 3,
    display_number: "03",
    title: "Secondary School",
    classes: "Classes IX â€“ X",
    description:
      "A focused academic journey supported by subject depth, discipline and preparation for future pathways.",
    image_url:
      "https://apexpublicschool.in/wp-content/uploads/2020/05/IMG_0413-scaled.jpg",
    icon_name: "FlaskConical",
    card_size: "small",
    button_label: "Learn more",
    button_url: "/academics",
    sort_order: 3,
    is_active: true,
  },
  {
    id: "fallback-stage-4",
    number: 4,
    display_number: "04",
    title: "Senior Secondary",
    classes: "Classes XI â€“ XII",
    description:
      "Students can pursue focused academic pathways aligned with their interests and ambitions.",
    image_url:
      "https://apexpublicschool.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-02-at-1.06.01-PM-22.jpeg",
    icon_name: "Library",
    card_size: "large",
    button_label: "Learn more",
    button_url: "/academics",
    sort_order: 4,
    is_active: true,
  },
];

const fallbackStreams: AcademicStream[] = [
  {
    id: "fallback-stream-1",
    title: "Science",
    subjects:
      "Physics Â· Chemistry Â· Mathematics",
    description:
      "For students drawn to scientific thinking, experimentation, mathematics and future technical or scientific pathways.",
    image_url:
      "https://apexpublicschool.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-02-at-1.06.01-PM-22.jpeg",
    icon_name: "FlaskConical",
    button_label: "Explore",
    button_url:
      "/academics/senior-secondary",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "fallback-stream-2",
    title: "Commerce",
    subjects:
      "Accountancy Â· Business Studies Â· Mathematics",
    description:
      "For students interested in business, economics, accounting, finance and the world of enterprise.",
    image_url:
      "https://apexpublicschool.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-02-at-1.06.01-PM-28.jpeg",
    icon_name: "Calculator",
    button_label: "Explore",
    button_url:
      "/academics/senior-secondary",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "fallback-stream-3",
    title: "Humanities",
    subjects:
      "History Â· Geography Â· Sociology",
    description:
      "For students exploring society, people, ideas, history, culture and the wider world.",
    image_url:
      "https://apexpublicschool.in/wp-content/uploads/2020/05/IMG_0413-scaled.jpg",
    icon_name: "Palette",
    button_label: "Explore",
    button_url:
      "/academics/senior-secondary",
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

function getIcon(name: string) {
  const icons: Record<
    string,
    React.ElementType
  > = {
    BookOpen,
    FlaskConical,
    GraduationCap,
    Library,
    Calculator,
    Palette,
    FileText,
    Users,
  };

  return icons[name] ?? BookOpen;
}

function cleanValue(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

export default function Academics() {
  const [settings, setSettings] =
    useState<AcademicsSettings>(
      fallbackSettings
    );

  const [stages, setStages] =
    useState<AcademicStage[]>(
      fallbackStages
    );

  const [streams, setStreams] =
    useState<AcademicStream[]>(
      fallbackStreams
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadAcademics() {
      try {
        const [
          settingsResult,
          stagesResult,
          streamsResult,
        ] = await Promise.all([
          supabase
            .from(
              "academics_home_settings"
            )
            .select("*")
            .eq("is_active", true)
            .order("updated_at", {
              ascending: false,
            })
            .limit(1)
            .maybeSingle(),

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
        ]);

        if (!mounted) {
          return;
        }

        if (settingsResult.error) {
          console.error(
            "Academics settings load error:",
            settingsResult.error
          );
        }

      if (stagesResult.error) {
  console.error(
    "Academic stages load error:",
    {
      message: stagesResult.error.message,
      code: stagesResult.error.code,
      details: stagesResult.error.details,
      hint: stagesResult.error.hint,
    }
  );
}
        if (streamsResult.error) {
          console.error(
            "Academic streams load error:",
            streamsResult.error
          );
        }

        if (settingsResult.data) {
          const data =
            settingsResult.data;

          setSettings({
            ...fallbackSettings,

            section_label:
              cleanValue(
                data.section_label
              ),
            heading_line_1:
              cleanValue(
                data.heading_line_1
              ),
            heading_line_2:
              cleanValue(
                data.heading_line_2
              ),
            description:
              cleanValue(
                data.description
              ),

            explore_button_label:
              cleanValue(
                data.explore_button_label
              ),
            explore_button_url:
              cleanValue(
                data.explore_button_url
              ),

            senior_secondary_label:
              cleanValue(
                data.senior_secondary_label
              ),

            senior_secondary_heading_line_1:
              cleanValue(
                data.senior_secondary_heading_line_1
              ),

            senior_secondary_heading_line_2:
              cleanValue(
                data.senior_secondary_heading_line_2
              ),

            senior_secondary_description:
              cleanValue(
                data.senior_secondary_description
              ),

            stream_button_label:
              cleanValue(
                data.stream_button_label
              ),

            stream_button_url:
              cleanValue(
                data.stream_button_url
              ),

            resource_label:
              cleanValue(
                data.resource_label
              ),

            syllabus_title:
              cleanValue(
                data.syllabus_title
              ),
            syllabus_button_label:
              cleanValue(
                data.syllabus_button_label
              ),
            syllabus_button_url:
              cleanValue(
                data.syllabus_button_url
              ),

            datesheet_title:
              cleanValue(
                data.datesheet_title
              ),
            datesheet_button_label:
              cleanValue(
                data.datesheet_button_label
              ),
            datesheet_button_url:
              cleanValue(
                data.datesheet_button_url
              ),

            faculty_label:
              cleanValue(
                data.faculty_label
              ),
            faculty_title:
              cleanValue(
                data.faculty_title
              ),
            faculty_button_label:
              cleanValue(
                data.faculty_button_label
              ),
            faculty_button_url:
              cleanValue(
                data.faculty_button_url
              ),

            closing_label:
              cleanValue(
                data.closing_label
              ),
            closing_heading_line_1:
              cleanValue(
                data.closing_heading_line_1
              ),
            closing_heading_line_2:
              cleanValue(
                data.closing_heading_line_2
              ),
            closing_button_label:
              cleanValue(
                data.closing_button_label
              ),
            closing_button_url:
              cleanValue(
                data.closing_button_url
              ),

            is_active:
              data.is_active !== false,
          });
        }

        if (
          stagesResult.data &&
          stagesResult.data.length > 0
        ) {
          setStages(
            stagesResult.data.map(
              (item, index) => ({
                id: item.id,

                number:
                  Number(item.number) ||
                  index + 1,

                display_number:
                  item.display_number ??
                  null,

                title:
                  item.title ?? "",

                classes:
                  item.classes ?? "",

                description:
                  item.description ?? "",

                image_url:
                  item.image_url ?? "",

                icon_name:
                  item.icon_name ??
                  "BookOpen",

                card_size:
                  item.card_size ??
                  "small",

                button_label:
                  item.button_label ??
                  "Learn more",

                button_url:
                  item.button_url ??
                  "/academics",

                sort_order:
                  Number(
                    item.sort_order
                  ) || index + 1,

                is_active:
                  item.is_active !==
                  false,
              })
            )
          );
        }

        if (
          streamsResult.data &&
          streamsResult.data.length > 0
        ) {
          setStreams(
            streamsResult.data.map(
              (item) => ({
                id: item.id,

                title:
                  item.title ?? "",

                subjects:
                  item.subjects ?? "",

                description:
                  item.description ??
                  "",

                image_url:
                  item.image_url ??
                  "",

                icon_name:
                  item.icon_name ??
                  "FlaskConical",

                button_label:
                  item.button_label ??
                  "Explore",

                button_url:
                  item.button_url ??
                  "/academics/senior-secondary",

                sort_order:
                  Number(
                    item.sort_order
                  ) || 0,

                is_active:
                  item.is_active !==
                  false,
              })
            )
          );
        }
      } catch (error) {
        console.error(
          "Academics CMS load error:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadAcademics();

    return () => {
      mounted = false;
    };
  }, []);

  if (!settings.is_active) {
    return null;
  }

  const seniorSecondaryStage =
    stages.find(
      (stage) =>
        stage.title
          .trim()
          .toLowerCase() ===
        "senior secondary"
    );

  return (
    <section
      id="academics"
      className="
        relative
        scroll-mt-36
        overflow-hidden
        bg-[#102A56]
        text-[#FFFDF8]
      "
    >
      {/* BACKGROUND ATMOSPHERE */}

      <div
        className="
          pointer-events-none
          absolute
          -right-56
          top-10
          h-[520px]
          w-[520px]
          rounded-full
          bg-[#F5F0E6]/[0.045]
          blur-[130px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -left-64
          bottom-20
          h-[420px]
          w-[420px]
          rounded-full
          bg-[#DCE7F5]/[0.025]
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-b
          from-[#102A56]
          via-[#102A56]
          to-[#0B2245]
          opacity-70
        "
      />

      <div
        className="
          relative
          mx-auto
          max-w-[1500px]
          px-6
          py-24
          md:px-10
          md:py-32
          lg:px-14
          lg:py-40
        "
      >
        {/* HEADER */}

        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
            <div>
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.32em]
                  text-[#F5F0E6]/45
                "
              >
                {settings.section_label}
              </p>

              <h2
                className="
                  mt-6
                  max-w-5xl
                  text-5xl
                  font-semibold
                  leading-[0.9]
                  tracking-[-0.065em]
                  text-[#FFFDF8]
                  md:text-7xl
                  lg:text-[6.6vw]
                "
              >
                {settings.heading_line_1}

                <br />

                <span className="text-[#F5F0E6]/30">
                  {settings.heading_line_2}
                </span>
              </h2>
            </div>

            <div className="max-w-lg">
              <p
                className="
                  text-sm
                  leading-7
                  !text-white/62
                  md:text-base
                "
              >
                {settings.description}
              </p>

              <Link
                href={
                  settings.explore_button_url ||
                  "/academics"
                }
                className="
                  group
                  mt-7
                  inline-flex
                  items-center
                  gap-3
                  rounded-full
                  bg-[#FFFDF8]
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  !text-[#102A56]
                  shadow-[0_10px_30px_rgba(0,0,0,0.20)]
                  ring-1
                  ring-white/10
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-white
                  hover:!text-[#102A56]
                  hover:shadow-[0_16px_36px_rgba(0,0,0,0.28)]
                "
              >
                <span className="!text-[#102A56]">
                  {
                    settings.explore_button_label
                  }
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
                    bg-[#102A56]
                    !text-[#F5F0E6]
                    transition-transform
                    duration-300
                    group-hover:translate-x-0.5
                  "
                >
                  <ArrowRight
                    size={14}
                    strokeWidth={2.4}
                    className="!text-[#F5F0E6]"
                  />
                </span>
              </Link>
            </div>
          </div>
        </Reveal>

        {/* SCHOOL STAGES */}

        <div className="mt-16 grid gap-4 md:grid-cols-2">
          {!loading &&
            stages.map(
              (stage, index) => {
                const Icon = getIcon(
                  stage.icon_name
                );

                const displayNumber =
                  stage.display_number ||
                  String(
                    stage.number ||
                      index + 1
                  ).padStart(2, "0");

                return (
                  <Reveal
                    key={stage.id}
                    delay={
                      index * 0.06
                    }
                  >
                    <article
                      className={`
                        group
                        relative
                        overflow-hidden
                        rounded-[2rem]
                        border
                        border-white/10
                        bg-white/[0.045]
                        transition
                        duration-700
                        hover:-translate-y-2
                        hover:border-white/20
                        hover:bg-white/[0.07]
                        ${
                          stage.card_size ===
                          "large"
                            ? "min-h-[340px]"
                            : "min-h-[340px]"
                        }
                      `}
                    >
                      {stage.image_url && (
                        <img
                          src={
                            stage.image_url
                          }
                          alt={
                            stage.title
                          }
                          className="
                            absolute
                            inset-0
                            h-full
                            w-full
                            object-cover
                            opacity-35
                            transition
                            duration-1000
                            ease-out
                            group-hover:scale-105
                            group-hover:opacity-50
                          "
                        />
                      )}

                      <div
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-[#071A38]/90
                          via-[#102A56]/55
                          to-[#102A56]/15
                        "
                      />

                      <div
                        className="
                          pointer-events-none
                          absolute
                          inset-y-0
                          -left-[60%]
                          w-[35%]
                          skew-x-[-18deg]
                          bg-gradient-to-r
                          from-transparent
                          via-white/[0.08]
                          to-transparent
                          transition-all
                          duration-1000
                          group-hover:left-[125%]
                        "
                      />

                      <div
                        className="
                          relative
                          z-10
                          flex
                          min-h-[340px]
                          flex-col
                          justify-between
                          p-7
                          md:p-9
                        "
                      >
                        <div className="flex items-start justify-between">
                          <span
                            className="
                              text-[10px]
                              tracking-[0.28em]
                              text-white/35
                            "
                          >
                            {displayNumber}
                          </span>

                          <div
                            className="
                              grid
                              h-11
                              w-11
                              place-items-center
                              rounded-full
                              border
                              border-white/10
                              bg-white/[0.05]
                              backdrop-blur-md
                              transition
                              duration-500
                              group-hover:scale-110
                              group-hover:border-white/20
                              group-hover:bg-white/[0.12]
                            "
                          >
                            <Icon
                              size={18}
                              strokeWidth={1.5}
                              className="text-[#F5F0E6]/75"
                            />
                          </div>
                        </div>

                        <div>
                          <p
                            className="
                              text-[9px]
                              uppercase
                              tracking-[0.24em]
                              text-[#F5F0E6]/50
                            "
                          >
                            {stage.classes}
                          </p>

                          <h3
                            className="
                              mt-3
                              text-3xl
                              font-semibold
                              tracking-[-0.04em]
                              text-white
                              md:text-4xl
                            "
                          >
                            {stage.title}
                          </h3>

                          <p
                            className="
                              mt-4
                              max-w-xl
                              text-sm
                              leading-7
                              text-white/65
                            "
                          >
                            {
                              stage.description
                            }
                          </p>

                          <Link
                            href={
                              stage.button_url ||
                              "/academics"
                            }
                            className="
                              group/link
                              mt-6
                              inline-flex
                              items-center
                              gap-2
                              text-xs
                              font-medium
                              !text-[#F5F0E6]/85
                              transition
                              duration-300
                              hover:!text-white
                            "
                          >
                            {
                              stage.button_label
                            }

                            <ArrowRight
                              size={14}
                              className="
                                transition-transform
                                duration-300
                                group-hover/link:translate-x-1
                              "
                            />
                          </Link>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              }
            )}
        </div>

        {/* SENIOR SECONDARY */}

        <Reveal delay={0.08}>
          <div
            className="
              mt-5
              overflow-hidden
              rounded-[2rem]
              border
              border-white/10
              bg-[#0B2245]
            "
          >
            <div className="grid lg:grid-cols-[0.8fr_1.2fr]">

              {/* IMAGE */}

              <div
                className="
                  group
                  relative
                  min-h-[390px]
                  overflow-hidden
                  bg-[#163A6D]
                "
              >
                {seniorSecondaryStage?.image_url ? (
                  <img
                    src={
                      seniorSecondaryStage.image_url
                    }
                    alt={
                      settings.senior_secondary_label
                    }
                    className="
                      absolute
                      inset-0
                      h-full
                      w-full
                      object-cover
                      opacity-50
                      transition
                      duration-[1200ms]
                      group-hover:scale-105
                      group-hover:opacity-65
                    "
                  />
                ) : null}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#071A38]/70
                    via-[#102A56]/25
                    to-transparent
                  "
                />

                <div
                  className="
                    absolute
                    inset-0
                    bg-[radial-gradient(circle_at_35%_30%,rgba(245,240,230,0.12),transparent_35%)]
                  "
                />

                <div
                  className="
                    absolute
                    bottom-8
                    left-7
                    md:bottom-10
                    md:left-10
                  "
                >
                  <p
                    className="
                      text-[9px]
                      uppercase
                      tracking-[0.28em]
                      text-white/45
                    "
                  >
                    {
                      settings.senior_secondary_label
                    }
                  </p>

                  <h3
                    className="
                      mt-4
                      max-w-md
                      text-4xl
                      font-semibold
                      leading-[0.94]
                      tracking-[-0.05em]
                      text-white
                      md:text-6xl
                    "
                  >
                    {
                      settings.senior_secondary_heading_line_1
                    }

                    <br />

                    {
                      settings.senior_secondary_heading_line_2
                    }
                  </h3>
                </div>
              </div>

              {/* STREAMS */}

              <div className="p-7 md:p-10 lg:p-14">
                <p
                  className="
                    text-sm
                    leading-7
                    !text-white/60
                  "
                >
                  {
                    settings.senior_secondary_description
                  }
                </p>

                <div className="mt-8 grid gap-3 md:grid-cols-3">
                  {streams.map(
                    (stream) => {
                      const Icon =
                        getIcon(
                          stream.icon_name
                        );

                      return (
                        <div
                          key={
                            stream.id
                          }
                          className="
                            group/stream
                            relative
                            min-h-[290px]
                            overflow-hidden
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/[0.035]
                            transition
                            duration-700
                            hover:-translate-y-1
                            hover:border-white/20
                            hover:bg-white/[0.07]
                          "
                        >
                          {stream.image_url && (
                            <img
                              src={
                                stream.image_url
                              }
                              alt={
                                stream.title
                              }
                              className="
                                absolute
                                inset-0
                                h-full
                                w-full
                                object-cover
                                opacity-30
                                transition
                                duration-1000
                                group-hover/stream:scale-110
                                group-hover/stream:opacity-50
                              "
                            />
                          )}

                          <div
                            className="
                              absolute
                              inset-0
                              bg-gradient-to-t
                              from-[#071A38]/85
                              via-[#102A56]/45
                              to-[#102A56]/10
                            "
                          />

                          <div
                            className="
                              relative
                              z-10
                              flex
                              h-full
                              flex-col
                              p-5
                            "
                          >
                            <div
                              className="
                                grid
                                h-9
                                w-9
                                place-items-center
                                rounded-full
                                border
                                border-white/10
                                bg-white/[0.04]
                              "
                            >
                              <Icon
                                size={17}
                                strokeWidth={1.5}
                                className="text-[#DCE7F5]"
                              />
                            </div>

                            <div className="mt-auto">
                              <h4
                                className="
                                  text-xl
                                  font-semibold
                                  !text-white
                                "
                              >
                                {
                                  stream.title
                                }
                              </h4>

                              <p
                                className="
                                  mt-2
                                  text-xs
                                  font-medium
                                  !text-[#F5F0E6]/70
                                "
                              >
                                {
                                  stream.subjects
                                }
                              </p>

                              <p
                                className="
                                  mt-3
                                  text-xs
                                  leading-6
                                  !text-white/55
                                "
                              >
                                {
                                  stream.description
                                }
                              </p>

                              <Link
                                href={
                                  stream.button_url ||
                                  settings.stream_button_url ||
                                  "/academics/senior-secondary"
                                }
                                className="
                                  group/streamlink
                                  mt-5
                                  inline-flex
                                  items-center
                                  gap-2
                                  text-xs
                                  !text-[#F5F0E6]/80
                                  transition
                                  hover:!text-white
                                "
                              >
                                {
                                  stream.button_label ||
                                  settings.stream_button_label
                                }

                                <ArrowRight
                                  size={13}
                                  className="
                                    transition-transform
                                    group-hover/streamlink:translate-x-1
                                  "
                                />
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* RESOURCES */}

        <Reveal delay={0.1}>
          <div className="mt-5 grid gap-4 md:grid-cols-3">

            <ResourceCard
              label={
                settings.resource_label
              }
              title={
                settings.syllabus_title
              }
              buttonLabel={
                settings.syllabus_button_label
              }
              href={
                settings.syllabus_button_url
              }
            />

            <ResourceCard
              label={
                settings.resource_label
              }
              title={
                settings.datesheet_title
              }
              buttonLabel={
                settings.datesheet_button_label
              }
              href={
                settings.datesheet_button_url
              }
            />

            <ResourceCard
              label={
                settings.faculty_label
              }
              title={
                settings.faculty_title
              }
              buttonLabel={
                settings.faculty_button_label
              }
              href={
                settings.faculty_button_url
              }
            />

          </div>
        </Reveal>

        {/* CLOSING */}

        <Reveal delay={0.12}>
          <div
            className="
              mt-20
              flex
              flex-col
              gap-7
              border-t
              border-white/10
              pt-8
              md:flex-row
              md:items-end
              md:justify-between
            "
          >
            <div>
              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.28em]
                  text-white/30
                "
              >
                {settings.closing_label}
              </p>

              <p
                className="
                  mt-4
                  max-w-3xl
                  text-2xl
                  font-medium
                  leading-[1.08]
                  tracking-[-0.035em]
                  text-white
                  md:text-4xl
                "
              >
                {
                  settings.closing_heading_line_1
                }

                <span className="text-white/30">
                  {" "}
                  {
                    settings.closing_heading_line_2
                  }
                </span>
              </p>
            </div>

            <Link
              href={
                settings.closing_button_url ||
                "/academics"
              }
              className="
                group
                inline-flex
                shrink-0
                items-center
                gap-3
                rounded-full
                border
                border-white/15
                px-6
                py-4
                text-sm
                !text-white/80
                transition
                duration-300
                hover:-translate-y-1
                hover:bg-white/10
                hover:!text-white
              "
            >
              {
                settings.closing_button_label
              }

              <ArrowRight
                size={16}
                className="
                  transition-transform
                  group-hover:translate-x-1
                "
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ResourceCard({
  label,
  title,
  buttonLabel,
  href,
}: {
  label: string;
  title: string;
  buttonLabel: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="
        group
        relative
        overflow-hidden
        rounded-[2rem]
        border
        border-white/10
        bg-white/[0.04]
        p-7
        transition
        duration-500
        hover:-translate-y-1
        hover:bg-white/[0.07]
      "
    >
      <p
        className="
          text-[9px]
          uppercase
          tracking-[0.25em]
          text-white/30
        "
      >
        {label}
      </p>

      <h3
        className="
          mt-12
          text-2xl
          font-semibold
          text-white
        "
      >
        {title}
      </h3>

      <div
        className="
          mt-6
          flex
          items-center
          gap-2
          text-xs
          !text-[#F5F0E6]/70
        "
      >
        {buttonLabel}

        <ArrowRight
          size={14}
          className="
            transition-transform
            group-hover:translate-x-1
          "
        />
      </div>
    </Link>
  );
}
