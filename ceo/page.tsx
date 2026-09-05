import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  UserRound,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type CEOData = {
  title: string | null;
  eyebrow: string | null;
  person_name: string | null;
  person_role: string | null;
  content: string | null;
  image_url: string | null;
};

const fallback: CEOData = {
  title: "Chief Executive Officer",
  eyebrow: "LEADERSHIP",
  person_name: "Dr. Geoff L. Jonathan",
  person_role: "CEO",
  content:
    "Dr. Geoff L. Jonathan serves as the Chief Executive Officer of Apex Public School.",
  image_url: null,
};

export default async function CEOPage() {
  let page: CEOData | null = null;

  const { data, error } = await supabase
    .from("about_pages")
    .select(
      "title,eyebrow,person_name,person_role,content,image_url"
    )
    .eq("slug", "ceo")
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error(
      "CEO page load failed:",
      error
    );
  }

  if (data) {
    page = data as CEOData;
  }

  const title =
    page?.title ||
    fallback.title ||
    "Chief Executive Officer";

  const eyebrow =
    page?.eyebrow ||
    fallback.eyebrow ||
    "LEADERSHIP";

  const name =
    page?.person_name ||
    fallback.person_name ||
    "Dr. Geoff L. Jonathan";

  const role =
    page?.person_role ||
    fallback.person_role ||
    "CEO";

  const content =
    page?.content ||
    fallback.content ||
    "";

  const imageUrl =
    page?.image_url ||
    fallback.image_url;

  return (
    <main className="min-h-screen bg-[#F5F0E6] text-[#10203A]">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="bg-[#102A56] pt-32 md:pt-36 lg:pt-40">
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
              {name}
            </span>

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
              {role}
            </span>

          </div>
        </div>
      </section>

      {/* =====================================================
          CEO PROFILE
      ====================================================== */}

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

            {/* =================================================
                PHOTO
            ================================================== */}

            <div
              className="
                relative
                min-h-[500px]
                overflow-hidden
                rounded-[2rem]
                bg-[#E9E2D5]
              "
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name}
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
                    min-h-[500px]
                    h-full
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
                      h-24
                      w-24
                      place-items-center
                      rounded-full
                      bg-[#102A56]
                      !text-[#F5F0E6]
                    "
                  >
                    <BriefcaseBusiness
                      size={30}
                      strokeWidth={1.6}
                    />
                  </div>

                  <p
                    className="
                      mt-6
                      text-lg
                      font-semibold
                      !text-[#102A56]
                    "
                  >
                    {name}
                  </p>

                  <p
                    className="
                      mt-2
                      text-xs
                      uppercase
                      tracking-[0.18em]
                      !text-[#53627A]
                    "
                  >
                    Official photograph
                  </p>

                  <p
                    className="
                      mt-4
                      max-w-xs
                      text-xs
                      leading-5
                      !text-[#687589]
                    "
                  >
                    Add the official CEO photograph from
                    the Apex administration panel.
                  </p>
                </div>
              )}

              {/* ROLE BADGE */}

              <div
                className="
                  absolute
                  bottom-6
                  left-6
                  rounded-full
                  border
                  border-white/20
                  bg-[#071A38]/70
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
                {role}
              </div>
            </div>

            {/* =================================================
                CONTENT
            ================================================== */}

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
                {eyebrow}
              </p>

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
                {name}
              </h2>

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
                {role}
              </p>

              <div className="mt-8 h-px bg-[#102A56]/10" />

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
                {content}
              </div>

              {/* LEADERSHIP NOTE */}

              <div
                className="
                  mt-10
                  rounded-[1.5rem]
                  bg-[#E9E2D5]
                  p-6
                "
              >
                <div className="flex items-start gap-4">

                  <div
                    className="
                      grid
                      h-10
                      w-10
                      shrink-0
                      place-items-center
                      rounded-full
                      bg-[#102A56]
                      !text-[#F5F0E6]
                    "
                  >
                    <UserRound
                      size={17}
                      strokeWidth={1.7}
                    />
                  </div>

                  <div>
                    <p
                      className="
                        text-sm
                        font-semibold
                        !text-[#102A56]
                      "
                    >
                      School Leadership
                    </p>

                    <p
                      className="
                        mt-2
                        text-sm
                        leading-6
                        !text-[#53627A]
                      "
                    >
                      Leadership information and the official
                      profile can be maintained directly through
                      the Apex CMS.
                    </p>
                  </div>

                </div>
              </div>

            </article>

          </div>

          {/* BACK */}

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
                Back to About
              </span>
            </Link>

          </div>

        </div>
      </section>

      {/* =====================================================
          FOOTER CTA
      ====================================================== */}

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
          <div
            className="
              flex
              flex-col
              gap-5
              md:flex-row
              md:items-center
              md:justify-between
            "
          >
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

              <h3
                className="
                  mt-3
                  text-2xl
                  font-semibold
                  !text-[#F5F0E6]
                "
              >
                Answer Duty&apos;s Call
              </h3>
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