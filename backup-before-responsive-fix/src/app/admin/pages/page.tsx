"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Page = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  created_at?: string;
  updated_at?: string;
};

export default function PagesCMS() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPages();
  }, []);

  async function loadPages() {
    try {
      const response = await fetch("/api/cms/pages");
      const data = await response.json();

      if (response.ok) {
        setPages(data.pages || []);
      }
    } catch (error) {
      console.error("Failed to load pages:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deletePage(id: string) {
    if (!confirm("Delete this page?")) return;

    const response = await fetch(`/api/cms/pages/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setPages((current) => current.filter((page) => page.id !== id));
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] p-6 text-[#172033]">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="mb-1 text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
              CMS
            </p>

            <h1 className="text-3xl font-bold">
              Pages
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage the pages of your Apex Public School website.
            </p>
          </div>

          <Link
            href="/admin/pages/new"
            className="rounded-xl bg-[#172033] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            + Add Page
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="font-semibold">
              All Pages
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-sm text-gray-500">
              Loading pages...
            </div>
          ) : pages.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                +
              </div>

              <h3 className="font-semibold">
                No pages yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Create your first page to get started.
              </p>

              <Link
                href="/admin/pages/new"
                className="mt-5 inline-flex rounded-xl bg-[#172033] px-5 py-3 text-sm font-semibold text-white"
              >
                Create Page
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">

              {pages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between gap-4 px-6 py-5"
                >

                  <div className="min-w-0">
                    <h3 className="font-semibold">
                      {page.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      /{page.slug}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        page.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {page.status}
                    </span>

                    <Link
                      href={`/admin/pages/${page.id}`}
                      className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deletePage(page.id)}
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </main>
  );
}
