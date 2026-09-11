import Link from "next/link";
import { ArrowRight, Eye, Heart } from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type MissionVision = {
  title: string | null;
  eyebrow: string | null;
  mission: string | null;
  vision: string | null;
  content: string | null;

  intro_description: string | null;
  intro_section_label: string | null;
  intro_heading_line_1: string | null;
  intro_heading_line_2: string | null;

  mission_number: string | null;
  mission_label: string | null;
  mission_icon_name: string | null;

  vision_number: string | null;
  vision_label: string | null;
  vision_icon_name: string | null;

  commitment_label: string | null;

  back_link_label: string | null;
  back_link_url: string | null;

  footer_label: string | null;
  footer_title: string | null;
  footer_button_label: string | null;
  footer_button_url: string | null;

  is_active: boolean | null;
};

const fallbackMission =
  "In the next three years we strive towards the holistic development of our students in a friendly learning environment while providing them with opportunities to equip them with life skills to be role models for the generations to follow";

const fallbackVision =
  "Our Vision is to develop our students into human beings who are not only educated through books but in values that make them leaders of the future World";

const fallbackContent =
  "Apex Public School strives towards the holistic development of its students in a friendly learning environment while providing opportunities to equip them with life skills and values for the generations to follow.";

const defaults: MissionVision = {
  title: "Our Mission & Vision",
  eyebrow: "ABOUT APEX",
  mission: fallbackMission,
  vision: fallbackVision,
  content: fallbackContent,

  intro_description:
    "Education at Apex is shaped by learning, character, values and responsibility.",
  intro_section_label: "Our direction",
  intro_heading_line_1: "Education with purpose,",
  intro_heading_line_2: "values and responsibility.",

  mission_number: "01",
  mission_label: "Our Mission",
  mission_icon_name: "Heart",

  vision_number: "02",
  vision_label: "Our Vision",
  vision_icon_name: "Eye",

  commitment_label: "Our commitment",

  back_link_label: "Back to About",
  back_link_url: "/about",

  footer_label: "Apex Public School",
  footer_title: "Answer Duty's Call",
  footer_button_label: "About Apex",
  footer_button_url: "/about",

  is_active: true,
};

