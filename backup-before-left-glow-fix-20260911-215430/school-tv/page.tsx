import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Play,
  Youtube,
} from "lucide-react";

const YOUTUBE_CHANNEL =
  "https://www.youtube.com/channel/UC9dlhI-YU3OudzcqdPTFbrQ";

export default function SchoolTVPage() {
  return (
    <main className="min-h-screen bg-[#F5F0E6] text-[#10203A]">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#102A56] text-white">
        {/* TOP RIGHT ATMOSPHERIC GLOW */}
        <div className="pointer-events-none absolute -right-48 -top-48 h-[650px] w-[650px] rounded-full bg-[#8DB9E5]/10 blur-[140px]" />

        <div className="relative mx-auto max-w-[1500px] px-6 pb-24 pt-36 md:px-10 md:pb-32 lg:px-14 lg:pt-40">
          {/* BACK */}

          <Link
            href="/"
            className="
              inline-flex
              items-center
              gap-2
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.25em]
              text-[#F5F0E6]/50
              transition
              duration-300
              hover:text-white
            "
          >
            <ArrowLeft size={13} />
            Apex Public School
          </Link>

          {/* EYEBROW */}

          <div className="mt-14 flex items-center gap-3">
            <span className="h-px w-10 bg-white/25" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
              Media &amp; Stories
            </p>
          </div>

          {/* TITLE */}

          <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[0.9] tracking-[-0.06em] md:text-7xl lg:text-[6.2vw]">
            Apex School TV
          </h1>

          {/* DESCRIPTION */}

          <p className="mt-8 max-w-2xl text-base leading-8 text-white/55 md:text-lg">
            Discover videos, events, activities, celebrations and memorable
            moments from life at Apex Public School.
          </p>

          {/* YOUTUBE BUTTON */}

          <a
            href={YOUTUBE_CHANNEL}
            target="_blank"
            rel="noreferrer"
            className="
              school-tv-youtube-button
              mt-9
              inline-flex
              items-center
              gap-2
              rounded-full
              px-5
              py-3.5
              text-sm
              font-semibold
              transition
              duration-300
              hover:-translate-y-0.5
            "
          >
            <Youtube size={16} />

            <span>Visit Apex School TV</span>

            <ExternalLink size={14} />
          </a>
        </div>
      </section>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <section>
        <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14 lg:py-32">
          {/* =================================================
              FEATURE + INFO
          ================================================== */}

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            {/* =================================================
                YOUTUBE FEATURE CARD
            ================================================== */}

            <article className="relative overflow-hidden rounded-[2rem] bg-[#102A56] p-8 text-white md:p-12 lg:p-14">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#8DB9E5]/10 blur-[100px]" />

              <div className="relative">
                {/* TOP */}

                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/35">
                    Apex School TV
                  </p>

                  <div className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/[0.06]">
                    <Play size={18} fill="currentColor" />
                  </div>
                </div>

                {/* TITLE */}

                <h2 className="mt-8 max-w-2xl text-4xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-5xl">
                  Stories from
                  <br />
                  the Apex community.
                </h2>

                {/* TEXT */}

                <p className="mt-7 max-w-2xl text-sm leading-7 text-white/55 md:text-base">
                  Follow Apex School TV for videos and visual stories from the
                  school community, including celebrations, student
                  activities, school events and achievements.
                </p>

                {/* YOUTUBE LINK */}

                <a
                  href={YOUTUBE_CHANNEL}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    school-tv-youtube-button
                    group
                    mt-8
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    px-5
                    py-3.5
                    text-sm
                    font-semibold
                    transition
                    duration-300
                    hover:-translate-y-0.5
                  "
                >
                  <Youtube size={16} />

                  <span>Open YouTube Channel</span>

                  <ExternalLink
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </a>
              </div>
            </article>

            {/* =================================================
                INFO
            ================================================== */}

            <article className="rounded-[2rem] bg-white p-8 md:p-12 lg:p-14">
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#102A56]/35">
                Official Apex Media
              </p>

              <h2 className="mt-6 max-w-xl text-3xl font-semibold leading-[1.05] tracking-[-0.045em] text-[#102A56] md:text-4xl">
                Experience school life beyond the classroom.
              </h2>

              <p className="mt-7 text-sm leading-8 text-[#10203A]/60 md:text-base">
                Apex School TV connects the school community with video
                stories, celebrations and moments from everyday life at Apex
                Public School.
              </p>

              {/* CHANNEL */}

              <div className="mt-10 border-t border-[#102A56]/10 pt-7">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#102A56] text-white">
                    <Youtube size={17} />
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-[0.22em] text-[#102A56]/30">
                      YouTube
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#102A56]">
                      Apex School TV
                    </p>
                  </div>
                </div>

                <a
                  href={YOUTUBE_CHANNEL}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    mt-6
                    inline-flex
                    items-center
                    gap-2
                    text-xs
                    font-semibold
                    text-[#102A56]
                    transition
                    hover:gap-3
                  "
                >
                  Visit channel
                  <ArrowRight size={14} />
                </a>
              </div>
            </article>
          </div>

          {/* =================================================
              OFFICIAL CHANNEL
          ================================================== */}

          <article className="mt-6 overflow-hidden rounded-[2rem] border border-[#102A56]/10 bg-white">
            <div className="grid gap-8 p-8 md:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#102A56]/30">
                  Official channel
                </p>

                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.035em] text-[#102A56] md:text-3xl">
                  Follow Apex School TV
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#10203A]/50">
                  Stay connected with the school&apos;s latest videos and
                  visual stories through the official Apex School TV YouTube
                  channel.
                </p>
              </div>

              <a
                href={YOUTUBE_CHANNEL}
                target="_blank"
                rel="noreferrer"
                className="
                  group
                  inline-flex
                  shrink-0
                  items-center
                  gap-2
                  rounded-full
                  bg-[#102A56]
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  !text-white
                  transition
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#1B3D73]
                "
              >
                <Youtube size={16} />

                <span>Open YouTube</span>

                <ExternalLink
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </article>

          {/* =================================================
              SCHOOL INFORMATION
          ================================================== */}

          <div className="mt-6 rounded-[2rem] bg-[#102A56] p-8 text-white md:p-10 lg:p-12">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                  School
                </p>

                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">
                  Apex Public School
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/50">
                  Apex Road, B-Block, Sant Nagar,
                  <br />
                  Burari, Delhi – 110084
                </p>
              </div>

              <div className="md:text-right">
                <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                  Connect
                </p>

                <p className="mt-4 text-sm text-white/60">
                  09990061747
                </p>

                <a
                  href="mailto:contacts.apexschool@gmail.com"
                  className="mt-2 block text-sm text-white/60 hover:text-white"
                >
                  contacts.apexschool@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* =================================================
              BACK
          ================================================== */}

          <div className="mt-12 border-t border-[#102A56]/10 pt-8">
            <Link
              href="/"
              className="
                group
                inline-flex
                items-center
                gap-2
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[#102A56]/50
                transition
                hover:text-[#102A56]
              "
            >
              <ArrowLeft
                size={14}
                className="transition-transform group-hover:-translate-x-1"
              />

              Back to Apex Public School
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}