import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Mail,
  Phone,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type ManagerPage = {
  id?: string;
  slug?: string;
  menu_label?: string | null;
  title?: string | null;
  eyebrow?: string | null;
  person_name?: string | null;
  person_role?: string | null;
  content?: string | null;
  image_url?: string | null;
  mission?: string | null;
  vision?: string | null;

  hero_back_label?: string | null;
  hero_back_url?: string | null;
  image_label?: string | null;
  profile_label?: string | null;

  leadership_label?: string | null;
  leadership_heading?: string | null;
  leadership_text_1?: string | null;
  leadership_text_2?: string | null;

  phone_number?: string | null;
  phone_button_label?: string | null;
  email_address?: string | null;
  email_button_label?: string | null;

  bottom_back_label?: string | null;
  bottom_back_url?: string | null;
};

const fallbackManager: ManagerPage = {
  slug: "manager-vp-admin",
  menu_label: "Manager / VP Admin",
  eyebrow: "School Administration",
  title: "Manager / VP – Admin",
  person_name: "Mr. Arvind Kumar Tejyan",
  person_role: "Manager / VP – Admin",
  content:
    "Mr. Arvind Kumar Tejyan serves as Manager / Vice Principal – Administration at Apex Public School. The school’s official School Management Committee records state that he was appointed Manager of Apex Public School with effect from 18 August 2025, as an additional charge while serving as Vice Principal (Administration).",
  image_url: null,

  hero_back_label: "About Apex",
  hero_back_url: "/about",
  image_label: "School Administration",
  profile_label: "Manager's Profile",

  leadership_label: "Leadership",
  leadership_heading: "Administration at Apex",
  leadership_text_1:
    "The official Apex Public School School Management Committee records state that Mr. Arvind Kumar Tejyan was appointed Manager of Apex Public School with effect from 18 August 2025, as an additional charge while serving as Vice Principal (Administration).",
  leadership_text_2:
    "The school's official faculty listing also identifies him as Manager and VP – Admin.",

  phone_number: "09990061747",
  phone_button_label: "Contact school",
  email_address: "contacts.apexschool@gmail.com",
  email_button_label: "Email school",

  bottom_back_label: "Back to About Apex",
  bottom_back_url: "/about",
};

function Paragraphs({ text }: { text: string }) {
  return (
    <div className="space-y-6 text-sm leading-8 text-[#10203A]/65 md:text-base">
      {text.split(/\n\s*\n/).map((paragraph, index) => {
        const value = paragraph.trim();

        if (!value) return null;

        return <p key={index}>{value}</p>;
      })}
    </div>
  );
}

