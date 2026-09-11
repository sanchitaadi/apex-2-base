import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Mail,
  Phone,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type CoordinatorPage = {
  id?: string;
  slug?: string;
  menu_label?: string | null;
  title?: string | null;
  eyebrow?: string | null;
  person_name?: string | null;
  person_role?: string | null;
  content?: string | null;
  image_url?: string | null;

  hero_back_label?: string | null;
  hero_back_url?: string | null;

  image_label?: string | null;
  profile_label?: string | null;

  message_heading_line_1?: string | null;
  message_heading_line_2?: string | null;

  focus_section_enabled?: boolean | null;

  focus_card_1_number?: string | null;
  focus_card_1_title?: string | null;
  focus_card_1_description?: string | null;

  focus_card_2_number?: string | null;
  focus_card_2_title?: string | null;
  focus_card_2_description?: string | null;

  focus_card_3_number?: string | null;
  focus_card_3_title?: string | null;
  focus_card_3_description?: string | null;

  phone_number?: string | null;
  phone_button_label?: string | null;

  email_address?: string | null;
  email_button_label?: string | null;

  bottom_back_label?: string | null;
  bottom_back_url?: string | null;
};

const fallbackCoordinator: CoordinatorPage = {
  slug: "head-academic-coordinator",
  menu_label: "Head Academic Coordinator",
  eyebrow: "Head Academic Coordinator’s Message",
  title: "Head Academic Coordinator’s Message",
  person_name: "Ms. Deepa Sharma",
  person_role: "Head Academic Coordinator",

  image_url:
    "https://apexpublicschool.in/wp-content/uploads/2025/10/WhatsApp-Image-2025-09-20-at-12.24.39-PM-2.jpeg",

  content: `At APEX PUBLIC SCHOOL we believe that education is not only about imparting knowledge but also about nurturing values, creativity, and a spirit of lifelong learning. As the Head Academic Coordinator, it is my privilege to work closely with our dedicated team of teachers, students, and parents to ensure that every child receives a holistic and enriching learning experience.

Our academic framework is designed to balance scholastic excellence with co-scholastic growth, encouraging students to develop critical thinking, problem-solving abilities, and confidence to meet the challenges of tomorrow. Regular monitoring of syllabus completion, innovative teaching practices, and differentiated support for learners help us maintain high academic standards while addressing individual learning needs.

We are equally committed to integrating values, skills, and sustainable practices into our curriculum so that our students emerge as responsible global citizens. With continuous collaboration between teachers, coordinators, and parents, we strive to create an atmosphere where curiosity is nurtured, talents are celebrated, and progress is measured not only in grades but in character and resilience.

I extend my heartfelt gratitude to our educators for their dedication, to parents for their trust, and to our students for their enthusiasm and hard work. Together, we will continue to build an environment of excellence and inspiration at Apex Public School.

Answer Duty’s Call

Ms. Deepa Sharma
Head Academic Coordinator`,

  hero_back_label: "About Apex",
  hero_back_url: "/about",

  image_label: "Academic Leadership",
  profile_label: "Head Academic Coordinator's Message",

  message_heading_line_1: "Academic leadership",
  message_heading_line_2: "with purpose.",

  focus_section_enabled: true,

  focus_card_1_number: "01",
  focus_card_1_title: "Holistic Learning",
  focus_card_1_description:
    "Balancing scholastic excellence with co-scholastic development and lifelong learning.",

  focus_card_2_number: "02",
  focus_card_2_title: "Innovation",
  focus_card_2_description:
    "Encouraging critical thinking, problem solving, creativity and innovative teaching practices.",

  focus_card_3_number: "03",
  focus_card_3_title: "Future Ready",
  focus_card_3_description:
    "Preparing students with the confidence and skills needed for the challenges of tomorrow.",

  phone_number: "09990061747",
  phone_button_label: "Contact school",

  email_address: "contacts.apexschool@gmail.com",
  email_button_label: "Email school",

  bottom_back_label: "Back to About Apex",
  bottom_back_url: "/about",
};

function MessageParagraphs({
  text,
}: {
  text: string;
}) {
  return (
    <div className="space-y-6 text-sm leading-8 text-[#10203A]/65 md:text-base">
      {text
        .split(/\n\s*\n/)
        .map((paragraph, index) => {
          const value = paragraph.trim();

          if (!value) return null;

          const isGreeting =
            value === "Answer Duty’s Call";

          const isSignature =
            value === "Ms. Deepa Sharma" ||
            value === "Head Academic Coordinator";

          return (
            <p
              key={index}
              className={
                isGreeting || isSignature
                  ? "font-semibold text-[#102A56]"
                  : undefined
              }
            >
              {value}
            </p>
          );
        })}
    </div>
  );
}

