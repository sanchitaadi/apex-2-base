import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Mail,
  Phone,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type CEOPage = {
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
  message_heading?: string | null;

  preparing_enabled?: boolean | null;
  preparing_number?: string | null;
  preparing_heading?: string | null;

  brilliance_enabled?: boolean | null;
  brilliance_number?: string | null;
  brilliance_heading?: string | null;

  phone_number?: string | null;
  phone_button_label?: string | null;

  email_address?: string | null;
  email_button_label?: string | null;

  bottom_back_label?: string | null;
  bottom_back_url?: string | null;
};

const fallbackCEO: CEOPage = {
  slug: "ceo",
  menu_label: "CEO",

  eyebrow:
    "FROM THE Chief Executive Officer’s DESK",

  title: "Forging Ahead Together",

  person_name:
    "Mr. Geoff Lyonel Jonathan",

  person_role:
    "Chief Executive Officer",

  content: `With immense pride and great pleasure, I welcome you to the school’s website. You could be a parent, a student, a staff member, alumni or anyone interested in gaining deeper insight into the functioning and learning environs of our exciting world. I invite you to navigate through our ‘Online School’ to help you understand lucidly why our school provides the best environment for your little ones and young adults.

Since its inception to now, our institution has marched forward to spread the light of education and pave the way for all-round excellence for every student. The key focus areas continue to remain creating opportunities, challenging minds, encouraging innovation and sustaining excitement.

Preparing our students for the future

The stringent standards followed by our school since commencement have guided us and helped us offer a contemporary, relevant, & self-motivated learning. Our children are equipped to unrelentingly identify and respond to the volatile demands across the education and employment sector. Accolades have been received through our Alumni and our children continue to do so.

We base our success on the principal of ‘3H’ (Head, Hand and Heart) as this is the way forward and prepare our children for jobs that do not even exist now and will be there in the future. Teaching them to give back to society is of utmost importance. Alumni are placed in some of the best names in the global market place. Do take out time to browse through the list of our famous alumni and faculty members.

Creating Brilliance

It is the objective here at Apex to continue being recognized as the torch bearer of leading educational methods and an institution that has students defining a future not only for them but for our country and the world as well. We have and will continually strive for brighter and more secure prospects for our children. The values and environment we provide for our children are sustainable and see them successfully through their formative years.

The investment we put into our children today will help them achieve greater heights and create the unimaginable.

I take this opportunity to thank sincerely the principal, teachers and other staff without whom these successes – both big and small would not be possible. They teach not only subjects but also inculcate values of commitment, zealousness and pride in everything they do.

Welcome once again and I sincerely hope that our website will raise your interest and encourage you into taking one more step towards making a positive difference in your life.`,

  image_url: null,

  hero_back_label: "About Apex",
  hero_back_url: "/about",

  image_label: "Apex Leadership",
  profile_label:
    "From the Chief Executive Officer's Desk",

  message_heading: "Forging Ahead Together",

  preparing_enabled: true,
  preparing_number: "02",
  preparing_heading:
    "Preparing our students for the future",

  brilliance_enabled: true,
  brilliance_number: "03",
  brilliance_heading: "Creating Brilliance",

  phone_number: "09990061747",
  phone_button_label: "Contact school",

  email_address: "contacts.apexschool@gmail.com",
  email_button_label: "Email school",

  bottom_back_label: "Back to About Apex",
  bottom_back_url: "/about",
};

function splitCEOContent(content: string) {
  const preparingHeading =
    "Preparing our students for the future";

  const brillianceHeading =
    "Creating Brilliance";

  const preparingIndex =
    content.indexOf(preparingHeading);

  const brillianceIndex =
    content.indexOf(brillianceHeading);

  const openingText =
    preparingIndex !== -1
      ? content.slice(0, preparingIndex).trim()
      : content.trim();

  const preparingText =
    preparingIndex !== -1
      ? content
          .slice(
            preparingIndex + preparingHeading.length,
            brillianceIndex !== -1
              ? brillianceIndex
              : content.length
          )
          .trim()
      : "";

  const brillianceText =
    brillianceIndex !== -1
      ? content
          .slice(
            brillianceIndex + brillianceHeading.length
          )
          .trim()
      : "";

  return {
    openingText,
    preparingText,
    brillianceText,
  };
}

function Paragraphs({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <div className={`space-y-6 ${className}`}>
      {text
        .split(/\n\s*\n/)
        .map((paragraph, index) => {
          const value = paragraph.trim();

          if (!value) return null;

          return (
            <p key={index}>
              {value}
            </p>
          );
        })}
    </div>
  );
}