export default async function ManagerVPAdminPage() {
  let manager = fallbackManager;

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
        mission,
        vision,
        hero_back_label,
        hero_back_url,
        image_label,
        profile_label,
        leadership_label,
        leadership_heading,
        leadership_text_1,
        leadership_text_2,
        phone_number,
        phone_button_label,
        email_address,
        email_button_label,
        bottom_back_label,
        bottom_back_url
      `)
      .eq("slug", "manager-vp-admin")
      .eq("is_active", true)
      .maybeSingle();

    if (!error && data) {
      const cleaned = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value === null ? "" : value,
        ])
      );

      manager = {
        ...fallbackManager,
        ...(cleaned as Partial<ManagerPage>),
      };
    }
  } catch (error) {
    console.error(
      "Manager / VP Admin page load failed:",
      error
    );
  }

  const personName =
    manager.person_name || fallbackManager.person_name!;

  const personRole =
    manager.person_role || fallbackManager.person_role!;

  const title =
    manager.title || fallbackManager.title!;

  const content =
    manager.content || fallbackManager.content!;

  const phone =
    manager.phone_number || fallbackManager.phone_number!;

  const email =
    manager.email_address || fallbackManager.email_address!;

  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F0E6] text-[#10203A]">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#102A56] text-white">

        <div className="pointer-events-none absolute -right-48 -top-48 h-[650px] w-[650px] rounded-full bg-[#8DB9E5]/10 blur-[140px]" />

        <div className="pointer-events-none absolute -left-48 bottom-[-280px] h-[620px] w-[620px] rounded-full bg-[#F5F0E6]/[0.05] blur-[140px]" />

        <div className="relative mx-auto max-w-[1500px] px-6 pb-24 pt-36 md:px-10 md:pb-32 lg:px-14 lg:pt-40">

          <Link
            href={
              manager.hero_back_url ||
              fallbackManager.hero_back_url!
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
              hover:text-white
            "
          >
            <ArrowLeft size={13} />

            {manager.hero_back_label ||
              fallbackManager.hero_back_label}
          </Link>

          <div className="mt-14 flex items-center gap-3">
            <span className="h-px w-10 bg-[#F5F0E6]/30" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#F5F0E6]/50">
              {manager.eyebrow ||
                fallbackManager.eyebrow}
            </p>
          </div>

          <p className="mt-8 text-sm font-medium text-[#F5F0E6]/75 md:text-base">
            {personName}
          </p>

          <h1 className="mt-4 max-w-5xl text-5xl font-semibold leading-[0.9] tracking-[-0.06em] md:text-7xl lg:text-[6.2vw]">
            {title}
          </h1>

          <div className="mt-10 flex items-center gap-4">

            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.06]">
              <BriefcaseBusiness
                size={19}
                strokeWidth={1.5}
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
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

          <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">

            {/* IMAGE */}
            <div className="relative min-h-[580px] overflow-hidden rounded-[2rem] bg-[#102A56]">

              {manager.image_url ? (
                <img
                  src={manager.image_url}
                  alt={personName}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#315D93] via-[#193B69] to-[#071A38]" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#071A38]/90 via-transparent to-transparent" />

              <div className="absolute left-7 top-7 rounded-full border border-white/15 bg-black/10 px-4 py-2 text-[9px] uppercase tracking-[0.24em] text-white/75 backdrop-blur-md">
                {manager.image_label ||
                  fallbackManager.image_label}
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

            {/* PROFILE */}
            <article className="rounded-[2rem] bg-white p-8 md:p-12 lg:p-14">

              <div className="flex items-center gap-3">
                <span className="h-px w-9 bg-[#102A56]/20" />

                <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#102A56]/35">
                  {manager.profile_label ||
                    fallbackManager.profile_label}
                </p>
              </div>

              <h2 className="mt-7 max-w-2xl text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#102A56] md:text-5xl">
                {title}
              </h2>

              <div className="mt-9">
                <Paragraphs text={content} />
              </div>

            </article>
          </div>

          {/* LEADERSHIP */}
          <div className="mt-6 rounded-[2rem] bg-[#102A56] p-8 text-white md:p-12 lg:p-14">

            <div className="grid gap-10 lg:grid-cols-[0.55fr_1.45fr]">

              <div>
                <p className="text-[9px] uppercase tracking-[0.28em] text-white/30">
                  {manager.leadership_label ||
                    fallbackManager.leadership_label}
                </p>

                <h2 className="mt-5 text-3xl font-semibold leading-[0.98] tracking-[-0.045em] md:text-4xl">
                  {manager.leadership_heading ||
                    fallbackManager.leadership_heading}
                </h2>
              </div>

              <div className="max-w-3xl">

                <p className="text-sm leading-8 text-white/65 md:text-base">
                  {manager.leadership_text_1 ||
                    fallbackManager.leadership_text_1}
                </p>

                <p className="mt-6 text-sm leading-8 text-white/65 md:text-base">
                  {manager.leadership_text_2 ||
                    fallbackManager.leadership_text_2}
                </p>

              </div>

            </div>
          </div>

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
    shadow-sm
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
    {manager.phone_button_label ||
      fallbackManager.phone_button_label}
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
                hover:-translate-y-0.5
                hover:bg-white
              "
            >
              <Mail size={14} />

              {manager.email_button_label ||
                fallbackManager.email_button_label}
            </a>

          </div>

          {/* BACK */}
          <div className="mt-12 border-t border-[#102A56]/10 pt-8">

            <Link
              href={
                manager.bottom_back_url ||
                fallbackManager.bottom_back_url!
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

              {manager.bottom_back_label ||
                fallbackManager.bottom_back_label}
            </Link>

          </div>

        </div>
      </section>
    </main>
  );
}