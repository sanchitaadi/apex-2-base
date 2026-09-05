"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import {
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
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
   Used only if Supabase is unavailable.
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
          h-11
          shrink-0
          items-center
          gap-1.5
          rounded-full
          px-2.5
          text-[13px]
          font-medium
          leading-none
          !text-[#F5F0E6]
          transition-all
          duration-300
          hover:bg-[#F5F0E6]/10
          hover:!text-white
          ${active || open ? "bg-[#F5F0E6]/10 !text-white" : ""}
        `}
      >
        <span className="whitespace-nowrap">
          {item.label}
        </span>

        <ChevronDown
          size={12}
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
            bg-[#102A56]/98
            p-2
            shadow-[0_25px_70px_rgba(4,12,27,0.42)]
            backdrop-blur-xl
          "
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
              bg-[#102A56]
            "
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
                !text-[#F5F0E6]/80
                transition
                duration-300
                hover:bg-[#F5F0E6]/10
                hover:!text-white
              "
            >
              <span>{child.label}</span>

              <ArrowUpRight
                size={14}
                className="
                  text-[#F5F0E6]/25
                  transition
                  duration-300
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                  group-hover:text-white
                "
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
          !text-[#F5F0E6]
          hover:bg-[#F5F0E6]/10
        "
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
        <div className="ml-3 border-l border-white/10 pl-3">
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
                !text-[#F5F0E6]/70
                hover:bg-[#F5F0E6]/10
                hover:!text-white
              "
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
      const { data, error } =
        await supabase
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

      const { data, error } =
        await supabase
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

  function getChildren(parentId: string) {
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
      current === id ? null : id
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
          bg-[#102A56]
          text-[#F5F0E6]
        "
      >
        <div
          className="
            mx-auto
            flex
            h-9
            max-w-[1600px]
            items-center
            justify-between
            px-5
            md:px-8
          "
        >
          <div className="hidden items-center gap-4 sm:flex">

            <span className="text-[10px] tracking-[0.13em] text-[#F5F0E6]/75">
              Affiliated to C.B.S.E.
            </span>

            <span className="text-[#F5F0E6]/25">
              •
            </span>

            <span className="text-[10px] tracking-[0.13em] text-[#F5F0E6]/75">
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
              text-[10px]
              tracking-[0.12em]
              text-[#F5F0E6]/80
              transition
              hover:text-white
            "
          >
            <Phone size={11} />
            {siteSettings.phone}
          </a>
        </div>
      </div>

      {/* =====================================================
          MAIN HEADER
      ====================================================== */}

      <header
        data-static-motion
        className="
          fixed
          inset-x-0
          top-9
          z-[100]
        "
      >
        <div
          className="
            mx-auto
            max-w-[1600px]
            px-4
            pt-4
            md:px-8
          "
        >
          <div
            className="
              rounded-[24px]
              border
              border-white/10
              bg-[#102A56]/96
              shadow-[0_22px_70px_rgba(5,20,45,0.26)]
              backdrop-blur-xl
            "
          >
            <div
              className="
                flex
                min-h-[88px]
                items-center
                px-5
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
                  w-[315px]
                  min-w-[315px]
                  shrink-0
                  items-center
                  gap-3.5
                  pr-5
                "
              >
                <div
                  className="
                    relative
                    grid
                    h-[58px]
                    w-[58px]
                    shrink-0
                    place-items-center
                    overflow-hidden
                    rounded-xl
                    bg-[#F5F0E6]
                  "
                >
                  <Image
                    src={siteSettings.logo_url}
                    alt={`${siteSettings.school_name} logo`}
                    fill
                    sizes="58px"
                    className="
                      object-contain
                      p-2
                      brightness-0
                    "
                  />
                </div>

                <div className="min-w-0 flex-1">

                  <div
                    className="
                      whitespace-nowrap
                      text-[15px]
                      font-bold
                      leading-none
                      tracking-[0.105em]
                      text-white
                    "
                  >
                    {siteSettings.school_name}
                  </div>

                  <div
                    className="
                      mt-2
                      whitespace-nowrap
                      text-[8px]
                      font-medium
                      uppercase
                      leading-none
                      tracking-[0.28em]
                      text-[#F5F0E6]/58
                    "
                  >
                    {siteSettings.tagline}
                  </div>

                </div>
              </Link>

              {/* =================================================
                  DYNAMIC NAVIGATION
              ================================================== */}

              <nav
                className="
                  hidden
                  min-w-0
                  flex-1
                  items-center
                  justify-center
                  overflow-visible
                  xl:flex
                "
              >
                {loadingNavigation ? (
                  <Loader2
                    size={17}
                    className="animate-spin text-white/35"
                  />
                ) : (
                  rootItems.map((item) => {
                    const children =
                      getChildren(item.id);

                    if (children.length > 0) {
                      return (
                        <DesktopDropdown
                          key={item.id}
                          item={item}
                          children={children}
                          open={
                            openMenu === item.id
                          }
                          onToggle={() =>
                            toggleMenu(item.id)
                          }
                          active={children.some(
                            (child) =>
                              isActive(
                                child.href
                              )
                          )}
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
                        className={`
                          flex
                          h-11
                          shrink-0
                          items-center
                          whitespace-nowrap
                          rounded-full
                          px-2.5
                          text-[13px]
                          font-medium
                          leading-none
                          !text-[#F5F0E6]
                          transition-all
                          duration-300
                          hover:bg-[#F5F0E6]/10
                          hover:!text-white
                          ${
                            isActive(item.href)
                              ? "bg-[#F5F0E6]/10 !text-white"
                              : ""
                          }
                        `}
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
                  w-[180px]
                  min-w-[180px]
                  shrink-0
                  items-center
                  justify-end
                  gap-3
                  pl-3
                  xl:flex
                "
              >

                {/* PHONE */}
                <a
                  href={`tel:${siteSettings.phone}`}
                  aria-label={`Call ${siteSettings.school_name}`}
                  className="
                    grid
                    h-11
                    w-11
                    shrink-0
                    place-items-center
                    rounded-full
                    border
                    border-white/15
                    bg-white/[0.035]
                    text-[#F5F0E6]/80
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:border-white/25
                    hover:bg-white/[0.08]
                    hover:text-white
                  "
                >
                  <Phone size={16} />
                </a>

                {/* =================================================
                    DESKTOP ADMISSIONS
                    NOW → /online-registration
                ================================================== */}

                <Link
                  href="/online-registration"
                  className="
                    group
                    inline-flex
                    h-11
                    shrink-0
                    items-center
                    gap-1.5
                    whitespace-nowrap
                    rounded-full
                    bg-[#F5F0E6]
                    px-4
                    text-[13px]
                    font-semibold
                    leading-none
                    !text-[#102A56]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-white
                  "
                >
                  <span className="!text-[#102A56]">
                    Admissions
                  </span>

                  <ArrowUpRight
                    size={14}
                    className="
                      !text-[#102A56]
                      transition-transform
                      duration-300
                      group-hover:-translate-y-0.5
                      group-hover:translate-x-0.5
                    "
                  />
                </Link>

              </div>

              {/* =================================================
                  MOBILE BUTTON
              ================================================== */}

              <button
                type="button"
                aria-label={
                  mobileOpen
                    ? "Close menu"
                    : "Open menu"
                }
                onClick={() =>
                  setMobileOpen(
                    (value) => !value
                  )
                }
                className="
                  ml-auto
                  grid
                  h-11
                  w-11
                  shrink-0
                  place-items-center
                  rounded-full
                  bg-[#F5F0E6]/10
                  !text-[#F5F0E6]
                  xl:hidden
                "
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
            inset-x-4
            top-[124px]
            z-[90]
            max-h-[calc(100vh-145px)]
            overflow-y-auto
            rounded-[26px]
            border
            border-white/10
            bg-[#102A56]/98
            p-4
            shadow-2xl
            backdrop-blur-xl
            xl:hidden
          "
        >

          {rootItems.map((item) => {
            const children =
              getChildren(item.id);

            if (children.length > 0) {
              return (
                <MobileSection
                  key={item.id}
                  item={item}
                  children={children}
                  open={mobileSections.includes(
                    item.id
                  )}
                  onToggle={() =>
                    toggleMobileSection(
                      item.id
                    )
                  }
                  onClose={closeMenus}
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
                onClick={closeMenus}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-2xl
                  px-4
                  py-3.5
                  text-sm
                  !text-[#F5F0E6]
                  hover:bg-[#F5F0E6]/10
                "
              >
                <span>
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* =================================================
              MOBILE ACTIONS
          ================================================== */}

          <div className="mt-3 grid grid-cols-2 gap-2">

            <a
              href={`tel:${siteSettings.phone}`}
              onClick={closeMenus}
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-2xl
                border
                border-white/15
                px-4
                py-3
                text-sm
                !text-[#F5F0E6]/80
              "
            >
              <Phone size={15} />
              Call
            </a>

            <Link
              href="/online-registration"
              onClick={closeMenus}
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-[#F5F0E6]
                px-4
                py-3
                text-sm
                font-semibold
                !text-[#102A56]
              "
            >
              <span className="!text-[#102A56]">
                Admissions
              </span>

              <ArrowUpRight
                size={15}
                className="!text-[#102A56]"
              />
            </Link>

          </div>
        </div>
      )}
    </>
  );
}