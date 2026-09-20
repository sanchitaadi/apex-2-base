"use client";

import HeritageHeader from "@/components/demo/heritage/HeritageHeader";
import HeritageFooter from "@/components/demo/heritage/HeritageFooter";

const facilities = [
  ["01", "Modern Classrooms"],
  ["02", "Science Laboratories"],
  ["03", "Library & Learning Centre"],
  ["04", "Sports Facilities"],
  ["05", "Creative Arts Spaces"],
  ["06", "Technology & Innovation"],
];

export default function CampusPage() {
  return (
    <main className="min-h-screen bg-[#F7F1E8] text-[#551B2A]">
      <HeritageHeader />

      <section className="relative min-h-[620px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=2000&q=90"
          alt="Apex campus"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[#551B2A] !text-[#F7F1E8]/55" />

        <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-end px-5 pb-20 sm:px-8">
          <div className="text-white">
            <p className="text-xs tracking-[0.35em] text-[#C5A15B]">
              OUR CAMPUS
            </p>
            <h1 className="mt-5 max-w-4xl font-serif text-6xl md:text-8xl">
              Space to discover.
            </h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
        <div className="grid gap-14 md:grid-cols-2">
          <h2 className="font-serif text-5xl leading-tight md:text-6xl">
            Every space has a purpose.
          </h2>

          <p className="leading-8 text-slate-600">
            The Apex campus is designed to support different ways of learning,
            collaborating, creating and playing. From academic spaces to
            activity areas, students have opportunities to explore beyond the
            traditional classroom.
          </p>
        </div>

        <div className="mt-20 grid gap-0 border-l border-t border-[#551B2A]/15 md:grid-cols-3">
          {facilities.map(([number, title]) => (
            <div
              key={number}
              className="border-b border-r border-[#551B2A]/15 p-8 md:min-h-[230px]"
            >
              <span className="text-sm text-[#C5A15B]">{number}</span>
              <h3 className="mt-20 font-serif text-2xl">{title}</h3>
            </div>
          ))}
        </div>
      </section>

      <HeritageFooter />
    </main>
  );
}


