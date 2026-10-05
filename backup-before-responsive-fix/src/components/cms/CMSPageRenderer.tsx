"use client";

type Section = {
  id: string;
  type: string;
  title?: string;
  content?: string;
  image_url?: string;
  button_text?: string;
  button_url?: string;
  background_color?: string;
  text_color?: string;
  alignment?: "left" | "center" | "right";
  padding?: string;
  visible?: boolean;
};

type CMSPageRendererProps = {
  sections: Section[];
};

export default function CMSPageRenderer({
  sections,
}: CMSPageRendererProps) {
  if (!sections || sections.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h1 className="text-3xl font-bold text-[#13294b]">
          Page Coming Soon
        </h1>

        <p className="mt-4 text-slate-600">
          This page has not been designed yet.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {sections
        .filter(
          (section) =>
            section.visible !== false
        )
        .map((section) => (
          <CMSSection
            key={section.id}
            section={section}
          />
        ))}
    </div>
  );
}

function CMSSection({
  section,
}: {
  section: Section;
}) {
  const background =
    section.background_color ||
    "#ffffff";

  const textColor =
    section.text_color ||
    "#13294b";

  const alignment =
    section.alignment ||
    "center";

  const padding =
    section.padding ||
    "80px";

  /*
   * HERO
   */

  if (section.type === "hero") {
    return (
      <section
        style={{
          backgroundColor: background,
          color: textColor,
          textAlign: alignment,
          padding,
        }}
        className="relative overflow-hidden"
      >
        {section.image_url && (
          <div className="absolute inset-0">
            <img
              src={section.image_url}
              alt=""
              className="h-full w-full object-cover"
            />

            <div
              className="absolute inset-0"
              style={{
                background:
                  "rgba(0,0,0,0.35)",
              }}
            />
          </div>
        )}

        <div className="relative mx-auto max-w-6xl px-6">
          {section.title && (
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              {section.title}
            </h1>
          )}

          {section.content && (
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 opacity-90 md:text-xl">
              {section.content}
            </p>
          )}

          {section.button_text && (
            <CMSButton
              text={section.button_text}
              url={section.button_url}
            />
          )}
        </div>
      </section>
    );
  }

  /*
   * IMAGE
   */

  if (section.type === "image") {
    return (
      <section
        style={{
          backgroundColor: background,
          color: textColor,
          textAlign: alignment,
          padding,
        }}
      >
        <div className="mx-auto max-w-6xl px-6">

          {section.title && (
            <h2 className="text-3xl font-bold md:text-4xl">
              {section.title}
            </h2>
          )}

          {section.content && (
            <p className="mx-auto mt-4 max-w-3xl opacity-80">
              {section.content}
            </p>
          )}

          {section.image_url && (
            <img
              src={section.image_url}
              alt={section.title || ""}
              className="mx-auto mt-8 max-h-[600px] w-full rounded-3xl object-cover shadow-lg"
            />
          )}

        </div>
      </section>
    );
  }

  /*
   * CARDS
   */

  if (section.type === "cards") {
    return (
      <section
        style={{
          backgroundColor: background,
          color: textColor,
          padding,
        }}
      >
        <div className="mx-auto max-w-6xl px-6">

          {section.title && (
            <h2
              className="text-center text-3xl font-bold md:text-4xl"
            >
              {section.title}
            </h2>
          )}

          {section.content && (
            <p className="mx-auto mt-4 max-w-2xl text-center opacity-80">
              {section.content}
            </p>
          )}

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            {[
              "Academic Excellence",
              "Student Development",
              "Modern Campus",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl bg-white p-8 text-center shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                style={{
                  color: "#13294b",
                }}
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#13294b] text-xl font-bold text-white">
                  +
                </div>

                <h3 className="text-xl font-bold">
                  {item}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Discover more about Apex Public School.
                </p>
              </div>
            ))}

          </div>

          {section.button_text && (
            <div
              className="text-center"
            >
              <CMSButton
                text={section.button_text}
                url={section.button_url}
              />
            </div>
          )}

        </div>
      </section>
    );
  }

  /*
   * DEFAULT TEXT SECTION
   */

  return (
    <section
      style={{
        backgroundColor: background,
        color: textColor,
        textAlign: alignment,
        padding,
      }}
    >
      <div className="mx-auto max-w-4xl px-6">

        {section.title && (
          <h2 className="text-3xl font-bold md:text-4xl">
            {section.title}
          </h2>
        )}

        {section.content && (
          <div className="mx-auto mt-6 whitespace-pre-line text-base leading-8 opacity-90 md:text-lg">
            {section.content}
          </div>
        )}

        {section.image_url && (
          <img
            src={section.image_url}
            alt={section.title || ""}
            className="mx-auto mt-8 max-h-[500px] rounded-3xl object-cover shadow-lg"
          />
        )}

        {section.button_text && (
          <CMSButton
            text={section.button_text}
            url={section.button_url}
          />
        )}

      </div>
    </section>
  );
}

function CMSButton({
  text,
  url,
}: {
  text: string;
  url?: string;
}) {
  return (
    <a
      href={url || "#"}
      className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#13294b] px-7 py-3 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#1d3c67]"
    >
      {text}
    </a>
  );
}
