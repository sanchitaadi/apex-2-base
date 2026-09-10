"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  ChevronsDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase/browser";

type HeroSlide = {
  id: string;
  eyebrow: string | null;
  title: string;
  description: string | null;
  image_url: string;
  primary_button_text: string | null;
  primary_button_url: string | null;
  secondary_button_text: string | null;
  secondary_button_url: string | null;
  sort_order: number;
  duration: number;
  is_active: boolean;
};

const fallbackSlides: HeroSlide[] = [
  {
    id: "fallback-1",
    eyebrow: "APEX PUBLIC SCHOOL · SINCE 1985",
    title: "A school where every child gets room to grow.",
    description:
      "Learning, character, confidence and opportunity come together at Apex Public School.",
    image_url:
      "https://apexpublicschool.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-02-at-1.06.01-PM-22.jpeg",
    primary_button_text: "Admissions 2026–27",
    primary_button_url: "/online-registrations",
    secondary_button_text: "Discover Apex",
    secondary_button_url: "/about",
    sort_order: 0,
    duration: 6000,
    is_active: true,
  },
  {
    id: "fallback-2",
    eyebrow: "ANSWER DUTY'S CALL",
    title: "Learning that continues beyond the classroom.",
    description:
      "Academic growth is strengthened by culture, activities, teamwork, leadership and experience.",
    image_url:
      "https://apexpublicschool.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-02-at-1.06.01-PM-28.jpeg",
    primary_button_text: "Explore Academics",
    primary_button_url: "/academics",
    secondary_button_text: "Our Activities",
    secondary_button_url: "/activities",
    sort_order: 1,
    duration: 6000,
    is_active: true,
  },
  {
    id: "fallback-3",
    eyebrow: "APEX COMMUNITY",
    title: "A tradition of education, excellence and growth.",
    description:
      "Apex has been shaping generations of students since 29 July 1985.",
    image_url:
      "https://apexpublicschool.in/wp-content/uploads/2020/05/IMG_0413-scaled.jpg",
    primary_button_text: "Our Story",
    primary_button_url: "/about",
    secondary_button_text: "Meet the Faculty",
    secondary_button_url: "/faculty",
    sort_order: 2,
    duration: 6000,
    is_active: true,
  },
];

