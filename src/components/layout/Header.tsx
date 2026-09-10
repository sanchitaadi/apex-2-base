"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import {
  ArrowUpRight,
  ChevronDown,
  Loader2,
  Menu,
  Phone,
  X,
} from "lucide-react";

import {
  DEFAULT_SITE_SETTINGS,
  type SiteSettings,
} from "@/lib/supabase/site-settings";

import { supabase } from "@/lib/supabase/browser";

/* =========================================================
   TYPES
========================================================= */

type NavigationItem = {
  id: string;
  parent_id: string | null;
  label: string;
  href: string;
  sort_order: number;
  is_active: boolean;
  open_in_new_tab: boolean;
};

/* =========================================================
   FALLBACK NAVIGATION
========================================================= */

const fallbackNavigation: NavigationItem[] = [
  {
    id: "home",
    parent_id: null,
    label: "Home",
    href: "/",
    sort_order: 0,
    is_active: true,
    open_in_new_tab: false,
  },
  {
    id: "about",
    parent_id: null,
    label: "About",
    href: "/about",
    sort_order: 1,
    is_active: true,
    open_in_new_tab: false,
  },
  {
    id: "notices",
    parent_id: null,
    label: "Notices",
    href: "/notices",
    sort_order: 2,
    is_active: true,
    open_in_new_tab: false,
  },
  {
    id: "academic",
    parent_id: null,
    label: "Academic",
    href: "/academics",
    sort_order: 3,
    is_active: true,
    open_in_new_tab: false,
  },
  {
    id: "admission",
    parent_id: null,
    label: "Admission",
    href: "/online-registration",
    sort_order: 4,
    is_active: true,
    open_in_new_tab: false,
  },
  {
    id: "contact",
    parent_id: null,
    label: "Contact",
    href: "/contact",
    sort_order: 5,
    is_active: true,
    open_in_new_tab: false,
  },
  {
    id: "mandatory",
    parent_id: null,
    label: "Mandatory Disclosure",
    href: "/mandatory-disclosure",
    sort_order: 6,
    is_active: true,
    open_in_new_tab: false,
  },
  {
    id: "tour",
    parent_id: null,
    label: "Virtual Tour",
    href: "/virtual-tour",
    sort_order: 7,
    is_active: true,
    open_in_new_tab: false,
  },
  {
    id: "sdg",
    parent_id: null,
    label: "SDG",
    href: "/sdg",
    sort_order: 8,
    is_active: true,
    open_in_new_tab: false,
  },
  {
    id: "media",
    parent_id: null,
    label: "Media",
    href: "/media",
    sort_order: 9,
    is_active: true,
    open_in_new_tab: false,
  },
  {
    id: "kaushal",
    parent_id: null,
    label: "Kaushal Bodh",
    href: "/kaushalbodh",
    sort_order: 10,
    is_active: true,
    open_in_new_tab: false,
  },
];

/* =========================================================
   HELPERS
========================================================= */

function isExternalUrl(href: string) {
  return /^https?:\/\//i.test(href);
}

function sortItems(items: NavigationItem[]) {
  return [...items].sort(
    (a, b) => a.sort_order - b.sort_order
  );
}

/* =========================================================
   DESKTOP DROPDOWN
========================================================= */

