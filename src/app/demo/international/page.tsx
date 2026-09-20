"use client";
import DemoMobileFix from "@/components/demo/DemoMobileFix";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  Menu,
  X,
  Globe2,
  Compass,
  BookOpen,
  Users,
  Sparkles,
} from "lucide-react";

const photos = [
  "https://apexpublicschool.in/wp-content/uploads/2020/05/IMG_0413-scaled.jpg",
  "https://apexpublicschool.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-02-at-1.06.01-PM-22.jpeg",
  "https://apexpublicschool.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-02-at-1.06.01-PM-28.jpeg",
];

export default function InternationalDemo() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#F6F1E7] text-[#12352A]"><DemoMobileFix />

      {/* TOP NAV */}
      <header className="absolute left-0 right-0 top-0 z-50">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-7 md:px-10">

          <Link
            href="/demo/international"
            className="flex items-center gap-3 !text-white"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/60 font-serif text-xl">
              A
            </div>

            <div>
              <div className="!text-white text-sm font-semibold tracking-[0.18em]">
                APEX
              </div>

              <div className="!text-white/70 text-[9px] tracking-[0.35em]">
                PUBLIC SCHOOL
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-wider text-white lg:flex">
            <a href="#story">Our Story</a>
            <a href="#learning">Learning</a>
            <a href="#campus">Campus</a>
            <a href="#community">Community</a>
            <a href="#gallery">Gallery</a>
          </nav>

          <a
            href="/online-registration"
            className="hidden rounded-full bg-white px-6 py-3 text-xs font-bold !text-[#12352A] transition hover:bg-[#C96B4B] lg:block"
          >
            Apply Now
          </a>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white lg:hidden"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <div className="absolute left-0 right-0 top-full bg-[#12352A] px-6 py-7 text-white lg:hidden">
            <div className="flex flex-col gap-5 text-sm">
              <a href="#story" onClick={() => setMenuOpen(false)}>
                Our Story
              </a>
              <a href="#learning" onClick={() => setMenuOpen(false)}>
                Learning
              </a>
              <a href="#campus" onClick={() => setMenuOpen(false)}>
                Campus
              </a>
              <a href="#community" onClick={() => setMenuOpen(false)}>
                Community
              </a>
              <a href="#gallery" onClick={() => setMenuOpen(false)}>
                Gallery
              </a>
              <a href="/online-registration" onClick={() => setMenuOpen(false)}>
                Admissions
              </a>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative min-h-[calc(100svh-0px)] overflow-hidden bg-[#12352A] text-white">

        <img
          src={photos[0]}
          alt="Apex Public School"
          className="absolute inset-0 h-full w-full object-cover opacity-75"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#12352A] via-[#12352A]/65 to-transparent" />

        <div className="relative mx-auto flex min-h-[calc(100svh-0px)] max-w-[1500px] items-center px-6 pt-24 pb-12 md:px-10 md:pt-28 md:pb-16">

          <div className="max-w-5xl">

            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-[#C96B4B]">
              Education for a changing world
            </p>

            <h1 className="max-w-5xl font-serif text-[3.8rem] leading-[0.9] tracking-[-0.04em] sm:text-[5.2rem] md:text-[6.8rem] lg:text-[7.4rem]">
              Learn.
              <br />
              Explore.
              <br />
              <span className="text-[#C96B4B]">Become.</span>
            </h1>

            <div className="mt-7 flex max-w-2xl flex-col justify-between gap-6 border-t border-white/30 pt-6 sm:flex-row sm:items-end">

              <p className="max-w-xl text-sm leading-6 text-white/75 md:text-base md:leading-7">
                A learning community where curiosity is encouraged,
                perspectives are broadened and every student is given
                space to discover their potential.
              </p>

              <a
                href="#story"
                className="flex shrink-0 items-center gap-3 text-sm font-semibold"
              >
                Discover Apex
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C96B4B] !text-[#12352A]">
                  <ArrowDownRight size={18} />
                </span>
              </a>

            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-8 hidden text-xs uppercase tracking-[0.3em] text-white/50 md:block">
          Delhi · India
        </div>
      </section>

      {/* INTRO */}
      <section id="story" className="relative bg-[#F6F1E7] py-32">

        <div className="mx-auto max-w-[1300px] px-6 md:px-10">

          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7D9270]">
                Our perspective
              </p>

              <div className="mt-6 text-6xl text-[#C96B4B]">
                01
              </div>
            </div>

            <div>
              <h2 className="max-w-4xl font-serif text-4xl leading-tight md:text-6xl">
                Education should prepare students not only for exams,
                but for the world beyond them.
              </h2>

              <div className="mt-10 grid gap-8 md:grid-cols-2">

                <p className="leading-8 text-[#12352A]/65">
                  At Apex Public School, learning is viewed as a journey
                  of discovery. Students are encouraged to ask questions,
                  develop ideas and understand the world around them.
                </p>

                <p className="leading-8 text-[#12352A]/65">
                  From academics and activities to sports, creativity
                  and community experiences, the school environment
                  creates opportunities for students to grow in different
                  directions.
                </p>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* IMAGE STORY */}
      <section className="bg-[#F6F1E7] pb-32">

        <div className="mx-auto grid max-w-[1500px] gap-5 px-6 md:grid-cols-12 md:px-10">

          <div className="md:col-span-7">
            <img
              src={photos[1]}
              alt="Apex students"
              className="h-[650px] w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-end bg-[#C96B4B] p-8 md:col-span-5 md:p-14">

            <p className="text-xs font-bold uppercase tracking-[0.3em]">
              The Apex experience
            </p>

            <h2 className="mt-6 font-serif text-4xl leading-tight md:text-5xl">
              Curious minds.
              <br />
              Confident voices.
              <br />
              Global outlook.
            </h2>

            <p className="mt-7 max-w-md leading-7 text-black/65">
              A school experience that brings together academic
              learning, creativity, collaboration and opportunities
              beyond the classroom.
            </p>

            <a
              href="#learning"
              className="mt-9 flex items-center gap-3 text-sm font-bold"
            >
              Explore learning
              <ArrowRight size={17} />
            </a>

          </div>
        </div>
      </section>

      {/* LEARNING */}
      <section id="learning" className="bg-[#12352A] py-32 text-white">

        <div className="mx-auto max-w-[1300px] px-6 md:px-10">

          <div className="grid gap-16 lg:grid-cols-2">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#C96B4B]">
                Learning
              </p>

              <h2 className="mt-6 font-serif text-5xl leading-tight md:text-7xl">
                Beyond
                <br />
                the classroom.
              </h2>

              <p className="mt-8 max-w-lg leading-8 text-white/55">
                Different students learn in different ways. Our academic
                and co-curricular environment gives students multiple
                opportunities to discover what interests them.
              </p>
            </div>

            <div className="grid gap-px bg-white/10">

              {[
                ["01", "Academic Foundations", "Strong foundations and meaningful subject learning."],
                ["02", "Creative Expression", "Art, culture and opportunities to express ideas."],
                ["03", "Sports & Wellbeing", "Learning teamwork, discipline and resilience."],
                ["04", "Innovation & Exploration", "Encouraging questions, experimentation and discovery."],
              ].map(([number, title, text]) => (
                <div
                  key={number}
                  className="group bg-[#12352A] p-8 transition hover:bg-[#1F493A] md:p-10"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-[#C96B4B]">
                      {number}
                    </span>

                    <ArrowUpRightIcon />
                  </div>

                  <h3 className="mt-12 font-serif text-2xl">
                    {title}
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-7 text-white/45">
                    {text}
                  </p>
                </div>
              ))}

            </div>
          </div>
        </div>
      </section>

      {/* GLOBAL PERSPECTIVE */}
      <section className="bg-[#C96B4B] py-28">

        <div className="mx-auto max-w-[1300px] px-6 md:px-10">

          <div className="grid items-center gap-14 lg:grid-cols-2">

            <div>
              <Globe2 size={34} />

              <h2 className="mt-7 font-serif text-5xl leading-tight md:text-7xl">
                Think beyond
                <br />
                boundaries.
              </h2>

              <p className="mt-7 max-w-xl leading-8 text-black/65">
                Today's students are growing up in a connected world.
                Education can help them develop curiosity, empathy,
                communication and an understanding of different
                perspectives.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-px bg-black/20">

              {[
                ["01", "Perspective"],
                ["02", "Communication"],
                ["03", "Collaboration"],
                ["04", "Confidence"],
              ].map(([number, title]) => (
                <div
                  key={number}
                  className="bg-[#C96B4B] p-8 md:p-12"
                >
                  <div className="text-xs opacity-50">
                    {number}
                  </div>

                  <h3 className="mt-16 font-serif text-2xl">
                    {title}
                  </h3>
                </div>
              ))}

            </div>
          </div>
        </div>
      </section>

      {/* CAMPUS */}
      <section id="campus" className="bg-[#F6F1E7] py-32">

        <div className="mx-auto max-w-[1500px] px-6 md:px-10">

          <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7D9270]">
                Our campus
              </p>

              <h2 className="mt-5 font-serif text-5xl md:text-7xl">
                A place to belong.
              </h2>
            </div>

            <p className="max-w-md leading-7 text-black/55">
              Spaces for learning, friendship, activity and discovery
              are an important part of the school experience.
            </p>

          </div>

          <div className="grid gap-5 md:grid-cols-12">

            <div className="md:col-span-8">
              <img
                src={photos[0]}
                alt="Apex campus"
                className="h-[620px] w-full object-cover"
              />
            </div>

            <div className="grid gap-5 md:col-span-4">

              <div className="bg-[#12352A] p-8 text-white md:p-10">
                <Compass className="text-[#C96B4B]" />

                <h3 className="mt-16 font-serif text-3xl">
                  Explore
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/50">
                  Discover classrooms, activity spaces, sports and
                  other areas that make up the Apex experience.
                </p>
              </div>

              <img
                src={photos[2]}
                alt="Apex school activity"
                className="h-[300px] w-full object-cover"
              />

            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section id="community" className="bg-white py-32">

        <div className="mx-auto max-w-[1300px] px-6 md:px-10">

          <div className="grid gap-16 lg:grid-cols-[1fr_1.5fr]">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7D9270]">
                Community
              </p>

              <h2 className="mt-5 font-serif text-5xl leading-tight md:text-6xl">
                More than
                <br />
                a classroom.
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              {[
                {
                  icon: BookOpen,
                  title: "Academics",
                  text: "A foundation for curiosity and lifelong learning.",
                },
                {
                  icon: Users,
                  title: "Community",
                  text: "Building relationships, empathy and belonging.",
                },
                {
                  icon: Sparkles,
                  title: "Creativity",
                  text: "Encouraging students to imagine and express.",
                },
                {
                  icon: Globe2,
                  title: "Future",
                  text: "Preparing young people for a connected world.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="border-t border-black/15 py-7"
                  >
                    <Icon size={24} className="text-[#7D9270]" />

                    <h3 className="mt-7 font-serif text-2xl">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-black/50">
                      {item.text}
                    </p>
                  </div>
                );
              })}

            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="bg-[#12352A] py-32 text-white">

        <div className="mx-auto max-w-[1500px] px-6 md:px-10">

          <div className="flex items-end justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#C96B4B]">
                Real moments
              </p>

              <h2 className="mt-5 font-serif text-5xl md:text-7xl">
                Life at Apex.
              </h2>
            </div>

            <a
              href="/gallery"
              className="hidden items-center gap-3 text-sm font-semibold md:flex"
            >
              View gallery
              <ArrowRight size={17} />
            </a>

          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">

            <img
              src={photos[0]}
              alt="Apex"
              className="h-[500px] w-full object-cover"
            />

            <img
              src={photos[1]}
              alt="Apex students"
              className="h-[500px] w-full object-cover md:mt-16"
            />

            <img
              src={photos[2]}
              alt="Apex activity"
              className="h-[500px] w-full object-cover"
            />

          </div>
        </div>
      </section>

      {/* ================================
          INTERNATIONAL EXTRA SECTIONS
      ================================= */}

      {/* ACADEMIC JOURNEY */}
      <section className="bg-[#F6F1E7] py-28 md:py-36">
        <div className="mx-auto max-w-[1300px] px-6 md:px-10">

          <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7D9270]">
                Academic Journey
              </p>

              <div className="mt-6 font-serif text-7xl text-[#C96B4B]">
                02
              </div>

              <p className="mt-5 max-w-xs text-sm leading-7 text-black/50">
                Every stage of a student's journey brings new questions,
                new experiences and new possibilities.
              </p>
            </div>

            <div>

              <h2 className="font-serif text-4xl leading-tight md:text-6xl">
                From first discoveries
                <br />
                to future ambitions.
              </h2>

              <div className="mt-14 divide-y divide-black/15 border-y border-black/15">

                {[
                  ["Early Years", "Curiosity", "Building confidence, imagination and a love for discovery."],
                  ["Primary School", "Foundations", "Developing strong academic and personal foundations."],
                  ["Middle School", "Exploration", "Encouraging independent thinking and deeper exploration."],
                  ["Senior School", "Direction", "Preparing students for higher education and future pathways."],
                ].map(([stage, label, text], index) => (
                  <div
                    key={stage}
                    className="group grid gap-5 py-8 md:grid-cols-[80px_1fr_1fr] md:items-center"
                  >
                    <span className="text-sm text-[#C96B4B]">
                      0{index + 1}
                    </span>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#7D9270]">
                        {label}
                      </p>

                      <h3 className="mt-2 font-serif text-2xl">
                        {stage}
                      </h3>
                    </div>

                    <p className="text-sm leading-7 text-black/50">
                      {text}
                    </p>
                  </div>
                ))}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* WHY APEX */}
      <section className="bg-white py-28 md:py-36">

        <div className="mx-auto max-w-[1300px] px-6 md:px-10">

          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7D9270]">
              Why Apex
            </p>

            <h2 className="mt-5 font-serif text-5xl leading-tight md:text-7xl">
              An education shaped
              <br />
              around the whole student.
            </h2>
          </div>

          <div className="mt-16 grid gap-px bg-black/15 md:grid-cols-3">

            {[
              ["01", "Curiosity", "Students are encouraged to ask questions, investigate ideas and look at problems from different perspectives."],
              ["02", "Character", "Learning is connected with confidence, responsibility, empathy and respect for others."],
              ["03", "Opportunity", "Students can discover interests through academics, sports, arts, activities and experiences."],
            ].map(([number, title, text]) => (
              <div
                key={number}
                className="bg-white p-9 md:p-12"
              >
                <span className="text-xs text-[#C96B4B]">
                  {number}
                </span>

                <h3 className="mt-16 font-serif text-3xl">
                  {title}
                </h3>

                <p className="mt-5 text-sm leading-8 text-black/50">
                  {text}
                </p>

                <div className="mt-10 h-px w-12 bg-[#C96B4B]" />
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* LEARNING PHILOSOPHY */}
      <section className="bg-[#12352A] py-28 text-white md:py-36">

        <div className="mx-auto max-w-[1300px] px-6 md:px-10">

          <div className="grid gap-16 lg:grid-cols-2">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#C96B4B]">
                Learning Philosophy
              </p>

              <h2 className="mt-6 font-serif text-5xl leading-tight md:text-7xl">
                Ask.
                <br />
                Discover.
                <br />
                Create.
              </h2>
            </div>

            <div className="flex flex-col justify-end">

              <p className="text-xl leading-9 text-white/70">
                We want students to leave the classroom with more
                questions than they entered with.
              </p>

              <div className="mt-12 grid gap-5 sm:grid-cols-2">

                {[
                  ["01", "Think", "Develop ideas and understand why."],
                  ["02", "Explore", "Investigate interests and possibilities."],
                  ["03", "Create", "Turn ideas into meaningful work."],
                  ["04", "Reflect", "Learn from experience and continue growing."],
                ].map(([number, title, text]) => (
                  <div
                    key={number}
                    className="border-t border-white/20 pt-6"
                  >
                    <span className="text-xs text-[#C96B4B]">
                      {number}
                    </span>

                    <h3 className="mt-5 font-serif text-2xl">
                      {title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/40">
                      {text}
                    </p>
                  </div>
                ))}

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* CAMPUS & FACILITIES */}
      <section className="bg-[#F6F1E7] py-28 md:py-36">

        <div className="mx-auto max-w-[1500px] px-6 md:px-10">

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7D9270]">
                Campus
              </p>

              <h2 className="mt-5 font-serif text-5xl md:text-7xl">
                Spaces for
                <br />
                possibility.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-black/50">
              The environment around students plays an important role
              in how they learn, interact and experience school life.
            </p>

          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-12">

            <div className="relative h-[600px] overflow-hidden md:col-span-7">
              <img
                src={photos[0]}
                alt="Apex Public School campus"
                className="h-full w-full object-cover transition duration-700 hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-xs uppercase tracking-[0.3em] text-[#C96B4B]">
                  01
                </p>

                <h3 className="mt-2 font-serif text-3xl">
                  The Apex Campus
                </h3>
              </div>
            </div>

            <div className="grid gap-5 md:col-span-5">

              {[
                ["Learning Spaces", "Classrooms and spaces designed around learning and interaction."],
                ["Activities", "Opportunities for students to explore interests beyond academics."],
                ["Sports", "Developing teamwork, discipline and confidence through activity."],
                ["Community", "Spaces where students, teachers and families come together."],
              ].map(([title, text], index) => (
                <div
                  key={title}
                  className="flex flex-col justify-between border-t border-black/15 bg-white p-7 md:p-8"
                >
                  <div className="flex justify-between">
                    <span className="text-xs text-[#C96B4B]">
                      0{index + 2}
                    </span>

                    <ArrowRight
                      size={18}
                      className="text-[#7D9270]"
                    />
                  </div>

                  <div className="mt-12">
                    <h3 className="font-serif text-2xl">
                      {title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-black/50">
                      {text}
                    </p>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </section>

      {/* STUDENT LIFE */}
      <section id="student-life" className="bg-white py-28 md:py-36">

        <div className="mx-auto max-w-[1300px] px-6 md:px-10">

          <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr]">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7D9270]">
                Student Life
              </p>

              <h2 className="mt-5 font-serif text-5xl leading-tight md:text-6xl">
                Discover
                <br />
                your place.
              </h2>

              <p className="mt-7 text-sm leading-8 text-black/50">
                School life extends far beyond the timetable. Activities
                and experiences help students discover interests,
                friendships and new strengths.
              </p>
            </div>

            <div className="grid gap-px bg-black/15 sm:grid-cols-2">

              {[
                ["Sports", "Compete. Collaborate. Grow."],
                ["Arts & Culture", "Express. Perform. Create."],
                ["Clubs", "Explore interests and ideas."],
                ["Events", "Celebrate the Apex community."],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="bg-[#F6F1E7] p-8 md:p-10"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#12352A] text-sm !text-white">
                    →
                  </div>

                  <h3 className="mt-14 font-serif text-3xl">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm text-black/45">
                    {text}
                  </p>
                </div>
              ))}

            </div>

          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="bg-[#12352A] py-28 text-white md:py-36">

        <div className="mx-auto max-w-[1300px] px-6 md:px-10">

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#C96B4B]">
                Achievements
              </p>

              <h2 className="mt-5 font-serif text-5xl md:text-7xl">
                Moments that
                <br />
                matter.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-white/45">
              From academic milestones to sporting and cultural
              achievements, every student's journey is worth celebrating.
            </p>

          </div>

          <div className="mt-16 grid gap-px bg-white/15 md:grid-cols-3">

            {[
              ["Academic", "Celebrating learning, progress and achievement."],
              ["Sports", "Building discipline, teamwork and resilience."],
              ["Creative", "Giving ideas a space to become reality."],
            ].map(([title, text]) => (
              <div
                key={title}
                className="bg-[#12352A] p-9 md:p-12"
              >
                <h3 className="font-serif text-3xl">
                  {title}
                </h3>

                <p className="mt-5 text-sm leading-7 text-white/45">
                  {text}
                </p>

                <ArrowRight
                  className="mt-12 text-[#C96B4B]"
                  size={20}
                />
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* NEWS */}
      <section className="bg-[#F6F1E7] py-28 md:py-36">

        <div className="mx-auto max-w-[1300px] px-6 md:px-10">

          <div className="flex items-end justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7D9270]">
                Latest
              </p>

              <h2 className="mt-5 font-serif text-5xl md:text-6xl">
                What's happening.
              </h2>
            </div>

            <a
              href="/notices"
              className="hidden items-center gap-2 text-sm font-bold md:flex"
            >
              View all
              <ArrowRight size={16} />
            </a>

          </div>

          <div className="mt-14 divide-y border-y border-black/15">

            {[
              ["04 JUL", "School Notice", "Important updates from Apex Public School"],
              ["22 MAY", "School Life", "Celebrating learning beyond the classroom"],
              ["29 APR", "Community", "Connecting students, teachers and families"],
              ["12 APR", "Activities", "Moments from life at Apex"],
            ].map(([date, category, title]) => (
              <a
                href="/notices"
                key={title}
                className="group grid gap-4 py-7 transition hover:px-3 md:grid-cols-[110px_160px_1fr_30px] md:items-center"
              >
                <span className="text-xs font-semibold text-[#C96B4B]">
                  {date}
                </span>

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7D9270]">
                  {category}
                </span>

                <span className="font-serif text-xl">
                  {title}
                </span>

                <ArrowRight
                  size={17}
                  className="text-black/30 transition group-hover:translate-x-1 group-hover:text-[#C96B4B]"
                />
              </a>
            ))}

          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="bg-white py-28 md:py-36">

        <div className="mx-auto max-w-[1500px] px-6 md:px-10">

          <div className="max-w-3xl">

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7D9270]">
              Real moments
            </p>

            <h2 className="mt-5 font-serif text-5xl md:text-7xl">
              See Apex
              <br />
              through their eyes.
            </h2>

          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-12">

            <div className="md:col-span-5">
              <img
                src={photos[1]}
                alt="Apex students"
                className="h-[650px] w-full object-cover"
              />
            </div>

            <div className="grid gap-4 md:col-span-7 md:grid-cols-2">

              <img
                src={photos[2]}
                alt="Apex school activity"
                className="h-[315px] w-full object-cover"
              />

              <div className="flex min-h-[315px] flex-col justify-between bg-[#C96B4B] p-8 text-white md:p-10">

                <span className="text-4xl font-serif">
                  “
                </span>

                <p className="font-serif text-3xl leading-tight">
                  Every school day can become a memory worth keeping.
                </p>

                <span className="text-xs uppercase tracking-[0.25em]">
                  Life at Apex
                </span>

              </div>

              <div className="flex min-h-[315px] flex-col justify-between bg-[#12352A] p-8 text-white md:p-10">

                <span className="text-xs uppercase tracking-[0.3em] text-[#C96B4B]">
                  Explore
                </span>

                <h3 className="font-serif text-4xl">
                  Campus
                  <br />
                  Life
                </h3>

                <a
                  href="/gallery"
                  className="flex items-center gap-2 text-sm font-semibold"
                >
                  Open gallery
                  <ArrowRight size={16} />
                </a>

              </div>

              <img
                src={photos[0]}
                alt="Apex campus"
                className="h-[315px] w-full object-cover"
              />

            </div>

          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="bg-[#F6F1E7] py-28 md:py-36">

        <div className="mx-auto max-w-[1100px] px-6 text-center">

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7D9270]">
            Community voices
          </p>

          <div className="mt-10 font-serif text-7xl text-[#C96B4B]">
            “
          </div>

          <blockquote className="font-serif text-3xl leading-tight md:text-5xl">
            A school community should give students the confidence
            to become curious, capable and compassionate people.
          </blockquote>

          <div className="mx-auto mt-10 h-px w-12 bg-[#C96B4B]" />

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-black/40">
            Apex Public School
          </p>

        </div>
      </section>

      {/* ADMISSION JOURNEY */}
      <section id="admissions" className="bg-[#C96B4B] py-28 text-white md:py-36">

        <div className="mx-auto max-w-[1300px] px-6 md:px-10">

          <div className="grid gap-14 lg:grid-cols-2">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.3em]">
                Admissions
              </p>

              <h2 className="mt-6 font-serif text-5xl leading-tight md:text-7xl">
                Begin your
                <br />
                journey.
              </h2>

              <p className="mt-7 max-w-lg leading-8 text-white/75">
                Explore the admission information and discover what
                life at Apex could look like for your child.
              </p>

            </div>

            <div className="divide-y divide-white/30 border-y border-white/30">

              {[
                ["01", "Explore", "Learn about the school and its approach."],
                ["02", "Enquire", "Ask questions and connect with the school."],
                ["03", "Apply", "Follow the current admission process."],
                ["04", "Join", "Begin your journey with the Apex community."],
              ].map(([number, title, text]) => (
                <div
                  key={number}
                  className="grid gap-5 py-6 md:grid-cols-[60px_150px_1fr] md:items-center"
                >
                  <span className="text-sm">
                    {number}
                  </span>

                  <h3 className="font-serif text-2xl">
                    {title}
                  </h3>

                  <p className="text-sm text-white/70">
                    {text}
                  </p>
                </div>
              ))}

            </div>

          </div>

          <div className="mt-14 flex flex-wrap gap-4">

            <a
              href="/online-registration"
              className="rounded-full bg-[#12352A] px-8 py-4 text-sm font-bold !text-white transition hover:bg-[#1F493A]"
            >
              Explore Admissions
            </a>

            <a
              href="/contact"
              className="rounded-full border border-white/50 px-8 py-4 text-sm font-bold !text-white transition hover:bg-white hover:!text-[#12352A]"
            >
              Contact School
            </a>

          </div>

        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-28 md:py-36">

        <div className="mx-auto max-w-[1000px] px-6 md:px-10">

          <div className="text-center">

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7D9270]">
              Questions
            </p>

            <h2 className="mt-5 font-serif text-5xl md:text-6xl">
              Frequently asked.
            </h2>

          </div>

          <div className="mt-14 divide-y border-y border-black/15">

            {[
              "How can I apply for admission?",
              "Where can I find the latest school notices?",
              "How can I contact Apex Public School?",
              "Where can I find academic information?",
              "How can I view the school gallery?",
            ].map((question) => (
              <details key={question} className="group">

                <summary className="flex cursor-pointer list-none items-center justify-between py-7 font-serif text-xl">

                  {question}

                  <span className="text-2xl text-[#C96B4B] transition group-open:rotate-45">
                    +
                  </span>

                </summary>

                <p className="max-w-2xl pb-7 pr-10 text-sm leading-7 text-black/50">
                  Please refer to the relevant official Apex Public
                  School page or contact the school for the latest
                  information.
                </p>

              </details>
            ))}

          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#12352A] py-24 text-center text-white md:py-32">

        <div className="mx-auto max-w-4xl px-6">

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#C96B4B]">
            Apex Public School
          </p>

          <h2 className="mt-6 font-serif text-5xl leading-tight md:text-7xl">
            Ready to discover
            <br />
            what's possible?
          </h2>

          <div className="mt-9 flex flex-wrap justify-center gap-4">

            <a
              href="/online-registration"
              className="rounded-full bg-white px-8 py-4 text-sm font-bold !text-[#12352A] transition hover:bg-[#F6F1E7]"
            >
              Explore Admissions
            </a>

            <a
              href="/contact"
              className="rounded-full border border-white/40 px-8 py-4 text-sm font-bold !text-white transition hover:bg-white hover:!text-[#12352A]"
            >
              Talk to Apex
            </a>

          </div>

        </div>
      </section>
      {/* ADMISSIONS */}
      <section id="admissions" className="bg-[#C96B4B] py-32">

        <div className="mx-auto max-w-[1300px] px-6 md:px-10">

          <div className="grid items-end gap-10 lg:grid-cols-2">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em]">
                Admissions
              </p>

              <h2 className="mt-6 font-serif text-5xl leading-tight md:text-7xl">
                Begin your
                <br />
                Apex journey.
              </h2>
            </div>

            <div>
              <p className="max-w-lg leading-8 text-black/60">
                Discover the school, explore the learning environment
                and find the information you need about admissions.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">

                <a
                  href="/online-registration"
                  className="rounded-full bg-[#12352A] px-7 py-4 text-sm font-bold !text-white transition hover:bg-[#1F493A]"
                >
                  Explore Admissions
                </a>

                <a
                  href="/contact"
                  className="rounded-full border border-[#12352A]/30 px-7 py-4 text-sm font-bold !text-[#12352A] transition hover:bg-[#12352A] hover:!text-white"
                >
                  Contact School
                </a>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0D251D] py-16 text-white">

        <div className="mx-auto grid max-w-[1300px] gap-12 px-6 md:px-10 md:grid-cols-4">

          <div className="md:col-span-2">

            <div className="font-serif text-3xl">
              APEX
            </div>

            <p className="mt-1 text-[10px] tracking-[0.4em] text-white/40">
              PUBLIC SCHOOL
            </p>

            <p className="mt-7 max-w-md text-sm leading-7 text-white/40">
              A learning community focused on curiosity, character,
              confidence and opportunity.
            </p>

          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider">
              Explore
            </p>

            <div className="mt-5 flex flex-col gap-3 text-sm text-white/45">
              <a href="/about-2">About</a>
              <a href="/academic">Academics</a>
              <a href="/online-registration">Admissions</a>
              <a href="/gallery">Gallery</a>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider">
              Connect
            </p>

            <div className="mt-5 flex flex-col gap-3 text-sm text-white/45">
              <a href="/contact">Contact</a>
              <a href="/notices">Notices</a>
              <a href="/virtual-tour">Virtual Tour</a>
            </div>
          </div>

        </div>

        <div className="mx-auto mt-14 max-w-[1300px] border-t border-white/10 px-6 pt-6 text-xs text-white/25 md:px-10">
          © Apex Public School. All rights reserved.
        </div>

      </footer>
    </main>
  );
}

function ArrowUpRightIcon() {
  return (
    <span className="text-white/30 transition group-hover:text-[#C96B4B]">
      <ArrowRight size={18} />
    </span>
  );
}








