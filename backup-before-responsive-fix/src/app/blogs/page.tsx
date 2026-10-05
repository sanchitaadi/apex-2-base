"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ArrowUpRight,
  BookOpen,
  Search,
  X,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type BlogImage = {
  id?: string;
  blog_id?: string;
  image_url?: string | null;
  url?: string | null;
  image_alt?: string | null;
  alt_text?: string | null;
  image_caption?: string | null;
  caption?: string | null;
  sort_order?: number | null;
  created_at?: string | null;
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

  images?: BlogImage[] | null;
  blog_images?: BlogImage[] | null;
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

function getSafeImageUrl(url: string) {
  if (!url) return "";

  /*
   * Keep external Supabase images directly accessible.
   * Only proxy old WordPress images.
   */
  if (url.includes("apexpublicschool.in/wp-content/")) {
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  }

  return url;
}

function getGalleryImages(blog: Blog): BlogImage[] {
  const images = blog.images || blog.blog_images || [];

  return [...images]
    .filter((image) => {
      const url = image.image_url || image.url;
      return Boolean(url);
    })
    .sort((a, b) => {
      const aOrder = a.sort_order ?? 0;
      const bOrder = b.sort_order ?? 0;

      return aOrder - bOrder;
    });
}

function getGalleryImageUrl(image: BlogImage) {
  return image.image_url || image.url || "";
}

function getGalleryAlt(image: BlogImage, index: number) {
  return (
    image.image_alt ||
    image.alt_text ||
    `Article image ${index + 1}`
  );
}

function getGalleryCaption(image: BlogImage) {
  return image.image_caption || image.caption || "";
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
              border border-[#d8e0eb]
              bg-white
              p-2
              shadow-[0_20px_50px_rgba(15,35,70,0.15)]
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
                  flex w-full items-center rounded-xl
                  px-4 py-3 text-left text-sm
                  transition
                  ${
                    value === option
                      ? "bg-[#17386d] text-white"
                      : "text-[#142b52] hover:bg-[#eef3f9]"
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

  const [selectedBlog, setSelectedBlog] =
    useState<Blog | null>(null);

  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] =
    useState("All Years");
  const [selectedMonth, setSelectedMonth] =
    useState("All Months");

  const [galleryIndex, setGalleryIndex] = useState(0);

  /*
   * Load published blogs.
   */
  useEffect(() => {
    async function loadBlogs() {
      try {
        setLoading(true);

        const response = await fetch(
          "/api/blogs?status=published",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load blogs");
        }

        const result = await response.json();

        const loadedBlogs: Blog[] =
          Array.isArray(result?.blogs)
            ? result.blogs
            : [];

        setBlogs(loadedBlogs);
      } catch (error) {
        console.error("Failed to load blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    }

    loadBlogs();
  }, []);

  /*
   * Load gallery images when a blog is opened.
   *
   * This first checks whether the API already returned
   * blog images. If not, it tries the blog detail API.
   */
  useEffect(() => {
    async function loadBlogImages() {
      if (!selectedBlog) return;

      const existingImages = getGalleryImages(selectedBlog);

      if (existingImages.length > 0) {
        setGalleryIndex(0);
        return;
      }

      try {
        const response = await fetch(
          `/api/blogs/${encodeURIComponent(
            selectedBlog.slug
          )}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          setGalleryIndex(0);
          return;
        }

        const result = await response.json();

        const blogFromApi: Blog =
          result?.blog || result;

        const images =
          blogFromApi?.images ||
          blogFromApi?.blog_images ||
          [];

        if (Array.isArray(images) && images.length > 0) {
          setSelectedBlog((current) => {
            if (!current) return current;

            return {
              ...current,
              images,
              blog_images: images,
            };
          });
        }

        setGalleryIndex(0);
      } catch (error) {
        console.error(
          "Failed to load blog gallery:",
          error
        );

        setGalleryIndex(0);
      }
    }

    loadBlogImages();
  }, [selectedBlog?.slug]);

  const years = useMemo(() => {
    const uniqueYears = Array.from(
      new Set(
        blogs
          .map((blog) => getYear(blog))
          .filter(Boolean)
      )
    );

    return ["All Years", ...uniqueYears.sort().reverse()];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return blogs.filter((blog) => {
      const matchesSearch =
        !normalizedSearch ||
        blog.title
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        blog.excerpt
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        blog.content
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        getAuthor(blog)
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesYear =
        selectedYear === "All Years" ||
        getYear(blog) === selectedYear;

      const matchesMonth =
        selectedMonth === "All Months" ||
        getMonth(blog) === selectedMonth;

      return (
        matchesSearch &&
        matchesYear &&
        matchesMonth
      );
    });
  }, [
    blogs,
    search,
    selectedYear,
    selectedMonth,
  ]);

  const selectedGallery = selectedBlog
    ? getGalleryImages(selectedBlog)
    : [];

  const currentGalleryImage =
    selectedGallery[galleryIndex];

  function openBlog(blog: Blog) {
    setSelectedBlog(blog);
    setGalleryIndex(0);
  }

  function closeBlog() {
    setSelectedBlog(null);
    setGalleryIndex(0);
  }

  function nextGalleryImage() {
    if (selectedGallery.length <= 1) return;

    setGalleryIndex((current) =>
      current >= selectedGallery.length - 1
        ? 0
        : current + 1
    );
  }

  function previousGalleryImage() {
    if (selectedGallery.length <= 1) return;

    setGalleryIndex((current) =>
      current <= 0
        ? selectedGallery.length - 1
        : current - 1
    );
  }

  return (
    <>
      {/* =====================================================
          FILTER BAR
      ===================================================== */}

      <section className="border-b border-[#e0e5eb] bg-white">
        <div
          className="
            mx-auto flex max-w-[1450px]
            flex-col gap-4 px-6 py-6
            lg:flex-row lg:items-center
            lg:justify-between
          "
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <Dropdown
              value={selectedYear}
              options={years}
              onChange={setSelectedYear}
            />

            <Dropdown
              value={selectedMonth}
              options={months}
              onChange={setSelectedMonth}
            />
          </div>

          <div className="flex w-full items-center gap-5 lg:w-auto">
            <div
              className="
                flex w-full items-center gap-3
                rounded-full border border-[#cbd5e1]
                bg-white px-5 py-3
                shadow-[0_4px_18px_rgba(15,35,70,0.05)]
                lg:w-[390px]
              "
            >
              <Search
                size={19}
                className="shrink-0 text-[#70819d]"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search stories..."
                className="
                  w-full bg-transparent
                  text-[15px] text-[#142b52]
                  outline-none
                  placeholder:text-[#8190a7]
                "
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-[#70819d] hover:text-[#17386d]"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            <span className="hidden whitespace-nowrap text-sm text-[#71809a] sm:block">
              {filteredBlogs.length}{" "}
              {filteredBlogs.length === 1
                ? "story"
                : "stories"}
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          STORIES
      ===================================================== */}

      <main
        className="
          min-h-[600px]
          bg-[#f7f4ec]
          px-6 py-12
          sm:px-8
          lg:px-10 lg:py-16
        "
      >
        <div className="mx-auto max-w-[1250px]">
          {loading ? (
            <div
              className="
                flex min-h-[400px]
                items-center justify-center
                rounded-[30px]
                border border-[#dce3eb]
                bg-white
              "
            >
              <div className="text-center">
                <div
                  className="
                    mx-auto mb-5 h-10 w-10
                    animate-spin rounded-full
                    border-4 border-[#dce4ef]
                    border-t-[#17386d]
                  "
                />

                <p className="text-[#71809a]">
                  Loading stories...
                </p>
              </div>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div
              className="
                flex min-h-[400px]
                flex-col items-center
                justify-center
                rounded-[30px]
                border border-[#dce3eb]
                bg-white
                px-6 text-center
              "
            >
              <div
                className="
                  mb-7 flex h-16 w-16
                  items-center justify-center
                  rounded-full
                  bg-[#17386d]
                  text-white
                "
              >
                <BookOpen size={29} />
              </div>

              <h2 className="text-3xl font-semibold text-[#17386d]">
                No stories yet
              </h2>

              <p className="mt-5 max-w-[650px] text-base leading-7 text-[#71809a]">
                New school stories, achievements,
                experiences and events will appear here
                once they are published.
              </p>
            </div>
          ) : (
            <div
              className="
                grid gap-7
                md:grid-cols-2
                lg:grid-cols-3
              "
            >
              {filteredBlogs.map((blog) => {
                const image = getImage(blog);

                return (
                  <article
                    key={blog.id}
                    className="
                      group overflow-hidden
                      rounded-[25px]
                      border border-[#dce3eb]
                      bg-white
                      shadow-[0_12px_35px_rgba(15,35,70,0.07)]
                      transition-all duration-300
                      hover:-translate-y-1
                      hover:shadow-[0_20px_50px_rgba(15,35,70,0.13)]
                    "
                  >
                    <button
                      type="button"
                      onClick={() => openBlog(blog)}
                      className="block w-full text-left"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-[#dfe7f0]">
                        {image ? (
                          <img
                            src={getSafeImageUrl(image)}
                            alt={
                              blog.cover_image_alt ||
                              blog.title
                            }
                            className="
                              h-full w-full
                              object-cover
                              transition duration-500
                              group-hover:scale-105
                            "
                          />
                        ) : (
                          <div
                            className="
                              flex h-full w-full
                              items-center justify-center
                              bg-[#e8edf4]
                            "
                          >
                            <BookOpen
                              size={55}
                              className="text-[#17386d]/30"
                            />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-[#07152d]/70 via-transparent to-transparent" />

                        <div className="absolute bottom-4 left-4">
                          <span
                            className="
                              rounded-full
                              bg-white/15
                              px-3 py-1.5
                              text-[10px]
                              font-semibold
                              uppercase
                              tracking-[0.16em]
                              text-white
                              backdrop-blur
                            "
                          >
                            Apex Public School
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#7a89a0]">
                          {getDate(blog) && (
                            <span className="flex items-center gap-1.5">
                              <CalendarDays size={14} />
                              {formatDate(
                                getDate(blog)
                              )}
                            </span>
                          )}

                          {getAuthor(blog) && (
                            <span className="flex items-center gap-1.5">
                              <User size={14} />
                              {getAuthor(blog)}
                            </span>
                          )}
                        </div>

                        <h2
                          className="
                            mt-4
                            line-clamp-2
                            text-xl
                            font-semibold
                            leading-7
                            text-[#17386d]
                          "
                        >
                          {blog.title}
                        </h2>

                        {blog.excerpt && (
                          <p
                            className="
                              mt-3
                              line-clamp-3
                              text-sm
                              leading-6
                              text-[#71809a]
                            "
                          >
                            {blog.excerpt}
                          </p>
                        )}

                        <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#17386d]">
                          Read story
                          <ArrowUpRight
                            size={17}
                            className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                          />
                        </div>
                      </div>
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* =====================================================
          STORY MODAL
      ===================================================== */}

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
              closeBlog();
            }
          }}
        >
          <article
            className="
              relative
              max-h-[94vh]
              w-full
              max-w-[1100px]
              overflow-y-auto
              rounded-[30px]
              bg-[#f7f4ec]
              shadow-[0_30px_100px_rgba(0,0,0,0.35)]
            "
          >
            {/* CLOSE */}

            <button
              type="button"
              onClick={closeBlog}
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
                COVER IMAGE
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

                <div className="absolute inset-0 bg-gradient-to-t from-[#07152d]/85 via-[#07152d]/20 to-transparent" />

                <div className="absolute bottom-7 left-7 right-16 sm:bottom-10 sm:left-10">
                  <span
                    className="
                      inline-flex rounded-full
                      bg-white/15
                      px-3 py-1.5
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-white
                      backdrop-blur
                    "
                  >
                    Apex Public School
                  </span>

                  <h1
                    className="
                      mt-4 max-w-4xl
                      text-3xl font-semibold
                      leading-tight text-white
                      sm:text-5xl
                    "
                  >
                    {selectedBlog.title}
                  </h1>
                </div>
              </div>
            ) : (
              <div
                className="
                  flex aspect-[16/7]
                  items-center justify-center
                  bg-[#dfe7f0]
                "
              >
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

              <div
                className="
                  flex flex-wrap
                  items-center gap-5
                  border-b border-[#d9dee7]
                  pb-6
                  text-sm text-[#71809a]
                "
              >
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
                  <span
                    className="
                      rounded-full
                      bg-[#17386d]/10
                      px-3 py-1
                      text-xs font-semibold
                      text-[#17386d]
                    "
                  >
                    {selectedBlog.category}
                  </span>
                )}
              </div>

              {/* EXCERPT */}

              {selectedBlog.excerpt && (
                <p
                  className="
                    mt-8
                    text-lg
                    font-medium
                    leading-8
                    text-[#294268]
                  "
                >
                  {selectedBlog.excerpt}
                </p>
              )}

              {/* CONTENT */}

              <div
                className="
                  mt-8
                  whitespace-pre-line
                  text-[16px]
                  leading-8
                  text-[#344866]
                "
              >
                {selectedBlog.content ||
                  "No article content has been added yet."}
              </div>

              {/* =================================================
                  ARTICLE GALLERY
              ================================================= */}

              {selectedGallery.length > 0 && (
                <section className="mt-12">
                  <div
                    className="
                      mb-5 flex
                      items-end justify-between
                      gap-4
                    "
                  >
                    <div>
                      <p
                        className="
                          text-xs
                          font-semibold
                          uppercase
                          tracking-[0.18em]
                          text-[#71809a]
                        "
                      >
                        Gallery
                      </p>

                      <h2
                        className="
                          mt-1
                          text-2xl
                          font-semibold
                          text-[#17386d]
                        "
                      >
                        Article Photos
                      </h2>
                    </div>

                    {selectedGallery.length > 1 && (
                      <div className="text-sm text-[#71809a]">
                        {galleryIndex + 1}/
                        {selectedGallery.length}
                      </div>
                    )}
                  </div>

                  {/* MAIN GALLERY IMAGE */}

                  <div
                    className="
                      relative
                      overflow-hidden
                      rounded-[24px]
                      bg-[#dfe7f0]
                    "
                  >
                    {currentGalleryImage && (
                      <img
                        src={getSafeImageUrl(
                          getGalleryImageUrl(
                            currentGalleryImage
                          )
                        )}
                        alt={getGalleryAlt(
                          currentGalleryImage,
                          galleryIndex
                        )}
                        className="
                          block
                          max-h-[620px]
                          min-h-[250px]
                          w-full
                          object-contain
                          bg-[#e9edf2]
                        "
                      />
                    )}

                    {selectedGallery.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={
                            previousGalleryImage
                          }
                          aria-label="Previous image"
                          className="
                            absolute left-4 top-1/2
                            flex h-11 w-11
                            -translate-y-1/2
                            items-center justify-center
                            rounded-full
                            bg-[#102a56]/85
                            text-white
                            shadow-lg
                            transition
                            hover:scale-105
                          "
                        >
                          <ChevronLeft size={21} />
                        </button>

                        <button
                          type="button"
                          onClick={
                            nextGalleryImage
                          }
                          aria-label="Next image"
                          className="
                            absolute right-4 top-1/2
                            flex h-11 w-11
                            -translate-y-1/2
                            items-center justify-center
                            rounded-full
                            bg-[#102a56]/85
                            text-white
                            shadow-lg
                            transition
                            hover:scale-105
                          "
                        >
                          <ChevronRight size={21} />
                        </button>
                      </>
                    )}
                  </div>

                  {/* CAPTION */}

                  {currentGalleryImage &&
                    getGalleryCaption(
                      currentGalleryImage
                    ) && (
                      <p className="mt-3 text-center text-sm text-[#71809a]">
                        {getGalleryCaption(
                          currentGalleryImage
                        )}
                      </p>
                    )}

                  {/* THUMBNAILS */}

                  {selectedGallery.length > 1 && (
                    <div
                      className="
                        mt-5 grid
                        grid-cols-3
                        gap-3
                        sm:grid-cols-4
                        md:grid-cols-5
                      "
                    >
                      {selectedGallery.map(
                        (image, index) => (
                          <button
                            key={
                              image.id ||
                              `${getGalleryImageUrl(
                                image
                              )}-${index}`
                            }
                            type="button"
                            onClick={() =>
                              setGalleryIndex(index)
                            }
                            className={`
                              relative
                              aspect-[4/3]
                              overflow-hidden
                              rounded-xl
                              border-2
                              transition
                              ${
                                index ===
                                galleryIndex
                                  ? "border-[#17386d] ring-2 ring-[#17386d]/20"
                                  : "border-transparent opacity-75 hover:opacity-100"
                              }
                            `}
                          >
                            <img
                              src={getSafeImageUrl(
                                getGalleryImageUrl(
                                  image
                                )
                              )}
                              alt={getGalleryAlt(
                                image,
                                index
                              )}
                              className="
                                h-full
                                w-full
                                object-cover
                              "
                            />
                          </button>
                        )
                      )}
                    </div>
                  )}
                </section>
              )}

              {/* =================================================
                  BACK BUTTON
              ================================================= */}

              <div
                className="
                  mt-12
                  border-t
                  border-[#d9dee7]
                  pt-7
                "
              >
                <button
                  type="button"
                  onClick={closeBlog}
                  className="
                    rounded-full
                    bg-[#17386d]
                    px-6 py-3
                    text-sm
                    font-semibold
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