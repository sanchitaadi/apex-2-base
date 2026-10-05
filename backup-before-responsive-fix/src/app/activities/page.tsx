"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Image as ImageIcon,
  Sparkles,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase/browser";

type Activity = {
  id: string;
  title: string;
  slug: string | null;
  category: string;
  description: string | null;
  image_url: string | null;
  event_date: string | null;
  external_url: string | null;
  document_url: string | null;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  general: "Activities",
  cultural: "Cultural",
  sports: "Sports & Games",
  excursions: "Educational Excursions",
  "life-skills": "Life Skills",
  arts: "Art, Music & Dance",
  projects: "Projects & Experiential Learning",
  workshops: "Workshops & Training",
  social: "Social Awareness",
  competitions: "Competitions",
};

const FALLBACK_CATEGORIES = [
  "all",
  "cultural",
  "sports",
  "excursions",
  "life-skills",
  "arts",
  "projects",
  "workshops",
  "social",
  "competitions",
];

function formatCategory(category: string) {
  return (
    CATEGORY_LABELS[category] ||
    category
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
}

function formatDate(date: string | null) {
  if (!date) return null;

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );

  useEffect(() => {
    async function loadActivities() {
      setLoading(true);

      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("is_active", true)
        .order("is_featured", { ascending: false })
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Activities fetch error:", error);
        setActivities([]);
      } else {
        setActivities((data || []) as Activity[]);
      }

      setLoading(false);
    }

    loadActivities();
  }, []);

  const categories = useMemo(() => {
    const existing = Array.from(
      new Set(activities.map((activity) => activity.category))
    );

    const ordered = FALLBACK_CATEGORIES.filter(
      (category) => category === "all" || existing.includes(category)
    );

    for (const category of existing) {
      if (!ordered.includes(category)) {
        ordered.push(category);
      }
    }

    return ordered;
  }, [activities]);

  const filteredActivities = useMemo(() => {
    if (activeCategory === "all") {
      return activities;
    }

    return activities.filter(
      (activity) => activity.category === activeCategory
    );
  }, [activities, activeCategory]);

  const featuredActivities = useMemo(
    () => activities.filter((activity) => activity.is_featured).slice(0, 3),
    [activities]
  );

  return (
    <main className="min-h-screen bg-[#f5f0e6] text-[#102a56]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#102a56]">
        <div className="absolute inset-0 opacity-[0.08]">
          <div className="absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full border border-white" />
          <div className="absolute right-[-120px] bottom-[-180px] h-[520px] w-[520px] rounded-full border border-white" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-12">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/90">
              <Sparkles className="h-4 w-4" />
              Life Beyond the Classroom
            </div>

            <h1 className="text-5xl font-semibold tracking-[-0.04em] text-[#f5f0e6] md:text-6xl lg:text-7xl">
              Activities
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/75 md:text-xl">
              Creating opportunities, challenging minds, encouraging
              innovation and sustaining excitement through experiences beyond
              the conventional classroom.
            </p>

            <div className="mt-10 flex flex-wrap gap-4 text-sm text-white/70">
              <span className="border-l border-white/30 pl-4">
                Cultural Activities
              </span>
              <span className="border-l border-white/30 pl-4">
                Sports & Games
              </span>
              <span className="border-l border-white/30 pl-4">
                Educational Excursions
              </span>
              <span className="border-l border-white/30 pl-4">
                Life Skills
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#102a56]/55">
              The Apex Experience
            </p>

            <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.03em] md:text-5xl">
              Learning that continues beyond the timetable.
            </h2>
          </div>

          <p className="max-w-2xl text-base leading-7 text-[#102a56]/65 md:text-lg">
            Activities at Apex are designed to give students opportunities to
            participate, create, collaborate and discover their strengths
            through academic, cultural, sporting and experiential
            experiences.
          </p>
        </div>
      </section>

      {/* FEATURED */}
      {featuredActivities.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-10 md:px-10 lg:px-12">
          <div className="mb-7 flex items-end justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#102a56]/50">
                Featured
              </p>
              <h2 className="mt-2 text-2xl font-semibold md:text-3xl">
                Highlights from school life
              </h2>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {featuredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                featured
                onClick={() => setSelectedActivity(activity)}
              />
            ))}
          </div>
        </section>
      )}

      {/* CATEGORY FILTER */}
      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-12">
        <div className="rounded-[28px] border border-[#102a56]/10 bg-white/45 p-4 shadow-[0_16px_60px_rgba(16,42,86,0.06)] md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#102a56] text-[#f5f0e6]">
                <Filter className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-semibold">Explore activities</p>
                <p className="text-xs text-[#102a56]/50">
                  Browse by activity type
                </p>
              </div>
            </div>

            <div className="relative">
              <select
                value={activeCategory}
                onChange={(event) => setActiveCategory(event.target.value)}
                className="appearance-none rounded-full border border-[#102a56]/15 bg-white px-5 py-3 pr-11 text-sm font-semibold text-[#102a56] outline-none transition focus:border-[#102a56]/40"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all"
                      ? "All Activities"
                      : formatCategory(category)}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#102a56]/55" />
            </div>
          </div>

          <div className="mt-5 hidden flex-wrap gap-2 lg:flex">
            {categories.map((category) => {
              const active = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-[#102a56] text-[#f5f0e6]"
                      : "bg-[#102a56]/5 text-[#102a56]/65 hover:bg-[#102a56]/10"
                  }`}
                >
                  {category === "all"
                    ? "All Activities"
                    : formatCategory(category)}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ACTIVITIES GRID */}
      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10 lg:px-12">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-[28px] border border-[#102a56]/10 bg-white/45"
              >
                <div className="aspect-[16/10] animate-pulse bg-[#102a56]/10" />
                <div className="space-y-3 p-6">
                  <div className="h-3 w-24 animate-pulse rounded bg-[#102a56]/10" />
                  <div className="h-6 w-3/4 animate-pulse rounded bg-[#102a56]/10" />
                  <div className="h-16 w-full animate-pulse rounded bg-[#102a56]/10" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-[#102a56]/20 bg-white/35 px-6 py-20 text-center">
            <ImageIcon className="mx-auto h-10 w-10 text-[#102a56]/30" />

            <h3 className="mt-5 text-2xl font-semibold">
              Activities will appear here
            </h3>

            <p className="mx-auto mt-3 max-w-lg text-[#102a56]/55">
              No activities are currently published for this category.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onClick={() => setSelectedActivity(activity)}
              />
            ))}
          </div>
        )}
      </section>

      {/* DETAIL MODAL */}
      {selectedActivity && (
        <ActivityModal
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </main>
  );
}

function ActivityCard({
  activity,
  featured = false,
  onClick,
}: {
  activity: Activity;
  featured?: boolean;
  onClick: () => void;
}) {
  const formattedDate = formatDate(activity.event_date);

  return (
    <article
      className={`group overflow-hidden rounded-[28px] border border-[#102a56]/10 bg-white/65 shadow-[0_18px_60px_rgba(16,42,86,0.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(16,42,86,0.12)] ${
        featured ? "lg:min-h-[410px]" : ""
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        className="block w-full text-left"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-[#102a56]/8">
          {activity.image_url ? (
            <img
              src={activity.image_url}
              alt={activity.title}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#102a56]">
              <ImageIcon className="h-10 w-10 text-[#f5f0e6]/25" />
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

          <div className="absolute left-5 top-5 rounded-full bg-[#f5f0e6] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#102a56]">
            {formatCategory(activity.category)}
          </div>

          {formattedDate && (
            <div className="absolute bottom-5 left-5 flex items-center gap-1.5 text-xs font-medium text-white">
              <CalendarDays className="h-3.5 w-3.5" />
              {formattedDate}
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-5">
            <h3 className="text-xl font-semibold leading-tight tracking-[-0.02em]">
              {activity.title}
            </h3>

            <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#102a56]/10 transition group-hover:bg-[#102a56] group-hover:text-[#f5f0e6]">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>

          {activity.description && (
            <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#102a56]/60">
              {activity.description}
            </p>
          )}
        </div>
      </button>
    </article>
  );
}

function ActivityModal({
  activity,
  onClose,
}: {
  activity: Activity;
  onClose: () => void;
}) {
  const formattedDate = formatDate(activity.event_date);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[32px] bg-[#f5f0e6] shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#102a56] text-[#f5f0e6] shadow-lg"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="min-h-[320px] bg-[#102a56] lg:min-h-[600px]">
            {activity.image_url ? (
              <img
                src={activity.image_url}
                alt={activity.title}
                className="h-full min-h-[320px] w-full object-cover lg:min-h-[600px]"
              />
            ) : (
              <div className="flex h-full min-h-[320px] items-center justify-center lg:min-h-[600px]">
                <ImageIcon className="h-16 w-16 text-[#f5f0e6]/20" />
              </div>
            )}
          </div>

          <div className="flex flex-col p-7 md:p-10">
            <span className="w-fit rounded-full bg-[#102a56] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#f5f0e6]">
              {formatCategory(activity.category)}
            </span>

            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-4xl">
              {activity.title}
            </h2>

            {formattedDate && (
              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[#102a56]/55">
                <CalendarDays className="h-4 w-4" />
                {formattedDate}
              </div>
            )}

            {activity.description && (
              <div className="mt-8 text-base leading-7 text-[#102a56]/70">
                {activity.description}
              </div>
            )}

            <div className="mt-auto pt-10">
              {activity.document_url && (
                <a
                  href={activity.document_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mb-3 flex items-center justify-center gap-2 rounded-full bg-[#102a56] px-5 py-3 text-sm font-semibold text-[#f5f0e6] transition hover:bg-[#193c78]"
                >
                  View Document
                  <ArrowRight className="h-4 w-4" />
                </a>
              )}

              {activity.external_url && (
                <a
                  href={activity.external_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full border border-[#102a56]/15 px-5 py-3 text-sm font-semibold text-[#102a56] transition hover:bg-white"
                >
                  Open Related Link
                  <ArrowRight className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}