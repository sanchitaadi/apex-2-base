"use client";

import Link from "next/link";

const designs = [
  {
    title: "Apex Heritage",
    subtitle: "Classic • Prestigious • Timeless",
    path: "/demo/heritage",
    number: "01",
    description:
      "An elegant editorial school website inspired by heritage institutions.",
    className: "bg-[#10263d] text-white",
  },
  {
    title: "Apex International",
    subtitle: "Global • Minimal • Immersive",
    path: "/demo/international",
    number: "02",
    description:
      "A spacious international-school experience built around large visuals.",
    className: "bg-[#e9eef1] text-[#17212b]",
  },
  {
    title: "Apex Innovation",
    subtitle: "Bold • Digital • Future Ready",
    path: "/demo/innovation",
    number: "03",
    description:
      "A technology-focused experience for innovation, STEM and future learning.",
    className: "bg-[#080b14] text-white",
  },
  {
    title: "Apex Creative",
    subtitle: "Youthful • Colorful • Energetic",
    path: "/demo/creative",
    number: "04",
    description:
      "A student-first design focused on activities, creativity and school life.",
    className: "bg-[#fff8ef] text-[#171717]",
  },
];

export default function DemoSelection() {
  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16">
          <p className="text-sm tracking-[0.4em] text-white/40">
            APEX PUBLIC SCHOOL
          </p>

          <h1 className="mt-5 text-5xl font-black md:text-8xl">
            DESIGN
            <br />
            CONCEPTS.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-white/50">
            Four different visual directions for the future Apex Public School
            website.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {designs.map((design) => (
            <Link
              key={design.path}
              href={design.path}
              className={`group min-h-[420px] rounded-[2rem] p-8 transition duration-500 hover:-translate-y-2 md:p-12 ${design.className}`}
            >
              <div className="flex items-start justify-between">
                <span className="text-sm opacity-50">{design.number}</span>

                <span className="text-3xl transition group-hover:translate-x-2">
                  ↗
                </span>
              </div>

              <div className="mt-40">
                <p className="text-xs font-bold uppercase tracking-[0.25em] opacity-50">
                  {design.subtitle}
                </p>

                <h2 className="mt-3 text-4xl font-black md:text-5xl">
                  {design.title}
                </h2>

                <p className="mt-4 max-w-md opacity-60">
                  {design.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-white/30">
          Select a concept to preview the complete website design.
        </p>
      </div>
    </main>
  );
}