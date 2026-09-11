"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase/browser";

type Settings = {
  id?: string;
  section_label: string;
  heading_line_1: string;
  heading_line_2: string;
  description: string;

  gallery_button_label: string;
  gallery_button_url: string;

  closing_label: string;
  closing_heading_line_1: string;
  closing_heading_line_2: string;
  closing_button_label: string;
  closing_button_url: string;

  is_active: boolean;
};

type Item = {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  icon_name: string;
  size: string;
  link_url: string;
  sort_order: number;
  is_active: boolean;
};

const defaultSettings: Settings = {
  section_label: "Life at Apex",
  heading_line_1: "Moments that",
  heading_line_2: "become memories.",
  description:
    "From sports and cultural celebrations to leadership and everyday school life, there is always something happening at Apex.",
  gallery_button_label: "View full gallery",
  gallery_button_url: "/gallery",
  closing_label: "Explore Apex",
  closing_heading_line_1: "Sports. Culture. Leadership.",
  closing_heading_line_2: "School life in motion.",
  closing_button_label: "Explore activities",
  closing_button_url: "/activities",
  is_active: true,
};

const emptyItem = (): Omit<Item, "id"> => ({
  title: "",
  category: "School Life",
  description: "",
  image_url: "",
  icon_name: "Users",
  size: "small",
  link_url: "/gallery",
  sort_order: 0,
  is_active: true,
});