function DesktopDropdown({
  item,
  children,
  open,
  onToggle,
  active,
}: {
  item: NavigationItem;
  children: NavigationItem[];
  open: boolean;
  onToggle: () => void;
  active: boolean;
}) {
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={onToggle}
        className={`
          flex
          h-10
          xl:h-11
          shrink-0
          items-center
          gap-1
          xl:gap-1.5
          rounded-full
          px-2
          xl:px-2.5
          text-[12px]
          xl:text-[13px]
          font-medium
          leading-none
          transition-all
          duration-300
          hover:bg-[color-mix(in_srgb,var(--cms-secondary)_10%,transparent)]
          hover:text-[var(--cms-white)]
          ${
            active || open
              ? "bg-[color-mix(in_srgb,var(--cms-secondary)_10%,transparent)] text-[var(--cms-white)]"
              : ""
          }
        `}
        style={{
          color: "var(--cms-secondary)",
        }}
      >
        <span className="whitespace-nowrap">
          {item.label}
        </span>

        <ChevronDown
          size={11}
          strokeWidth={1.8}
          className={`
            shrink-0
            transition-transform
            duration-300
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {open && (
        <div
          className="
            absolute
            left-1/2
            top-[calc(100%+10px)]
            z-[300]
            w-[285px]
            -translate-x-1/2
            rounded-2xl
            border
            border-white/10
            p-2
            shadow-[0_25px_70px_rgba(4,12,27,0.42)]
            backdrop-blur-xl
          "
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--cms-primary) 98%, transparent)",
          }}
        >
          <div
            className="
              absolute
              left-1/2
              top-[-5px]
              h-3
              w-3
              -translate-x-1/2
              rotate-45
              border-l
              border-t
              border-white/10
            "
            style={{
              backgroundColor: "var(--cms-primary)",
            }}
          />

          {children.map((child) => (
            <Link
              key={child.id}
              href={child.href}
              target={
                child.open_in_new_tab
                  ? "_blank"
                  : undefined
              }
              rel={
                child.open_in_new_tab
                  ? "noreferrer"
                  : undefined
              }
              className="
                group
                flex
                items-center
                justify-between
                rounded-xl
                px-4
                py-3
                text-sm
                transition
                duration-300
                hover:bg-[color-mix(in_srgb,var(--cms-secondary)_10%,transparent)]
              "
              style={{
                color:
                  "color-mix(in srgb, var(--cms-secondary) 80%, transparent)",
              }}
            >
              <span>{child.label}</span>

              <ArrowUpRight
                size={14}
                className="
                  transition
                  duration-300
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                  group-hover:text-[var(--cms-white)]
                "
                style={{
                  color:
                    "color-mix(in srgb, var(--cms-secondary) 25%, transparent)",
                }}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MOBILE SECTION
========================================================= */

function MobileSection({
  item,
  children,
  open,
  onToggle,
  onClose,
}: {
  item: NavigationItem;
  children: NavigationItem[];
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="
          flex
          w-full
          items-center
          justify-between
          rounded-2xl
          px-4
          py-3.5
          text-left
          text-sm
          transition
        "
        style={{
          color: "var(--cms-secondary)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor =
            "color-mix(in srgb, var(--cms-secondary) 10%, transparent)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor =
            "transparent";
        }}
      >
        <span>{item.label}</span>

        <ChevronDown
          size={15}
          className={`
            transition-transform
            duration-300
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {open && (
        <div
          className="ml-3 border-l pl-3"
          style={{
            borderColor:
              "color-mix(in srgb, var(--cms-secondary) 10%, transparent)",
          }}
        >
          {children.map((child) => (
            <Link
              key={child.id}
              href={child.href}
              target={
                child.open_in_new_tab
                  ? "_blank"
                  : undefined
              }
              rel={
                child.open_in_new_tab
                  ? "noreferrer"
                  : undefined
              }
              onClick={onClose}
              className="
                flex
                items-center
                justify-between
                rounded-xl
                px-3
                py-3
                text-sm
                transition
              "
              style={{
                color:
                  "color-mix(in srgb, var(--cms-secondary) 70%, transparent)",
              }}
            >
              <span>{child.label}</span>

              <ArrowUpRight size={12} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   HEADER
========================================================= */

export default function Header() {
  const pathname = usePathname();

  const [siteSettings, setSiteSettings] =
    useState<SiteSettings>(
      DEFAULT_SITE_SETTINGS
    );

  const [navigation, setNavigation] =
    useState<NavigationItem[]>([]);

  const [loadingNavigation, setLoadingNavigation] =
    useState(true);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [openMenu, setOpenMenu] =
    useState<string | null>(null);

  const [mobileSections, setMobileSections] =
    useState<string[]>([]);

  /* =======================================================
     LOAD GLOBAL SETTINGS
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      const { data, error } = await supabase
        .from("site_settings")
        .select("setting_value")
        .eq("setting_key", "global")
        .limit(1)
        .maybeSingle();

      if (!mounted) return;

      if (!error && data?.setting_value) {
        setSiteSettings({
          ...DEFAULT_SITE_SETTINGS,
          ...(data.setting_value as Partial<SiteSettings>),
        });
      }
    }

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     LOAD NAVIGATION
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadNavigation() {
      setLoadingNavigation(true);

      const { data, error } = await supabase
        .from("navigation_items")
        .select(`
          id,
          parent_id,
          label,
          href,
          sort_order,
          is_active,
          open_in_new_tab
        `)
        .eq("is_active", true)
        .order("sort_order", {
          ascending: true,
        });

      if (!mounted) return;

      if (error) {
        console.error(
          "Navigation load failed:",
          error
        );

        setNavigation(
          fallbackNavigation
        );
      } else if (
        !data ||
        data.length === 0
      ) {
        setNavigation(
          fallbackNavigation
        );
      } else {
        setNavigation(
          data as NavigationItem[]
        );
      }

      setLoadingNavigation(false);
    }

    loadNavigation();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     ROOT ITEMS
  ======================================================= */

  const rootItems = useMemo(() => {
    return sortItems(
      navigation.filter(
        (item) =>
          item.parent_id === null
      )
    );
  }, [navigation]);

  /* =======================================================
     CHILDREN
  ======================================================= */

  function getChildren(
    parentId: string
  ) {
    return sortItems(
      navigation.filter(
        (item) =>
          item.parent_id === parentId
      )
    );
  }

  /* =======================================================
     ACTIVE URL
  ======================================================= */

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    if (isExternalUrl(href)) {
      return false;
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  /* =======================================================
     MENU HELPERS
  ======================================================= */

  function toggleMenu(id: string) {
    setOpenMenu((current) =>
      current === id
        ? null
        : id
    );
  }

  function toggleMobileSection(
    id: string
  ) {
    setMobileSections((current) =>
      current.includes(id)
        ? current.filter(
            (item) => item !== id
          )
        : [...current, id]
    );
  }

  function closeMenus() {
    setOpenMenu(null);
    setMobileOpen(false);
    setMobileSections([]);
  }

  /* =======================================================
     CLOSE DESKTOP DROPDOWN WHEN CLICKING OUTSIDE
  ======================================================= */

  useEffect(() => {
    function handlePointerDown(
      event: PointerEvent
    ) {
      const target =
        event.target as HTMLElement;

      if (
        !target.closest(
          "[data-header-dropdown]"
        )
      ) {
        setOpenMenu(null);
      }
    }

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
    };
  }, []);

  /* =======================================================
     CLOSE MOBILE MENU ON DESKTOP
  ======================================================= */

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1280) {
        setMobileOpen(false);
        setMobileSections([]);
      }
    }

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  /* =======================================================
     CLOSE MOBILE MENU WHEN ROUTE CHANGES
  ======================================================= */

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
    setMobileSections([]);
  }, [pathname]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      {/* =====================================================
          TOP BAR
      ====================================================== */}

      <div
        data-static-motion
        className="
          fixed
          inset-x-0
          top-0
          z-[110]
        "
        style={{
          backgroundColor:
            "var(--cms-primary)",
          color:
            "var(--cms-secondary)",
        }}
      >
        <div
          className="
            mx-auto
            flex
            h-9
            max-w-[1600px]
            items-center
            justify-between
            px-4
            sm:px-5
            md:px-8
          "
        >
          <div className="hidden items-center gap-4 sm:flex">
            <span
              className="
                text-[9px]
                tracking-[0.13em]
                md:text-[10px]
              "
              style={{
                color:
                  "color-mix(in srgb, var(--cms-secondary) 75%, transparent)",
              }}
            >
              Affiliated to C.B.S.E.
            </span>

            <span
              style={{
                color:
                  "color-mix(in srgb, var(--cms-secondary) 25%, transparent)",
              }}
            >
              •
            </span>

            <span
              className="
                text-[9px]
                tracking-[0.13em]
                md:text-[10px]
              "
              style={{
                color:
                  "color-mix(in srgb, var(--cms-secondary) 75%, transparent)",
              }}
            >
              Code No. {siteSettings.cbse_code}
            </span>
          </div>

          <a
            href={`tel:${siteSettings.phone}`}
            className="
              ml-auto
              flex
              items-center
              gap-2
              text-[9px]
              tracking-[0.12em]
              transition
              sm:text-[10px]
            "
            style={{
              color:
                "color-mix(in srgb, var(--cms-secondary) 80%, transparent)",
            }}
          >
            <Phone size={11} />

            {siteSettings.phone}
          </a>
        </div>
      </div>

      {/* =====================================================
          MAIN HEADER

          IMPORTANT FIX:
          Changed from fixed -> sticky.

          This means the header remains visible while scrolling
          but also occupies real document space, preventing the
          hero heading from going underneath the navigation.
      ====================================================== */}

<header
  data-static-motion
  className="
    sticky
    top-9
    z-[100]
    -mb-[115px]
  "
  style={{
    background: "transparent",
  }}
>
        <div
    className="
      mx-auto
      max-w-[1600px]
      px-3
      pt-3
      sm:px-4
      sm:pt-4
      md:px-8
    "
  >
          <div
            className="
              rounded-[20px]
              sm:rounded-[24px]
              border
              shadow-[0_22px_70px_rgba(5,20,45,0.26)]
              backdrop-blur-xl
            "
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--cms-primary) 96%, transparent)",
              borderColor:
                "color-mix(in srgb, var(--cms-secondary) 10%, transparent)",
            }}
          >
            <div
              className="
                flex
                min-h-[74px]
                items-center
                px-4
                sm:min-h-[82px]
                sm:px-5
                md:min-h-[88px]
                md:px-6
              "
            >
              {/* =================================================
                  BRAND
              ================================================== */}

              <Link
                href="/"
                onClick={closeMenus}
                className="
                  group
                  flex
                  min-w-0
                  flex-1
                  shrink
                  items-center
                  gap-2
                  pr-2
                  sm:gap-3
                  sm:pr-3
                  xl:w-[285px]
                  xl:min-w-[285px]
                  xl:flex-none
                  xl:gap-3.5
                  xl:pr-5
                  2xl:w-[315px]
                  2xl:min-w-[315px]
                "
              >
                {/* =================================================
                    LOGO
                ================================================== */}

                <div
                  className="
                    relative
                    grid
                    h-10
                    w-10
                    shrink-0
                    place-items-center
                    overflow-hidden
                    rounded-xl
                    sm:h-[50px]
                    sm:w-[50px]
                    xl:h-[56px]
                    xl:w-[56px]
                  "
                  style={{
                    backgroundColor:
                      "var(--cms-background)",
                  }}
                >
                  <Image
                    src={
                      siteSettings.logo_url ||
                      "/logo.png"
                    }
                    alt={`${siteSettings.school_name} logo`}
                    fill
                    priority
                    sizes="
                      (max-width: 639px) 40px,
                      (max-width: 1279px) 50px,
                      56px
                    "
                    className="
                      object-contain
                      p-2
                      brightness-0
                    "
                  />
                </div>

                {/* =================================================
                    SCHOOL NAME
                ================================================== */}

                <div className="min-w-0 flex-1">
                  <div
                    className="
                      truncate
                      whitespace-nowrap
                      text-[11px]
                      font-bold
                      leading-none
                      tracking-[0.07em]
                      sm:text-[13px]
                      sm:tracking-[0.09em]
                      xl:text-[14px]
                      xl:tracking-[0.1em]
                      2xl:text-[15px]
                    "
                    style={{
                      color:
                        "var(--cms-white)",
                    }}
                  >
                    {siteSettings.school_name}
                  </div>

                  <div
                    className="
                      mt-1.5
                      hidden
                      whitespace-nowrap
                      text-[7px]
                      font-medium
                      uppercase
                      leading-none
                      tracking-[0.24em]
                      sm:block
                      xl:text-[8px]
                      xl:tracking-[0.28em]
                    "
                    style={{
                      color:
                        "color-mix(in srgb, var(--cms-secondary) 58%, transparent)",
                    }}
                  >
                    {siteSettings.tagline}
                  </div>
                </div>
              </Link>

              {/* =================================================
                  DESKTOP NAVIGATION
              ================================================== */}

              <nav
                className="
                  hidden
                  min-w-0
                  flex-1
                  items-center
                  justify-center
                  gap-0
                  overflow-visible
                  xl:flex
                "
              >
                {loadingNavigation ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                    style={{
                      color:
                        "color-mix(in srgb, var(--cms-white) 35%, transparent)",
                    }}
                  />
                ) : (
                  rootItems.map((item) => {
                    const children =
                      getChildren(
                        item.id
                      );

                    if (
                      children.length >
                      0
                    ) {
                      return (
                        <div
                          key={item.id}
                          data-header-dropdown
                        >
                          <DesktopDropdown
                            item={item}
                            children={
                              children
                            }
                            open={
                              openMenu ===
                              item.id
                            }
                            onToggle={() =>
                              toggleMenu(
                                item.id
                              )
                            }
                            active={children.some(
                              (
                                child
                              ) =>
                                isActive(
                                  child.href
                                )
                            )}
                          />
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        target={
                          item.open_in_new_tab
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          item.open_in_new_tab
                            ? "noreferrer"
                            : undefined
                        }
                        className="
                          flex
                          h-10
                          xl:h-11
                          shrink-0
                          items-center
                          whitespace-nowrap
                          rounded-full
                          px-2
                          xl:px-2.5
                          text-[12px]
                          xl:text-[13px]
                          font-medium
                          leading-none
                          transition-all
                          duration-300
                        "
                        style={{
                          color: isActive(
                            item.href
                          )
                            ? "var(--cms-white)"
                            : "var(--cms-secondary)",
                          backgroundColor:
                            isActive(
                              item.href
                            )
                              ? "color-mix(in srgb, var(--cms-secondary) 10%, transparent)"
                              : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "color-mix(in srgb, var(--cms-secondary) 10%, transparent)";

                          e.currentTarget.style.color =
                            "var(--cms-white)";
                        }}
                        onMouseLeave={(e) => {
                          const active =
                            isActive(
                              item.href
                            );

                          e.currentTarget.style.backgroundColor =
                            active
                              ? "color-mix(in srgb, var(--cms-secondary) 10%, transparent)"
                              : "transparent";

                          e.currentTarget.style.color =
                            active
                              ? "var(--cms-white)"
                              : "var(--cms-secondary)";
                        }}
                      >
                        {item.label}
                      </Link>
                    );
                  })
                )}
              </nav>

              {/* =================================================
                  RIGHT ACTIONS
              ================================================== */}

              <div
                className="
                  hidden
                  w-[165px]
                  min-w-[165px]
                  shrink-0
                  items-center
                  justify-end
                  gap-2
                  pl-2
                  xl:flex
                  2xl:w-[180px]
                  2xl:min-w-[180px]
                  2xl:gap-3
                  2xl:pl-3
                "
              >
                {/* PHONE */}

                <a
                  href={`tel:${siteSettings.phone}`}
                  aria-label={`Call ${siteSettings.school_name}`}
                  className="
                    grid
                    h-10
                    w-10
                    shrink-0
                    place-items-center
                    rounded-full
                    border
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    2xl:h-11
                    2xl:w-11
                  "
                  style={{
                    borderColor:
                      "color-mix(in srgb, var(--cms-white) 15%, transparent)",
                    backgroundColor:
                      "color-mix(in srgb, var(--cms-white) 4%, transparent)",
                    color:
                      "color-mix(in srgb, var(--cms-secondary) 80%, transparent)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "color-mix(in srgb, var(--cms-white) 25%, transparent)";

                    e.currentTarget.style.backgroundColor =
                      "color-mix(in srgb, var(--cms-white) 8%, transparent)";

                    e.currentTarget.style.color =
                      "var(--cms-white)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "color-mix(in srgb, var(--cms-white) 15%, transparent)";

                    e.currentTarget.style.backgroundColor =
                      "color-mix(in srgb, var(--cms-white) 4%, transparent)";

                    e.currentTarget.style.color =
                      "color-mix(in srgb, var(--cms-secondary) 80%, transparent)";
                  }}
                >
                  <Phone size={15} />
                </a>

                {/* DESKTOP ADMISSIONS */}

                <Link
                  href="/online-registration"
                  className="
                    group
                    inline-flex
                    h-10
                    shrink-0
                    items-center
                    gap-1.5
                    whitespace-nowrap
                    rounded-full
                    px-3.5
                    text-[12px]
                    font-semibold
                    leading-none
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    2xl:h-11
                    2xl:px-4
                    2xl:text-[13px]
                  "
                  style={{
                    backgroundColor:
                      "var(--cms-button)",
                    color:
                      "var(--cms-button-text)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--cms-button-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--cms-button)";
                  }}
                >
                  <span
                    style={{
                      color:
                        "var(--cms-button-text)",
                    }}
                  >
                    Admissions
                  </span>

                  <ArrowUpRight
                    size={13}
                    className="
                      transition-transform
                      duration-300
                      group-hover:-translate-y-0.5
                      group-hover:translate-x-0.5
                    "
                    style={{
                      color:
                        "var(--cms-button-text)",
                    }}
                  />
                </Link>
              </div>

              {/* =================================================
                  MOBILE MENU BUTTON
              ================================================== */}

              <button
                type="button"
                aria-label={
                  mobileOpen
                    ? "Close menu"
                    : "Open menu"
                }
                aria-expanded={mobileOpen}
                onClick={() =>
                  setMobileOpen(
                    (value) => !value
                  )
                }
                className="
                  ml-auto
                  grid
                  h-10
                  w-10
                  shrink-0
                  place-items-center
                  rounded-full
                  xl:hidden
                  sm:h-11
                  sm:w-11
                "
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--cms-secondary) 10%, transparent)",
                  color:
                    "var(--cms-secondary)",
                }}
              >
                {mobileOpen ? (
                  <X size={19} />
                ) : (
                  <Menu size={19} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          MOBILE NAVIGATION
      ====================================================== */}

      {mobileOpen && (
        <div
          data-static-motion
          className="
            fixed
            inset-x-3
            top-[108px]
            z-[120]
            max-h-[calc(100vh-135px)]
            overflow-y-auto
            rounded-[24px]
            border
            p-4
            shadow-2xl
            backdrop-blur-xl
            sm:inset-x-4
            sm:top-[120px]
            sm:rounded-[26px]
            xl:hidden
          "
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--cms-primary) 98%, transparent)",
            borderColor:
              "color-mix(in srgb, var(--cms-secondary) 10%, transparent)",
          }}
        >
          {rootItems.map((item) => {
            const children =
              getChildren(item.id);

            if (
              children.length > 0
            ) {
              return (
                <MobileSection
                  key={item.id}
                  item={item}
                  children={
                    children
                  }
                  open={mobileSections.includes(
                    item.id
                  )}
                  onToggle={() =>
                    toggleMobileSection(
                      item.id
                    )
                  }
                  onClose={
                    closeMenus
                  }
                />
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                target={
                  item.open_in_new_tab
                    ? "_blank"
                    : undefined
                }
                rel={
                  item.open_in_new_tab
                    ? "noreferrer"
                    : undefined
                }
                onClick={
                  closeMenus
                }
                className="
                  flex
                  items-center
                  justify-between
                  rounded-2xl
                  px-4
                  py-3.5
                  text-sm
                  transition
                "
                style={{
                  color:
                    "var(--cms-secondary)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "color-mix(in srgb, var(--cms-secondary) 10%, transparent)";

                  e.currentTarget.style.color =
                    "var(--cms-white)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "transparent";

                  e.currentTarget.style.color =
                    "var(--cms-secondary)";
                }}
              >
                <span>
                  {item.label}
                </span>

                <ArrowUpRight
                  size={13}
                />
              </Link>
            );
          })}

          {/* =================================================
              MOBILE ACTIONS
          ================================================== */}

          <div className="mt-3 grid grid-cols-2 gap-2">
            {/* CALL */}

            <a
              href={`tel:${siteSettings.phone}`}
              onClick={
                closeMenus
              }
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-2xl
                border
                px-4
                py-3
                text-sm
              "
              style={{
                borderColor:
                  "color-mix(in srgb, var(--cms-white) 15%, transparent)",
                color:
                  "color-mix(in srgb, var(--cms-secondary) 80%, transparent)",
              }}
            >
              <Phone size={15} />

              Call
            </a>

            {/* ADMISSIONS */}

            <Link
              href="/online-registration"
              onClick={
                closeMenus
              }
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-2xl
                px-4
                py-3
                text-sm
                font-semibold
              "
              style={{
                backgroundColor:
                  "var(--cms-button)",
                color:
                  "var(--cms-button-text)",
              }}
            >
              <span
                style={{
                  color:
                    "var(--cms-button-text)",
                }}
              >
                Admissions
              </span>

              <ArrowUpRight
                size={15}
                style={{
                  color:
                    "var(--cms-button-text)",
                }}
              />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}