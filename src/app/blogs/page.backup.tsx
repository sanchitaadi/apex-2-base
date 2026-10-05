"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ArrowUpRight,
  BookOpen,
  Search,
  X,
} from "lucide-react";

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  cover_image?: string | null;
  gallery_images?: string[] | null;
  status?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  author?: string | null;
};

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

function getImage(blog: Blog) {
  return blog.cover_image || "";
}

function getDate(blog: Blog) {
  return blog.published_at || blog.created_at || "";
}

function getYear(blog: Blog) {
  const date = getDate(blog);

  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "";

  return String(parsed.getFullYear());
}

function getMonth(blog: Blog) {
  const date = getDate(blog);

  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "";

  return months[parsed.getMonth() + 1];
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
          focus:outline-none
        "
      >
        <span>{value}</span>

        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${
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
                  transition-colors
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

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [year, setYear] = useState("All Years");
  const [month, setMonth] = useState("All Months");
  const [search, setSearch] = useState("");

  // Selected blog for the same-page popup
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadBlogs() {
      try {
        setLoading(true);
        setError("");

        /*
         * IMPORTANT:
         * Admin stores blogs inside cms_blogs.
         *
         * Therefore the public page must use:
         * /api/cms/blogs?status=published
         */

        const response = await fetch(
          "/api/cms/blogs?status=published",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Blogs API returned ${response.status}`
          );
        }

        const result = await response.json();

        const loadedBlogs = Array.isArray(result.blogs)
          ? result.blogs
          : [];

        if (mounted) {
          setBlogs(loadedBlogs);
        }
      } catch (err) {
        console.error("Blogs loading error:", err);

        if (mounted) {
          setBlogs([]);
          setError(
            "Unable to load published school stories."
          );
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

  /*
   * Close blog popup with Escape key.
   */
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedBlog(null);
      }
    }

    if (selectedBlog) {
      document.addEventListener(
        "keydown",
        handleEscape
      );
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
      document.body.style.overflow = "";
    };
  }, [selectedBlog]);

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
        blog.title?.toLowerCase().includes(query) ||
        blog.excerpt?.toLowerCase().includes(query) ||
        blog.content?.toLowerCase().includes(query);

      return (
        matchesYear &&
        matchesMonth &&
        matchesSearch
      );
    });
  }, [blogs, year, month, search]);

  return (
    <>
      <main className="min-h-screen bg-[#f7f4ec] text-[#142b52]">
        {/* HERO */}
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
                experiences, events and insights from the
                Apex Public School community.
              </p>
            </div>
          </div>
        </section>

        {/* FILTER BAR */}
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
                  transition
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

        {/* CONTENT */}
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
                          src={image}
                          alt={blog.title}
                          className="
                            h-full w-full
                            object-cover
                            transition-transform
                            duration-500
                            group-hover:scale-[1.04]
                          "
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

                      {/* SAME PAGE */}
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedBlog(blog)
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
            <div className="mx-auto max-w-[900px] rounded-[32px] border border-[#d8e0ea] bg-white px-7 py-20 text-center shadow-[0_12px_40px_rgba(16,43,85,0.06)] sm:px-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#17386d] text-white">
                <BookOpen size={28} />
              </div>

              <h2 className="mt-7 text-[32px] font-semibold tracking-[-0.03em] text-[#102b55]">
                No stories yet
              </h2>

              <p className="mx-auto mt-4 max-w-[600px] text-[16px] leading-7 text-[#71809a]">
                New school stories, achievements,
                experiences and events will appear here
                once they are published.
              </p>

              {(year !== "All Years" ||
                month !== "All Months" ||
                search) && (
                <button
                  type="button"
                  onClick={() => {
                    setYear("All Years");
                    setMonth("All Months");
                    setSearch("");
                  }}
                  className="
                    mt-7 rounded-full
                    bg-[#17386d]
                    px-7 py-3
                    text-sm font-semibold
                    text-white
                    transition
                    hover:bg-[#102b55]
                  "
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </section>
      </main>

      {/* SAME-PAGE BLOG MODAL */}
      {selectedBlog && (
        <div
          className="
            fixed inset-0 z-[9999]
            flex items-center justify-center
            bg-[#081a35]/75
            p-4
            backdrop-blur-md
            sm:p-8
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedBlog(null);
            }
          }}
        >
          <div
            className="
              relative
              flex max-h-[92vh]
              w-full max-w-[1050px]
              flex-col
              overflow-hidden
              rounded-[28px]
              bg-white
              shadow-[0_30px_100px_rgba(0,0,0,0.3)]
            "
          >
            {/* CLOSE */}
            <button
              type="button"
              onClick={() => setSelectedBlog(null)}
              aria-label="Close story"
              className="
                absolute right-5 top-5 z-[20]
                flex h-11 w-11
                items-center justify-center
                rounded-full
                bg-white/95
                text-[#102b55]
                shadow-lg
                transition
                hover:bg-[#17386d]
                hover:text-white
              "
            >
              <X size={21} />
            </button>

            {/* BLOG IMAGE */}
            {getImage(selectedBlog) && (
              <div className="relative h-[220px] w-full shrink-0 overflow-hidden sm:h-[340px]">
                <img
                  src={getImage(selectedBlog)}
                  alt={selectedBlog.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#071a36]/65 via-transparent to-transparent" />
              </div>
            )}

            {/* BLOG CONTENT */}
            <div className="overflow-y-auto px-6 py-8 sm:px-10 sm:py-10 lg:px-14">
              {getDate(selectedBlog) && (
                <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#71809a]">
                  <CalendarDays size={14} />
                  {formatDate(getDate(selectedBlog))}
                </div>
              )}

              <h2 className="max-w-[850px] text-[34px] font-semibold leading-tight tracking-[-0.035em] text-[#102b55] sm:text-[46px]">
                {selectedBlog.title}
              </h2>

              {selectedBlog.excerpt && (
                <p className="mt-5 text-[17px] font-medium leading-8 text-[#536884]">
                  {selectedBlog.excerpt}
                </p>
              )}

              {selectedBlog.content && (
                <div
                  className="
                    prose prose-lg mt-8 max-w-none
                    prose-headings:text-[#102b55]
                    prose-p:text-[#52657f]
                    prose-p:leading-8
                    prose-a:text-[#17386d]
                    prose-strong:text-[#102b55]
                  "
                >
                  {selectedBlog.content
                    .split(/\n{2,}/)
                    .map((paragraph, index) => (
                      <p key={index}>
                        {paragraph}
                      </p>
                    ))}
                </div>
              )}

              {/* GALLERY */}
              {selectedBlog.gallery_images &&
                selectedBlog.gallery_images.length > 0 && (
                  <div className="mt-10 grid gap-4 sm:grid-cols-2">
                    {selectedBlog.gallery_images.map(
                      (image, index) => (
                        <img
                          key={`${image}-${index}`}
                          src={image}
                          alt={`${selectedBlog.title} ${index + 1}`}
                          className="
                            h-[240px]
                            w-full
                            rounded-2xl
                            object-cover
                          "
                        />
                      )
                    )}
                  </div>
                )}

              <div className="mt-10 border-t border-[#e1e6ed] pt-6">
                <button
                  type="button"
                  onClick={() => setSelectedBlog(null)}
                  className="
                    rounded-full
                    bg-[#17386d]
                    px-7 py-3
                    text-sm font-semibold
                    text-white
                    transition
                    hover:bg-[#102b55]
                  "
                >
                  Close Story
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
