"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Mail,
  Phone,
  RefreshCw,
} from "lucide-react";
import { supabase } from "@/lib/supabase/browser";


type HeadMistressPage = {
  id?: string;
  slug?: string | null;
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
  is_active?: boolean | null;
};

const officialDefaults: Required<Omit<HeadMistressPage, "id">> = {
  slug: "head-mistress",
  menu_label: "Head Mistress",
  eyebrow: "Head Mistress’s Message",
  title: "A shared vision for excellence",
  person_name: "Mrs. Kiran Chadha",
  person_role: "Headmistress",
  content: `Dear Apexian,

I am delighted to extend warm greetings to our dedicated students, esteemed parents, passionate teachers, and the entire Apex community. As the Headmistress of this esteemed institution, I am proud to present our collective goals for the academic year ahead, focusing on reading and communication, cleanliness and nutrition.

Reading forms the foundation of education and opens up a world of endless possibilities. This year, we aim to foster a love for reading among our students. We will provide diverse literary resources and encourage regular library visits.

Effective communication is an invaluable skill that transcends academic boundaries. Through interactive classroom activities we will empower our students to express themselves with confidence and articulate their thoughts effectively. We believe that proficient communication skills will prepare our students for success in all aspects of life. We are committed to instilling in our students the importance of cleanliness as a habit.

Regular cleanliness drives and educating students about personal hygiene practices will be an integral part of our school year. The saying “You are what you eat” holds immense truth. Nutrition plays a vital role in the physical and cognitive development of our students. We are dedicated to promote healthy eating habits and educating our students about the importance of a balanced diet.

I am confident that together, as a strong and supportive Apex community, we will achieve these goals and provide our students with a well-rounded education. I encourage parents to actively participate in their child’s educational journey, collaborate with our dedicated teachers, and join hands in fostering a positive and enriching environment. Thank you for choosing Apex Public School as your partner in shaping your child’s future.

Let us embark on this academic year with enthusiasm, commitment, and a shared vision for excellence.

Wishing you a successful and fulfilling year ahead!

Answer Duty’s Call

Mrs. Kiran Chadha
(Headmistress)`,
  image_url: "https://apexpublicschool.in/wp-content/uploads/2023/09/WhatsApp-Image-2023-09-06-at-8.30.25-AM-461x1024.jpeg",
  hero_back_label: "About Apex",
  hero_back_url: "/about",
  image_label: "School Leadership",
  profile_label: "Head Mistress's Message",
  message_heading_line_1: "A shared vision",
  message_heading_line_2: "for excellence.",
  focus_section_enabled: true,
  focus_card_1_number: "01",
  focus_card_1_title: "Reading",
  focus_card_1_description: "Fostering a love for reading through diverse literary resources and regular library visits.",
  focus_card_2_number: "02",
  focus_card_2_title: "Communication",
  focus_card_2_description: "Helping students express themselves confidently and articulate their thoughts effectively.",
  focus_card_3_number: "03",
  focus_card_3_title: "Health & Nutrition",
  focus_card_3_description: "Promoting cleanliness, personal hygiene and healthy eating habits for physical and cognitive development.",
  phone_number: "09990061747",
  phone_button_label: "Contact school",
  email_address: "contacts.apexschool@gmail.com",
  email_button_label: "Email school",
  bottom_back_label: "Back to About Apex",
  bottom_back_url: "/about",
  is_active: true,
};

function mergeWithDefaults(data?: Record<string, unknown> | null): HeadMistressPage {
  return {
    ...officialDefaults,
    ...(data ?? {}),
    is_active: data?.is_active === false ? false : true,
    focus_section_enabled: data?.focus_section_enabled === false ? false : true,
  };
}

