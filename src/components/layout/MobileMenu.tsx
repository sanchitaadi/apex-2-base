"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  X,
} from "lucide-react";

type MenuItem = {
  label: string;
  href: string;
  external?: boolean;
};

type DropdownItem = {
  label: string;
  href: string;
  external?: boolean;
};

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;

  aboutItems?: DropdownItem[];
  noticesItems?: DropdownItem[];
  academicItems?: DropdownItem[];
  admissionItems?: DropdownItem[];

  topLinks?: MenuItem[];
};

export default function MobileMenu({
  open,
  onClose,
  aboutItems = [],
  noticesItems = [],
  academicItems = [],
  admissionItems = [],
  topLinks = [],
}: MobileMenuProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] xl:hidden">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close mobile menu"
        onClick={onClose}
        className="absolute inset-0 bg-[#06152D]/75 backdrop-blur-md"
      />

      {/* Panel */}
      <aside
        className="
          absolute
          inset-x-3
          top-3
          bottom-3
          overflow-y-auto
          rounded-[2rem]
          border
          border-[#F5F0E6]/15
          bg-[#102A56]
          text-[#F5F0E6]
          shadow-[0_30px_100px_rgba(0,0,0,0.35)]
        "
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#F5F0E6]/10 bg-[#102A56]/95 px-5 py-5 backdrop-blur-md">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#F5F0E6]/40">
              Apex Public School
            </p>

            <p className="mt-1 text-sm font-semibold tracking-wide text-[#F5F0E6]">
              Menu
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="
              grid h-11 w-11
              place-items-center
              rounded-full
              border border-[#F5F0E6]/15
              bg-[#F5F0E6]/5
              text-[#F5F0E6]
              transition
              hover:bg-[#F5F0E6]/10
            "
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 py-6">
          {/* MAIN LINKS */}
          <div className="space-y-2">
            <MobileLink
              href="/"
              label="Home"
              onClose={onClose}
            />

            <MobileDropdown
              label="About"
              items={aboutItems}
              onClose={onClose}
            />

            <MobileDropdown
              label="Notices"
              items={noticesItems}
              onClose={onClose}
            />

            <MobileDropdown
              label="Academic"
              items={academicItems}
              onClose={onClose}
            />

            <MobileDropdown
              label="Admission"
              items={admissionItems}
              onClose={onClose}
            />

            {topLinks.map((item) => (
              <MobileLink
                key={item.label}
                href={item.href}
                label={item.label}
                external={item.external}
                onClose={onClose}
              />
            ))}
          </div>

          {/* ACTIONS */}
          <div className="mt-7 border-t border-[#F5F0E6]/10 pt-6">
            <Link
              href="/admissions"
              onClick={onClose}
              className="
                flex w-full items-center justify-between
                rounded-2xl
                bg-[#F5F0E6]
                px-5 py-4
                text-sm
                font-semibold
                !text-[#102A56]
                shadow-[0_12px_30px_rgba(0,0,0,0.12)]
              "
            >
              <span className="!text-[#102A56]">
                Admissions
              </span>

              <ArrowUpRight
                size={17}
                className="!text-[#102A56]"
              />
            </Link>

            <a
              href="tel:09990061747"
              onClick={onClose}
              className="
                mt-3
                flex w-full items-center justify-between
                rounded-2xl
                border border-[#F5F0E6]/15
                bg-[#F5F0E6]/5
                px-5 py-4
                text-sm
                !text-[#F5F0E6]
              "
            >
              <span className="!text-[#F5F0E6]">
                Call the school
              </span>

              <span className="text-xs !text-[#F5F0E6]/55">
                09990061747
              </span>
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}

function MobileLink({
  href,
  label,
  external,
  onClose,
}: {
  href: string;
  label: string;
  external?: boolean;
  onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="
        flex items-center justify-between
        rounded-2xl
        border border-transparent
        px-4 py-4
        text-base
        font-medium
        !text-[#F5F0E6]
        transition
        hover:border-[#F5F0E6]/10
        hover:bg-[#F5F0E6]/5
      "
    >
      <span className="!text-[#F5F0E6]">
        {label}
      </span>

      <ArrowUpRight
        size={16}
        className="!text-[#F5F0E6]/45"
      />
    </Link>
  );
}

function MobileDropdown({
  label,
  items,
  onClose,
}: {
  label: string;
  items: DropdownItem[];
  onClose: () => void;
}) {
  if (!items.length) {
    return (
      <MobileLink
        href="#"
        label={label}
        onClose={onClose}
      />
    );
  }

  return (
    <details className="group overflow-hidden rounded-2xl border border-transparent open:border-[#F5F0E6]/10 open:bg-[#F5F0E6]/5">
      <summary
        className="
          flex cursor-pointer
          list-none
          items-center justify-between
          px-4 py-4
          text-base
          font-medium
          !text-[#F5F0E6]
        "
      >
        <span className="!text-[#F5F0E6]">
          {label}
        </span>

        <ChevronDown
          size={18}
          className="
            !text-[#F5F0E6]/45
            transition-transform
            duration-300
            group-open:rotate-180
          "
        />
      </summary>

      <div className="border-t border-[#F5F0E6]/10 px-3 pb-3 pt-2">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onClose}
            target={
              item.external ? "_blank" : undefined
            }
            rel={
              item.external ? "noreferrer" : undefined
            }
            className="
              flex items-center justify-between
              rounded-xl
              px-3 py-3
              text-sm
              !text-[#F5F0E6]/75
              transition
              hover:bg-[#F5F0E6]/5
              hover:!text-white
            "
          >
            <span>
              {item.label}
            </span>

            <ArrowUpRight
              size={14}
              className="!text-[#F5F0E6]/35"
            />
          </Link>
        ))}
      </div>
    </details>
  );
}