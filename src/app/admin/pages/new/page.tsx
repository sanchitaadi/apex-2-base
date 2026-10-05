"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slug || slug === createSlug(title)) {
      setSlug(createSlug(value));
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Please enter a page title.");
      return;
    }

    if (!slug.trim()) {
      setError("Please enter a page slug.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/cms/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          status,
          seo_title: seoTitle.trim(),
          seo_description: seoDescription.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create page.");
      }

      router.push("/admin/pages");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] p-6 text-[#172033]">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8">
          <Link
            href="/admin/pages"
            className="mb-5 inline-flex text-sm font-medium text-gray-500 hover:text-[#172033]"
          >
            ← Back to Pages
          </Link>

          <p className="mb-1 text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
            CMS
          </p>

          <h1 className="text-3xl font-bold">
            Add New Page
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create a new page for the Apex Public School website.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="space-y-6">

            {/* BASIC INFORMATION */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <div className="mb-6">
                <h2 className="text-lg font-semibold">
                  Page Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Basic information about this page.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold">
                    Page Title
                  </label>

                  <input
                    type="text"
                    value={title}
                    onChange={(e) =>
                      handleTitleChange(e.target.value)
                    }
                    placeholder="Example: About Our School"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#172033] focus:ring-2 focus:ring-[#172033]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    URL Slug
                  </label>

                  <div className="flex items-center overflow-hidden rounded-xl border border-gray-200">
                    <span className="bg-gray-50 px-3 py-3 text-sm text-gray-400">
                      /
                    </span>

                    <input
                      type="text"
                      value={slug}
                      onChange={(e) =>
                        setSlug(createSlug(e.target.value))
                      }
                      placeholder="about-our-school"
                      className="w-full px-3 py-3 text-sm outline-none"
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    This becomes the page URL.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Status
                  </label>

                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(
                        e.target.value as
                          | "draft"
                          | "published"
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#172033]"
                  >
                    <option value="draft">
                      Draft
                    </option>

                    <option value="published">
                      Published
                    </option>
                  </select>
                </div>

              </div>

            </section>

            {/* SEO */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <div className="mb-6">
                <h2 className="text-lg font-semibold">
                  SEO Settings
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Optional search-engine information.
                </p>
              </div>

              <div className="space-y-5">

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    SEO Title
                  </label>

                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) =>
                      setSeoTitle(e.target.value)
                    }
                    placeholder="Page title for search engines"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#172033]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    SEO Description
                  </label>

                  <textarea
                    value={seoDescription}
                    onChange={(e) =>
                      setSeoDescription(e.target.value)
                    }
                    placeholder="Short description of this page..."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#172033]"
                  />
                </div>

              </div>

            </section>

            {/* ERROR */}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* ACTIONS */}

            <div className="flex items-center justify-end gap-3">

              <Link
                href="/admin/pages"
                className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#172033] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create Page"}
              </button>

            </div>

          </div>

        </form>

      </div>
    </main>
  );
}
