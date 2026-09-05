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
            className={`
              group
              fixed
              top-1/2
              z-[90]
              hidden
              -translate-y-1/2
              md:block
              ${isLeft ? "left-0" : "right-0"}
            `}
          >
            <div
              className={`
                relative
                flex
                h-[190px]
                w-[58px]
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
                      rounded-r-[20px]
                      border-l-0
                      border-white/10
                      bg-[#102A56]/95
                      text-[#F5F0E6]
                      shadow-[8px_0_35px_rgba(10,29,59,0.28),0_0_25px_rgba(90,150,220,0.14)]
                      group-hover:w-[66px]
                      group-hover:shadow-[10px_0_45px_rgba(10,29,59,0.38),0_0_40px_rgba(90,150,220,0.26)]
                    `
                    : `
                      rounded-l-[20px]
                      border-r-0
                      border-[#102A56]/10
                      bg-[#F5F0E6]/95
                      text-[#102A56]
                      shadow-[-8px_0_35px_rgba(16,42,86,0.16),0_0_25px_rgba(255,255,255,0.55)]
                      group-hover:w-[66px]
                      group-hover:shadow-[-10px_0_45px_rgba(16,42,86,0.22),0_0_40px_rgba(255,255,255,0.8)]
                    `
                }
              `}
            >
              {/* Ambient glow */}
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

              {/* Moving light */}
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
                  group-hover:top-[110%]
                "
              />

              {/* Top icon */}
              <div
                className={`
                  relative
                  grid
                  h-9
                  w-9
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
                  size={17}
                  strokeWidth={1.8}
                />
              </div>

              {/* Vertical text */}
              <div className="flex flex-1 items-center justify-center">
                <div
                  className="
                    whitespace-nowrap
                    text-[11px]
                    font-semibold
                    tracking-[0.09em]
                  "
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                >
                  {item.label}
                </div>
              </div>

              {/* Bottom details */}
              <div className="flex flex-col items-center gap-2">
                <Sparkles
                  size={10}
                  strokeWidth={1.5}
                  className={`
                    opacity-35
                    transition-all
                    duration-500
                    group-hover:opacity-100
                    ${
                      isLeft
                        ? "text-[#A9D8FF]"
                        : "text-[#102A56]"
                    }
                  `}
                />

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
                        : "bg-[#102A56] shadow-[0_0_8px_rgba(16,42,86,0.45)]"
                    }
                  `}
                />

                <ArrowUpRight
                  size={13}
                  strokeWidth={1.7}
                  className="
                    opacity-35
                    transition-all
                    duration-500
                    group-hover:-translate-y-0.5
                    group-hover:translate-x-0.5
                    group-hover:opacity-100
                  "
                />
              </div>

              {/* Edge light */}
              <span
                className={`
                  absolute
                  top-5
                  bottom-5
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
            </div>
          </a>
        );
      })}
    </>
  );
}