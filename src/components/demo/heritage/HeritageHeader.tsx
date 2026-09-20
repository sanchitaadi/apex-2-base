"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

const links = [
  { label: "About", href: "/demo/heritage/about" },
  { label: "Academics", href: "/demo/heritage/academics" },
  { label: "Admissions", href: "/demo/heritage/admissions" },
  { label: "Campus", href: "/demo/heritage/campus" },
  { label: "Notices", href: "/demo/heritage/notices" },
  { label: "Gallery", href: "/demo/heritage/gallery" },
];

export default function HeritageHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-[#551B2A] !text-[#F7F1E8] px-4 py-2 text-center text-[10px] font-semibold tracking-[0.28em] text-[#C5A15B] sm:text-xs">
        APEX PUBLIC SCHOOL • EXCELLENCE • CHARACTER • LEADERSHIP
      </div>

      <header className="sticky top-0 z-50 border-b border-[#551B2A]/10 bg-[#F7F1E8]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[82px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/demo/heritage"
            className="group flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C5A15B] text-lg font-serif font-bold text-[#551B2A]">
              A
            </div>

            <div>
              <div className="font-serif text-xl font-bold tracking-wide text-[#551B2A]">
                APEX
              </div>
              <div className="text-[9px] font-semibold tracking-[0.28em] text-[#6B7280]">
                PUBLIC SCHOOL
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-[#26364A] transition hover:text-[#C5A15B]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/demo/heritage/contact"
              className="flex items-center gap-2 border border-[#551B2A]/15 px-5 py-3 text-xs font-semibold text-[#551B2A] transition hover:border-[#C5A15B]"
            >
              Contact
              <ArrowUpRight size={14} />
            </Link>

            <Link
              href="/demo/heritage/admissions"
              className="bg-[#551B2A] !text-[#F7F1E8] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#C5A15B] !text-[#F7F1E8]"
            >
              Admissions
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="rounded-full border border-[#551B2A]/15 p-3 text-[#551B2A] lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {open && (
          <div className="border-t border-[#551B2A]/10 bg-[#F7F1E8] px-5 py-5 lg:hidden">
            <nav className="flex flex-col">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-[#551B2A]/10 py-4 text-sm font-medium text-[#551B2A]"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/demo/heritage/contact"
                onClick={() => setOpen(false)}
                className="mt-4 bg-[#551B2A] !text-[#F7F1E8] px-5 py-4 text-center text-sm font-semibold text-white"
              >
                Contact Apex
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}


