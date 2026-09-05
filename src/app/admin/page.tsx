"use client";

import { useEffect, useState } from "react";
import type { ElementType } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Activity,
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  FileText,
  GalleryHorizontal,
  ImageIcon,
  Loader2,
  Plus,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type CountCard = {
  label: string;
  count: number;
  href: string;
  icon: ElementType;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [counts, setCounts] = useState<CountCard[]>([
    {
      label: "Notices",
      count: 0,
      href: "/admin/notices",
      icon: Bell,
    },
    {
      label: "Faculty",
      count: 0,
      href: "/admin/faculty",
      icon: Users,
    },
    {
      label: "Events",
      count: 0,
      href: "/admin/events",
      icon: CalendarDays,
    },
    {
      label: "Gallery",
      count: 0,
      href: "/admin/gallery",
      icon: GalleryHorizontal,
    },
    {
      label: "Activities",
      count: 0,
      href: "/admin/activities",
      icon: Activity,
    },
    {
      label: "Achievements",
      count: 0,
      href: "/admin/achievements",
      icon: Trophy,
    },
  ]);

  const [loading, setLoading] = useState(true);

  /* ============================================================
     ADMIN AUTHORIZATION
  ============================================================ */

  useEffect(() => {
    let mounted = true;

    async function checkAuthorization() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.replace("/admin/login");
          return;
        }

        const { data: admin, error: adminError } =
          await supabase
            .from("admin_users")
            .select(
              "id, email, full_name, role, is_active"
            )
            .eq("id", user.id)
            .maybeSingle();

        if (
          adminError ||
          !admin ||
          !admin.is_active ||
          !["admin", "super_admin"].includes(admin.role)
        ) {
          await supabase.auth.signOut();

          router.replace("/admin/login");
          return;
        }

        if (!mounted) return;

        setAuthorized(true);
        setCheckingAuth(false);
      } catch (error) {
        console.error(
          "Admin authorization failed:",
          error
        );

        await supabase.auth.signOut();

        router.replace("/admin/login");
      }
    }

    checkAuthorization();

    return () => {
      mounted = false;
    };
  }, [router]);

  /* ============================================================
     LOAD DASHBOARD COUNTS
  ============================================================ */

  useEffect(() => {
    if (!authorized) return;

    async function loadCounts() {
      try {
        const [
          notices,
          faculty,
          events,
          albums,
          activities,
          achievements,
        ] = await Promise.all([
          supabase
            .from("notices")
            .select("*", {
              count: "exact",
              head: true,
            }),

          supabase
            .from("faculty")
            .select("*", {
              count: "exact",
              head: true,
            }),

          supabase
            .from("events")
            .select("*", {
              count: "exact",
              head: true,
            }),

          supabase
            .from("gallery_albums")
            .select("*", {
              count: "exact",
              head: true,
            }),

          supabase
            .from("activities")
            .select("*", {
              count: "exact",
              head: true,
            }),

          supabase
            .from("achievements")
            .select("*", {
              count: "exact",
              head: true,
            }),
        ]);

        setCounts((current) =>
          current.map((item) => {
            const map: Record<string, number> = {
              Notices: notices.count ?? 0,
              Faculty: faculty.count ?? 0,
              Events: events.count ?? 0,
              Gallery: albums.count ?? 0,
              Activities: activities.count ?? 0,
              Achievements:
                achievements.count ?? 0,
            };

            return {
              ...item,
              count: map[item.label] ?? 0,
            };
          })
        );
      } catch (error) {
        console.error(
          "Dashboard counts failed:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadCounts();
  }, [authorized]);

  /* ============================================================
     AUTH LOADING
  ============================================================ */

  if (checkingAuth) {
    return (
      <div className="grid min-h-[70vh] place-items-center">
        <div className="flex flex-col items-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#102A56]">
            <Loader2
              size={20}
              className="animate-spin !text-[#F5F0E6]"
            />
          </div>

          <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#102A56]/40">
            Verifying access
          </p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      {/* ========================================================
          HEADER
      ======================================================== */}

      <section className="mb-8">
        <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#102A56]/35">
          Dashboard
        </p>

        <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-semibold tracking-[-0.055em] text-[#102A56] md:text-5xl">
              Manage Apex.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#10203A]/50">
              Control the website content, media, school
              information and public-facing updates from one
              place.
            </p>
          </div>

          <Link
            href="/"
            target="_blank"
            className="
              group
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[#102A56]
              px-5
              py-3.5
              text-sm
              font-semibold
              !text-[#F5F0E6]
              transition
              duration-300
              hover:-translate-y-0.5
              hover:bg-[#1B3D73]
            "
          >
            <span className="!text-[#F5F0E6]">
              View website
            </span>

            <ArrowRight
              size={15}
              className="
                !text-[#F5F0E6]
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </Link>
        </div>
      </section>

      {/* ========================================================
          AUTH STATUS
      ======================================================== */}

      <section className="mb-8">
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-700/10 bg-emerald-700/[0.05] px-4 py-3">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-700/10">
            <ShieldCheck
              size={15}
              className="!text-emerald-700"
            />
          </div>

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] !text-emerald-800/50">
              Secure CMS
            </p>

            <p className="mt-0.5 text-xs font-medium !text-emerald-800">
              Authorized administrator session
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          STATS
      ======================================================== */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {counts.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className="
                group
                rounded-[1.5rem]
                border
                border-[#102A56]/10
                bg-white/70
                p-6
                transition
                duration-300
                hover:-translate-y-1
                hover:bg-white
                hover:shadow-[0_18px_50px_rgba(16,42,86,0.08)]
              "
            >
              <div className="flex items-start justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#102A56]/[0.06]">
                  <Icon
                    size={18}
                    className="!text-[#102A56]"
                  />
                </div>

                <ArrowRight
                  size={16}
                  className="
                    !text-[#102A56]/25
                    transition
                    duration-300
                    group-hover:translate-x-1
                    group-hover:!text-[#102A56]
                  "
                />
              </div>

              <div className="mt-10">
                <div className="text-4xl font-semibold tracking-[-0.05em] text-[#102A56]">
                  {loading ? "—" : item.count}
                </div>

                <div className="mt-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/35">
                  {item.label}
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      {/* ========================================================
          QUICK ACTIONS
      ======================================================== */}

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] bg-[#102A56] p-7 text-white md:p-9">
          <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
            Quick actions
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-white">
            What do you want to update?
          </h2>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <QuickAction
              href="/admin/notices"
              icon={Bell}
              label="Add Notice"
            />

            <QuickAction
              href="/admin/faculty"
              icon={Users}
              label="Add Faculty"
            />

            <QuickAction
              href="/admin/hero"
              icon={ImageIcon}
              label="Edit Hero"
            />

            <QuickAction
              href="/admin/gallery"
              icon={GalleryHorizontal}
              label="Upload Gallery"
            />
          </div>
        </div>

        {/* ======================================================
            CMS ROADMAP
        ====================================================== */}

        <div className="rounded-[2rem] border border-[#102A56]/10 bg-white/65 p-7 md:p-9">
          <p className="text-[9px] uppercase tracking-[0.25em] text-[#102A56]/30">
            CMS roadmap
          </p>

          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#102A56]">
            Full editing control
          </h2>

          <div className="mt-7 space-y-4">
            <RoadmapItem
              icon={ImageIcon}
              text="Images & media"
              href="/admin/gallery"
            />

            <RoadmapItem
              icon={BookOpen}
              text="Academics"
              href="/admin/academics"
            />

            <RoadmapItem
              icon={FileText}
              text="Notices & documents"
              href="/admin/notices"
            />

            <RoadmapItem
              icon={Users}
              text="Faculty & leadership"
              href="/admin/faculty"
            />
          </div>
        </div>
      </section>

      {/* ========================================================
          SYSTEM INFO
      ======================================================== */}

      <section className="mt-8 rounded-[2rem] border border-[#102A56]/10 bg-white/60 p-7 md:p-9">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-[#102A56]/30">
              Architecture
            </p>

            <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[#102A56]">
              Supabase-powered Apex CMS
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#10203A]/45">
              Changes made here will eventually flow directly
              into the public website without requiring edits
              to the React components.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-700/10 bg-emerald-700/[0.05] px-4 py-3 text-xs font-medium !text-emerald-800">
            Supabase connected
          </div>
        </div>
      </section>
    </div>
  );
}

/* ==============================================================
   QUICK ACTION
============================================================== */

function QuickAction({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: ElementType;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="
        group
        flex
        items-center
        justify-between
        rounded-2xl
        border
        border-white/10
        bg-white/[0.04]
        px-4
        py-4
        transition
        duration-300
        hover:bg-white/[0.08]
      "
    >
      <span className="flex items-center gap-3 !text-white/75">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.06]">
          <Icon
            size={15}
            className="!text-white/70"
          />
        </span>

        <span className="!text-white/75">
          {label}
        </span>
      </span>

      <Plus
        size={15}
        className="
          !text-white/25
          transition
          duration-300
          group-hover:rotate-90
          group-hover:!text-white
        "
      />
    </Link>
  );
}

/* ==============================================================
   ROADMAP ITEM
============================================================== */

function RoadmapItem({
  icon: Icon,
  text,
  href,
}: {
  icon: ElementType;
  text: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="
        group
        flex
        items-center
        justify-between
        rounded-xl
        border
        border-[#102A56]/8
        bg-[#102A56]/[0.025]
        px-4
        py-3.5
        transition
        duration-300
        hover:bg-[#102A56]/[0.06]
      "
    >
      <span className="flex items-center gap-3 !text-[#102A56]">
        <Icon
          size={15}
          className="!text-[#102A56]/40"
        />

        <span className="!text-[#102A56]">
          {text}
        </span>
      </span>

      <ArrowRight
        size={14}
        className="
          !text-[#102A56]/20
          transition
          duration-300
          group-hover:translate-x-1
          group-hover:!text-[#102A56]
        "
      />
    </Link>
  );
}