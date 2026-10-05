import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CMSPageRenderer from "@/components/cms/CMSPageRenderer";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CMSPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: page, error } = await supabase
    .from("cms_pages")
    .select(
      `
        id,
        title,
        slug,
        status,
        layout_json
      `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error(
      "CMS public page error:",
      error
    );

    notFound();
  }

  if (!page) {
    notFound();
  }

  const sections =
    page.layout_json?.sections || [];

  return (
    <main className="min-h-screen">
      <CMSPageRenderer
        sections={sections}
      />
    </main>
  );
}