export default function GalleryPreviewAdminPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const { data: settingsData } = await supabase
      .from("gallery_preview_settings")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: itemsData } = await supabase
      .from("gallery_preview_items")
      .select("*")
      .order("sort_order", { ascending: true });

    if (settingsData) {
      setSettings(settingsData);
    }

    if (itemsData) {
      setItems(itemsData);
    }

    setLoading(false);
  }

  async function saveSettings() {
    setSaving(true);
    setMessage("");

    try {
      const payload = {
        section_label: settings.section_label,
        heading_line_1: settings.heading_line_1,
        heading_line_2: settings.heading_line_2,
        description: settings.description,
        gallery_button_label: settings.gallery_button_label,
        gallery_button_url: settings.gallery_button_url,
        closing_label: settings.closing_label,
        closing_heading_line_1: settings.closing_heading_line_1,
        closing_heading_line_2: settings.closing_heading_line_2,
        closing_button_label: settings.closing_button_label,
        closing_button_url: settings.closing_button_url,
        is_active: settings.is_active,
        updated_at: new Date().toISOString(),
      };

      let error;

      if (settings.id) {
        ({ error } = await supabase
          .from("gallery_preview_settings")
          .update(payload)
          .eq("id", settings.id));
      } else {
        const result = await supabase
          .from("gallery_preview_settings")
          .insert(payload)
          .select()
          .single();

        error = result.error;

        if (result.data) {
          setSettings(result.data);
        }
      }

      if (error) {
        throw error;
      }

      setMessage("Gallery preview settings saved successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Could not save settings.");
    } finally {
      setSaving(false);
    }
  }

  async function addItem() {
    const nextOrder =
      items.length > 0
        ? Math.max(...items.map((item) => item.sort_order)) + 1
        : 1;

    const draft = emptyItem();

    const { data, error } = await supabase
      .from("gallery_preview_items")
      .insert({
        ...draft,
        sort_order: nextOrder,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      setMessage("Could not add gallery item.");
      return;
    }

    setItems((current) => [...current, data]);
  }

  async function updateItem(item: Item) {
    const { error } = await supabase
      .from("gallery_preview_items")
      .update({
        title: item.title,
        category: item.category,
        description: item.description,
        image_url: item.image_url,
        icon_name: item.icon_name,
        size: item.size,
        link_url: item.link_url,
        sort_order: item.sort_order,
        is_active: item.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id);

    if (error) {
      console.error(error);
      setMessage("Could not save gallery item.");
      return;
    }

    setMessage(`"${item.title || "Gallery item"}" saved.`);
  }

  async function deleteItem(id: string) {
    const confirmed = window.confirm(
      "Delete this gallery preview item?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("gallery_preview_items")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      setMessage("Could not delete gallery item.");
      return;
    }

    setItems((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  async function uploadImage(
    event: React.ChangeEvent<HTMLInputElement>,
    item: Item
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage("Image must be smaller than 10MB.");
      return;
    }

    setUploading(item.id);

    try {
      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const path = `gallery-preview/${item.id}-${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(path, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("gallery")
        .getPublicUrl(path);

      const imageUrl = data.publicUrl;

      await supabase
        .from("gallery_preview_items")
        .update({
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id);

      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? {
                ...entry,
                image_url: imageUrl,
              }
            : entry
        )
      );

      setMessage("Image uploaded.");
    } catch (error) {
      console.error(error);
      setMessage("Image upload failed.");
    } finally {
      setUploading(null);
    }

    event.target.value = "";
  }

  function updateField(
    field: keyof Settings,
    value: string | boolean
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateItemField(
    id: string,
    field: keyof Item,
    value: string | number | boolean
  ) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  if (loading) {
    return (
      <div className="p-8">
        <p>Loading Gallery Preview CMS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 p-6 md:p-8">

      {/* HEADER */}

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Website / Homepage
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Gallery Preview
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Manage the homepage gallery section, gallery cards,
            images, text and links without editing code.
          </p>
        </div>

        <button
          onClick={saveSettings}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#102A56] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save section"}
        </button>
      </div>

      {message && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {message}
        </div>
      )}

      {/* SECTION CONTENT */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          Section content
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">

          <Field
            label="Section label"
            value={settings.section_label}
            onChange={(value) =>
              updateField("section_label", value)
            }
          />

          <div />

          <Field
            label="Heading line 1"
            value={settings.heading_line_1}
            onChange={(value) =>
              updateField("heading_line_1", value)
            }
          />

          <Field
            label="Heading line 2"
            value={settings.heading_line_2}
            onChange={(value) =>
              updateField("heading_line_2", value)
            }
          />

          <TextArea
            label="Description"
            value={settings.description}
            onChange={(value) =>
              updateField("description", value)
            }
            full
          />

          <Field
            label="Gallery button label"
            value={settings.gallery_button_label}
            onChange={(value) =>
              updateField("gallery_button_label", value)
            }
          />

          <Field
            label="Gallery button URL"
            value={settings.gallery_button_url}
            onChange={(value) =>
              updateField("gallery_button_url", value)
            }
          />
        </div>
      </section>

      {/* CLOSING CTA */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          Closing CTA
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">

          <Field
            label="Closing label"
            value={settings.closing_label}
            onChange={(value) =>
              updateField("closing_label", value)
            }
          />

          <div />

          <Field
            label="Closing heading line 1"
            value={settings.closing_heading_line_1}
            onChange={(value) =>
              updateField("closing_heading_line_1", value)
            }
          />

          <Field
            label="Closing heading line 2"
            value={settings.closing_heading_line_2}
            onChange={(value) =>
              updateField("closing_heading_line_2", value)
            }
          />

          <Field
            label="Closing button label"
            value={settings.closing_button_label}
            onChange={(value) =>
              updateField("closing_button_label", value)
            }
          />

          <Field
            label="Closing button URL"
            value={settings.closing_button_url}
            onChange={(value) =>
              updateField("closing_button_url", value)
            }
          />
        </div>
      </section>

      {/* VISIBILITY */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold">
              Homepage visibility
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Hide the complete gallery preview from the
              homepage without deleting its content.
            </p>
          </div>

          <button
            onClick={() =>
              updateField(
                "is_active",
                !settings.is_active
              )
            }
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
              settings.is_active
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {settings.is_active ? (
              <>
                <Eye size={15} />
                Visible
              </>
            ) : (
              <>
                <EyeOff size={15} />
                Hidden
              </>
            )}
          </button>
        </div>
      </section>

      {/* ITEMS */}

      <section className="space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Gallery cards
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              These cards appear inside the homepage gallery grid.
            </p>
          </div>

          <button
            onClick={addItem}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50"
          >
            <Plus size={16} />
            Add card
          </button>
        </div>

        <div className="space-y-5">
          {items.map((item, index) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="mt-3 text-slate-400">
                  <GripVertical size={18} />
                </div>

                <div className="flex-1">
                  <div className="grid gap-5 lg:grid-cols-[240px_1fr]">

                    {/* IMAGE */}

                    <div>
                      <div className="overflow-hidden rounded-xl bg-slate-100">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="h-52 w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-52 items-center justify-center">
                            <ImageIcon
                              size={40}
                              className="text-slate-300"
                            />
                          </div>
                        )}
                      </div>

                      <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium hover:bg-slate-50">
                        <Upload size={15} />

                        {uploading === item.id
                          ? "Uploading..."
                          : "Upload image"}

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploading === item.id}
                          onChange={(event) =>
                            uploadImage(event, item)
                          }
                        />
                      </label>
                    </div>

                    {/* FIELDS */}

                    <div className="grid gap-4 md:grid-cols-2">

                      <Field
                        label="Title"
                        value={item.title}
                        onChange={(value) =>
                          updateItemField(
                            item.id,
                            "title",
                            value
                          )
                        }
                      />

                      <Field
                        label="Category"
                        value={item.category}
                        onChange={(value) =>
                          updateItemField(
                            item.id,
                            "category",
                            value
                          )
                        }
                      />

                      <TextArea
                        label="Description"
                        value={item.description}
                        onChange={(value) =>
                          updateItemField(
                            item.id,
                            "description",
                            value
                          )
                        }
                      />

                      <Field
                        label="Image URL"
                        value={item.image_url}
                        onChange={(value) =>
                          updateItemField(
                            item.id,
                            "image_url",
                            value
                          )
                        }
                      />

                      <Field
                        label="Icon"
                        value={item.icon_name}
                        onChange={(value) =>
                          updateItemField(
                            item.id,
                            "icon_name",
                            value
                          )
                        }
                        placeholder="Trophy, Music, Flag..."
                      />

                      <SelectField
                        label="Card size"
                        value={item.size}
                        onChange={(value) =>
                          updateItemField(
                            item.id,
                            "size",
                            value
                          )
                        }
                        options={[
                          {
                            label: "Large",
                            value: "large",
                          },
                          {
                            label: "Small",
                            value: "small",
                          },
                        ]}
                      />

                      <Field
                        label="Card link"
                        value={item.link_url}
                        onChange={(value) =>
                          updateItemField(
                            item.id,
                            "link_url",
                            value
                          )
                        }
                      />

                      <Field
                        label="Sort order"
                        value={String(item.sort_order)}
                        onChange={(value) =>
                          updateItemField(
                            item.id,
                            "sort_order",
                            Number(value) || 0
                          )
                        }
                        type="number"
                      />
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      Card #{index + 1}

                      <button
                        onClick={() =>
                          updateItemField(
                            item.id,
                            "is_active",
                            !item.is_active
                          )
                        }
                        className={`ml-2 inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-semibold ${
                          item.is_active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.is_active ? (
                          <>
                            <Eye size={12} />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeOff size={12} />
                            Hidden
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => updateItem(item)}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#102A56] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                      >
                        <Save size={14} />
                        Save card
                      </button>

                      <button
                        onClick={() =>
                          deleteItem(item.id)
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-[#102A56] focus:ring-2 focus:ring-[#102A56]/10"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  full = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        rows={full ? 4 : 3}
        className="w-full resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-[#102A56] focus:ring-2 focus:ring-[#102A56]/10"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none focus:border-[#102A56] focus:ring-2 focus:ring-[#102A56]/10"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}