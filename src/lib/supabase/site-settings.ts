import { supabase } from "@/lib/supabase/browser";

export type SiteSettings = {
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

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
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

export async function getSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("setting_value")
    .eq("setting_key", "global")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Could not load site settings:", error);
    return DEFAULT_SITE_SETTINGS;
  }

  if (!data?.setting_value) {
    return DEFAULT_SITE_SETTINGS;
  }

  return {
    ...DEFAULT_SITE_SETTINGS,
    ...(data.setting_value as Partial<SiteSettings>),
  };
}