export default async function HeadAcademicCoordinatorPage() {
  let coordinator = fallbackCoordinator;

  try {
    const { data, error } = await supabase
      .from("about_pages")
      .select(`
        id,
        slug,
        menu_label,
        title,
        eyebrow,
        person_name,
        person_role,
        content,
        image_url,

        hero_back_label,
        hero_back_url,

        image_label,
        profile_label,

        message_heading_line_1,
        message_heading_line_2,

        focus_section_enabled,

        focus_card_1_number,
        focus_card_1_title,
        focus_card_1_description,

        focus_card_2_number,
        focus_card_2_title,
        focus_card_2_description,

        focus_card_3_number,
        focus_card_3_title,
        focus_card_3_description,

        phone_number,
        phone_button_label,

        email_address,
        email_button_label,

        bottom_back_label,
        bottom_back_url
      `)
      .eq("slug", "head-academic-coordinator")
      .eq("is_active", true)
      .maybeSingle();

    if (!error && data) {
      const cleanedData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value === null ? "" : value,
        ])
      );

      coordinator = {
        ...fallbackCoordinator,
        ...(cleanedData as Partial<CoordinatorPage>),
      };
    }
  } catch (error) {
    console.error(
      "Head Academic Coordinator page load failed:",
      error
    );
  }

  const personName =
    coordinator.person_name ||
    fallbackCoordinator.person_name!;

  const personRole =
    coordinator.person_role ||
    fallbackCoordinator.person_role!;

  const content =
    coordinator.content ||
    fallbackCoordinator.content!;

  const phone =
    coordinator.phone_number ||
    fallbackCoordinator.phone_number!;

  const email =
    coordinator.email_address ||
    fallbackCoordinator.email_address!;

  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F0E6] text-[#10203A]">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#102A56] text-white">

        <div className="pointer-events-none absolute -right-48 -top-48 h-[650px] w-[650px] rounded-full bg-[#8DB9E5]/10 blur-[140px]" />

        <div className="pointer-events-none absolute -left-48 bottom-[-280px] h-[620px] w-[620px] rounded-full bg-[#F5F0E6]/[0.05] blur-[140px]" />

        <div className="relative mx-auto max-w-[1500px] px-6 pb-24 pt-36 md:px-10 md:pb-32 lg:px-14 lg:pt-40">

          <Link
            href={
              coordinator.hero_back_url ||
              fallbackCoordinator.hero_back_url!
            }
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
              duration-300
              hover:text-white
            "
          >
            <ArrowLeft size={13} />

            {coordinator.hero_back_label ||
              fallbackCoordinator.hero_back_label}
          </Link>

          <div className="mt-14 flex items-center gap-3">

            <span className="h-px w-10 bg-[#F5F0E6]/30" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#F5F0E6]/50">
              {coordinator.eyebrow ||
                fallbackCoordinator.eyebrow}
            </p>

          </div>

          <p className="mt-8 text-sm font-medium text-[#F5F0E6]/75 md:text-base">
            {personName}
          </p>

          <h1 className="mt-4 max-w-5xl text-5xl font-semibold leading-[0.9] tracking-[-0.06em] md:text-7xl lg:text-[6.1vw]">
            {coordinator.title ||
              fallbackCoordinator.title}
          </h1>

          <div className="mt-10 flex items-center gap-4">

            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.06]">
              <BookOpen
                size={19}
                strokeWidth={1.5}
              />
            </div>

            <div>
              <p className="text-sm font-semibold">
                {personName}
              </p>

              <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/40">
                {personRole}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* MAIN MESSAGE */}
      <section>
        <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14 lg:py-32">

          <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">

            {/* IMAGE */}
            <div className="relative min-h-[620px] overflow-hidden rounded-[2rem] bg-[#102A56]">

              {coordinator.image_url ? (
                <img
                  src={coordinator.image_url}
                  alt={personName}
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    object-center
                  "
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#315D93] via-[#193B69] to-[#071A38]" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#071A38]/90 via-[#071A38]/10 to-transparent" />

              <div className="absolute left-7 top-7 rounded-full border border-white/15 bg-black/10 px-4 py-2 text-[9px] uppercase tracking-[0.24em] text-white/75 backdrop-blur-md">
                {coordinator.image_label ||
                  fallbackCoordinator.image_label}
              </div>

              <div className="absolute bottom-8 left-7 right-7 md:bottom-10 md:left-9 md:right-9">

                <p className="text-[9px] uppercase tracking-[0.28em] text-[#F5F0E6]/50">
                  {personRole}
                </p>

                <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em] text-white md:text-4xl">
                  {personName}
                </h2>

              </div>
            </div>

            {/* MESSAGE CARD */}
            <article className="rounded-[2rem] bg-white p-8 md:p-12 lg:p-14">

              <div className="flex items-center gap-3">

                <span className="h-px w-9 bg-[#102A56]/20" />

                <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#102A56]/35">
                  {coordinator.profile_label ||
                    fallbackCoordinator.profile_label}
                </p>

              </div>

              <h2 className="mt-7 max-w-2xl text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#102A56] md:text-5xl">

                {coordinator.message_heading_line_1 ||
                  fallbackCoordinator.message_heading_line_1}

                <br />

                {coordinator.message_heading_line_2 ||
                  fallbackCoordinator.message_heading_line_2}

              </h2>

              <div className="mt-9">
                <MessageParagraphs text={content} />
              </div>

            </article>

          </div>

          {/* ACADEMIC FOCUS */}
          {coordinator.focus_section_enabled !== false && (
            <div className="mt-6 grid gap-6 md:grid-cols-3">

              <article className="rounded-[2rem] bg-[#102A56] p-8 text-white md:p-9">

                <p className="text-[9px] uppercase tracking-[0.28em] text-white/30">
                  {coordinator.focus_card_1_number ||
                    fallbackCoordinator.focus_card_1_number}
                </p>

                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.035em]">
                  {coordinator.focus_card_1_title ||
                    fallbackCoordinator.focus_card_1_title}
                </h3>

                <p className="mt-5 text-sm leading-7 text-white/55">
                  {coordinator.focus_card_1_description ||
                    fallbackCoordinator.focus_card_1_description}
                </p>

              </article>

              <article className="rounded-[2rem] border border-[#102A56]/10 bg-white p-8 md:p-9">

                <p className="text-[9px] uppercase tracking-[0.28em] text-[#102A56]/30">
                  {coordinator.focus_card_2_number ||
                    fallbackCoordinator.focus_card_2_number}
                </p>

                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.035em] text-[#102A56]">
                  {coordinator.focus_card_2_title ||
                    fallbackCoordinator.focus_card_2_title}
                </h3>

                <p className="mt-5 text-sm leading-7 text-[#10203A]/55">
                  {coordinator.focus_card_2_description ||
                    fallbackCoordinator.focus_card_2_description}
                </p>

              </article>

              <article className="rounded-[2rem] border border-[#102A56]/10 bg-white p-8 md:p-9">

                <p className="text-[9px] uppercase tracking-[0.28em] text-[#102A56]/30">
                  {coordinator.focus_card_3_number ||
                    fallbackCoordinator.focus_card_3_number}
                </p>

                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.035em] text-[#102A56]">
                  {coordinator.focus_card_3_title ||
                    fallbackCoordinator.focus_card_3_title}
                </h3>

                <p className="mt-5 text-sm leading-7 text-[#10203A]/55">
                  {coordinator.focus_card_3_description ||
                    fallbackCoordinator.focus_card_3_description}
                </p>

              </article>

            </div>
          )}

          {/* CONTACT */}
          <div className="mt-10 flex flex-wrap gap-3">

            <a
  href={`tel:${phone.replace(/\s+/g, "")}`}
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
    hover:-translate-y-0.5
    hover:bg-[#1B3D73]
  "
>
  <Phone
    size={14}
    className="!text-[#F5F0E6]"
  />

  <span className="!text-[#F5F0E6]">
    {coordinator.phone_button_label ||
      fallbackCoordinator.phone_button_label}
  </span>

  <ArrowRight
    size={14}
    className="
      !text-[#F5F0E6]
      transition-transform
      duration-300
      group-hover:translate-x-1
    "
  />
</a>

            <a
              href={`mailto:${email}`}
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[#102A56]/12
                px-5
                py-3.5
                text-sm
                font-semibold
                text-[#102A56]
                transition
                duration-300
                hover:-translate-y-0.5
                hover:bg-white
              "
            >
              <Mail size={14} />

              {coordinator.email_button_label ||
                fallbackCoordinator.email_button_label}
            </a>

          </div>

          {/* BACK */}
          <div className="mt-12 border-t border-[#102A56]/10 pt-8">

            <Link
              href={
                coordinator.bottom_back_url ||
                fallbackCoordinator.bottom_back_url!
              }
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

              {coordinator.bottom_back_label ||
                fallbackCoordinator.bottom_back_label}
            </Link>

          </div>

        </div>
      </section>
    </main>
  );
}