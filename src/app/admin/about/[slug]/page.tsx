import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  Eye,
  Heart,
  UserRound,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type AboutPage = {
  id: string;
  slug: string;
  menu_label: string | null;
  title: string | null;
  eyebrow: string | null;
  person_name: string | null;
  person_role: string | null;
  content: string | null;
  image_url: string | null;
  mission: string | null;
  vision: string | null;
  sort_order: number;
  is_active: boolean;
};

export default async function AboutSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

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
      sort_order,
      is_active
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("About page load failed:", error);
  }

  if (!data) {
    notFound();
  }

  const page = data as AboutPage;

  const isMissionVision =
    page.slug === "mission-vision";

  return (
    <main className="min-h-screen bg-[#F5F0E6] text-[#10203A]">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        className="
          bg-[#102A56]
          pt-32
          md:pt-36
          lg:pt-40
        "
      >
        <div
          className="
            mx-auto
            max-w-[1500px]
            px-6
            pb-20
            pt-8
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
            {page.eyebrow || "ABOUT APEX"}
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
            {page.title ||
              page.menu_label ||
              "About Apex"}
          </h1>

          {!isMissionVision && page.person_name && (
            <div className="mt-8 flex flex-wrap items-center gap-3">

              <span
                className="
                  rounded-full
                  border
                  border-white/15
                  bg-white/[0.05]
                  px-4
                  py-2
                  text-sm
                  font-medium
                  !text-[#F5F0E6]
                "
              >
                {page.person_name}
              </span>

              {page.person_role && (
                <span
                  className="
                    rounded-full
                    border
                    border-white/10
                    px-4
                    py-2
                    text-sm
                    !text-white/55
                  "
                >
                  {page.person_role}
                </span>
              )}

            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          MISSION / VISION
      ====================================================== */}

      {isMissionVision ? (
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
            <div className="mb-12 max-w-3xl">

              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.28em]
                  !text-[#102A56]/40
                "
              >
                Our direction
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
                Education with purpose,
                values and responsibility.
              </h2>

            </div>

            <div className="grid gap-5 lg:grid-cols-2">

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
                    01
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
                    <Heart size={19} />
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
                  Our Mission
                </h2>

                <div className="mt-7 h-px bg-[#102A56]/10" />

                <p
                  className="
                    mt-7
                    text-lg
                    font-medium
                    leading-8
                    !text-[#102A56]/80
                    md:text-xl
                    md:leading-9
                  "
                >
                  {page.mission ||
                    "Mission information will be published by the school."}
                </p>
              </article>

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
                    02
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
                    <Eye size={19} />
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
                  Our Vision
                </h2>

                <div className="mt-7 h-px bg-white/10" />

                <p
                  className="
                    mt-7
                    text-lg
                    font-medium
                    leading-8
                    !text-white/75
                    md:text-xl
                    md:leading-9
                  "
                >
                  {page.vision ||
                    "Vision information will be published by the school."}
                </p>
              </article>
            </div>

            {page.content && (
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
                  Our commitment
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
                  {page.content}
                </p>
              </div>
            )}

            <BackToAbout />
          </div>
        </section>
      ) : (
        /* =====================================================
           LEADERSHIP / OTHER ABOUT PAGE
        ====================================================== */

        <section>
          <div
            className="
              mx-auto
              max-w-[1200px]
              px-6
              py-16
              md:px-10
              md:py-24
              lg:px-14
              lg:py-28
            "
          >

            <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">

              {/* PHOTO */}

              <div
                className="
                  relative
                  min-h-[500px]
                  overflow-hidden
                  rounded-[2rem]
                  bg-[#E9E2D5]
                "
              >
                {page.image_url ? (
                  <img
                    src={page.image_url}
                    alt={
                      page.person_name ||
                      page.title ||
                      "Apex Public School"
                    }
                    className="
                      absolute
                      inset-0
                      h-full
                      w-full
                      object-cover
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-full
                      min-h-[500px]
                      flex-col
                      items-center
                      justify-center
                      bg-[#DCE7F5]
                      px-8
                      text-center
                    "
                  >
                    <div
                      className="
                        grid
                        h-20
                        w-20
                        place-items-center
                        rounded-full
                        bg-[#102A56]
                        !text-[#F5F0E6]
                      "
                    >
                      {page.slug === "ceo" ? (
                        <BriefcaseBusiness size={28} />
                      ) : (
                        <UserRound size={28} />
                      )}
                    </div>

                    <p
                      className="
                        mt-6
                        text-sm
                        font-medium
                        !text-[#53627A]
                      "
                    >
                      Leadership photograph
                    </p>

                    <p
                      className="
                        mt-2
                        max-w-xs
                        text-xs
                        leading-5
                        !text-[#687589]
                      "
                    >
                      Add the official photograph from the
                      administration panel.
                    </p>
                  </div>
                )}

                {page.person_role && (
                  <div
                    className="
                      absolute
                      bottom-6
                      left-6
                      rounded-full
                      border
                      border-white/20
                      bg-[#071A38]/65
                      px-4
                      py-2
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.2em]
                      !text-white
                      backdrop-blur-md
                    "
                  >
                    {page.person_role}
                  </div>
                )}
              </div>

              {/* CONTENT */}

              <article
                className="
                  rounded-[2rem]
                  bg-[#FFFDF8]
                  p-7
                  shadow-[0_15px_45px_rgba(16,42,86,0.06)]
                  md:p-10
                  lg:p-12
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
                  {page.eyebrow || "Leadership"}
                </p>

                {page.person_name && (
                  <h2
                    className="
                      mt-5
                      text-4xl
                      font-semibold
                      leading-[0.95]
                      tracking-[-0.05em]
                      !text-[#102A56]
                      md:text-5xl
                    "
                  >
                    {page.person_name}
                  </h2>
                )}

                {page.person_role && (
                  <p
                    className="
                      mt-3
                      text-sm
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      !text-[#687589]
                    "
                  >
                    {page.person_role}
                  </p>
                )}

                <div className="mt-8 h-px bg-[#102A56]/10" />

                {page.content ? (
                  <div
                    className="
                      mt-8
                      whitespace-pre-line
                      text-base
                      leading-8
                      !text-[#53627A]
                      md:text-lg
                    "
                  >
                    {page.content}
                  </div>
                ) : (
                  <p
                    className="
                      mt-8
                      text-base
                      leading-8
                      !text-[#687589]
                    "
                  >
                    Biography and profile information will be
                    published by the school.
                  </p>
                )}

              </article>

            </div>

            <BackToAbout />
          </div>
        </section>
      )}

      {/* =====================================================
          FOOTER CTA
      ====================================================== */}

      <section className="bg-[#102A56]">
        <div
          className="
            mx-auto
            max-w-[1500px]
            px-6
            py-14
            md:px-10
            md:py-20
            lg:px-14
          "
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>
              <p
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.25em]
                  !text-[#DCE7F5]/40
                "
              >
                Apex Public School
              </p>

              <h2
                className="
                  mt-3
                  text-2xl
                  font-semibold
                  tracking-[-0.04em]
                  !text-[#F5F0E6]
                  md:text-3xl
                "
              >
                Answer Duty&apos;s Call
              </h2>
            </div>

            <Link
              href="/about"
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
                Back to About
              </span>

              <ArrowRight
                size={15}
                className="!text-[#F5F0E6] transition-transform group-hover:translate-x-1"
              />
            </Link>

          </div>
        </div>
      </section>

    </main>
  );
}

function BackToAbout() {
  return (
    <div className="mt-10">

      <Link
        href="/about"
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
        <ArrowRight
          size={14}
          className="
            rotate-180
            !text-[#102A56]
            transition-transform
            group-hover:-translate-x-0.5
          "
        />

        <span className="!text-[#102A56]">
          Back to About
        </span>
      </Link>

    </div>
  );
}