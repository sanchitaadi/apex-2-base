"use client";

import { usePathname } from "next/navigation";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";

export default function SiteChrome() {
  const pathname = usePathname();

  // Demo websites have their own completely separate
  // Header and Footer.
  const isDemo =
    pathname === "/demo" ||
    pathname.startsWith("/demo/");

  if (isDemo) {
    return null;
  }

  return (
    <>
      <Header />
      <Footer />
      <FloatingActions />
    </>
  );
}

