"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Atom,
  Building2,
  FlaskConical,
  Loader2,
  Palette,
  Trophy,
} from "lucide-react";
import { motion } from "framer-motion";

import { supabase } from "@/lib/supabase/browser";

type Facility = {
  id: string;
  number: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
};

const fallbackFacilities: Facility[] = [
  {
    id: "fallback-1",
    number: "01",
    title: "Science & Computer Labs",
    description:
      "Spaces where students experiment, investigate and turn classroom concepts into practical understanding.",
    image_url:
      "https://apexpublicschool.in/wp-content/uploads/2020/05/IMG_0413-scaled.jpg",
    icon: "FlaskConical",
    sort_order: 0,
    is_active: true,
  },
  {
    id: "fallback-2",
    number: "02",
    title: "Sports & Athletics",
    description:
      "Basketball, badminton, volleyball and cricket experiences that develop fitness, teamwork and discipline.",
    image_url:
      "https://apexpublicschool.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-02-at-1.06.01-PM-28.jpeg",
    icon: "Trophy",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "fallback-3",
    number: "03",
    title: "Arts, Music & Dance",
    description:
      "Creative spaces where students discover expression, confidence and interests beyond academics.",
    image_url:
      "https://apexpublicschool.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-02-at-1.06.01-PM-22.jpeg",
    icon: "Palette",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "fallback-4",
    number: "04",
    title: "Smart Classrooms",
    description:
      "Technology-enhanced classrooms designed to make teaching more visual, interactive and engaging.",
    image_url:
      "https://apexpublicschool.in/wp-content/uploads/2020/05/IMG_0413-scaled.jpg",
    icon: "Atom",
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
        y: 24,
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
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function FacilityIcon({
  icon,
}: {
  icon: string | null;
}) {
  const common = {
    size: 19,
    strokeWidth: 1.5,
  };

  switch (icon) {
    case "FlaskConical":
      return <FlaskConical {...common} />;

    case "Trophy":
      return <Trophy {...common} />;

    case "Palette":
      return <Palette {...common} />;

    case "Atom":
      return <Atom {...common} />;

    case "Building2":
      return <Building2 {...common} />;

    default:
      return <Building2 {...common} />;
  }
}

export default function Campus() {
  const [facilities, setFacilities] =
    useState<Facility[]>(
      fallbackFacilities
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadFacilities() {
      const { data, error } =
        await supabase
          .from("campus_facilities")
          .select(
            `
              id,
              number,
              title,
              description,
              image_url,
              icon,
              sort_order,
              is_active
            `
          )
          .eq("is_active", true)
          .order("sort_order", {
            ascending: true,
          });

      if (!mounted) return;

      if (error) {
        console.error(
          "Campus facilities load failed:",
          {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          }
        );
      } else if (
        data &&
        data.length > 0
      ) {
        setFacilities(
          data as Facility[]
        );
      }

      setLoading(false);
    }

    loadFacilities();

    return () => {
      mounted = false;
    };
  }, []);

  const heroFacility =
    facilities[0] || fallbackFacilities[0];

  const cards = facilities.slice(
    0,
    4
  );

  return (
    <section
      id="campus"
      className="bg-[#F5F0E6]"
    >
      <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14 lg:py-32">

        {/* =================================================
            SECTION INTRO
        ================================================== */}

        <Reveal>

          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">

            <div>

              <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#102A56]/40">

                <span className="h-px w-9 bg-[#102A56]/20" />

                Campus Life

              </div>

              <h2 className="mt-6 max-w-lg text-4xl font-semibold leading-[0.93] tracking-[-0.06em] text-[#102A56] md:text-6xl">

                A place to
                <br />
                learn, explore
                <br />
                and grow.

              </h2>

            </div>

            <div className="flex items-end">

              <p className="max-w-2xl text-lg leading-8 text-[#10203A]/55 md:text-xl md:leading-9">

                From classrooms and laboratories to
                sports, arts and shared spaces, the Apex
                campus gives students room to develop
                their interests beyond the textbook.

              </p>

            </div>

          </div>

        </Reveal>

        {/* =================================================
            FEATURE IMAGE
        ================================================== */}

        <Reveal delay={0.08}>

          <div className="mt-14 overflow-hidden rounded-[2rem] bg-[#102A56]">

            <div className="grid lg:grid-cols-[1.3fr_0.7fr]">

              {/* IMAGE */}

              <div className="relative min-h-[430px] overflow-hidden bg-[#0B2146] md:min-h-[560px]">

                {heroFacility.image_url ? (
                  <img
                    src={
                      heroFacility.image_url
                    }
                    alt={
                      heroFacility.title
                    }
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/20">
                    <Building2 size={42} />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#071A38]/70 via-transparent to-transparent" />

                <div className="absolute bottom-7 left-7 right-7 md:bottom-9 md:left-9 md:right-9">

                  <p className="text-[9px] uppercase tracking-[0.25em] text-white/40">
                    Featured campus space
                  </p>

                  <h3 className="mt-3 max-w-2xl text-3xl font-semibold leading-[0.95] tracking-[-0.045em] text-white md:text-5xl">
                    {heroFacility.title}
                  </h3>

                </div>

              </div>

              {/* FEATURE TEXT */}

              <div className="flex min-h-[430px] flex-col justify-between p-7 text-white md:min-h-[560px] md:p-10">

                <div>

                  <div className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/70">
                    <FacilityIcon
                      icon={
                        heroFacility.icon
                      }
                    />
                  </div>

                  <p className="mt-9 text-[9px] uppercase tracking-[0.25em] text-white/30">
                    What students experience
                  </p>

                  <p className="mt-5 max-w-md text-xl leading-8 text-white/65">
                    {
                      heroFacility.description
                    }
                  </p>

                </div>

                <div className="border-t border-white/10 pt-7">

                  <div className="flex items-center justify-between">

                    <span className="text-[9px] uppercase tracking-[0.22em] text-white/25">
                      Campus
                    </span>

                    <span className="text-2xl font-semibold text-white/25">
                      {heroFacility.number ||
                        "01"}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </Reveal>

        {/* =================================================
            FACILITY CARDS
        ================================================== */}

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          {cards.map(
            (facility, index) => (
              <Reveal
                key={facility.id}
                delay={0.05 + index * 0.05}
              >

                <article className="group overflow-hidden rounded-[1.75rem] border border-[#102A56]/10 bg-white/[0.48] transition duration-500 hover:-translate-y-1 hover:bg-white">

                  {/* IMAGE */}

                  <div className="relative aspect-[4/3] overflow-hidden bg-[#E9E2D5]">

                    {facility.image_url ? (
                      <img
                        src={
                          facility.image_url
                        }
                        alt={
                          facility.title
                        }
                        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-[#102A56]/20">
                        <Building2 size={30} />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />

                    <div className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-black/10 text-white backdrop-blur-sm">
                      <FacilityIcon
                        icon={
                          facility.icon
                        }
                      />
                    </div>

                    <div className="absolute bottom-4 right-4 text-xs font-semibold text-white/70">
                      {facility.number ||
                        String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                    </div>

                  </div>

                  {/* CONTENT */}

                  <div className="p-5 md:p-6">

                    <h3 className="text-xl font-semibold leading-tight tracking-[-0.035em] text-[#102A56]">
                      {facility.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#10203A]/45">
                      {
                        facility.description
                      }
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-[#102A56]/10 pt-5">

                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#102A56]/30">
                        Explore
                      </span>

                      <div className="grid h-9 w-9 place-items-center rounded-full border border-[#102A56]/10 text-[#102A56]/45 transition duration-300 group-hover:translate-x-1 group-hover:bg-[#102A56] group-hover:text-white">
                        <ArrowRight
                          size={14}
                        />
                      </div>

                    </div>

                  </div>

                </article>

              </Reveal>
            )
          )}

        </div>

        {/* =================================================
            EMPTY STATE
        ================================================== */}

        {facilities.length === 0 && (
          <div className="mt-6 rounded-[2rem] border border-[#102A56]/10 bg-white/[0.45] p-10 text-center">

            <p className="text-sm text-[#10203A]/45">
              Campus information will appear here soon.
            </p>

          </div>
        )}

      </div>

      {/* CMS LOADING INDICATOR */}

      {loading && (
        <div className="pointer-events-none fixed bottom-5 right-5 z-[150] flex items-center gap-2 rounded-full border border-white/10 bg-[#102A56]/90 px-4 py-2 text-[9px] uppercase tracking-[0.16em] text-white/45 shadow-xl backdrop-blur-md">

          <Loader2
            size={12}
            className="animate-spin"
          />

          Updating campus

        </div>
      )}

    </section>
  );
}