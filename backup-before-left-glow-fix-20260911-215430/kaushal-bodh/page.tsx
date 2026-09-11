"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase/browser";

type GalleryImage = {
  url: string;
  caption?: string;
};

type KaushalBodhItem = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  event_date: string | null;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  gallery_images: GalleryImage[];
};

function formatDate(date: string | null) {
  if (!date) return null;

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function KaushalBodhPage() {
  const [items, setItems] = useState<KaushalBodhItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [lightboxImages, setLightboxImages] = useState<GalleryImage[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    async function loadItems() {
      setLoading(true);

      const { data, error } = await supabase
        .from("kaushal_bodh")
        .select(
          "id,title,description,image_url,event_date,sort_order,is_featured,is_active,gallery_images"
        )
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("event_date", { ascending: false });

      if (error) {
        console.error("Kaushal Bodh error:", error);
        setItems([]);
      } else {
        const normalized = ((data || []) as KaushalBodhItem[]).map(
          (item) => ({
            ...item,
            gallery_images: Array.isArray(item.gallery_images)
              ? item.gallery_images
              : [],
          })
        );

        setItems(normalized);
      }

      setLoading(false);
    }

    void loadItems();
  }, []);

  function openGallery(images: GalleryImage[], index = 0) {
    if (!images.length) return;

    setLightboxImages(images);
    setLightboxIndex(index);
  }

  function closeGallery() {
    setLightboxImages([]);
    setLightboxIndex(0);
  }

  function nextImage() {
    if (!lightboxImages.length) return;

    setLightboxIndex((current) =>
      current === lightboxImages.length - 1 ? 0 : current + 1
    );
  }

  function previousImage() {
    if (!lightboxImages.length) return;

    setLightboxIndex((current) =>
      current === 0 ? lightboxImages.length - 1 : current - 1
    );
  }

  useEffect(() => {
    function handleKeyboard(event: KeyboardEvent) {
      if (!lightboxImages.length) return;

      if (event.key === "Escape") {
        closeGallery();
      }

      if (event.key === "ArrowRight") {
        nextImage();
      }

      if (event.key === "ArrowLeft") {
        previousImage();
      }
    }

    document.addEventListener("keydown", handleKeyboard);

    return () => {
      document.removeEventListener("keydown", handleKeyboard);
    };
  }, [lightboxImages]);

  return (
    <main className="min-h-screen bg-[#f5f0e6] text-[#102a56]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#102a56]">
        <div className="absolute inset-0 opacity-[0.08]">
          <div className="absolute -left-28 -top-28 h-[430px] w-[430px] rounded-full border border-white" />
          <div className="absolute -bottom-44 right-[-120px] h-[560px] w-[560px] rounded-full border border-white" />
          <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-12">
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#f5f0e6]/55">
              Apex Public School
            </p>

            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.045em] text-[#f5f0e6] md:text-6xl lg:text-7xl">
              Kaushal Bodh
            </h1>

            <div className="mt-7 flex items-center gap-3 text-sm font-medium text-[#f5f0e6]/65">
              <span>HOME</span>
              <span>/</span>
              <span className="text-[#f5f0e6]">KAUSHALBODH</span>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#102a56]/45">
            Gallery
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.035em] md:text-5xl">
            KaushalBodh Gallery
          </h2>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-[28px] border border-[#102a56]/10 bg-white/50"
              >
                <div className="aspect-[16/10] animate-pulse bg-[#102a56]/8" />

                <div className="space-y-3 p-6">
                  <div className="h-3 w-28 animate-pulse rounded bg-[#102a56]/10" />
                  <div className="h-6 w-3/4 animate-pulse rounded bg-[#102a56]/10" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-[30px] border border-dashed border-[#102a56]/15 bg-white/40 px-6 py-20 text-center">
            <ImageIcon className="mx-auto h-10 w-10 text-[#102a56]/20" />

            <h3 className="mt-5 text-2xl font-semibold">
              Gallery coming soon
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-[#102a56]/55">
              Kaushal Bodh gallery entries will appear here when they are
              published.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {items.map((item) => {
              const date = formatDate(item.event_date);

              /*
               * The cover is included as the first lightbox image only
               * when it exists. The actual gallery photos come from
               * gallery_images.
               */
              const galleryImages: GalleryImage[] = [
                ...(item.image_url
                  ? [
                      {
                        url: item.image_url,
                        caption: item.title,
                      },
                    ]
                  : []),
                ...item.gallery_images,
              ];

              return (
                <div key={item.id}>
                  {/* ENTRY HEADER */}
                  <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                      {date && (
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#102a56]/40">
                          {date}
                        </p>
                      )}

                      <h3 className="mt-2 text-2xl font-semibold tracking-[-0.025em] md:text-3xl">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#102a56]/55">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {galleryImages.length > 0 && (
                      <button
                        type="button"
                        onClick={() => openGallery(galleryImages, 0)}
                        className="inline-flex w-fit items-center gap-2 rounded-full bg-[#102a56] px-5 py-3 text-sm font-semibold text-[#f5f0e6] transition hover:bg-[#193c78]"
                      >
                        View Full Gallery
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* PHOTO GRID */}
                  {galleryImages.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {galleryImages.map((image, index) => (
                        <button
                          key={`${image.url}-${index}`}
                          type="button"
                          onClick={() => openGallery(galleryImages, index)}
                          className={`group relative overflow-hidden rounded-[24px] bg-[#102a56]/5 ${
                            index === 0
                              ? "sm:col-span-2 lg:col-span-2 lg:row-span-2"
                              : ""
                          }`}
                        >
                          <div
                            className={
                              index === 0
                                ? "aspect-[16/11]"
                                : "aspect-[4/3]"
                            }
                          >
                            <img
                              src={image.url}
                              alt={
                                image.caption ||
                                `${item.title} photo ${index + 1}`
                              }
                              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
                            />
                          </div>

                          <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/15" />

                          {image.caption && (
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-4 pb-4 pt-10 text-left opacity-0 transition duration-300 group-hover:opacity-100">
                              <p className="text-xs font-medium text-white">
                                {image.caption}
                              </p>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[28px] border border-dashed border-[#102a56]/15 bg-white/40 py-16 text-center">
                      <ImageIcon className="mx-auto h-9 w-9 text-[#102a56]/20" />

                      <p className="mt-3 text-sm text-[#102a56]/45">
                        No photographs have been added yet.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* LIGHTBOX */}
      {lightboxImages.length > 0 && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeGallery();
            }
          }}
        >
          {/* CLOSE */}
          <button
            type="button"
            onClick={closeGallery}
            className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close gallery"
          >
            <X className="h-5 w-5" />
          </button>

          {/* PREVIOUS */}
          {lightboxImages.length > 1 && (
            <button
              type="button"
              onClick={previousImage}
              className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:left-8"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* IMAGE */}
          <div className="flex max-h-[90vh] max-w-[90vw] flex-col items-center">
            <img
              src={lightboxImages[lightboxIndex].url}
              alt={
                lightboxImages[lightboxIndex].caption ||
                `Gallery image ${lightboxIndex + 1}`
              }
              className="max-h-[78vh] max-w-full rounded-xl object-contain shadow-2xl"
            />

            {lightboxImages[lightboxIndex].caption && (
              <p className="mt-5 text-center text-sm font-medium text-white">
                {lightboxImages[lightboxIndex].caption}
              </p>
            )}

            <p className="mt-2 text-xs text-white/50">
              {lightboxIndex + 1} / {lightboxImages.length}
            </p>
          </div>

          {/* NEXT */}
          {lightboxImages.length > 1 && (
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:right-8"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>
      )}
    </main>
  );
}