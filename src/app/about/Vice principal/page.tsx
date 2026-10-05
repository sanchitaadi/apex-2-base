import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Mail,
  Phone,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type AcademicHead = {
  id: string;
  slug: string;
  menu_label: string | null;
  title: string | null;
  eyebrow: string | null;
  person_name: string | null;
  person_role: string | null;
  content: string | null;
  image_url: string | null;
  is_active: boolean;

  hero_back_label: string | null;
  hero_back_url: string | null;

  image_label: string | null;
  profile_label: string | null;

  message_heading_line_1: string | null;
  message_heading_line_2: string | null;

  focus_section_enabled: boolean | null;

  focus_card_1_number: string | null;
  focus_card_1_title: string | null;
  focus_card_1_description: string | null;

  focus_card_2_number: string | null;
  focus_card_2_title: string | null;
  focus_card_2_description: string | null;

  phone_number: string | null;
  phone_button_label: string | null;

  email_address: string | null;
  email_button_label: string | null;

  bottom_back_label: string | null;
  bottom_back_url: string | null;
};

const fallbackAcademicHead: AcademicHead = {
  id: "",
  slug: "academic-head",
  menu_label: "Academic Head",
  title: "Academic Head’s Message",
  eyebrow: "Academic Head’s Message",
  person_name: "Mr. Harish Singh Rawat",
  person_role: "Vice Principal Academics",

  image_url: null,

  content: `Dear students, parents, and teachers,

It is a true honour to step into the role of Academic Head, here, a place I have proudly called home for nearly three decades. I remain deeply committed to upholding our long-standing tradition of academic excellence.

My vision is to foster a dynamic and engaging learning environment where every student has the opportunity to excel, building on the strong foundations we have collectively established. Together, let us continue to inspire curiosity, encourage innovation, and prepare our students for a future of success. I look forward to working in close partnership with all of you as we guide our community toward continued growth and achievement.

Answer Duty’s Call

Mr. Harish Singh Rawat

Vice Principal Academics`,

  is_active: true,

  hero_back_label: "About Apex",
  hero_back_url: "/about",

  image_label: "Academic Leadership",
  profile_label: "Academic Head's Message",

  message_heading_line_1: "Academic Head's",
  message_heading_line_2: "Message",

  focus_section_enabled: true,

  focus_card_1_number: "01",
  focus_card_1_title: "Academic Excellence",
  focus_card_1_description:
    "Upholding Apex's long-standing tradition of academic excellence and creating opportunities for every student to excel.",

  focus_card_2_number: "02",
  focus_card_2_title: "Future Ready Learning",
  focus_card_2_description:
    "Inspiring curiosity, encouraging innovation and preparing students for a future of success.",

  phone_number: "09990061747",
  phone_button_label: "Contact school",

  email_address: "contacts.apexschool@gmail.com",
  email_button_label: "Email school",

  bottom_back_label: "Back to About Apex",
  bottom_back_url: "/about",
};

function renderParagraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default async function AcademicHeadPage() {
  let academicHead = fallbackAcademicHead;

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
      is_active,

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

      phone_number,
      phone_button_label,

      email_address,
      email_button_label,

      bottom_back_label,
      bottom_back_url
    `)
    .eq("slug", "academic-head")
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error(
      "Academic Head load error:",
      error
    );
  }

  if (data) {
    const cleanedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value === null ? "" : value,
      ])
    );

    academicHead = {
      ...fallbackAcademicHead,
      ...(cleanedData as Partial<AcademicHead>),
    };
  }

  const paragraphs = renderParagraphs(
    academicHead.content ||
      fallbackAcademicHead.content!
  );

  const personName =
    academicHead.person_name ||
    fallbackAcademicHead.person_name!;

  const personRole =
    academicHead.person_role ||
    fallbackAcademicHead.person_role!;

  const phone =
    academicHead.phone_number ||
    fallbackAcademicHead.phone_number!;

  const email =
    academicHead.email_address ||
    fallbackAcademicHead.email_address!;

  return (
    <main className="min-h-screen bg-[#F5F0E6] text-[#10203A]">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#102A56] text-white">

        <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#8DB9E5]/10 blur-[140px]" />

        <div className="relative mx-auto max-w-[1500px] px-6 pb-24 pt-36 md:px-10 lg:px-14 lg:pt-40">

          <Link
            href={
              academicHead.hero_back_url ||
              fallbackAcademicHead.hero_back_url!
            }
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#F5F0E6]/50 transition hover:text-white"
          >
            <ArrowLeft size={13} />

            {academicHead.hero_back_label ||
              fallbackAcademicHead.hero_back_label}
          </Link>

          <div className="mt-14 flex items-center gap-3">

            <span className="h-px w-10 bg-[#F5F0E6]/30" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#F5F0E6]/50">
              {academicHead.eyebrow ||
                fallbackAcademicHead.eyebrow}
            </p>

          </div>

          <p className="mt-8 text-sm font-medium text-[#F5F0E6]/75 md:text-base">
            {personName}
          </p>

          <h1 className="mt-4 max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[-0.06em] md:text-7xl lg:text-[6vw]">
            {academicHead.title ||
              fallbackAcademicHead.title}
          </h1>

          <div className="mt-10 flex items-center gap-4">

            <div className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/[0.06]">
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

      {/* MAIN CONTENT */}
      <section>
        <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14 lg:py-32">

          <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">

            {/* IMAGE */}
            <div className="relative min-h-[620px] overflow-hidden rounded-[2rem] bg-[#102A56]">

              {academicHead.image_url ? (
                <img
                  src={academicHead.image_url}
                  alt={personName}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#315D93] via-[#193B69] to-[#071A38] px-8 text-center">

                  <div>

                    <p className="text-[9px] uppercase tracking-[0.25em] text-white/35">
                      {academicHead.image_label ||
                        fallbackAcademicHead.image_label}
                    </p>

                    <p className="mt-4 text-2xl font-semibold text-white">
                      {personName}
                    </p>

                  </div>

                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#071A38]/90 via-transparent to-transparent" />

              <div className="absolute left-7 top-7 rounded-full border border-white/15 bg-black/10 px-4 py-2 text-[9px] uppercase tracking-[0.24em] text-white/75 backdrop-blur-md">
                {academicHead.image_label ||
                  fallbackAcademicHead.image_label}
              </div>

              <div className="absolute bottom-8 left-7 right-7 md:left-9 md:right-9">

                <p className="text-[9px] uppercase tracking-[0.28em] text-[#F5F0E6]/50">
                  {personRole}
                </p>

                <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em] text-white md:text-4xl">
                  {personName}
                </h2>

              </div>
            </div>

            {/* MESSAGE */}
            <article className="rounded-[2rem] bg-white p-8 md:p-12 lg:p-14">

              <div className="flex items-center gap-3">

                <span className="h-px w-9 bg-[#102A56]/20" />

                <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#102A56]/35">
                  {academicHead.profile_label ||
                    fallbackAcademicHead.profile_label}
                </p>

              </div>

              <h2 className="mt-7 max-w-2xl text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#102A56] md:text-5xl">

                {academicHead.message_heading_line_1 ||
                  fallbackAcademicHead.message_heading_line_1}

                <br />

                {academicHead.message_heading_line_2 ||
                  fallbackAcademicHead.message_heading_line_2}

              </h2>

              <div className="mt-9 space-y-6 text-sm leading-8 text-[#10203A]/70 md:text-base">

                {paragraphs.map(
                  (paragraph, index) => {
                    const isGreeting =
                      paragraph ===
                      "Dear students, parents, and teachers,";

                    const isClosing =
                      paragraph ===
                      "Answer Duty’s Call";

                    const isName =
                      paragraph ===
                      personName;

                    const isRole =
                      paragraph ===
                      personRole;

                    return (
                      <p
                        key={`${index}-${paragraph.slice(0, 20)}`}
                        className={
                          isGreeting ||
                          isClosing ||
                          isName ||
                          isRole
                            ? "font-semibold text-[#102A56]"
                            : ""
                        }
                      >
                        {paragraph}
                      </p>
                    );
                  }
                )}

              </div>
            </article>

          </div>

          {/* ACADEMIC FOCUS */}
          {academicHead.focus_section_enabled !== false && (
            <div className="mt-6 grid gap-6 md:grid-cols-2">

              <article className="rounded-[2rem] bg-[#102A56] p-8 text-white md:p-10">

                <p className="text-[9px] uppercase tracking-[0.28em] text-white/30">
                  {academicHead.focus_card_1_number ||
                    fallbackAcademicHead.focus_card_1_number}
                </p>

                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.035em] md:text-3xl">
                  {academicHead.focus_card_1_title ||
                    fallbackAcademicHead.focus_card_1_title}
                </h3>

                <p className="mt-5 text-sm leading-7 text-white/55">
                  {academicHead.focus_card_1_description ||
                    fallbackAcademicHead.focus_card_1_description}
                </p>

              </article>

              <article className="rounded-[2rem] border border-[#102A56]/10 bg-white p-8 md:p-10">

                <p className="text-[9px] uppercase tracking-[0.28em] text-[#102A56]/30">
                  {academicHead.focus_card_2_number ||
                    fallbackAcademicHead.focus_card_2_number}
                </p>

                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.035em] text-[#102A56] md:text-3xl">
                  {academicHead.focus_card_2_title ||
                    fallbackAcademicHead.focus_card_2_title}
                </h3>

                <p className="mt-5 text-sm leading-7 text-[#10203A]/55">
                  {academicHead.focus_card_2_description ||
                    fallbackAcademicHead.focus_card_2_description}
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
    hover:-translate-y-0.5
    hover:bg-[#0d2962]
  "
>
  <Phone
    size={14}
    className="!text-[#F5F0E6]"
  />

  <span className="!text-[#F5F0E6]">
    {academicHead.phone_button_label ||
      fallbackAcademicHead.phone_button_label}
  </span>

  <ArrowRight
    size={14}
    className="
      !text-[#F5F0E6]
      transition-transform
      group-hover:translate-x-1
    "
  />
</a>

            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 rounded-full border border-[#102A56]/12 px-5 py-3.5 text-sm font-semibold text-[#102A56] transition hover:-translate-y-0.5 hover:bg-white"
            >
              <Mail size={14} />

              {academicHead.email_button_label ||
                fallbackAcademicHead.email_button_label}
            </a>

          </div>

          {/* BACK */}
          <div className="mt-12 border-t border-[#102A56]/10 pt-8">

            <Link
              href={
                academicHead.bottom_back_url ||
                fallbackAcademicHead.bottom_back_url!
              }
              className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#102A56]/50 transition hover:text-[#102A56]"
            >
              <ArrowLeft
                size={14}
                className="transition-transform group-hover:-translate-x-1"
              />

              {academicHead.bottom_back_label ||
                fallbackAcademicHead.bottom_back_label}
            </Link>

          </div>

        </div>
      </section>
    </main>
  );
}