"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import {
  Check,
  ExternalLink,
  Globe,
  Image as ImageIcon,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase/browser";

/* =========================================================
   TYPES
========================================================= */

type SiteSettings = {
  school_name: string;
  tagline: string;
  cbse_code: string;
  phone: string;
  email: string;
  address: string;
  logo_url: string;
  favicon_url: string;
  footer_description: string;
  maps_url: string;
  website_url: string;
};

/* =========================================================
   DEFAULT VALUES
========================================================= */

const DEFAULT_SETTINGS: SiteSettings = {
  school_name: "Apex Public School",
  tagline: "Answer Duty's Call",
  cbse_code: "2730184",
  phone: "09990061747",
  email: "contacts.apexschool@gmail.com",
  address:
    "Apex Road, B-Block, Sant Nagar, Burari, Delhi – 110084",

  logo_url:
    "https://apexpublicschool.in/wp-content/uploads/2019/06/logo-white.png",

  favicon_url: "",

  footer_description:
    "A co-educational school committed to the mental, physical, moral and social development of its students.",

  maps_url:
    "https://www.google.com/maps/search/?api=1&query=Apex+Public+School,+Apex+Road,+B-Block,+Sant+Nagar,+Burari,+Delhi+110084",

  website_url: "https://apexpublicschool.in/",
};

/* =========================================================
   PAGE
========================================================= */

