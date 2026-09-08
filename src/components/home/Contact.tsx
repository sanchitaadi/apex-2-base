"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

function Reveal({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.75 }}
    >
      {children}
    </motion.div>
  );
}

export default function Contact() {
  return (
    <section
      id="contact"
      className="scroll-mt-36"
      style={{
        backgroundColor: "var(--cms-background)",
        color: "var(--cms-text)",
      }}
    >
      <div
        className="
          mx-auto
          max-w-[1500px]
          px-6
          py-24
          md:px-10
          md:py-32
          lg:px-14
          lg:py-36
        "
      >
        {/* HEADER */}
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-[1fr_.7fr] lg:items-end">
            <div>
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.3em]
                "
                style={{
                  color:
                    "color-mix(in srgb, var(--cms-primary) 55%, transparent)",
                }}
              >
                Get in touch
              </p>

              <h2
                className="
                  mt-6
                  max-w-5xl
                  text-5xl
                  font-semibold
                  leading-[0.9]
                  tracking-[-0.06em]
                  md:text-7xl
                  lg:text-[6vw]
                "
                style={{
                  color: "var(--cms-primary)",
                }}
              >
                Come visit
                <br />
                <span
                  style={{
                    color:
                      "color-mix(in srgb, var(--cms-primary) 30%, transparent)",
                  }}
                >
                  Apex.
                </span>
              </h2>
            </div>

            <p
              className="
                max-w-md
                text-sm
                leading-7
                md:text-base
              "
              style={{
                color:
                  "color-mix(in srgb, var(--cms-text) 60%, transparent)",
              }}
            >
              Have a question about admissions, academics, school activities
              or anything else? Get in touch with Apex Public School.
            </p>
          </div>
        </Reveal>

        {/* CONTACT CARDS */}
        <div className="mt-14 grid gap-4 lg:grid-cols-2">

          {/* CAMPUS CARD */}
          <Reveal>
            <div
              className="
                rounded-[2rem]
                p-7
                shadow-[0_18px_55px_rgba(16,42,86,0.12)]
                md:p-10
              "
              style={{
                backgroundColor: "var(--cms-section)",
                color: "var(--cms-section-text)",
              }}
            >
              <div
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.28em]
                "
                style={{
                  color:
                    "color-mix(in srgb, var(--cms-section-text) 40%, transparent)",
                }}
              >
                School campus
              </div>

              <div className="mt-12 flex gap-4">
                <div
                  className="
                    grid
                    h-11
                    w-11
                    shrink-0
                    place-items-center
                    rounded-full
                    border
                  "
                  style={{
                    borderColor:
                      "color-mix(in srgb, var(--cms-section-text) 10%, transparent)",
                    backgroundColor:
                      "color-mix(in srgb, var(--cms-section-text) 4%, transparent)",
                    color: "var(--cms-section-text)",
                  }}
                >
                  <MapPin size={17} />
                </div>

                <div>
                  <p
                    className="text-lg font-semibold"
                    style={{
                      color: "var(--cms-section-text)",
                    }}
                  >
                    Apex Public School
                  </p>

                  <p
                    className="
                      mt-3
                      max-w-md
                      text-sm
                      leading-7
                    "
                    style={{
                      color:
                        "color-mix(in srgb, var(--cms-section-text) 60%, transparent)",
                    }}
                  >
                    Apex Road, B-Block, Sant Nagar,
                    <br />
                    Burari, Delhi – 110084
                  </p>
                </div>
              </div>

              {/* MAP BUTTON */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=Apex+Public+School+Burari+Delhi"
                target="_blank"
                rel="noreferrer"
                aria-label="Open Apex Public School in Google Maps"
                className="
                  group
                  mt-9
                  inline-flex
                  items-center
                  gap-3
                  rounded-full
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  shadow-[0_8px_24px_rgba(0,0,0,0.16)]
                  ring-1
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_14px_32px_rgba(0,0,0,0.22)]
                "
                style={{
                  backgroundColor: "var(--cms-button)",
                  color: "var(--cms-button-text)",
                  borderColor:
                    "color-mix(in srgb, var(--cms-section-text) 10%, transparent)",
                }}
              >
                <span
                  style={{
                    color: "var(--cms-button-text)",
                  }}
                >
                  Open in Maps
                </span>

                <span
                  className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    transition-transform
                    duration-300
                    group-hover:-translate-y-0.5
                    group-hover:translate-x-0.5
                  "
                  style={{
                    backgroundColor: "var(--cms-primary)",
                  }}
                >
                  <ArrowUpRight
                    size={14}
                    strokeWidth={2.4}
                    style={{
                      color: "var(--cms-button-text)",
                    }}
                  />
                </span>
              </a>
            </div>
          </Reveal>

          {/* PHONE + EMAIL */}
          <Reveal>
            <div className="grid gap-4 sm:grid-cols-2">

              {/* PHONE CARD */}
              <a
                href="tel:09990061747"
                className="
                  group
                  rounded-[2rem]
                  border
                  p-7
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  md:p-8
                "
                style={{
                  backgroundColor: "var(--cms-card)",
                  color: "var(--cms-card-text)",
                  borderColor: "var(--cms-card-border)",
                }}
              >
                <div
                  className="
                    grid
                    h-11
                    w-11
                    place-items-center
                    rounded-full
                    border
                    transition
                    duration-300
                    group-hover:bg-[var(--cms-primary)]
                    group-hover:text-white
                  "
                  style={{
                    borderColor: "var(--cms-card-border)",
                    color: "var(--cms-primary)",
                  }}
                >
                  <Phone
                    size={17}
                    className="transition-colors duration-300 group-hover:text-white"
                  />
                </div>

                <p
                  className="
                    mt-12
                    text-[9px]
                    uppercase
                    tracking-[0.25em]
                  "
                  style={{
                    color:
                      "color-mix(in srgb, var(--cms-card-text) 45%, transparent)",
                  }}
                >
                  Phone
                </p>

                <p
                  className="
                    mt-3
                    text-xl
                    font-semibold
                    tracking-tight
                  "
                  style={{
                    color: "var(--cms-card-text)",
                  }}
                >
                  09990061747
                </p>

                <span
                  className="
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    text-xs
                    font-semibold
                  "
                  style={{
                    color: "var(--cms-card-text)",
                  }}
                >
                  Call the school

                  <ArrowUpRight
                    size={13}
                    className="
                      transition-transform
                      duration-300
                      group-hover:-translate-y-0.5
                      group-hover:translate-x-0.5
                    "
                  />
                </span>
              </a>

              {/* EMAIL CARD */}
              <a
                href="mailto:contacts.apexschool@gmail.com"
                className="
                  group
                  rounded-[2rem]
                  border
                  p-7
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  md:p-8
                "
                style={{
                  backgroundColor: "var(--cms-card)",
                  color: "var(--cms-card-text)",
                  borderColor: "var(--cms-card-border)",
                }}
              >
                <div
                  className="
                    grid
                    h-11
                    w-11
                    place-items-center
                    rounded-full
                    border
                    transition
                    duration-300
                    group-hover:bg-[var(--cms-primary)]
                    group-hover:text-white
                  "
                  style={{
                    borderColor: "var(--cms-card-border)",
                    color: "var(--cms-primary)",
                  }}
                >
                  <Mail
                    size={17}
                    className="transition-colors duration-300 group-hover:text-white"
                  />
                </div>

                <p
                  className="
                    mt-12
                    text-[9px]
                    uppercase
                    tracking-[0.25em]
                  "
                  style={{
                    color:
                      "color-mix(in srgb, var(--cms-card-text) 45%, transparent)",
                  }}
                >
                  Email
                </p>

                <p
                  className="
                    mt-3
                    break-all
                    text-sm
                    font-semibold
                  "
                  style={{
                    color: "var(--cms-card-text)",
                  }}
                >
                  contacts.apexschool@gmail.com
                </p>

                <span
                  className="
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    text-xs
                    font-semibold
                  "
                  style={{
                    color: "var(--cms-card-text)",
                  }}
                >
                  Send an email

                  <ArrowUpRight
                    size={13}
                    className="
                      transition-transform
                      duration-300
                      group-hover:-translate-y-0.5
                      group-hover:translate-x-0.5
                    "
                  />
                </span>
              </a>

            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}