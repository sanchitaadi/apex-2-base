"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import Link from "next/link";
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

import { usePathname, useRouter } from "next/navigation";

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
        label: "THEME",
        href: "/admin/theme",
        icon: ImageIcon,
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

const TAB_SESSION_KEY = "apex_cms_tab_authenticated";

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

  const isLoginPage = pathname === "/admin/login";

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
          sessionStorage.getItem(TAB_SESSION_KEY);

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
          sessionStorage.removeItem(TAB_SESSION_KEY);

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
          !["admin", "super_admin"].includes(admin.role)
        ) {
          sessionStorage.removeItem(TAB_SESSION_KEY);

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

        sessionStorage.removeItem(TAB_SESSION_KEY);

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
    } = supabase.auth.onAuthStateChange(
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
      <main
        className="
          grid
          min-h-screen
          place-items-center
        "
        style={{
          background: "var(--cms-primary-dark)",
          color: "var(--cms-white)",
        }}
      >
        <div className="flex flex-col items-center">
          <div
            className="
              grid
              h-14
              w-14
              place-items-center
              rounded-2xl
            "
            style={{
              background: "var(--cms-background)",
            }}
          >
            <Shield
              size={22}
              style={{
                color: "var(--cms-primary)",
              }}
            />
          </div>

          <div
            className="
              mt-5
              text-sm
              font-semibold
              tracking-wide
            "
            style={{
              color: "var(--cms-white)",
            }}
          >
            APEX CMS
          </div>

          <div
            className="
              mt-2
              text-center
              text-[9px]
              uppercase
              tracking-[0.22em]
            "
            style={{
              color:
                "color-mix(in srgb, var(--cms-white) 30%, transparent)",
            }}
          >
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
    <div
      className="
        min-h-screen
        transition-colors
        duration-300
      "
      style={{
        background: "var(--cms-background)",
        color: "var(--cms-text)",
      }}
    >
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
          className="
            fixed
            inset-0
            z-[90]
            lg:hidden
          "
          style={{
            background:
              "color-mix(in srgb, var(--cms-primary-dark) 40%, transparent)",
          }}
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
        style={{
          background: "var(--cms-primary-dark)",
          color: "var(--cms-white)",
          borderColor:
            "color-mix(in srgb, var(--cms-white) 10%, transparent)",
          boxShadow:
            "10px 0 50px color-mix(in srgb, var(--cms-primary-dark) 12%, transparent)",
        }}
      >
        {/* BRAND */}

        <div
          className="
            flex
            h-[72px]
            shrink-0
            items-center
            border-b
            px-4
          "
          style={{
            borderColor:
              "color-mix(in srgb, var(--cms-white) 10%, transparent)",
          }}
        >
          <Link
            href="/admin"
            className="
              flex
              min-w-0
              flex-1
              items-center
              gap-3
            "
            onClick={() =>
              setMobileOpen(false)
            }
          >
            <div
              className="
                grid
                h-10
                w-10
                shrink-0
                place-items-center
                rounded-xl
              "
              style={{
                background: "var(--cms-background)",
              }}
            >
              <Shield
                size={18}
                style={{
                  color: "var(--cms-primary)",
                }}
              />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <div
                  className="
                    truncate
                    text-sm
                    font-bold
                    tracking-[0.12em]
                  "
                  style={{
                    color: "var(--cms-white)",
                  }}
                >
                  APEX CMS
                </div>

                <div
                  className="
                    mt-1
                    truncate
                    text-[7px]
                    uppercase
                    tracking-[0.22em]
                  "
                  style={{
                    color:
                      "color-mix(in srgb, var(--cms-white) 30%, transparent)",
                  }}
                >
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
              transition
              lg:hidden
            "
            style={{
              background:
                "color-mix(in srgb, var(--cms-white) 6%, transparent)",
              color: "var(--cms-white)",
            }}
          >
            <X
              size={16}
              style={{
                color: "var(--cms-white)",
              }}
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
                <div
                  className="
                    mb-2
                    px-3
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.24em]
                  "
                  style={{
                    color:
                      "color-mix(in srgb, var(--cms-white) 25%, transparent)",
                  }}
                >
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
                        className="
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
                        "
                        style={{
                          background: active
                            ? "color-mix(in srgb, var(--cms-white) 10%, transparent)"
                            : "transparent",
                          color: active
                            ? "var(--cms-white)"
                            : "color-mix(in srgb, var(--cms-white) 50%, transparent)",
                        }}
                        onMouseEnter={(event) => {
                          if (!active) {
                            event.currentTarget.style.background =
                              "color-mix(in srgb, var(--cms-white) 6%, transparent)";

                            event.currentTarget.style.color =
                              "var(--cms-white)";
                          }
                        }}
                        onMouseLeave={(event) => {
                          if (!active) {
                            event.currentTarget.style.background =
                              "transparent";

                            event.currentTarget.style.color =
                              "color-mix(in srgb, var(--cms-white) 50%, transparent)";
                          }
                        }}
                      >
                        <Icon
                          size={16}
                          style={{
                            color: active
                              ? "var(--cms-background)"
                              : "color-mix(in srgb, var(--cms-white) 35%, transparent)",
                          }}
                        />

                        {!collapsed && (
                          <span
                            style={{
                              color: active
                                ? "var(--cms-white)"
                                : "inherit",
                            }}
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

        <div
          className="
            shrink-0
            border-t
            p-3
          "
          style={{
            borderColor:
              "color-mix(in srgb, var(--cms-white) 10%, transparent)",
          }}
        >
          {!collapsed && (
            <div
              className="
                mb-3
                rounded-xl
                px-3
                py-3
              "
              style={{
                background:
                  "color-mix(in srgb, var(--cms-white) 4%, transparent)",
              }}
            >
              <div
                className="
                  truncate
                  text-xs
                  font-medium
                "
                style={{
                  color:
                    "color-mix(in srgb, var(--cms-white) 75%, transparent)",
                }}
              >
                {userEmail}
              </div>

              <div
                className="
                  mt-1
                  text-[8px]
                  uppercase
                  tracking-[0.18em]
                "
                style={{
                  color:
                    "color-mix(in srgb, var(--cms-white) 25%, transparent)",
                }}
              >
                {userRole ===
                "super_admin"
                  ? "Super administrator"
                  : "Administrator"}
              </div>

              <div
                className="
                  mt-2
                  flex
                  items-center
                  gap-1.5
                  text-[8px]
                  uppercase
                  tracking-[0.15em]
                "
                style={{
                  color: "#86efac",
                }}
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-emerald-400
                  "
                />

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
              transition
              duration-200
            "
            style={{
              color:
                "color-mix(in srgb, var(--cms-white) 40%, transparent)",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.background =
                "color-mix(in srgb, #fca5a5 5%, transparent)";

              event.currentTarget.style.color =
                "#fecaca";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background =
                "transparent";

              event.currentTarget.style.color =
                "color-mix(in srgb, var(--cms-white) 40%, transparent)";
            }}
          >
            <LogOut
              size={16}
              style={{
                color:
                  "color-mix(in srgb, var(--cms-white) 40%, transparent)",
              }}
            />

            {!collapsed && (
              <span>
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
            shadow-md
            lg:grid
          "
          style={{
            borderColor:
              "color-mix(in srgb, var(--cms-primary) 10%, transparent)",
            background: "var(--cms-background)",
            color: "var(--cms-primary)",
          }}
        >
          {collapsed ? (
            <ChevronRight
              size={14}
              style={{
                color: "var(--cms-primary)",
              }}
            />
          ) : (
            <ChevronLeft
              size={14}
              style={{
                color: "var(--cms-primary)",
              }}
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
            px-5
            backdrop-blur-xl
            md:px-8
          "
          style={{
            background:
              "color-mix(in srgb, var(--cms-background) 95%, transparent)",
            borderColor:
              "color-mix(in srgb, var(--cms-primary) 10%, transparent)",
          }}
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
                lg:hidden
              "
              style={{
                borderColor:
                  "color-mix(in srgb, var(--cms-primary) 10%, transparent)",
                background:
                  "var(--cms-white)",
                color:
                  "var(--cms-primary)",
              }}
            >
              <Menu
                size={18}
                style={{
                  color:
                    "var(--cms-primary)",
                }}
              />
            </button>

            <div>
              <div
                className="
                  text-xs
                  font-semibold
                "
                style={{
                  color:
                    "var(--cms-primary)",
                }}
              >
                Apex Public School
              </div>

              <div
                className="
                  mt-1
                  text-[8px]
                  uppercase
                  tracking-[0.2em]
                "
                style={{
                  color:
                    "color-mix(in srgb, var(--cms-primary) 35%, transparent)",
                }}
              >
                Content Management System
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="
                hidden
                rounded-full
                border
                px-3
                py-2
                text-[9px]
                font-medium
                uppercase
                tracking-[0.15em]
                sm:block
              "
              style={{
                borderColor:
                  "color-mix(in srgb, var(--cms-primary) 10%, transparent)",
                background:
                  "var(--cms-white)",
                color:
                  "color-mix(in srgb, var(--cms-primary) 45%, transparent)",
              }}
            >
              {userRole ===
              "super_admin"
                ? "Super Admin"
                : "Admin Panel"}
            </div>

            {/* ==================================================
                VIEW WEBSITE
            ================================================== */}

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="
                cms-view-website
                hidden
                items-center
                gap-2
                rounded-full
                border
                px-4
                py-2.5
                text-xs
                font-semibold
                transition
                duration-300
                md:flex
              "
              style={{
                background:
                  "var(--cms-button)",
                color:
                  "var(--cms-button-text)",
                borderColor:
                  "color-mix(in srgb, var(--cms-button) 20%, transparent)",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.background =
                  "var(--cms-button-hover)";

                event.currentTarget.style.color =
                  "var(--cms-button-text)";

                event.currentTarget.style.transform =
                  "translateY(-2px)";

                event.currentTarget.style.boxShadow =
                  "0 12px 30px color-mix(in srgb, var(--cms-primary) 20%, transparent)";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background =
                  "var(--cms-button)";

                event.currentTarget.style.color =
                  "var(--cms-button-text)";

                event.currentTarget.style.transform =
                  "translateY(0)";

                event.currentTarget.style.boxShadow =
                  "none";
              }}
            >
              <span
                style={{
                  color:
                    "var(--cms-button-text)",
                }}
              >
                View website
              </span>

              <ChevronRight
                size={14}
                style={{
                  color:
                    "var(--cms-button-text)",
                }}
              />
            </Link>
          </div>
        </header>

        {/* PAGE */}

        <main
          className="
            min-h-[calc(100vh-72px)]
            p-5
            md:p-8
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}