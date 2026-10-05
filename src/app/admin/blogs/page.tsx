"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  CalendarDays,
  Check,
  Edit3,
  FileText,
  Image as ImageIcon,
  Loader2,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

/* =========================================================
   TYPES
========================================================= */

type BlogImage = {
  id?: string;
  blog_id?: string;
  image_url: string | null;
  image_alt: string | null;
  caption: string | null;
  sort_order: number;
};

type BlogPost = {
  id: string;
  title: string;
  slug: string;

  excerpt: string | null;
  content: string | null;

  author_name: string | null;
  category: string | null;

  status: "draft" | "published";

  publish_date: string | null;

  cover_image_url: string | null;
  cover_image_alt: string | null;

  is_featured: boolean;
  is_active: boolean;

  sort_order: number;

  seo_title: string | null;
  seo_description: string | null;

  created_at: string;
  updated_at: string;
};

type BlogForm = {
  id: string;

  title: string;
  slug: string;

  excerpt: string;
  content: string;

  author_name: string;
  category: string;

  status: "draft" | "published";

  publish_date: string;

  cover_image_url: string;
  cover_image_alt: string;

  is_featured: boolean;
  is_active: boolean;

  sort_order: number;

  seo_title: string;
  seo_description: string;
};

/* =========================================================
   EMPTY FORM
========================================================= */

const EMPTY_FORM: BlogForm = {
  id: "",

  title: "",
  slug: "",

  excerpt: "",
  content: "",

  author_name: "",
  category: "",

  status: "draft",

  publish_date: new Date().toISOString().slice(0, 10),

  cover_image_url: "",
  cover_image_alt: "",

  is_featured: false,
  is_active: true,

  sort_order: 0,

  seo_title: "",
  seo_description: "",
};

