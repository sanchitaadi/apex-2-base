"use client";

import { useEffect, useState } from "react";

type Theme = {
  primary_color: string;
  primary_dark_color: string;
  primary_mid_color: string;
  secondary_color: string;

  background_color: string;
  background_deep_color: string;
  white_color: string;

  text_color: string;
  muted_color: string;

  accent_color: string;

  button_color: string;
  button_text_color: string;
  button_hover_color: string;

  header_color: string;
  footer_color: string;

  loader_color: string;
  loader_accent_color: string;

  /* Large sections */
  section_color: string;
  section_dark_color: string;
  section_text_color: string;

  /* Cards */
  card_color: string;
  card_text_color: string;
  card_border_color: string;
};

const DEFAULT_THEME: Theme = {
  primary_color: "#102a56",
  primary_dark_color: "#0a1d3b",
  primary_mid_color: "#1b3d73",
  secondary_color: "#dce7f5",

  background_color: "#f5f0e6",
  background_deep_color: "#ebe3d3",
  white_color: "#fffdf8",

  text_color: "#10203a",
  muted_color: "#687589",

  accent_color: "#d4a72c",

  button_color: "#102a56",
  button_text_color: "#ffffff",
  button_hover_color: "#1b3d73",

  header_color: "#ffffff",
  footer_color: "#102a56",

  loader_color: "#102a56",
  loader_accent_color: "#d4a72c",

  /* Large sections */
  section_color: "#102a56",
  section_dark_color: "#0a1d3b",
  section_text_color: "#ffffff",

  /* Cards */
  card_color: "#f5f0e6",
  card_text_color: "#102a56",
  card_border_color: "#dce7f5",
};

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  async function loadTheme() {
    try {
      const response = await fetch(`/api/theme?t=${Date.now()}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        console.error("Theme API returned:", response.status);
        return;
      }

      const result = await response.json();

      if (result?.theme) {
        setTheme({
          ...DEFAULT_THEME,
          ...result.theme,
        });
      }
    } catch (error) {
      console.error("Failed to load website theme:", error);
    }
  }

  /*
   * Load theme when website starts
   */
  useEffect(() => {
    loadTheme();

    const handleThemeUpdate = () => {
      loadTheme();
    };

    window.addEventListener(
      "theme-updated",
      handleThemeUpdate
    );

    return () => {
      window.removeEventListener(
        "theme-updated",
        handleThemeUpdate
      );
    };
  }, []);

  /*
   * Apply theme to entire website
   */
  useEffect(() => {
    const root = document.documentElement;

    /* =========================================
       PRIMARY COLOURS
    ========================================= */

    root.style.setProperty(
      "--cms-primary",
      theme.primary_color
    );

    root.style.setProperty(
      "--cms-primary-dark",
      theme.primary_dark_color
    );

    root.style.setProperty(
      "--cms-primary-mid",
      theme.primary_mid_color
    );

    root.style.setProperty(
      "--cms-secondary",
      theme.secondary_color
    );

    /* =========================================
       PAGE BACKGROUND
    ========================================= */

    root.style.setProperty(
      "--cms-background",
      theme.background_color
    );

    root.style.setProperty(
      "--cms-background-deep",
      theme.background_deep_color
    );

    root.style.setProperty(
      "--cms-white",
      theme.white_color
    );

    /* =========================================
       TEXT
    ========================================= */

    root.style.setProperty(
      "--cms-text",
      theme.text_color
    );

    root.style.setProperty(
      "--cms-muted",
      theme.muted_color
    );

    /* =========================================
       ACCENT
    ========================================= */

    root.style.setProperty(
      "--cms-accent",
      theme.accent_color
    );

    /* =========================================
       BUTTONS
    ========================================= */

    root.style.setProperty(
      "--cms-button",
      theme.button_color
    );

    root.style.setProperty(
      "--cms-button-text",
      theme.button_text_color
    );

    root.style.setProperty(
      "--cms-button-hover",
      theme.button_hover_color
    );

    /* =========================================
       HEADER / FOOTER
    ========================================= */

    root.style.setProperty(
      "--cms-header",
      theme.header_color
    );

    root.style.setProperty(
      "--cms-footer",
      theme.footer_color
    );

    /* =========================================
       LOADER
    ========================================= */

    root.style.setProperty(
      "--cms-loader",
      theme.loader_color
    );

    root.style.setProperty(
      "--cms-loader-accent",
      theme.loader_accent_color
    );

    /* =========================================
       LARGE SECTIONS
    ========================================= */

    root.style.setProperty(
      "--cms-section",
      theme.section_color
    );

    root.style.setProperty(
      "--cms-section-dark",
      theme.section_dark_color
    );

    root.style.setProperty(
      "--cms-section-text",
      theme.section_text_color
    );

    /* =========================================
       CARDS
    ========================================= */

    root.style.setProperty(
      "--cms-card",
      theme.card_color
    );

    root.style.setProperty(
      "--cms-card-text",
      theme.card_text_color
    );

    root.style.setProperty(
      "--cms-card-border",
      theme.card_border_color
    );

    /*
     * Useful aliases for components that use
     * generic theme variables.
     */
    root.style.setProperty(
      "--primary",
      theme.primary_color
    );

    root.style.setProperty(
      "--primary-dark",
      theme.primary_dark_color
    );

    root.style.setProperty(
      "--primary-mid",
      theme.primary_mid_color
    );

    root.style.setProperty(
      "--secondary",
      theme.secondary_color
    );

    root.style.setProperty(
      "--background",
      theme.background_color
    );

    root.style.setProperty(
      "--foreground",
      theme.text_color
    );

    root.style.setProperty(
      "--accent",
      theme.accent_color
    );
  }, [theme]);

  return <>{children}</>;
}