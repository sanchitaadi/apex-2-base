"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

import { supabase } from "@/lib/supabase/browser";

type AdmissionSettings = {
  session_year: string;
  status: string | null;

  section_label: string | null;
  status_label: string | null;

  headline: string | null;
  description: string | null;

  classes_open: string | null;
  class_xi_status: string | null;

  intake_label: string | null;
  classes_label: string | null;
  class_xi_label: string | null;
  important_info_label: string | null;

  primary_button_label: string | null;
  secondary_button_label: string | null;

  application_url: string | null;
  admission_notice_url: string | null;
  fee_structure_url: string | null;
  admission_criteria_url: string | null;

  important_dates: string | null;

  phone: string | null;
  email: string | null;

  is_active?: boolean;
};

const fallback: AdmissionSettings = {
  session_year: "2026-2027",

  status: "Admissions Open",

  section_label: "Admissions",
  status_label: "Admissions Open",

  headline: "Begin your journey at Apex.",

  description:
    "Admissions are currently open for the 2026â€“2027 academic session.",

  classes_open: "Classes I â€“ IX",

  class_xi_status:
    "Class XI dates will be announced later.",

  intake_label: "Current intake",

  classes_label:
    "Classes currently open",

  class_xi_label:
    "Class XI",

  important_info_label:
    "Important information",

  primary_button_label:
    "Explore Admissions",

  secondary_button_label:
    "Admission notice",

  application_url:
  "/online-registration",

  admission_notice_url:
    "/admission-notice",

  fee_structure_url:
    "/fee-structure",

  admission_criteria_url:
    "/admission-criteria",

  important_dates:
    "Classes Iâ€“IX: Admissions Open. Class XI: Dates to be announced.",

  phone:
    "09990061747",

  email:
    "contacts.apexschool@gmail.com",
};

export default function AdmissionsCTA() {
  const [admission, setAdmission] =
    useState<AdmissionSettings>(fallback);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadAdmissions() {
      const { data, error } = await supabase
        .from("admission_settings")
        .select("*")
        .eq("is_active", true)
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (!mounted) return;

      if (error) {
        console.error(
          "Admissions load failed:",
          {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          }
        );

        setLoading(false);
        return;
      }

      if (data) {
        setAdmission({
          ...fallback,
          ...data,
        });
      }

      setLoading(false);
    }

    void loadAdmissions();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      className="
        bg-[#F5F0E6]
        scroll-mt-36
      "
    >
      <div
        className="
          mx-auto
          max-w-[1500px]
          px-6
          py-20
          md:px-10
          md:py-28
          lg:px-14
        "
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
          }}
          className="
            overflow-hidden
            rounded-[2rem]
            bg-[#102A56]
            text-white
            shadow-[0_18px_60px_rgba(16,42,86,0.10)]
          "
        >
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">

            {/* =================================================
                LEFT â€” ADMISSIONS CONTENT
            ================================================== */}

            <div className="p-7 md:p-10 lg:p-14">

              {/* SECTION LABEL */}

              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.28em]
                  !text-white/40
                "
              >
                {admission.section_label ||
                  fallback.section_label}{" "}
                {admission.session_year}
              </p>

              {/* STATUS */}

              <div
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-emerald-300/15
                  bg-emerald-300/10
                  px-3
                  py-1.5
                  text-[9px]
                  uppercase
                  tracking-[0.15em]
                  !text-emerald-200
                "
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-emerald-300
                  "
                />

                <span className="!text-emerald-200">
                  {admission.status_label ||
                    admission.status ||
                    fallback.status_label}
                </span>
              </div>

              {/* HEADLINE */}

              <h2
                className="
                  mt-8
                  max-w-3xl
                  text-4xl
                  font-semibold
                  leading-[0.93]
                  tracking-[-0.055em]
                  !text-white
                  md:text-6xl
                "
              >
                {admission.headline ||
                  fallback.headline}
              </h2>

              {/* DESCRIPTION */}

              <p
                className="
                  mt-6
                  max-w-2xl
                  text-base
                  leading-7
                  !text-white/60
                  md:text-lg
                "
              >
                {admission.description ||
                  fallback.description}
              </p>

              {/* BUTTONS */}

              <div className="mt-8 flex flex-wrap gap-3">

                {/* PRIMARY */}

