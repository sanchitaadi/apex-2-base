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
    useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

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
          href: "/online-registration",
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
    <footer
      style={{
        backgroundColor: "var(--cms-footer)",
        color: "var(--cms-white)",
      }}
    >
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
                "
                style={{
                  backgroundColor: "var(--cms-background)",
                }}
              >
                <Image
                  src={siteSettings.logo_url}
                  alt={`${siteSettings.school_name} logo`}
                  fill
                  sizes="64px"
                  className="object-contain p-2"
                />
              </div>

              <div>
                <div
                  className="
                    text-[16px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                  "
                  style={{
                    color: "var(--cms-white)",
                  }}
                >
                  {siteSettings.school_name}
                </div>

                <div
                  className="
                    mt-2
                    text-[8px]
                    uppercase
                    tracking-[0.28em]
                  "
                  style={{
                    color:
                      "color-mix(in srgb, var(--cms-white) 45%, transparent)",
                  }}
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
              "
              style={{
                color:
                  "color-mix(in srgb, var(--cms-white) 50%, transparent)",
              }}
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
                  transition
                "
                style={{
                  color:
                    "color-mix(in srgb, var(--cms-white) 55%, transparent)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color =
                    "var(--cms-white)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    "color-mix(in srgb, var(--cms-white) 55%, transparent)";
                }}
              >
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 transition"
                  style={{
                    color:
                      "color-mix(in srgb, var(--cms-white) 40%, transparent)",
                  }}
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
                  transition
                "
                style={{
                  color:
                    "color-mix(in srgb, var(--cms-white) 55%, transparent)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color =
                    "var(--cms-white)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    "color-mix(in srgb, var(--cms-white) 55%, transparent)";
                }}
              >
                <Phone
                  size={16}
                  className="shrink-0 transition"
                  style={{
                    color:
                      "color-mix(in srgb, var(--cms-white) 40%, transparent)",
                  }}
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
                  transition
                "
                style={{
                  color:
                    "color-mix(in srgb, var(--cms-white) 55%, transparent)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color =
                    "var(--cms-white)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    "color-mix(in srgb, var(--cms-white) 55%, transparent)";
                }}
              >
                <Mail
                  size={16}
                  className="shrink-0 transition"
                  style={{
                    color:
                      "color-mix(in srgb, var(--cms-white) 40%, transparent)",
                  }}
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
                  "
                  style={{
                    color:
                      "color-mix(in srgb, var(--cms-white) 30%, transparent)",
                  }}
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
                        transition
                      "
                      style={{
                        color:
                          "color-mix(in srgb, var(--cms-white) 65%, transparent)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color =
                          "var(--cms-white)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color =
                          "color-mix(in srgb, var(--cms-white) 65%, transparent)";
                      }}
                    >
                      <span>
                        {item.label}
                      </span>

                      <ArrowUpRight
                        size={12}
                        className="transition"
                        style={{
                          color:
                            "color-mix(in srgb, var(--cms-white) 25%, transparent)",
                        }}
                      />
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
            pt-6
          "
          style={{
            borderColor:
              "color-mix(in srgb, var(--cms-white) 10%, transparent)",
          }}
        >
          <div
            className="
              flex
              flex-col
              gap-5
              text-[9px]
              uppercase
              tracking-[0.16em]
              md:flex-row
              md:items-center
              md:justify-between
            "
            style={{
              color:
                "color-mix(in srgb, var(--cms-white) 30%, transparent)",
            }}
          >

            {/* COPYRIGHT */}

            <div>
              © {new Date().getFullYear()}{" "}
              {siteSettings.school_name}
            </div>

            {/* LINKS */}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">

              <Link
                href="/mandatory-disclosure"
                className="transition"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color =
                    "var(--cms-white)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    "color-mix(in srgb, var(--cms-white) 30%, transparent)";
                }}
              >
                Mandatory Disclosure
              </Link>

              <Link
                href="/privacy"
                className="transition"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color =
                    "var(--cms-white)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    "color-mix(in srgb, var(--cms-white) 30%, transparent)";
                }}
              >
                Privacy
              </Link>

              <Link
                href="/contact"
                className="transition"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color =
                    "var(--cms-white)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    "color-mix(in srgb, var(--cms-white) 30%, transparent)";
                }}
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
                  px-3.5
                  py-2
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                "
                style={{
                  borderColor:
                    "color-mix(in srgb, var(--cms-white) 15%, transparent)",
                  backgroundColor:
                    "color-mix(in srgb, var(--cms-white) 3.5%, transparent)",
                  color:
                    "color-mix(in srgb, var(--cms-white) 60%, transparent)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    "color-mix(in srgb, var(--cms-white) 25%, transparent)";

                  e.currentTarget.style.backgroundColor =
                    "color-mix(in srgb, var(--cms-white) 10%, transparent)";

                  e.currentTarget.style.color =
                    "var(--cms-white)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    "color-mix(in srgb, var(--cms-white) 15%, transparent)";

                  e.currentTarget.style.backgroundColor =
                    "color-mix(in srgb, var(--cms-white) 3.5%, transparent)";

                  e.currentTarget.style.color =
                    "color-mix(in srgb, var(--cms-white) 60%, transparent)";
                }}
              >
                <ShieldCheck
                  size={11}
                  style={{
                    color:
                      "color-mix(in srgb, var(--cms-white) 45%, transparent)",
                  }}
                />

                <span>
                  Admin Login
                </span>

                <ArrowUpRight
                  size={11}
                  style={{
                    color:
                      "color-mix(in srgb, var(--cms-white) 35%, transparent)",
                  }}
                />
              </Link>

              {/* =================================================
                  ORIGINAL WEBSITE
              ================================================== */}

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
                "
                onMouseEnter={(e) => {
                  e.currentTarget.style.color =
                    "var(--cms-white)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    "color-mix(in srgb, var(--cms-white) 30%, transparent)";
                }}
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