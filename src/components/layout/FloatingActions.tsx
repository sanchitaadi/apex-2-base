"use client";

import {
  CreditCard,
  Trophy,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const actions = [
  {
    label: "Pay Fees",
    sublabel: "Online Payment",
    href: "https://apexps.genericsoftware.in/Parent/Login.aspx",
    side: "left",
    icon: CreditCard,
  },
  {
    label: "CBSE Results",
    sublabel: "Academic Results",
    href: "/cbse-results",
    side: "right",
    icon: Trophy,
  },
];

export default function FloatingActions() {
  return (
    <>
      {actions.map((item) => {
        const Icon = item.icon;
        const isLeft = item.side === "left";
        const isExternal = item.href.startsWith("http");

        return (
          <a
            key={item.label}
            href={item.href}
            aria-label={item.label}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            data-static-motion="true"
            data-floating-action="true"
            className={`
              group
              fixed
              top-1/2
              z-[9999]
              block
              -translate-y-1/2
              ${isLeft ? "left-0" : "right-0"}
            `}
          >
            <div
              className={`
                relative
                flex
                h-[170px]
                w-[48px]
                sm:h-[180px]
                sm:w-[54px]
                md:h-[190px]
                md:w-[58px]
                flex-col
                items-center
                justify-between
                overflow-hidden
                border
                py-3
                backdrop-blur-2xl
                transition-all
                duration-500
                ease-out

                ${
                  isLeft
                    ? `
                      rounded-r-[18px]
                      sm:rounded-r-[20px]
                      border-l-0
                      border-white/10
                      bg-[#102A56]/95
                      text-[#F5F0E6]
                      shadow-[6px_0_25px_rgba(10,29,59,0.28),0_0_20px_rgba(90,150,220,0.14)]
                      group-hover:w-[56px]
                      sm:group-hover:w-[62px]
                      md:group-hover:w-[66px]
                      group-hover:shadow-[8px_0_35px_rgba(10,29,59,0.38),0_0_35px_rgba(90,150,220,0.26)]
                    `
                    : `
                      rounded-l-[18px]
                      sm:rounded-l-[20px]
                      border-r-0
                      border-[#102A56]/10
                      bg-[#F5F0E6]/95
                      text-[#102A56]
                      shadow-[-6px_0_25px_rgba(16,42,86,0.16),0_0_20px_rgba(255,255,255,0.55)]
                      group-hover:w-[56px]
                      sm:group-hover:w-[62px]
                      md:group-hover:w-[66px]
                      group-hover:shadow-[-8px_0_35px_rgba(16,42,86,0.22),0_0_35px_rgba(255,255,255,0.8)]
                    `
                }
              `}
            >
              {/* =====================================================
                  AMBIENT GLOW
              ====================================================== */}
              <span
                className={`
                  pointer-events-none
                  absolute
                  inset-[-20px]
                  -z-10
                  rounded-full
                  blur-2xl
                  opacity-0
                  transition-opacity
                  duration-500
                  group-hover:opacity-100

                  ${
                    isLeft
                      ? "bg-[#5C96CE]/20"
                      : "bg-white/70"
                  }
                `}
              />

              {/* =====================================================
                  MOVING LIGHT SWEEP
              ====================================================== */}
              <span
                className="
                  pointer-events-none
                  absolute
                  -top-[40%]
                  left-0
                  h-[30%]
                  w-full
                  bg-gradient-to-b
                  from-transparent
                  via-white/20
                  to-transparent
                  blur-sm
                  transition-all
                  duration-1000
                  ease-out
                  group-hover:top-[110%]
                "
              />

              {/* =====================================================
                  TOP ICON
              ====================================================== */}
              <div
                className={`
                  relative
                  grid
                  h-8
                  w-8
                  sm:h-9
                  sm:w-9
                  shrink-0
                  place-items-center
                  rounded-xl
                  border
                  transition-all
                  duration-500
                  group-hover:scale-110

                  ${
                    isLeft
                      ? "border-white/10 bg-white/[0.07]"
                      : "border-[#102A56]/10 bg-[#102A56]/[0.05]"
                  }
                `}
              >
                <Icon
                  size={16}
                  className="sm:h-[17px] sm:w-[17px]"
                  strokeWidth={1.8}
                />
              </div>

              {/* =====================================================
                  VERTICAL TEXT
              ====================================================== */}
              <div className="flex flex-1 items-center justify-center">
                <div
                  className="
                    whitespace-nowrap
                    text-[9px]
                    sm:text-[10px]
                    md:text-[11px]
                    font-semibold
                    tracking-[0.08em]
                    sm:tracking-[0.09em]
                  "
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                >
                  {item.label}
                </div>
              </div>

              {/* =====================================================
                  BOTTOM DETAILS
              ====================================================== */}
              <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                {/* Sparkle */}
                <Sparkles
                  size={9}
                  className={`
                    sm:h-[10px]
                    sm:w-[10px]
                    opacity-40
                    transition-all
                    duration-500
                    group-hover:opacity-100
                    group-hover:scale-110

                    ${
                      isLeft
                        ? "text-[#A9D8FF]"
                        : "text-[#079769]"
                    }
                  `}
                  strokeWidth={1.5}
                />

                {/* Status dot */}
                <span
                  className={`
                    h-1.5
                    w-1.5
                    rounded-full
                    transition-all
                    duration-500
                    group-hover:scale-125

                    ${
                      isLeft
                        ? "bg-[#8DC7FF] shadow-[0_0_10px_#8DC7FF]"
                        : "bg-[#1956BF] shadow-[0_0_8px_rgba(16,42,86,0.45)]"
                    }
                  `}
                />

                {/* Arrow */}
                <ArrowUpRight
                  size={11}
                  className="
                    sm:h-[13px]
                    sm:w-[13px]
                    opacity-40
                    transition-all
                    duration-500
                    group-hover:-translate-y-0.5
                    group-hover:translate-x-0.5
                    group-hover:opacity-100
                  "
                  strokeWidth={1.7}
                />
              </div>

              {/* =====================================================
                  EDGE LIGHT
              ====================================================== */}
              <span
                className={`
                  absolute
                  top-4
                  bottom-4
                  w-px
                  scale-y-0
                  transition-transform
                  duration-500
                  group-hover:scale-y-100

                  ${
                    isLeft
                      ? "right-0 bg-gradient-to-b from-transparent via-[#8DC7FF] to-transparent"
                      : "left-0 bg-gradient-to-b from-transparent via-[#102A56]/40 to-transparent"
                  }
                `}
              />

              {/* =====================================================
                  INNER BORDER GLOW
              ====================================================== */}
              <span
                className={`
                  pointer-events-none
                  absolute
                  inset-0
                  rounded-[inherit]
                  opacity-0
                  transition-opacity
                  duration-500
                  group-hover:opacity-100

                  ${
                    isLeft
                      ? "shadow-[inset_-1px_0_0_rgba(141,199,255,0.35)]"
                      : "shadow-[inset_1px_0_0_rgba(16,42,86,0.16)]"
                  }
                `}
              />
            </div>
          </a>
        );
      })}
    </>
  );
}