export default function AdminSettingsPage() {
  const [settings, setSettings] =
    useState<SiteSettings>(DEFAULT_SETTINGS);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [uploadingLogo, setUploadingLogo] =
    useState(false);

  const [uploadProgress, setUploadProgress] =
    useState("");

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  /* =======================================================
     LOAD SETTINGS
  ======================================================= */

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      setLoading(true);
      setError("");

      try {
        const { data, error: fetchError } =
          await supabase
            .from("site_settings")
            .select(
              "id, setting_key, setting_value, is_public, updated_at"
            )
            .eq("setting_key", "global")
            .order("updated_at", {
              ascending: false,
            })
            .limit(1);

        if (fetchError) {
          throw fetchError;
        }

        if (!active) return;

        const row = data?.[0];

        if (row?.setting_value) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...(row.setting_value as Partial<SiteSettings>),
          });
        } else {
          setSettings(DEFAULT_SETTINGS);
        }
      } catch (err: unknown) {
        console.error(
          "Failed to load site settings:",
          err
        );

        if (!active) return;

        const message =
          err instanceof Error
            ? err.message
            : "Could not load website settings.";

        setError(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  /* =======================================================
     UPDATE FIELD
  ======================================================= */

  function updateField(
    field: keyof SiteSettings,
    value: string
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  }

  /* =======================================================
     UPLOAD LOGO
  ======================================================= */

  async function handleLogoUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setSaved(false);
    setUploadingLogo(true);
    setUploadProgress("Checking image...");

    try {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/svg+xml",
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          "Please upload PNG, JPG, WEBP or SVG."
        );
      }

      const maxSize = 5 * 1024 * 1024;

      if (file.size > maxSize) {
        throw new Error(
          "Image size must be smaller than 5 MB."
        );
      }

      setUploadProgress("Uploading image...");

      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() || "png";

      const safeExtension =
        extension === "jpeg"
          ? "jpg"
          : extension;

      const fileName =
        `logo-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}.${safeExtension}`;

      const filePath =
        `branding/${fileName}`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from("site-assets")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      setUploadProgress(
        "Generating public image URL..."
      );

      const {
        data: publicUrlData,
      } = supabase.storage
        .from("site-assets")
        .getPublicUrl(filePath);

      const publicUrl =
        publicUrlData?.publicUrl;

      if (!publicUrl) {
        throw new Error(
          "Could not generate the public image URL."
        );
      }

      updateField(
        "logo_url",
        publicUrl
      );

      setUploadProgress(
        "Logo uploaded successfully."
      );

      setTimeout(() => {
        setUploadProgress("");
      }, 2500);
    } catch (err: unknown) {
      console.error(
        "Logo upload failed:",
        err
      );

      setUploadProgress("");

      const message =
        err instanceof Error
          ? err.message
          : "Could not upload the logo.";

      setError(message);
    } finally {
      setUploadingLogo(false);

      // Allows uploading the same file again
      event.target.value = "";
    }
  }

  /* =======================================================
     REMOVE LOGO
  ======================================================= */

  function removeLogo() {
    updateField("logo_url", "");
  }

  /* =======================================================
     SAVE SETTINGS
  ======================================================= */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const payload = {
        setting_key: "global",
        setting_value: settings,
        is_public: true,
        updated_at:
          new Date().toISOString(),
      };

      const {
        error: saveError,
      } = await supabase
        .from("site_settings")
        .upsert(payload, {
          onConflict: "setting_key",
        });

      if (saveError) {
        throw saveError;
      }

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err: unknown) {
      console.error(
        "Save settings failed:",
        err
      );

      const message =
        err instanceof Error
          ? err.message
          : "Could not save website settings.";

      setError(message);
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[600px] max-w-[1400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-full border border-[#102A56]/10 bg-white text-[#102A56]">
            <Loader2
              size={19}
              className="animate-spin"
            />
          </div>

          <p className="text-sm text-[#102A56]/45">
            Loading website settings...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <div className="mx-auto max-w-[1400px]">

      {/* ===================================================
          HEADER
      ================================================== */}

      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#102A56]/35">
            Website settings
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-[#102A56] md:text-5xl">
            Control the identity of Apex.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#10203A]/50">
            Manage the school&apos;s global identity,
            branding and contact information without
            editing the website code.
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="
            inline-flex
            items-center
            gap-2
            self-start
            rounded-full
            border
            border-[#102A56]/10
            bg-white
            px-4
            py-3
            text-xs
            font-medium
            text-[#102A56]
            transition
            hover:-translate-y-0.5
            hover:shadow-sm
          "
        >
          Open website
          <ExternalLink size={13} />
        </a>
      </div>

      {/* ===================================================
          ALERTS
      ================================================== */}

      {saved && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-700/10 bg-emerald-700/[0.06] px-4 py-3 text-sm text-emerald-800">
          <Check size={16} />
          Website settings saved successfully.
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-red-700/10 bg-red-700/[0.05] px-4 py-3 text-sm text-red-800">
          <span className="break-words">
            {error}
          </span>

          <button
            type="button"
            onClick={() => setError("")}
            className="shrink-0 rounded-full p-1 transition hover:bg-red-700/10"
            aria-label="Dismiss error"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* ===================================================
          FORM
      ================================================== */}

      <form onSubmit={handleSubmit}>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">

          {/* =================================================
              LEFT COLUMN
          ================================================== */}

          <div className="space-y-6">

            {/* SCHOOL IDENTITY */}
            <section className="rounded-[2rem] border border-[#102A56]/10 bg-white/70 p-6 md:p-8">

              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#102A56]/[0.06] text-[#102A56]">
                  <ShieldCheck size={17} />
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.24em] text-[#102A56]/30">
                    Identity
                  </p>

                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.035em] text-[#102A56]">
                    School identity
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-[#10203A]/40">
                    These values can be used across
                    the header, homepage and footer.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-2">

                <Field
                  label="School name"
                  value={settings.school_name}
                  onChange={(value) =>
                    updateField(
                      "school_name",
                      value
                    )
                  }
                />

                <Field
                  label="Tagline"
                  value={settings.tagline}
                  onChange={(value) =>
                    updateField(
                      "tagline",
                      value
                    )
                  }
                />

                <Field
                  label="CBSE code"
                  value={settings.cbse_code}
                  onChange={(value) =>
                    updateField(
                      "cbse_code",
                      value
                    )
                  }
                />

                <Field
                  label="Phone"
                  value={settings.phone}
                  onChange={(value) =>
                    updateField(
                      "phone",
                      value
                    )
                  }
                />

              </div>
            </section>

            {/* CONTACT */}
            <section className="rounded-[2rem] border border-[#102A56]/10 bg-white/70 p-6 md:p-8">

              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#102A56]/[0.06] text-[#102A56]">
                  <MapPin size={17} />
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.24em] text-[#102A56]/30">
                    Contact
                  </p>

                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.035em] text-[#102A56]">
                    School contact details
                  </h2>
                </div>
              </div>

              <div className="mt-8 space-y-5">

                <Field
                  label="Email"
                  type="email"
                  value={settings.email}
                  onChange={(value) =>
                    updateField(
                      "email",
                      value
                    )
                  }
                  icon={Mail}
                />

                <TextAreaField
                  label="Address"
                  value={settings.address}
                  onChange={(value) =>
                    updateField(
                      "address",
                      value
                    )
                  }
                  rows={3}
                />

                <Field
                  label="Google Maps URL"
                  value={settings.maps_url}
                  onChange={(value) =>
                    updateField(
                      "maps_url",
                      value
                    )
                  }
                />

              </div>
            </section>

            {/* FOOTER */}
            <section className="rounded-[2rem] border border-[#102A56]/10 bg-white/70 p-6 md:p-8">

              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#102A56]/[0.06] text-[#102A56]">
                  <Globe size={17} />
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.24em] text-[#102A56]/30">
                    Footer
                  </p>

                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.035em] text-[#102A56]">
                    Website footer
                  </h2>
                </div>
              </div>

              <div className="mt-8">
                <TextAreaField
                  label="Footer description"
                  value={
                    settings.footer_description
                  }
                  onChange={(value) =>
                    updateField(
                      "footer_description",
                      value
                    )
                  }
                  rows={5}
                />
              </div>
            </section>

          </div>

          {/* =================================================
              RIGHT COLUMN
          ================================================== */}

          <div className="space-y-6">

            {/* =================================================
                LOGO
            ================================================== */}

            <section className="rounded-[2rem] border border-[#102A56]/10 bg-[#102A56] p-6 text-white md:p-8">

              <div className="flex items-start gap-4">

                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.08]">
                  <ImageIcon size={17} />
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.24em] text-white/30">
                    Branding
                  </p>

                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.035em]">
                    School logo
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-white/35">
                    Upload your logo directly to
                    Supabase Storage.
                  </p>
                </div>

              </div>

              {/* PREVIEW */}
              <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#F5F0E6]">

                <div className="flex min-h-[180px] items-center justify-center p-6">

                  {settings.logo_url ? (
                    <img
                      src={settings.logo_url}
                      alt="Apex Public School logo"
                      className="
                        max-h-[150px]
                        max-w-[230px]
                        object-contain
                        brightness-0
                      "
                    />
                  ) : (
                    <div className="text-sm text-[#102A56]/30">
                      No logo uploaded
                    </div>
                  )}

                </div>

              </div>

              {/* UPLOAD BUTTON */}
              <label
                className={`
                  mt-5
                  flex
                  items-center
                  justify-center
                  gap-3
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.06]
                  px-4
                  py-4
                  text-sm
                  font-medium
                  text-white
                  transition
                  ${
                    uploadingLogo
                      ? "cursor-wait opacity-60"
                      : "cursor-pointer hover:bg-white/[0.10]"
                  }
                `}
              >

                {uploadingLogo ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Upload new logo
                  </>
                )}

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                  className="hidden"
                />

              </label>

              {/* REMOVE BUTTON */}
              {settings.logo_url && (
                <button
                  type="button"
                  onClick={removeLogo}
                  disabled={uploadingLogo}
                  className="
                    mt-3
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-white/10
                    px-4
                    py-3
                    text-xs
                    text-white/45
                    transition
                    hover:border-red-200/20
                    hover:bg-red-300/[0.05]
                    hover:text-red-200
                  "
                >
                  <X size={14} />
                  Remove logo
                </button>
              )}

              {/* UPLOAD STATUS */}
              {uploadProgress && (
                <div className="mt-4 flex items-center gap-2 text-[10px] text-[#F5F0E6]/55">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#8DC7FF] shadow-[0_0_10px_rgba(141,199,255,0.8)]" />
                  {uploadProgress}
                </div>
              )}

              <p className="mt-4 text-[9px] leading-4 text-white/25">
                PNG, JPG, WEBP or SVG · Maximum 5 MB
              </p>

            </section>

            {/* QUICK CONTACT PREVIEW */}
            <section className="rounded-[2rem] border border-[#102A56]/10 bg-white/70 p-6 md:p-8">

              <div className="flex items-center gap-3">

                <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#102A56]/[0.06] text-[#102A56]">
                  <Phone size={16} />
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#102A56]/30">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#102A56]">
                    {settings.phone ||
                      "No phone number"}
                  </p>
                </div>

              </div>

              <div className="mt-5 h-px bg-[#102A56]/10" />

              <div className="mt-5">

                <p className="text-[9px] uppercase tracking-[0.2em] text-[#102A56]/30">
                  Email
                </p>

                <p className="mt-2 break-all text-sm font-medium text-[#102A56]">
                  {settings.email ||
                    "No email"}
                </p>

              </div>

            </section>

            {/* WEBSITE URL */}
            <section className="rounded-[2rem] border border-[#102A56]/10 bg-white/70 p-6 md:p-8">

              <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/30">
                Public website URL
              </label>

              <input
                type="url"
                value={settings.website_url}
                onChange={(event) =>
                  updateField(
                    "website_url",
                    event.target.value
                  )
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-[#102A56]/10
                  bg-white
                  px-4
                  py-3
                  text-sm
                  text-[#102A56]
                  outline-none
                  transition
                  focus:border-[#102A56]/25
                  focus:ring-2
                  focus:ring-[#102A56]/[0.03]
                "
              />

            </section>

          </div>
        </div>

        {/* ===================================================
            SAVE BAR
        ==================================================== */}

        <div className="sticky bottom-4 z-20 mt-8 flex justify-end">

          <div className="flex items-center gap-3 rounded-2xl border border-[#102A56]/10 bg-[#F4F1EA]/90 p-2 shadow-[0_15px_50px_rgba(16,42,86,0.12)] backdrop-blur-xl">

            {saved && (
              <span className="hidden items-center gap-2 px-3 text-xs text-emerald-700 sm:flex">
                <Check size={14} />
                Saved
              </span>
            )}

            <button
              type="submit"
              disabled={
                saving ||
                uploadingLogo
              }
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-[#102A56]
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:-translate-y-0.5
                hover:bg-[#1B3D73]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {saving ? (
                <>
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={15} />
                  Save changes
                </>
              )}

            </button>

          </div>
        </div>

      </form>
    </div>
  );
}

/* =========================================================
   INPUT FIELD
========================================================= */

function Field({
  label,
  value,
  onChange,
  type = "text",
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  icon?: React.ElementType;
}) {
  return (
    <div>
      <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/35">
        {label}
      </label>

      <div className="relative">

        {Icon && (
          <Icon
            size={15}
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-[#102A56]/25
            "
          />
        )}

        <input
          type={type}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className={`
            w-full
            rounded-xl
            border
            border-[#102A56]/10
            bg-white
            px-4
            py-3
            text-sm
            text-[#102A56]
            outline-none
            transition
            focus:border-[#102A56]/25
            focus:ring-2
            focus:ring-[#102A56]/[0.03]
            ${Icon ? "pl-11" : ""}
          `}
        />

      </div>
    </div>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <div>

      <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#102A56]/35">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        rows={rows}
        className="
          w-full
          resize-none
          rounded-xl
          border
          border-[#102A56]/10
          bg-white
          px-4
          py-3
          text-sm
          leading-6
          text-[#102A56]
          outline-none
          transition
          focus:border-[#102A56]/25
          focus:ring-2
          focus:ring-[#102A56]/[0.03]
        "
      />

    </div>
  );
}