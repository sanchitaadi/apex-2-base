-- =====================================================================
-- MASTER FIX & SCHEMA CORRECTION SCRIPT FOR APEX PUBLIC SCHOOL
-- Run this in the SQL Editor of your NEW Supabase project (ngqzmzlpjpbitxetqltj)
-- Safe, idempotent, preserves all existing tables and data.
-- =====================================================================

-- 1. EXTENSIONS & ENHANCED ADMIN SECURITY FUNCTION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE (id = auth.uid() OR LOWER(email) = LOWER(auth.jwt() ->> 'email'))
      AND is_active = true
      AND role IN ('admin', 'super_admin')
  ) OR EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE (id = auth.uid() OR LOWER(email) = LOWER(auth.jwt() ->> 'email'))
      AND is_active = true
      AND role IN ('owner', 'admin', 'super_admin')
  );
END;
$$;

-- 2. UNIQUE CONSTRAINTS (Enables UPSERT on settings, about pages, blogs, etc.)
DO $$ BEGIN
  ALTER TABLE public.site_settings ADD CONSTRAINT site_settings_setting_key_unique UNIQUE (setting_key);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.about_pages ADD CONSTRAINT about_pages_slug_unique UNIQUE (slug);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.blog_posts ADD CONSTRAINT blog_posts_slug_unique UNIQUE (slug);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.admission_applications ADD CONSTRAINT admission_applications_app_number_unique UNIQUE (application_number);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 3. ENSURE ALL COLUMNS EXIST ON BLOG_POSTS & BLOG_IMAGES
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS "title" text DEFAULT '';
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS "slug" text;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS "excerpt" text;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS "content" text;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS "author_name" text;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS "category" text;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'draft';
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS "publish_date" timestamptz;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS "cover_image_url" text;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS "cover_image_alt" text;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS "is_featured" boolean DEFAULT false;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS "sort_order" integer DEFAULT 0;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS "seo_title" text;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS "seo_description" text;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now();

ALTER TABLE public.blog_images ADD COLUMN IF NOT EXISTS "blog_id" uuid;
ALTER TABLE public.blog_images ADD COLUMN IF NOT EXISTS "image_url" text;
ALTER TABLE public.blog_images ADD COLUMN IF NOT EXISTS "image_alt" text;
ALTER TABLE public.blog_images ADD COLUMN IF NOT EXISTS "caption" text;
ALTER TABLE public.blog_images ADD COLUMN IF NOT EXISTS "sort_order" integer DEFAULT 0;
ALTER TABLE public.blog_images ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
ALTER TABLE public.blog_images ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now();

-- 4. ENSURE ALL COLUMNS EXIST ON ACTIVITIES
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS "title" text DEFAULT '';
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS "slug" text;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS "category" text DEFAULT 'General';
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS "image_url" text;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS "event_date" date;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS "external_url" text;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS "document_url" text;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS "sort_order" integer DEFAULT 0;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS "is_featured" boolean DEFAULT false;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now();

-- 5. ENSURE ALL COLUMNS EXIST ON ACADEMIC_RESOURCES
ALTER TABLE public.academic_resources ADD COLUMN IF NOT EXISTS "title" text DEFAULT '';
ALTER TABLE public.academic_resources ADD COLUMN IF NOT EXISTS "category" text DEFAULT 'General';
ALTER TABLE public.academic_resources ADD COLUMN IF NOT EXISTS "class_name" text;
ALTER TABLE public.academic_resources ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE public.academic_resources ADD COLUMN IF NOT EXISTS "document_url" text;
ALTER TABLE public.academic_resources ADD COLUMN IF NOT EXISTS "external_url" text;
ALTER TABLE public.academic_resources ADD COLUMN IF NOT EXISTS "document_label" text;
ALTER TABLE public.academic_resources ADD COLUMN IF NOT EXISTS "resource_type" text;
ALTER TABLE public.academic_resources ADD COLUMN IF NOT EXISTS "sort_order" integer DEFAULT 0;
ALTER TABLE public.academic_resources ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE public.academic_resources ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
ALTER TABLE public.academic_resources ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now();

-- 6. ENSURE ALL COLUMNS EXIST ON ADMISSION_APPLICATIONS
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "application_number" text;
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "session" text;
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'submitted';
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "student_name" text DEFAULT '';
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "date_of_birth" date;
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "gender" text;
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "class_applying_for" text DEFAULT '';
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "stream" text;
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "previous_school" text;
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "previous_class" text;
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "previous_result" text;
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "father_name" text;
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "mother_name" text;
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "guardian_name" text;
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "parent_mobile" text DEFAULT '';
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "parent_email" text;
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "address" text;
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "city" text;
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "state" text;
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "pincode" text;
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "photograph_path" text;
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "marksheet_path" text;
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "birth_certificate_path" text;
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "other_document_paths" text[] DEFAULT '{}'::text[];
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "declaration_accepted" boolean DEFAULT true;
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "admin_notes" text;
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now();

