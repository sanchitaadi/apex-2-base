"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type NavigationItem = {
  id: string;
  parent_id: string | null;
  label: string;
  href: string;
  sort_order: number;
  is_active: boolean;
  open_in_new_tab: boolean;
  created_at?: string;
  updated_at?: string;
};

const emptyItem: NavigationItem = {
  id: "",
  parent_id: null,
  label: "",
  href: "#",
  sort_order: 0,
  is_active: true,
  open_in_new_tab: false,
};

export default function NavigationAdminPage() {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [editing, setEditing] =
    useState<NavigationItem | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [expanded, setExpanded] =
    useState<Set<string>>(new Set());

  /* =========================================================
     LOAD
  ========================================================= */

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    setError("");

    const { data, error: loadError } = await supabase
      .from("navigation_items")
      .select("*")
      .order("sort_order", {
        ascending: true,
      });

    if (loadError) {
      console.error(loadError);
      setError(loadError.message);
      setItems([]);
    } else {
      setItems((data || []) as NavigationItem[]);
    }

    setLoading(false);
  }

  /* =========================================================
     HELPERS
  ========================================================= */

  function getChildren(parentId: string | null) {
    return items
      .filter((item) => item.parent_id === parentId)
      .sort((a, b) => {
        if (a.sort_order !== b.sort_order) {
          return a.sort_order - b.sort_order;
        }

        return a.label.localeCompare(b.label);
      });
  }

  function getDepth(itemId: string): number {
    let depth = 0;
    let current = items.find(
      (item) => item.id === itemId
    );

    const visited = new Set<string>();

    while (
      current?.parent_id &&
      !visited.has(current.id)
    ) {
      visited.add(current.id);

      depth++;

      current = items.find(
        (item) => item.id === current?.parent_id
      );
    }

    return depth;
  }

  function getDescendantIds(
    itemId: string
  ): Set<string> {
    const descendants = new Set<string>();

    function walk(parentId: string) {
      const children = items.filter(
        (item) => item.parent_id === parentId
      );

      for (const child of children) {
        if (descendants.has(child.id)) continue;

        descendants.add(child.id);
        walk(child.id);
      }
    }

    walk(itemId);

    return descendants;
  }

  function getBranchIds(itemId: string): string[] {
    const result: string[] = [];

    function walk(parentId: string) {
      const children = items.filter(
        (item) => item.parent_id === parentId
      );

      for (const child of children) {
        result.push(child.id);
        walk(child.id);
      }
    }

    walk(itemId);

    return result;
  }

  function toggleExpanded(id: string) {
    setExpanded((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  /* =========================================================
     ADD / EDIT
  ========================================================= */

  function startNew(parentId: string | null = null) {
    const children = getChildren(parentId);

    setEditing({
      ...emptyItem,
      parent_id: parentId,
      sort_order: children.length,
    });

    setMessage("");
    setError("");

    if (parentId) {
      setExpanded((current) => {
        const next = new Set(current);
        next.add(parentId);
        return next;
      });
    }
  }

  function editItem(item: NavigationItem) {
    setEditing({
      ...item,
    });

    setMessage("");
    setError("");
  }

  function updateEditing(
    key: keyof NavigationItem,
    value: string | number | boolean | null
  ) {
    setEditing((current) => {
      if (!current) return null;

      return {
        ...current,
        [key]: value,
      };
    });
  }

  /* =========================================================
     SAVE
  ========================================================= */

  async function saveItem(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!editing) return;

    setMessage("");
    setError("");

    if (!editing.label.trim()) {
      setError("Menu label is required.");
      return;
    }

    if (!editing.href.trim()) {
      setError("Menu URL is required.");
      return;
    }

    if (
      editing.parent_id === editing.id
    ) {
      setError(
        "A menu item cannot be its own parent."
      );
      return;
    }

    if (editing.id) {
      const descendants =
        getDescendantIds(editing.id);

      if (
        editing.parent_id &&
        descendants.has(editing.parent_id)
      ) {
        setError(
          "A menu item cannot be moved inside its own submenu."
        );
        return;
      }
    }

    setSaving(true);

    try {
      const payload = {
        parent_id: editing.parent_id,
        label: editing.label.trim(),
        href: editing.href.trim(),
        sort_order: Number(editing.sort_order),
        is_active: editing.is_active,
        open_in_new_tab:
          editing.open_in_new_tab,
        updated_at: new Date().toISOString(),
      };

      if (editing.id) {
        const { error: updateError } =
          await supabase
            .from("navigation_items")
            .update(payload)
            .eq("id", editing.id);

        if (updateError) {
          throw updateError;
        }

        setMessage(
          "Navigation item updated successfully."
        );
      } else {
        const { error: insertError } =
          await supabase
            .from("navigation_items")
            .insert(payload);

        if (insertError) {
          throw insertError;
        }

        setMessage(
          "Navigation item created successfully."
        );
      }

      await loadItems();

      setEditing(null);
    } catch (saveError: any) {
      console.error(saveError);

      setError(
        saveError?.message ||
          "Could not save navigation item."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =========================================================
     DELETE BRANCH
  ========================================================= */

  async function deleteItem(
    item: NavigationItem
  ) {
    const descendantIds =
      getBranchIds(item.id);

    const count = descendantIds.length;

    const message =
      count > 0
        ? `Delete "${item.label}" and all ${count} submenu item${
            count === 1 ? "" : "s"
          } under it?`
        : `Delete "${item.label}"?`;

    if (!window.confirm(message)) {
      return;
    }

    setError("");
    setMessage("");

    try {
      /*
       * Delete deepest children first.
       * This avoids foreign-key problems when parent_id
       * references another navigation item.
       */

      const allToDelete = [
        ...descendantIds,
        item.id,
      ];

      allToDelete.sort(
        (a, b) =>
          getDepth(b) - getDepth(a)
      );

      for (const id of allToDelete) {
        const { error: deleteError } =
          await supabase
            .from("navigation_items")
            .delete()
            .eq("id", id);

        if (deleteError) {
          throw deleteError;
        }
      }

      setMessage(
        `"${item.label}" and its submenu branch were deleted.`
      );

      await loadItems();
    } catch (deleteError: any) {
      console.error(deleteError);

      setError(
        deleteError?.message ||
          "Could not delete navigation item."
      );
    }
  }

  /* =========================================================
     ENABLE / DISABLE
  ========================================================= */

  async function toggleItem(
    item: NavigationItem
  ) {
    setError("");

    const { error: toggleError } =
      await supabase
        .from("navigation_items")
        .update({
          is_active: !item.is_active,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", item.id);

    if (toggleError) {
      setError(toggleError.message);
      return;
    }

    await loadItems();
  }

  /* =========================================================
     MOVE ITEM
  ========================================================= */

  async function moveItem(
    item: NavigationItem,
    direction: "up" | "down"
  ) {
    const siblings = getChildren(
      item.parent_id
    );

    const index = siblings.findIndex(
      (entry) => entry.id === item.id
    );

    if (index === -1) return;

    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= siblings.length
    ) {
      return;
    }

    const reordered = [...siblings];

    const [moved] =
      reordered.splice(index, 1);

    reordered.splice(
      targetIndex,
      0,
      moved
    );

    try {
      await Promise.all(
        reordered.map((entry, newIndex) =>
          supabase
            .from("navigation_items")
            .update({
              sort_order: newIndex,
              updated_at:
                new Date().toISOString(),
            })
            .eq("id", entry.id)
        )
      );

      await loadItems();
    } catch (moveError: any) {
      console.error(moveError);

      setError(
        moveError?.message ||
          "Could not reorder navigation."
      );
    }
  }

  /* =========================================================
     ROOT ITEMS
  ========================================================= */

  const rootItems = useMemo(
    () => getChildren(null),
    [items]
  );

  /* =========================================================
     PARENT SELECT OPTIONS
     Unlimited depth.
  ========================================================= */

  const parentOptions = useMemo(() => {
    if (!editing) return [];

    const blocked = new Set<string>();

    if (editing.id) {
      blocked.add(editing.id);

      const descendants =
        getDescendantIds(editing.id);

      descendants.forEach((id) =>
        blocked.add(id)
      );
    }

    const result: Array<{
      item: NavigationItem;
      depth: number;
    }> = [];

    function walk(
      parentId: string | null,
      depth: number
    ) {
      const children =
        items
          .filter(
            (item) =>
              item.parent_id === parentId
          )
          .sort(
            (a, b) =>
              a.sort_order -
              b.sort_order
          );

      for (const item of children) {
        if (!blocked.has(item.id)) {
          result.push({
            item,
            depth,
          });

          walk(item.id, depth + 1);
        }
      }
    }

    walk(null, 0);

    return result;
  }, [editing, items]);

  /* =========================================================
     RECURSIVE TREE ITEM
  ========================================================= */

  function renderItem(
    item: NavigationItem,
    depth: number,
    siblingIndex: number,
    siblingCount: number
  ): React.ReactNode {
    const children = getChildren(item.id);

    const isExpanded =
      expanded.has(item.id);

    return (
      <div
        key={item.id}
        className="relative"
      >
        <div
          className={`
            group relative overflow-hidden
            border-b border-white/[0.055]
            transition
            ${
              depth === 0
                ? "bg-white/[0.035]"
                : "bg-black/[0.08]"
            }
          `}
        >
          {/* DEPTH LINE */}

          {depth > 0 && (
            <div
              className="absolute bottom-0 top-0 w-px bg-white/[0.07]"
              style={{
                left: `${28 + depth * 30}px`,
              }}
            />
          )}

          <div
            className="flex flex-wrap items-center gap-3 px-4 py-4 md:px-5"
            style={{
              paddingLeft:
                `${20 + depth * 30}px`,
            }}
          >
            {/* TREE CONNECTOR */}

            {depth > 0 && (
              <div
                className="absolute h-px bg-white/[0.08]"
                style={{
                  left:
                    `${28 + (depth - 1) * 30}px`,
                  width: "20px",
                }}
              />
            )}

            {/* EXPAND BUTTON */}

            <button
              type="button"
              onClick={() =>
                children.length > 0 &&
                toggleExpanded(item.id)
              }
              disabled={
                children.length === 0
              }
              className={`
                grid h-8 w-8 shrink-0
                place-items-center
                rounded-lg
                border
                border-white/10
                transition
                ${
                  children.length > 0
                    ? "text-white/55 hover:bg-white/10 hover:text-white"
                    : "cursor-default text-white/10"
                }
              `}
              title={
                children.length > 0
                  ? isExpanded
                    ? "Collapse submenu"
                    : "Expand submenu"
                  : "No submenu"
              }
            >
              {children.length > 0 ? (
                isExpanded ? (
                  <ChevronDown size={15} />
                ) : (
                  <ChevronRight size={15} />
                )
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
              )}
            </button>

            {/* LEVEL */}

            <div
              className={`
                grid h-8 min-w-8 shrink-0
                place-items-center
                rounded-lg
                px-2
                text-[9px]
                font-semibold
                ${
                  depth === 0
                    ? "bg-white/[0.07] text-white/45"
                    : "bg-white/[0.04] text-white/25"
                }
              `}
            >
              L{depth + 1}
            </div>

            {/* INFO */}

            <div className="min-w-[180px] flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={`
                    ${
                      depth === 0
                        ? "text-sm font-semibold"
                        : "text-sm font-medium"
                    }
                    text-white/85
                  `}
                >
                  {item.label}
                </h3>

                {!item.is_active && (
                  <span className="rounded-full bg-red-400/10 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.15em] text-red-200/80">
                    Hidden
                  </span>
                )}

                {item.open_in_new_tab && (
                  <ExternalLink
                    size={11}
                    className="text-white/25"
                  />
                )}

                {children.length > 0 && (
                  <span className="rounded-full bg-[#9BCBFF]/10 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#9BCBFF]/70">
                    {children.length}{" "}
                    {children.length === 1
                      ? "submenu"
                      : "submenus"}
                  </span>
                )}
              </div>

              <p className="mt-1 truncate text-[10px] text-white/25">
                {item.href}
              </p>
            </div>

            {/* REORDER */}

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  moveItem(item, "up")
                }
                disabled={siblingIndex === 0}
                className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-white/35 transition hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-15"
                title="Move up"
              >
                <ArrowUp size={13} />
              </button>

              <button
                type="button"
                onClick={() =>
                  moveItem(item, "down")
                }
                disabled={
                  siblingIndex ===
                  siblingCount - 1
                }
                className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-white/35 transition hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-15"
                title="Move down"
              >
                <ArrowDown size={13} />
              </button>
            </div>

            {/* ADD CHILD */}

            <button
              type="button"
              onClick={() =>
                startNew(item.id)
              }
              className="
                inline-flex items-center gap-1.5
                rounded-lg
                border border-white/10
                px-3 py-2
                text-[10px]
                font-medium
                text-white/50
                transition
                hover:bg-white/10
                hover:text-white
              "
              title={`Add submenu under ${item.label}`}
            >
              <Plus size={12} />
              Submenu
            </button>

            {/* EDIT */}

            <button
              type="button"
              onClick={() =>
                editItem(item)
              }
              className="
                grid h-8 w-8 place-items-center
                rounded-lg
                border border-white/10
                text-white/40
                transition
                hover:bg-white/10
                hover:text-white
              "
              title="Edit"
            >
              <Pencil size={13} />
            </button>

            {/* ENABLE */}

            <button
              type="button"
              onClick={() =>
                toggleItem(item)
              }
              className="
                rounded-lg
                border border-white/10
                px-3 py-2
                text-[10px]
                text-white/40
                transition
                hover:bg-white/10
                hover:text-white
              "
            >
              {item.is_active
                ? "Disable"
                : "Enable"}
            </button>

            {/* DELETE */}

            <button
              type="button"
              onClick={() =>
                deleteItem(item)
              }
              className="
                grid h-8 w-8 place-items-center
                rounded-lg
                border border-red-400/10
                text-red-200/40
                transition
                hover:bg-red-400/10
                hover:text-red-200
              "
              title="Delete branch"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* CHILDREN */}

        {children.length > 0 &&
          isExpanded && (
            <div className="relative">
              {children.map(
                (child, index) =>
                  renderItem(
                    child,
                    depth + 1,
                    index,
                    children.length
                  )
              )}
            </div>
          )}
      </div>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#071A38] text-white">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="sticky top-0 z-30 border-b border-white/10 bg-[#0B2146]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-5 md:px-8">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#9BCBFF]/50">
              Apex CMS
            </p>

            <h1 className="mt-1 text-xl font-semibold md:text-2xl">
              Navigation Management
            </h1>

            <p className="mt-1 text-xs text-white/35">
              Build unlimited nested navigation menus.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              startNew(null)
            }
            className="
              inline-flex shrink-0
              items-center gap-2
              rounded-xl
              bg-[#F5F0E6]
              px-4 py-3
              text-xs font-semibold
              text-[#102A56]
              transition
              hover:bg-white
              md:px-5
            "
          >
            <Plus size={15} />
            <span className="hidden sm:inline">
              Add menu item
            </span>
            <span className="sm:hidden">
              Add
            </span>
          </button>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="mx-auto max-w-[1600px] px-5 py-8 md:px-8">
        {/* MESSAGES */}

        {message && (
          <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-xs text-emerald-200">
            <span>{message}</span>

            <button
              type="button"
              onClick={() =>
                setMessage("")
              }
              className="text-emerald-200/50 hover:text-emerald-200"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs text-red-200">
            <span>{error}</span>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
              className="text-red-200/50 hover:text-red-200"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* STATS */}

        {!loading && (
          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                Total Items
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {items.length}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                Main Menu
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {rootItems.length}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                Active Items
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {
                  items.filter(
                    (item) =>
                      item.is_active
                  ).length
                }
              </p>
            </div>
          </div>
        )}

        {/* TREE */}

        <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0B2146] shadow-2xl">
          <div className="border-b border-white/10 bg-white/[0.025] px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold">
                  Website Navigation
                </h2>

                <p className="mt-1 text-[10px] text-white/30">
                  Add submenus at any level. There is no nesting limit.
                </p>
              </div>

              {items.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const allWithChildren =
                      items
                        .filter(
                          (item) =>
                            items.some(
                              (child) =>
                                child.parent_id ===
                                item.id
                            )
                        )
                        .map(
                          (item) => item.id
                        );

                    setExpanded(
                      new Set(
                        allWithChildren
                      )
                    );
                  }}
                  className="
                    hidden rounded-lg
                    border border-white/10
                    px-3 py-2
                    text-[10px]
                    text-white/40
                    transition
                    hover:bg-white/10
                    hover:text-white
                    sm:block
                  "
                >
                  Expand all
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[450px] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2
                  size={28}
                  className="animate-spin text-white/30"
                />

                <p className="text-xs text-white/25">
                  Loading navigation...
                </p>
              </div>
            </div>
          ) : rootItems.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center px-6 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/[0.04]">
                <Plus
                  size={25}
                  className="text-white/30"
                />
              </div>

              <h3 className="mt-5 text-base font-semibold">
                No navigation items yet
              </h3>

              <p className="mt-2 max-w-sm text-xs leading-6 text-white/30">
                Start building your website navigation
                by adding your first menu item.
              </p>

              <button
                type="button"
                onClick={() =>
                  startNew(null)
                }
                className="
                  mt-5 inline-flex
                  items-center gap-2
                  rounded-xl
                  bg-[#F5F0E6]
                  px-5 py-3
                  text-xs font-semibold
                  text-[#102A56]
                  hover:bg-white
                "
              >
                <Plus size={14} />
                Add first menu item
              </button>
            </div>
          ) : (
            <div>
              {rootItems.map(
                (item, index) =>
                  renderItem(
                    item,
                    0,
                    index,
                    rootItems.length
                  )
              )}
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          EDIT MODAL
      ====================================================== */}

      {editing && (
        <div className="fixed inset-0 z-[500] overflow-y-auto bg-black/70 p-4 backdrop-blur-md md:p-8">
          <div className="mx-auto max-w-2xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0B2146] shadow-2xl">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 md:px-7">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#9BCBFF]/45">
                  Apex CMS
                </p>

                <h2 className="mt-1 text-lg font-semibold md:text-xl">
                  {editing.id
                    ? "Edit navigation item"
                    : "Add navigation item"}
                </h2>

                <p className="mt-1 text-[10px] text-white/30">
                  {editing.parent_id
                    ? "This item will appear inside a submenu."
                    : "This item will appear in the main navigation."}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditing(null)
                }
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/40 transition hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={saveItem}
              className="space-y-5 p-5 md:p-7"
            >
              {/* LABEL */}

              <div>
                <label className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  Menu label
                </label>

                <input
                  value={editing.label}
                  onChange={(event) =>
                    updateEditing(
                      "label",
                      event.target.value
                    )
                  }
                  placeholder="About"
                  className="
                    mt-2.5 w-full
                    rounded-xl
                    border border-white/10
                    bg-white/[0.035]
                    px-4 py-3.5
                    text-sm text-white
                    outline-none
                    placeholder:text-white/20
                    focus:border-[#9BCBFF]/40
                    focus:bg-white/[0.05]
                  "
                />
              </div>

              {/* URL */}

              <div>
                <label className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  URL
                </label>

                <input
                  value={editing.href}
                  onChange={(event) =>
                    updateEditing(
                      "href",
                      event.target.value
                    )
                  }
                  placeholder="/about"
                  className="
                    mt-2.5 w-full
                    rounded-xl
                    border border-white/10
                    bg-white/[0.035]
                    px-4 py-3.5
                    text-sm text-white
                    outline-none
                    placeholder:text-white/20
                    focus:border-[#9BCBFF]/40
                    focus:bg-white/[0.05]
                  "
                />

                <p className="mt-2 text-[10px] text-white/20">
                  Use a website path like /about or an
                  external URL like https://example.com
                </p>
              </div>

              {/* PARENT */}

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
                    Parent menu
                  </label>

                  <span className="text-[9px] text-[#9BCBFF]/40">
                    Unlimited levels
                  </span>
                </div>

                <select
                  value={
                    editing.parent_id || ""
                  }
                  onChange={(event) => {
                    const parentId =
                      event.target.value ||
                      null;

                    updateEditing(
                      "parent_id",
                      parentId
                    );

                    if (parentId) {
                      const children =
                        getChildren(
                          parentId
                        );

                      updateEditing(
                        "sort_order",
                        children.length
                      );

                      setExpanded(
                        (current) => {
                          const next =
                            new Set(
                              current
                            );

                          next.add(
                            parentId
                          );

                          return next;
                        }
                      );
                    }
                  }}
                  className="
                    mt-2.5 w-full
                    rounded-xl
                    border border-white/10
                    bg-[#0B2146]
                    px-4 py-3.5
                    text-sm text-white
                    outline-none
                    focus:border-[#9BCBFF]/40
                  "
                >
                  <option value="">
                    Main navigation
                  </option>

                  {parentOptions.map(
                    ({ item, depth }) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {"— ".repeat(depth)}
                        {depth > 0
                          ? " "
                          : ""}
                        {item.label}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* ORDER */}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
                    Display order
                  </label>

                  <input
                    type="number"
                    min={0}
                    value={
                      editing.sort_order
                    }
                    onChange={(event) =>
                      updateEditing(
                        "sort_order",
                        Number(
                          event.target.value
                        )
                      )
                    }
                    className="
                      mt-2.5 w-full
                      rounded-xl
                      border border-white/10
                      bg-white/[0.035]
                      px-4 py-3.5
                      text-sm text-white
                      outline-none
                      focus:border-[#9BCBFF]/40
                    "
                  />
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                    Current level
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    Level{" "}
                    {editing.parent_id
                      ? getDepth(
                          editing.parent_id
                        ) + 2
                      : 1}
                  </p>
                </div>
              </div>

              {/* OPTIONS */}

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    updateEditing(
                      "is_active",
                      !editing.is_active
                    )
                  }
                  className="
                    flex items-center
                    justify-between
                    rounded-xl
                    border border-white/10
                    bg-white/[0.025]
                    px-4 py-3.5
                    text-sm
                    transition
                    hover:bg-white/[0.05]
                  "
                >
                  <div className="text-left">
                    <p className="text-xs font-medium text-white/70">
                      Visible
                    </p>

                    <p className="mt-1 text-[9px] text-white/25">
                      Show in website navigation
                    </p>
                  </div>

                  <span
                    className={`
                      relative h-5 w-9 rounded-full
                      transition
                      ${
                        editing.is_active
                          ? "bg-emerald-400/70"
                          : "bg-white/10"
                      }
                    `}
                  >
                    <span
                      className={`
                        absolute top-1 h-3 w-3 rounded-full
                        bg-white
                        transition-all
                        ${
                          editing.is_active
                            ? "left-5"
                            : "left-1"
                        }
                      `}
                    />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateEditing(
                      "open_in_new_tab",
                      !editing.open_in_new_tab
                    )
                  }
                  className="
                    flex items-center
                    justify-between
                    rounded-xl
                    border border-white/10
                    bg-white/[0.025]
                    px-4 py-3.5
                    text-sm
                    transition
                    hover:bg-white/[0.05]
                  "
                >
                  <div className="text-left">
                    <p className="text-xs font-medium text-white/70">
                      Open in new tab
                    </p>

                    <p className="mt-1 text-[9px] text-white/25">
                      Useful for external links
                    </p>
                  </div>

                  <span
                    className={`
                      relative h-5 w-9 rounded-full
                      transition
                      ${
                        editing.open_in_new_tab
                          ? "bg-[#9BCBFF]/70"
                          : "bg-white/10"
                      }
                    `}
                  >
                    <span
                      className={`
                        absolute top-1 h-3 w-3 rounded-full
                        bg-white
                        transition-all
                        ${
                          editing.open_in_new_tab
                            ? "left-5"
                            : "left-1"
                        }
                      `}
                    />
                  </span>
                </button>
              </div>

              {/* PREVIEW */}

              <div className="rounded-xl border border-[#9BCBFF]/10 bg-[#9BCBFF]/[0.035] p-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9BCBFF]/40">
                  Structure preview
                </p>

                <div className="mt-3 flex items-center gap-2 text-xs text-white/55">
                  <span>
                    {editing.parent_id
                      ? "Parent"
                      : "Main navigation"}
                  </span>

                  <ChevronRight
                    size={12}
                    className="text-white/20"
                  />

                  <span className="font-medium text-white/80">
                    {editing.label ||
                      "New item"}
                  </span>
                </div>
              </div>

              {/* ACTIONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setEditing(null)
                  }
                  className="
                    rounded-xl
                    border border-white/10
                    px-5 py-3
                    text-sm
                    text-white/50
                    transition
                    hover:bg-white/10
                    hover:text-white
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#F5F0E6]
                    px-6 py-3
                    text-sm font-semibold
                    text-[#102A56]
                    transition
                    hover:bg-white
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {saving ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={15} />
                  )}

                  {saving
                    ? "Saving..."
                    : editing.id
                    ? "Save changes"
                    : "Create item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}