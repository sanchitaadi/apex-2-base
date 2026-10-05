"use client";

import HeritageHeader from "@/components/demo/heritage/HeritageHeader";
import HeritageFooter from "@/components/demo/heritage/HeritageFooter";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F7F1E8] text-[#551B2A]">
      <HeritageHeader />

      <section className="bg-[#551B2A] !text-[#F7F1E8] px-5 py-28 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs tracking-[0.35em] text-[#C5A15B]">
            ABOUT APEX
          </p>
          <h1 className="mt-5 max-w-4xl font-serif text-6xl md:text-8xl">
            Education with purpose.
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-16 px-5 py-24 sm:px-8 md:grid-cols-2 md:py-32">
        <div>
          <p className="text-xs font-bold tracking-[0.3em] text-[#C5A15B]">
            WHO WE ARE
          </p>
          <h2 className="mt-5 font-serif text-5xl leading-tight">
            Growing minds.
            <br />
            Building character.
          </h2>
        </div>

        <div className="space-y-6 leading-8 text-slate-600">
          <p>
            Apex Public School is committed to creating an environment where
            students can develop academically, socially and personally.
          </p>
          <p>
            We believe that meaningful education is not limited to textbooks.
            It is about asking questions, collaborating with others, taking
            responsibility and discovering one's strengths.
          </p>
          <p>
            Our school community brings together learners, educators and
            families around a shared commitment to growth.
          </p>
        </div>
      </section>

      <section className="bg-[#EDE2D0] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold tracking-[0.3em] text-[#C5A15B]">
            OUR VALUES
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {[
              ["01", "Integrity"],
              ["02", "Curiosity"],
              ["03", "Respect"],
              ["04", "Leadership"],
            ].map(([number, title]) => (
              <div key={number} className="bg-[#F7F1E8] p-8">
                <span className="text-sm text-[#C5A15B]">{number}</span>
                <h3 className="mt-24 font-serif text-3xl">{title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HeritageFooter />
    </main>
  );
}


