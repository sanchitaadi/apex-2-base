"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browser";

type Theme = {
  id?: string;
  palette_name: string;

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

  /* Independent large-section and card colours */
  section_color: string;
  section_dark_color: string;
  card_color: string;
  card_text_color: string;
  card_border_color: string;
};

const DEFAULT_THEME: Theme = {
  palette_name: "Classic Blue",

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

  section_color: "#102a56",
  section_dark_color: "#0a1d3b",
  card_color: "#102a56",
  card_text_color: "#ffffff",
  card_border_color: "#1b3d73",
};

const COLOR_FIELDS: {
  key: keyof Theme;
  label: string;
  description: string;
}[] = [
  {
    key: "primary_color",
    label: "Primary",
    description: "Main school brand colour",
  },
  {
    key: "primary_dark_color",
    label: "Primary Dark",
    description: "Dark version of the primary colour",
  },
  {
    key: "primary_mid_color",
    label: "Primary Mid",
    description: "Medium brand colour",
  },
  {
    key: "secondary_color",
    label: "Secondary",
    description: "Secondary supporting colour",
  },
  {
    key: "background_color",
    label: "Background",
    description: "Main website background",
  },
  {
    key: "background_deep_color",
    label: "Deep Background",
    description: "Darker background sections",
  },
  {
    key: "white_color",
    label: "White",
    description: "Cards and light surfaces",
  },
  {
    key: "text_color",
    label: "Text",
    description: "Main text colour",
  },
  {
    key: "muted_color",
    label: "Muted Text",
    description: "Secondary text colour",
  },
  {
    key: "accent_color",
    label: "Accent / Gold",
    description: "Highlights, borders and decorative accents",
  },
  {
    key: "button_color",
    label: "Button",
    description: "Main button background",
  },
  {
    key: "button_text_color",
    label: "Button Text",
    description: "Text inside buttons",
  },
  {
    key: "button_hover_color",
    label: "Button Hover",
    description: "Button hover colour",
  },
  {
    key: "header_color",
    label: "Header",
    description: "Header background",
  },
  {
    key: "footer_color",
    label: "Footer",
    description: "Footer background",
  },
  {
    key: "section_color",
    label: "Large Section",
    description: "Colour for large dark page sections",
  },
  {
    key: "section_dark_color",
    label: "Large Section Dark",
    description: "Darker large-section background",
  },
  {
    key: "card_color",
    label: "Card Colour",
    description: "Background colour for feature / dark cards",
  },
  {
    key: "card_text_color",
    label: "Card Text",
    description: "Text and icon colour used inside dark cards",
  },
  {
    key: "card_border_color",
    label: "Card Border",
    description: "Border colour for feature / dark cards",
  },
  {
    key: "loader_color",
    label: "Loader",
    description: "Website loading screen colour",
  },
  {
    key: "loader_accent_color",
    label: "Loader Accent",
    description: "Loader highlight colour",
  },
];

