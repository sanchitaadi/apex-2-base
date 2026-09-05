"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browser";

type FacultyMember = {
  id: string;
  name: string;
  role: string | null;
  department: string | null;
  qualification: string | null;
  bio: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

type FacultyForm = {
  name: string;
  role: string;
  department: string;
  qualification: string;
  bio: string;
  image_url: string;
  sort_order: string;
  is_active: boolean;
};

const emptyForm: FacultyForm = {
  name: "",
  role: "",
  department: "",
  qualification: "",
  bio: "",
  image_url: "",
  sort_order: "0",
  is_active: true,
};

export default function FacultyAdminPage() {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [form, setForm] = useState<FacultyForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadFaculty();
  }, []);

  async function loadFaculty() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("faculty_members")
      .select(
        "id,name,role,department,qualification,bio,image_url,sort_order,is_active,created_at,updated_at"
      )
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      setError(error.message);
      setFaculty([]);
    } else {
      setFaculty((data || []) as FacultyMember[]);
    }

    setLoading(false);
  }

  function startNew() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      sort_order: String(faculty.length + 1),
    });
    setMessage("");
    setError("");
  }

  function startEdit(member: FacultyMember) {
    setEditingId(member.id);

    setForm({
      name: member.name || "",
      role: member.role || "",
      department: member.department || "",
      qualification: member.qualification || "",
      bio: member.bio || "",
      image_url: member.image_url || "",
      sort_order: String(member.sort_order ?? 0),
      is_active: member.is_active,
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function updateField<K extends keyof FacultyForm>(
    field: K,
    value: FacultyForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function uploadImage(file: File) {
    if (!file) return;

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const safeName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .toLowerCase();

      const fileName = `${Date.now()}-${safeName}.${extension}`;
      const path = `faculty/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("faculty")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("faculty").getPublicUrl(path);

      updateField("image_url", publicUrl);

      setMessage("Photo uploaded successfully.");
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload faculty photo."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!validTypes.includes(file.type)) {
      setError("Please upload JPG, PNG or WEBP images only.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("Image size must be below 8 MB.");
      return;
    }

    await uploadImage(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Faculty name is required.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      name: form.name.trim(),
      role: form.role.trim() || null,
      department: form.department.trim() || null,
      qualification: form.qualification.trim() || null,
      bio: form.bio.trim() || null,
      image_url: form.image_url.trim() || null,
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingId) {
        const { error: updateError } = await supabase
          .from("faculty_members")
          .update(payload)
          .eq("id", editingId);

        if (updateError) throw updateError;

        setMessage("Faculty member updated successfully.");
      } else {
        const { error: insertError } = await supabase
          .from("faculty_members")
          .insert(payload);

        if (insertError) throw insertError;

        setMessage("Faculty member added successfully.");
      }

      setEditingId(null);
      setForm(emptyForm);

      await loadFaculty();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save faculty member."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(member: FacultyMember) {
    setError("");
    setMessage("");

    const { error: updateError } = await supabase
      .from("faculty_members")
      .update({
        is_active: !member.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", member.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage(
      `${member.name} is now ${
        !member.is_active ? "visible" : "hidden"
      } on the website.`
    );

    await loadFaculty();
  }

  async function deleteFaculty(member: FacultyMember) {
    const confirmed = window.confirm(
      `Delete "${member.name}" from the faculty list? This cannot be undone.`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    const { error: deleteError } = await supabase
      .from("faculty_members")
      .delete()
      .eq("id", member.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    if (member.image_url) {
      await removeStoredImage(member.image_url);
    }

    setMessage("Faculty member deleted.");
    await loadFaculty();
  }

  async function removeStoredImage(imageUrl: string) {
    try {
      const marker = "/storage/v1/object/public/faculty/";

      const index = imageUrl.indexOf(marker);

      if (index === -1) return;

      const filePath = imageUrl.substring(index + marker.length);

      await supabase.storage.from("faculty").remove([filePath]);
    } catch (err) {
      console.error("Unable to remove old image:", err);
    }
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
  }

  return (
    <main className="min-h-screen bg-[#F5F0E6] text-[#10203A]">
      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#687589]">
              Apex Public School
            </p>

            <h1 className="text-3xl font-semibold text-[#102A56] md:text-4xl">
              Faculty Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-[#687589]">
              Manage faculty names, photographs, roles, qualifications,
              biographies, display order and website visibility.
            </p>
          </div>

          <button
            type="button"
            onClick={startNew}
            className="rounded-full bg-[#102A56] px-6 py-3 text-sm font-semibold text-[#F5F0E6] transition hover:bg-[#0A1D3B]"
          >
            + Add Faculty
          </button>
        </div>

        {/* Alerts */}
        {message && (
          <div className="mb-6 rounded-2xl border border-[#B8C8DD] bg-[#E6EEF7] px-5 py-4 text-sm font-medium text-[#102A56]">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-[#D8B8B0] bg-[#F4E4DF] px-5 py-4 text-sm font-medium text-[#7D3025]">
            {error}
          </div>
        )}

        {/* Editor */}
        <section className="mb-10 rounded-[28px] border border-[#DDD5C7] bg-[#FFFDF8] p-6 shadow-[0_12px_40px_rgba(16,42,86,0.06)] md:p-8">
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[#102A56]">
                {editingId ? "Edit Faculty Member" : "Add Faculty Member"}
              </h2>

              <p className="mt-1 text-sm text-[#687589]">
                Changes made here appear on the public Faculty page.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={cancelEditing}
                className="rounded-full border border-[#CFC6B8] px-4 py-2 text-sm font-medium text-[#53627A] hover:bg-[#F5F0E6]"
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
              {/* Image */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#102A56]">
                  Faculty Photo
                </label>

                <div className="overflow-hidden rounded-[22px] border border-[#D8D0C1] bg-[#E8E1D5]">
                  <div className="aspect-square">
                    {form.image_url ? (
                      <img
                        src={form.image_url}
                        alt={form.name || "Faculty preview"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#DCE7F5]">
                        <span className="text-sm font-medium text-[#53627A]">
                          No photo
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-[#D8D0C1] bg-[#FFFDF8] p-4">
                    <label className="flex cursor-pointer items-center justify-center rounded-xl bg-[#102A56] px-4 py-3 text-center text-sm font-semibold text-[#F5F0E6] hover:bg-[#0A1D3B]">
                      {uploading ? "Uploading…" : "Upload Photo"}

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleImageChange}
                        disabled={uploading}
                      />
                    </label>

                    <p className="mt-3 text-center text-xs leading-5 text-[#687589]">
                      JPG, PNG or WEBP
                      <br />
                      Maximum 8 MB
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#687589]">
                    Or use image URL
                  </label>

                  <input
                    type="url"
                    value={form.image_url}
                    onChange={(e) =>
                      updateField("image_url", e.target.value)
                    }
                    placeholder="https://..."
                    className="w-full rounded-xl border border-[#D8D0C1] bg-[#FFFDF8] px-4 py-3 text-sm outline-none focus:border-[#102A56]"
                  />
                </div>
              </div>

              {/* Fields */}
              <div className="grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Name *"
                    value={form.name}
                    onChange={(value) => updateField("name", value)}
                    placeholder="Dr. Dorothy Jonathan"
                  />

                  <Field
                    label="Role"
                    value={form.role}
                    onChange={(value) => updateField("role", value)}
                    placeholder="Principal"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Department"
                    value={form.department}
                    onChange={(value) =>
                      updateField("department", value)
                    }
                    placeholder="Administration"
                  />

                  <Field
                    label="Qualification"
                    value={form.qualification}
                    onChange={(value) =>
                      updateField("qualification", value)
                    }
                    placeholder="M.A., B.Ed."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#102A56]">
                    Biography
                  </label>

                  <textarea
                    value={form.bio}
                    onChange={(e) => updateField("bio", e.target.value)}
                    rows={6}
                    placeholder="Write a short faculty biography..."
                    className="w-full resize-y rounded-xl border border-[#D8D0C1] bg-[#FFFDF8] px-4 py-3 text-sm leading-6 outline-none focus:border-[#102A56]"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#102A56]">
                      Display Order
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={form.sort_order}
                      onChange={(e) =>
                        updateField("sort_order", e.target.value)
                      }
                      className="w-full rounded-xl border border-[#D8D0C1] bg-[#FFFDF8] px-4 py-3 text-sm outline-none focus:border-[#102A56]"
                    />
                  </div>

                  <label className="flex items-center gap-3 self-end rounded-xl border border-[#D8D0C1] bg-[#F8F4EC] px-4 py-3">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) =>
                        updateField("is_active", e.target.checked)
                      }
                      className="h-4 w-4"
                    />

                    <span>
                      <span className="block text-sm font-semibold text-[#102A56]">
                        Visible on website
                      </span>

                      <span className="block text-xs text-[#687589]">
                        Turn off to hide this faculty member.
                      </span>
                    </span>
                  </label>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="rounded-full bg-[#102A56] px-7 py-3 text-sm font-semibold text-[#F5F0E6] transition hover:bg-[#0A1D3B] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving
                      ? "Saving…"
                      : editingId
                        ? "Update Faculty"
                        : "Add Faculty"}
                  </button>

                  {!editingId && (
                    <button
                      type="button"
                      onClick={() => setForm(emptyForm)}
                      className="rounded-full border border-[#CFC6B8] px-6 py-3 text-sm font-semibold text-[#53627A] hover:bg-[#F5F0E6]"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </section>

        {/* Existing records */}
        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#687589]">
                Published & Draft Faculty
              </p>

              <h2 className="mt-1 text-2xl font-semibold text-[#102A56]">
                Faculty Directory
              </h2>
            </div>

            <span className="rounded-full bg-[#E4EAF2] px-4 py-2 text-xs font-semibold text-[#102A56]">
              {faculty.length} member{faculty.length === 1 ? "" : "s"}
            </span>
          </div>

          {loading ? (
            <div className="rounded-[24px] border border-[#DDD5C7] bg-[#FFFDF8] p-10 text-center text-sm text-[#687589]">
              Loading faculty…
            </div>
          ) : faculty.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-[#CFC6B8] bg-[#FFFDF8] p-12 text-center">
              <p className="text-lg font-semibold text-[#102A56]">
                No faculty members yet.
              </p>

              <p className="mt-2 text-sm text-[#687589]">
                Add your first faculty member using the editor above.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {faculty.map((member) => (
                <article
                  key={member.id}
                  className="rounded-[24px] border border-[#DDD5C7] bg-[#FFFDF8] p-4 shadow-[0_8px_25px_rgba(16,42,86,0.05)] md:p-5"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center">
                    {/* Photo */}
                    <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-[#DCE7F5]">
                      {member.image_url ? (
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-[#102A56]">
                          {getInitials(member.name)}
                        </div>
                      )}
                    </div>

                    {/* Information */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-[#102A56]">
                          {member.name}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${
                            member.is_active
                              ? "bg-[#E3EFE5] text-[#315E3B]"
                              : "bg-[#EEE8DE] text-[#786E60]"
                          }`}
                        >
                          {member.is_active ? "Published" : "Hidden"}
                        </span>
                      </div>

                      {member.role && (
                        <p className="mt-1 text-sm font-semibold text-[#53627A]">
                          {member.role}
                        </p>
                      )}

                      {member.department && (
                        <p className="mt-1 text-sm text-[#687589]">
                          {member.department}
                        </p>
                      )}

                      <p className="mt-2 text-xs text-[#8A92A0]">
                        Display order: {member.sort_order}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <button
                        type="button"
                        onClick={() => startEdit(member)}
                        className="rounded-full border border-[#CFC6B8] px-4 py-2 text-xs font-semibold text-[#102A56] hover:bg-[#F5F0E6]"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleActive(member)}
                        className="rounded-full border border-[#CFC6B8] px-4 py-2 text-xs font-semibold text-[#53627A] hover:bg-[#F5F0E6]"
                      >
                        {member.is_active ? "Hide" : "Publish"}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteFaculty(member)}
                        className="rounded-full border border-[#D6B7B0] px-4 py-2 text-xs font-semibold text-[#8A3B30] hover:bg-[#F4E4DF]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#102A56]">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#D8D0C1] bg-[#FFFDF8] px-4 py-3 text-sm outline-none focus:border-[#102A56]"
      />
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}