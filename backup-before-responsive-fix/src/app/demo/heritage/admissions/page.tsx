"use client";

import Link from "next/link";
import HeritageHeader from "@/components/demo/heritage/HeritageHeader";
import HeritageFooter from "@/components/demo/heritage/HeritageFooter";

const steps = [
  ["01", "Explore", "Learn about the school, academics and campus."],
  ["02", "Enquire", "Connect with the admissions team for guidance."],
  ["03", "Apply", "Complete the application process."],
  ["04", "Join Apex", "Begin your journey with our school community."],
];

export default function AdmissionsPage() {
  return (
    <main className="min-h-screen bg-[#F7F1E8] text-[#551B2A]">
      <HeritageHeader />

      <section className="bg-[#551B2A] !text-[#F7F1E8] px-5 py-28 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs tracking-[0.35em] text-[#C5A15B]">
            ADMISSIONS
          </p>
          <h1 className="mt-5 max-w-4xl font-serif text-6xl md:text-8xl">
            Begin your journey.
          </h1>
          <p className="mt-7 max-w-2xl leading-8 text-white/65">
            Discover the Apex experience and learn more about joining our
            learning community.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
        <p className="text-xs font-bold tracking-[0.3em] text-[#C5A15B]">
          THE PROCESS
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-4">
          {steps.map(([number, title, text]) => (
            <div
              key={number}
              className="border border-[#551B2A]/15 p-7"
            >
              <span className="text-sm text-[#C5A15B]">{number}</span>
              <h2 className="mt-20 font-serif text-3xl">{title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#EDE2D0] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold tracking-[0.3em] text-[#C5A15B]">
            HAVE QUESTIONS?
          </p>

          <h2 className="mt-5 font-serif text-5xl">
            Talk to our admissions team.
          </h2>

          <Link
            href="/demo/heritage/contact"
            className="mt-8 inline-block bg-[#551B2A] !text-[#F7F1E8] px-8 py-4 text-sm font-bold text-white !text-[#F7F1E8]"
          >
            Contact Admissions
          </Link>
        </div>
      </section>

      <HeritageFooter />
    </main>
  );
}