export default function ThemeAdminPage() {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadTheme();
  }, []);

  async function loadTheme() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("website_theme")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(error);
        setMessage("Unable to load theme.");
        return;
      }

      if (data) {
        setTheme({
          ...DEFAULT_THEME,
          ...data,
        });
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to load theme.");
    } finally {
      setLoading(false);
    }
  }

  function updateColor(key: keyof Theme, value: string) {
    setTheme((current) => ({
      ...current,
      [key]: value,
    }));

    setMessage("");
  }

  async function saveTheme() {
    try {
      setSaving(true);
      setMessage("");

      const payload = {
        palette_name: theme.palette_name,

        primary_color: theme.primary_color,
        primary_dark_color: theme.primary_dark_color,
        primary_mid_color: theme.primary_mid_color,
        secondary_color: theme.secondary_color,

        background_color: theme.background_color,
        background_deep_color: theme.background_deep_color,
        white_color: theme.white_color,

        text_color: theme.text_color,
        muted_color: theme.muted_color,

        accent_color: theme.accent_color,

        button_color: theme.button_color,
        button_text_color: theme.button_text_color,
        button_hover_color: theme.button_hover_color,

        header_color: theme.header_color,
        footer_color: theme.footer_color,

        loader_color: theme.loader_color,
        loader_accent_color: theme.loader_accent_color,

        section_color: theme.section_color,
        section_dark_color: theme.section_dark_color,
        card_color: theme.card_color,
        card_text_color: theme.card_text_color,
        card_border_color: theme.card_border_color,

        updated_at: new Date().toISOString(),
      };

      if (theme.id) {
        const { error } = await supabase
          .from("website_theme")
          .update(payload)
          .eq("id", theme.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("website_theme")
          .insert(payload)
          .select()
          .single();

        if (error) throw error;

        if (data) {
          setTheme((current) => ({
            ...current,
            id: data.id,
          }));
        }
      }

      setMessage("Theme saved successfully.");

      window.dispatchEvent(new Event("theme-updated"));
    } catch (error: any) {
      console.error("Theme save error:", error);
      setMessage(
        error?.message || "Unable to save theme."
      );
    } finally {
      setSaving(false);
    }
  }

  function resetTheme() {
    setTheme((current) => ({
      ...DEFAULT_THEME,
      id: current.id,
    }));

    setMessage("Theme reset to Classic Blue. Click Save Theme to apply it.");
  }

  if (loading) {
    return (
      <div
        className="min-h-screen p-8"
        style={{
          backgroundColor: theme.background_color,
          color: theme.text_color,
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse">
            <div className="mb-4 h-8 w-64 rounded bg-slate-200" />
            <div className="mb-8 h-4 w-96 rounded bg-slate-200" />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, index) => (
                <div
                  key={index}
                  className="h-32 rounded-2xl bg-white shadow-sm"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: theme.background_color,
        color: theme.text_color,
      }}
    >
      {/* HEADER */}
      <div
        className="border-b"
        style={{
          backgroundColor: theme.header_color,
          borderColor: `${theme.primary_color}20`,
        }}
      >
        <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div
                className="mb-2 text-xs font-bold uppercase tracking-[0.25em]"
                style={{ color: theme.accent_color }}
              >
                Apex Public School
              </div>

              <h1
                className="text-3xl font-bold tracking-tight"
                style={{ color: theme.primary_color }}
              >
                Website Theme
              </h1>

              <p
                className="mt-2 max-w-2xl text-sm"
                style={{ color: theme.muted_color }}
              >
                Manage the colours used throughout the school website
                from one place.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={resetTheme}
                className="rounded-xl border px-5 py-3 text-sm font-semibold transition hover:opacity-80"
                style={{
                  borderColor: `${theme.primary_color}30`,
                  color: theme.primary_color,
                  backgroundColor: theme.white_color,
                }}
              >
                Reset
              </button>

              <button
                type="button"
                onClick={saveTheme}
                disabled={saving}
                className="rounded-xl px-6 py-3 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundColor: theme.button_color,
                  color: theme.button_text_color,
                }}
              >
                {saving ? "Saving..." : "Save Theme"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        {/* MESSAGE */}
        {message && (
          <div
            className="mb-6 rounded-2xl border px-5 py-4 text-sm font-medium"
            style={{
              backgroundColor: theme.white_color,
              borderColor: `${theme.accent_color}50`,
              color: theme.text_color,
            }}
          >
            {message}
          </div>
        )}

        {/* PALETTE NAME */}
        <section
          className="mb-8 rounded-3xl border p-6 shadow-sm"
          style={{
            backgroundColor: theme.white_color,
            borderColor: `${theme.primary_color}18`,
          }}
        >
          <div className="mb-5">
            <h2
              className="text-xl font-bold"
              style={{ color: theme.primary_color }}
            >
              Theme Information
            </h2>

            <p
              className="mt-1 text-sm"
              style={{ color: theme.muted_color }}
            >
              Give this colour palette a name so it is easy to identify.
            </p>
          </div>

          <div className="max-w-xl">
            <label
              className="mb-2 block text-sm font-semibold"
              style={{ color: theme.text_color }}
            >
              Palette Name
            </label>

            <input
              type="text"
              value={theme.palette_name}
              onChange={(e) =>
                setTheme((current) => ({
                  ...current,
                  palette_name: e.target.value,
                }))
              }
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2"
              style={{
                backgroundColor: theme.background_color,
                borderColor: `${theme.primary_color}25`,
                color: theme.text_color,
              }}
              placeholder="Example: Classic Blue"
            />
          </div>
        </section>

        {/* COLOR GRID */}
        <section>
          <div className="mb-5">
            <h2
              className="text-2xl font-bold"
              style={{ color: theme.primary_color }}
            >
              Website Colours
            </h2>

            <p
              className="mt-1 text-sm"
              style={{ color: theme.muted_color }}
            >
              Change any colour below. The preview on the right updates
              immediately.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {COLOR_FIELDS.map((field) => {
              const value = String(theme[field.key] || "");

              return (
                <div
                  key={field.key}
                  className="rounded-3xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  style={{
                    backgroundColor: theme.white_color,
                    borderColor: `${theme.primary_color}18`,
                  }}
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <h3
                        className="font-bold"
                        style={{ color: theme.text_color }}
                      >
                        {field.label}
                      </h3>

                      <p
                        className="mt-1 text-xs leading-5"
                        style={{ color: theme.muted_color }}
                      >
                        {field.description}
                      </p>
                    </div>

                    <div
                      className="h-11 w-11 shrink-0 rounded-xl border shadow-inner"
                      style={{
                        backgroundColor: value,
                        borderColor: `${theme.text_color}20`,
                      }}
                    />
                  </div>

                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={
                        /^#[0-9A-Fa-f]{6}$/.test(value)
                          ? value
                          : "#102a56"
                      }
                      onChange={(e) =>
                        updateColor(field.key, e.target.value)
                      }
                      className="h-11 w-14 cursor-pointer rounded-lg border bg-transparent p-1"
                    />

                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        updateColor(field.key, e.target.value)
                      }
                      className="min-w-0 flex-1 rounded-xl border px-4 text-sm font-mono outline-none"
                      style={{
                        backgroundColor: theme.background_color,
                        borderColor: `${theme.primary_color}25`,
                        color: theme.text_color,
                      }}
                      placeholder="#102a56"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* LIVE PREVIEW */}
        <section className="mt-10">
          <div className="mb-5">
            <h2
              className="text-2xl font-bold"
              style={{ color: theme.primary_color }}
            >
              Live Preview
            </h2>

            <p
              className="mt-1 text-sm"
              style={{ color: theme.muted_color }}
            >
              This gives you an idea of how the selected palette will
              look across the website.
            </p>
          </div>

          <div
            className="overflow-hidden rounded-[2rem] border shadow-xl"
            style={{
              backgroundColor: theme.background_color,
              borderColor: `${theme.primary_color}25`,
            }}
          >
            {/* PREVIEW HEADER */}
            <div
              className="flex items-center justify-between px-6 py-5 md:px-8"
              style={{
                backgroundColor: theme.header_color,
                borderBottom: `1px solid ${theme.primary_color}20`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full font-bold"
                  style={{
                    backgroundColor: theme.primary_color,
                    color: theme.button_text_color,
                  }}
                >
                  A
                </div>

                <div>
                  <div
                    className="font-bold"
                    style={{ color: theme.primary_color }}
                  >
                    Apex Public School
                  </div>

                  <div
                    className="text-xs"
                    style={{ color: theme.muted_color }}
                  >
                    Excellence • Character • Future
                  </div>
                </div>
              </div>

              <div
                className="hidden rounded-full px-4 py-2 text-xs font-semibold md:block"
                style={{
                  backgroundColor: theme.secondary_color,
                  color: theme.primary_color,
                }}
              >
                Admissions Open
              </div>
            </div>

            {/* PREVIEW HERO */}
            <div
              className="px-6 py-12 md:px-12"
              style={{
                background: `linear-gradient(135deg, ${theme.primary_dark_color}, ${theme.primary_color}, ${theme.primary_mid_color})`,
                color: theme.button_text_color,
              }}
            >
              <div className="max-w-2xl">
                <div
                  className="mb-4 text-xs font-bold uppercase tracking-[0.3em]"
                  style={{ color: theme.accent_color }}
                >
                  Welcome to Apex
                </div>

                <h3 className="text-3xl font-bold md:text-5xl">
                  Building Bright Futures
                </h3>

                <p
                  className="mt-4 max-w-xl text-sm leading-7"
                  style={{
                    color: theme.secondary_color,
                  }}
                >
                  A modern school environment where knowledge,
                  confidence and character grow together.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="rounded-full px-6 py-3 text-sm font-bold shadow-lg"
                    style={{
                      backgroundColor: theme.button_color,
                      color: theme.button_text_color,
                    }}
                  >
                    Explore School
                  </button>

                  <button
                    type="button"
                    className="rounded-full border px-6 py-3 text-sm font-bold"
                    style={{
                      borderColor: theme.accent_color,
                      color: theme.button_text_color,
                    }}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            {/* PREVIEW LARGE SECTION */}
            <div
              className="px-6 py-10 md:px-8"
              style={{
                backgroundColor: theme.section_color,
                color: theme.card_text_color,
              }}
            >
              <div className="max-w-3xl">
                <div
                  className="text-xs font-bold uppercase tracking-[0.25em]"
                  style={{ color: theme.accent_color }}
                >
                  Large Section Preview
                </div>

                <h3
                  className="mt-3 text-2xl font-bold md:text-3xl"
                  style={{ color: theme.card_text_color }}
                >
                  This is the colour used for large page sections
                </h3>

                <p
                  className="mt-3 text-sm leading-7"
                  style={{
                    color: theme.card_text_color,
                    opacity: 0.72,
                  }}
                >
                  Change “Large Section” above to control this type of
                  full-width dark website area independently.
                </p>
              </div>
            </div>

            {/* PREVIEW CARDS */}
            <div className="grid gap-4 p-6 md:grid-cols-3 md:p-8">
              {[
                ["01", "Academic Excellence"],
                ["02", "Holistic Development"],
                ["03", "Future Ready"],
              ].map(([number, title]) => (
                <div
                  key={number}
                  className="rounded-2xl border p-5"
                  style={{
                    backgroundColor: theme.card_color,
                    borderColor: theme.card_border_color,
                    color: theme.card_text_color,
                  }}
                >
                  <div
                    className="mb-4 text-xs font-bold"
                    style={{ color: theme.accent_color }}
                  >
                    {number}
                  </div>

                  <h4
                    className="font-bold"
                    style={{ color: theme.primary_color }}
                  >
                    {title}
                  </h4>

                  <p
                    className="mt-2 text-sm leading-6"
                    style={{ color: theme.muted_color }}
                  >
                    Designed to support every student's learning and
                    development journey.
                  </p>
                </div>
              ))}
            </div>

            {/* PREVIEW FOOTER */}
            <div
              className="px-6 py-6 md:px-8"
              style={{
                backgroundColor: theme.footer_color,
                color: theme.button_text_color,
              }}
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="font-semibold">
                  Apex Public School
                </div>

                <div
                  className="text-xs"
                  style={{
                    color: theme.secondary_color,
                  }}
                >
                  © School Website
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}