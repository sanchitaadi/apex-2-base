"use client";

import Link from "next/link";
import HeritageHeader from "@/components/demo/heritage/HeritageHeader";
import HeritageFooter from "@/components/demo/heritage/HeritageFooter";

const heroImage =
  "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=2000&q=90";

const campusImage =
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=85";

const studentsImage =
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=85";

export default function HeritageHome() {
  return (
    <main className="bg-[#F7F1E8] text-[#551B2A]">
      <HeritageHeader />

      {/* HERO */}
      <section className="relative min-h-[680px] overflow-hidden">
        <img
          src={heroImage}
          alt="Apex Public School campus"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[#21191A] !text-[#F7F1E8]/65" />

        <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-center px-5 sm:px-8">
          <div className="max-w-4xl text-white">
            <p className="mb-6 text-xs font-semibold tracking-[0.4em] text-[#C5A15B] sm:text-sm">
              EDUCATION • CHARACTER • LEADERSHIP
            </p>

            <h1 className="font-serif text-6xl leading-[0.9] sm:text-7xl md:text-9xl">
              Tradition
              <br />
              shapes
              <br />
              tomorrow.
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
              A learning community where academic excellence meets character,
              curiosity and purpose.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/demo/heritage/about"
                className="bg-[#C5A15B] px-7 py-4 text-sm font-bold text-[#551B2A] transition hover:bg-white"
              >
                Discover Apex
              </Link>

              <Link
                href="/demo/heritage/admissions"
                className="border border-white/40 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white hover:text-[#551B2A]"
              >
                Admissions
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-7 right-6 hidden text-[10px] tracking-[0.3em] text-white/50 md:block">
          SCROLL TO EXPLORE ↓
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 md:grid-cols-2 md:py-32">
        <div>
          <p className="text-xs font-bold tracking-[0.3em] text-[#C5A15B]">
            WELCOME TO APEX
          </p>

          <h2 className="mt-5 font-serif text-5xl leading-tight md:text-7xl">
            More than
            <br />
            a school.
          </h2>
        </div>

        <div className="flex flex-col justify-end">
          <p className="text-lg leading-8 text-slate-600">
            Apex Public School is a place where every learner is encouraged to
            question, discover and grow. Our educational approach combines
            strong academics with opportunities for creativity, leadership,
            sport and community.
          </p>

          <Link
            href="/demo/heritage/about"
            className="mt-8 w-fit border-b border-[#551B2A] pb-2 text-sm font-bold"
          >
            Our story →
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-[#551B2A]/10 bg-[#EDE2D0]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
          {[
            ["25+", "Years of Excellence"],
            ["5000+", "Learners"],
            ["50+", "Activities"],
            ["100%", "Commitment"],
          ].map(([number, label]) => (
            <div
              key={label}
              className="border-r border-[#551B2A]/10 px-5 py-12 last:border-r-0 sm:px-8"
            >
              <div className="font-serif text-4xl sm:text-5xl">{number}</div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TWO FEATURE STORIES */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <img
              src={campusImage}
              alt="Apex campus"
              className="h-[500px] w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-end md:col-span-5 md:pl-10">
            <p className="text-xs font-bold tracking-[0.3em] text-[#C5A15B]">
              THE CAMPUS
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
              A place designed for discovery.
            </h2>

            <p className="mt-6 leading-7 text-slate-600">
              From classrooms and laboratories to sports spaces and creative
              areas, our campus provides room for students to explore their
              interests.
            </p>

            <Link
              href="/demo/heritage/campus"
              className="mt-7 w-fit bg-[#551B2A] !text-[#F7F1E8] px-6 py-3 text-xs font-bold text-white !text-[#F7F1E8]"
            >
              Explore Campus
            </Link>
          </div>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-12">
          <div className="order-2 flex flex-col justify-end md:order-1 md:col-span-5 md:pr-10">
            <p className="text-xs font-bold tracking-[0.3em] text-[#C5A15B]">
              LIFE AT APEX
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
              Learning continues beyond the classroom.
            </h2>

            <p className="mt-6 leading-7 text-slate-600">
              Sports, arts, clubs, celebrations and student-led experiences
              help young people discover confidence and purpose.
            </p>

            <Link
              href="/demo/heritage/gallery"
              className="mt-7 w-fit border-b border-[#551B2A] pb-2 text-xs font-bold"
            >
              View student life →
            </Link>
          </div>

          <div className="order-1 md:order-2 md:col-span-7">
            <img
              src={studentsImage}
              alt="Students learning"
              className="h-[500px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="bg-[#551B2A] !text-[#F7F1E8] px-5 py-24 text-white sm:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold tracking-[0.3em] text-[#C5A15B]">
            THE APEX EXPERIENCE
          </p>

          <h2 className="mt-5 max-w-3xl font-serif text-5xl leading-tight md:text-7xl">
            Learn. Lead.
            <br />
            Belong.
          </h2>

          <div className="mt-14 grid border-l border-white/15 md:grid-cols-3">
            {[
              [
                "01",
                "Academic Excellence",
                "A strong foundation built through curiosity, discipline and meaningful learning.",
              ],
              [
                "02",
                "Leadership",
                "Students develop confidence, responsibility and the courage to make a difference.",
              ],
              [
                "03",
                "Community",
                "A supportive environment where every learner can find their place and voice.",
              ],
            ].map(([num, title, text]) => (
              <div
                key={num}
                className="border-b border-r border-t border-white/15 p-8 md:min-h-[320px]"
              >
                <span className="text-sm text-[#C5A15B]">{num}</span>

                <h3 className="mt-20 font-serif text-3xl">{title}</h3>

                <p className="mt-4 text-sm leading-7 text-white/55">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADMISSION CTA */}
      <section className="px-5 py-24 sm:px-8 md:py-32">
        <div className="mx-auto max-w-5xl border border-[#C5A15B]/50 px-6 py-16 text-center sm:px-12">
          <p className="text-xs font-bold tracking-[0.3em] text-[#C5A15B]">
            BEGIN YOUR APEX JOURNEY
          </p>

          <h2 className="mt-5 font-serif text-5xl md:text-7xl">
            Admissions
            <br />
            are open.
          </h2>

          <p className="mx-auto mt-6 max-w-xl leading-7 text-slate-600">
            Discover our academic journey, admission process and opportunities
            for your child.
          </p>

          <Link
            href="/demo/heritage/admissions"
            className="mt-8 inline-block bg-[#551B2A] !text-[#F7F1E8] px-8 py-4 text-sm font-bold text-white !text-[#F7F1E8]"
          >
            Explore Admissions
          </Link>
        </div>
      </section>

      <HeritageFooter />
    </main>
  );
}


