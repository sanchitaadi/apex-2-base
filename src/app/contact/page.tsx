"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Clock3,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Loader2,
} from "lucide-react";

import {
  DEFAULT_SITE_SETTINGS,
  type SiteSettings,
} from "@/lib/supabase/site-settings";

import { supabase } from "@/lib/supabase/browser";

/* =========================================================
   TYPES
========================================================= */

type ContactSettings = {
  id?: string;

  hero_label: string;
  hero_title: string;
  hero_description: string;

  location_label: string;
  location_description: string;

  phone_label: string;
  phone_description: string;

  email_label: string;
  email_description: string;

  form_label: string;
  form_title: string;
  form_description: string;

  enquiries_title: string;
  enquiries_description: string;

  general_title: string;
  general_description: string;

  closing_title: string;
  closing_description: string;

  updated_at?: string;
};

/* =========================================================
   DEFAULT CONTACT CONTENT
========================================================= */

const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  hero_label: "Contact Apex",
  hero_title: "Let's stay connected.",
  hero_description:
    "Whether you are a parent, student, prospective family or member of the Apex community, we are here to help.",

  location_label: "Our location",
  location_description:
    "Visit the Apex Public School campus for admissions, enquiries and school-related information.",

  phone_label: "Contact us",
  phone_description:
    "Call the school for admissions, general enquiries and important school-related information.",

  email_label: "Write some words",
  email_description:
    "Send us your question, enquiry or message and the school team can get back to you.",

  form_label: "Write to Apex",
  form_title: "Tell us what you need.",
  form_description:
    "Use the form to send a message to the school.",

  enquiries_title: "School enquiries",
  enquiries_description:
    "Contact the school during working hours.",

  general_title: "General enquiries",
  general_description:
    "Admissions, academics and school information.",

  closing_title: "Questions, ideas or enquiries?",
  closing_description:
    "We're here to hear from you.",
};