<Link
  href={admission.application_url ?? fallback.application_url ?? "/online-registration"}
                  style={{
                    backgroundColor:
                      "#FFFDF8",
                    color: "#102A56",
                  }}
                  className="
                    group
                    inline-flex
                    items-center
                    gap-3
                    rounded-full
                    px-6
                    py-3.5
                    text-sm
                    font-semibold
                    shadow-[0_10px_30px_rgba(0,0,0,0.18)]
                    ring-1
                    ring-white/10
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-white
                    hover:shadow-[0_16px_36px_rgba(0,0,0,0.24)]
                  "
                >
                  <span
                    style={{
                      color: "#102A56",
                    }}
                    className="!text-[#102A56]"
                  >
                    {admission.primary_button_label ||
                      fallback.primary_button_label}
                  </span>

                  <span
                    style={{
                      backgroundColor:
                        "#102A56",
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
                      group-hover:translate-x-0.5
                    "
                  >
                    <ArrowRight
                      size={14}
                      strokeWidth={2.4}
                      style={{
                        color: "#FFFDF8",
                      }}
                      className="!text-[#FFFDF8]"
                    />
                  </span>
                </Link>

                {/* SECONDARY */}

                {admission.admission_notice_url && (
                  <Link
                    href={
                      admission.admission_notice_url
                    }
                    className="
                      group
                      inline-flex
                      items-center
                      gap-3
                      rounded-full
                      border
                      border-white/20
                      bg-white/[0.035]
                      px-6
                      py-3.5
                      text-sm
                      font-medium
                      !text-white
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:bg-white/[0.09]
                      hover:!text-white
                    "
                  >
                    <span className="!text-white">
                      {admission.secondary_button_label ||
                        fallback.secondary_button_label}
                    </span>

                    <span
                      className="
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/15
                        !text-white
                      "
                    >
                      <ArrowRight
                        size={13}
                        className="!text-white"
                      />
                    </span>
                  </Link>
                )}

              </div>
            </div>

            {/* =================================================
                RIGHT â€” CURRENT INTAKE
            ================================================== */}

            <div
              className="
                border-t
                border-white/10
                bg-white/[0.035]
                p-7
                md:p-10
                lg:border-l
                lg:border-t-0
                lg:p-14
              "
            >

              <p
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.25em]
                  !text-white/35
                "
              >
                {admission.intake_label ||
                  fallback.intake_label}
              </p>

              <div className="mt-8">

                {/* CLASSES */}

                <div className="flex items-start gap-4">

                  <div
                    className="
                      grid
                      h-9
                      w-9
                      shrink-0
                      place-items-center
                      rounded-full
                      bg-white/[0.06]
                      !text-emerald-200
                    "
                  >
                    <Check
                      size={16}
                      className="!text-emerald-200"
                    />
                  </div>

                  <div>

                    <p
                      className="
                        text-sm
                        font-medium
                        !text-white/90
                      "
                    >
                      {admission.classes_label ||
                        fallback.classes_label}
                    </p>

                    <p
                      className="
                        mt-2
                        text-base
                        !text-white/50
                      "
                    >
                      {admission.classes_open ||
                        fallback.classes_open}
                    </p>

                  </div>
                </div>

                {/* CLASS XI */}

                <div className="mt-7 flex items-start gap-4">

                  <div
                    className="
                      grid
                      h-9
                      w-9
                      shrink-0
                      place-items-center
                      rounded-full
                      bg-white/[0.06]
                      !text-white/60
                    "
                  >
                    <Check
                      size={16}
                      className="!text-white/60"
                    />
                  </div>

                  <div>

                    <p
                      className="
                        text-sm
                        font-medium
                        !text-white/90
                      "
                    >
                      {admission.class_xi_label ||
                        fallback.class_xi_label}
                    </p>

                    <p
                      className="
                        mt-2
                        text-base
                        !text-white/50
                      "
                    >
                      {admission.class_xi_status ||
                        fallback.class_xi_status}
                    </p>

                  </div>
                </div>

                {/* IMPORTANT INFORMATION */}

                {admission.important_dates && (
                  <div
                    className="
                      mt-7
                      border-t
                      border-white/10
                      pt-6
                    "
                  >
                    <p
                      className="
                        text-[9px]
                        uppercase
                        tracking-[0.2em]
                        !text-white/35
                      "
                    >
                      {admission.important_info_label ||
                        fallback.important_info_label}
                    </p>

                    <p
                      className="
                        mt-3
                        text-sm
                        leading-7
                        !text-white/50
                      "
                    >
                      {admission.important_dates}
                    </p>
                  </div>
                )}

              </div>
            </div>

          </div>
        </motion.div>

        {/* LOADING */}

        {loading && (
          <div
            className="
              mt-3
              flex
              justify-end
              text-[9px]
              uppercase
              tracking-[0.15em]
              !text-[#102A56]/30
            "
          >
            <Loader2
              size={12}
              className="mr-2 animate-spin"
            />

            Updating
          </div>
        )}

      </div>
    </section>
  );
}

