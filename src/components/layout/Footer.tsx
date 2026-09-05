"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

import {
  DEFAULT_SITE_SETTINGS,
  type SiteSettings,
} from "@/lib/supabase/site-settings";

import { supabase } from "@/lib/supabase/browser";

export default function Footer() {
  const [siteSettings, setSiteSettings] =
    useState<SiteSettings>(
      DEFAULT_SITE_SETTINGS
    );

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      const { data, error } = await supabase
        .from("site_settings")
        .select("setting_value")
        .eq("setting_key", "global")
        .limit(1)
        .maybeSingle();

      if (!active) return;

      if (!error && data?.setting_value) {
        setSiteSettings({
          ...DEFAULT_SITE_SETTINGS,
          ...(data.setting_value as Partial<SiteSettings>),
        });
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  const footerGroups = [
    {
      title: "Apex",
      links: [
        {
          label: "About Us",
          href: "/about",
        },
        {
          label: "Leadership",
          href: "/faculty",
        },
        {
          label: "Faculty",
          href: "/faculty",
        },
        {
          label: "Activities",
          href: "/activities",
        },
      ],
    },
    {
      title: "Academic",
      links: [
        {
          label: "Academics",
          href: "/academics",
        },
        {
          label: "Syllabus & Datesheet",
          href: "/resources/syllabus-datesheet",
        },
        {
          label: "Results",
          href: "/resources/cbse-results",
        },
        {
          label: "Holiday Homework",
          href: "/resources/holiday-homework",
        },
      ],
    },
    {
      title: "Connect",
      links: [
        {
          label: "Notices",
          href: "/notices",
        },
        {
          label: "Gallery",
          href: "/gallery",
        },
        {
          label: "School TV",
          href: "/school-tv",
        },
        {
          label: "Contact",
          href: "/contact",
        },
      ],
    },
    {
      title: "Information",
      links: [
        {
          label: "Admissions",
          href: "/admissions",
        },
        {
          label: "Fee Structure",
          href: "/resources/fee-structure",
        },
        {
          label: "Virtual Tour",
          href: "/virtual-tour",
        },
        {
          label: "Mandatory Disclosure",
          href: "/mandatory-disclosure",
        },
      ],
    },
  ];

  return (
    <footer className="bg-[#102A56] text-white">

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

        {/* =================================================
            MAIN FOOTER
        ================================================== */}

        <div className="grid gap-14 lg:grid-cols-[1.2fr_1.8fr]">

          {/* =================================================
              BRAND / CONTACT
          ================================================== */}

          <div className="max-w-md">

            {/* LOGO */}

            <Link
              href="/"
              className="inline-flex items-center gap-4"
            >
              <div
                className="
                  relative
                  grid
                  h-16
                  w-16
                  place-items-center
                  overflow-hidden
                  rounded-2xl
                  bg-[#F5F0E6]
                "
              >
                <Image
                  src={siteSettings.logo_url}
                  alt={`${siteSettings.school_name} logo`}
                  fill
                  sizes="64px"
                  className="object-contain p-2 brightness-0"
                />
              </div>

              <div>
                <div
                  className="
                    text-[16px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    !text-white
                  "
                >
                  {siteSettings.school_name}
                </div>

                <div
                  className="
                    mt-2
                    text-[8px]
                    uppercase
                    tracking-[0.28em]
                    !text-white/45
                  "
                >
                  {siteSettings.tagline}
                </div>
              </div>
            </Link>

            {/* DESCRIPTION */}

            <p
              className="
                mt-8
                max-w-md
                text-sm
                leading-7
                !text-white/50
              "
            >
              {siteSettings.footer_description}
            </p>

            {/* CONTACT INFO */}

            <div className="mt-8 space-y-4">

              {/* ADDRESS */}

              <a
                href={siteSettings.maps_url}
                target="_blank"
                rel="noreferrer"
                className="
                  group
                  flex
                  items-start
                  gap-3
                  text-sm
                  !text-white/55
                  transition
                  hover:!text-white
                "
              >
                <MapPin
                  size={17}
                  className="
                    mt-0.5
                    shrink-0
                    !text-white/40
                    transition
                    group-hover:!text-white
                  "
                />

                <span className="leading-6">
                  {siteSettings.address}
                </span>
              </a>

              {/* PHONE */}

              <a
                href={`tel:${siteSettings.phone}`}
                className="
                  group
                  flex
                  items-center
                  gap-3
                  text-sm
                  !text-white/55
                  transition
                  hover:!text-white
                "
              >
                <Phone
                  size={16}
                  className="
                    shrink-0
                    !text-white/40
                    transition
                    group-hover:!text-white
                  "
                />

                {siteSettings.phone}
              </a>

              {/* EMAIL */}

              <a
                href={`mailto:${siteSettings.email}`}
                className="
                  group
                  flex
                  items-center
                  gap-3
                  break-all
                  text-sm
                  !text-white/55
                  transition
                  hover:!text-white
                "
              >
                <Mail
                  size={16}
                  className="
                    shrink-0
                    !text-white/40
                    transition
                    group-hover:!text-white
                  "
                />

                {siteSettings.email}
              </a>

            </div>
          </div>

          {/* =================================================
              LINK GROUPS
          ================================================== */}

          <div
            className="
              grid
              grid-cols-2
              gap-x-8
              gap-y-12
              sm:grid-cols-4
            "
          >

            {footerGroups.map((group) => (
              <div key={group.title}>

                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.24em]
                    !text-white/30
                  "
                >
                  {group.title}
                </p>

                <div className="mt-5 space-y-4">

                  {group.links.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="
                        group
                        flex
                        items-center
                        gap-1
                        text-sm
                        !text-white/65
                        transition
                        hover:!text-white
                      "
                    >
                      <span>
                        {item.label}
                      </span>

                      <ArrowUpRight size={12} className="text-white/25 transition group-hover:text-white" />
                    </Link>
                  ))}

                </div>

              </div>
            ))}

          </div>
        </div>

        {/* =================================================
            BOTTOM BAR
        ================================================== */}

        <div
          className="
            mt-16
            border-t
            border-white/10
            pt-6
          "
        >

          <div
            className="
              flex
              flex-col
              gap-5
              text-[9px]
              uppercase
              tracking-[0.16em]
              !text-white/30
              md:flex-row
              md:items-center
              md:justify-between
            "
          >

            {/* COPYRIGHT */}

            <div>
              Â© {new Date().getFullYear()}{" "}
              {siteSettings.school_name}
            </div>

            {/* LINKS */}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">

              <Link
                href="/mandatory-disclosure"
                className="
                  transition
                  hover:!text-white
                "
              >
                Mandatory Disclosure
              </Link>

              <Link
                href="/privacy"
                className="
                  transition
                  hover:!text-white
                "
              >
                Privacy
              </Link>

              <Link
                href="/contact"
                className="
                  transition
                  hover:!text-white
                "
              >
                Contact
              </Link>

              {/* =================================================
                  ADMIN LOGIN
              ================================================== */}

              <Link
                href="/admin"
                className="
                  group
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/15
                  bg-white/[0.035]
                  px-3.5
                  py-2
                  !text-white/60
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-white/25
                  hover:bg-white/10
                  hover:!text-white
                "
              >
                <ShieldCheck
                  size={11}
                  className="
                    !text-white/45
                    transition
                    group-hover:!text-white
                  "
                />

                <span className="!text-white/60 group-hover:!text-white">
                  Admin Login
                </span>

                <ArrowUpRight
                  size={11}
                  className="
                    !text-white/35
                    transition-transform
                    duration-300
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                    group-hover:!text-white
                  "
                />
              </Link>

              {/* ORIGINAL WEBSITE */}

              <a
                href={siteSettings.website_url}
                target="_blank"
                rel="noreferrer"
                className="
                  group
                  flex
                  items-center
                  gap-1
                  transition
                  hover:!text-white
                "
              >
                Original Website

                <ArrowUpRight
                  size={11}
                  className="
                    transition-transform
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                  "
                />
              </a>

            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
