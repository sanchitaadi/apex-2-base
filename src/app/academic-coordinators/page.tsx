import {
  ArrowUpRight,
  BookOpen,
  GraduationCap,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type AcademicCoordinator = {
  id: string;
  class_name: string;
  coordinator_name: string;
  designation: string | null;
  session: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export default async function AcademicCoordinatorsPage() {
  const { data } = await supabase
    .from("academic_coordinators")
    .select(`
      id,
      class_name,
      coordinator_name,
      designation,
      session,
      description,
      image_url,
      sort_order,
      is_active
    `)
    .eq("is_active", true)
    .order("sort_order", {
      ascending: true,
    });

  const coordinators =
    (data || []) as AcademicCoordinator[];

  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#10203A]">

      {/* HERO */}

      <section className="relative overflow-hidden bg-[#102A56]">

        <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full border border-white/10" />

        <div className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full border border-white/10" />

        <div className="relative mx-auto max-w-[1500px] px-6 py-24 md:px-10 md:py-32">

          <p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-[#F5F0E6]/50">
            Academic Team
          </p>

          <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.055em] text-white md:text-7xl">
            Academic Coordinators
          </h1>

          <p className="mt-7 max-w-2xl text-sm leading-7 text-white/55 md:text-base">
            Meet the academic coordinators responsible for
            supporting learning and academic coordination across
            the school.
          </p>

        </div>

      </section>

      {/* SESSION */}

      <section className="mx-auto max-w-[1500px] px-6 pt-16 md:px-10 md:pt-24">

        <div className="rounded-[2rem] bg-[#102A56] p-7 text-white md:p-9">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-4">

              <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/10">
                <GraduationCap size={21} />
              </div>

              <div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/35">
                  Published academic team
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {coordinators[0]?.session ||
                    "Academic Session"}
                </h2>

              </div>

            </div>

            <p className="text-sm text-white/45">
              {coordinators.length} coordinators
            </p>

          </div>

        </div>

      </section>

      {/* COORDINATORS */}

      <section className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28">

        {coordinators.length === 0 ? (

          <div className="rounded-[2.5rem] bg-[#102A56] px-8 py-20 text-center text-white">

            <BookOpen
              size={34}
              className="mx-auto text-white/40"
            />

            <p className="mt-5 text-sm text-white/50">
              Academic coordinator information is currently
              unavailable.
            </p>

          </div>

        ) : (

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {coordinators.map(
              (coordinator, index) => (
                <article
                  key={coordinator.id}
                  className="
                    group
                    overflow-hidden
                    rounded-[2rem]
                    border
                    border-[#102A56]/10
                    bg-white
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_25px_70px_rgba(16,42,86,0.08)]
                  "
                >

                  {/* PHOTO */}

                  <div className="relative aspect-[4/4.2] overflow-hidden bg-[#102A56]/5">

                    {coordinator.image_url ? (
                      <img
                        src={
                          coordinator.image_url
                        }
                        alt={
                          coordinator.coordinator_name
                        }
                        className="
                          h-full
                          w-full
                          object-cover
                          transition
                          duration-500
                          group-hover:scale-[1.03]
                        "
                      />
                    ) : (
                      <div className="grid h-full place-items-center bg-[#102A56] text-white">

                        <div className="text-center">

                          <GraduationCap
                            size={35}
                            className="mx-auto text-white/35"
                          />

                          <p className="mt-3 text-xs text-white/35">
                            Academic Coordinator
                          </p>

                        </div>

                      </div>
                    )}

                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#102A56] backdrop-blur">
                      {coordinator.class_name}
                    </div>

                  </div>

                  {/* DETAILS */}

                  <div className="p-6">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/30">
                      Coordinator {String(index + 1).padStart(2, "0")}
                    </p>

                    <h3 className="mt-3 text-xl font-semibold tracking-[-0.025em] text-[#102A56]">
                      {coordinator.coordinator_name}
                    </h3>

                    <p className="mt-2 text-sm font-medium text-[#10203A]/45">
                      {coordinator.designation ||
                        "Academic Coordinator"}
                    </p>

                    {coordinator.description && (
                      <p className="mt-4 text-sm leading-6 text-[#10203A]/50">
                        {coordinator.description}
                      </p>
                    )}

                  </div>

                </article>
              )
            )}

          </div>

        )}

      </section>

      {/* NOTE */}

      <section className="mx-auto max-w-[1500px] px-6 pb-20 md:px-10 md:pb-28">

        <div className="rounded-[2.5rem] bg-[#102A56] p-8 md:p-10">

          <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/35">
            Apex Public School
          </p>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/55">
            Academic coordinator assignments can be updated
            through the school administration CMS as the academic
            team changes.
          </p>

        </div>

      </section>

    </main>
  );
}