/* =========================================================
   REVEAL ANIMATION
========================================================= */

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 28,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-70px",
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const [siteSettings, setSiteSettings] =
    useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  const [contactSettings, setContactSettings] =
    useState<ContactSettings>(DEFAULT_CONTACT_SETTINGS);

  const [loadingSettings, setLoadingSettings] = useState(true);

  /* =======================================================
     LOAD SETTINGS FROM SUPABASE
  ======================================================= */

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        /* -----------------------------------------------
           GLOBAL SITE SETTINGS
        ------------------------------------------------ */

        const { data: siteData, error: siteError } = await supabase
          .from("site_settings")
          .select("setting_value")
          .eq("setting_key", "global")
          .limit(1)
          .maybeSingle();

        if (!active) return;

        if (!siteError && siteData?.setting_value) {
          setSiteSettings({
            ...DEFAULT_SITE_SETTINGS,
            ...(siteData.setting_value as Partial<SiteSettings>),
          });
        }

        /* -----------------------------------------------
           CONTACT PAGE SETTINGS
        ------------------------------------------------ */

        const {
          data: contactData,
          error: contactError,
        } = await supabase
          .from("contact_settings")
          .select("*")
          .limit(1)
          .maybeSingle();

        if (!active) return;

        if (!contactError && contactData) {
          setContactSettings({
            ...DEFAULT_CONTACT_SETTINGS,
            ...contactData,
          });
        }
      } catch (error) {
        console.error("Contact settings load failed:", error);
      } finally {
        if (active) {
          setLoadingSettings(false);
        }
      }
    }

    void loadSettings();

    return () => {
      active = false;
    };
  }, []);

  /* =======================================================
     FORM
  ======================================================= */

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSent(true);

    setTimeout(() => {
      setSent(false);
    }, 4000);
  }

  /* =======================================================
     MAP URL
  ======================================================= */

  const mapsUrl =
    siteSettings.maps_url ||
    "https://www.google.com/maps/search/?api=1&query=Apex+Public+School,+Apex+Road,+B-Block,+Sant+Nagar,+Burari,+Delhi+110084";

  const mapEmbedUrl =
    "https://www.google.com/maps?q=Apex+Public+School,+Apex+Road,+B-Block,+Sant+Nagar,+Burari,+Delhi+110084&output=embed";

  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F0E6] text-[#10203A]">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#071A38] text-white">
        {/* Ambient glow */}

        <div className="pointer-events-none absolute -right-48 -top-48 h-[700px] w-[700px] rounded-full bg-[#76AFE7]/10 blur-[150px]" />

        {/* Technical grid */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.045]
            [background-image:linear-gradient(rgba(255,255,255,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.2)_1px,transparent_1px)]
            [background-size:80px_80px]
          "
        />

        <div className="relative z-10 mx-auto max-w-[1500px] px-6 pb-20 pt-36 md:px-10 md:pb-28 md:pt-44 lg:px-14 lg:pb-32">
          <Reveal>
            <div className="max-w-5xl">
              <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#F5F0E6]/45">
                <span className="h-px w-8 bg-[#F5F0E6]/30" />
                {loadingSettings
                  ? "Contact Apex"
                  : contactSettings.hero_label}
              </div>

              <h1 className="mt-7 text-5xl font-semibold leading-[0.87] tracking-[-0.07em] md:text-7xl lg:text-[7vw]">
                {contactSettings.hero_title}
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-7 text-white/55 md:text-lg">
                {contactSettings.hero_description}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-14 grid border-t border-white/10 pt-6 md:grid-cols-3">
              {/* CBSE */}

              <div>
                <div className="text-2xl font-semibold">
                  {siteSettings.cbse_code}
                </div>

                <div className="mt-1 text-[9px] uppercase tracking-[0.22em] text-white/30">
                  CBSE Code
                </div>
              </div>

              {/* LOCATION */}

              <div className="mt-5 border-white/10 md:mt-0 md:border-l md:pl-7">
                <div className="text-2xl font-semibold">
                  Delhi
                </div>

                <div className="mt-1 text-[9px] uppercase tracking-[0.22em] text-white/30">
                  Burari Campus
                </div>
              </div>

              {/* PHONE */}

              <div className="mt-5 border-white/10 md:mt-0 md:border-l md:pl-7">
                <div className="text-2xl font-semibold">
                  {siteSettings.phone}
                </div>

                <div className="mt-1 text-[9px] uppercase tracking-[0.22em] text-white/30">
                  School phone
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =====================================================
          CONTACT CARDS
      ===================================================== */}

      <section className="bg-[#F5F0E6]">
        <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14 lg:py-32">
          <Reveal>
            <div className="mb-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#102A56]/40">
                Get in touch
              </p>

              <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.055em] text-[#102A56] md:text-6xl">
                Find the right
                <br />
                <span className="text-[#102A56]/30">
                  way to reach us.
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-4 lg:grid-cols-3">
            {/* =================================================
                LOCATION
            ================================================== */}

            <Reveal delay={0.03}>
              <article className="group relative min-h-[310px] overflow-hidden rounded-[2rem] border border-[#102A56]/10 bg-[#102A56] p-7 text-white transition duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(16,42,86,0.18)] md:p-9">
                <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#85B9EC]/10 blur-[70px] transition duration-700 group-hover:bg-[#85B9EC]/20" />

                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-white/30">
                      01
                    </span>

                    <div className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.05] transition duration-500 group-hover:scale-110 group-hover:bg-white/[0.08]">
                      <MapPin
                        size={18}
                        strokeWidth={1.6}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-[0.25em] text-[#F5F0E6]/45">
                      {contactSettings.location_label}
                    </p>

                    <h3 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">
                      {siteSettings.school_name}
                    </h3>

                    <p className="mt-4 max-w-sm whitespace-pre-line text-sm leading-7 text-white/50">
                      {siteSettings.address}
                    </p>

                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-[#F5F0E6]/80 transition hover:text-white"
                    >
                      Open location
                      <ArrowRight size={14} />
                    </a>

                    <p className="mt-4 max-w-sm text-xs leading-6 text-white/35">
                      {contactSettings.location_description}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>

            {/* =================================================
                PHONE
            ================================================== */}

            <Reveal delay={0.08}>
              <article className="group relative min-h-[310px] overflow-hidden rounded-[2rem] border border-[#102A56]/10 bg-white/[0.55] p-7 transition duration-500 hover:-translate-y-2 hover:bg-white md:p-9">
                <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#102A56]/[0.035] blur-[70px]" />

                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#102A56]/25">
                      02
                    </span>

                    <div className="grid h-11 w-11 place-items-center rounded-full border border-[#102A56]/10 bg-[#102A56]/[0.035] transition duration-500 group-hover:scale-110 group-hover:bg-[#102A56] group-hover:text-white">
                      <Phone
                        size={18}
                        strokeWidth={1.6}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-[0.25em] text-[#102A56]/40">
                      {contactSettings.phone_label}
                    </p>

                    <h3 className="mt-4 text-2xl font-semibold tracking-[-0.035em] text-[#102A56]">
                      {siteSettings.phone}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-[#10203A]/50">
                      {contactSettings.phone_description}
                    </p>

                    <a
                      href={`tel:${siteSettings.phone}`}
                      className="group/call mt-6 inline-flex items-center gap-2 text-xs font-semibold text-[#102A56]"
                    >
                      Call the school

                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover/call:translate-x-1"
                      />
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>

            {/* =================================================
                EMAIL
            ================================================== */}

            <Reveal delay={0.13}>
              <article className="group relative min-h-[310px] overflow-hidden rounded-[2rem] border border-[#102A56]/10 bg-[#102A56] p-7 text-white transition duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(16,42,86,0.18)] md:p-9">
                <div className="pointer-events-none absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-[#85B9EC]/10 blur-[70px]" />

                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-white/30">
                      03
                    </span>

                    <div className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.05] transition duration-500 group-hover:scale-110">
                      <Mail
                        size={18}
                        strokeWidth={1.6}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-[0.25em] text-[#F5F0E6]/45">
                      {contactSettings.email_label}
                    </p>

                    <a
                      href={`mailto:${siteSettings.email}`}
                      className="mt-4 block break-all text-xl font-semibold tracking-[-0.035em] transition hover:text-[#BCD9FF]"
                    >
                      {siteSettings.email}
                    </a>

                    <p className="mt-4 text-sm leading-7 text-white/50">
                      {contactSettings.email_description}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =====================================================
          FORM + INFORMATION
      ===================================================== */}

      <section className="bg-[#102A56] text-white">
        <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14 lg:py-36">
          <div className="grid gap-14 lg:grid-cols-[0.6fr_1.4fr]">
            {/* LEFT INFO */}

            <Reveal>
              <div className="lg:sticky lg:top-36 lg:self-start">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#F5F0E6]/35">
                  {contactSettings.form_label}
                </p>

                <h2 className="mt-5 text-4xl font-semibold leading-[0.92] tracking-[-0.055em] md:text-6xl">
                  {contactSettings.form_title}
                </h2>

                <p className="mt-7 max-w-md text-sm leading-7 text-white/45">
                  {contactSettings.form_description}
                </p>

                <div className="mt-10 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
                      <Clock3 size={15} />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        {contactSettings.enquiries_title}
                      </p>

                      <p className="mt-1 text-xs text-white/35">
                        {contactSettings.enquiries_description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
                      <MessageSquare size={15} />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        {contactSettings.general_title}
                      </p>

                      <p className="mt-1 text-xs text-white/35">
                        {contactSettings.general_description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* FORM */}

            <Reveal delay={0.08}>
              <form
                onSubmit={handleSubmit}
                className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 md:p-9 lg:p-11"
              >
                <div className="grid gap-0 md:grid-cols-2">
                  {/* NAME */}

                  <div className="border-b border-white/10 md:border-r md:pr-6">
                    <label
                      htmlFor="name"
                      className="block text-[9px] uppercase tracking-[0.2em] text-white/30"
                    >
                      Your name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Enter your name"
                      className="mt-3 w-full bg-transparent pb-5 text-base text-white outline-none placeholder:text-white/20"
                    />
                  </div>

                  {/* EMAIL */}

                  <div className="border-b border-white/10 pt-6 md:pt-0 md:pl-6">
                    <label
                      htmlFor="email"
                      className="block text-[9px] uppercase tracking-[0.2em] text-white/30"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="mt-3 w-full bg-transparent pb-5 text-base text-white outline-none placeholder:text-white/20"
                    />
                  </div>

                  {/* SUBJECT */}

                  <div className="border-b border-white/10 pt-6 md:border-r md:pr-6">
                    <label
                      htmlFor="subject"
                      className="block text-[9px] uppercase tracking-[0.2em] text-white/30"
                    >
                      Subject
                    </label>

                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      placeholder="What is this about?"
                      className="mt-3 w-full bg-transparent pb-5 text-base text-white outline-none placeholder:text-white/20"
                    />
                  </div>

                  {/* PHONE */}

                  <div className="border-b border-white/10 pt-6 md:pl-6">
                    <label
                      htmlFor="phone"
                      className="block text-[9px] uppercase tracking-[0.2em] text-white/30"
                    >
                      Phone
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Optional"
                      className="mt-3 w-full bg-transparent pb-5 text-base text-white outline-none placeholder:text-white/20"
                    />
                  </div>
                </div>

                {/* MESSAGE */}

                <div className="pt-7">
                  <label
                    htmlFor="message"
                    className="block text-[9px] uppercase tracking-[0.2em] text-white/30"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={7}
                    placeholder="Write your message..."
                    className="
                      mt-4
                      w-full
                      resize-none
                      rounded-2xl
                      border
                      border-white/10
                      bg-black/[0.08]
                      p-5
                      text-base
                      leading-7
                      text-white
                      outline-none
                      placeholder:text-white/20
                      transition
                      focus:border-white/25
                      focus:bg-black/[0.12]
                    "
                  />
                </div>

                {/* SUBMIT */}

                <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-md text-xs leading-5 text-white/30">
                    Your message will be used only for responding to
                    your enquiry.
                  </p>

                  <button
                    type="submit"
                    disabled={sent}
                    className="
                      group
                      inline-flex
                      shrink-0
                      items-center
                      justify-center
                      gap-3
                      rounded-full
                      bg-[#F5F0E6]
                      px-7
                      py-4
                      text-sm
                      font-semibold
                      text-[#102A56]
                      transition
                      duration-300
                      hover:-translate-y-1
                      hover:bg-white
                      hover:shadow-[0_15px_35px_rgba(245,240,230,0.12)]
                      disabled:cursor-default
                    "
                  >
                    {sent ? (
                      <>
                        Message ready
                        <Check size={16} />
                      </>
                    ) : (
                      <>
                        Send your message

                        <Send
                          size={15}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =====================================================
          LOCATION + MAP
      ===================================================== */}

      <section className="bg-[#F5F0E6]">
        <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-[#E9E2D5]">
              <div className="grid min-h-[500px] lg:grid-cols-[1fr_1.05fr]">
                {/* LEFT */}

                <div className="flex flex-col justify-between p-7 md:p-10 lg:p-14">
                  <div>
                    <p className="flex items-center gap-2 text-[9px] uppercase tracking-[0.28em] text-[#102A56]/40">
                      <MapPin size={12} />
                      Visit the campus
                    </p>

                    <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[0.95] tracking-[-0.055em] text-[#102A56] md:text-6xl">
                      Find us in
                      <br />
                      <span className="text-[#102A56]/30">
                        Burari, Delhi.
                      </span>
                    </h2>
                  </div>

                  <div className="mt-12">
                    <p className="whitespace-pre-line text-sm leading-7 text-[#10203A]/55">
                      {siteSettings.address}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      {/* MAP */}

                      <a
  href={mapsUrl}
  target="_blank"
  rel="noreferrer"
  className="
    group
    inline-flex
    items-center
    gap-2
    rounded-full
    bg-[#102A56]
    px-5
    py-3.5
    text-sm
    font-semibold
    !text-[#F5F0E6]
    transition
    duration-300
    hover:-translate-y-1
    hover:bg-[#1B3D73]
    hover:shadow-[0_12px_30px_rgba(16,42,86,0.18)]
  "
>
  <span className="!text-[#F5F0E6]">
    Open in Maps
  </span>

  <ArrowRight
    size={15}
    className="
      !text-[#F5F0E6]
      transition-transform
      duration-300
      group-hover:translate-x-1
    "
  />
</a>

                      {/* PHONE */}

                      <a
                        href={`tel:${siteSettings.phone}`}
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-full
                          border
                          border-[#102A56]/15
                          px-5
                          py-3.5
                          text-sm
                          font-semibold
                          text-[#102A56]
                          transition
                          duration-300
                          hover:-translate-y-1
                          hover:bg-white
                        "
                      >
                        <Phone size={14} />
                        Call school
                      </a>
                    </div>
                  </div>
                </div>

                {/* RIGHT MAP */}

                <div className="group relative min-h-[380px] overflow-hidden bg-[#E9E2D5]">
                  <iframe
                    title={`${siteSettings.school_name} Location`}
                    src={mapEmbedUrl}
                    className="
                      absolute
                      inset-0
                      h-full
                      w-full
                      border-0
                      transition-transform
                      duration-700
                      group-hover:scale-[1.015]
                    "
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />

                  {/* Overlay */}

                  <div className="pointer-events-none absolute inset-0 bg-transparent" />

                  {/* Badge */}

                  <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full border border-white/20 bg-[#071A38]/65 px-4 py-2 text-[9px] font-medium uppercase tracking-[0.2em] text-white/85 shadow-[0_8px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8DC7FF] shadow-[0_0_10px_rgba(141,199,255,0.9)]" />

                    Live location
                  </div>

                  {/* Bottom card */}

                  <div className="absolute bottom-5 left-5 right-5 z-10 rounded-2xl border border-white/15 bg-[#071A38]/72 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.2)] backdrop-blur-xl">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {siteSettings.school_name}
                        </p>

                        <p className="mt-1 text-[10px] uppercase tracking-[0.17em] text-white/45">
                          Apex Road · Burari · Delhi
                        </p>
                      </div>

                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${siteSettings.school_name} in Google Maps`}
                        className="
                          group/map
                          grid
                          h-10
                          w-10
                          shrink-0
                          place-items-center
                          rounded-full
                          border
                          border-white/15
                          bg-white/[0.08]
                          text-white
                          transition-all
                          duration-300
                          hover:-translate-y-0.5
                          hover:bg-white/[0.16]
                        "
                      >
                        <ArrowRight
                          size={15}
                          className="
                            -rotate-45
                            transition-transform
                            duration-300
                            group-hover/map:translate-x-0.5
                            group-hover/map:-translate-y-0.5
                          "
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =====================================================
          CLOSING
      ===================================================== */}

      <section className="bg-[#102A56] text-white">
        <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <div className="border-t border-white/10 pt-8">
              <p className="max-w-4xl text-3xl font-semibold leading-[0.98] tracking-[-0.05em] md:text-5xl">
                {contactSettings.closing_title}

                <span className="text-white/30">
                  {" "}
                  {contactSettings.closing_description}
                </span>
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}