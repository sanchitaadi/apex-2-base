"use client";

import Link from "next/link";
import {
  ArrowRight,
  Camera,
  ChevronRight,
  Trophy,
  Music,
  Flag,
  Users,
  Image as ImageIcon,
  Star,
  Heart,
  Medal,
  Award,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browser";

type GalleryPreviewSettings = {
  id: string;
  section_label: string;
  heading_line_1: string;
  heading_line_2: string;
  description: string;

  gallery_button_label: string;
  gallery_button_url: string;

  closing_label: string;
  closing_heading_line_1: string;
  closing_heading_line_2: string;
  closing_button_label: string;
  closing_button_url: string;

  is_active: boolean;
};

type GalleryPreviewItem = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  image_url: string | null;
  icon_name: string;
  size: string;
  link_url: string;
  sort_order: number;
  is_active: boolean;
};

const defaultSettings: GalleryPreviewSettings = {
  id: "default",
  section_label: "Life at Apex",
  heading_line_1: "Moments that",
  heading_line_2: "become memories.",
  description:
    "From sports and cultural celebrations to leadership and everyday school life, there is always something happening at Apex.",
  gallery_button_label: "View full gallery",
  gallery_button_url: "/gallery",
  closing_label: "Explore Apex",
  closing_heading_line_1: "Sports. Culture. Leadership.",
  closing_heading_line_2: "School life in motion.",
  closing_button_label: "Explore activities",
  closing_button_url: "/activities",
  is_active: true,
};

const fallbackItems: GalleryPreviewItem[] = [
  {
    id: "fallback-1",
    title: "Sports Day",
    category: "Sports",
    description: "Energy, teamwork and sporting spirit.",
    image_url:
      "https://apexpublicschool.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-02-at-1.06.01-PM-22.jpeg",
    icon_name: "Trophy",
    size: "large",
    link_url: "/gallery",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "fallback-2",
    title: "Annual Day",
    category: "Culture",
    description: "Celebrating talent and creativity.",
    image_url:
      "https://apexpublicschool.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-02-at-1.06.01-PM-28.jpeg",
    icon_name: "Music",
    size: "small",
    link_url: "/gallery",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "fallback-3",
    title: "Investiture",
    category: "Leadership",
    description: "Leadership, responsibility and confidence.",
    image_url:
      "https://apexpublicschool.in/wp-content/uploads/2020/05/IMG_0413-scaled.jpg",
    icon_name: "Flag",
    size: "small",
    link_url: "/gallery",
    sort_order: 3,
    is_active: true,
  },
  {
    id: "fallback-4",
    title: "Apex Community",
    category: "School Life",
    description: "The people and moments that make Apex.",
    image_url:
      "https://apexpublicschool.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-02-at-1.06.01-PM-22.jpeg",
    icon_name: "Users",
    size: "large",
    link_url: "/gallery",
    sort_order: 4,
    is_active: true,
  },
];