-- 7. ENSURE ALL COLUMNS EXIST ON EVENTS, ACHIEVEMENTS, FACULTY & OTHERS
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS "title" text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS "event_date" date;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS "image_url" text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS "sort_order" integer DEFAULT 0;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS "is_published" boolean DEFAULT true;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now();

ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS "title" text;
ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS "image_url" text;
ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS "sort_order" integer DEFAULT 0;
ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now();

ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS "name" text;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS "role" text;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS "department" text;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS "image_url" text;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS "sort_order" integer DEFAULT 0;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now();

ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS "title" text;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS "document_url" text;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS "sort_order" integer DEFAULT 0;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now();

ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS "title" text;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS "slug" text;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS "content" text;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS "sort_order" integer DEFAULT 0;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS "is_published" boolean DEFAULT true;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now();

ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS "title" text;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS "slug" text;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS "content" text;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS "sort_order" integer DEFAULT 0;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'draft';
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now();

ALTER TABLE public.cms_blogs ADD COLUMN IF NOT EXISTS "title" text;
ALTER TABLE public.cms_blogs ADD COLUMN IF NOT EXISTS "slug" text;
ALTER TABLE public.cms_blogs ADD COLUMN IF NOT EXISTS "content" text;
ALTER TABLE public.cms_blogs ADD COLUMN IF NOT EXISTS "sort_order" integer DEFAULT 0;
ALTER TABLE public.cms_blogs ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE public.cms_blogs ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'draft';
ALTER TABLE public.cms_blogs ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
ALTER TABLE public.cms_blogs ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now();

ALTER TABLE public.accolade_images ADD COLUMN IF NOT EXISTS "title" text;
ALTER TABLE public.accolade_images ADD COLUMN IF NOT EXISTS "image_url" text;
ALTER TABLE public.accolade_images ADD COLUMN IF NOT EXISTS "sort_order" integer DEFAULT 0;
ALTER TABLE public.accolade_images ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE public.accolade_images ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
ALTER TABLE public.accolade_images ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now();

ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS "name" text;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS "email" text;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS "phone" text;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS "message" text;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'new';
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();

ALTER TABLE public.homepage_sections ADD COLUMN IF NOT EXISTS "section_key" text;
ALTER TABLE public.homepage_sections ADD COLUMN IF NOT EXISTS "section_name" text;
ALTER TABLE public.homepage_sections ADD COLUMN IF NOT EXISTS "sort_order" integer DEFAULT 0;
ALTER TABLE public.homepage_sections ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE public.homepage_sections ADD COLUMN IF NOT EXISTS "content" jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.homepage_sections ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
ALTER TABLE public.homepage_sections ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now();

ALTER TABLE public.virtual_tour_settings ADD COLUMN IF NOT EXISTS "sort_order" integer DEFAULT 0;

-- 8. STORAGE BUCKETS (All 20 Buckets)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('site-assets', 'site-assets', true, NULL, NULL),
  ('hero', 'hero', true, NULL, NULL),
  ('faculty', 'faculty', true, NULL, NULL),
  ('gallery', 'gallery', true, NULL, NULL),
  ('about', 'about', true, NULL, NULL),
  ('about-pages', 'about-pages', true, NULL, NULL),
  ('campus', 'campus', true, NULL, NULL),
  ('apexian-accolade', 'apexian-accolade', true, NULL, NULL),
  ('academic-resources', 'academic-resources', true, NULL, NULL),
  ('cbse-results', 'cbse-results', true, NULL, NULL),
  ('academic-coordinators', 'academic-coordinators', true, NULL, NULL),
  ('admission-criteria', 'admission-criteria', true, NULL, NULL),
  ('admission-applications', 'admission-applications', false, NULL, NULL),
  ('sdg', 'sdg', true, NULL, NULL),
  ('apex-notices', 'apex-notices', true, NULL, NULL),
  ('documents', 'documents', true, NULL, NULL),
  ('admission-notices', 'admission-notices', true, NULL, NULL),
  ('apex-admission-notices', 'apex-admission-notices', true, NULL, NULL),
  ('mandatory-disclosures', 'mandatory-disclosures', true, NULL, NULL),
  ('apex-blogs', 'apex-blogs', true, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- 9. SAFE STORAGE OBJECT POLICIES (Enables Admin Uploads & Public Views)
DO $$ BEGIN
  CREATE POLICY "Public can view public bucket objects" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id IN (SELECT id FROM storage.buckets WHERE public = true));
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins and authenticated users can upload storage objects" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id IN (SELECT id FROM storage.buckets));
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins and authenticated users can update storage objects" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id IN (SELECT id FROM storage.buckets));
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins and authenticated users can delete storage objects" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id IN (SELECT id FROM storage.buckets));
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 10. ENABLE RLS & CREATE POLICIES FOR ALL MODIFIED TABLES
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read active blogs" ON public.blog_posts
    FOR SELECT TO public USING (is_active = true AND status = 'published');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "Admins manage blog_posts" ON public.blog_posts
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE public.blog_images ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read blog images" ON public.blog_images
    FOR SELECT TO public USING (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "Admins manage blog_images" ON public.blog_images
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read active activities" ON public.activities
    FOR SELECT TO public USING (is_active = true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "Admins manage activities" ON public.activities
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE public.academic_resources ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read active academic_resources" ON public.academic_resources
    FOR SELECT TO public USING (is_active = true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "Admins manage academic_resources" ON public.academic_resources
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE public.admission_applications ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public insert admission applications" ON public.admission_applications
    FOR INSERT TO public WITH CHECK (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "Admins manage admission_applications" ON public.admission_applications
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins manage site_settings" ON public.site_settings
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins manage about_pages" ON public.about_pages
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
