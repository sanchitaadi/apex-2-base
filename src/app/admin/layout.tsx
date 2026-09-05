"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  Activity,
  Award,
  BookOpen,
  Building,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  GalleryHorizontal,
  GraduationCap,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  Shield,
  Trophy,
  Users,
  Video,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

/* ============================================================
   ADMIN NAVIGATION
============================================================ */

const sections = [
  {
    title: "Dashboard",
    items: [
      {
        label: "Overview",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "Homepage",
    items: [
      {
        label: "Hero",
        href: "/admin/hero",
        icon: ImageIcon,
      },
      {
        label: "Navigation",
        href: "/admin/navigation",
        icon: Menu,
      },
      {
        label: "About Home",
        href: "/admin/about",
        icon: Building2,
      },
      {
        label: "Academics Home",
        href: "/admin/academics",
        icon: BookOpen,
      },
      {
        label: "Campus",
        href: "/admin/campus",
        icon: Building2,
      },
      {
        label: "News & Events",
        href: "/admin/news-events",
        icon: CalendarDays,
      },
      {
        label: "Gallery Preview",
        href: "/admin/gallery-preview",
        icon: GalleryHorizontal,
      },
    ],
  },

  {
    title: "About Apex",
    items: [
    
      {
        label: "About Pages",
        href: "/admin/about2",
        icon: FileText,
      },
      {
        label: "CEO",
        href: "/admin/about/ceo",
        icon: Award,
      },
      {
        label: "Principal",
        href: "/admin/about/principal",
        icon: GraduationCap,
      },
      {
        label: "Head Mistress",
        href: "/admin/about/head-mistress",
        icon: Users,
      },
      {
        label: "Head Academic Coordinator",
        href: "/admin/about/head-academic-coordinator",
        icon: BookOpen,
      },
      {
        label: "Academic Head",
        href: "/admin/about/academic-head",
        icon: BookOpen,
      },
      {
        label: "Manager / VP Admin",
        href: "/admin/about/manager-vp-admin",
        icon: Building,
      },
      {
        label: "Mission & Vision",
        href: "/admin/about/mission-vision",
        icon: Trophy,
      },
    ],
  },

  {
    title: "Academics",
    items: [
      {
        label: "Academics",
        href: "/admin/academics",
        icon: BookOpen,
      },
      {
        label: "Syllabus & Datesheet",
        href: "/admin/academic-resources",
        icon: FileText,
      },
      {
        label: "Holiday Homework",
        href: "/admin/holiday-homework",
        icon: BookOpen,
      },
      {
        label: "Academic Coordinators",
        href: "/admin/academic-coordinators",
        icon: GraduationCap,
      },
      {
        label: "Faculty",
        href: "/admin/faculty",
        icon: Users,
      },
      {
        label: "CBSE Results",
        href: "/admin/cbse-results",
        icon: Trophy,
      },
    
    ],
  },

  {
    title: "Admissions",
    items: [
      {
        label: "Admissions",
        href: "/admin/admissions",
        icon: GraduationCap,
      },
      {
        label: "Admission Criteria",
        href: "/admin/admission-criteria",
        icon: GraduationCap,
      },
      {
        label: "Admission Notice",
        href: "/admin/admission-notice",
        icon: FileText,
      },
      {
        label: "Online Registration",
        href: "/admin/admission-registration-settings",
        icon: FileText,
      },
      {
        label: "Applications",
        href: "/admin/admission-applications",
        icon: Users,
      },
      {
        label: "Fee Structure",
        href: "/admin/fee-structure",
        icon: FileText,
      },
    ],
  },

  {
    title: "Content",
    items: [
      {
        label: "Notices",
        href: "/admin/notices",
        icon: FileText,
      },
      
      {
        label: "Activities",
        href: "/admin/activities",
        icon: Activity,
      },
      {
        label: "SDG",
        href: "/admin/sdg",
        icon: Shield,
      },
      {
        label: "Kaushal Bodh",
        href: "/admin/kaushalbodh",
        icon: Activity,
      },
      {
        label: "Mandatory Disclosure",
        href: "/admin/mandatory-public-disclosure",
        icon: Shield,
      },
    ],
  },

  {
    title: "Publications",
    items: [
      {
        label: "Monthly Newsletter",
        href: "/admin/monthly-newsletter",
        icon: Newspaper,
      },
      {
        label: "The Apexian Accolade",
        href: "/admin/apexian-accolade",
        icon: FileText,
      },
    ],
  },

  {
    title: "Media",
    items: [
      {
        label: "Gallery",
        href: "/admin/gallery",
        icon: GalleryHorizontal,
      },
      {
        label: "Gallery Preview",
        href: "/admin/gallery-preview",
        icon: ImageIcon,
      },
      {
        label: "Virtual Tour",
        href: "/admin/virtual-tour",
        icon: Video,
      },
    ],
  },

  {
    title: "School",
    items: [
      {
        label: "Contact",
        href: "/admin/contact",
        icon: Mail,
      },
      {
        label: "Settings",
        href: "/admin/settings",
        icon: Building2,
      },
      {
        label: "Users",
        href: "/admin/users",
        icon: Shield,
      },
    ],
  },
];

/* ============================================================
   TAB SESSION KEY
============================================================ */

const TAB_SESSION_KEY =
  "apex_cms_tab_authenticated";

/* ============================================================
   ADMIN LAYOUT
============================================================ */

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");

  const authCheckStarted = useRef(false);

  const isLoginPage =
    pathname === "/admin/login";

  /* ============================================================
     AUTH + TAB SECURITY
  ============================================================ */

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      authCheckStarted.current = false;
      return;
    }

    if (authCheckStarted.current) {
      return;
    }

    authCheckStarted.current = true;

    let mounted = true;

    async function checkAccess() {
      try {
        setChecking(true);

        /* ------------------------------------------------------
           STEP 1
           Check whether this TAB has an active CMS session.
        ------------------------------------------------------ */

        const tabSession =
          sessionStorage.getItem(
            TAB_SESSION_KEY
          );

if (tabSession !== "true") {
  if (mounted) {
    router.replace("/admin/login");
  }

  return;
}

        /* ------------------------------------------------------
           STEP 2
           Verify Supabase Auth session.
        ------------------------------------------------------ */

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (!mounted) return;

        if (userError || !user) {
          sessionStorage.removeItem(
            TAB_SESSION_KEY
          );

          router.replace("/admin/login");
          return;
        }

        /* ------------------------------------------------------
           STEP 3
           Check Apex CMS authorization.
        ------------------------------------------------------ */

        const {
          data: admin,
          error: adminError,
        } = await supabase
          .from("admin_users")
          .select(
            "id, email, full_name, role, is_active"
          )
          .eq("id", user.id)
          .maybeSingle();

        if (!mounted) return;

        if (
          adminError ||
          !admin ||
          !admin.is_active ||
          ![
            "admin",
            "super_admin",
          ].includes(admin.role)
        ) {
          sessionStorage.removeItem(
            TAB_SESSION_KEY
          );

          await supabase.auth.signOut();

          router.replace("/admin/login");
          return;
        }

        /* ------------------------------------------------------
           STEP 4
           Authorized.
        ------------------------------------------------------ */

        setUserEmail(
          admin.email ||
            user.email ||
            ""
        );

        setUserRole(admin.role);

        setChecking(false);
      } catch (error) {
        console.error(
          "Admin authorization failed:",
          error
        );

        sessionStorage.removeItem(
          TAB_SESSION_KEY
        );

        await supabase.auth.signOut();

        router.replace("/admin/login");
      }
    }

    checkAccess();

    return () => {
      mounted = false;
    };
  }, [router, isLoginPage]);

  /* ============================================================
     AUTH STATE LISTENER
  ============================================================ */

  useEffect(() => {
    if (isLoginPage) return;

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (event, session) => {
          if (
            event === "SIGNED_OUT" ||
            !session?.user
          ) {
            sessionStorage.removeItem(
              TAB_SESSION_KEY
            );

            router.replace("/admin/login");
          }
        }
      );

    return () => {
      subscription.unsubscribe();
    };
  }, [router, isLoginPage]);

  /* ============================================================
     LOGOUT
  ============================================================ */

  async function logout() {
    try {
      sessionStorage.removeItem(
        TAB_SESSION_KEY
      );

      await supabase.auth.signOut();
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  /* ============================================================
     LOGIN PAGE
  ============================================================ */

  if (isLoginPage) {
    return <>{children}</>;
  }

  /* ============================================================
     AUTH CHECKING
  ============================================================ */

  if (checking) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#071A38] text-white">
        <div className="flex flex-col items-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F5F0E6]">
            <Shield
              size={22}
              className="!text-[#102A56]"
            />
          </div>

          <div className="mt-5 text-sm font-semibold tracking-wide text-white">
            APEX CMS
          </div>

          <div className="mt-2 text-center text-[9px] uppercase tracking-[0.22em] text-white/30">
            Verifying administrator access
          </div>
        </div>
      </main>
    );
  }

  /* ============================================================
     ADMIN APP
  ============================================================ */

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#10203A]">
      {/* ========================================================
          MOBILE OVERLAY
      ======================================================== */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close admin sidebar"
          onClick={() =>
            setMobileOpen(false)
          }
          className="fixed inset-0 z-[90] bg-black/40 lg:hidden"
        />
      )}

      {/* ========================================================
          SIDEBAR
      ======================================================== */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-[100]
          flex
          flex-col
          border-r
          border-white/10
          bg-[#071A38]
          text-white
          shadow-[10px_0_50px_rgba(4,12,27,0.12)]
          transition-all
          duration-300
          ${
            collapsed
              ? "w-[82px]"
              : "w-[280px]"
          }
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* BRAND */}

        <div className="flex h-[72px] shrink-0 items-center border-b border-white/10 px-4">
          <Link
            href="/admin"
            className="flex min-w-0 flex-1 items-center gap-3"
            onClick={() =>
              setMobileOpen(false)
            }
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F5F0E6]">
              <Shield
                size={18}
                className="!text-[#102A56]"
              />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <div className="truncate text-sm font-bold tracking-[0.12em] !text-white">
                  APEX CMS
                </div>

                <div className="mt-1 truncate text-[7px] uppercase tracking-[0.22em] !text-white/30">
                  Apex Public School
                </div>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() =>
              setMobileOpen(false)
            }
            aria-label="Close sidebar"
            className="
              ml-2
              grid
              h-9
              w-9
              place-items-center
              rounded-full
              bg-white/[0.06]
              !text-white
              transition
              hover:bg-white/[0.10]
              lg:hidden
            "
          >
            <X
              size={16}
              className="!text-white"
            />
          </button>
        </div>

        {/* NAVIGATION */}

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
          {sections.map((section) => (
            <div
              key={section.title}
              className="mb-6"
            >
              {!collapsed && (
                <div className="mb-2 px-3 text-[8px] font-semibold uppercase tracking-[0.24em] !text-white/25">
                  {section.title}
                </div>
              )}

              <div className="space-y-1">
                {section.items.map(
                  (item) => {
                    const Icon = item.icon;

                    const active =
                      pathname ===
                        item.href ||
                      (item.href !==
                        "/admin" &&
                        pathname.startsWith(
                          `${item.href}/`
                        ));

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() =>
                          setMobileOpen(false)
                        }
                        title={
                          collapsed
                            ? item.label
                            : undefined
                        }
                        className={`
                          group
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          px-3
                          py-2.5
                          text-sm
                          transition
                          duration-200
                          ${
                            active
                              ? "bg-white/[0.10] !text-white"
                              : "!text-white/50 hover:bg-white/[0.06] hover:!text-white"
                          }
                        `}
                      >
                        <Icon
                          size={16}
                          className={
                            active
                              ? "!text-[#F5F0E6]"
                              : "!text-white/35 group-hover:!text-white/70"
                          }
                        />

                        {!collapsed && (
                          <span
                            className={
                              active
                                ? "!text-white"
                                : "!text-white/50 group-hover:!text-white"
                            }
                          >
                            {item.label}
                          </span>
                        )}
                      </Link>
                    );
                  }
                )}
              </div>
            </div>
          ))}
        </div>

        {/* USER AREA */}

        <div className="shrink-0 border-t border-white/10 p-3">
          {!collapsed && (
            <div className="mb-3 rounded-xl bg-white/[0.04] px-3 py-3">
              <div className="truncate text-xs font-medium !text-white/75">
                {userEmail}
              </div>

              <div className="mt-1 text-[8px] uppercase tracking-[0.18em] !text-white/25">
                {userRole ===
                "super_admin"
                  ? "Super administrator"
                  : "Administrator"}
              </div>

              <div className="mt-2 flex items-center gap-1.5 text-[8px] uppercase tracking-[0.15em] !text-emerald-300/70">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Tab session active
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={logout}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-2.5
              text-sm
              !text-white/40
              transition
              duration-200
              hover:bg-red-300/[0.05]
              hover:!text-red-200
            "
          >
            <LogOut
              size={16}
              className="!text-white/40"
            />

            {!collapsed && (
              <span className="!text-white/40">
                Sign out
              </span>
            )}
          </button>
        </div>

        {/* COLLAPSE */}

        <button
          type="button"
          onClick={() =>
            setCollapsed(
              (value) => !value
            )
          }
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          className="
            absolute
            -right-3
            top-[90px]
            hidden
            h-7
            w-7
            place-items-center
            rounded-full
            border
            border-[#102A56]/10
            bg-[#F5F0E6]
            !text-[#102A56]
            shadow-md
            lg:grid
          "
        >
          {collapsed ? (
            <ChevronRight
              size={14}
              className="!text-[#102A56]"
            />
          ) : (
            <ChevronLeft
              size={14}
              className="!text-[#102A56]"
            />
          )}
        </button>
      </aside>

      {/* ========================================================
          MAIN
      ======================================================== */}

      <div
        className={`
          min-h-screen
          transition-[padding]
          duration-300
          ${
            collapsed
              ? "lg:pl-[82px]"
              : "lg:pl-[280px]"
          }
        `}
      >
        {/* TOP BAR */}

        <header
          className="
            sticky
            top-0
            z-[80]
            flex
            h-[72px]
            items-center
            justify-between
            border-b
            border-[#102A56]/10
            bg-[#F4F1EA]/95
            px-5
            backdrop-blur-xl
            md:px-8
          "
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setMobileOpen(true)
              }
              aria-label="Open admin sidebar"
              className="
                grid
                h-10
                w-10
                place-items-center
                rounded-xl
                border
                border-[#102A56]/10
                bg-white
                !text-[#102A56]
                lg:hidden
              "
            >
              <Menu
                size={18}
                className="!text-[#102A56]"
              />
            </button>

            <div>
              <div className="text-xs font-semibold !text-[#102A56]">
                Apex Public School
              </div>

              <div className="mt-1 text-[8px] uppercase tracking-[0.2em] !text-[#102A56]/35">
                Content Management System
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-full border border-[#102A56]/10 bg-white px-3 py-2 text-[9px] font-medium uppercase tracking-[0.15em] !text-[#102A56]/45 sm:block">
              {userRole ===
              "super_admin"
                ? "Super Admin"
                : "Admin Panel"}
            </div>

            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="
                hidden
                items-center
                gap-2
                rounded-full
                border
                border-[#102A56]/10
                bg-white
                px-4
                py-2.5
                text-xs
                font-medium
                !text-[#102A56]
                transition
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#102A56]
                md:flex
              "
            >
              <span className="!text-[#102A56]">
                View website
              </span>

              <ChevronRight
                size={14}
                className="!text-[#102A56]"
              />
            </Link>
          </div>
        </header>

        {/* PAGE */}

        <main className="min-h-[calc(100vh-72px)] p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}