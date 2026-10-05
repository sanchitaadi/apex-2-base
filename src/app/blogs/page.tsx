"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  CalendarDays,
  ChevronDown,
  ArrowUpRight,
  BookOpen,
  Search,
  X,
  User,
  Images,
} from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/* =========================================================
   TYPES
========================================================= */

type BlogImage = {
  id?: string;
  blog_id?: string;
  image_url: string;
  image_alt?: string | null;
  caption?: string | null;
  sort_order?: number | null;
};

type Blog = {
  id: string;
  title: string;
  slug: string;

  excerpt?: string | null;
  content?: string | null;

  cover_image_url?: string | null;
  cover_image_alt?: string | null;

  image_url?: string | null;
  cover_image?: string | null;
  featured_image?: string | null;

  status?: string | null;

  publish_date?: string | null;
  published_at?: string | null;
  created_at?: string | null;

  author_name?: string | null;
  author?: string | null;

  category?: string | null;

  images?: BlogImage[];
};

/* =========================================================
   MONTHS
========================================================= */

const months = [
  "All Months",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/* =========================================================
   HELPERS
========================================================= */

function getImage(blog: Blog) {
  return (
    blog.cover_image_url ||
    blog.image_url ||
    blog.cover_image ||
    blog.featured_image ||
    ""
  );
}

function getDate(blog: Blog) {
  return (
    blog.publish_date ||
    blog.published_at ||
    blog.created_at ||
    ""
  );
}

function getAuthor(blog: Blog) {
  return blog.author_name || blog.author || "";
}

function getYear(blog: Blog) {
  const date = getDate(blog);

  if (!date) return "";

  const year = new Date(date).getFullYear();

  return Number.isNaN(year) ? "" : String(year);
}

function getMonth(blog: Blog) {
  const date = getDate(blog);

  if (!date) return "";

  const month = new Date(date).getMonth();

  if (Number.isNaN(month)) return "";

  return months[month + 1];
}

function formatDate(dateString: string) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* =========================================================
   IMAGE URL HANDLER
========================================================= */

function getSafeImageUrl(url: string) {
  if (!url) return "";

  /*
   * Old WordPress images
   */
  if (url.includes("apexpublicschool.in/wp-content/")) {
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  }

  return url;
}

/* =========================================================
   DROPDOWN
========================================================= */

function Dropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full sm:w-[190px]">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="
          flex w-full items-center justify-between
          rounded-full border border-[#cbd5e1]
          bg-white px-5 py-3
          text-left text-[15px] font-medium text-[#142b52]
          shadow-[0_4px_18px_rgba(15,35,70,0.06)]
          transition-all duration-200
          hover:border-[#17386d]
        "
      >
        <span>{value}</span>

        <ChevronDown
          size={18}
          className={`transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close dropdown"
            className="fixed inset-0 z-[90] cursor-default"
            onClick={() => setOpen(false)}
          />

          <div
            className="
              absolute left-0 top-[calc(100%+8px)]
              z-[100]
              max-h-[280px]
              w-full
              overflow-y-auto
              rounded-2xl
              border border-[#d9e0ea]
              bg-white
              p-2
              shadow-[0_18px_50px_rgba(15,35,70,0.16)]
            "
          >
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`
                  block w-full rounded-xl
                  px-4 py-3
                  text-left text-[15px]
                  ${
                    value === option
                      ? "bg-[#17386d] font-semibold text-white"
                      : "text-[#142b52] hover:bg-[#eef3fa]"
                  }
                `}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* =========================================================
   BLOG PAGE
========================================================= */

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [year, setYear] = useState("All Years");
  const [month, setMonth] = useState("All Months");
  const [search, setSearch] = useState("");

  const [selectedBlog, setSelectedBlog] =
    useState<Blog | null>(null);

  const [selectedImages, setSelectedImages] =
    useState<BlogImage[]>([]);

  const [loadingImages, setLoadingImages] =
    useState(false);

  /* =========================================================
     LOAD BLOGS
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadBlogs() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/cms/blogs?status=published",
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Unable to load blogs."
          );
        }

        if (mounted) {
          setBlogs(result.blogs || []);
        }
      } catch (err) {
        console.error("Blogs loading error:", err);

        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load school stories."
          );

          setBlogs([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadBlogs();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
     LOAD GALLERY IMAGES
  ========================================================= */

  async function loadBlogImages(blog: Blog) {
    setSelectedImages([]);

    if (!supabase || !blog.id) {
      console.warn(
        "Supabase client is not configured."
      );
      return;
    }

    try {
      setLoadingImages(true);

      const { data, error: imageError } =
        await supabase
          .from("blog_images")
          .select(
            "id, blog_id, image_url, image_alt, caption, sort_order"
          )
          .eq("blog_id", blog.id)
          .order("sort_order", {
            ascending: true,
          });

      if (imageError) {
        console.error(
          "Blog gallery loading error:",
          imageError
        );

        setSelectedImages([]);
        return;
      }

      setSelectedImages(data || []);
    } catch (err) {
      console.error(
        "Gallery loading error:",
        err
      );

      setSelectedImages([]);
    } finally {
      setLoadingImages(false);
    }
  }

  /* =========================================================
     OPEN BLOG
  ========================================================= */

  async function openBlog(blog: Blog) {
    setSelectedBlog(blog);

    await loadBlogImages(blog);
  }

  /* =========================================================
     CLOSE WITH ESC
  ========================================================= */

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedBlog(null);
        setSelectedImages([]);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  /* =========================================================
     LOCK BODY SCROLL WHEN MODAL OPEN
  ========================================================= */

  useEffect(() => {
    if (selectedBlog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedBlog]);

  /* =========================================================
     YEARS
  ========================================================= */

  const years = useMemo(() => {
    const uniqueYears = Array.from(
      new Set(
        blogs
          .map((blog) => getYear(blog))
          .filter(Boolean)
      )
    );

    return [
      "All Years",
      ...uniqueYears.sort(
        (a, b) => Number(b) - Number(a)
      ),
    ];
  }, [blogs]);

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return blogs.filter((blog) => {
      const matchesYear =
        year === "All Years" ||
        getYear(blog) === year;

      const matchesMonth =
        month === "All Months" ||
        getMonth(blog) === month;

      const matchesSearch =
        !query ||
        blog.title
          ?.toLowerCase()
          .includes(query) ||
        blog.excerpt
          ?.toLowerCase()
          .includes(query) ||
        blog.content
          ?.toLowerCase()
          .includes(query);

      return (
        matchesYear &&
        matchesMonth &&
        matchesSearch
      );
    });
  }, [blogs, year, month, search]);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      <main className="min-h-screen bg-[#f7f4ec] text-[#142b52]">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="relative overflow-hidden border-b border-[#d9dee7] pt-[145px] sm:pt-[155px]">

          <div className="absolute inset-0 bg-gradient-to-br from-[#dbe8f8] via-[#f7f4ec] to-[#f7f4ec]" />

          <div className="absolute -left-32 bottom-[-180px] h-[420px] w-[420px] rounded-full bg-[#17386d]/25 blur-[90px]" />

          <div className="absolute right-[-150px] top-[-150px] h-[400px] w-[400px] rounded-full bg-[#dce8f6]/70 blur-[80px]" />

          <div className="relative mx-auto max-w-[1490px] px-6 pb-20 sm:px-10 lg:px-16 lg:pb-24">

            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-12 bg-[#17386d]" />

              <span className="text-[11px] font-bold tracking-[0.3em] text-[#17386d]">
                APEX PUBLIC SCHOOL
              </span>
            </div>

            <div className="max-w-[850px]">

              <h1 className="text-[62px] font-semibold leading-[0.92] tracking-[-0.055em] text-[#102b55] sm:text-[82px] lg:text-[100px]">
                Blogs
                <br />

                <span className="text-[#17386d]">
                  &amp; Stories
                </span>
              </h1>

              <p className="mt-9 max-w-[760px] text-[18px] leading-8 text-[#294268] sm:text-[21px]">
                Discover stories, achievements,
                experiences, events and insights from
                the Apex Public School community.
              </p>

            </div>
          </div>
        </section>

        {/* =====================================================
            FILTER BAR
        ===================================================== */}

        <section className="relative z-[20] border-b border-[#d9dee7] bg-white">

          <div className="mx-auto flex max-w-[1490px] flex-col gap-5 px-6 py-5 sm:px-10 lg:flex-row lg:items-center lg:px-16">

            <div className="flex flex-col gap-3 sm:flex-row">

              <Dropdown
                value={year}
                options={years}
                onChange={setYear}
              />

              <Dropdown
                value={month}
                options={months}
                onChange={setMonth}
              />

            </div>

            <div className="relative w-full lg:ml-auto lg:max-w-[360px]">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71809a]"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search stories..."
                className="
                  w-full rounded-full
                  border border-[#cbd5e1]
                  bg-white
                  py-3 pl-11 pr-5
                  text-[15px]
                  text-[#142b52]
                  outline-none
                  focus:border-[#17386d]
                  focus:ring-2
                  focus:ring-[#17386d]/10
                "
              />

            </div>

            <div className="whitespace-nowrap text-sm font-medium text-[#5d6c83]">

              {filteredBlogs.length}{" "}

              {filteredBlogs.length === 1
                ? "story"
                : "stories"}

            </div>

          </div>
        </section>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <section className="mx-auto max-w-[1490px] px-6 py-12 sm:px-10 lg:px-16 lg:py-16">

          {error && (
            <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-red-700">

              <p className="font-semibold">
                Blogs could not be loaded.
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>

            </div>
          )}

          {/* =====================================================
              LOADING
          ===================================================== */}

          {loading ? (

            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-[420px] animate-pulse rounded-[28px] bg-white shadow-sm"
                />
              ))}

            </div>

          ) : filteredBlogs.length > 0 ? (

            /* ===================================================
               BLOG GRID
            =================================================== */

            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">

              {filteredBlogs.map((blog) => {

                const image = getImage(blog);
                const date = getDate(blog);

                return (
                  <article
                    key={blog.id}
                    className="
                      group overflow-hidden
                      rounded-[28px]
                      border border-[#dce2ea]
                      bg-white
                      shadow-[0_10px_35px_rgba(16,43,85,0.06)]
                      transition-all duration-300
                      hover:-translate-y-1
                      hover:shadow-[0_18px_45px_rgba(16,43,85,0.12)]
                    "
                  >

                    {/* IMAGE */}

                    {image ? (

                      <div className="relative aspect-[16/9] overflow-hidden bg-[#e9eef5]">

                        <img
                          src={getSafeImageUrl(image)}
                          alt={
                            blog.cover_image_alt ||
                            blog.title
                          }
                          className="
                            h-full w-full
                            object-cover
                            transition-transform
                            duration-500
                            group-hover:scale-[1.04]
                          "
                          onError={(event) => {
                            const target =
                              event.currentTarget;

                            target.style.display =
                              "none";
                          }}
                        />

                      </div>

                    ) : (

                      <div className="flex aspect-[16/9] items-center justify-center bg-[#edf2f8]">

                        <BookOpen
                          size={48}
                          className="text-[#17386d]/40"
                        />

                      </div>

                    )}

                    {/* CONTENT */}

                    <div className="p-7">

                      {date && (
                        <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#71809a]">

                          <CalendarDays size={14} />

                          {formatDate(date)}

                        </div>
                      )}

                      <h2 className="text-[24px] font-semibold leading-tight tracking-[-0.02em] text-[#102b55]">
                        {blog.title}
                      </h2>

                      {blog.excerpt && (
                        <p className="mt-4 line-clamp-3 text-[15px] leading-7 text-[#687991]">
                          {blog.excerpt}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          openBlog(blog)
                        }
                        className="
                          mt-7 inline-flex
                          items-center gap-2
                          text-sm font-bold
                          text-[#17386d]
                          transition-all
                          hover:gap-3
                        "
                      >
                        Read Story
                        <ArrowUpRight size={17} />
                      </button>

                    </div>
                  </article>
                );
              })}

            </div>

          ) : (

            /* ===================================================
               EMPTY
            =================================================== */

            <div className="mx-auto max-w-[900px] rounded-[32px] border border-[#d8e0ea] bg-white px-7 py-20 text-center shadow-[0_12px_40px_rgba(16,43,85,0.06)] sm:px-12">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#17386d] text-white">

                <BookOpen size={28} />

              </div>

              <h2 className="mt-7 text-[32px] font-semibold tracking-[-0.03em] text-[#102b55]">
                No stories yet
              </h2>

              <p className="mx-auto mt-4 max-w-[600px] text-[16px] leading-7 text-[#71809a]">
                New school stories, achievements,
                experiences and events will appear
                here once they are published.
              </p>

            </div>

          )}

        </section>
      </main>

      {/* =========================================================
          STORY MODAL
      ========================================================= */}

      {selectedBlog && (

        <div
          className="
            fixed inset-0 z-[500]
            flex items-center justify-center
            bg-[#07152d]/85
            p-3
            backdrop-blur-md
            sm:p-6
          "
          onMouseDown={(event) => {

            if (
              event.target === event.currentTarget
            ) {
              setSelectedBlog(null);
              setSelectedImages([]);
            }

          }}
        >

          <article
            className="
              relative
              max-h-[94vh]
              w-full
              max-w-[1050px]
              overflow-y-auto
              rounded-[30px]
              bg-[#f7f4ec]
              shadow-[0_30px_100px_rgba(0,0,0,0.35)]
            "
          >

            {/* =================================================
                CLOSE
            ================================================= */}

            <button
              type="button"
              onClick={() => {
                setSelectedBlog(null);
                setSelectedImages([]);
              }}
              aria-label="Close story"
              className="
                absolute right-4 top-4 z-30
                flex h-11 w-11
                items-center justify-center
                rounded-full
                bg-[#102a56]
                text-white
                shadow-lg
                transition
                hover:scale-105
              "
            >
              <X size={20} />
            </button>

            {/* =================================================
                COVER
            ================================================= */}

            {getImage(selectedBlog) ? (

              <div className="relative aspect-[16/7] w-full overflow-hidden bg-[#dfe7f0]">

                <img
                  src={getSafeImageUrl(
                    getImage(selectedBlog)
                  )}
                  alt={
                    selectedBlog.cover_image_alt ||
                    selectedBlog.title
                  }
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#07152d]/80 via-[#07152d]/10 to-transparent" />

                <div className="absolute bottom-7 left-7 right-16 sm:bottom-10 sm:left-10">

                  <span className="inline-flex rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                    Apex Public School
                  </span>

                  <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight text-white sm:text-5xl">
                    {selectedBlog.title}
                  </h1>

                </div>

              </div>

            ) : (

              <div className="flex aspect-[16/7] items-center justify-center bg-[#dfe7f0]">

                <BookOpen
                  size={70}
                  className="text-[#17386d]/30"
                />

              </div>

            )}

            {/* =================================================
                ARTICLE
            ================================================= */}

            <div className="px-6 py-8 sm:px-10 sm:py-12">

              {/* META */}

              <div className="flex flex-wrap items-center gap-5 border-b border-[#d9dee7] pb-6 text-sm text-[#71809a]">

                {getDate(selectedBlog) && (
                  <span className="flex items-center gap-2">

                    <CalendarDays size={16} />

                    {formatDate(
                      getDate(selectedBlog)
                    )}

                  </span>
                )}

                {getAuthor(selectedBlog) && (
                  <span className="flex items-center gap-2">

                    <User size={16} />

                    {getAuthor(selectedBlog)}

                  </span>
                )}

                {selectedBlog.category && (
                  <span className="rounded-full bg-[#17386d]/10 px-3 py-1 text-xs font-semibold text-[#17386d]">

                    {selectedBlog.category}

                  </span>
                )}

              </div>

              {/* EXCERPT */}

              {selectedBlog.excerpt && (
                <p className="mt-8 text-lg font-medium leading-8 text-[#294268]">

                  {selectedBlog.excerpt}

                </p>
              )}

              {/* =================================================
                  ARTICLE CONTENT
              ================================================= */}

              <div className="mt-8 whitespace-pre-line text-[16px] leading-8 text-[#344866]">

                {selectedBlog.content ||
                  "No article content has been added yet."}

              </div>

              {/* =================================================
                  GALLERY
              ================================================= */}

              <div className="mt-12 border-t border-[#d9dee7] pt-10">

                <div className="mb-7 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#17386d] text-white">

                    <Images size={19} />

                  </div>

                  <div>

                    <h2 className="text-xl font-semibold text-[#102b55]">
                      Article Gallery
                    </h2>

                    {selectedImages.length > 0 && (
                      <p className="mt-1 text-sm text-[#71809a]">
                        {selectedImages.length}{" "}
                        {selectedImages.length === 1
                          ? "image"
                          : "images"}
                      </p>
                    )}

                  </div>

                </div>

                {/* LOADING */}

                {loadingImages ? (

                  <div className="grid gap-5 sm:grid-cols-2">

                    {[1, 2].map((item) => (
                      <div
                        key={item}
                        className="
                          aspect-[4/3]
                          animate-pulse
                          rounded-2xl
                          bg-[#e3e9f1]
                        "
                      />
                    ))}

                  </div>

                ) : selectedImages.length > 0 ? (

                  /* =================================================
                     GALLERY GRID
                  ================================================= */

                  <div className="grid gap-5 sm:grid-cols-2">

                    {selectedImages.map(
                      (image, index) => (

                        <figure
                          key={
                            image.id ||
                            `${image.image_url}-${index}`
                          }
                          className="
                            group
                            overflow-hidden
                            rounded-2xl
                            border
                            border-[#d9dee7]
                            bg-white
                            shadow-[0_8px_25px_rgba(16,43,85,0.06)]
                          "
                        >

                          <div className="relative overflow-hidden bg-[#e8edf4]">

                            <img
                              src={getSafeImageUrl(
                                image.image_url
                              )}
                              alt={
                                image.image_alt ||
                                selectedBlog.title
                              }
                              className="
                                h-auto
                                max-h-[600px]
                                w-full
                                object-cover
                                transition-transform
                                duration-500
                                group-hover:scale-[1.025]
                              "
                              onError={(event) => {
                                const target =
                                  event.currentTarget;

                                target.style.display =
                                  "none";
                              }}
                            />

                            <div className="
                              pointer-events-none
                              absolute inset-0
                              bg-gradient-to-t
                              from-black/10
                              via-transparent
                              to-transparent
                              opacity-0
                              transition
                              group-hover:opacity-100
                            " />

                          </div>

                          {(image.caption ||
                            image.image_alt) && (

                            <figcaption className="px-4 py-3">

                              {image.caption && (
                                <p className="text-sm leading-6 text-[#52637d]">
                                  {image.caption}
                                </p>
                              )}

                            </figcaption>

                          )}

                        </figure>

                      )
                    )}

                  </div>

                ) : (

                  /* =================================================
                     NO GALLERY
                  ================================================= */

                  <div className="
                    rounded-2xl
                    border
                    border-dashed
                    border-[#cbd5e1]
                    bg-white/60
                    px-6
                    py-10
                    text-center
                  ">

                    <Images
                      size={32}
                      className="mx-auto text-[#17386d]/30"
                    />

                    <p className="mt-3 text-sm text-[#71809a]">
                      No additional gallery images
                      have been added to this story.
                    </p>

                  </div>

                )}

              </div>

              {/* =================================================
                  BACK BUTTON
              ================================================= */}

              <div className="mt-12 border-t border-[#d9dee7] pt-7">

                <button
                  type="button"
                  onClick={() => {
                    setSelectedBlog(null);
                    setSelectedImages([]);
                  }}
                  className="
                    rounded-full
                    bg-[#17386d]
                    px-6 py-3
                    text-sm font-semibold
                    text-white
                    transition
                    hover:bg-[#102b55]
                  "
                >
                  Back to Stories
                </button>

              </div>

            </div>

          </article>
        </div>
      )}
    </>
  );
}