"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  Loader2,
  LockKeyhole,
} from "lucide-react";

import { supabase } from "@/lib/supabase/browser";

const TAB_SESSION_KEY =
  "apex_cms_tab_authenticated";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const cleanEmail =
        email.trim().toLowerCase();

      /* =====================================================
         1. SIGN IN
      ===================================================== */

      const {
        data: authData,
        error: authError,
      } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (authError) {
        setError(
          authError.message ===
            "Invalid login credentials"
            ? "Incorrect email or password."
            : authError.message
        );

        return;
      }

      if (!authData.user) {
        setError(
          "Login failed. Please try again."
        );

        return;
      }

      /* =====================================================
         2. CHECK CMS AUTHORIZATION
      ===================================================== */

      const {
        data: admin,
        error: adminError,
      } = await supabase
        .from("admin_users")
        .select(
          "id, email, full_name, role, is_active"
        )
        .eq(
          "id",
          authData.user.id
        )
        .maybeSingle();

      if (adminError) {
        console.error(
          "CMS authorization lookup failed:",
          adminError
        );

        await supabase.auth.signOut();

        setError(
          "Unable to verify CMS authorization."
        );

        return;
      }

      /* =====================================================
         3. USER NOT AUTHORIZED
      ===================================================== */

      if (!admin) {
        await supabase.auth.signOut();

        setError(
          "This account is not authorized to access the Apex CMS."
        );

        return;
      }

      /* =====================================================
         4. USER DEACTIVATED
      ===================================================== */

      if (!admin.is_active) {
        await supabase.auth.signOut();

        setError(
          "This CMS account has been deactivated."
        );

        return;
      }

      /* =====================================================
         5. CHECK ROLE
      ===================================================== */

      if (
        ![
          "admin",
          "super_admin",
        ].includes(admin.role)
      ) {
        await supabase.auth.signOut();

        setError(
          "This account does not have CMS administrator privileges."
        );

        return;
      }

      /* =====================================================
         6. CREATE TAB SESSION
         
         IMPORTANT:
         This MUST happen BEFORE router.replace().
      ===================================================== */

      sessionStorage.setItem(
        TAB_SESSION_KEY,
        "true"
      );

      /* =====================================================
         7. CLEAR PASSWORD FROM MEMORY
      ===================================================== */

      setPassword("");

      /* =====================================================
         8. ENTER CMS
      ===================================================== */

      router.replace("/admin");
      router.refresh();
    } catch (err: any) {
      console.error(
        "CMS login failed:",
        err
      );

      /* Make sure a failed login never
         leaves a stale tab session. */

      sessionStorage.removeItem(
        TAB_SESSION_KEY
      );

      setError(
        err?.message ||
          "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F0E6]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* ==================================================
            BRAND SIDE
        ================================================== */}

        <section className="relative hidden overflow-hidden bg-[#102A56] lg:flex">
          <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full border border-white/10" />

          <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full border border-white/10" />

          <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.2)_1px,transparent_1px)] [background-size:70px_70px]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.35em] !text-[#F5F0E6]/45">
                Apex Public School
              </p>

              <h1 className="mt-8 max-w-xl text-6xl font-semibold leading-[0.9] tracking-[-0.06em] !text-white">
                Apex CMS
              </h1>

              <p className="mt-6 max-w-lg text-sm leading-7 !text-white/50">
                Secure content management for the
                Apex Public School website.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                <span className="text-[9px] uppercase tracking-[0.22em] !text-white/35">
                  Secure administrator access
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            LOGIN SIDE
        ================================================== */}

        <section className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* MOBILE BRAND */}

            <div className="mb-10 lg:hidden">
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] !text-[#102A56]/40">
                Apex Public School
              </p>

              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] !text-[#102A56]">
                Apex CMS
              </h1>
            </div>

            {/* LOGIN CARD */}

            <div className="rounded-[2rem] border border-[#102A56]/10 bg-white p-7 shadow-[0_30px_90px_rgba(16,42,86,0.10)] md:p-9">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#102A56]">
                <LockKeyhole
                  size={20}
                  className="!text-[#F5F0E6]"
                />
              </div>

              <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.3em] !text-[#102A56]/35">
                Secure login
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] !text-[#102A56]">
                Sign in to CMS
              </h2>

              <p className="mt-3 text-sm leading-6 !text-[#10203A]/50">
                Authorized Apex administrators only.
              </p>

              {/* ERROR */}

              {error && (
                <div className="mt-6 rounded-2xl border border-red-700/10 bg-red-50 px-4 py-3">
                  <p className="text-sm !text-red-700">
                    {error}
                  </p>
                </div>
              )}

              {/* FORM */}

              <form
                onSubmit={handleLogin}
                className="mt-8 space-y-5"
              >
                {/* EMAIL */}

                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-[0.2em] !text-[#102A56]/40">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    required
                    autoComplete="username"
                    disabled={loading}
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
                      transition
                      placeholder:!text-[#10203A]/25
                      focus:border-[#102A56]/30
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                    placeholder="admin@example.com"
                  />
                </div>

                {/* PASSWORD */}

                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-[0.2em] !text-[#102A56]/40">
                    Password
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    required
                    autoComplete="current-password"
                    disabled={loading}
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
                      transition
                      placeholder:!text-[#10203A]/25
                      focus:border-[#102A56]/30
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                    placeholder="••••••••••••"
                  />
                </div>

                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group
                    mt-2
                    inline-flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-[#102A56]
                    px-6
                    py-4
                    text-sm
                    font-semibold
                    !text-[#F5F0E6]
                    transition
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#1B3D73]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin !text-[#F5F0E6]"
                      />

                      <span className="!text-[#F5F0E6]">
                        Signing in...
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="!text-[#F5F0E6]">
                        Sign in
                      </span>

                      <ArrowRight
                        size={17}
                        className="
                          !text-[#F5F0E6]
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                        "
                      />
                    </>
                  )}
                </button>
              </form>

              {/* SECURITY */}

              <div className="mt-7 border-t border-[#102A56]/10 pt-5">
                <p className="text-center text-[9px] uppercase tracking-[0.18em] !text-[#102A56]/30">
                  Protected Apex CMS
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}