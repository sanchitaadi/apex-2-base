"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  Copy,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Link2,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type Card = {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  button_text?: string;
  button_url?: string;
  background_color?: string;
  text_color?: string;
  visible?: boolean;
};

type Section = {
  id: string;
  type: string;
  title: string;
  content: string;
  image_url?: string;
  button_text?: string;
  button_url?: string;
  background_color?: string;
  text_color?: string;
  alignment?: "left" | "center" | "right";
  padding?: string;
  visible?: boolean;
  cards?: Card[];
};

type PageData = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  seo_title: string | null;
  seo_description: string | null;
  layout_json: {
    sections: Section[];
  };
};

const SECTION_OPTIONS = [
  {
    type: "hero",
    label: "Hero",
    description: "Large introduction section",
    icon: "✦",
  },
  {
    type: "text",
    label: "Text",
    description: "Heading and content",
    icon: "T",
  },
  {
    type: "image",
    label: "Image",
    description: "Photo with content",
    icon: "▧",
  },
  {
    type: "cards",
    label: "Cards",
    description: "Information showcase",
    icon: "▦",
  },
];

function createDefaultSection(type: string): Section {
  return {
    id: crypto.randomUUID(),
    type,
    title:
      type === "hero"
        ? "Welcome to Apex Public School"
        : type === "text"
          ? "About Our School"
          : type === "image"
            ? "Our Campus"
            : "Featured Information",
    content:
      type === "hero"
        ? "Excellence in education, character and leadership."
        : type === "cards"
          ? "Create an engaging information section for your visitors."
          : "Add your content here.",
    background_color:
      type === "hero"
        ? "#13294b"
        : "#ffffff",
    text_color:
      type === "hero"
        ? "#ffffff"
        : "#13294b",
    alignment:
      type === "hero"
        ? "center"
        : "left",
    padding:
      type === "hero"
        ? "80px"
        : "60px",
    button_text:
      type === "hero"
        ? "Learn More"
        : "",
    button_url:
      type === "hero"
        ? "#"
        : "",
    image_url: "",
    visible: true,
  };
}

function getSectionLabel(type: string) {
  return (
    SECTION_OPTIONS.find(
      (item) => item.type === type
    )?.label || type
  );
}

function getSectionIcon(type: string) {
  return (
    SECTION_OPTIONS.find(
      (item) => item.type === type
    )?.icon || "•"
  );
}

