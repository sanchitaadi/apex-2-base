"use client";

import HeritageHeader from "@/components/demo/heritage/HeritageHeader";
import HeritageFooter from "@/components/demo/heritage/HeritageFooter";

const notices = [
  ["12 SEP 2026", "Admissions", "Admission information for the upcoming academic session."],
  ["08 SEP 2026", "Academic", "Important academic calendar information for students."],
  ["02 SEP 2026", "Events", "Inter-school activities and upcoming events at Apex."],
  ["27 AUG 2026", "General", "Important information for parents and students."],
];

export default function NoticesPage() {
  return (
    <main className="min-h-screen bg-[#F7F1E8] text-[#551B2A]">
      <HeritageHeader />

      <section className="bg-[#EDE2D0] px-5 py-28 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold tracking-[0.35em] text-[#C5A15B]">
            SCHOOL NOTICES
          </p>
          <h1 className="mt-5 font-serif text-6xl md:text-8xl">
            Latest from Apex.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-24 sm:px-8">
        <div className="border-t border-[#551B2A]/15">
          {notices.map(([date, category, title]) => (
            <article
              key={title}
              className="grid gap-5 border-b border-[#551B2A]/15 py-9 md:grid-cols-[150px_130px_1fr_auto]"
            >
              <span className="text-xs font-semibold text-slate-500">
                {date}
              </span>

              <span className="h-fit w-fit border border-[#C5A15B]/50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#C5A15B]">
                {category}
              </span>

              <h2 className="font-serif text-2xl">{title}</h2>

              <button className="text-sm font-bold text-[#551B2A]">
                Read →
              </button>
            </article>
          ))}
        </div>
      </section>

      <HeritageFooter />
    </main>
  );
}


