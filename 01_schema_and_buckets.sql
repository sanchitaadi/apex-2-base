-- =====================================================================
-- COMPLETE SUPABASE RESTORE SCRIPT (TABLES + DATA + BUCKETS + POLICIES)
-- Target: Run this in the SQL Editor of your NEW Supabase project
-- =====================================================================

-- 0. ENABLE REQUIRED EXTENSIONS & SECURITY FUNCTIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Helper function for admin RLS policies
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
      AND is_active = true
      AND role IN ('admin', 'super_admin')
  ) OR EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid()
      AND is_active = true
      AND role IN ('owner', 'admin', 'super_admin')
  );
END;
$$;

-- ---------------------------------------------------------------------
-- 1. STORAGE BUCKETS (20 Buckets)
-- ---------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('site-assets', 'site-assets', true, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('hero', 'hero', true, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('faculty', 'faculty', true, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('gallery', 'gallery', true, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('about', 'about', true, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('about-pages', 'about-pages', true, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('campus', 'campus', true, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('apexian-accolade', 'apexian-accolade', true, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('academic-resources', 'academic-resources', true, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('cbse-results', 'cbse-results', true, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('academic-coordinators', 'academic-coordinators', true, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('admission-criteria', 'admission-criteria', true, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('admission-applications', 'admission-applications', false, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('sdg', 'sdg', true, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('apex-notices', 'apex-notices', true, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('documents', 'documents', true, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('admission-notices', 'admission-notices', true, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('apex-admission-notices', 'apex-admission-notices', true, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('mandatory-disclosures', 'mandatory-disclosures', true, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('apex-blogs', 'apex-blogs', true, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- ---------------------------------------------------------------------
-- 2. TABLE SCHEMAS & DATA
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "public"."blogs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "is_active" boolean DEFAULT true,
  "is_published" boolean DEFAULT true,
  "status" text DEFAULT 'draft',
  "blog_id" uuid,
  "declaration_accepted" boolean DEFAULT true,
  "created_at" timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "public"."pages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "is_active" boolean DEFAULT true,
  "is_published" boolean DEFAULT true,
  "status" text DEFAULT 'draft',
  "blog_id" uuid,
  "declaration_accepted" boolean DEFAULT true,
  "created_at" timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "public"."events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "is_active" boolean DEFAULT true,
  "is_published" boolean DEFAULT true,
  "status" text DEFAULT 'draft',
  "blog_id" uuid,
  "declaration_accepted" boolean DEFAULT true,
  "created_at" timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "public"."faculty" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "is_active" boolean DEFAULT true,
  "is_published" boolean DEFAULT true,
  "status" text DEFAULT 'draft',
  "blog_id" uuid,
  "declaration_accepted" boolean DEFAULT true,
  "created_at" timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "public"."notices" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug" text,
  "title" text,
  "content" text,
  "excerpt" text,
  "category" text,
  "file_url" text,
  "image_url" text,
  "is_active" boolean DEFAULT true,
  "is_pinned" boolean DEFAULT true,
  "created_at" timestamptz DEFAULT now(),
  "sort_order" integer DEFAULT 0,
  "updated_at" timestamptz DEFAULT now(),
  "expiry_date" date,
  "notice_date" date,
  "notice_type" text,
  "storage_url" text,
  "document_url" text,
  "external_url" text,
  "is_published" boolean DEFAULT true,
  "published_at" timestamptz DEFAULT now(),
  "short_description" text,
  "homepage_button_url" text,
  "homepage_button_label" text
);