export default async function CEOPage() {
  let ceo = fallbackCEO;

  try {
    const { data, error } =
      await supabase
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
          message_heading,

          preparing_enabled,
          preparing_number,
          preparing_heading,

          brilliance_enabled,
          brilliance_number,
          brilliance_heading,

          phone_number,
          phone_button_label,

          email_address,
          email_button_label,

          bottom_back_label,
          bottom_back_url
        `)
        .eq("slug", "ceo")
        .eq("is_active", true)
        .maybeSingle();

    if (!error && data) {
      const cleanedData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value === null ? "" : value,
        ])
      );

      ceo = {
        ...fallbackCEO,
        ...(cleanedData as Partial<CEOPage>),
      };
    }
  } catch (error) {
    console.error(
      "CEO page load failed:",
      error
    );
  }

  const content =
    ceo.content ||
    fallbackCEO.content ||
    "";

  const {
    openingText,
    preparingText,
    brillianceText,
  } = splitCEOContent(content);

  const personName =
    ceo.person_name ||
    fallbackCEO.person_name!;

  const personRole =
    ceo.person_role ||
    fallbackCEO.person_role!;

  const phone =
    ceo.phone_number ||
    fallbackCEO.phone_number!;

  const email =
    ceo.email_address ||
    fallbackCEO.email_address!;

  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F0E6] text-[#10203A]">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#102A56] text-white">

        <div className="pointer-events-none absolute -right-48 -top-48 h-[650px] w-[650px] rounded-full bg-[#8DB9E5]/10 blur-[140px]" />

        <div className="relative mx-auto max-w-[1500px] px-6 pb-24 pt-36 md:px-10 md:pb-32 lg:px-14 lg:pt-40">

          <Link
            href={
              ceo.hero_back_url ||
              fallbackCEO.hero_back_url!
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

            {ceo.hero_back_label ||
              fallbackCEO.hero_back_label}
          </Link>

          <div className="mt-14 flex items-center gap-3">

            <span className="h-px w-10 bg-[#F5F0E6]/30" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#F5F0E6]/50">
              {ceo.eyebrow ||
                fallbackCEO.eyebrow}
            </p>

          </div>

          <p className="mt-8 text-sm font-medium text-[#F5F0E6]/75 md:text-base">
            {personName}
          </p>

          <h1 className="mt-4 max-w-5xl text-5xl font-semibold leading-[0.9] tracking-[-0.06em] md:text-7xl lg:text-[6.4vw]">
            {ceo.title ||
              fallbackCEO.title}
          </h1>

          <div className="mt-10 flex items-center gap-4">

            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.06]">
              <BriefcaseBusiness
                size={18}
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

      {/* CEO MESSAGE */}
      <section className="relative">

        <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14 lg:py-32">

          {/* IMAGE + MESSAGE */}
          <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">

            {/* CEO IMAGE */}
            <div className="relative min-h-[600px] overflow-hidden rounded-[2rem] bg-[#102A56]">

              {ceo.image_url ? (
                <img
                  src={ceo.image_url}
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
                <div className="absolute inset-0 bg-gradient-to-br from-[#315C92] via-[#193B69] to-[#071A38]" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#071A38]/90 via-[#071A38]/10 to-transparent" />

              <div className="absolute left-7 top-7 rounded-full border border-white/15 bg-black/10 px-4 py-2 text-[9px] uppercase tracking-[0.24em] text-white/75 backdrop-blur-md">
                {ceo.image_label ||
                  fallbackCEO.image_label}
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

            {/* MESSAGE */}
            <article className="rounded-[2rem] bg-white p-8 md:p-12 lg:p-14">

              <div className="flex items-center gap-3">

                <span className="h-px w-9 bg-[#102A56]/20" />

                <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#102A56]/35">
                  {ceo.profile_label ||
                    fallbackCEO.profile_label}
                </p>

              </div>

              <h2 className="mt-7 text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#102A56] md:text-5xl">
                {ceo.message_heading ||
                  fallbackCEO.message_heading}
              </h2>

              <Paragraphs
                text={openingText}
                className="mt-9 text-sm leading-8 text-[#10203A]/65 md:text-base"
              />

            </article>

          </div>

          {/* PREPARING */}
          {ceo.preparing_enabled !== false &&
            preparingText && (
              <article className="mt-6 overflow-hidden rounded-[2rem] bg-[#102A56] text-white">

                <div className="grid gap-10 p-8 md:p-12 lg:grid-cols-[0.55fr_1.45fr] lg:p-14">

                  <div>

                    <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/30">
                      {ceo.preparing_number ||
                        fallbackCEO.preparing_number}
                    </p>

                    <h2 className="mt-5 max-w-md text-3xl font-semibold leading-[0.98] tracking-[-0.045em] md:text-4xl">
                      {ceo.preparing_heading ||
                        fallbackCEO.preparing_heading}
                    </h2>

                  </div>

                  <Paragraphs
                    text={preparingText}
                    className="max-w-3xl text-sm leading-8 text-white/65 md:text-base"
                  />

                </div>
              </article>
            )}

          {/* CREATING BRILLIANCE */}
          {ceo.brilliance_enabled !== false &&
            brillianceText && (
              <article className="mt-6 overflow-hidden rounded-[2rem] border border-[#102A56]/10 bg-white">

                <div className="grid gap-10 p-8 md:p-12 lg:grid-cols-[0.55fr_1.45fr] lg:p-14">

                  <div>

                    <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#102A56]/30">
                      {ceo.brilliance_number ||
                        fallbackCEO.brilliance_number}
                    </p>

                    <h2 className="mt-5 max-w-md text-3xl font-semibold leading-[0.98] tracking-[-0.045em] text-[#102A56] md:text-4xl">
                      {ceo.brilliance_heading ||
                        fallbackCEO.brilliance_heading}
                    </h2>

                  </div>

                  <Paragraphs
                    text={brillianceText}
                    className="max-w-3xl text-sm leading-8 text-[#10203A]/65 md:text-base"
                  />

                </div>
              </article>
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
    {ceo.phone_button_label ||
      fallbackCEO.phone_button_label}
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

              {ceo.email_button_label ||
                fallbackCEO.email_button_label}
            </a>

          </div>

          {/* BACK */}
          <div className="mt-12 border-t border-[#102A56]/10 pt-8">

            <Link
              href={
                ceo.bottom_back_url ||
                fallbackCEO.bottom_back_url!
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
                hover:text-[#2d4f95]
              "
            >
              <ArrowLeft
                size={14}
                className="transition-transform group-hover:-translate-x-1"
              />

              {ceo.bottom_back_label ||
                fallbackCEO.bottom_back_label}
            </Link>

          </div>

        </div>
      </section>
    </main>
  );
}