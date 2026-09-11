"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdmin =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  if (isAdmin) {
    return <>{children}</>;
  }

  const isHome = pathname === "/";

  return (
    <>
      {!isHome && <Header />}

      {children}

      {!isHome && <Footer />}
    </>
  );
}