"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
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

  useEffect(() => {
    void loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    setError("");

    const { data, error: loadError } = await supabase
      .from("navigation_items")
      .select(
        "id,parent_id,label,href,sort_order,is_active,open_in_new_tab,created_at,updated_at"
      )
      .order("sort_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      });

    if (loadError) {
      console.error(loadError);
      setError(loadError.message);
      setItems([]);
    } else {
      setItems(
        (data || []) as NavigationItem[]
      );
    }

    setLoading(false);
  }

  function startNew(
    parentId: string | null = null
  ) {
    const children = items.filter(
      (item) =>
        item.parent_id === parentId
    );

    setEditing({
      ...emptyItem,
      parent_id: parentId,
      sort_order: children.length,
    });

    setMessage("");
    setError("");
  }

  function editItem(
    item: NavigationItem
  ) {
    setEditing({
      ...item,
    });

    setMessage("");
    setError("");
  }

  function updateEditing(
    key: keyof NavigationItem,
    value:
      | string
      | number
      | boolean
      | null
  ) {
    setEditing((current) => {
      if (!current) return null;

      return {
        ...current,
        [key]: value,
      };
    });
  }

  async function saveItem(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!editing) return;

    if (!editing.label.trim()) {
      setError("Menu label is required.");
      return;
    }

    if (!editing.href.trim()) {
      setError("Menu URL is required.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    const payload = {
      parent_id: editing.parent_id,
      label: editing.label.trim(),
      href: editing.href.trim(),
      sort_order:
        Number(editing.sort_order) || 0,
      is_active: editing.is_active,
      open_in_new_tab:
        editing.open_in_new_tab,
      updated_at:
        new Date().toISOString(),
    };

    try {
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
    } catch (saveError) {
      console.error(saveError);

      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save navigation item."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(
    item: NavigationItem
  ) {
    const children = items.filter(
      (entry) =>
        entry.parent_id === item.id
    );

    const confirmationText =
      children.length > 0
        ? `Delete "${item.label}" and its ${children.length} submenu item${
            children.length === 1
              ? ""
              : "s"
          }?`
        : `Delete "${item.label}"?`;

    if (
      !window.confirm(
        confirmationText
      )
    ) {
      return;
    }

    setError("");
    setMessage("");

    try {
      /*
       * Delete children first.
       * This prevents foreign-key errors if
       * navigation_items.parent_id references
       * the parent row.
       */
      if (children.length > 0) {
        const { error: childDeleteError } =
          await supabase
            .from("navigation_items")
            .delete()
            .eq("parent_id", item.id);

        if (childDeleteError) {
          throw childDeleteError;
        }
      }

      const { error: deleteError } =
        await supabase
          .from("navigation_items")
          .delete()
          .eq("id", item.id);

      if (deleteError) {
        throw deleteError;
      }

      setMessage(
        "Navigation item deleted successfully."
      );

      await loadItems();
    } catch (deleteError) {
      console.error(deleteError);

      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete navigation item."
      );
    }
  }

  async function toggleItem(
    item: NavigationItem
  ) {
    setError("");
    setMessage("");

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

    setMessage(
      `${item.label} is now ${
        !item.is_active
          ? "enabled"
          : "disabled"
      }.`
    );

    await loadItems();
  }

  async function moveItem(
    item: NavigationItem,
    direction: "up" | "down"
  ) {
    const siblings = items
      .filter(
        (entry) =>
          entry.parent_id ===
          item.parent_id
      )
      .sort(
        (a, b) =>
          a.sort_order - b.sort_order
      );

    const index =
      siblings.findIndex(
        (entry) =>
          entry.id === item.id
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

    const target =
      siblings[targetIndex];

    if (!target) return;

    const currentOrder =
      item.sort_order;

    const targetOrder =
      target.sort_order;

    const firstUpdate =
      await supabase
        .from("navigation_items")
        .update({
          sort_order: targetOrder,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", item.id);

    if (firstUpdate.error) {
      setError(
        firstUpdate.error.message
      );
      return;
    }

    const secondUpdate =
      await supabase
        .from("navigation_items")
        .update({
          sort_order: currentOrder,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", target.id);

    if (secondUpdate.error) {
      setError(
        secondUpdate.error.message
      );
      await loadItems();
      return;
    }

    setMessage(
      "Navigation order updated."
    );

    await loadItems();
  }

  const rootItems = items
    .filter(
      (item) =>
        !item.parent_id
    )
    .sort(
      (a, b) =>
        a.sort_order - b.sort_order
    );

  function getChildren(
    parentId: string
  ) {
    return items
      .filter(
        (item) =>
          item.parent_id ===
          parentId
      )
      .sort(
        (a, b) =>
          a.sort_order - b.sort_order
      );
  }

  return (
    <main className="min-h-screen bg-[#071A38] text-white">

      {/* =================================================
          HEADER
      ================================================== */}

      <div className="border-b border-white/10 bg-[#0B2146]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-6 px-6 py-6 md:px-10">

          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/35">
              Apex CMS
            </p>

            <h1 className="mt-2 text-2xl font-semibold">
              Navigation Management
            </h1>

            <p className="mt-1 text-xs text-white/30">
              Manage menus, dropdowns,
              links and display order.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              startNew(null)
            }
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[#F5F0E6]
              px-5
              py-3
              text-sm
              font-semibold
              text-[#102A56]
              transition
              hover:bg-white
            "
          >
            <Plus size={16} />
            Add menu item
          </button>

        </div>
      </div>

      {/* =================================================
          CONTENT
      ================================================== */}

      <div className="mx-auto max-w-[1500px] px-6 py-10 md:px-10">

        {message && (
          <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Loader2
              size={28}
              className="animate-spin text-white/40"
            />
          </div>
        ) : rootItems.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-white/[0.025] p-12 text-center">
            <p className="text-lg font-semibold">
              No navigation items found.
            </p>

            <p className="mt-2 text-sm text-white/35">
              Add your first main menu item.
            </p>
          </div>
        ) : (
          <div className="space-y-4">

            {rootItems.map(
              (item, index) => {
                const children =
                  getChildren(
                    item.id
                  );

                return (
                  <div
                    key={item.id}
                    className="
                      overflow-hidden
                      rounded-[1.75rem]
                      border
                      border-white/10
                      bg-white/[0.035]
                    "
                  >

                    {/* =================================
                        PARENT
                    ================================== */}

                    <div className="flex flex-wrap items-center gap-4 p-5 md:p-6">

                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-sm text-white/45">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">

                          <h2 className="text-base font-semibold">
                            {item.label}
                          </h2>

                          {!item.is_active && (
                            <span className="rounded-full bg-red-400/10 px-2 py-1 text-[8px] uppercase tracking-[0.15em] text-red-200">
                              Hidden
                            </span>
                          )}

                          {children.length > 0 && (
                            <span className="rounded-full bg-blue-300/10 px-2 py-1 text-[8px] uppercase tracking-[0.15em] text-blue-200">
                              {children.length} submenu
                              {children.length === 1
                                ? ""
                                : "s"}
                            </span>
                          )}

                        </div>

                        <p className="mt-1 break-all text-xs text-white/30">
                          {item.href}
                        </p>
                      </div>

                      {/* ORDER */}

                      <div className="flex items-center gap-1">

                        <button
                          type="button"
                          onClick={() =>
                            moveItem(
                              item,
                              "up"
                            )
                          }
                          disabled={
                            index ===
                            0
                          }
                          aria-label={`Move ${item.label} up`}
                          className="
                            grid
                            h-9
                            w-9
                            place-items-center
                            rounded-xl
                            border
                            border-white/10
                            text-white/40
                            transition
                            hover:bg-white/10
                            hover:text-white
                            disabled:opacity-20
                          "
                        >
                          <ArrowUp
                            size={14}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            moveItem(
                              item,
                              "down"
                            )
                          }
                          disabled={
                            index ===
                            rootItems.length -
                              1
                          }
                          aria-label={`Move ${item.label} down`}
                          className="
                            grid
                            h-9
                            w-9
                            place-items-center
                            rounded-xl
                            border
                            border-white/10
                            text-white/40
                            transition
                            hover:bg-white/10
                            hover:text-white
                            disabled:opacity-20
                          "
                        >
                          <ArrowDown
                            size={14}
                          />
                        </button>

                      </div>

                      {/* SUBMENU */}

                      <button
                        type="button"
                        onClick={() =>
                          startNew(
                            item.id
                          )
                        }
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-xl
                          border
                          border-white/10
                          px-3
                          py-2
                          text-xs
                          text-white/60
                          transition
                          hover:bg-white/10
                          hover:text-white
                        "
                      >
                        <Plus size={13} />
                        Submenu
                      </button>

                      {/* EDIT */}

                      <button
                        type="button"
                        onClick={() =>
                          editItem(item)
                        }
                        aria-label={`Edit ${item.label}`}
                        className="
                          grid
                          h-9
                          w-9
                          place-items-center
                          rounded-xl
                          border
                          border-white/10
                          text-white/50
                          transition
                          hover:bg-white/10
                          hover:text-white
                        "
                      >
                        <Pencil
                          size={14}
                        />
                      </button>

                      {/* TOGGLE */}

                      <button
                        type="button"
                        onClick={() =>
                          toggleItem(item)
                        }
                        className="
                          rounded-xl
                          border
                          border-white/10
                          px-3
                          py-2
                          text-xs
                          text-white/50
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
                        aria-label={`Delete ${item.label}`}
                        className="
                          grid
                          h-9
                          w-9
                          place-items-center
                          rounded-xl
                          border
                          border-red-400/10
                          text-red-200/50
                          transition
                          hover:bg-red-400/10
                          hover:text-red-200
                        "
                      >
                        <Trash2
                          size={14}
                        />
                      </button>

                    </div>

                    {/* =================================
                        CHILDREN
                    ================================== */}

                    {children.length > 0 && (
                      <div className="border-t border-white/10 bg-black/10 px-5 py-3 md:px-6">

                        {children.map(
                          (
                            child
                          ) => (
                            <div
                              key={
                                child.id
                              }
                              className="
                                flex
                                flex-wrap
                                items-center
                                gap-3
                                border-b
                                border-white/5
                                py-4
                                last:border-0
                              "
                            >

                              <div className="h-px w-5 bg-white/15" />

                              <div className="min-w-0 flex-1">

                                <div className="flex items-center gap-2">

                                  <span
                                    className={`text-sm ${
                                      child.is_active
                                        ? "text-white/75"
                                        : "text-white/30"
                                    }`}
                                  >
                                    {child.label}
                                  </span>

                                  {!child.is_active && (
                                    <span className="rounded-full bg-red-400/10 px-2 py-1 text-[8px] uppercase tracking-[0.12em] text-red-200/80">
                                      Hidden
                                    </span>
                                  )}

                                  {child.open_in_new_tab && (
                                    <ExternalLink
                                      size={11}
                                      className="text-white/25"
                                    />
                                  )}

                                </div>

                                <p className="mt-1 break-all text-[10px] text-white/25">
                                  {child.href}
                                </p>

                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  editItem(
                                    child
                                  )
                                }
                                aria-label={`Edit ${child.label}`}
                                className="
                                  grid
                                  h-8
                                  w-8
                                  place-items-center
                                  rounded-lg
                                  border
                                  border-white/10
                                  text-white/40
                                  transition
                                  hover:bg-white/10
                                  hover:text-white
                                "
                              >
                                <Pencil
                                  size={13}
                                />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  toggleItem(
                                    child
                                  )
                                }
                                className="
                                  rounded-lg
                                  border
                                  border-white/10
                                  px-3
                                  py-2
                                  text-[10px]
                                  text-white/40
                                  transition
                                  hover:bg-white/10
                                  hover:text-white
                                "
                              >
                                {child.is_active
                                  ? "Disable"
                                  : "Enable"}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  deleteItem(
                                    child
                                  )
                                }
                                aria-label={`Delete ${child.label}`}
                                className="
                                  grid
                                  h-8
                                  w-8
                                  place-items-center
                                  rounded-lg
                                  border
                                  border-red-400/10
                                  text-red-200/40
                                  transition
                                  hover:bg-red-400/10
                                  hover:text-red-200
                                "
                              >
                                <Trash2
                                  size={13}
                                />
                              </button>

                            </div>
                          )
                        )}

                      </div>
                    )}

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>

      {/* =====================================================
          EDIT MODAL
      ====================================================== */}

      {editing && (
        <div
          className="
            fixed
            inset-0
            z-[500]
            overflow-y-auto
            bg-black/70
            p-4
            backdrop-blur-sm
            md:p-8
          "
        >
          <div
            className="
              mx-auto
              max-w-2xl
              overflow-hidden
              rounded-[2rem]
              border
              border-white/10
              bg-[#0B2146]
              shadow-2xl
            "
          >

            {/* MODAL HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-white/10
                px-6
                py-5
              "
            >

              <div>
                <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                  Apex CMS
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  {editing.id
                    ? "Edit navigation item"
                    : "Add navigation item"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditing(null)
                }
                aria-label="Close editor"
                className="
                  grid
                  h-10
                  w-10
                  place-items-center
                  rounded-full
                  border
                  border-white/10
                  text-white/45
                  transition
                  hover:bg-white/10
                  hover:text-white
                "
              >
                <X size={17} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={saveItem}
              className="space-y-6 p-6 md:p-8"
            >

              {/* LABEL */}

              <div>
                <label
                  htmlFor="navigation-label"
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.22em]
                    text-white/35
                  "
                >
                  Menu label
                </label>

                <input
                  id="navigation-label"
                  value={editing.label}
                  onChange={(event) =>
                    updateEditing(
                      "label",
                      event.target.value
                    )
                  }
                  placeholder="About"
                  className="
                    mt-3
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.035]
                    px-4
                    py-3.5
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-white/20
                    focus:border-white/25
                  "
                />
              </div>

              {/* URL */}

              <div>
                <label
                  htmlFor="navigation-url"
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.22em]
                    text-white/35
                  "
                >
                  URL
                </label>

                <input
                  id="navigation-url"
                  value={editing.href}
                  onChange={(event) =>
                    updateEditing(
                      "href",
                      event.target.value
                    )
                  }
                  placeholder="/about"
                  className="
                    mt-3
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.035]
                    px-4
                    py-3.5
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-white/20
                    focus:border-white/25
                  "
                />
              </div>

              {/* PARENT */}

              <div>
                <label
                  htmlFor="navigation-parent"
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.22em]
                    text-white/35
                  "
                >
                  Parent menu
                </label>

                <select
                  id="navigation-parent"
                  value={
                    editing.parent_id ||
                    ""
                  }
                  onChange={(event) =>
                    updateEditing(
                      "parent_id",
                      event.target.value ||
                        null
                    )
                  }
                  className="
                    mt-3
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-[#0B2146]
                    px-4
                    py-3.5
                    text-sm
                    text-white
                    outline-none
                  "
                >
                  <option value="">
                    Main navigation
                  </option>

                  {rootItems
                    .filter(
                      (item) =>
                        item.id !==
                        editing.id
                    )
                    .map(
                      (item) => (
                        <option
                          key={
                            item.id
                          }
                          value={
                            item.id
                          }
                        >
                          {item.label}
                        </option>
                      )
                    )}
                </select>
              </div>

              {/* ORDER */}

              <div>
                <label
                  htmlFor="navigation-order"
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.22em]
                    text-white/35
                  "
                >
                  Display order
                </label>

                <input
                  id="navigation-order"
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
                      ) || 0
                    )
                  }
                  className="
                    mt-3
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.035]
                    px-4
                    py-3.5
                    text-sm
                    text-white
                    outline-none
                  "
                />
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
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.025]
                    px-4
                    py-3.5
                    text-sm
                  "
                >
                  <span className="text-white/65">
                    Visible
                  </span>

                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      editing.is_active
                        ? "bg-emerald-300"
                        : "bg-white/20"
                    }`}
                  />
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
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.025]
                    px-4
                    py-3.5
                    text-sm
                  "
                >
                  <span className="text-white/65">
                    New tab
                  </span>

                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      editing.open_in_new_tab
                        ? "bg-[#9BCBFF]"
                        : "bg-white/20"
                    }`}
                  />
                </button>

              </div>

              {/* ACTIONS */}

              <div
                className="
                  flex
                  flex-col-reverse
                  gap-3
                  border-t
                  border-white/10
                  pt-6
                  sm:flex-row
                  sm:justify-end
                "
              >

                <button
                  type="button"
                  onClick={() =>
                    setEditing(null)
                  }
                  className="
                    rounded-xl
                    border
                    border-white/10
                    px-5
                    py-3
                    text-sm
                    text-white/55
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
                    px-6
                    py-3
                    text-sm
                    font-semibold
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
                    : "Save item"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </main>
  );
}