"use client";

import HeritageHeader from "@/components/demo/heritage/HeritageHeader";
import HeritageFooter from "@/components/demo/heritage/HeritageFooter";

const stages = [
  ["01", "Foundational Years", "Building curiosity, confidence and strong learning habits."],
  ["02", "Primary School", "Developing core knowledge through exploration and collaboration."],
  ["03", "Middle School", "Encouraging independent thinking, research and discovery."],
  ["04", "Senior School", "Preparing students for higher education and future pathways."],
];

export default function AcademicsPage() {
  return (
    <main className="min-h-screen bg-[#F7F1E8] text-[#551B2A]">
      <HeritageHeader />

      <section className="bg-[#EDE2D0] px-5 py-28 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold tracking-[0.35em] text-[#C5A15B]">
            ACADEMICS
          </p>
          <h1 className="mt-5 max-w-4xl font-serif text-6xl md:text-8xl">
            Learning that lasts a lifetime.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
        <div className="max-w-3xl">
          <p className="text-lg leading-8 text-slate-600">
            Our academic experience is designed to help students build strong
            foundations while developing the ability to think critically,
            communicate clearly and approach problems creatively.
          </p>
        </div>

        <div className="mt-16 border-t border-[#551B2A]/15">
          {stages.map(([number, title, description]) => (
            <div
              key={number}
              className="grid gap-5 border-b border-[#551B2A]/15 py-10 md:grid-cols-[100px_1fr_1.2fr]"
            >
              <span className="text-sm text-[#C5A15B]">{number}</span>
              <h2 className="font-serif text-3xl">{title}</h2>
              <p className="leading-7 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#551B2A] !text-[#F7F1E8] px-5 py-24 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs tracking-[0.3em] text-[#C5A15B]">
            BEYOND THE CURRICULUM
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {["STEM & Innovation", "Arts & Culture", "Sports & Wellness"].map(
              (item) => (
                <div
                  key={item}
                  className="border border-white/15 p-8 md:min-h-[240px]"
                >
                  <h3 className="mt-24 font-serif text-3xl">{item}</h3>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <HeritageFooter />
    </main>
  );
}


