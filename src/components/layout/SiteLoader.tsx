"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function SiteLoader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;

    const progressTimer = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 3;

      if (current >= 100) {
        current = 100;
        clearInterval(progressTimer);
      }

      setProgress(current);
    }, 120);

    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 1900);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(loadingTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            transition: {
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
          className="
            fixed
            inset-0
            z-[99999]
            flex
            min-h-screen
            items-center
            justify-center
            overflow-hidden
          "
          style={{
            backgroundColor: "var(--cms-background)",
            color: "var(--cms-text)",
          }}
        >
          {/* =====================================================
              BACKGROUND DECORATION
          ====================================================== */}

          <div className="pointer-events-none absolute inset-0 overflow-hidden">

            {/* TOP LEFT GLOW */}

            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.12, 0.2, 0.12],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                absolute
                -left-40
                -top-40
                h-[500px]
                w-[500px]
                rounded-full
                blur-[100px]
              "
              style={{
                backgroundColor:
                  "var(--cms-primary)",
              }}
            />

            {/* BOTTOM RIGHT GLOW */}

            <motion.div
              animate={{
                scale: [1.1, 1, 1.1],
                opacity: [0.08, 0.16, 0.08],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                absolute
                -bottom-48
                -right-40
                h-[600px]
                w-[600px]
                rounded-full
                blur-[120px]
              "
              style={{
                backgroundColor:
                  "var(--cms-secondary)",
              }}
            />

            {/* GRID */}

            <div
              className="
                absolute
                inset-0
                opacity-[0.035]
              "
              style={{
                backgroundImage: `
                  linear-gradient(
                    var(--cms-primary) 1px,
                    transparent 1px
                  ),
                  linear-gradient(
                    90deg,
                    var(--cms-primary) 1px,
                    transparent 1px
                  )
                `,
                backgroundSize: "55px 55px",
              }}
            />
          </div>

          {/* =====================================================
              MAIN LOADER
          ====================================================== */}

          <div
            className="
              relative
              z-10
              flex
              w-full
              max-w-md
              flex-col
              items-center
              px-8
            "
          >
            {/* =================================================
                LOGO MARK
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 25,
                scale: 0.85,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative mb-8"
            >
              {/* OUTER GLOW */}

              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.2, 0.35, 0.2],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  absolute
                  inset-[-15px]
                  rounded-[30px]
                  blur-xl
                "
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--cms-primary) 20%, transparent)",
                }}
              />

              {/* LOGO CONTAINER */}

              <div
                className="
                  relative
                  flex
                  h-28
                  w-28
                  items-center
                  justify-center
                  rounded-[30px]
                  shadow-[0_20px_60px_rgba(23,59,112,0.25)]
                "
                style={{
                  backgroundColor:
                    "var(--cms-primary)",
                }}
              >
                {/* SCHOOL BUILDING ICON */}

                <svg
                  width="58"
                  height="58"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 1.2,
                      delay: 0.2,
                    }}
                    d="M8 27L32 11L56 27"
                    stroke="var(--cms-button-text)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: 0.8,
                    }}
                    d="M14 27V51H50V27"
                    stroke="var(--cms-button-text)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <motion.path
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{
                      delay: 0.9,
                      duration: 0.4,
                    }}
                    style={{
                      transformOrigin:
                        "center bottom",
                    }}
                    d="M27 51V36C27 33.2386 29.2386 31 32 31C34.7614 31 37 33.2386 37 36V51"
                    stroke="var(--cms-button-text)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: 1,
                    }}
                    d="M19 34H21M43 34H45M19 41H21M43 41H45"
                    stroke="var(--cms-button-text)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>

                {/* ROTATING RING */}

                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="
                    absolute
                    inset-[-7px]
                    rounded-[36px]
                    border
                    border-dashed
                  "
                  style={{
                    borderColor:
                      "color-mix(in srgb, var(--cms-primary) 25%, transparent)",
                  }}
                />
              </div>
            </motion.div>

            {/* =================================================
                SCHOOL NAME
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.35,
              }}
              className="text-center"
            >
              <p
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.45em]
                "
                style={{
                  color: "var(--cms-muted)",
                }}
              >
                Welcome to
              </p>

              <h1
                className="
                  mt-3
                  text-3xl
                  font-semibold
                  tracking-[-0.04em]
                  sm:text-4xl
                "
                style={{
                  color: "var(--cms-primary)",
                }}
              >
                Apex Public School
              </h1>

              <p
                className="
                  mt-3
                  text-sm
                "
                style={{
                  color: "var(--cms-muted)",
                }}
              >
                Excellence • Character • Knowledge
              </p>
            </motion.div>

            {/* =================================================
                LOADING AREA
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.55,
              }}
              className="mt-12 w-full"
            >
              {/* LOADING LABEL */}

              <div className="mb-3 flex items-center justify-between">
                <span
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.3em]
                  "
                  style={{
                    color: "var(--cms-muted)",
                  }}
                >
                  Loading website
                </span>

                <motion.span
                  key={progress}
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  className="
                    text-xs
                    font-semibold
                  "
                  style={{
                    color:
                      "var(--cms-primary)",
                  }}
                >
                  {progress}%
                </motion.span>
              </div>

              {/* PROGRESS BAR */}

              <div
                className="
                  relative
                  h-2
                  overflow-hidden
                  rounded-full
                "
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--cms-primary) 10%, transparent)",
                }}
              >
                <motion.div
                  initial={{
                    width: "0%",
                  }}
                  animate={{
                    width: `${progress}%`,
                  }}
                  transition={{
                    duration: 0.25,
                    ease: "easeOut",
                  }}
                  className="
                    relative
                    h-full
                    rounded-full
                  "
                  style={{
                    backgroundColor:
                      "var(--cms-primary)",
                  }}
                >
                  {/* MOVING SHINE */}

                  <motion.div
                    animate={{
                      x: ["-100%", "300%"],
                    }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="
                      absolute
                      inset-y-0
                      w-20
                      bg-gradient-to-r
                      from-transparent
                      via-white/50
                      to-transparent
                    "
                  />
                </motion.div>
              </div>

              {/* STATUS */}

              <div className="mt-5 flex items-center justify-center gap-2">
                <motion.span
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                  }}
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                  "
                  style={{
                    backgroundColor:
                      "var(--cms-accent)",
                  }}
                />

                <p
                  className="text-xs"
                  style={{
                    color:
                      "var(--cms-muted)",
                  }}
                >
                  Preparing your experience...
                </p>
              </div>
            </motion.div>

            {/* =================================================
                BOTTOM DETAILS
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.9,
                duration: 0.7,
              }}
              className="
                mt-12
                flex
                items-center
                gap-4
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.25em]
              "
              style={{
                color:
                  "color-mix(in srgb, var(--cms-muted) 80%, transparent)",
              }}
            >
              <span>Est. 1985</span>

              <span
                className="
                  h-1
                  w-1
                  rounded-full
                "
                style={{
                  backgroundColor:
                    "var(--cms-muted)",
                }}
              />

              <span>Delhi</span>

              <span
                className="
                  h-1
                  w-1
                  rounded-full
                "
                style={{
                  backgroundColor:
                    "var(--cms-muted)",
                }}
              />

              <span>CBSE</span>
            </motion.div>
          </div>

          {/* =====================================================
              TOP CORNER ELEMENT
          ====================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.8,
            }}
            className="
              absolute
              right-6
              top-6
              hidden
              items-center
              gap-2
              rounded-full
              border
              px-4
              py-2
              backdrop-blur-md
              sm:flex
            "
            style={{
              borderColor:
                "color-mix(in srgb, var(--cms-primary) 10%, transparent)",
              backgroundColor:
                "color-mix(in srgb, var(--cms-white) 60%, transparent)",
            }}
          >
            <span className="relative flex h-2 w-2">
              <motion.span
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [1, 0, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
                className="
                  absolute
                  inline-flex
                  h-full
                  w-full
                  rounded-full
                "
                style={{
                  backgroundColor:
                    "var(--cms-accent)",
                }}
              />

              <span
                className="
                  relative
                  inline-flex
                  h-2
                  w-2
                  rounded-full
                "
                style={{
                  backgroundColor:
                    "var(--cms-accent)",
                }}
              />
            </span>

            <span
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.2em]
              "
              style={{
                color: "var(--cms-muted)",
              }}
            >
              Online
            </span>
          </motion.div>

          {/* =====================================================
              BOTTOM DECORATIVE LINE
          ====================================================== */}

          <motion.div
            initial={{
              scaleX: 0,
            }}
            animate={{
              scaleX: 1,
            }}
            transition={{
              duration: 1.2,
              delay: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              absolute
              bottom-0
              left-0
              h-1
              w-full
              origin-left
            "
            style={{
              backgroundColor:
                "var(--cms-accent)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}