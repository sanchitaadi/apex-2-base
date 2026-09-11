"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { supabase } from "@/lib/supabase/browser";

type Album = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  cover_image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

type GalleryImage = {
  id: string;
  album_id: string;
  image_url: string;
  title: string | null;
  caption: string | null;
  sort_order: number;
  is_active: boolean;
};

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function normalizeImage(
  item: Record<string, unknown>,
  albumId: string,
  index: number
): GalleryImage | null {
  const imageUrl =
    typeof item.image_url === "string"
      ? item.image_url
      : typeof item.url === "string"
      ? item.url
      : typeof item.photo_url === "string"
      ? item.photo_url
      : typeof item.src === "string"
      ? item.src
      : null;

  if (!imageUrl) {
    return null;
  }

  return {
    id:
      typeof item.id === "string"
        ? item.id
        : `${albumId}-${index}`,
    album_id: albumId,
    image_url: imageUrl,
    title:
      typeof item.title === "string"
        ? item.title
        : null,
    caption:
      typeof item.caption === "string"
        ? item.caption
        : null,
    sort_order:
      typeof item.sort_order === "number"
        ? item.sort_order
        : index + 1,
    is_active:
      item.is_active === false
        ? false
        : true,
  };
}

export default function GalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedAlbum, setSelectedAlbum] =
    useState<Album | null>(null);

  const [albumImages, setAlbumImages] =
    useState<GalleryImage[]>([]);

  const [imagesLoading, setImagesLoading] =
    useState(false);

  const [imagesError, setImagesError] =
    useState("");

  const [selectedImage, setSelectedImage] =
    useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadAlbums() {
      setLoading(true);

      const { data, error } = await supabase
        .from("gallery_albums")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", {
          ascending: true,
        });

      if (!mounted) return;

      if (error) {
        console.error("Gallery load failed:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });

        setAlbums([]);
      } else {
        setAlbums((data || []) as Album[]);
      }

      setLoading(false);
    }

    loadAlbums();

    return () => {
      mounted = false;
    };
  }, []);

  async function openAlbum(album: Album) {
    setSelectedAlbum(album);
    setAlbumImages([]);
    setSelectedImage(null);
    setImagesError("");
    setImagesLoading(true);

    try {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .eq("album_id", album.id)
        .eq("is_active", true)
        .order("sort_order", {
          ascending: true,
        });

      if (error) {
        console.error(
          "Album images load failed:",
          error
        );

        setImagesError(
          error.message ||
            "Unable to load album images."
        );

        return;
      }

      const normalized = (data || [])
        .map((item, index) =>
          normalizeImage(
            item as Record<string, unknown>,
            album.id,
            index
          )
        )
        .filter(
          (item): item is GalleryImage =>
            item !== null
        );

      setAlbumImages(normalized);
    } catch (error) {
      console.error(
        "Album images load failed:",
        error
      );

      setImagesError(
        "Unable to load album images."
      );
    } finally {
      setImagesLoading(false);
    }
  }

  function closeAlbum() {
    setSelectedAlbum(null);
    setAlbumImages([]);
    setSelectedImage(null);
    setImagesError("");
  }

  function openImage(index: number) {
    setSelectedImage(index);
  }

  function closeImage() {
    setSelectedImage(null);
  }

  function previousImage() {
    if (
      selectedImage === null ||
      albumImages.length === 0
    ) {
      return;
    }

    setSelectedImage(
      selectedImage === 0
        ? albumImages.length - 1
        : selectedImage - 1
    );
  }

  function nextImage() {
    if (
      selectedImage === null ||
      albumImages.length === 0
    ) {
      return;
    }

    setSelectedImage(
      selectedImage ===
        albumImages.length - 1
        ? 0
        : selectedImage + 1
    );
  }

  useEffect(() => {
    if (!selectedAlbum && selectedImage === null) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedAlbum, selectedImage]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (selectedImage !== null) {
          closeImage();
          return;
        }

        if (selectedAlbum) {
          closeAlbum();
          return;
        }
      }

      if (selectedImage !== null) {
        if (event.key === "ArrowLeft") {
          previousImage();
        }

        if (event.key === "ArrowRight") {
          nextImage();
        }
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  });

  return (
    <>


      <main className="overflow-hidden bg-[#F5F0E6] text-[#10203A]">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="bg-[#102A56] text-white">
          <div className="mx-auto max-w-[1500px] px-6 pb-20 pt-44 md:px-10 md:pb-24 lg:px-14">

            <Reveal>

              <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/35">

                <span className="h-px w-9 bg-white/20" />

                Apex Gallery

              </p>

              <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[0.88] tracking-[-0.07em] md:text-7xl lg:text-[7vw]">
                Moments that
                <br />
                become memories.
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-7 text-white/50 md:text-lg">
                Explore celebrations, sporting events,
                performances, achievements and everyday
                moments from the Apex community.
              </p>

            </Reveal>

          </div>
        </section>

        {/* =====================================================
            ALBUMS
        ===================================================== */}

        <section>
          <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-14 lg:py-32">

            {loading ? (

              <div className="flex min-h-[400px] items-center justify-center">

                <div className="flex items-center gap-3 text-sm text-[#102A56]/45">

                  <Loader2
                    size={20}
                    className="animate-spin"
                  />

                  Loading gallery...

                </div>

              </div>

            ) : albums.length === 0 ? (

              <div className="rounded-[2rem] border border-[#102A56]/10 bg-white/[0.45] p-12 text-center">

                <Camera
                  size={30}
                  className="mx-auto text-[#102A56]/25"
                />

                <h2 className="mt-6 text-2xl font-semibold text-[#102A56]">
                  Gallery coming soon
                </h2>

                <p className="mt-3 text-sm text-[#10203A]/45">
                  New photo albums will appear here.
                </p>

              </div>

            ) : (

              <>

                <Reveal>

                  <div className="mb-12 flex flex-col justify-between gap-7 md:flex-row md:items-end">

                    <div>

                      <p className="text-[10px] uppercase tracking-[0.28em] text-[#102A56]/40">
                        Explore albums
                      </p>

                      <h2 className="mt-5 text-4xl font-semibold leading-[0.94] tracking-[-0.055em] text-[#102A56] md:text-6xl">
                        Life at Apex,
                        <br />
                        frame by frame.
                      </h2>

                    </div>

                    <p className="max-w-md text-sm leading-7 text-[#10203A]/45">
                      Browse the school&apos;s visual
                      archive organised by events,
                      celebrations, sports and student
                      activities.
                    </p>

                  </div>

                </Reveal>

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                  {albums.map((album, index) => (

                    <Reveal
                      key={album.id}
                      delay={
                        (index % 6) * 0.05
                      }
                    >

                      <button
                        type="button"
                        onClick={() =>
                          openAlbum(album)
                        }
                        className="group block w-full overflow-hidden rounded-[2rem] border border-[#102A56]/10 bg-white/[0.48] text-left transition duration-500 hover:-translate-y-1 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A56]/20"
                      >

                        <div className="relative aspect-[4/3] overflow-hidden bg-[#E9E2D5]">

                          {album.cover_image_url ? (

                            <Image
                              src={
                                album.cover_image_url
                              }
                              alt={
                                album.title
                              }
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition duration-700 group-hover:scale-105"
                            />

                          ) : (

                            <div className="absolute inset-0 grid place-items-center text-[#102A56]/20">
                              <Camera size={32} />
                            </div>

                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />

                          <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/10 px-3 py-1.5 text-[8px] uppercase tracking-[0.18em] text-white/75 backdrop-blur-sm">
                            {album.category ||
                              "Gallery"}
                          </div>

                        </div>

                        <div className="p-6">

                          <div className="flex items-start justify-between gap-4">

                            <div>

                              <h3 className="text-xl font-semibold tracking-[-0.035em] text-[#102A56]">
                                {album.title}
                              </h3>

                              {album.description && (
                                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#10203A]/45">
                                  {
                                    album.description
                                  }
                                </p>
                              )}

                            </div>

                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#102A56]/10 text-[#102A56]/45 transition duration-300 group-hover:translate-x-1 group-hover:bg-[#102A56] group-hover:text-white">

                              <ArrowRight size={15} />

                            </div>

                          </div>

                        </div>

                      </button>

                    </Reveal>

                  ))}

                </div>

              </>

            )}

          </div>
        </section>

      </main>


      {/* =======================================================
          ALBUM OVERLAY
      ======================================================== */}

      <AnimatePresence>
        {selectedAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-[#071A38]/95 backdrop-blur-xl"
          >

            <div className="h-full overflow-y-auto">

              <div className="mx-auto max-w-[1500px] px-6 py-6 md:px-10 md:py-10 lg:px-14">

                {/* ALBUM HEADER */}
                <div className="flex items-start justify-between gap-6">

                  <div>

                    <button
                      type="button"
                      onClick={closeAlbum}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                    >
                      <ArrowLeft size={15} />
                      Back to albums
                    </button>

                    <p className="mt-10 text-[9px] uppercase tracking-[0.28em] text-white/35">
                      {selectedAlbum.category ||
                        "Gallery"}
                    </p>

                    <h2 className="mt-4 max-w-5xl text-4xl font-semibold leading-[0.92] tracking-[-0.055em] text-white md:text-6xl">
                      {selectedAlbum.title}
                    </h2>

                    {selectedAlbum.description && (
                      <p className="mt-5 max-w-2xl text-sm leading-7 text-white/50 md:text-base">
                        {
                          selectedAlbum.description
                        }
                      </p>
                    )}

                  </div>

                  <button
                    type="button"
                    onClick={closeAlbum}
                    aria-label="Close album"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-white transition hover:bg-white/[0.10]"
                  >
                    <X size={18} />
                  </button>

                </div>

                {/* ALBUM CONTENT */}
                <div className="mt-12">

                  {imagesLoading ? (

                    <div className="flex min-h-[350px] items-center justify-center">

                      <div className="flex items-center gap-3 text-sm text-white/50">

                        <Loader2
                          size={20}
                          className="animate-spin"
                        />

                        Loading album...

                      </div>

                    </div>

                  ) : imagesError ? (

                    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center">

                      <Camera
                        size={28}
                        className="mx-auto text-white/25"
                      />

                      <h3 className="mt-5 text-xl font-semibold text-white">
                        Unable to load photos
                      </h3>

                      <p className="mt-3 text-sm text-white/45">
                        {imagesError}
                      </p>

                    </div>

                  ) : albumImages.length === 0 ? (

                    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center">

                      <Camera
                        size={28}
                        className="mx-auto text-white/25"
                      />

                      <h3 className="mt-5 text-xl font-semibold text-white">
                        No photos yet
                      </h3>

                      <p className="mt-3 text-sm text-white/45">
                        Photos for this album will
                        appear here once they are added
                        from the CMS.
                      </p>

                    </div>

                  ) : (

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                      {albumImages.map(
                        (image, index) => (

                          <motion.button
                            key={image.id}
                            type="button"
                            initial={{
                              opacity: 0,
                              y: 20,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            transition={{
                              duration: 0.5,
                              delay:
                                Math.min(
                                  index * 0.035,
                                  0.5
                                ),
                            }}
                            onClick={() =>
                              openImage(index)
                            }
                            className="group relative overflow-hidden rounded-[1.5rem] bg-[#102A56] text-left focus:outline-none focus:ring-2 focus:ring-white/30"
                          >

                            <div className="relative aspect-[4/3]">

                              <Image
                                src={
                                  image.image_url
                                }
                                alt={
                                  image.title ||
                                  image.caption ||
                                  selectedAlbum.title
                                }
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition duration-700 group-hover:scale-105"
                              />

                              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-80" />

                              {(image.title ||
                                image.caption) && (
                                <div className="absolute bottom-0 left-0 right-0 p-5">

                                  {image.title && (
                                    <p className="text-sm font-semibold text-white">
                                      {image.title}
                                    </p>
                                  )}

                                  {image.caption && (
                                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/60">
                                      {
                                        image.caption
                                      }
                                    </p>
                                  )}

                                </div>
                              )}

                            </div>

                          </motion.button>

                        )
                      )}

                    </div>

                  )}

                </div>

              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* =======================================================
          IMAGE LIGHTBOX
      ======================================================== */}

      <AnimatePresence>
        {selectedImage !== null &&
          albumImages[selectedImage] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-xl"
            >

              <div className="relative flex h-full items-center justify-center p-4 md:p-8">

                {/* CLOSE */}
                <button
                  type="button"
                  onClick={closeImage}
                  aria-label="Close photo"
                  className="absolute right-5 top-5 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white transition hover:bg-white/[0.12] md:right-8 md:top-8"
                >
                  <X size={18} />
                </button>

                {/* PREVIOUS */}
                {albumImages.length > 1 && (
                  <button
                    type="button"
                    onClick={previousImage}
                    aria-label="Previous photo"
                    className="absolute left-4 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white transition hover:bg-white/[0.12] md:left-8"
                  >
                    <ChevronLeft size={22} />
                  </button>
                )}

                {/* PHOTO */}
                <div className="relative h-[75vh] w-full max-w-7xl">

                  <Image
                    src={
                      albumImages[selectedImage]
                        .image_url
                    }
                    alt={
                      albumImages[selectedImage]
                        .title ||
                      albumImages[selectedImage]
                        .caption ||
                      selectedAlbum?.title ||
                      "Gallery photo"
                    }
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority
                  />

                </div>

                {/* NEXT */}
                {albumImages.length > 1 && (
                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next photo"
                    className="absolute right-4 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white transition hover:bg-white/[0.12] md:right-8"
                  >
                    <ChevronRight size={22} />
                  </button>
                )}

                {/* CAPTION */}
                <div className="absolute bottom-5 left-1/2 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 text-center md:bottom-8">

                  {albumImages[selectedImage]
                    .title && (
                    <h3 className="text-base font-semibold text-white">
                      {
                        albumImages[
                          selectedImage
                        ].title
                      }
                    </h3>
                  )}

                  {albumImages[selectedImage]
                    .caption && (
                    <p className="mt-2 text-sm text-white/55">
                      {
                        albumImages[
                          selectedImage
                        ].caption
                      }
                    </p>
                  )}

                  <p className="mt-3 text-[9px] uppercase tracking-[0.2em] text-white/30">
                    {selectedImage + 1} /{" "}
                    {albumImages.length}
                  </p>

                </div>

              </div>
            </motion.div>
          )}
      </AnimatePresence>
    </>
  );
}