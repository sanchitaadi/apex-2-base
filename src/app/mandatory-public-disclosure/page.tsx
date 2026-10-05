import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

type DisclosureDocument = {
  id?: string;
  description: string;
  document_url: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export const dynamic = "force-dynamic";

export default async function MandatoryDisclosurePage() {
  const { data: documents, error } = await supabase
    .from("mandatory_public_disclosures")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Mandatory disclosure error:", error);
  }

  const disclosureDocuments: DisclosureDocument[] = documents || [];

  return (
    <main className="min-h-screen bg-[#f7f4ed] text-[#17345f]">
      {/* =========================================================
          PAGE HEADER
      ========================================================= */}
      <section className="mx-auto max-w-[1500px] px-6 pb-10 pt-20 md:px-12 md:pt-24">
        <div className="max-w-5xl">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#8a9ab0]">
            Official Documents
          </p>

          <h1 className="text-5xl font-semibold tracking-[-0.04em] text-[#17345f] md:text-7xl">
            Disclosure documents
          </h1>

          <p className="mt-6 max-w-4xl text-base leading-8 text-[#718198] md:text-lg">
            Access the official disclosure information and supporting documents
            published by Apex Public School.
          </p>
        </div>
      </section>

      {/* =========================================================
          DISCLOSURE DOCUMENTS
      ========================================================= */}
      <section className="mx-auto max-w-[1500px] px-6 pb-20 md:px-12">
        {disclosureDocuments.length === 0 ? (
          /* =====================================================
             NO DOCUMENTS
          ===================================================== */
          <div className="rounded-[32px] bg-[#17345f] px-10 py-12 text-white shadow-sm">
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                  <path d="M8 13h8" />
                  <path d="M8 17h5" />
                </svg>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">
                  Documents unavailable
                </h2>

                <p className="mt-2 text-sm text-white/65">
                  No mandatory disclosure documents are currently published.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* =====================================================
             DOCUMENT LIST
          ===================================================== */
          <div className="space-y-6">
            {disclosureDocuments.map((document) => {
              const documentUrl = document.document_url?.trim();

              const validDocumentUrl =
                documentUrl &&
                documentUrl !== "YOUR_ACTUAL_PDF_URL" &&
                !documentUrl.includes("example.com");

              return (
                <div
                  key={
                    document.id ||
                    `${document.description}-${document.sort_order}`
                  }
                  className="
                    flex
                    flex-col
                    gap-7
                    rounded-[32px]
                    bg-[#173b70]
                    px-8
                    py-9
                    text-white
                    shadow-sm
                    md:flex-row
                    md:items-center
                    md:justify-between
                    md:px-11
                  "
                >
                  {/* =================================================
                      DOCUMENT INFORMATION
                  ================================================= */}
                  <div className="flex min-w-0 items-center gap-5">
                    {/* DOCUMENT ICON */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                      <svg
                        width="27"
                        height="27"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path d="M14 2v6h6" />
                        <path d="M8 13h8" />
                        <path d="M8 17h5" />
                      </svg>
                    </div>

                    {/* DOCUMENT TEXT */}
                    <div className="min-w-0">
                      <h2 className="truncate text-xl font-semibold md:text-2xl">
                        {document.description}
                      </h2>

                      <p className="mt-2 text-sm text-white/65">
                        Official school disclosure document
                      </p>
                    </div>
                  </div>

                  {/* =================================================
                      VIEW DOCUMENT BUTTON
                  ================================================= */}
                  {validDocumentUrl ? (
                    <a
                      href={documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${document.description}`}
                      className="
                        inline-flex
                        shrink-0
                        items-center
                        justify-center
                        gap-2
                        rounded-full
                        bg-white
                        px-7
                        py-4
                        text-sm
                        font-semibold
                        !text-[#17345f]
                        no-underline
                        shadow-sm
                        transition-all
                        duration-200
                        hover:-translate-y-0.5
                        hover:bg-[#eaf0f8]
                        hover:!text-[#102d55]
                        hover:shadow-lg
                        focus:outline-none
                        focus:ring-2
                        focus:ring-white
                        focus:ring-offset-2
                        focus:ring-offset-[#173b70]
                        active:translate-y-0
                      "
                    >
                      <span className="!text-[#17345f]">
                        View document
                      </span>

                      {/* EXTERNAL LINK ICON */}
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#17345f"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M14 3h7v7" />
                        <path d="M10 14L21 3" />
                        <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
                      </svg>
                    </a>
                  ) : (
                    /* =================================================
                       INVALID / MISSING DOCUMENT
                    ================================================= */
                    <span
                      className="
                        inline-flex
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-white/10
                        px-7
                        py-4
                        text-sm
                        font-semibold
                        text-white/50
                      "
                    >
                      Document unavailable
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* =========================================================
          SCHOOL DETAILS
      ========================================================= */}
      <section className="mx-auto max-w-[1500px] px-6 pb-20 md:px-12">
        <div className="grid overflow-hidden rounded-[32px] bg-[#173b70] text-white md:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="px-10 py-12 md:px-12 md:py-14">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/40">
              Apex Public School
            </p>

            <h2 className="mt-7 text-3xl font-semibold md:text-4xl">
              Official school details
            </h2>
          </div>

          {/* RIGHT SIDE */}
          <div className="border-t border-white/10 px-10 py-12 md:border-l md:border-t-0 md:px-12 md:py-14">
            {/* ADDRESS */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/40">
                Address
              </p>

              <p className="mt-5 text-base leading-7 text-white/65">
                Apex Road, B-Block, Sant Nagar, Burari, Delhi – 110084
              </p>
            </div>

            {/* PHONE */}
            <div className="mt-9">
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/40">
                Phone
              </p>

              <p className="mt-5 text-base text-white/65">
                09990061747
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}