/* =========================================================
   HELPERS
========================================================= */

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function safeString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function safeDate(value: string | null) {
  if (!value) return "No date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "No date";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* =========================================================
   COMPONENT
========================================================= */

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [images, setImages] = useState<BlogImage[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [showEditor, setShowEditor] = useState(false);

  const [search, setSearch] = useState("");

  const [filterStatus, setFilterStatus] = useState<
    "all" | "draft" | "published"
  >("all");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState<BlogForm>({
    ...EMPTY_FORM,
  });

  const coverInputRef =
    useRef<HTMLInputElement | null>(null);

  const galleryInputRef =
    useRef<HTMLInputElement | null>(null);

  /* =========================================================
     LOAD BLOGS
  ========================================================= */

  useEffect(() => {
    void loadBlogs();
  }, []);

  async function loadBlogs() {
    setLoading(true);
    setError("");

    const { data, error: loadError } =
      await supabase
        .from("blog_posts")
        .select("*")
        .order("sort_order", {
          ascending: true,
        })
        .order("publish_date", {
          ascending: false,
        });

    if (loadError) {
      console.error(loadError);
      setError(loadError.message);
      setBlogs([]);
    } else {
      setBlogs((data || []) as BlogPost[]);
    }

    setLoading(false);
  }

  /* =========================================================
     FORM HELPERS
  ========================================================= */

  function updateField<K extends keyof BlogForm>(
    field: K,
    value: BlogForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleTitleChange(value: string) {
    setForm((current) => {
      const oldAutoSlug = slugify(current.title);

      return {
        ...current,
        title: value,
        slug:
          !current.slug ||
          current.slug === oldAutoSlug
            ? slugify(value)
            : current.slug,
      };
    });
  }

  /* =========================================================
     NEW BLOG
  ========================================================= */

  function startNew() {
    setForm({
      ...EMPTY_FORM,
      publish_date: new Date()
        .toISOString()
        .slice(0, 10),
    });

    setImages([]);

    setMessage("");
    setError("");

    setShowEditor(true);
  }

  /* =========================================================
     EDIT BLOG
  ========================================================= */

  async function editBlog(blog: BlogPost) {
    setError("");
    setMessage("");

    setForm({
      id: blog.id,

      title: safeString(blog.title),
      slug: safeString(blog.slug),

      excerpt: safeString(blog.excerpt),
      content: safeString(blog.content),

      author_name: safeString(blog.author_name),
      category: safeString(blog.category),

      status:
        blog.status === "published"
          ? "published"
          : "draft",

      publish_date:
        safeString(blog.publish_date) ||
        new Date().toISOString().slice(0, 10),

      cover_image_url:
        safeString(blog.cover_image_url),

      cover_image_alt:
        safeString(blog.cover_image_alt),

      is_featured:
        Boolean(blog.is_featured),

      is_active:
        blog.is_active !== false,

      sort_order:
        Number(blog.sort_order) || 0,

      seo_title:
        safeString(blog.seo_title),

      seo_description:
        safeString(blog.seo_description),
    });

    const {
      data,
      error: imageError,
    } = await supabase
      .from("blog_images")
      .select("*")
      .eq("blog_id", blog.id)
      .order("sort_order", {
        ascending: true,
      });

    if (imageError) {
      setError(imageError.message);
      setImages([]);
    } else {
      /*
        IMPORTANT:
        Supabase may return NULL for image_alt/caption.
        We normalize them to "" so React controlled inputs
        never receive null.
      */

      const normalizedImages: BlogImage[] =
        (data || []).map((image) => ({
          id: image.id,

          blog_id: image.blog_id,

          image_url:
            safeString(image.image_url),

          image_alt:
            safeString(image.image_alt),

          caption:
            safeString(image.caption),

          sort_order:
            Number(image.sort_order) || 0,
        }));

      setImages(normalizedImages);
    }

    setShowEditor(true);
  }

  /* =========================================================
     COVER UPLOAD
  ========================================================= */

  async function uploadCover(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError(
        "Cover image must be under 20MB."
      );
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() || "jpg";

      const filename = slugify(
        file.name.replace(/\.[^.]+$/, "")
      );

      const path =
        `covers/${Date.now()}-${filename}.${extension}`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from("apex-blogs")
        .upload(path, file, {
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: publicUrlData,
      } = supabase.storage
        .from("apex-blogs")
        .getPublicUrl(path);

      updateField(
        "cover_image_url",
        publicUrlData.publicUrl
      );

      setMessage(
        "Cover image uploaded successfully."
      );
    } catch (uploadError: any) {
      console.error(uploadError);

      setError(
        uploadError?.message ||
          "Could not upload cover image."
      );
    } finally {
      setUploading(false);

      if (coverInputRef.current) {
        coverInputRef.current.value = "";
      }
    }
  }

  /* =========================================================
     GALLERY UPLOAD
  ========================================================= */

  async function uploadImages(
    files: FileList | null
  ) {
    if (!files || files.length === 0) {
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const newImages: BlogImage[] = [];

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          continue;
        }

        if (file.size > 20 * 1024 * 1024) {
          continue;
        }

        const extension =
          file.name
            .split(".")
            .pop()
            ?.toLowerCase() || "jpg";

        const baseName = slugify(
          file.name.replace(/\.[^.]+$/, "")
        );

        const path =
          `gallery/${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}-${baseName}.${extension}`;

        const {
          error: uploadError,
        } = await supabase.storage
          .from("apex-blogs")
          .upload(path, file, {
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) {
          throw uploadError;
        }

        const {
          data: publicUrlData,
        } = supabase.storage
          .from("apex-blogs")
          .getPublicUrl(path);

        newImages.push({
          image_url:
            publicUrlData.publicUrl,

          image_alt: "",

          caption: "",

          sort_order:
            images.length + newImages.length,
        });
      }

      setImages((current) => [
        ...current,
        ...newImages,
      ]);

      setMessage(
        `${newImages.length} image${
          newImages.length === 1
            ? ""
            : "s"
        } uploaded.`
      );
    } catch (uploadError: any) {
      console.error(uploadError);

      setError(
        uploadError?.message ||
          "Could not upload images."
      );
    } finally {
      setUploading(false);

      if (galleryInputRef.current) {
        galleryInputRef.current.value = "";
      }
    }
  }

  /* =========================================================
     IMAGE EDITING
  ========================================================= */

  function updateImage(
    index: number,
    field:
      | "image_alt"
      | "caption",
    value: string
  ) {
    setImages((current) =>
      current.map(
        (image, imageIndex) =>
          imageIndex === index
            ? {
                ...image,
                [field]: value,
              }
            : image
      )
    );
  }

  function removeImage(index: number) {
    setImages((current) =>
      current
        .filter(
          (_, imageIndex) =>
            imageIndex !== index
        )
        .map(
          (image, imageIndex) => ({
            ...image,
            sort_order: imageIndex,
          })
        )
    );
  }

  /* =========================================================
     SAVE BLOG
  ========================================================= */

  async function saveBlog() {
    setError("");
    setMessage("");

    if (!form.title.trim()) {
      setError(
        "Blog title is required."
      );
      return;
    }

    if (!form.slug.trim()) {
      setError(
        "Blog slug is required."
      );
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),

        slug: form.slug.trim(),

        excerpt:
          form.excerpt.trim() || null,

        content:
          form.content.trim() || null,

        author_name:
          form.author_name.trim() || null,

        category:
          form.category.trim() || null,

        status: form.status,

        publish_date:
          form.publish_date || null,

        cover_image_url:
          form.cover_image_url.trim() || null,

        cover_image_alt:
          form.cover_image_alt.trim() || null,

        is_featured:
          Boolean(form.is_featured),

        is_active:
          Boolean(form.is_active),

        sort_order:
          Number(form.sort_order) || 0,

        seo_title:
          form.seo_title.trim() || null,

        seo_description:
          form.seo_description.trim() || null,
      };

      let blogId = form.id;

      /* UPDATE */

      if (form.id) {
        const {
          error: updateError,
        } = await supabase
          .from("blog_posts")
          .update(payload)
          .eq("id", form.id);

        if (updateError) {
          throw updateError;
        }
      }

      /* INSERT */

      else {
        const {
          data,
          error: insertError,
        } = await supabase
          .from("blog_posts")
          .insert(payload)
          .select("*")
          .single();

        if (insertError) {
          throw insertError;
        }

        blogId = data.id;
      }

      /* =====================================================
         SAVE GALLERY
      ===================================================== */

      if (blogId) {
        const {
          error: deleteError,
        } = await supabase
          .from("blog_images")
          .delete()
          .eq("blog_id", blogId);

        if (deleteError) {
          throw deleteError;
        }

        if (images.length > 0) {
          const imageRows =
            images.map(
              (image, index) => ({
                blog_id: blogId,

                image_url:
                  safeString(
                    image.image_url
                  ),

                image_alt:
                  safeString(
                    image.image_alt
                  ) || null,

                caption:
                  safeString(
                    image.caption
                  ) || null,

                sort_order: index,
              })
            );

          const {
            error: imageError,
          } = await supabase
            .from("blog_images")
            .insert(imageRows);

          if (imageError) {
            throw imageError;
          }
        }
      }

      setMessage(
        form.id
          ? "Blog updated successfully."
          : "Blog created successfully."
      );

      await loadBlogs();

      setTimeout(() => {
        setShowEditor(false);
      }, 600);
    } catch (saveError: any) {
      console.error(saveError);

      setError(
        saveError?.message ||
          "Could not save the blog."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =========================================================
     DELETE BLOG
  ========================================================= */

  async function deleteBlog(
    blog: BlogPost
  ) {
    const confirmed =
      window.confirm(
        `Delete "${blog.title}" permanently?`
      );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    const {
      error: deleteError,
    } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", blog.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setMessage("Blog deleted.");

    await loadBlogs();
  }

  /* =========================================================
     PUBLISH / UNPUBLISH
  ========================================================= */

  async function togglePublished(
    blog: BlogPost
  ) {
    const nextStatus =
      blog.status === "published"
        ? "draft"
        : "published";

    const {
      error: updateError,
    } = await supabase
      .from("blog_posts")
      .update({
        status: nextStatus,

        publish_date:
          nextStatus === "published"
            ? blog.publish_date ||
              new Date()
                .toISOString()
                .slice(0, 10)
            : blog.publish_date,
      })
      .eq("id", blog.id);

    if (updateError) {
      setError(
        updateError.message
      );
      return;
    }

    await loadBlogs();
  }

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredBlogs = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return blogs.filter((blog) => {
      const matchesSearch =
        !query ||
        [
          blog.title,
          blog.slug,
          blog.category || "",
          blog.author_name || "",
          blog.excerpt || "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        filterStatus === "all" ||
        blog.status === filterStatus;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    blogs,
    search,
    filterStatus,
  ]);

  const publishedCount =
    blogs.filter(
      (blog) =>
        blog.status === "published"
    ).length;

  const draftCount =
    blogs.filter(
      (blog) =>
        blog.status === "draft"
    ).length;

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#071A38] text-white">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <header className="border-b border-white/10 bg-[#0B2146]">
        <div className="mx-auto max-w-[1550px] px-5 py-7 sm:px-7 lg:px-10">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                  CMS
                </span>

                <span className="rounded-full bg-blue-400/10 px-3 py-1 text-[10px] font-semibold text-blue-200">
                  {blogs.length} POSTS
                </span>

              </div>

              <h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                Blog Management
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
                Create, edit and publish school
                stories, articles, achievements
                and updates.
              </p>
            </div>

            <button
              type="button"
              onClick={startNew}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-[#F5F0E6]
                px-6
                py-3.5
                text-sm
                font-semibold
                text-[#102A56]
                shadow-lg
                transition
                hover:bg-white
              "
            >
              <Plus size={17} />
              Create Blog
            </button>

          </div>

        </div>
      </header>

      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="mx-auto max-w-[1550px] px-5 pt-7 sm:px-7 lg:px-10">

        <div className="grid gap-4 sm:grid-cols-3">

          <StatCard
            label="Total Posts"
            value={blogs.length}
          />

          <StatCard
            label="Published"
            value={publishedCount}
            valueClass="text-emerald-300"
          />

          <StatCard
            label="Drafts"
            value={draftCount}
            valueClass="text-amber-200"
          />

        </div>

      </section>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <section className="mx-auto max-w-[1550px] px-5 py-7 sm:px-7 lg:px-10">

        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3 md:flex-row">

          <div className="relative flex-1">

            <Search
              size={17}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-white/30
              "
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search blogs..."
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-black/10
                py-3
                pl-11
                pr-4
                text-sm
                text-white
                outline-none
                placeholder:text-white/25
                focus:border-white/25
              "
            />

          </div>

          <select
            value={filterStatus}
            onChange={(event) =>
              setFilterStatus(
                event.target.value as
                  | "all"
                  | "draft"
                  | "published"
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-[#102A56]
              px-4
              py-3
              text-sm
              text-white
              outline-none
              md:w-48
              [&>option]:bg-[#102A56]
              [&>option]:text-white
            "
          >
            <option value="all">
              All posts
            </option>

            <option value="published">
              Published
            </option>

            <option value="draft">
              Drafts
            </option>
          </select>

        </div>

      </section>

      {/* =====================================================
          MESSAGES
      ===================================================== */}

      <section className="mx-auto max-w-[1550px] px-5 sm:px-7 lg:px-10">

        {message && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            <Check size={16} />
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">

            <span>{error}</span>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
            >
              <X size={16} />
            </button>

          </div>
        )}

      </section>

      {/* =====================================================
          BLOG LIST
      ===================================================== */}

      <section className="mx-auto max-w-[1550px] px-5 pb-16 sm:px-7 lg:px-10">

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2
              size={32}
              className="animate-spin text-white/40"
            />
          </div>
        ) : filteredBlogs.length === 0 ? (

          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.025] px-6 py-20 text-center">

            <FileText
              size={40}
              className="mx-auto text-white/20"
            />

            <h2 className="mt-5 text-xl font-semibold">
              No blogs yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/35">
              Create your first blog post.
              You can add multiple images
              to every article.
            </p>

            <button
              type="button"
              onClick={startNew}
              className="
                mt-6
                rounded-xl
                bg-[#F5F0E6]
                px-5
                py-3
                text-sm
                font-semibold
                text-[#102A56]
              "
            >
              Create your first blog
            </button>

          </div>

        ) : (

          <div className="space-y-3">

            {filteredBlogs.map(
              (blog) => (
                <article
                  key={blog.id}
                  className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.035]
                    transition
                    hover:border-white/20
                  "
                >

                  <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center">

                    {/* IMAGE */}

                    <div className="h-36 w-full shrink-0 overflow-hidden rounded-xl bg-white/5 sm:w-56">

                      {blog.cover_image_url ? (
                        <img
                          src={
                            blog.cover_image_url
                          }
                          alt={
                            blog.cover_image_alt ||
                            blog.title ||
                            "Blog cover"
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full place-items-center">
                          <ImageIcon
                            size={30}
                            className="text-white/15"
                          />
                        </div>
                      )}

                    </div>

                    {/* CONTENT */}

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <span
                          className={`
                            rounded-full
                            px-2.5
                            py-1
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-wide
                            ${
                              blog.status ===
                              "published"
                                ? "bg-emerald-400/10 text-emerald-300"
                                : "bg-amber-400/10 text-amber-200"
                            }
                          `}
                        >
                          {blog.status}
                        </span>

                        {blog.is_featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400/10 px-2.5 py-1 text-[10px] font-semibold text-yellow-200">
                            <Star size={11} />
                            Featured
                          </span>
                        )}

                        {blog.category && (
                          <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] text-white/45">
                            {blog.category}
                          </span>
                        )}

                      </div>

                      <h2 className="mt-3 truncate text-lg font-semibold">
                        {blog.title}
                      </h2>

                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-white/40">
                        {blog.excerpt ||
                          "No excerpt added."}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-white/30">

                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays
                            size={13}
                          />
                          {safeDate(
                            blog.publish_date
                          )}
                        </span>

                        {blog.author_name && (
                          <span>
                            By{" "}
                            {
                              blog.author_name
                            }
                          </span>
                        )}

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="flex shrink-0 flex-wrap items-center gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          void togglePublished(
                            blog
                          )
                        }
                        className="
                          rounded-xl
                          border
                          border-white/10
                          px-3
                          py-2
                          text-xs
                          text-white/60
                          transition
                          hover:bg-white/5
                        "
                      >
                        {blog.status ===
                        "published"
                          ? "Unpublish"
                          : "Publish"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void editBlog(
                            blog
                          )
                        }
                        title="Edit"
                        className="
                          rounded-xl
                          border
                          border-white/10
                          p-2.5
                          text-white/60
                          transition
                          hover:bg-white/5
                        "
                      >
                        <Edit3 size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void deleteBlog(
                            blog
                          )
                        }
                        title="Delete"
                        className="
                          rounded-xl
                          border
                          border-red-400/10
                          p-2.5
                          text-red-300/70
                          transition
                          hover:bg-red-400/10
                        "
                      >
                        <Trash2
                          size={15}
                        />
                      </button>

                    </div>

                  </div>

                </article>
              )
            )}

          </div>
        )}

      </section>

      {/* =====================================================
          EDITOR MODAL
      ===================================================== */}

      {showEditor && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            overflow-y-auto
            bg-black/75
            p-3
            backdrop-blur-md
            sm:p-6
          "
        >

          <div className="mx-auto flex min-h-full max-w-[1450px] items-start justify-center py-3 sm:py-6">

            <div
              className="
                w-full
                overflow-hidden
                rounded-[26px]
                border
                border-white/10
                bg-[#071A38]
                shadow-[0_30px_100px_rgba(0,0,0,0.55)]
              "
            >

              {/* =================================================
                  EDITOR HEADER
              ================================================= */}

              <div
                className="
                  sticky
                  top-0
                  z-30
                  flex
                  flex-col
                  gap-4
                  border-b
                  border-white/10
                  bg-[#0B2146]/95
                  px-5
                  py-5
                  backdrop-blur-xl
                  sm:px-7
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                "
              >

                <div>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/35">
                    Blog Editor
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold">
                    {form.id
                      ? "Edit Blog"
                      : "Create New Blog"}
                  </h2>

                </div>

                <div className="flex items-center gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      setShowEditor(false)
                    }
                    className="
                      rounded-xl
                      border
                      border-white/10
                      px-4
                      py-2.5
                      text-sm
                      text-white/60
                      transition
                      hover:bg-white/5
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      void saveBlog()
                    }
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-[#F5F0E6]
                      px-5
                      py-2.5
                      text-sm
                      font-semibold
                      text-[#102A56]
                      transition
                      hover:bg-white
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >

                    {saving && (
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />
                    )}

                    {saving
                      ? "Saving..."
                      : "Save Blog"}

                  </button>

                </div>

              </div>

              {/* =================================================
                  EDITOR BODY
              ================================================= */}

              <div className="grid lg:grid-cols-[minmax(0,1fr)_370px]">

                {/* =================================================
                    MAIN
                ================================================= */}

                <div className="space-y-6 p-4 sm:p-6 lg:p-7">

                  {/* ARTICLE */}

                  <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

                    <div className="mb-6">

                      <h3 className="text-lg font-semibold">
                        Article
                      </h3>

                      <p className="mt-1 text-xs text-white/35">
                        Write the main article
                        content.
                      </p>

                    </div>

                    <div className="space-y-5">

                      {/* TITLE */}

                      <div>

                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/45">
                          Blog Title
                        </label>

                        <input
                          value={
                            form.title ?? ""
                          }
                          onChange={(event) =>
                            handleTitleChange(
                              event.target
                                .value
                            )
                          }
                          placeholder="Example: Annual Sports Day 2026"
                          className="
                            w-full
                            rounded-xl
                            border
                            border-white/10
                            bg-white/[0.035]
                            px-4
                            py-3.5
                            text-lg
                            text-white
                            outline-none
                            placeholder:text-white/20
                            focus:border-white/25
                          "
                        />

                      </div>

                      {/* EXCERPT */}

                      <div>

                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/45">
                          Short Excerpt
                        </label>

                        <textarea
                          value={
                            form.excerpt ??
                            ""
                          }
                          onChange={(event) =>
                            updateField(
                              "excerpt",
                              event.target
                                .value
                            )
                          }
                          rows={4}
                          placeholder="Short introduction shown on blog cards..."
                          className="
                            w-full
                            resize-none
                            rounded-xl
                            border
                            border-white/10
                            bg-white/[0.035]
                            px-4
                            py-3
                            text-sm
                            leading-6
                            text-white
                            outline-none
                            placeholder:text-white/20
                            focus:border-white/25
                          "
                        />

                      </div>

                      {/* CONTENT */}

                      <div>

                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/45">
                          Article Content
                        </label>

                        <textarea
                          value={
                            form.content ??
                            ""
                          }
                          onChange={(event) =>
                            updateField(
                              "content",
                              event.target
                                .value
                            )
                          }
                          rows={20}
                          placeholder="Write your complete blog article here..."
                          className="
                            w-full
                            resize-y
                            rounded-xl
                            border
                            border-white/10
                            bg-white/[0.035]
                            px-4
                            py-4
                            text-sm
                            leading-7
                            text-white
                            outline-none
                            placeholder:text-white/20
                            focus:border-white/25
                          "
                        />

                        <p className="mt-2 text-[11px] text-white/25">
                          Long-form content is
                          supported.
                        </p>

                      </div>

                    </div>

                  </section>

                  {/* =================================================
                      COVER IMAGE
                  ================================================= */}

                  <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

                    <div className="mb-5">

                      <h3 className="text-lg font-semibold">
                        Cover Image
                      </h3>

                      <p className="mt-1 text-xs text-white/35">
                        Main image displayed on
                        the blog listing and
                        article.
                      </p>

                    </div>

                    {form.cover_image_url && (
                      <div className="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-black/20">

                        <img
                          src={
                            form.cover_image_url
                          }
                          alt={
                            form.cover_image_alt ||
                            form.title ||
                            "Blog cover"
                          }
                          className="
                            max-h-[400px]
                            w-full
                            object-cover
                          "
                        />

                      </div>
                    )}

                    <label
                      className="
                        flex
                        cursor-pointer
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-dashed
                        border-white/15
                        bg-white/[0.025]
                        px-4
                        py-5
                        text-sm
                        text-white/55
                        transition
                        hover:bg-white/5
                      "
                    >

                      {uploading ? (
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                      ) : (
                        <Upload size={17} />
                      )}

                      {uploading
                        ? "Uploading..."
                        : "Upload cover image"}

                      <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploading}
                        onChange={(event) => {
                          const file =
                            event.target
                              .files?.[0];

                          if (file) {
                            void uploadCover(
                              file
                            );
                          }
                        }}
                      />

                    </label>

                    <input
                      value={
                        form.cover_image_url ??
                        ""
                      }
                      onChange={(event) =>
                        updateField(
                          "cover_image_url",
                          event.target.value
                        )
                      }
                      placeholder="Or paste image URL"
                      className="
                        mt-3
                        w-full
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.035]
                        px-4
                        py-3
                        text-sm
                        text-white
                        outline-none
                        placeholder:text-white/20
                      "
                    />

                    <input
                      value={
                        form.cover_image_alt ??
                        ""
                      }
                      onChange={(event) =>
                        updateField(
                          "cover_image_alt",
                          event.target.value
                        )
                      }
                      placeholder="Image alt text"
                      className="
                        mt-3
                        w-full
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.035]
                        px-4
                        py-3
                        text-sm
                        text-white
                        outline-none
                        placeholder:text-white/20
                      "
                    />

                  </section>

                  {/* =================================================
                      GALLERY
                  ================================================= */}

                  <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

                    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <h3 className="text-lg font-semibold">
                          Article Gallery
                        </h3>

                        <p className="mt-1 text-xs text-white/35">
                          Add as many images as
                          this article needs.
                        </p>

                      </div>

                      <label
                        className="
                          inline-flex
                          cursor-pointer
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          bg-[#F5F0E6]
                          px-4
                          py-2.5
                          text-sm
                          font-semibold
                          text-[#102A56]
                          transition
                          hover:bg-white
                        "
                      >

                        <Plus size={15} />

                        Add Images

                        <input
                          ref={galleryInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          disabled={uploading}
                          onChange={(event) =>
                            void uploadImages(
                              event.target
                                .files
                            )
                          }
                        />

                      </label>

                    </div>

                    {images.length === 0 ? (

                      <div className="rounded-xl border border-dashed border-white/10 py-14 text-center">

                        <ImageIcon
                          size={30}
                          className="mx-auto text-white/15"
                        />

                        <p className="mt-3 text-sm text-white/35">
                          No gallery images yet.
                        </p>

                      </div>

                    ) : (

                      <div className="grid gap-4 sm:grid-cols-2">

                        {images.map(
                          (
                            image,
                            index
                          ) => (

                            <div
                              key={
                                image.id ||
                                `${image.image_url}-${index}`
                              }
                              className="
                                overflow-hidden
                                rounded-2xl
                                border
                                border-white/10
                                bg-black/10
                              "
                            >

                              {/* IMAGE */}

                              <div className="relative aspect-[16/10] overflow-hidden bg-white/5">

                                {image.image_url ? (
                                  <img
                                    src={
                                      image.image_url ??
                                      ""
                                    }
                                    alt={
                                      image.image_alt ||
                                      `Blog image ${
                                        index +
                                        1
                                      }`
                                    }
                                    className="
                                      h-full
                                      w-full
                                      object-cover
                                    "
                                  />
                                ) : (
                                  <div className="grid h-full place-items-center">
                                    <ImageIcon
                                      size={28}
                                      className="text-white/20"
                                    />
                                  </div>
                                )}

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeImage(
                                      index
                                    )
                                  }
                                  className="
                                    absolute
                                    right-2
                                    top-2
                                    rounded-lg
                                    bg-black/70
                                    p-2
                                    text-white
                                    backdrop-blur
                                    transition
                                    hover:bg-red-500/80
                                  "
                                >
                                  <Trash2
                                    size={14}
                                  />
                                </button>

                                <span className="
                                  absolute
                                  bottom-2
                                  left-2
                                  rounded-lg
                                  bg-black/65
                                  px-2
                                  py-1
                                  text-[10px]
                                  text-white/80
                                  backdrop-blur
                                ">
                                  Image{" "}
                                  {index + 1}
                                </span>

                              </div>

                              {/* IMAGE FIELDS */}

                              <div className="space-y-2 p-3">

                                <input
                                  value={
                                    image.image_alt ??
                                    ""
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    updateImage(
                                      index,
                                      "image_alt",
                                      event.target
                                        .value
                                    )
                                  }
                                  placeholder="Alt text"
                                  className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-white/10
                                    bg-white/[0.035]
                                    px-3
                                    py-2
                                    text-xs
                                    text-white
                                    outline-none
                                    placeholder:text-white/20
                                  "
                                />

                                <input
                                  value={
                                    image.caption ??
                                    ""
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    updateImage(
                                      index,
                                      "caption",
                                      event.target
                                        .value
                                    )
                                  }
                                  placeholder="Image caption"
                                  className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-white/10
                                    bg-white/[0.035]
                                    px-3
                                    py-2
                                    text-xs
                                    text-white
                                    outline-none
                                    placeholder:text-white/20
                                  "
                                />

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    )}

                  </section>

                </div>

                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <aside
                  className="
                    border-t
                    border-white/10
                    bg-[#06152F]
                    p-5
                    sm:p-6
                    lg:border-l
                    lg:border-t-0
                    lg:p-7
                  "
                >

                  <div className="space-y-7">

                    {/* PUBLISHING */}

                    <section>

                      <h3 className="mb-5 text-lg font-semibold">
                        Publishing
                      </h3>

                      <div className="space-y-4">

                        <div>

                          <label className="mb-2 block text-xs font-medium text-white/40">
                            Status
                          </label>

                          <select
                            value={
                              form.status
                            }
                            onChange={(
                              event
                            ) =>
                              updateField(
                                "status",
                                event.target
                                  .value as
                                  | "draft"
                                  | "published"
                              )
                            }
                            className="
                              w-full
                              rounded-xl
                              border
                              border-white/10
                              bg-[#102A56]
                              px-3
                              py-3
                              text-sm
                              text-white
                              outline-none
                              [&>option]:bg-[#102A56]
                              [&>option]:text-white
                            "
                          >
                            <option value="draft">
                              Draft
                            </option>

                            <option value="published">
                              Published
                            </option>
                          </select>

                        </div>

                        <div>

                          <label className="mb-2 block text-xs font-medium text-white/40">
                            Publish Date
                          </label>

                          <input
                            type="date"
                            value={
                              form.publish_date ??
                              ""
                            }
                            onChange={(
                              event
                            ) =>
                              updateField(
                                "publish_date",
                                event.target
                                  .value
                              )
                            }
                            className="
                              w-full
                              rounded-xl
                              border
                              border-white/10
                              bg-white/[0.035]
                              px-3
                              py-3
                              text-sm
                              text-white
                              outline-none
                            "
                          />

                        </div>

                        <div>

                          <label className="mb-2 block text-xs font-medium text-white/40">
                            Display Order
                          </label>

                          <input
                            type="number"
                            value={
                              form.sort_order ??
                              0
                            }
                            onChange={(
                              event
                            ) =>
                              updateField(
                                "sort_order",
                                Number(
                                  event.target
                                    .value
                                ) || 0
                              )
                            }
                            className="
                              w-full
                              rounded-xl
                              border
                              border-white/10
                              bg-white/[0.035]
                              px-3
                              py-3
                              text-sm
                              text-white
                              outline-none
                            "
                          />

                        </div>

                        <ToggleRow
                          label="Featured Blog"
                          checked={
                            form.is_featured
                          }
                          onChange={(
                            checked
                          ) =>
                            updateField(
                              "is_featured",
                              checked
                            )
                          }
                        />

                        <ToggleRow
                          label="Active"
                          checked={
                            form.is_active
                          }
                          onChange={(
                            checked
                          ) =>
                            updateField(
                              "is_active",
                              checked
                            )
                          }
                        />

                      </div>

                    </section>

                    <div className="h-px bg-white/10" />

                    {/* DETAILS */}

                    <section>

                      <h3 className="mb-5 text-lg font-semibold">
                        Details
                      </h3>

                      <div className="space-y-4">

                        <div>

                          <label className="mb-2 block text-xs font-medium text-white/40">
                            URL Slug
                          </label>

                          <input
                            value={
                              form.slug ?? ""
                            }
                            onChange={(
                              event
                            ) =>
                              updateField(
                                "slug",
                                slugify(
                                  event.target
                                    .value
                                )
                              )
                            }
                            placeholder="annual-sports-day-2026"
                            className="
                              w-full
                              rounded-xl
                              border
                              border-white/10
                              bg-white/[0.035]
                              px-3
                              py-3
                              text-sm
                              text-white
                              outline-none
                            "
                          />

                        </div>

                        <div>

                          <label className="mb-2 block text-xs font-medium text-white/40">
                            Category
                          </label>

                          <input
                            value={
                              form.category ??
                              ""
                            }
                            onChange={(
                              event
                            ) =>
                              updateField(
                                "category",
                                event.target
                                  .value
                              )
                            }
                            placeholder="School Life"
                            className="
                              w-full
                              rounded-xl
                              border
                              border-white/10
                              bg-white/[0.035]
                              px-3
                              py-3
                              text-sm
                              text-white
                              outline-none
                            "
                          />

                        </div>

                        <div>

                          <label className="mb-2 block text-xs font-medium text-white/40">
                            Author
                          </label>

                          <input
                            value={
                              form.author_name ??
                              ""
                            }
                            onChange={(
                              event
                            ) =>
                              updateField(
                                "author_name",
                                event.target
                                  .value
                              )
                            }
                            placeholder="Apex Public School"
                            className="
                              w-full
                              rounded-xl
                              border
                              border-white/10
                              bg-white/[0.035]
                              px-3
                              py-3
                              text-sm
                              text-white
                              outline-none
                            "
                          />

                        </div>

                      </div>

                    </section>

                    <div className="h-px bg-white/10" />

                    {/* SEO */}

                    <section>

                      <h3 className="mb-5 text-lg font-semibold">
                        SEO
                      </h3>

                      <div className="space-y-4">

                        <input
                          value={
                            form.seo_title ??
                            ""
                          }
                          onChange={(event) =>
                            updateField(
                              "seo_title",
                              event.target
                                .value
                            )
                          }
                          placeholder="SEO title"
                          className="
                            w-full
                            rounded-xl
                            border
                            border-white/10
                            bg-white/[0.035]
                            px-3
                            py-3
                            text-sm
                            text-white
                            outline-none
                          "
                        />

                        <textarea
                          value={
                            form.seo_description ??
                            ""
                          }
                          onChange={(event) =>
                            updateField(
                              "seo_description",
                              event.target
                                .value
                            )
                          }
                          rows={5}
                          placeholder="SEO description"
                          className="
                            w-full
                            resize-none
                            rounded-xl
                            border
                            border-white/10
                            bg-white/[0.035]
                            px-3
                            py-3
                            text-sm
                            leading-6
                            text-white
                            outline-none
                          "
                        />

                      </div>

                    </section>

                    {/* INFO */}

                    <div className="
                      rounded-xl
                      border
                      border-blue-400/10
                      bg-blue-400/5
                      p-4
                    ">
                      <p className="text-xs leading-5 text-blue-100/50">
                        Gallery images are saved
                        together with the article.
                        Empty alt text and captions
                        are safely converted to
                        NULL when saving.
                      </p>
                    </div>

                  </div>

                </aside>

              </div>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: number;
  valueClass?: string;
}) {
  return (
    <div className="
      rounded-2xl
      border
      border-white/10
      bg-white/[0.035]
      p-5
    ">

      <p className="
        text-xs
        uppercase
        tracking-[0.16em]
        text-white/35
      ">
        {label}
      </p>

      <p
        className={`
          mt-3
          text-3xl
          font-semibold
          ${valueClass}
        `}
      >
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   TOGGLE ROW
========================================================= */

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (
    value: boolean
  ) => void;
}) {
  return (
    <label className="
      flex
      cursor-pointer
      items-center
      justify-between
      rounded-xl
      border
      border-white/10
      bg-white/[0.025]
      p-3
    ">

      <span className="text-sm text-white/60">
        {label}
      </span>

      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(event) =>
          onChange(
            event.target.checked
          )
        }
        className="h-4 w-4 accent-blue-500"
      />

    </label>
  );
}