function getIcon(iconName: string) {
  const icons: Record<string, React.ElementType> = {
    Trophy,
    Music,
    Flag,
    Users,
    Camera,
    ImageIcon,
    Star,
    Heart,
    Medal,
    Award,
    Sparkles,
  };

  return icons[iconName] ?? Users;
}

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        margin: "-80px",
      }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export default function GalleryPreview() {
  const [settings, setSettings] =
    useState<GalleryPreviewSettings>(defaultSettings);

  const [galleryItems, setGalleryItems] =
    useState<GalleryPreviewItem[]>(fallbackItems);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadGalleryPreview() {
      try {
        const [{ data: settingsData }, { data: itemsData }] =
          await Promise.all([
            supabase
              .from("gallery_preview_settings")
              .select("*")
              .eq("is_active", true)
              .order("updated_at", { ascending: false })
              .limit(1)
              .maybeSingle(),

            supabase
              .from("gallery_preview_items")
              .select("*")
              .eq("is_active", true)
              .order("sort_order", { ascending: true }),
          ]);

        if (!mounted) return;

        if (settingsData) {
          setSettings({
            id: settingsData.id,
            section_label:
              settingsData.section_label ?? defaultSettings.section_label,
            heading_line_1:
              settingsData.heading_line_1 ??
              defaultSettings.heading_line_1,
            heading_line_2:
              settingsData.heading_line_2 ??
              defaultSettings.heading_line_2,
            description:
              settingsData.description ?? defaultSettings.description,

            gallery_button_label:
              settingsData.gallery_button_label ??
              defaultSettings.gallery_button_label,
            gallery_button_url:
              settingsData.gallery_button_url ??
              defaultSettings.gallery_button_url,

            closing_label:
              settingsData.closing_label ?? defaultSettings.closing_label,
            closing_heading_line_1:
              settingsData.closing_heading_line_1 ??
              defaultSettings.closing_heading_line_1,
            closing_heading_line_2:
              settingsData.closing_heading_line_2 ??
              defaultSettings.closing_heading_line_2,
            closing_button_label:
              settingsData.closing_button_label ??
              defaultSettings.closing_button_label,
            closing_button_url:
              settingsData.closing_button_url ??
              defaultSettings.closing_button_url,

            is_active: settingsData.is_active ?? true,
          });
        }

        if (itemsData && itemsData.length > 0) {
          setGalleryItems(
            itemsData.map((item) => ({
              id: item.id,
              title: item.title ?? "Gallery",
              category: item.category ?? "School Life",
              description: item.description ?? null,
              image_url: item.image_url ?? null,
              icon_name: item.icon_name ?? "Users",
              size: item.size === "large" ? "large" : "small",
              link_url: item.link_url ?? "/gallery",
              sort_order: item.sort_order ?? 0,
              is_active: item.is_active ?? true,
            }))
          );
        }
      } catch (error) {
        console.error("Gallery preview CMS load error:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadGalleryPreview();

    return () => {
      mounted = false;
    };
  }, []);

  if (!settings.is_active) {
    return null;
  }

  return (
    <section
      id="gallery"
      className="
        scroll-mt-36
        overflow-hidden
        bg-[#102A56]
        text-white
      "
    >
      <div
        className="
          mx-auto
          max-w-[1500px]
          px-6
          py-24
          md:px-10
          md:py-32
          lg:px-14
          lg:py-40
        "
      >
        {/* HEADER */}

        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[1fr_.65fr] lg:items-end">

            {/* LEFT */}

            <div>
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.3em]
                  !text-[#F5F0E6]/55
                "
              >
                <Camera
                  size={12}
                  className="!text-[#F5F0E6]/70"
                />

                {settings.section_label}
              </div>

              <h2
                className="
                  mt-6
                  max-w-5xl
                  text-5xl
                  font-semibold
                  leading-[0.9]
                  tracking-[-0.06em]
                  !text-white
                  md:text-7xl
                  lg:text-[6.4vw]
                "
              >
                {settings.heading_line_1}
                <br />
                <span className="!text-[#F5F0E6]/30">
                  {settings.heading_line_2}
                </span>
              </h2>
            </div>

            {/* RIGHT */}

            <div className="max-w-md">
              <p
                className="
                  text-sm
                  leading-7
                  !text-white/60
                  md:text-base
                "
              >
                {settings.description}
              </p>

              <Link
                href={settings.gallery_button_url || "/gallery"}
                style={{
                  backgroundColor: "#FFFDF8",
                  color: "#102A56",
                }}
                className="
                  group
                  mt-7
                  inline-flex
                  items-center
                  gap-3
                  rounded-full
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  shadow-[0_10px_30px_rgba(0,0,0,0.20)]
                  ring-1
                  ring-white/10
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-white
                  hover:shadow-[0_16px_36px_rgba(0,0,0,0.26)]
                "
              >
                <span
                  style={{
                    color: "#102A56",
                  }}
                  className="!text-[#102A56]"
                >
                  {settings.gallery_button_label}
                </span>

                <span
                  style={{
                    backgroundColor: "#102A56",
                  }}
                  className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    transition-transform
                    duration-300
                    group-hover:translate-x-0.5
                  "
                >
                  <ArrowRight
                    size={14}
                    strokeWidth={2.4}
                    style={{
                      color: "#FFFDF8",
                    }}
                    className="!text-[#FFFDF8]"
                  />
                </span>
              </Link>
            </div>
          </div>
        </Reveal>

        {/* GALLERY GRID */}

        <div className="mt-16 grid gap-4 lg:grid-cols-2">
          {!loading &&
            galleryItems.map((item, index) => {
              const Icon = getIcon(item.icon_name);

              return (
                <Reveal
                  key={item.id}
                  delay={index * 0.06}
                >
                  <Link
                    href={item.link_url || "/gallery"}
                    className={`
                      group
                      relative
                      block
                      overflow-hidden
                      rounded-[2rem]
                      bg-[#0A2145]
                      ${
                        item.size === "large"
                          ? "min-h-[500px]"
                          : "min-h-[360px]"
                      }
                    `}
                  >
                    {/* IMAGE */}

                    <div
                      className="
                        absolute
                        inset-0
                        bg-cover
                        bg-center
                        transition
                        duration-700
                        group-hover:scale-[1.04]
                      "
                      style={{
                        backgroundImage: item.image_url
                          ? `url("${item.image_url}")`
                          : undefined,
                      }}
                    />

                    {!item.image_url && (
                      <div
                        className="
                          absolute
                          inset-0
                          flex
                          items-center
                          justify-center
                          bg-[#0A2145]
                        "
                      >
                        <ImageIcon
                          size={52}
                          className="text-white/20"
                        />
                      </div>
                    )}

                    {/* OVERLAY */}

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-[#071A38]/95
                        via-[#102A56]/30
                        to-transparent
                      "
                    />

                    {/* TOP INFO */}

                    <div
                      className="
                        absolute
                        left-6
                        right-6
                        top-6
                        flex
                        items-center
                        justify-between
                        md:left-7
                        md:right-7
                        md:top-7
                      "
                    >
                      <span
                        className="
                          rounded-full
                          border
                          border-white/15
                          bg-black/10
                          px-3
                          py-1.5
                          text-[9px]
                          uppercase
                          tracking-[0.22em]
                          !text-white/70
                          backdrop-blur
                        "
                      >
                        {item.category}
                      </span>

                      <span
                        className="
                          grid
                          h-10
                          w-10
                          place-items-center
                          rounded-full
                          border
                          border-white/15
                          bg-white/10
                          !text-white
                          backdrop-blur
                        "
                      >
                        <Icon
                          size={16}
                          className="!text-white"
                        />
                      </span>
                    </div>

                    {/* BOTTOM */}

                    <div
                      className="
                        absolute
                        bottom-6
                        left-6
                        right-6
                        md:bottom-7
                        md:left-7
                        md:right-7
                      "
                    >
                      <h3
                        className="
                          text-3xl
                          font-semibold
                          tracking-[-0.04em]
                          !text-white
                          md:text-4xl
                        "
                      >
                        {item.title}
                      </h3>

                      <div className="mt-3 flex items-center justify-between gap-4">
                        <p
                          className="
                            text-sm
                            !text-white/60
                          "
                        >
                          {item.description}
                        </p>

                        <span
                          className="
                            grid
                            h-10
                            w-10
                            shrink-0
                            place-items-center
                            rounded-full
                            bg-[#F5F0E6]
                            !text-[#102A56]
                            shadow-[0_6px_20px_rgba(0,0,0,0.18)]
                            transition-all
                            duration-300
                            group-hover:translate-x-1
                            group-hover:bg-white
                          "
                        >
                          <ChevronRight
                            size={16}
                            strokeWidth={2.3}
                            className="!text-[#102A56]"
                          />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
        </div>

        {/* CLOSING CTA */}

        <Reveal delay={0.08}>
          <div
            className="
              mt-16
              flex
              flex-col
              gap-6
              border-t
              border-white/10
              pt-8
              md:flex-row
              md:items-center
              md:justify-between
            "
          >
            <div>
              <p
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.28em]
                  !text-white/35
                "
              >
                {settings.closing_label}
              </p>

              <p
                className="
                  mt-4
                  text-2xl
                  font-medium
                  tracking-[-0.035em]
                  !text-white
                  md:text-4xl
                "
              >
                {settings.closing_heading_line_1}

                <span className="!text-white/30">
                  {" "}
                  {settings.closing_heading_line_2}
                </span>
              </p>
            </div>

            <Link
              href={settings.closing_button_url || "/activities"}
              className="
                group
                inline-flex
                shrink-0
                items-center
                gap-3
                rounded-full
                border
                border-white/20
                bg-white/[0.025]
                px-6
                py-4
                text-sm
                font-semibold
                !text-white
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-white/[0.09]
                hover:!text-white
              "
            >
              <span className="!text-white">
                {settings.closing_button_label}
              </span>

              <span
                className="
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F5F0E6]
                  !text-[#102A56]
                "
              >
                <ArrowRight
                  size={13}
                  className="!text-[#102A56]"
                />
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}