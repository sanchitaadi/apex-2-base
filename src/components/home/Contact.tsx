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
      className="
        scroll-mt-36
        bg-[#FFFDF8]
        text-[#10203A]
      "
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
        {/* =================================================
            HEADER
        ================================================== */}

        <Reveal>
          <div className="grid gap-12 lg:grid-cols-[1fr_.7fr] lg:items-end">

            <div>
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.3em]
                  !text-[#102A56]/45
                "
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
                  !text-[#102A56]
                  md:text-7xl
                  lg:text-[6vw]
                "
              >
                Come visit
                <br />
                <span className="!text-[#102A56]/30">
                  Apex.
                </span>
              </h2>
            </div>

            <p
              className="
                max-w-md
                text-sm
                leading-7
                !text-[#10203A]/60
                md:text-base
              "
            >
              Have a question about admissions, academics, school activities
              or anything else? Get in touch with Apex Public School.
            </p>

          </div>
        </Reveal>

        {/* =================================================
            CONTACT CARDS
        ================================================== */}

        <div className="mt-14 grid gap-4 lg:grid-cols-2">

          {/* =================================================
              CAMPUS
          ================================================== */}

          <Reveal>
            <div
              className="
                rounded-[2rem]
                bg-[#102A56]
                p-7
                !text-white
                shadow-[0_18px_55px_rgba(16,42,86,0.12)]
                md:p-10
              "
            >
              <div
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.28em]
                  !text-white/40
                "
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
                    border-white/10
                    bg-white/[0.04]
                    !text-white
                  "
                >
                  <MapPin size={17} />
                </div>

                <div>
                  <p
                    className="
                      text-lg
                      font-semibold
                      !text-white
                    "
                  >
                    Apex Public School
                  </p>

                  <p
                    className="
                      mt-3
                      max-w-md
                      text-sm
                      leading-7
                      !text-white/60
                    "
                  >
                    Apex Road, B-Block, Sant Nagar,
                    <br />
                    Burari, Delhi – 110084
                  </p>
                </div>

              </div>

              {/* =================================================
                  FIXED MAP BUTTON
              ================================================== */}

              <a
                href="https://www.google.com/maps/search/?api=1&query=Apex+Public+School+Burari+Delhi"
                target="_blank"
                rel="noreferrer"
                aria-label="Open Apex Public School in Google Maps"
                style={{
                  backgroundColor: "#F5F0E6",
                  color: "#102A56",
                }}
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
                  ring-white/10
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-white
                  hover:shadow-[0_14px_32px_rgba(0,0,0,0.22)]
                "
              >
                <span
                  style={{
                    color: "#102A56",
                  }}
                  className="!text-[#102A56]"
                >
                  Open in Maps
                </span>

                <span
                  style={{
                    backgroundColor: "#102A56",
                  }}
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
                >
                  <ArrowUpRight
                    size={14}
                    strokeWidth={2.4}
                    style={{
                      color: "#F5F0E6",
                    }}
                    className="!text-[#F5F0E6]"
                  />
                </span>
              </a>
            </div>
          </Reveal>

          {/* =================================================
              PHONE + EMAIL
          ================================================== */}

          <Reveal>
            <div className="grid gap-4 sm:grid-cols-2">

              {/* PHONE */}

              <a
                href="tel:09990061747"
                className="
                  group
                  rounded-[2rem]
                  border
                  border-[#102A56]/10
                  bg-[#F5F0E6]
                  p-7
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-white
                  hover:shadow-[0_14px_35px_rgba(16,42,86,0.10)]
                  md:p-8
                "
              >
                <div
                  className="
                    grid
                    h-11
                    w-11
                    place-items-center
                    rounded-full
                    border
                    border-[#102A56]/10
                    !text-[#102A56]
                    transition
                    duration-300
                    group-hover:bg-[#102A56]
                    group-hover:!text-white
                  "
                >
                  <Phone
                    size={17}
                    className="!text-[#102A56] group-hover:!text-white"
                  />
                </div>

                <p
                  className="
                    mt-12
                    text-[9px]
                    uppercase
                    tracking-[0.25em]
                    !text-[#102A56]/45
                  "
                >
                  Phone
                </p>

                <p
                  className="
                    mt-3
                    text-xl
                    font-semibold
                    tracking-tight
                    !text-[#102A56]
                  "
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
                    !text-[#102A56]
                  "
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

              {/* EMAIL */}

              <a
                href="mailto:contacts.apexschool@gmail.com"
                className="
                  group
                  rounded-[2rem]
                  border
                  border-[#102A56]/10
                  bg-[#F5F0E6]
                  p-7
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-white
                  hover:shadow-[0_14px_35px_rgba(16,42,86,0.10)]
                  md:p-8
                "
              >
                <div
                  className="
                    grid
                    h-11
                    w-11
                    place-items-center
                    rounded-full
                    border
                    border-[#102A56]/10
                    !text-[#102A56]
                    transition
                    duration-300
                    group-hover:bg-[#102A56]
                    group-hover:!text-white
                  "
                >
                  <Mail
                    size={17}
                    className="!text-[#102A56] group-hover:!text-white"
                  />
                </div>

                <p
                  className="
                    mt-12
                    text-[9px]
                    uppercase
                    tracking-[0.25em]
                    !text-[#102A56]/45
                  "
                >
                  Email
                </p>

                <p
                  className="
                    mt-3
                    break-all
                    text-sm
                    font-semibold
                    !text-[#102A56]
                  "
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
                    !text-[#102A56]
                  "
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