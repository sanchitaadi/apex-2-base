import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Mail,
  Phone,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type PrincipalPage = {
  id?: string;
  slug?: string;
  menu_label?: string | null;
  title?: string | null;
  eyebrow?: string | null;
  person_name?: string | null;
  person_role?: string | null;
  content?: string | null;
  image_url?: string | null;

  back_link_label?: string | null;
  back_link_url?: string | null;

  message_label?: string | null;
  image_label?: string | null;

  philosophy_section_enabled?: boolean | null;

  philosophy_card_1_number?: string | null;
  philosophy_card_1_title?: string | null;
  philosophy_card_1_text?: string | null;

  philosophy_card_2_number?: string | null;
  philosophy_card_2_title?: string | null;
  philosophy_card_2_text?: string | null;

  contact_section_enabled?: boolean | null;

  contact_phone?: string | null;
  contact_phone_label?: string | null;

  contact_email?: string | null;
  contact_email_label?: string | null;

  bottom_back_label?: string | null;
  bottom_back_url?: string | null;
};

const fallbackPrincipal: PrincipalPage = {
  slug: "principal",

  menu_label: "Principal",

  eyebrow: "Principal’s Message",

  title: "Leading with purpose",

  person_name: "Mrs. Dorothy Jonathan",

  person_role: "Principal",

  content: `“Education is not the learning of facts but the training of the mind to think”
- Albert Einstein

Apex Public School greets all of you, the parents, the students and the readers.

Today my heart swells with gratitude for the great man Mr. A.M. Jonathan whose vision and mission brought this school into existence. As you navigate your way through the site discovering what we have to offer, you will find answers to many preliminary questions you may have about our school, our academic programme and student life.

The role of a school is not only to pursue academic excellence but also to motivate and empower its students to be lifelong learners,critical thinkers and productive members of an everchanging global society. We provide an atmosphere to our students for multifaceted development, where children are encouraged to channelize their potential in the pursuit of excellence. This can only be possible in a holistic, student centric environment.

Our staff fruitfully employ two diverse strategies that are of love and logic to foster a Positive learning environment for all our students. Love and logic may seem like two Contrasting forces while love helps nurture trusting relationships where students feel respected, appreciated and loved by the teachers, logic helps to develop in students personal responsibility, self control, good decision making skills, self confidence and character building with high moral values.

Our team works in tandem and harmony as we believe that team is more about ‘We’
And less about ‘me’.

Apex Public School takes great pride in the quality of relationships that exists between staff, students and parents. We understand that this three way company is the key to student’s success.

So let us unleash the great potential that our children have and bring them up not only to face the world but also to change the world.`,

  image_url:
    "https://apexpublicschool.in/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-11-at-10.53.46.jpeg",

  back_link_label: "About Apex",
  back_link_url: "/about",

  message_label: "Principal's Message",
  image_label: "School Leadership",

  philosophy_section_enabled: true,

  philosophy_card_1_number: "01",
  philosophy_card_1_title: "Holistic development",
  philosophy_card_1_text:
    "Students are encouraged to channelize their potential in the pursuit of excellence within a holistic, student-centric environment.",

  philosophy_card_2_number: "02",
  philosophy_card_2_title: "Love, logic and character",
  philosophy_card_2_text:
    "The school combines trusting relationships with responsibility, self-control, good decision making, confidence and strong moral values.",

  contact_section_enabled: true,

  contact_phone: "09990061747",
  contact_phone_label: "Contact school",

  contact_email:
    "contacts.apexschool@gmail.com",
  contact_email_label: "Email school",

  bottom_back_label: "Back to About Apex",
  bottom_back_url: "/about",
};

function value(
  input: string | null | undefined,
  fallbackValue: string
) {
  return input?.trim()
    ? input
    : fallbackValue;
}

function PrincipalParagraphs({
  text,
}: {
  text: string;
}) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((paragraph) =>
      paragraph.trim()
    )
    .filter(Boolean);

  return (
    <div className="space-y-6 text-sm leading-8 text-[#10203A]/65 md:text-base">
      {paragraphs.map(
        (paragraph, index) => {
          const isQuote =
            paragraph.startsWith(
              "“Education is not"
            );

          return (
            <p
              key={index}
              className={
                isQuote
                  ? "border-l-2 border-[#102A56]/20 pl-5 font-medium italic text-[#102A56]/75"
                  : undefined
              }
            >
              {paragraph}
            </p>
          );
        }
      )}
    </div>
  );
}

