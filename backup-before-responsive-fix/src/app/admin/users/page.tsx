"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Shield,
  UserCheck,
  UserPlus,
  UserX,
  X,
  Trash2,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

type AdminUser = {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "super_admin";
  is_active: boolean;
  created_at: string;
};

type UserForm = {
  email: string;
  fullName: string;
  password: string;
  role: "admin" | "super_admin";
};

const INITIAL_FORM: UserForm = {
  email: "",
  fullName: "",
  password: "",
  role: "admin",
};

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showAdd, setShowAdd] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [page, setPage] = useState(1);

  const [form, setForm] = useState<UserForm>(
    INITIAL_FORM
  );

  const [passwordUser, setPasswordUser] =
    useState<AdminUser | null>(null);

  const [newPassword, setNewPassword] =
    useState("");

  const [editRoleUser, setEditRoleUser] =
    useState<AdminUser | null>(null);

  const [selectedRole, setSelectedRole] =
    useState<"admin" | "super_admin">("admin");

  const [deleteUser, setDeleteUser] =
    useState<AdminUser | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ============================================================
     LOAD USERS
  ============================================================ */

  async function loadUsers() {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        window.location.href = "/admin/login";
        return;
      }

      setCurrentUserId(user.id);

      const {
        data: admin,
        error: adminError,
      } = await supabase
        .from("admin_users")
        .select(
          "id, email, full_name, role, is_active, created_at"
        )
        .eq("id", user.id)
        .maybeSingle();

      if (
        adminError ||
        !admin ||
        !admin.is_active ||
        !["admin", "super_admin"].includes(
          admin.role
        )
      ) {
        await supabase.auth.signOut();
        window.location.href = "/admin/login";
        return;
      }

      setCurrentUserRole(admin.role);

      const {
        data,
        error: usersError,
      } = await supabase
        .from("admin_users")
        .select(
          "id, email, full_name, role, is_active, created_at"
        )
        .order("created_at", {
          ascending: true,
        });

      if (usersError) {
        throw usersError;
      }

      setUsers((data || []) as AdminUser[]);
    } catch (err: any) {
      console.error(
        "CMS users load failed:",
        err
      );

      setError(
        err?.message ||
          "Could not load CMS users."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  /* ============================================================
     FILTER
  ============================================================ */

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.email.toLowerCase().includes(query) ||
        (user.full_name || "")
          .toLowerCase()
          .includes(query);

      const matchesFilter =
        filter === "all" ||
        (filter === "active" && user.is_active) ||
        (filter === "inactive" && !user.is_active);

      return matchesSearch && matchesFilter;
    });
  }, [users, search, filter]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredUsers.length / PAGE_SIZE
    )
  );

  const visibleUsers = filteredUsers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  /* ============================================================
     API REQUEST HELPER
  ============================================================ */

  async function apiRequest(
    method: "POST" | "PATCH" | "DELETE",
    body: Record<string, unknown>
  ) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error(
        "Your session has expired. Please sign in again."
      );
    }

    const response = await fetch(
      "/api/admin/users",
      {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result?.error ||
          "The requested operation failed."
      );
    }

    return result;
  }

  /* ============================================================
     CREATE USER
  ============================================================ */

  async function createUser() {
    setError("");
    setSuccess("");

    const email = form.email.trim().toLowerCase();
    const fullName = form.fullName.trim();
    const password = form.password;

    if (!email) {
      setError("Please enter an email address.");
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (currentUserRole !== "super_admin") {
      setError(
        "Only a Super Administrator can create CMS users."
      );
      return;
    }

    setSaving(true);

    try {
      await apiRequest("POST", {
        action: "create",
        email,
        fullName,
        password,
        role: form.role,
      });

      setSuccess(
        `CMS user ${email} was created successfully.`
      );

      setForm(INITIAL_FORM);
      setShowAdd(false);

      await loadUsers();
    } catch (err: any) {
      console.error(
        "Create CMS user failed:",
        err
      );

      setError(
        err?.message ||
          "Could not create CMS user."
      );
    } finally {
      setSaving(false);
    }
  }

  /* ============================================================
     ACTIVATE / DEACTIVATE
  ============================================================ */

  async function toggleUser(user: AdminUser) {
    setError("");
    setSuccess("");

    if (currentUserRole !== "super_admin") {
      setError(
        "Only a Super Administrator can change user status."
      );
      return;
    }

    if (user.id === currentUserId) {
      setError(
        "You cannot deactivate your own account."
      );
      return;
    }

    try {
      await apiRequest("PATCH", {
        action: "status",
        userId: user.id,
        isActive: !user.is_active,
      });

      setSuccess(
        user.is_active
          ? `${user.email} has been deactivated.`
          : `${user.email} has been activated.`
      );

      await loadUsers();
    } catch (err: any) {
      setError(
        err?.message ||
          "Could not update user status."
      );
    }
  }

  /* ============================================================
     CHANGE ROLE
  ============================================================ */

  async function changeRole() {
    if (!editRoleUser) return;

    setError("");
    setSuccess("");

    if (currentUserRole !== "super_admin") {
      setError(
        "Only a Super Administrator can change roles."
      );
      return;
    }

    try {
      await apiRequest("PATCH", {
        action: "role",
        userId: editRoleUser.id,
        role: selectedRole,
      });

      setSuccess(
        `${editRoleUser.email} is now ${
          selectedRole === "super_admin"
            ? "a Super Administrator."
            : "an Administrator."
        }`
      );

      setEditRoleUser(null);

      await loadUsers();
    } catch (err: any) {
      setError(
        err?.message ||
          "Could not change user role."
      );
    }
  }

  /* ============================================================
     RESET PASSWORD
  ============================================================ */

  async function resetPassword() {
    if (!passwordUser) return;

    setError("");
    setSuccess("");

    if (currentUserRole !== "super_admin") {
      setError(
        "Only a Super Administrator can reset passwords."
      );
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    try {
      await apiRequest("PATCH", {
        action: "password",
        userId: passwordUser.id,
        password: newPassword,
      });

      setSuccess(
        `Password updated for ${passwordUser.email}.`
      );

      setPasswordUser(null);
      setNewPassword("");
    } catch (err: any) {
      setError(
        err?.message ||
          "Could not reset the password."
      );
    }
  }

  /* ============================================================
     DELETE USER
  ============================================================ */

  async function confirmDelete() {
    if (!deleteUser) return;

    setError("");
    setSuccess("");

    if (currentUserRole !== "super_admin") {
      setError(
        "Only a Super Administrator can delete users."
      );
      return;
    }

    if (deleteUser.id === currentUserId) {
      setError(
        "You cannot delete your own account."
      );
      setDeleteUser(null);
      return;
    }

    try {
      await apiRequest("DELETE", {
        userId: deleteUser.id,
      });

      setSuccess(
        `${deleteUser.email} has been permanently removed.`
      );

      setDeleteUser(null);

      await loadUsers();
    } catch (err: any) {
      setError(
        err?.message ||
          "Could not delete CMS user."
      );
    }
  }

  /* ============================================================
     COUNTS
  ============================================================ */

  const activeCount = users.filter(
    (user) => user.is_active
  ).length;

  const inactiveCount = users.filter(
    (user) => !user.is_active
  ).length;

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="mx-auto max-w-[1500px]">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <section className="mb-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#102A56]/35">
              School · Security
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-[#102A56] md:text-5xl">
              CMS Users
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#10203A]/50">
              Create and manage authorized administrators for
              the Apex Public School content management system.
            </p>
          </div>

          {currentUserRole === "super_admin" && (
            <button
              type="button"
              onClick={() => {
                setShowAdd(true);
                setError("");
                setSuccess("");
              }}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#102A56]
                px-5
                py-3.5
                text-sm
                font-semibold
                !text-[#F5F0E6]
                transition
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#1B3D73]
              "
            >
              <UserPlus
                size={16}
                className="!text-[#F5F0E6]"
              />

              <span className="!text-[#F5F0E6]">
                Add CMS user
              </span>
            </button>
          )}
        </div>
      </section>

      {/* ======================================================
          STATS
      ====================================================== */}

      <section className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total users"
          value={users.length}
          icon={UsersIcon}
        />

        <StatCard
          label="Active"
          value={activeCount}
          icon={UserCheck}
        />

        <StatCard
          label="Inactive"
          value={inactiveCount}
          icon={UserX}
        />
      </section>

      {/* ======================================================
          MESSAGES
      ====================================================== */}

      {success && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-700/10 bg-emerald-50 px-5 py-4">
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0 !text-emerald-700"
          />

          <p className="text-sm !text-emerald-800">
            {success}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-700/10 bg-red-50 px-5 py-4">
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0 !text-red-700"
          />

          <p className="text-sm !text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* ======================================================
          ADD USER FORM
      ====================================================== */}

      {showAdd && (
        <section className="mb-8 rounded-[2rem] border border-[#102A56]/10 bg-white p-7 md:p-9">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#102A56]/35">
                Create account
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#102A56]">
                Add CMS user
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#10203A]/50">
                Create the account directly. No invitation email is
                required.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowAdd(false);
                setForm(INITIAL_FORM);
              }}
              className="
                grid
                h-9
                w-9
                place-items-center
                rounded-full
                border
                border-[#102A56]/10
                bg-[#F8F6F1]
                !text-[#102A56]
              "
            >
              <X
                size={16}
                className="!text-[#102A56]"
              />
            </button>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <FormInput
              label="Email *"
              type="email"
              value={form.email}
              placeholder="staff@example.com"
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  email: value,
                }))
              }
            />

            <FormInput
              label="Full name"
              type="text"
              value={form.fullName}
              placeholder="Staff Member"
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  fullName: value,
                }))
              }
            />

            <FormInput
              label="Password *"
              type="password"
              value={form.password}
              placeholder="Minimum 8 characters"
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  password: value,
                }))
              }
            />

            <div>
              <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40">
                Role
              </label>

              <select
                value={form.role}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    role: event.target
                      .value as
                      | "admin"
                      | "super_admin",
                  }))
                }
                className="
                  mt-3
                  w-full
                  rounded-2xl
                  border
                  border-[#102A56]/10
                  bg-[#F8F6F1]
                  px-4
                  py-3.5
                  text-sm
                  !text-[#10203A]
                  outline-none
                  focus:border-[#102A56]/30
                "
              >
                <option value="admin">
                  Administrator
                </option>

                <option value="super_admin">
                  Super Administrator
                </option>
              </select>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={createUser}
              disabled={saving}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#102A56]
                px-6
                py-3.5
                text-sm
                font-semibold
                !text-[#F5F0E6]
                transition
                hover:bg-[#1B3D73]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {saving ? (
                <Loader2
                  size={16}
                  className="animate-spin !text-[#F5F0E6]"
                />
              ) : (
                <Plus
                  size={16}
                  className="!text-[#F5F0E6]"
                />
              )}

              <span className="!text-[#F5F0E6]">
                {saving
                  ? "Creating..."
                  : "Create user"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowAdd(false);
                setForm(INITIAL_FORM);
              }}
              className="
                rounded-full
                border
                border-[#102A56]/10
                bg-white
                px-6
                py-3.5
                text-sm
                font-semibold
                !text-[#102A56]
                transition
                hover:bg-[#F8F6F1]
              "
            >
              <span className="!text-[#102A56]">
                Cancel
              </span>
            </button>
          </div>
        </section>
      )}

      {/* ======================================================
          SEARCH / FILTERS
      ====================================================== */}

      <section className="mb-5 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 !text-[#102A56]/30"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email..."
            className="
              w-full
              rounded-2xl
              border
              border-[#102A56]/10
              bg-white
              py-3.5
              pl-11
              pr-4
              text-sm
              !text-[#10203A]
              outline-none
              focus:border-[#102A56]/25
            "
          />
        </div>

        <select
          value={filter}
          onChange={(event) => {
            setFilter(
              event.target.value as
                | "all"
                | "active"
                | "inactive"
            );
            setPage(1);
          }}
          className="
            rounded-2xl
            border
            border-[#102A56]/10
            bg-white
            px-4
            py-3.5
            text-sm
            !text-[#102A56]
            outline-none
          "
        >
          <option value="all">
            All users
          </option>

          <option value="active">
            Active only
          </option>

          <option value="inactive">
            Inactive only
          </option>
        </select>

        <button
          type="button"
          onClick={loadUsers}
          disabled={loading}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-2xl
            border
            border-[#102A56]/10
            bg-white
            px-5
            py-3.5
            text-sm
            font-semibold
            !text-[#102A56]
            transition
            hover:bg-[#F8F6F1]
            disabled:opacity-50
          "
        >
          <RefreshCw
            size={15}
            className={`
              !text-[#102A56]
              ${loading ? "animate-spin" : ""}
            `}
          />

          <span className="!text-[#102A56]">
            Refresh
          </span>
        </button>
      </section>

      {/* ======================================================
          USER TABLE
      ====================================================== */}

      <section className="overflow-hidden rounded-[2rem] border border-[#102A56]/10 bg-white">
        <div className="border-b border-[#102A56]/10 px-6 py-6 md:px-7">
          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#102A56]/35">
            Authorized accounts
          </p>

          <div className="mt-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-[#102A56]">
              {filteredUsers.length}{" "}
              {filteredUsers.length === 1
                ? "user"
                : "users"}
            </h2>

            <p className="text-xs text-[#10203A]/40">
              Page {page} of {totalPages}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex flex-col items-center">
              <Loader2
                size={25}
                className="animate-spin !text-[#102A56]"
              />

              <p className="mt-3 text-[9px] uppercase tracking-[0.25em] !text-[#102A56]/35">
                Loading users
              </p>
            </div>
          </div>
        ) : visibleUsers.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Search
              size={28}
              className="mx-auto !text-[#102A56]/20"
            />

            <h3 className="mt-4 text-lg font-semibold !text-[#102A56]">
              No users found
            </h3>

            <p className="mt-2 text-sm !text-[#10203A]/45">
              Try another search or create a new CMS user.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#102A56]/10">
            {visibleUsers.map((user) => (
              <div
                key={user.id}
                className="p-6 md:p-7"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#102A56]/[0.06]">
                      <Shield
                        size={18}
                        className="!text-[#102A56]"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold !text-[#102A56]">
                        {user.full_name ||
                          "CMS User"}
                      </div>

                      <div className="mt-1 truncate text-xs !text-[#10203A]/45">
                        {user.email}
                      </div>

                      <div className="mt-1 text-[9px] uppercase tracking-[0.16em] !text-[#10203A]/25">
                        Added{" "}
                        {new Date(
                          user.created_at
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="
                        rounded-full
                        bg-[#102A56]/[0.07]
                        px-3
                        py-1.5
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[0.16em]
                        !text-[#102A56]
                      "
                    >
                      {user.role ===
                      "super_admin"
                        ? "Super Admin"
                        : "Admin"}
                    </span>

                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1.5
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[0.16em]
                        ${
                          user.is_active
                            ? "bg-emerald-50 !text-emerald-700"
                            : "bg-red-50 !text-red-700"
                        }
                      `}
                    >
                      {user.is_active
                        ? "Active"
                        : "Inactive"}
                    </span>

                    {user.id ===
                    currentUserId ? (
                      <span className="rounded-full bg-[#102A56] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] !text-[#F5F0E6]">
                        You
                      </span>
                    ) : null}

                    {currentUserRole ===
                      "super_admin" &&
                      user.id !==
                        currentUserId && (
                        <>
                          <ActionButton
                            icon={KeyRound}
                            label="Password"
                            onClick={() => {
                              setPasswordUser(
                                user
                              );
                              setNewPassword("");
                              setError("");
                            }}
                          />

                          <ActionButton
                            icon={Shield}
                            label="Role"
                            onClick={() => {
                              setEditRoleUser(
                                user
                              );
                              setSelectedRole(
                                user.role
                              );
                              setError("");
                            }}
                          />

                          <ActionButton
                            icon={
                              user.is_active
                                ? UserX
                                : UserCheck
                            }
                            label={
                              user.is_active
                                ? "Deactivate"
                                : "Activate"
                            }
                            onClick={() =>
                              toggleUser(user)
                            }
                            danger={
                              user.is_active
                            }
                          />

                          <ActionButton
                            icon={Trash2}
                            label="Delete"
                            onClick={() =>
                              setDeleteUser(user)
                            }
                            danger
                          />
                        </>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ====================================================
            PAGINATION
        ==================================================== */}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#102A56]/10 px-6 py-5 md:px-7">
            <button
              type="button"
              disabled={page === 1}
              onClick={() =>
                setPage((current) =>
                  Math.max(1, current - 1)
                )
              }
              className="
                rounded-full
                border
                border-[#102A56]/10
                bg-[#F8F6F1]
                px-4
                py-2.5
                text-xs
                font-semibold
                !text-[#102A56]
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >
              <span className="!text-[#102A56]">
                Previous
              </span>
            </button>

            <span className="text-xs !text-[#10203A]/40">
              {page} / {totalPages}
            </span>

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() =>
                setPage((current) =>
                  Math.min(
                    totalPages,
                    current + 1
                  )
                )
              }
              className="
                rounded-full
                border
                border-[#102A56]/10
                bg-[#F8F6F1]
                px-4
                py-2.5
                text-xs
                font-semibold
                !text-[#102A56]
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >
              <span className="!text-[#102A56]">
                Next
              </span>
            </button>
          </div>
        )}
      </section>

      {/* ======================================================
          SECURITY NOTE
      ====================================================== */}

      <section className="mt-8 rounded-[2rem] bg-[#102A56] p-7 md:p-9">
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10">
            <Shield
              size={19}
              className="!text-[#F5F0E6]"
            />
          </div>

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] !text-white/35">
              Security
            </p>

            <h2 className="mt-2 text-xl font-semibold !text-white">
              Protected administrator access.
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 !text-white/55">
              User creation, password changes and account deletion
              are performed through a secure server-side API. The
              browser never receives the Supabase secret key.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          PASSWORD MODAL
      ====================================================== */}

      {passwordUser && (
        <Modal
          title="Change password"
          description={`Set a new password for ${passwordUser.email}.`}
          onClose={() => {
            setPasswordUser(null);
            setNewPassword("");
          }}
        >
          <FormInput
            label="New password"
            type="password"
            value={newPassword}
            placeholder="Minimum 8 characters"
            onChange={setNewPassword}
          />

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={resetPassword}
              className="
                rounded-full
                bg-[#102A56]
                px-5
                py-3
                text-sm
                font-semibold
                !text-[#F5F0E6]
              "
            >
              <span className="!text-[#F5F0E6]">
                Update password
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPasswordUser(null);
                setNewPassword("");
              }}
              className="
                rounded-full
                border
                border-[#102A56]/10
                px-5
                py-3
                text-sm
                font-semibold
                !text-[#102A56]
              "
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* ======================================================
          ROLE MODAL
      ====================================================== */}

      {editRoleUser && (
        <Modal
          title="Change role"
          description={`Update the CMS role for ${editRoleUser.email}.`}
          onClose={() =>
            setEditRoleUser(null)
          }
        >
          <select
            value={selectedRole}
            onChange={(event) =>
              setSelectedRole(
                event.target.value as
                  | "admin"
                  | "super_admin"
              )
            }
            className="
              w-full
              rounded-2xl
              border
              border-[#102A56]/10
              bg-[#F8F6F1]
              px-4
              py-3.5
              text-sm
              !text-[#10203A]
              outline-none
            "
          >
            <option value="admin">
              Administrator
            </option>

            <option value="super_admin">
              Super Administrator
            </option>
          </select>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={changeRole}
              className="
                rounded-full
                bg-[#102A56]
                px-5
                py-3
                text-sm
                font-semibold
                !text-[#F5F0E6]
              "
            >
              <span className="!text-[#F5F0E6]">
                Save role
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setEditRoleUser(null)
              }
              className="
                rounded-full
                border
                border-[#102A56]/10
                px-5
                py-3
                text-sm
                font-semibold
                !text-[#102A56]
              "
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* ======================================================
          DELETE MODAL
      ====================================================== */}

      {deleteUser && (
        <Modal
          title="Delete CMS user"
          description={`This will permanently remove ${deleteUser.email} from the CMS.`}
          onClose={() =>
            setDeleteUser(null)
          }
        >
          <div className="rounded-2xl bg-red-50 p-4 text-sm leading-6 !text-red-700">
            This action cannot be undone. The user's
            authentication account will also be removed.
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={confirmDelete}
              className="
                rounded-full
                bg-red-600
                px-5
                py-3
                text-sm
                font-semibold
                !text-white
              "
            >
              <span className="!text-white">
                Delete user
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setDeleteUser(null)
              }
              className="
                rounded-full
                border
                border-[#102A56]/10
                px-5
                py-3
                text-sm
                font-semibold
                !text-[#102A56]
              "
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ==============================================================
   ICON FOR TOTAL USERS
============================================================== */

function UsersIcon({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

/* ==============================================================
   STAT CARD
============================================================== */

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[#102A56]/10 bg-white p-6">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#102A56]/[0.06]">
        <Icon
          size={18}
          className="!text-[#102A56]"
        />
      </div>

      <div className="mt-8 text-3xl font-semibold tracking-[-0.04em] text-[#102A56]">
        {value}
      </div>

      <div className="mt-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/35">
        {label}
      </div>
    </div>
  );
}

/* ==============================================================
   FORM INPUT
============================================================== */

function FormInput({
  label,
  type,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/40">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="
          mt-3
          w-full
          rounded-2xl
          border
          border-[#102A56]/10
          bg-[#F8F6F1]
          px-4
          py-3.5
          text-sm
          !text-[#10203A]
          outline-none
          focus:border-[#102A56]/30
        "
      />
    </div>
  );
}

/* ==============================================================
   ACTION BUTTON
============================================================== */

function ActionButton({
  icon: Icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex
        items-center
        gap-2
        rounded-full
        px-3.5
        py-2.5
        text-[11px]
        font-semibold
        transition
        ${
          danger
            ? "bg-red-50 !text-red-700 hover:bg-red-100"
            : "bg-[#F8F6F1] !text-[#102A56] hover:bg-[#102A56]/[0.07]"
        }
      `}
    >
      <Icon
        size={13}
        className={
          danger
            ? "!text-red-700"
            : "!text-[#102A56]"
        }
      />

      <span
        className={
          danger
            ? "!text-red-700"
            : "!text-[#102A56]"
        }
      >
        {label}
      </span>
    </button>
  );
}

/* ==============================================================
   MODAL
============================================================== */

function Modal({
  title,
  description,
  onClose,
  children,
}: {
  title: string;
  description: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 p-5 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[2rem] bg-white p-7 shadow-[0_30px_100px_rgba(0,0,0,0.20)] md:p-9">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#102A56]/35">
              CMS security
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#102A56]">
              {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#10203A]/50">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              grid
              h-9
              w-9
              shrink-0
              place-items-center
              rounded-full
              border
              border-[#102A56]/10
              bg-[#F8F6F1]
              !text-[#102A56]
            "
          >
            <X
              size={16}
              className="!text-[#102A56]"
            />
          </button>
        </div>

        <div className="mt-7">
          {children}
        </div>
      </div>
    </div>
  );
}