"use client";

const students =
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1800&q=85";

export default function CreativeDemo() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fff8ef] text-[#171717]">
      {/* Header */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7">
        <div className="text-xl font-black">
          APEX<span className="text-orange-500">!</span>
        </div>

        <nav className="hidden gap-8 font-medium md:flex">
          <span>Discover</span>
          <span>Learn</span>
          <span>Play</span>
          <span>Create</span>
          <span>Connect</span>
        </nav>

        <button className="rounded-full bg-[#171717] px-6 py-3 text-white">
          Visit Apex
        </button>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-28">
        <div>
          <div className="mb-6 inline-block -rotate-2 rounded-full bg-yellow-300 px-5 py-2 text-sm font-bold">
            HELLO, FUTURE! 👋
          </div>

          <h1 className="text-7xl font-black leading-[0.82] tracking-tight md:text-9xl">
            LEARN.
            <br />
            PLAY.
            <br />
            <span className="text-orange-500">CREATE.</span>
            <br />
            GROW.
          </h1>

          <p className="mt-8 max-w-lg text-lg leading-8 text-black/60">
            A school where students discover what they love, build confidence
            and turn ideas into possibilities.
          </p>

          <button className="mt-8 rounded-full bg-orange-500 px-8 py-4 font-bold text-white">
            Discover Apex →
          </button>
        </div>

        <div className="relative">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-yellow-300" />

          <img
            src={students}
            alt="Students"
            className="relative aspect-[4/5] w-full rounded-[3rem] object-cover"
          />

          <div className="absolute -bottom-8 -left-8 rotate-3 rounded-3xl bg-white p-6 shadow-xl">
            <p className="text-3xl font-black">5000+</p>
            <p className="text-sm text-black/50">Apex learners</p>
          </div>
        </div>
      </section>

      {/* Explore */}
      <section className="bg-[#171717] px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="text-6xl font-black">WHAT'S YOUR THING?</h2>
            <p className="max-w-sm text-white/50">
              There's always something happening at Apex.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-4">
            {[
              ["🏀", "SPORTS", "Move. Compete. Grow."],
              ["🎨", "ARTS", "Imagine. Express. Create."],
              ["🤖", "STEM", "Build. Experiment. Discover."],
              ["🎭", "CULTURE", "Perform. Connect. Celebrate."],
            ].map(([emoji, title, text]) => (
              <div
                key={title}
                className="rounded-[2rem] bg-white/10 p-7 transition hover:-translate-y-3 hover:bg-white/15"
              >
                <div className="text-5xl">{emoji}</div>
                <h3 className="mt-16 text-2xl font-black">{title}</h3>
                <p className="mt-2 text-white/50">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Happenings */}
      <section className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
            <div>
              <p className="font-bold uppercase tracking-widest text-orange-500">
                Happening Now
              </p>

              <h2 className="mt-5 text-6xl font-black leading-none">
                SCHOOL
                <br />
                LIFE.
              </h2>
            </div>

            <div className="space-y-4">
              {[
                ["12 SEP", "Inter-School Sports Meet"],
                ["18 SEP", "Annual Cultural Festival"],
                ["25 SEP", "Innovation & Science Fair"],
                ["02 OCT", "Community Service Week"],
              ].map(([date, title]) => (
                <div
                  key={title}
                  className="flex items-center justify-between border-b-2 border-black/10 py-6"
                >
                  <div>
                    <p className="text-sm font-bold text-orange-500">{date}</p>
                    <h3 className="mt-2 text-2xl font-bold">{title}</h3>
                  </div>

                  <span className="text-3xl">↗</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl rounded-[3rem] bg-yellow-300 px-8 py-20 text-center">
          <h2 className="text-6xl font-black md:text-8xl">
            COME SEE
            <br />
            APEX.
          </h2>

          <button className="mt-8 rounded-full bg-black px-8 py-4 font-bold text-white">
            Plan Your Visit →
          </button>
        </div>
      </section>

      <footer className="px-6 py-10 text-center text-sm text-black/50">
        © 2026 Apex Public School • Creative Design Concept
      </footer>
    </main>
  );
}