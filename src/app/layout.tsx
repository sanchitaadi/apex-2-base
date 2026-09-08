import type { Metadata } from "next";
import "./globals.css";

import FloatingActions from "@/components/layout/FloatingActions";
import GlobalMotion from "@/components/shared/GlobalMotion";
import SiteLoader from "@/components/layout/SiteLoader";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export const metadata: Metadata = {
  title: "Apex Public School",
  description: "Apex Public School — Answer Duty’s Call",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <SiteLoader />
          <GlobalMotion />

          {children}

          <FloatingActions />
        </ThemeProvider>
      </body>
    </html>
  );
}