export default async function MissionVisionPage() {
  let page: MissionVision = defaults;

  const { data, error } = await supabase
    .from("about_pages")
    .select(`
      title,
      eyebrow,
      mission,
      vision,
      content,
      intro_description,
      intro_section_label,
      intro_heading_line_1,
      intro_heading_line_2,
      mission_number,
      mission_label,
      mission_icon_name,
      vision_number,
      vision_label,
      vision_icon_name,
      commitment_label,
      back_link_label,
      back_link_url,
      footer_label,
      footer_title,
      footer_button_label,
      footer_button_url,
      is_active
    `)
    .eq("slug", "mission-vision")
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Mission & Vision load error:", error);
  }

  if (data) {
    const safeData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value === null ? "" : value,
      ])
    );

    page = {
      ...defaults,
      ...(safeData as Partial<MissionVision>),
    };
  }

  const title = page.title || defaults.title;
  const eyebrow = page.eyebrow || defaults.eyebrow;
  const mission = page.mission || defaults.mission;
  const vision = page.vision || defaults.vision;
  const content = page.content || defaults.content;

  const introDescription =
    page.intro_description || defaults.intro_description;

  const introSectionLabel =
    page.intro_section_label || defaults.intro_section_label;

  const introHeadingLine1 =
    page.intro_heading_line_1 || defaults.intro_heading_line_1;

  const introHeadingLine2 =
    page.intro_heading_line_2 || defaults.intro_heading_line_2;

  const missionNumber =
    page.mission_number || defaults.mission_number;

  const missionLabel =
    page.mission_label || defaults.mission_label;

  const visionNumber =
    page.vision_number || defaults.vision_number;

  const visionLabel =
    page.vision_label || defaults.vision_label;

  const commitmentLabel =
    page.commitment_label || defaults.commitment_label;

  const backLinkLabel =
    page.back_link_label || defaults.back_link_label;

  const backLinkUrl =
    page.back_link_url || defaults.back_link_url;

  const footerLabel =
    page.footer_label || defaults.footer_label;

  const footerTitle =
    page.footer_title || defaults.footer_title;

  const footerButtonLabel =
    page.footer_button_label || defaults.footer_button_label;

  const footerButtonUrl =
    page.footer_button_url || defaults.footer_button_url;

  return (
    <main className="min-h-screen bg-[#F5F0E6] text-[#10203A]">

      {/* HERO */}
      <section className="bg-[#102A56] pt-32 md:pt-36 lg:pt-40">
        <div
          className="
            mx-auto
            max-w-[1500px]
            px-6
            pb-20
            pt-10
            md:px-10
            md:pb-28
            lg:px-14
            lg:pb-32
          "
        >
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.3em]
              !text-[#DCE7F5]/55
            "
          >
            {eyebrow}
          </p>

          <h1
            className="
              mt-7
              max-w-5xl
              text-5xl
              font-semibold
              leading-[0.9]
              tracking-[-0.065em]
              !text-[#F5F0E6]
              md:text-7xl
              lg:text-[6vw]
            "
          >
            {title}
          </h1>

          <p
            className="
              mt-7
              max-w-2xl
              text-base
              leading-8
              !text-[#F5F0E6]/60
              md:text-lg
            "
          >
            {introDescription}
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section>
        <div
          className="
            mx-auto
            max-w-[1500px]
            px-6
            py-16
            md:px-10
            md:py-24
            lg:px-14
            lg:py-28
          "
        >

          {/* INTRO */}
          <div className="mb-12 max-w-4xl">
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.28em]
                !text-[#102A56]/40
              "
            >
              {introSectionLabel}
            </p>

            <h2
              className="
                mt-4
                text-3xl
                font-semibold
                leading-tight
                tracking-[-0.045em]
                !text-[#102A56]
                md:text-5xl
              "
            >
              {introHeadingLine1}
              <br />
              {introHeadingLine2}
            </h2>
          </div>

          {/* MISSION + VISION */}
          <div className="grid gap-5 lg:grid-cols-2">

            {/* MISSION */}
            <article
              className="
                rounded-[2rem]
                bg-[#FFFDF8]
                p-7
                shadow-[0_15px_45px_rgba(16,42,86,0.06)]
                md:p-10
              "
            >
              <div className="flex items-start justify-between">
                <span
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.25em]
                    !text-[#102A56]/35
                  "
                >
                  {missionNumber}
                </span>

                <div
                  className="
                    grid
                    h-12
                    w-12
                    place-items-center
                    rounded-full
                    bg-[#102A56]
                    !text-[#F5F0E6]
                  "
                >
                  <Heart size={19} strokeWidth={1.7} />
                </div>
              </div>

              <h2
                className="
                  mt-16
                  text-4xl
                  font-semibold
                  tracking-[-0.05em]
                  !text-[#102A56]
                  md:text-5xl
                "
              >
                {missionLabel}
              </h2>

              <div className="mt-7 h-px bg-[#102A56]/10" />

              <p
                className="
                  mt-7
                  whitespace-pre-line
                  text-lg
                  font-medium
                  leading-8
                  !text-[#102A56]/80
                  md:text-xl
                  md:leading-9
                "
              >
                {mission}
              </p>
            </article>

            {/* VISION */}
            <article
              className="
                rounded-[2rem]
                bg-[#102A56]
                p-7
                !text-white
                shadow-[0_15px_45px_rgba(16,42,86,0.10)]
                md:p-10
              "
            >
              <div className="flex items-start justify-between">
                <span
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.25em]
                    !text-white/30
                  "
                >
                  {visionNumber}
                </span>

                <div
                  className="
                    grid
                    h-12
                    w-12
                    place-items-center
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.06]
                    !text-[#F5F0E6]
                  "
                >
                  <Eye size={19} strokeWidth={1.7} />
                </div>
              </div>

              <h2
                className="
                  mt-16
                  text-4xl
                  font-semibold
                  tracking-[-0.05em]
                  !text-[#F5F0E6]
                  md:text-5xl
                "
              >
                {visionLabel}
              </h2>

              <div className="mt-7 h-px bg-white/10" />

              <p
                className="
                  mt-7
                  whitespace-pre-line
                  text-lg
                  font-medium
                  leading-8
                  !text-white/75
                  md:text-xl
                  md:leading-9
                "
              >
                {vision}
              </p>
            </article>
          </div>

          {/* SUPPORTING CONTENT */}
          <div
            className="
              mt-5
              rounded-[2rem]
              border
              border-[#102A56]/10
              bg-[#E9E2D5]
              p-7
              md:p-10
            "
          >
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.25em]
                !text-[#102A56]/35
              "
            >
              {commitmentLabel}
            </p>

            <p
              className="
                mt-5
                max-w-4xl
                whitespace-pre-line
                text-base
                leading-8
                !text-[#10203A]/65
                md:text-lg
              "
            >
              {content}
            </p>
          </div>

          {/* BACK */}
          <div className="mt-10">
            <Link
               href={backLinkUrl ?? '/about'}
              className="
                group
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-[#102A56]/15
                bg-[#FFFDF8]
                px-6
                py-3.5
                text-sm
                font-semibold
                !text-[#102A56]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-white
              "
            >
              <span
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  bg-[#102A56]
                  !text-[#F5F0E6]
                "
              >
                <ArrowRight
                  size={13}
                  className="
                    rotate-180
                    !text-[#F5F0E6]
                  "
                />
              </span>

              <span className="!text-[#102A56]">
                {backLinkLabel}
              </span>
            </Link>
          </div>

        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="bg-[#102A56]">
        <div
          className="
            mx-auto
            max-w-[1500px]
            px-6
            py-16
            md:px-10
            md:py-20
            lg:px-14
          "
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <p
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.25em]
                  !text-[#DCE7F5]/40
                "
              >
                {footerLabel}
              </p>

              <h3
                className="
                  mt-3
                  text-2xl
                  font-semibold
                  !text-[#F5F0E6]
                "
              >
                {footerTitle}
              </h3>
            </div>

            <Link
               href={footerButtonUrl ?? '/'}
               className="
                group
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-white/15
                px-6
                py-3.5
                text-sm
                font-semibold
                !text-[#F5F0E6]
                transition
                hover:bg-white/10
              "
            >
              <span className="!text-[#F5F0E6]">
                {footerButtonLabel}
              </span>

              <ArrowRight
                size={15}
                className="
                  !text-[#F5F0E6]
                  transition-transform
                  group-hover:translate-x-1
                "
              />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