export default function HeadMistressPublicPage() {
  const [page, setPage] = useState<HeadMistressPage>(mergeWithDefaults());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  async function loadPage() {
    setLoading(true);
    setLoadError("");

    const { data, error } = await supabase
      .from("about_pages")
      .select("*")
      .eq("slug", "head-mistress")
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      console.error("Head Mistress CMS load failed:", error);
      setLoadError(error.message);
      setPage(mergeWithDefaults());
    } else {
      setPage(mergeWithDefaults(data));
    }

    setLoading(false);
  }

  useEffect(() => {
    void loadPage();
  }, []);

  const messageParagraphs = useMemo(() => {
  const message = page.content ?? officialDefaults.content ?? "";

  return String(message)
    .split(/\n\s*\n/)
    .map((x) => x.trim())
    .filter(Boolean);
}, [page.content]);

  if (!page.is_active) return null;

  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F0E6] text-[#10203A]">
      <section className="relative overflow-hidden bg-[#102A56] text-white">
        <div className="pointer-events-none absolute -right-52 -top-52 h-[700px] w-[700px] rounded-full bg-[#8DB9E5]/10 blur-[150px]" />

        <div className="relative mx-auto max-w-[1500px] px-6 pb-24 pt-32 md:px-10 md:pb-32 lg:px-14 lg:pt-36">
          <Link
            href={page.hero_back_url || "/about"}
            className="group inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#F5F0E6]/55 transition hover:text-[#F5F0E6]"
          >
            <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1" />
            {page.hero_back_label || "About Apex"}
          </Link>

          <div className="mt-14 flex items-center gap-3">
            <span className="h-px w-10 bg-[#F5F0E6]/30" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#F5F0E6]/50">
              {page.eyebrow || officialDefaults.eyebrow}
            </p>
          </div>

          <p className="mt-8 text-sm font-medium text-[#F5F0E6]/75 md:text-base">
            {page.person_name || officialDefaults.person_name}
          </p>

          <h1 className="mt-4 max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[-0.06em] md:text-7xl lg:text-[6.2vw]">
            {page.title || officialDefaults.title}
          </h1>

          <div className="mt-10 flex items-center gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.06]">
              <Heart size={18} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-semibold">{page.person_name || officialDefaults.person_name}</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/40">
                {page.person_role || officialDefaults.person_role}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1500px] px-6 py-16 md:px-10 md:py-24 lg:px-14 lg:py-28">
          {loadError && (
            <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
              <span>Showing the published fallback while CMS data is unavailable.</span>
              <button
                type="button"
                onClick={() => void loadPage()}
                className="inline-flex items-center gap-2 font-semibold"
              >
                <RefreshCw size={13} />
                Retry
              </button>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="relative h-[620px] overflow-hidden rounded-[2rem] bg-[#102A56] md:h-[720px] lg:h-[780px]">
              {page.image_url ? (
                <img
                  key={page.image_url}
                  src={page.image_url ?? ""}
                  alt={page.person_name ?? officialDefaults.person_name ?? ""}
                  className="absolute inset-0 block h-full w-full object-cover object-center"
                  style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "none",
                  }}
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <div className="absolute inset-0 bg-[#102A56]" />
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071A38]/95 via-[#071A38]/15 to-transparent" />

              <div className="absolute left-7 top-7 rounded-full border border-white/15 bg-black/10 px-4 py-2 text-[9px] uppercase tracking-[0.24em] text-white/75 backdrop-blur-md">
                {page.image_label || officialDefaults.image_label}
              </div>

              <div className="absolute bottom-8 left-7 right-7 md:bottom-10 md:left-9 md:right-9">
                <p className="text-[9px] uppercase tracking-[0.28em] text-[#F5F0E6]/50">
                  {page.person_role || officialDefaults.person_role}
                </p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em] text-white md:text-4xl">
                  {page.person_name || officialDefaults.person_name}
                </h2>
              </div>
            </div>

            <article className="rounded-[2rem] bg-white p-7 md:p-11 lg:p-14">
              <div className="flex items-center gap-3">
                <span className="h-px w-9 bg-[#102A56]/20" />
                <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#102A56]/35">
                  {page.profile_label || officialDefaults.profile_label}
                </p>
              </div>

              <h2 className="mt-7 max-w-2xl text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#102A56] md:text-5xl">
                {page.message_heading_line_1 || officialDefaults.message_heading_line_1}
                <br />
                {page.message_heading_line_2 || officialDefaults.message_heading_line_2}
              </h2>

              <div className="mt-9 space-y-6 text-sm leading-8 text-[#10203A]/65 md:text-base">
                {messageParagraphs.map((paragraph, index) => {
                  const signature =
                    paragraph.includes("Answer Duty’s Call") ||
                    paragraph.includes("Mrs. Kiran Chadha");

                  return (
                    <p
                      key={`${index}-${paragraph.slice(0, 20)}`}
                      className={signature ? "font-semibold text-[#102A56]" : undefined}
                    >
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </article>
          </div>

          {page.focus_section_enabled !== false && (
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {[
                ["01", "Reading", "Fostering a love for reading through diverse literary resources and regular library visits."],
                ["02", "Communication", "Helping students express themselves confidently and articulate their thoughts effectively."],
                ["03", "Health & Nutrition", "Promoting cleanliness, personal hygiene and healthy eating habits for physical and cognitive development."],
              ].map(([number, title, description], index) => (
                <article
                  key={number}
                  className={`rounded-[2rem] p-8 md:p-9 ${
                    index === 0
                      ? "bg-[#102A56] text-white"
                      : "border border-[#102A56]/10 bg-white"
                  }`}
                >
                  <p className={`text-[9px] uppercase tracking-[0.28em] ${index === 0 ? "text-white/30" : "text-[#102A56]/30"}`}>
                    {page[`focus_card_${index + 1}_number` as keyof HeadMistressPage] ||
                      number}
                  </p>
                  <h3 className={`mt-5 text-2xl font-semibold tracking-[-0.035em] ${index === 0 ? "text-white" : "text-[#102A56]"}`}>
                    {page[`focus_card_${index + 1}_title` as keyof HeadMistressPage] ||
                      title}
                  </h3>
                  <p className={`mt-5 text-sm leading-7 ${index === 0 ? "text-white/55" : "text-[#10203A]/55"}`}>
                    {page[`focus_card_${index + 1}_description` as keyof HeadMistressPage] ||
                      description}
                  </p>
                </article>
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            {page.phone_number && (
              <a
                href={`tel:${page.phone_number.replace(/\s+/g, "")}`}
                className="group inline-flex items-center gap-2 rounded-full bg-[#102A56] px-5 py-3.5 text-sm font-semibold !text-[#F5F0E6] transition hover:-translate-y-0.5 hover:bg-[#1B3D73]"
              >
                <Phone size={14} className="!text-[#F5F0E6]" />
                <span className="!text-[#F5F0E6]">
                  {page.phone_button_label || "Contact school"}
                </span>
                <ArrowRight size={14} className="!text-[#F5F0E6] transition-transform group-hover:translate-x-1" />
              </a>
            )}

            {page.email_address && (
              <a
                href={`mailto:${page.email_address}`}
                className="group inline-flex items-center gap-2 rounded-full border border-[#102A56]/12 px-5 py-3.5 text-sm font-semibold text-[#102A56] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Mail size={14} />
                <span>{page.email_button_label || "Email school"}</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </a>
            )}
          </div>

          <div className="mt-12 border-t border-[#102A56]/10 pt-8">
            <Link
              href={page.bottom_back_url || "/about"}
              className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#102A56]/50 transition hover:text-[#102A56]"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              {page.bottom_back_label || "Back to About Apex"}
            </Link>
          </div>

          {loading && (
            <p className="mt-4 text-[9px] uppercase tracking-[0.2em] text-[#102A56]/25">
              Loading latest published content…
            </p>
          )}
        </div>
      </section>
    </main>
  );
}


