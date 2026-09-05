"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function SiteLoader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame: number;

    const start = performance.now();

    const updateProgress = (time: number) => {
      const elapsed = time - start;

      /*
       * Fast at the beginning, slower near completion.
       * This feels more premium than a linear fake progress bar.
       */
      const next = Math.min(
        100,
        Math.round(
          100 *
            (1 -
              Math.exp(-elapsed / 850))
        )
      );

      setProgress(next);

      if (next < 100) {
        frame = requestAnimationFrame(updateProgress);
      }
    };

    frame = requestAnimationFrame(updateProgress);

    const finishTimer = window.setTimeout(() => {
      setProgress(100);

      window.setTimeout(() => {
        setVisible(false);
      }, 450);
    }, 1100);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(finishTimer);
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
          className="
            fixed
            inset-0
            z-[9999]
            overflow-hidden
            bg-[#071A38]
            text-white
          "
        >
          {/* =================================================
              AMBIENT GLOW
          ================================================== */}

          <motion.div
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.12, 0.2, 0.12],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-[420px]
              w-[420px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[#8DB9E5]
              blur-[150px]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              opacity-[0.045]
              [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)]
              [background-size:70px_70px]
            "
          />

          {/* =================================================
              CENTER SYSTEM
          ================================================== */}

          <div className="absolute inset-0 flex items-center justify-center">

            <div className="relative h-[250px] w-[250px] sm:h-[290px] sm:w-[290px]">

              {/* OUTER ROTATING RING */}

              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="
                  absolute
                  inset-0
                  rounded-full
                  border
                  border-white/10
                "
              >
                <span
                  className="
                    absolute
                    left-1/2
                    top-[-3px]
                    h-1.5
                    w-1.5
                    -translate-x-1/2
                    rounded-full
                    bg-[#F5F0E6]
                    shadow-[0_0_16px_rgba(245,240,230,0.9)]
                  "
                />
              </motion.div>

              {/* SECOND RING */}

              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="
                  absolute
                  inset-[28px]
                  rounded-full
                  border
                  border-[#8DB9E5]/20
                  border-dashed
                "
              >
                <span
                  className="
                    absolute
                    bottom-[-3px]
                    left-1/2
                    h-1
                    w-1
                    -translate-x-1/2
                    rounded-full
                    bg-[#8DB9E5]
                    shadow-[0_0_15px_rgba(141,185,229,0.95)]
                  "
                />
              </motion.div>

              {/* THIRD RING */}

              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.25, 0.55, 0.25],
                }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  absolute
                  inset-[58px]
                  rounded-full
                  border
                  border-white/10
                "
              />

              {/* CENTER */}

              <div
                className="
                  absolute
                  left-1/2
                  top-1/2
                  grid
                  h-[125px]
                  w-[125px]
                  -translate-x-1/2
                  -translate-y-1/2
                  place-items-center
                  rounded-full
                  border
                  border-white/10
                  bg-white/[0.045]
                  shadow-[0_0_80px_rgba(141,185,229,0.12)]
                  backdrop-blur-xl
                "
              >

                {/* PULSING CORE */}

                <motion.div
                  animate={{
                    scale: [0.85, 1, 0.85],
                    opacity: [0.55, 1, 0.55],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="
                    absolute
                    h-12
                    w-12
                    rounded-full
                    bg-[#F5F0E6]/[0.06]
                    blur-md
                  "
                />

                {/* APEX MARK */}

                <div className="relative text-center">

                  <div className="text-[20px] font-bold tracking-[0.18em] text-[#F5F0E6]">
                    APEX
                  </div>

                  <div className="mt-1 text-[6px] font-semibold uppercase tracking-[0.28em] text-white/35">
                    Public School
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              TOP STATUS
          ================================================== */}

          <div className="absolute left-6 top-6 sm:left-10 sm:top-9">

            <div className="flex items-center gap-3">

              <span className="h-px w-8 bg-white/20" />

              <span className="text-[8px] font-semibold uppercase tracking-[0.3em] text-white/35">
                APEX PUBLIC SCHOOL
              </span>

            </div>

          </div>

          {/* =================================================
              BOTTOM STATUS
          ================================================== */}

          <div className="absolute bottom-7 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10">

            <div className="flex items-end justify-between gap-5">

              <div>

                <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-white/30">
                  Answer Duty&apos;s Call
                </p>

                <p className="mt-2 text-xs text-white/50">
                  Preparing your experience
                </p>

              </div>

              <div className="text-right">

                <motion.div
                  key={progress}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  className="
                    text-2xl
                    font-semibold
                    tracking-[-0.04em]
                    text-white
                  "
                >
                  {String(progress).padStart(3, "0")}
                  <span className="text-white/25">
                    %
                  </span>
                </motion.div>

              </div>

            </div>

            {/* PROGRESS BAR */}

            <div className="mt-4 h-[2px] w-full overflow-hidden rounded-full bg-white/10">

              <motion.div
                animate={{
                  width: `${progress}%`,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
                className="
                  relative
                  h-full
                  rounded-full
                  bg-[#F5F0E6]
                  shadow-[0_0_18px_rgba(245,240,230,0.55)]
                "
              >

                <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]" />

              </motion.div>

            </div>

            <div className="mt-3 flex justify-between">

              <span className="text-[7px] uppercase tracking-[0.22em] text-white/20">
                Initializing
              </span>

              <span className="text-[7px] uppercase tracking-[0.22em] text-white/20">
                Delhi · 1985
              </span>

            </div>

          </div>

          {/* =================================================
              SCAN LINE
          ================================================== */}

          <motion.div
            animate={{
              y: ["-100vh", "100vh"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
            className="
              pointer-events-none
              absolute
              left-0
              right-0
              top-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-white/20
              to-transparent
            "
          />

        </motion.div>
      )}
    </AnimatePresence>
  );
}