export default async function PrincipalPage() {
  let principal =
    fallbackPrincipal;

  try {
    const { data, error } =
      await supabase
        .from("about_pages")
        .select("*")
        .eq("slug", "principal")
        .eq("is_active", true)
        .maybeSingle();

    if (!error && data) {
      principal = {
        ...fallbackPrincipal,
        ...Object.fromEntries(
          Object.entries(data).map(
            ([key, value]) => [
              key,
              value === null
                ? ""
                : value,
            ]
          )
        ),
      } as PrincipalPage;
    }
  } catch (error) {
    console.error(
      "Principal page load failed:",
      error
    );
  }

  const personName = value(
    principal.person_name,
    fallbackPrincipal.person_name!
  );

  const personRole = value(
    principal.person_role,
    fallbackPrincipal.person_role!
  );

  const principalTitle = value(
    principal.title,
    fallbackPrincipal.title!
  );

  const principalEyebrow =
    value(
      principal.eyebrow,
      fallbackPrincipal.eyebrow!
    );

  const imageLabel = value(
    principal.image_label,
    fallbackPrincipal.image_label!
  );

  const messageLabel =
    value(
      principal.message_label,
      fallbackPrincipal.message_label!
    );

  const backLabel = value(
    principal.back_link_label,
    fallbackPrincipal.back_link_label!
  );

  const backUrl = value(
    principal.back_link_url,
    fallbackPrincipal.back_link_url!
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F0E6] text-[#10203A]">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#102A56] text-white">

        <div className="pointer-events-none absolute -right-48 -top-48 h-[650px] w-[650px] rounded-full bg-[#8DB9E5]/10 blur-[140px]" />

        <div className="relative mx-auto max-w-[1500px] px-6 pb-24 pt-36 md:px-10 md:pb-32 lg:px-14 lg:pt-40">

          <Link
            href={backUrl}
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

            {backLabel}
          </Link>

          <div className="mt-14 flex items-center gap-3">

            <span className="h-px w-10 bg-[#F5F0E6]/30" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#F5F0E6]/50">
              {principalEyebrow}
            </p>

          </div>

          <p className="mt-8 text-sm font-medium text-[#F5F0E6]/75 md:text-base">
            {personName}
          </p>

          <h1 className="mt-4 max-w-5xl text-5xl font-semibold leading-[0.9] tracking-[-0.06em] md:text-7xl lg:text-[6.4vw]">
            {principalTitle}
          </h1>

          <div className="mt-10 flex items-center gap-4">

            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.06]">
              <GraduationCap
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

      {/* =====================================================
          MESSAGE
      ====================================================== */}

      <section className="relative">

        <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14 lg:py-32">

          <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">

            {/* IMAGE */}

            <div className="relative min-h-[620px] overflow-hidden rounded-[2rem] bg-[#102A56]">

              {principal.image_url ? (
                <img
                  src={
                    principal.image_url
                  }
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
                {imageLabel}
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
                  {messageLabel}
                </p>

              </div>

              <h2 className="mt-7 max-w-2xl text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#102A56] md:text-5xl">
                {principalTitle}
              </h2>

              <div className="mt-9">

                <PrincipalParagraphs
                  text={value(
                    principal.content,
                    fallbackPrincipal.content!
                  )}
                />

              </div>

            </article>

          </div>

          {/* =================================================
              PHILOSOPHY
          ================================================== */}

          {principal.philosophy_section_enabled !==
            false && (
            <div className="mt-6 grid gap-6 md:grid-cols-2">

              <article className="rounded-[2rem] bg-[#102A56] p-8 text-white md:p-10">

                <p className="text-[9px] uppercase tracking-[0.28em] text-white/30">
                  {value(
                    principal.philosophy_card_1_number,
                    fallbackPrincipal.philosophy_card_1_number!
                  )}
                </p>

                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.035em] md:text-3xl">
                  {value(
                    principal.philosophy_card_1_title,
                    fallbackPrincipal.philosophy_card_1_title!
                  )}
                </h3>

                <p className="mt-5 text-sm leading-7 text-white/55">
                  {value(
                    principal.philosophy_card_1_text,
                    fallbackPrincipal.philosophy_card_1_text!
                  )}
                </p>

              </article>

              <article className="rounded-[2rem] border border-[#102A56]/10 bg-white p-8 md:p-10">

                <p className="text-[9px] uppercase tracking-[0.28em] text-[#102A56]/30">
                  {value(
                    principal.philosophy_card_2_number,
                    fallbackPrincipal.philosophy_card_2_number!
                  )}
                </p>

                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.035em] text-[#102A56] md:text-3xl">
                  {value(
                    principal.philosophy_card_2_title,
                    fallbackPrincipal.philosophy_card_2_title!
                  )}
                </h3>

                <p className="mt-5 text-sm leading-7 text-[#10203A]/55">
                  {value(
                    principal.philosophy_card_2_text,
                    fallbackPrincipal.philosophy_card_2_text!
                  )}
                </p>

              </article>

            </div>
          )}

          {/* =================================================
              CONTACT
          ================================================== */}

          {principal.contact_section_enabled !==
            false && (
            <div className="mt-10 flex flex-wrap gap-3">

             <a
  href={`tel:${value(
    principal.contact_phone,
    fallbackPrincipal.contact_phone!
  )}`}
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
    {value(
      principal.contact_phone_label,
      fallbackPrincipal.contact_phone_label!
    )}
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
                href={`mailto:${value(
                  principal.contact_email,
                  fallbackPrincipal.contact_email!
                )}`}
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

                {value(
                  principal.contact_email_label,
                  fallbackPrincipal.contact_email_label!
                )}
              </a>

            </div>
          )}

          {/* =================================================
              BACK TO ABOUT
          ================================================== */}

          <div className="mt-12 border-t border-[#102A56]/10 pt-8">

            <Link
              href={value(
                principal.bottom_back_url,
                fallbackPrincipal.bottom_back_url!
              )}
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
                duration-300
                hover:text-[#102A56]
              "
            >
              <ArrowLeft
                size={14}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />

              {value(
                principal.bottom_back_label,
                fallbackPrincipal.bottom_back_label!
              )}
            </Link>

          </div>

        </div>
      </section>
    </main>
  );
}