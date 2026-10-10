import {
  ArrowUpRight,
  Award,
  FileText,
  Trophy,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type ResultBanner = {
  id: string;
  title: string;
  session: string;
  exam: string;
  description: string | null;
  image_url: string | null;
  pdf_url: string | null;
  highest_score: string | null;
  total_distinctions: string | null;
  sort_order: number;
  is_active: boolean;
};

export default async function CBSEResultsPage() {
  const { data, error } = await supabase
    .from("cbse_result_banners")
    .select(`
      id,
      title,
      session,
      exam,
      description,
      image_url,
      pdf_url,
      highest_score,
      total_distinctions,
      sort_order,
      is_active
    `)
    .eq("is_active", true)
    .order("sort_order", {
      ascending: true,
    });

  const banners =
    !error && data
      ? (data as ResultBanner[])
      : [];

  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#10203A]">

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative overflow-hidden bg-[#102A56]">

        <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full border border-white/10" />

        <div className="absolute -right-40 top-10 h-[520px] w-[520px] rounded-full border border-white/10" />

        <div className="relative mx-auto max-w-[1500px] px-6 py-24 md:px-10 md:py-32">

          <div className="max-w-4xl">

            <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#F5F0E6]/50">
              Academic Achievement
            </p>

            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.055em] text-white md:text-7xl">
              CBSE Results
            </h1>

            <p className="mt-7 max-w-2xl text-sm leading-7 text-white/55 md:text-base">
              Celebrating the achievement, dedication and
              academic excellence of Apex Public School students.
            </p>

          </div>

        </div>
      </section>

      {/* ==================================================
          RESULTS
      ================================================== */}

      <section className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28">

        {banners.length === 0 ? (

          <div className="rounded-[2.5rem] bg-[#102A56] px-8 py-20 text-center text-white md:px-12">

            <Trophy
              size={36}
              className="mx-auto text-[#F5F0E6]/60"
            />

            <h2 className="mt-6 text-2xl font-semibold">
              Results will be published here
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/45">
              The latest CBSE result announcements will
              appear here once published by the school.
            </p>

          </div>

        ) : (

          <div className="space-y-20">

            {banners.map(
              (banner, index) => (
                <article
                  key={banner.id}
                  className="overflow-hidden rounded-[2.5rem] border border-[#102A56]/10 bg-white shadow-[0_30px_100px_rgba(16,42,86,0.08)]"
                >

                  {/* ==========================================
                      TITLE AREA
                  ========================================== */}

                  <div className="p-7 md:p-10">

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

                      <div>

                        <div className="flex flex-wrap items-center gap-3">

                          <span className="rounded-full bg-[#102A56] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-white">
                            {banner.session}
                          </span>

                          <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#102A56]/30">
                            {banner.exam}
                          </span>

                        </div>

                        <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] text-[#102A56] md:text-5xl">
                          {banner.title}
                        </h2>

                        {banner.description && (
                          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#10203A]/50">
                            {banner.description}
                          </p>
                        )}

                      </div>

                      {/* STATS */}

                      <div className="flex flex-wrap gap-3">

                        {banner.highest_score && (
                          <div className="rounded-2xl bg-[#F4F1EA] px-5 py-4">
                            <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/35">
                              Highest Score
                            </p>

                            <p className="mt-2 text-2xl font-semibold text-[#102A56]">
                              {banner.highest_score}
                            </p>
                          </div>
                        )}

                        {banner.total_distinctions && (
                          <div className="rounded-2xl bg-[#F4F1EA] px-5 py-4">
                            <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/35">
                              Distinctions
                            </p>

                            <p className="mt-2 text-2xl font-semibold text-[#102A56]">
                              {banner.total_distinctions}
                            </p>
                          </div>
                        )}

                      </div>

                    </div>

                  </div>

                  {/* ==========================================
                      RESULT BANNER
                  ========================================== */}

                  {banner.image_url ? (

                    <div className="bg-[#0B2146] px-3 pb-3 md:px-5 md:pb-5">

                      <div className="overflow-hidden rounded-[1.75rem] bg-black">

                        <img
                          src={banner.image_url}
                          alt={banner.title}
                          className="
                            block
                            h-auto
                            w-full
                            object-contain
                          "
                        />

                      </div>

                    </div>

                  ) : (

                    <div className="mx-7 mb-7 rounded-[2rem] bg-[#102A56] px-8 py-20 text-center text-white md:mx-10 md:mb-10">

                      <Award
                        size={34}
                        className="mx-auto text-[#F5F0E6]/60"
                      />

                      <p className="mt-5 text-sm text-white/50">
                        Result banner coming soon.
                      </p>

                    </div>

                  )}

                  {/* ==========================================
                      FOOTER
                  ========================================== */}

                  <div className="flex flex-col gap-4 p-7 md:flex-row md:items-center md:justify-between md:p-10">

                    <div className="flex items-center gap-3">

                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#102A56]/5 text-[#102A56]">
                        <Trophy size={18} />
                      </div>

                      <div>

                        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#102A56]/30">
                          Apex Public School
                        </p>

                        <p className="mt-1 text-sm text-[#10203A]/50">
                          Academic achievement
                        </p>

                      </div>

                    </div>

                    {banner.pdf_url && (
                     <a
  href={banner.pdf_url}
  target="_blank"
  rel="noreferrer"
  className="
    inline-flex
    items-center
    justify-center
    gap-2
    rounded-full
    bg-[#102A56]
    px-5
    py-3
    text-sm
    font-semibold
    !text-[#F5F0E6]
    transition
    duration-300
    hover:bg-[#1B3D73]
    hover:-translate-y-0.5
  "
>
  <span className="!text-[#F5F0E6]">
    View complete result
  </span>

  <ArrowUpRight
    size={15}
    className="
      !text-[#F5F0E6]
      transition-transform
      duration-300
      group-hover:translate-x-0.5
    "
  />
</a>
                    )}

                  </div>

                </article>
              )
            )}

          </div>

        )}

      </section>

      {/* ==================================================
          NOTE
      ================================================== */}

      <section className="mx-auto max-w-[1500px] px-6 pb-20 md:px-10 md:pb-28">

        <div className="rounded-[2.5rem] bg-[#102A56] p-8 md:p-10">

          <div className="flex items-start gap-4">

            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-[#F5F0E6]">
              <FileText size={18} />
            </div>

            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/35">
                Official Results
              </p>

              <p className="mt-3 max-w-4xl text-sm leading-7 text-white/55">
                Result information and result banners are
                published by Apex Public School for the
                corresponding academic session.
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}