export default function PageEditor() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id as string;

  const [page, setPage] =
    useState<PageData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState<
      "success" | "error" | ""
    >("");

  const [selectedSection, setSelectedSection] =
    useState<string | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const [uploadError, setUploadError] =
    useState("");

  const [dragActive, setDragActive] =
    useState(false);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (id) {
      loadPage();
    }
  }, [id]);

  async function loadPage() {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `/api/cms/pages/${id}`,
        {
          cache: "no-store",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to load page."
        );
      }

      setPage({
        ...data.page,
        layout_json:
          data.page.layout_json || {
            sections: [],
          },
      });
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to load page."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  function updatePage(
    field: keyof PageData,
    value: any
  ) {
    setPage((current) =>
      current
        ? {
            ...current,
            [field]: value,
          }
        : current
    );
  }

  function addSection(type: string) {
    if (!page) return;

    const section =
      createDefaultSection(type);

    setPage({
      ...page,
      layout_json: {
        sections: [
          ...page.layout_json.sections,
          section,
        ],
      },
    });

    setSelectedSection(section.id);

    setTimeout(() => {
      document
        .getElementById(
          `section-${section.id}`
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 50);
  }

  function updateSection(
    sectionId: string,
    field: keyof Section,
    value: any
  ) {
    if (!page) return;

    setPage({
      ...page,
      layout_json: {
        sections:
          page.layout_json.sections.map(
            (section) =>
              section.id === sectionId
                ? {
                    ...section,
                    [field]: value,
                  }
                : section
          ),
      },
    });
  }

  function deleteSection(
    sectionId: string
  ) {
    if (!page) return;

    const sections =
      page.layout_json.sections.filter(
        (section) =>
          section.id !== sectionId
      );

    setPage({
      ...page,
      layout_json: {
        sections,
      },
    });

    setSelectedSection(null);
  }

  function duplicateSection(
    sectionId: string
  ) {
    if (!page) return;

    const index =
      page.layout_json.sections.findIndex(
        (section) =>
          section.id === sectionId
      );

    if (index === -1) return;

    const original =
      page.layout_json.sections[index];

    const copy: Section = {
      ...original,
      id: crypto.randomUUID(),
      title:
        original.title
          ? `${original.title} Copy`
          : "Section Copy",
    };

    const sections = [
      ...page.layout_json.sections,
    ];

    sections.splice(
      index + 1,
      0,
      copy
    );

    setPage({
      ...page,
      layout_json: {
        sections,
      },
    });

    setSelectedSection(copy.id);
  }

  function moveSection(
    sectionId: string,
    direction: "up" | "down"
  ) {
    if (!page) return;

    const sections = [
      ...page.layout_json.sections,
    ];

    const index =
      sections.findIndex(
        (section) =>
          section.id === sectionId
      );

    if (index === -1) return;

    const newIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      newIndex < 0 ||
      newIndex >= sections.length
    ) {
      return;
    }

    [
      sections[index],
      sections[newIndex],
    ] = [
      sections[newIndex],
      sections[index],
    ];

    setPage({
      ...page,
      layout_json: {
        sections,
      },
    });
  }

  async function uploadSectionImage(
    sectionId: string,
    file: File
  ) {
    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setUploadError(
        "Please select a valid image file."
      );
      return;
    }

    if (
      file.size >
      15 * 1024 * 1024
    ) {
      setUploadError(
        "Image must be smaller than 15MB."
      );
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() ||
        "jpg";

      const safeName =
        file.name
          .replace(
            /\.[^/.]+$/,
            ""
          )
          .toLowerCase()
          .replace(
            /[^a-z0-9]+/g,
            "-"
          )
          .replace(
            /^-+|-+$/g,
            "");

      const filePath =
        `page-builder/${id}/${sectionId}-${safeName}-${Date.now()}.${extension}`;

      const {
        error: storageError,
      } =
        await supabase.storage
          .from("gallery")
          .upload(
            filePath,
            file,
            {
              upsert: false,
              contentType:
                file.type,
            }
          );

      if (storageError) {
        throw storageError;
      }

      const {
        data: publicData,
      } =
        supabase.storage
          .from("gallery")
          .getPublicUrl(
            filePath
          );

      if (
        !publicData?.publicUrl
      ) {
        throw new Error(
          "Image uploaded, but its public URL could not be created."
        );
      }

      updateSection(
        sectionId,
        "image_url",
        publicData.publicUrl
      );
    } catch (error) {
      console.error(
        "Image upload failed:",
        error
      );

      setUploadError(
        error instanceof Error
          ? error.message
          : "Image upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  function handleFileInput(
    event: React.ChangeEvent<HTMLInputElement>,
    sectionId: string
  ) {
    const file =
      event.target.files?.[0];

    if (file) {
      uploadSectionImage(
        sectionId,
        file
      );
    }

    event.target.value = "";
  }

  function handleDrop(
    event: React.DragEvent<HTMLDivElement>,
    sectionId: string
  ) {
    event.preventDefault();
    event.stopPropagation();

    setDragActive(false);

    const file =
      event.dataTransfer.files?.[0];

    if (file) {
      uploadSectionImage(
        sectionId,
        file
      );
    }
  }

  function addCard(sectionId: string) {
    if (!page) return;

    const newCard: Card = {
      id: crypto.randomUUID(),
      title: "New Card",
      content: "Add card content here.",
      image_url: "",
      button_text: "",
      button_url: "",
      background_color: "#ffffff",
      text_color: "#13294b",
      visible: true,
    };

    setPage({
      ...page,
      layout_json: {
        sections: page.layout_json.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                cards: [
                  ...(section.cards || []),
                  newCard,
                ],
              }
            : section
        ),
      },
    });
  }

  function updateCard(
    sectionId: string,
    cardId: string,
    field: keyof Card,
    value: any
  ) {
    if (!page) return;

    setPage({
      ...page,
      layout_json: {
        sections: page.layout_json.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                cards: (section.cards || []).map((card) =>
                  card.id === cardId
                    ? {
                        ...card,
                        [field]: value,
                      }
                    : card
                ),
              }
            : section
        ),
      },
    });
  }

  function deleteCard(
    sectionId: string,
    cardId: string
  ) {
    if (!page) return;

    setPage({
      ...page,
      layout_json: {
        sections: page.layout_json.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                cards: (section.cards || []).filter(
                  (card) => card.id !== cardId
                ),
              }
            : section
        ),
      },
    });
  }

  async function savePage() {
    if (!page) return;

    try {
      setSaving(true);
      setMessage("");
      setMessageType("");

      const response =
        await fetch(
          `/api/cms/pages/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              title: page.title,
              slug: page.slug,
              status: page.status,
              seo_title:
                page.seo_title,
              seo_description:
                page.seo_description,
              layout_json:
                page.layout_json,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to save page."
        );
      }

      setPage({
        ...data.page,
        layout_json:
          data.page.layout_json ||
          page.layout_json,
      });

      setMessage(
        "Changes saved successfully."
      );

      setMessageType("success");

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save page."
      );

      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  const activeSection =
    page?.layout_json.sections.find(
      (section) =>
        section.id ===
        selectedSection
    );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#eef1f5] p-6">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="rounded-3xl bg-white px-10 py-12 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#13294b]/10">
              <Loader2 className="h-6 w-6 animate-spin text-[#13294b]" />
            </div>

            <h1 className="text-lg font-bold text-[#13294b]">
              Loading Page Builder
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Preparing your page...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!page) {
    return (
      <main className="min-h-screen bg-[#eef1f5] p-6">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 shadow-xl">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            !
          </div>

          <h1 className="text-2xl font-bold text-[#13294b]">
            Page could not be loaded
          </h1>

          <p className="mt-3 text-sm text-red-600">
            {message}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/pages"
              )
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#13294b] px-5 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pages
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#eef1f5] text-[#13294b]">

      {/* =========================================================
          TOP BAR
      ========================================================= */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="flex min-h-[76px] items-center justify-between gap-4 px-4 md:px-6">

          <div className="flex min-w-0 items-center gap-3">

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/pages"
                )
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-[#13294b]"
              title="Back to pages"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-base font-bold md:text-lg">
                  {page.title}
                </h1>

                <span
                  className={`hidden rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider sm:inline-flex ${
                    page.status ===
                    "published"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {page.status}
                </span>
              </div>

              <p className="truncate text-xs text-slate-400">
                /{page.slug}
              </p>
            </div>

          </div>

          <div className="flex shrink-0 items-center gap-2 md:gap-3">

            {message && (
              <div
                className={`hidden items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold md:flex ${
                  messageType ===
                  "error"
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {messageType ===
                "success" ? (
                  <Check className="h-3.5 w-3.5" />
                ) : null}

                {message}
              </div>
            )}

            <button
              type="button"
              onClick={savePage}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#13294b] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#13294b]/15 transition hover:-translate-y-0.5 hover:bg-[#1c3c69] disabled:cursor-not-allowed disabled:opacity-60 md:px-5 md:py-3"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">
                    Saving...
                  </span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>
                    Save Changes
                  </span>
                </>
              )}
            </button>

          </div>
        </div>
      </header>

      {/* =========================================================
          BUILDER
      ========================================================= */}

      <div className="grid min-h-[calc(100vh-76px)] lg:grid-cols-[250px_minmax(0,1fr)_350px]">

        {/* =======================================================
            LEFT SIDEBAR
        ======================================================= */}

        <aside className="border-r border-slate-200 bg-white">

          <div className="sticky top-[76px] max-h-[calc(100vh-76px)] overflow-y-auto p-4">

            <div className="mb-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Builder
              </p>

              <h2 className="mt-1 text-lg font-bold text-[#13294b]">
                Add Sections
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Build your page by adding sections.
              </p>
            </div>

            <div className="space-y-2">

              {SECTION_OPTIONS.map(
                (item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() =>
                      addSection(
                        item.type
                      )
                    }
                    className="group flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#13294b]/30 hover:bg-[#13294b]/[0.025] hover:shadow-md"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#13294b]/[0.07] text-sm font-black text-[#13294b] transition group-hover:bg-[#13294b] group-hover:text-white">
                      {item.icon}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-[#13294b]">
                        {item.label}
                      </span>

                      <span className="mt-0.5 block text-[10px] leading-4 text-slate-400">
                        {item.description}
                      </span>
                    </span>

                    <Plus className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-[#13294b]" />
                  </button>
                )
              )}

            </div>

            <div className="my-6 h-px bg-slate-100" />

            {/* SECTIONS LIST */}

            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Sections
              </p>

              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                {page.layout_json.sections.length}
              </span>
            </div>

            {page.layout_json.sections.length ===
            0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-300 shadow-sm">
                  <Plus className="h-5 w-5" />
                </div>

                <p className="text-xs font-semibold text-slate-500">
                  No sections yet
                </p>

                <p className="mt-1 text-[10px] leading-4 text-slate-400">
                  Add a section above to start.
                </p>
              </div>
            ) : (
              <div className="space-y-2">

                {page.layout_json.sections.map(
                  (
                    section,
                    index
                  ) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() =>
                        setSelectedSection(
                          section.id
                        )
                      }
                      className={`group flex w-full items-center gap-2 rounded-xl p-2.5 text-left transition ${
                        selectedSection ===
                        section.id
                          ? "bg-[#13294b] text-white shadow-md"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-black ${
                          selectedSection ===
                          section.id
                            ? "bg-white/15 text-white"
                            : "bg-white text-[#13294b] shadow-sm"
                        }`}
                      >
                        {index + 1}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-bold">
                          {section.title ||
                            getSectionLabel(
                              section.type
                            )}
                        </span>

                        <span
                          className={`mt-0.5 block text-[9px] uppercase tracking-wider ${
                            selectedSection ===
                            section.id
                              ? "text-white/50"
                              : "text-slate-400"
                          }`}
                        >
                          {getSectionLabel(
                            section.type
                          )}
                        </span>
                      </span>

                      {section.visible ===
                      false ? (
                        <EyeOff
                          className={`h-3.5 w-3.5 ${
                            selectedSection ===
                            section.id
                              ? "text-white/50"
                              : "text-slate-300"
                          }`}
                        />
                      ) : null}
                    </button>
                  )
                )}

              </div>
            )}

          </div>
        </aside>

        {/* =======================================================
            LIVE CANVAS
        ======================================================= */}

        <section className="min-w-0 overflow-y-auto bg-[#eef1f5]">

          <div className="mx-auto max-w-6xl p-4 md:p-7">

            {/* CANVAS HEADER */}

            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#13294b] text-white">
                    <Eye className="h-3.5 w-3.5" />
                  </span>

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    Live Canvas
                  </p>
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  Click any section to edit it.
                </p>
              </div>

              <div className="flex items-center gap-2">

                <span className="hidden text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:block">
                  Page status
                </span>

                <select
                  value={page.status}
                  onChange={(e) =>
                    updatePage(
                      "status",
                      e.target.value
                    )
                  }
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#13294b] outline-none transition focus:border-[#13294b] focus:ring-4 focus:ring-[#13294b]/10"
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

            {/* PAGE PREVIEW */}

            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl shadow-slate-300/40">

              {page.layout_json.sections
                .filter(
                  (section) =>
                    section.visible !==
                    false
                )
                .map(
                  (
                    section,
                    index
                  ) => (
                    <div
                      id={`section-${section.id}`}
                      key={section.id}
                      onClick={() =>
                        setSelectedSection(
                          section.id
                        )
                      }
                      style={{
                        backgroundColor:
                          section.background_color ||
                          "#ffffff",
                        color:
                          section.text_color ||
                          "#13294b",
                        textAlign:
                          section.alignment ||
                          "center",
                        padding:
                          section.padding ||
                          "60px",
                      }}
                      className={`group relative cursor-pointer overflow-hidden transition-all duration-200 ${
                        selectedSection ===
                        section.id
                          ? "z-10 ring-4 ring-inset ring-[#13294b]"
                          : "hover:z-10 hover:ring-2 hover:ring-inset hover:ring-[#13294b]/20"
                      }`}
                    >

                      {/* SECTION TOOLBAR */}

                      <div
                        className={`absolute left-3 right-3 top-3 z-20 flex items-center justify-between rounded-xl border px-3 py-2 shadow-sm backdrop-blur transition ${
                          selectedSection ===
                          section.id
                            ? "border-[#13294b]/20 bg-white/95 opacity-100"
                            : "border-white/20 bg-white/80 opacity-0 group-hover:opacity-100"
                        }`}
                        style={{
                          color: "#13294b",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#13294b] text-[10px] font-black text-white">
                            {index + 1}
                          </span>

                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            {getSectionLabel(
                              section.type
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">

                          <button
                            type="button"
                            onClick={(
                              event
                            ) => {
                              event.stopPropagation();
                              moveSection(
                                section.id,
                                "up"
                              );
                            }}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#13294b]"
                            title="Move up"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={(
                              event
                            ) => {
                              event.stopPropagation();
                              moveSection(
                                section.id,
                                "down"
                              );
                            }}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#13294b]"
                            title="Move down"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={(
                              event
                            ) => {
                              event.stopPropagation();
                              duplicateSection(
                                section.id
                              );
                            }}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#13294b]"
                            title="Duplicate"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={(
                              event
                            ) => {
                              event.stopPropagation();
                              deleteSection(
                                section.id
                              );
                            }}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>

                        </div>
                      </div>

                      {/* IMAGE */}

                      {section.image_url && (
                        <div
                          className={`relative z-0 mx-auto mb-7 overflow-hidden rounded-2xl ${
                            section.type ===
                            "hero"
                              ? "max-w-4xl"
                              : "max-w-2xl"
                          }`}
                        >
                          <img
                            src={
                              section.image_url
                            }
                            alt=""
                            className={`w-full object-cover ${
                              section.type ===
                              "hero"
                                ? "max-h-[360px]"
                                : "max-h-[300px]"
                            }`}
                          />
                        </div>
                      )}

                      {/* PLACEHOLDER IMAGE */}

                      {!section.image_url &&
                        section.type ===
                          "image" && (
                          <div
                            className="mx-auto mb-7 flex max-w-2xl flex-col items-center justify-center rounded-2xl border-2 border-dashed border-current/15 bg-black/[0.03] py-16"
                            style={{
                              color:
                                section.text_color ||
                                "#13294b",
                            }}
                          >
                            <ImageIcon className="mb-3 h-10 w-10 opacity-25" />

                            <p className="text-sm font-semibold opacity-50">
                              Add an image
                            </p>

                            <p className="mt-1 text-xs opacity-40">
                              Select this section to upload a photo
                            </p>
                          </div>
                        )}

                      {/* CONTENT */}

                      <div className="relative z-10 mx-auto max-w-4xl">

                        <div
                          className={`mb-3 inline-flex items-center rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] ${
                            section.type ===
                            "hero"
                              ? "bg-white/10"
                              : "bg-[#13294b]/[0.06]"
                          }`}
                        >
                          {getSectionLabel(
                            section.type
                          )}
                        </div>

                        <h2 className="text-3xl font-black tracking-tight md:text-5xl">
                          {section.title ||
                            "Untitled Section"}
                        </h2>

                        {section.content && (
                          <p className="mx-auto mt-5 max-w-2xl whitespace-pre-line text-base leading-7 opacity-75 md:text-lg">
                            {section.content}
                          </p>
                        )}

                        {section.type === "cards" &&
                      section.cards &&
                      section.cards.length > 0 && (
                        <div className="mx-auto mt-8 grid max-w-6xl gap-6 md:grid-cols-2 xl:grid-cols-3">
                          {section.cards
                            .filter(
                              (card) =>
                                card.visible !== false
                            )
                            .map((card) => (
                              <div
                                key={card.id}
                                style={{
                                  backgroundColor:
                                    card.background_color ||
                                    "#ffffff",
                                  color:
                                    card.text_color ||
                                    "#13294b",
                                }}
                                className="rounded-3xl p-7 text-left shadow-lg transition hover:-translate-y-1"
                              >
                                {card.image_url && (
                                  <img
                                    src={card.image_url}
                                    alt={card.title}
                                    className="mb-5 h-44 w-full rounded-2xl object-cover"
                                  />
                                )}

                                <h3 className="text-xl font-bold">
                                  {card.title}
                                </h3>

                                {card.content && (
                                  <p className="mt-3 leading-7 opacity-80">
                                    {card.content}
                                  </p>
                                )}

                                {card.button_text && (
                                  <span className="mt-5 inline-flex rounded-xl bg-[#13294b] px-5 py-2.5 text-sm font-semibold text-white">
                                    {card.button_text}
                                  </span>
                                )}
                              </div>
                            ))}
                        </div>
                      )}

                    {section.button_text && (
                          <span
                            className={`mt-7 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold shadow-lg transition ${
                              section.type ===
                              "hero"
                                ? "bg-white text-[#13294b]"
                                : "bg-[#13294b] text-white"
                            }`}
                          >
                            {section.button_text}
                            <span>
                              →
                            </span>
                          </span>
                        )}

                      </div>

                    </div>
                  )
                )}

              {page.layout_json.sections.length ===
                0 && (
                <div className="flex min-h-[520px] flex-col items-center justify-center px-6 py-20 text-center">

                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#13294b]/[0.06]">
                    <Plus className="h-8 w-8 text-[#13294b]/40" />
                  </div>

                  <h2 className="text-2xl font-black text-[#13294b]">
                    Start Building Your Page
                  </h2>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                    Choose a section from the left panel to start creating your page.
                  </p>

                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {SECTION_OPTIONS.map(
                      (item) => (
                        <button
                          key={
                            item.type
                          }
                          type="button"
                          onClick={() =>
                            addSection(
                              item.type
                            )
                          }
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-[#13294b] shadow-sm transition hover:border-[#13294b] hover:bg-slate-50"
                        >
                          + {item.label}
                        </button>
                      )
                    )}
                  </div>

                </div>
              )}

            </div>

          </div>
        </section>

        {/* =======================================================
            RIGHT SIDEBAR
        ======================================================= */}

        <aside className="border-l border-slate-200 bg-white">

          <div className="sticky top-[76px] max-h-[calc(100vh-76px)] overflow-y-auto">

            {!activeSection ? (

              /* =================================================
                 PAGE SETTINGS
              ================================================= */

              <div className="p-5">

                <div className="mb-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                    Settings
                  </p>

                  <h2 className="mt-1 text-xl font-black text-[#13294b]">
                    Page Settings
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Manage page information and SEO.
                  </p>
                </div>

                <div className="space-y-5">

                  {/* TITLE */}

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Page Title
                    </label>

                    <input
                      value={
                        page.title
                      }
                      onChange={(e) =>
                        updatePage(
                          "title",
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-[#13294b] focus:ring-4 focus:ring-[#13294b]/10"
                    />
                  </div>

                  {/* SLUG */}

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                      URL Slug
                    </label>

                    <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-[#13294b] focus-within:ring-4 focus-within:ring-[#13294b]/10">

                      <span className="flex items-center bg-slate-50 px-3 text-sm text-slate-400">
                        /
                      </span>

                      <input
                        value={
                          page.slug
                        }
                        onChange={(
                          e
                        ) =>
                          updatePage(
                            "slug",
                            e.target.value
                          )
                        }
                        className="min-w-0 flex-1 px-3 py-3 text-sm outline-none"
                      />

                    </div>
                  </div>

                  {/* STATUS */}

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </label>

                    <select
                      value={
                        page.status
                      }
                      onChange={(e) =>
                        updatePage(
                          "status",
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#13294b] focus:ring-4 focus:ring-[#13294b]/10"
                    >
                      <option value="draft">
                        Draft
                      </option>

                      <option value="published">
                        Published
                      </option>
                    </select>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* SEO */}

                  <div>
                    <div className="mb-4">
                      <p className="text-sm font-bold text-[#13294b]">
                        SEO
                      </p>

                      <p className="mt-1 text-[11px] leading-4 text-slate-400">
                        Search-engine information for this page.
                      </p>
                    </div>

                    <div className="space-y-4">

                      <div>
                        <label className="mb-2 block text-xs font-bold text-slate-500">
                          SEO Title
                        </label>

                        <input
                          value={
                            page.seo_title ||
                            ""
                          }
                          onChange={(
                            e
                          ) =>
                            updatePage(
                              "seo_title",
                              e.target.value
                            )
                          }
                          placeholder="Page title for search engines"
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#13294b] focus:ring-4 focus:ring-[#13294b]/10"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-bold text-slate-500">
                          SEO Description
                        </label>

                        <textarea
                          value={
                            page.seo_description ||
                            ""
                          }
                          onChange={(
                            e
                          ) =>
                            updatePage(
                              "seo_description",
                              e.target.value
                            )
                          }
                          rows={5}
                          placeholder="Short description of this page..."
                          className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-[#13294b] focus:ring-4 focus:ring-[#13294b]/10"
                        />
                      </div>

                    </div>
                  </div>

                  {/* MOBILE SAVE */}

                  <button
                    type="button"
                    onClick={
                      savePage
                    }
                    disabled={
                      saving
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#13294b] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#13294b]/15 disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>

                </div>
              </div>

            ) : (

              /* =================================================
                 SECTION SETTINGS
              ================================================= */

              <div>

                {/* SECTION HEADER */}

                <div className="border-b border-slate-100 p-5">

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                        Editing Section
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#13294b] text-xs font-black text-white">
                          {getSectionIcon(
                            activeSection.type
                          )}
                        </span>

                        <h2 className="truncate text-lg font-black text-[#13294b]">
                          {getSectionLabel(
                            activeSection.type
                          )}
                        </h2>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedSection(
                          null
                        )
                      }
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-[#13294b]"
                    >
                      <X className="h-4 w-4" />
                    </button>

                  </div>

                </div>

                <div className="space-y-6 p-5">

                  {/* CONTENT */}

                  <div>
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                      Content
                    </p>

                    <div className="space-y-4">

                      {/* TITLE */}

                      <div>
                        <label className="mb-2 block text-xs font-bold text-slate-500">
                          Heading
                        </label>

                        <input
                          value={
                            activeSection.title
                          }
                          onChange={(
                            e
                          ) =>
                            updateSection(
                              activeSection.id,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="Section heading"
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#13294b] focus:ring-4 focus:ring-[#13294b]/10"
                        />
                      </div>

                      {/* CONTENT */}

                      <div>
                        <label className="mb-2 block text-xs font-bold text-slate-500">
                          Content
                        </label>

                        <textarea
                          value={
                            activeSection.content
                          }
                          onChange={(
                            e
                          ) =>
                            updateSection(
                              activeSection.id,
                              "content",
                              e.target.value
                            )
                          }
                          rows={6}
                          placeholder="Write your section content..."
                          className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#13294b] focus:ring-4 focus:ring-[#13294b]/10"
                        />
                      </div>

                    </div>
                  </div>

                  {/* IMAGE */}

                  <div>

                    <div className="mb-4">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                        Media
                      </p>

                      <p className="mt-1 text-[11px] leading-4 text-slate-400">
                        Upload an image or use an external image URL.
                      </p>
                    </div>

                    <div className="space-y-3">

                      {/* PREVIEW */}

                      {activeSection.image_url && (
                        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">

                          <img
                            src={
                              activeSection.image_url
                            }
                            alt=""
                            className="h-40 w-full object-cover"
                          />

                          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8">

                            <span className="max-w-[210px] truncate text-[10px] font-semibold text-white">
                              Image selected
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateSection(
                                  activeSection.id,
                                  "image_url",
                                  ""
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-slate-700 transition hover:bg-red-500 hover:text-white"
                              title="Remove image"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>

                          </div>
                        </div>
                      )}

                      {/* DROP ZONE */}

                      <div
                        onDragOver={(
                          event
                        ) => {
                          event.preventDefault();
                          setDragActive(
                            true
                          );
                        }}
                        onDragLeave={() =>
                          setDragActive(
                            false
                          )
                        }
                        onDrop={(
                          event
                        ) =>
                          handleDrop(
                            event,
                            activeSection.id
                          )
                        }
                        className={`rounded-2xl border-2 border-dashed p-5 text-center transition ${
                          dragActive
                            ? "border-[#13294b] bg-[#13294b]/5"
                            : "border-slate-200 bg-slate-50"
                        }`}
                      >

                        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#13294b] shadow-sm">
                          {uploading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Upload className="h-5 w-5" />
                          )}
                        </div>

                        <p className="text-xs font-bold text-[#13294b]">
                          {uploading
                            ? "Uploading..."
                            : "Drop an image here"}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400">
                          or choose a file from your computer
                        </p>

                        <button
                          type="button"
                          disabled={
                            uploading
                          }
                          onClick={() =>
                            fileInputRef.current?.click()
                          }
                          className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#13294b] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1c3c69] disabled:opacity-50"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          Choose Image
                        </button>

                        <input
                          ref={
                            fileInputRef
                          }
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/gif"
                          className="hidden"
                          onChange={(
                            event
                          ) =>
                            handleFileInput(
                              event,
                              activeSection.id
                            )
                          }
                        />

                        <p className="mt-3 text-[9px] text-slate-400">
                          PNG, JPG, WEBP or GIF · Max 15MB
                        </p>

                      </div>

                      {/* ERROR */}

                      {uploadError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[11px] leading-5 text-red-600">
                          {uploadError}
                        </div>
                      )}

                      {/* URL */}

                      <div>
                        <div className="my-3 flex items-center gap-3">
                          <div className="h-px flex-1 bg-slate-200" />

                          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                            OR
                          </span>

                          <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        <div className="relative">
                          <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                          <input
                            value={
                              activeSection.image_url ||
                              ""
                            }
                            onChange={(
                              e
                            ) =>
                              updateSection(
                                activeSection.id,
                                "image_url",
                                e.target.value
                              )
                            }
                            placeholder="Paste image URL..."
                            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-xs outline-none transition focus:border-[#13294b] focus:ring-4 focus:ring-[#13294b]/10"
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* BUTTON */}

                  <div>
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                      Button
                    </p>

                    <div className="space-y-3">

                      <div>
                        <label className="mb-2 block text-xs font-bold text-slate-500">
                          Button Text
                        </label>

                        <input
                          value={
                            activeSection.button_text ||
                            ""
                          }
                          onChange={(
                            e
                          ) =>
                            updateSection(
                              activeSection.id,
                              "button_text",
                              e.target.value
                            )
                          }
                          placeholder="Learn More"
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#13294b] focus:ring-4 focus:ring-[#13294b]/10"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-bold text-slate-500">
                          Button URL
                        </label>

                        <div className="relative">
                          <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                          <input
                            value={
                              activeSection.button_url ||
                              ""
                            }
                            onChange={(
                              e
                            ) =>
                              updateSection(
                                activeSection.id,
                                "button_url",
                                e.target.value
                              )
                            }
                            placeholder="/about"
                            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-[#13294b] focus:ring-4 focus:ring-[#13294b]/10"
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* DESIGN */}

                  <div>
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                      Design
                    </p>

                    <div className="space-y-4">

                      {/* COLORS */}

                      <div className="grid grid-cols-2 gap-3">

                        <div>
                          <label className="mb-2 block text-xs font-bold text-slate-500">
                            Background
                          </label>

                          <div className="flex items-center gap-2 rounded-xl border border-slate-200 p-2">
                            <input
                              type="color"
                              value={
                                activeSection.background_color ||
                                "#ffffff"
                              }
                              onChange={(
                                e
                              ) =>
                                updateSection(
                                  activeSection.id,
                                  "background_color",
                                  e.target.value
                                )
                              }
                              className="h-9 w-9 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                            />

                            <span className="truncate text-[10px] font-semibold text-slate-500">
                              {activeSection.background_color ||
                                "#ffffff"}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-bold text-slate-500">
                            Text Color
                          </label>

                          <div className="flex items-center gap-2 rounded-xl border border-slate-200 p-2">
                            <input
                              type="color"
                              value={
                                activeSection.text_color ||
                                "#13294b"
                              }
                              onChange={(
                                e
                              ) =>
                                updateSection(
                                  activeSection.id,
                                  "text_color",
                                  e.target.value
                                )
                              }
                              className="h-9 w-9 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                            />

                            <span className="truncate text-[10px] font-semibold text-slate-500">
                              {activeSection.text_color ||
                                "#13294b"}
                            </span>
                          </div>
                        </div>

                      </div>

                      {/* ALIGNMENT */}

                      <div>
                        <label className="mb-2 block text-xs font-bold text-slate-500">
                          Alignment
                        </label>

                        <div className="grid grid-cols-3 gap-2">

                          {[
                            "left",
                            "center",
                            "right",
                          ].map(
                            (
                              value
                            ) => (
                              <button
                                key={
                                  value
                                }
                                type="button"
                                onClick={() =>
                                  updateSection(
                                    activeSection.id,
                                    "alignment",
                                    value
                                  )
                                }
                                className={`rounded-xl border px-2 py-2.5 text-xs font-bold capitalize transition ${
                                  activeSection.alignment ===
                                  value
                                    ? "border-[#13294b] bg-[#13294b] text-white"
                                    : "border-slate-200 bg-white text-slate-500 hover:border-[#13294b]/30"
                                }`}
                              >
                                {value}
                              </button>
                            )
                          )}

                        </div>
                      </div>

                      {/* PADDING */}

                      <div>
                        <label className="mb-2 block text-xs font-bold text-slate-500">
                          Section Spacing
                        </label>

                        <select
                          value={
                            activeSection.padding ||
                            "60px"
                          }
                          onChange={(
                            e
                          ) =>
                            updateSection(
                              activeSection.id,
                              "padding",
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#13294b] focus:ring-4 focus:ring-[#13294b]/10"
                        >
                          <option value="30px">
                            Small — 30px
                          </option>

                          <option value="50px">
                            Medium — 50px
                          </option>

                          <option value="60px">
                            Large — 60px
                          </option>

                          <option value="80px">
                            Extra Large — 80px
                          </option>

                          <option value="120px">
                            Huge — 120px
                          </option>
                        </select>
                      </div>

                    </div>
                  </div>

                  {/* VISIBILITY */}

                  <div>
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                      Visibility
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        updateSection(
                          activeSection.id,
                          "visible",
                          activeSection.visible ===
                            false
                        )
                      }
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100"
                    >
                      <div className="flex items-center gap-3">

                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                            activeSection.visible !==
                            false
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-slate-200 text-slate-400"
                          }`}
                        >
                          {activeSection.visible !==
                          false ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </div>

                        <div className="text-left">
                          <p className="text-xs font-bold text-[#13294b]">
                            Section visible
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {activeSection.visible !==
                            false
                              ? "Visitors can see this section."
                              : "Hidden from visitors."}
                          </p>
                        </div>

                      </div>

                      <span
                        className={`relative h-6 w-11 rounded-full p-1 transition ${
                          activeSection.visible !==
                          false
                            ? "bg-emerald-500"
                            : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`block h-4 w-4 rounded-full bg-white shadow-sm transition ${
                            activeSection.visible !==
                            false
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        />
                      </span>

                    </button>
                  </div>

                  {/* SECTION ACTIONS */}

                  <div>
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                      Section Actions
                    </p>

                    <div className="grid grid-cols-2 gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          moveSection(
                            activeSection.id,
                            "up"
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-xs font-bold text-slate-600 transition hover:border-[#13294b]/30 hover:bg-slate-50 hover:text-[#13294b]"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                        Move Up
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          moveSection(
                            activeSection.id,
                            "down"
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-xs font-bold text-slate-600 transition hover:border-[#13294b]/30 hover:bg-slate-50 hover:text-[#13294b]"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                        Move Down
                      </button>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        duplicateSection(
                          activeSection.id
                        )
                      }
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-600 transition hover:border-[#13294b]/30 hover:bg-slate-50 hover:text-[#13294b]"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Duplicate Section
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteSection(
                          activeSection.id
                        )
                      }
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-bold text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete Section
                    </button>

                  </div>

                </div>
              </div>
            )}

          </div>
        </aside>

      </div>

      {/* MOBILE SAVE MESSAGE */}

      {message && (
        <div
          className={`fixed bottom-4 left-1/2 z-[100] -translate-x-1/2 rounded-2xl border px-4 py-3 text-xs font-bold shadow-2xl md:hidden ${
            messageType ===
            "error"
              ? "border-red-200 bg-red-50 text-red-600"
              : "border-emerald-200 bg-emerald-50 text-emerald-600"
          }`}
        >
          <div className="flex items-center gap-2">
            {messageType ===
            "success" ? (
              <Check className="h-4 w-4" />
            ) : null}

            {message}
          </div>
        </div>
      )}

    </main>
  );
}