export default function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  /* =====================================================
     LOAD HERO SLIDES
  ====================================================== */

  useEffect(() => {
    let mounted = true;

    async function loadSlides() {
      const { data, error } = await supabase
        .from("hero_slides")
        .select(`
          id,
          eyebrow,
          title,
          description,
          image_url,
          primary_button_text,
          primary_button_url,
          secondary_button_text,
          secondary_button_url,
          sort_order,
          duration,
          is_active
        `)
        .eq("is_active", true)
        .order("sort_order", {
          ascending: true,
        });

      if (!mounted) return;

      if (error) {
        console.error("Hero slides load failed:", error);
        setSlides(fallbackSlides);
        setLoaded(true);
        return;
      }

      if (!data || data.length === 0) {
        setSlides(fallbackSlides);
        setLoaded(true);
        return;
      }

      setSlides(data as HeroSlide[]);
      setActiveIndex(0);
      setLoaded(true);
    }

    loadSlides();

    return () => {
      mounted = false;
    };
  }, []);

  /* =====================================================
     SAFE SLIDES
  ====================================================== */

  const safeSlides = useMemo(() => {
    return slides.length > 0 ? slides : fallbackSlides;
  }, [slides]);

  const activeSlide =
    safeSlides[
      Math.min(
        activeIndex,
        safeSlides.length - 1
      )
    ];

  /* =====================================================
     AUTO SLIDESHOW
  ====================================================== */

  useEffect(() => {
    if (!loaded || safeSlides.length <= 1) {
      return;
    }

    const duration =
      activeSlide?.duration || 6000;

    const timer = window.setTimeout(() => {
      setActiveIndex(
        (current) =>
          (current + 1) % safeSlides.length
      );
    }, duration);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    activeIndex,
    activeSlide?.duration,
    loaded,
    safeSlides,
  ]);

  /* =====================================================
     MANUAL NAVIGATION
  ====================================================== */

  function nextSlide() {
    setActiveIndex(
      (current) =>
        (current + 1) % safeSlides.length
    );
  }

  function previousSlide() {
    setActiveIndex(
      (current) =>
        (current - 1 + safeSlides.length) %
        safeSlides.length
    );
  }

  /* =====================================================
     URL HELPER
  ====================================================== */

  function isExternal(url?: string | null) {
    return Boolean(
      url &&
        /^https?:\/\//i.test(url)
    );
  }

  return (
    <section
      className="
        relative
        h-[100svh]
        min-h-0
        w-full
        overflow-hidden
        bg-[#102A56]
        text-white
      "
    >

      {/* =================================================
          BACKGROUND IMAGE
      ================================================== */}

      <AnimatePresence mode="sync">
        <motion.div
          key={activeSlide.id}
          initial={{
            opacity: 0,
            scale: 1.035,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            opacity: {
              duration: 0.9,
              ease: "easeInOut",
            },
            scale: {
              duration:
                (activeSlide.duration || 6000) /
                1000,
              ease: "linear",
            },
          }}
          className="absolute inset-0"
        >
          <Image
            src={activeSlide.image_url}
            alt={
              activeSlide.title ||
              "Apex Public School"
            }
            fill
            priority
            sizes="100vw"
            className="
              object-cover
              object-center
              saturate-[0.92]
            "
          />
        </motion.div>
      </AnimatePresence>

      {/* =================================================
          IMAGE PROTECTION
      ================================================== */}

      <div className="pointer-events-none absolute inset-0 bg-black/15" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#081B36]/65 via-[#102A56]/25 to-transparent" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_22%,rgba(255,253,248,0.08),transparent_30%)]" />

      {/* =================================================
          CONTENT
      ================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          h-full
          w-full
          max-w-[1600px]
          flex-col
          justify-end
          px-5
          pb-[clamp(1.25rem,4vh,3.5rem)]
          pt-[clamp(9rem,20vh,12rem)]
          sm:px-7
          md:px-10
          lg:px-14
        "
      >

        <div
          className="
            grid
            w-full
            min-h-0
            items-end
            gap-6
            lg:grid-cols-[minmax(0,1fr)_minmax(350px,420px)]
            lg:gap-8
          "
        >

          {/* =================================================
              LEFT HERO COPY
          ================================================== */}

          <div className="min-w-0 max-w-4xl">

            {/* EYEBROW */}

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeSlide.id}-eyebrow`}
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -12,
                }}
                transition={{
                  duration: 0.45,
                }}
                className="
                  inline-flex
                  max-w-full
                  rounded-full
                  border
                  border-white/20
                  bg-black/10
                  px-3.5
                  py-2
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-white/80
                  backdrop-blur-sm
                  sm:px-4
                  sm:py-2.5
                  sm:text-[9px]
                "
              >
                {activeSlide.eyebrow ||
                  "Apex Public School"}
              </motion.div>
            </AnimatePresence>

            {/* TITLE */}

            <AnimatePresence mode="wait">
              <motion.h1
                key={`${activeSlide.id}-title`}
                initial={{
                  opacity: 0,
                  y: 28,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -18,
                }}
                transition={{
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  mt-[clamp(1rem,2.4vh,1.75rem)]
                  max-w-[850px]
                  text-[clamp(2.8rem,5.5vw,6rem)]
                  font-semibold
                  leading-[0.86]
                  tracking-[-0.065em]
                  text-white
                  sm:text-[clamp(3rem,5vw,5.8rem)]
                  lg:text-[clamp(3.6rem,5vw,5.8rem)]
                "
              >
                {activeSlide.title}
              </motion.h1>
            </AnimatePresence>

            {/* DESCRIPTION */}

            <AnimatePresence mode="wait">
              {activeSlide.description && (
                <motion.p
                  key={`${activeSlide.id}-description`}
                  initial={{
                    opacity: 0,
                    y: 18,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: 0.08,
                  }}
                  className="
                    mt-[clamp(0.9rem,2vh,1.5rem)]
                    max-w-2xl
                    text-[clamp(0.8rem,1.15vw,1.125rem)]
                    leading-[1.55]
                    text-white/75
                  "
                >
                  {activeSlide.description}
                </motion.p>
              )}
            </AnimatePresence>

            {/* BUTTONS */}

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeSlide.id}-buttons`}
                initial={{
                  opacity: 0,
                  y: 16,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.14,
                }}
                className="
                  mt-[clamp(1rem,2.5vh,1.75rem)]
                  flex
                  flex-wrap
                  gap-2.5
                "
              >

                {/* PRIMARY */}

                {activeSlide.primary_button_text &&
                  activeSlide.primary_button_url && (
                    <>
                      {isExternal(
                        activeSlide.primary_button_url
                      ) ? (
                        <a
                          href={
                            activeSlide.primary_button_url
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="
                            group
                            inline-flex
                            items-center
                            gap-2.5
                            rounded-full
                            border
                            border-white/30
                            bg-[#FFFDF8]
                            px-4
                            py-2.5
                            text-xs
                            font-semibold
                            !text-[#102A56]
                            shadow-[0_10px_30px_rgba(0,0,0,0.22)]
                            transition-all
                            duration-300
                            hover:-translate-y-1
                            hover:bg-white
                          "
                        >
                          <span className="!text-[#102A56]">
                            {activeSlide.primary_button_text}
                          </span>

                          <span
                            className="
                              flex
                              h-6
                              w-6
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-[#102A56]
                              !text-[#FFFDF8]
                            "
                          >
                            <ArrowRight
                              size={12}
                              strokeWidth={2.4}
                            />
                          </span>
                        </a>
                      ) : (
                        <Link
                          href={
                            activeSlide.primary_button_url
                          }
                          className="
                            group
                            inline-flex
                            items-center
                            gap-2.5
                            rounded-full
                            border
                            border-white/30
                            bg-[#FFFDF8]
                            px-4
                            py-2.5
                            text-xs
                            font-semibold
                            !text-[#102A56]
                            shadow-[0_10px_30px_rgba(0,0,0,0.22)]
                            transition-all
                            duration-300
                            hover:-translate-y-1
                            hover:bg-white
                          "
                        >
                          <span className="!text-[#102A56]">
                            {activeSlide.primary_button_text}
                          </span>

                          <span
                            className="
                              flex
                              h-6
                              w-6
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-[#102A56]
                              !text-[#FFFDF8]
                              transition-transform
                              duration-300
                              group-hover:translate-x-0.5
                            "
                          >
                            <ArrowRight
                              size={12}
                              strokeWidth={2.4}
                            />
                          </span>
                        </Link>
                      )}
                    </>
                  )}

                {/* SECONDARY */}

                {activeSlide.secondary_button_text &&
                  activeSlide.secondary_button_url && (
                    <>
                      {isExternal(
                        activeSlide.secondary_button_url
                      ) ? (
                        <a
                          href={
                            activeSlide.secondary_button_url
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="
                            group
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-white/25
                            bg-white/[0.04]
                            px-4
                            py-2.5
                            text-xs
                            font-medium
                            text-white
                            backdrop-blur-sm
                            transition
                            duration-300
                            hover:-translate-y-1
                            hover:bg-white/10
                          "
                        >
                          <span>
                            {activeSlide.secondary_button_text}
                          </span>

                          <ArrowRight
                            size={13}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </a>
                      ) : (
                        <Link
                          href={
                            activeSlide.secondary_button_url
                          }
                          className="
                            group
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-white/25
                            bg-white/[0.04]
                            px-4
                            py-2.5
                            text-xs
                            font-medium
                            text-white
                            backdrop-blur-sm
                            transition
                            duration-300
                            hover:-translate-y-1
                            hover:bg-white/10
                          "
                        >
                          <span>
                            {activeSlide.secondary_button_text}
                          </span>

                          <ArrowRight
                            size={13}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </Link>
                      )}
                    </>
                  )}

              </motion.div>
            </AnimatePresence>

          </div>

          {/* =================================================
              RIGHT INFORMATION CARD
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              hidden
              max-h-[min(410px,calc(100svh-190px))]
              overflow-hidden
              rounded-[26px]
              border
              border-white/15
              bg-[#102A56]/55
              p-4
              shadow-[0_25px_80px_rgba(0,0,0,0.18)]
              backdrop-blur-md
              lg:block
              xl:p-5
            "
          >

            {/* CARD TITLE */}

            <div className="px-1">

              <p className="text-[8px] uppercase tracking-[0.28em] text-white/35">
                Apex Public School
              </p>

              <h2 className="mt-2 text-lg font-semibold tracking-[-0.03em]">
                Answer Duty&apos;s Call
              </h2>

            </div>

            {/* CAMPUS */}

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4">

              <div className="flex items-start gap-3">

                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-white/70"
                />

                <div>

                  <p className="text-[8px] uppercase tracking-[0.24em] text-white/35">
                    Campus
                  </p>

                  <p className="mt-1.5 text-xs leading-5 text-white/75 xl:text-sm">
                    Apex Road, B-Block, Sant Nagar,
                    <br />
                    Burari, Delhi – 110084
                  </p>

                </div>

              </div>

            </div>

            {/* CONTACT */}

            <a
              href="tel:09990061747"
              className="
                group
                mt-2.5
                flex
                items-center
                justify-between
                rounded-2xl
                border
                border-white/10
                bg-white/[0.035]
                p-4
                transition
                duration-300
                hover:bg-white/[0.07]
              "
            >

              <div className="flex items-center gap-3">

                <Phone
                  size={16}
                  className="text-white/70"
                />

                <div>

                  <p className="text-[8px] uppercase tracking-[0.24em] text-white/35">
                    Contact
                  </p>

                  <p className="mt-1.5 text-xs text-white/75 xl:text-sm">
                    09990061747
                  </p>

                </div>

              </div>

              <ArrowRight
                size={15}
                className="
                  text-white/40
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />

            </a>

            {/* CONTROLS */}

            <div className="mt-4 flex items-center justify-between">

              <div className="text-[9px] tracking-[0.15em] text-white/35">

                {String(
                  activeIndex + 1
                ).padStart(2, "0")}

                {" / "}

                {String(
                  safeSlides.length
                ).padStart(2, "0")}

              </div>

              <div className="flex items-center gap-1.5">

                <button
                  type="button"
                  onClick={previousSlide}
                  aria-label="Previous slide"
                  className="
                    grid
                    h-9
                    w-9
                    place-items-center
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.035]
                    text-white/70
                    transition
                    hover:bg-white/10
                    hover:text-white
                  "
                >
                  <ChevronLeft size={15} />
                </button>

                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="
                    grid
                    h-9
                    w-9
                    place-items-center
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.035]
                    text-white/70
                    transition
                    hover:bg-white/10
                    hover:text-white
                  "
                >
                  <ChevronRight size={15} />
                </button>

              </div>

            </div>

            {/* PROGRESS */}

            <div className="mt-3 flex gap-1.5">

              {safeSlides.map(
                (item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() =>
                      setActiveIndex(index)
                    }
                    className="
                      group
                      h-1
                      flex-1
                      overflow-hidden
                      rounded-full
                      bg-white/10
                    "
                  >
                    <span
                      className={`
                        block
                        h-full
                        rounded-full
                        transition-all
                        duration-500
                        ${
                          index === activeIndex
                            ? "bg-white"
                            : "bg-transparent group-hover:bg-white/30"
                        }
                      `}
                    />
                  </button>
                )
              )}

            </div>

          </motion.div>

        </div>
      </div>

      {/* =================================================
          MOBILE SLIDE INDICATOR
      ================================================== */}

      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 lg:hidden">
        {safeSlides.map(
          (item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() =>
                setActiveIndex(index)
              }
              className={`
                h-1.5
                rounded-full
                transition-all
                duration-300
                ${
                  index === activeIndex
                    ? "w-8 bg-white"
                    : "w-2 bg-white/30"
                }
              `}
            />
          )
        )}

      </div>
{/* =================================================
    SCROLL CONTROLS
================================================= */}

<div
  className="
    absolute
    bottom-16
    left-1/2
    z-[50]
    flex
    -translate-x-1/2
    items-center
    gap-2
    sm:bottom-16
    sm:gap-3
  "
>

  {/* SCROLL TO ABOUT */}

  <motion.a
    href="#about"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.7,
      delay: 0.8,
    }}
    className="
  group
  flex
  items-center
  gap-2
  rounded-full
  border
  border-white/25
  bg-[#102A56]/70
  px-3
  py-2
  backdrop-blur-md
  transition
  duration-300
  hover:border-white/40
  hover:bg-[#102A56]/85
  sm:gap-3
  sm:px-4
"
  >
    <span
      className="
        text-[8px]
        font-semibold
        uppercase
        tracking-[0.28em]
        text-white/45
        transition
        duration-300
        group-hover:text-white/80
      "
    >
      Scroll
    </span>

    <motion.span
      animate={{
        y: [0, 4, 0],
      }}
      transition={{
        duration: 1.6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="
        grid
        h-8
        w-8
        place-items-center
        rounded-full
        border
        border-white/15
        bg-white/[0.05]
        text-white/70
      "
    >
      <ChevronDown
        size={14}
        strokeWidth={1.7}
      />
    </motion.span>
  </motion.a>

  {/* SCROLL TO END */}

  <motion.a
    href="#site-end"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.7,
      delay: 0.95,
    }}
    className="
      group
      flex
      items-center
      gap-3
      rounded-full
      border
      border-white/15
      bg-black/10
      px-4
      py-2
      backdrop-blur-md
      transition
      duration-300
      hover:border-white/30
      hover:bg-white/10
    "
  >
    <span
      className="
        text-[8px]
        font-semibold
        uppercase
        tracking-[0.28em]
        text-white/45
        transition
        duration-300
        group-hover:text-white/80
      "
    >
      End
    </span>

    <motion.span
      animate={{
        y: [0, 5, 0],
      }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="
        grid
        h-8
        w-8
        place-items-center
        rounded-full
        border
        border-white/15
        bg-white/[0.05]
        text-white/70
      "
    >
      <ChevronsDown
        size={14}
        strokeWidth={1.7}
      />
    </motion.span>
  </motion.a>

</div>
    </section>
  );
}