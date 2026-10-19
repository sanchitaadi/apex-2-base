-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ---------------------------------------------------------------------
ALTER TABLE "public"."homepage_sections" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE "public"."events" ADD COLUMN IF NOT EXISTS "is_published" boolean DEFAULT true;
ALTER TABLE "public"."faculty" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE "public"."activities" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE "public"."activities" ADD COLUMN IF NOT EXISTS "is_published" boolean DEFAULT true;
ALTER TABLE "public"."achievements" ADD COLUMN IF NOT EXISTS "is_published" boolean DEFAULT true;
ALTER TABLE "public"."academic_resources" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE "public"."pages" ADD COLUMN IF NOT EXISTS "is_published" boolean DEFAULT true;
ALTER TABLE "public"."documents" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE "public"."accolade_images" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE "public"."admission_applications" ADD COLUMN IF NOT EXISTS "declaration_accepted" boolean DEFAULT true;
ALTER TABLE "public"."blog_posts" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'draft';
ALTER TABLE "public"."blog_posts" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE "public"."blog_images" ADD COLUMN IF NOT EXISTS "blog_id" uuid;
ALTER TABLE "public"."cms_blogs" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'draft';
ALTER TABLE "public"."blogs" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'draft';

ALTER TABLE "public"."site_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read site settings" ON "public"."site_settings"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((is_public = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."navigation_items" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read navigation" ON "public"."navigation_items"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."hero_slides" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read hero slides" ON "public"."hero_slides"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."homepage_sections" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read homepage sections" ON "public"."homepage_sections"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."campus_facilities" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read campus facilities" ON "public"."campus_facilities"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."notices" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read notices" ON "public"."notices"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((is_published = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read events" ON "public"."events"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((is_published = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."gallery_albums" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read gallery albums" ON "public"."gallery_albums"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((is_published = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."gallery_images" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read gallery images" ON "public"."gallery_images"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((is_published = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."faculty" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read faculty" ON "public"."faculty"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."activities" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read activities" ON "public"."activities"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((is_published = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."achievements" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read achievements" ON "public"."achievements"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((is_published = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_stages" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read academic stages" ON "public"."academic_stages"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_streams" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read academic streams" ON "public"."academic_streams"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_resources" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read academic resources" ON "public"."academic_resources"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read admission settings" ON "public"."admission_settings"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."contact_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read contact settings" ON "public"."contact_settings"
    AS PERMISSIVE FOR SELECT
    TO public
    USING (true)
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."pages" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read pages" ON "public"."pages"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((is_published = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."documents" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read documents" ON "public"."documents"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admin_profiles" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can read own profile" ON "public"."admin_profiles"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING ((id = auth.uid()))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."site_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage site settings" ON "public"."site_settings"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."homepage_sections" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage homepage sections" ON "public"."homepage_sections"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage events" ON "public"."events"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."faculty" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage faculty" ON "public"."faculty"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."activities" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage activities" ON "public"."activities"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_applications" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete admission applications" ON "public"."admission_applications"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."hero_slides" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active hero slides" ON "public"."hero_slides"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."achievements" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage achievements" ON "public"."achievements"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_streams" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage academic streams" ON "public"."academic_streams"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_resources" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage academic resources" ON "public"."academic_resources"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage admission settings" ON "public"."admission_settings"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."contact_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage contact settings" ON "public"."contact_settings"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."pages" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage pages" ON "public"."pages"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."documents" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage documents" ON "public"."documents"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."contact_messages" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage contact messages" ON "public"."contact_messages"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."hero_slides" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage hero slides" ON "public"."hero_slides"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."navigation_items" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active navigation" ON "public"."navigation_items"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."navigation_items" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage navigation" ON "public"."navigation_items"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."about_content" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active about content" ON "public"."about_content"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."about_content" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage about content" ON "public"."about_content"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."notices" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage notices" ON "public"."notices"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active admissions" ON "public"."admission_settings"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."about_pages" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage about pages" ON "public"."about_pages"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."hero_slides" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view hero slides" ON "public"."hero_slides"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."hero_slides" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert hero slides" ON "public"."hero_slides"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."hero_slides" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view hero_slides" ON "public"."hero_slides"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage admissions" ON "public"."admission_settings"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_stages" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage academic stages" ON "public"."academic_stages"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."campus_facilities" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active campus facilities" ON "public"."campus_facilities"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."campus_facilities" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage campus facilities" ON "public"."campus_facilities"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."gallery_albums" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active gallery albums" ON "public"."gallery_albums"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."gallery_albums" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage gallery albums" ON "public"."gallery_albums"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."gallery_images" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active gallery images" ON "public"."gallery_images"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."gallery_images" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage gallery images" ON "public"."gallery_images"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."hero_slides" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert hero_slides" ON "public"."hero_slides"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."hero_slides" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update hero_slides" ON "public"."hero_slides"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."faculty_members" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active faculty" ON "public"."faculty_members"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."faculty_members" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view all faculty" ON "public"."faculty_members"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."faculty_members" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert faculty" ON "public"."faculty_members"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."faculty_members" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update faculty" ON "public"."faculty_members"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."faculty_members" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete faculty" ON "public"."faculty_members"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."about_pages" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active about pages" ON "public"."about_pages"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."about_pages" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view all about pages" ON "public"."about_pages"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."about_pages" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert about pages" ON "public"."about_pages"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."about_pages" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update about pages" ON "public"."about_pages"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."about_pages" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete about pages" ON "public"."about_pages"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."accolade_images" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active accolade images" ON "public"."accolade_images"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."accolade_images" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view all accolade images" ON "public"."accolade_images"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."accolade_images" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert accolade images" ON "public"."accolade_images"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."accolade_images" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update accolade images" ON "public"."accolade_images"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."accolade_images" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete accolade images" ON "public"."accolade_images"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_documents" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active academic documents" ON "public"."academic_documents"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_documents" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view all academic documents" ON "public"."academic_documents"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_documents" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert academic documents" ON "public"."academic_documents"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_documents" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update academic documents" ON "public"."academic_documents"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_documents" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete academic documents" ON "public"."academic_documents"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."cbse_result_banners" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active result banners" ON "public"."cbse_result_banners"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."cbse_result_banners" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view all result banners" ON "public"."cbse_result_banners"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."cbse_result_banners" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert result banners" ON "public"."cbse_result_banners"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."cbse_result_banners" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update result banners" ON "public"."cbse_result_banners"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."cbse_result_banners" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete result banners" ON "public"."cbse_result_banners"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_coordinators" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active academic coordinators" ON "public"."academic_coordinators"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_coordinators" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view all academic coordinators" ON "public"."academic_coordinators"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_coordinators" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert academic coordinators" ON "public"."academic_coordinators"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_coordinators" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update academic coordinators" ON "public"."academic_coordinators"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_coordinators" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete academic coordinators" ON "public"."academic_coordinators"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_applications" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update admission applications" ON "public"."admission_applications"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_criteria" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active admission criteria" ON "public"."admission_criteria"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_criteria" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view all admission criteria" ON "public"."admission_criteria"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_criteria" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert admission criteria" ON "public"."admission_criteria"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_criteria" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update admission criteria" ON "public"."admission_criteria"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_criteria" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete admission criteria" ON "public"."admission_criteria"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_registration_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view registration settings" ON "public"."admission_registration_settings"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING (true)
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_registration_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update registration settings" ON "public"."admission_registration_settings"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_registration_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert registration settings" ON "public"."admission_registration_settings"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_applications" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Anyone can submit admission application" ON "public"."admission_applications"
    AS PERMISSIVE FOR INSERT
    TO anon, authenticated
    WITH CHECK ((declaration_accepted = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_applications" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view admission applications" ON "public"."admission_applications"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_notices" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active admission notices" ON "public"."admission_notices"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_notices" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can manage admission notices" ON "public"."admission_notices"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true)
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."sdg_items" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active SDG items" ON "public"."sdg_items"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."sdg_items" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can manage SDG items" ON "public"."sdg_items"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true)
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."hero_slides" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update hero slides" ON "public"."hero_slides"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."activities" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active activities" ON "public"."activities"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."activities" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admin full access activities" ON "public"."activities"
    AS PERMISSIVE FOR ALL
    TO public
    USING (true)
    WITH CHECK (true)
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."kaushal_bodh" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active kaushal bodh" ON "public"."kaushal_bodh"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."kaushal_bodh" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admin full access kaushal bodh" ON "public"."kaushal_bodh"
    AS PERMISSIVE FOR ALL
    TO public
    USING (true)
    WITH CHECK (true)
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."contact_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view contact settings" ON "public"."contact_settings"
    AS PERMISSIVE FOR SELECT
    TO public
    USING (true)
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."contact_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admin full access contact settings" ON "public"."contact_settings"
    AS PERMISSIVE FOR ALL
    TO public
    USING (true)
    WITH CHECK (true)
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."news_events_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view news events settings" ON "public"."news_events_settings"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."news_events_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admin full access news events settings" ON "public"."news_events_settings"
    AS PERMISSIVE FOR ALL
    TO public
    USING (true)
    WITH CHECK (true)
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_resources" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active academic resources" ON "public"."academic_resources"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."hero_slides" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete hero slides" ON "public"."hero_slides"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."hero_slides" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete hero_slides" ON "public"."hero_slides"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."site_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view site_settings" ON "public"."site_settings"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."site_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert site_settings" ON "public"."site_settings"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."site_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update site_settings" ON "public"."site_settings"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."site_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete site_settings" ON "public"."site_settings"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."about_content" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view about_content" ON "public"."about_content"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."about_content" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert about_content" ON "public"."about_content"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."gallery_preview_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active gallery preview settings" ON "public"."gallery_preview_settings"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."gallery_preview_items" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active gallery preview items" ON "public"."gallery_preview_items"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."gallery_preview_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage gallery preview settings" ON "public"."gallery_preview_settings"
    AS PERMISSIVE FOR ALL
    TO public
    USING ((auth.role() = 'authenticated'::text))
    WITH CHECK ((auth.role() = 'authenticated'::text))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."gallery_preview_items" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage gallery preview items" ON "public"."gallery_preview_items"
    AS PERMISSIVE FOR ALL
    TO public
    USING ((auth.role() = 'authenticated'::text))
    WITH CHECK ((auth.role() = 'authenticated'::text))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academics_home_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active academics homepage settings" ON "public"."academics_home_settings"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academics_home_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage academics homepage settings" ON "public"."academics_home_settings"
    AS PERMISSIVE FOR ALL
    TO public
    USING ((auth.role() = 'authenticated'::text))
    WITH CHECK ((auth.role() = 'authenticated'::text))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."virtual_tour_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active virtual tour settings" ON "public"."virtual_tour_settings"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."virtual_tour_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage virtual tour settings" ON "public"."virtual_tour_settings"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true)
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."virtual_tour_highlights" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active virtual tour highlights" ON "public"."virtual_tour_highlights"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."virtual_tour_highlights" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage virtual tour highlights" ON "public"."virtual_tour_highlights"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true)
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_stages" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active academic stages" ON "public"."academic_stages"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_streams" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active academic streams" ON "public"."academic_streams"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."about_content" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update about_content" ON "public"."about_content"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."about_content" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete about_content" ON "public"."about_content"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."about_pages" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view about_pages" ON "public"."about_pages"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."about_pages" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert about_pages" ON "public"."about_pages"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."about_pages" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update about_pages" ON "public"."about_pages"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."about_pages" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete about_pages" ON "public"."about_pages"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."notices" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view notices" ON "public"."notices"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."notices" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert notices" ON "public"."notices"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."notices" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update notices" ON "public"."notices"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."notices" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete notices" ON "public"."notices"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view admission_settings" ON "public"."admission_settings"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert admission_settings" ON "public"."admission_settings"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update admission_settings" ON "public"."admission_settings"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete admission_settings" ON "public"."admission_settings"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_stages" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view academic_stages" ON "public"."academic_stages"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_stages" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert academic_stages" ON "public"."academic_stages"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_stages" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update academic_stages" ON "public"."academic_stages"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_stages" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete academic_stages" ON "public"."academic_stages"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_streams" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view academic_streams" ON "public"."academic_streams"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_streams" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert academic_streams" ON "public"."academic_streams"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_streams" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update academic_streams" ON "public"."academic_streams"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_streams" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete academic_streams" ON "public"."academic_streams"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_resources" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view academic_resources" ON "public"."academic_resources"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_resources" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert academic_resources" ON "public"."academic_resources"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_resources" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update academic_resources" ON "public"."academic_resources"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_resources" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete academic_resources" ON "public"."academic_resources"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."campus_facilities" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view campus_facilities" ON "public"."campus_facilities"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."campus_facilities" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert campus_facilities" ON "public"."campus_facilities"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."campus_facilities" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update campus_facilities" ON "public"."campus_facilities"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."campus_facilities" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete campus_facilities" ON "public"."campus_facilities"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."gallery_albums" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view gallery_albums" ON "public"."gallery_albums"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."gallery_albums" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert gallery_albums" ON "public"."gallery_albums"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."gallery_albums" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update gallery_albums" ON "public"."gallery_albums"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."gallery_albums" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete gallery_albums" ON "public"."gallery_albums"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."gallery_images" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view gallery_images" ON "public"."gallery_images"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."gallery_images" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert gallery_images" ON "public"."gallery_images"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."gallery_images" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update gallery_images" ON "public"."gallery_images"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."gallery_images" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete gallery_images" ON "public"."gallery_images"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."faculty_members" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view faculty_members" ON "public"."faculty_members"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."faculty_members" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert faculty_members" ON "public"."faculty_members"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."faculty_members" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update faculty_members" ON "public"."faculty_members"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."faculty_members" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete faculty_members" ON "public"."faculty_members"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."navigation_items" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view navigation_items" ON "public"."navigation_items"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."navigation_items" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert navigation_items" ON "public"."navigation_items"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."navigation_items" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update navigation_items" ON "public"."navigation_items"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."navigation_items" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete navigation_items" ON "public"."navigation_items"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_documents" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view academic_documents" ON "public"."academic_documents"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_documents" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert academic_documents" ON "public"."academic_documents"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_documents" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update academic_documents" ON "public"."academic_documents"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_documents" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete academic_documents" ON "public"."academic_documents"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_coordinators" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view academic_coordinators" ON "public"."academic_coordinators"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_coordinators" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert academic_coordinators" ON "public"."academic_coordinators"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_coordinators" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update academic_coordinators" ON "public"."academic_coordinators"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academic_coordinators" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete academic_coordinators" ON "public"."academic_coordinators"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_criteria" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view admission_criteria" ON "public"."admission_criteria"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_criteria" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert admission_criteria" ON "public"."admission_criteria"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_criteria" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update admission_criteria" ON "public"."admission_criteria"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_criteria" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete admission_criteria" ON "public"."admission_criteria"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_registration_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view admission_registration_settings" ON "public"."admission_registration_settings"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_registration_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert admission_registration_settings" ON "public"."admission_registration_settings"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_registration_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update admission_registration_settings" ON "public"."admission_registration_settings"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_registration_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete admission_registration_settings" ON "public"."admission_registration_settings"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."cbse_result_banners" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view cbse_result_banners" ON "public"."cbse_result_banners"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."cbse_result_banners" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert cbse_result_banners" ON "public"."cbse_result_banners"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."cbse_result_banners" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update cbse_result_banners" ON "public"."cbse_result_banners"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."cbse_result_banners" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete cbse_result_banners" ON "public"."cbse_result_banners"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."contact_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view contact_settings" ON "public"."contact_settings"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."contact_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert contact_settings" ON "public"."contact_settings"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."contact_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update contact_settings" ON "public"."contact_settings"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."contact_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete contact_settings" ON "public"."contact_settings"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."news_events_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view news_events_settings" ON "public"."news_events_settings"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."news_events_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert news_events_settings" ON "public"."news_events_settings"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."news_events_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update news_events_settings" ON "public"."news_events_settings"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."news_events_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete news_events_settings" ON "public"."news_events_settings"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."sdg_items" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view sdg_items" ON "public"."sdg_items"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."sdg_items" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert sdg_items" ON "public"."sdg_items"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."sdg_items" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update sdg_items" ON "public"."sdg_items"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."sdg_items" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete sdg_items" ON "public"."sdg_items"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."kaushal_bodh" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view kaushal_bodh" ON "public"."kaushal_bodh"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."kaushal_bodh" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert kaushal_bodh" ON "public"."kaushal_bodh"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."kaushal_bodh" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update kaushal_bodh" ON "public"."kaushal_bodh"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."kaushal_bodh" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete kaushal_bodh" ON "public"."kaushal_bodh"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academics_home_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view academics_home_settings" ON "public"."academics_home_settings"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academics_home_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert academics_home_settings" ON "public"."academics_home_settings"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academics_home_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update academics_home_settings" ON "public"."academics_home_settings"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."academics_home_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete academics_home_settings" ON "public"."academics_home_settings"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."gallery_preview_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view gallery_preview_settings" ON "public"."gallery_preview_settings"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."gallery_preview_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert gallery_preview_settings" ON "public"."gallery_preview_settings"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."gallery_preview_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update gallery_preview_settings" ON "public"."gallery_preview_settings"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."gallery_preview_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete gallery_preview_settings" ON "public"."gallery_preview_settings"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."gallery_preview_items" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view gallery_preview_items" ON "public"."gallery_preview_items"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."gallery_preview_items" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert gallery_preview_items" ON "public"."gallery_preview_items"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."gallery_preview_items" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update gallery_preview_items" ON "public"."gallery_preview_items"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."gallery_preview_items" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete gallery_preview_items" ON "public"."gallery_preview_items"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."virtual_tour_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view virtual_tour_settings" ON "public"."virtual_tour_settings"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."virtual_tour_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert virtual_tour_settings" ON "public"."virtual_tour_settings"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."virtual_tour_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update virtual_tour_settings" ON "public"."virtual_tour_settings"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."virtual_tour_settings" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete virtual_tour_settings" ON "public"."virtual_tour_settings"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."virtual_tour_highlights" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view virtual_tour_highlights" ON "public"."virtual_tour_highlights"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."virtual_tour_highlights" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can insert virtual_tour_highlights" ON "public"."virtual_tour_highlights"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."virtual_tour_highlights" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update virtual_tour_highlights" ON "public"."virtual_tour_highlights"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."virtual_tour_highlights" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete virtual_tour_highlights" ON "public"."virtual_tour_highlights"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admin_users" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view admin users" ON "public"."admin_users"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."blogs" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can read blogs" ON "public"."blogs"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (true)
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."notices" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can read active notices" ON "public"."notices"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_notices" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can read active admission notices" ON "public"."admission_notices"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_notices" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Authenticated admins can read admission notices" ON "public"."admission_notices"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (true)
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_notices" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Authenticated admins can insert admission notices" ON "public"."admission_notices"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (true)
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_notices" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Authenticated admins can update admission notices" ON "public"."admission_notices"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true)
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."admission_notices" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Authenticated admins can delete admission notices" ON "public"."admission_notices"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (true)
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."mandatory_public_disclosures" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can insert disclosures" ON "public"."mandatory_public_disclosures"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (true)
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."mandatory_public_disclosures" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can update disclosures" ON "public"."mandatory_public_disclosures"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true)
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."mandatory_public_disclosures" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can delete disclosures" ON "public"."mandatory_public_disclosures"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (true)
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."mandatory_public_disclosures" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view active disclosures" ON "public"."mandatory_public_disclosures"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((is_active = true))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."website_theme" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can update website theme" ON "public"."website_theme"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true)
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."website_theme" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can insert website theme" ON "public"."website_theme"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (true)
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."website_theme" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can read website theme" ON "public"."website_theme"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING (true)
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."blog_posts" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can read published blogs" ON "public"."blog_posts"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING (((status = 'published'::text) AND (is_active = true)))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."blog_images" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can read images of published blogs" ON "public"."blog_images"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((EXISTS ( SELECT 1
   FROM blog_posts
  WHERE ((blog_posts.id = blog_images.blog_id) AND (blog_posts.status = 'published'::text) AND (blog_posts.is_active = true)))))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."blog_posts" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage blogs" ON "public"."blog_posts"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING ((EXISTS ( SELECT 1
   FROM admin_users
  WHERE ((admin_users.id = auth.uid()) AND (admin_users.is_active = true) AND (admin_users.role = ANY (ARRAY['admin'::text, 'super_admin'::text]))))))
    WITH CHECK ((EXISTS ( SELECT 1
   FROM admin_users
  WHERE ((admin_users.id = auth.uid()) AND (admin_users.is_active = true) AND (admin_users.role = ANY (ARRAY['admin'::text, 'super_admin'::text]))))))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."blog_images" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can manage blog images" ON "public"."blog_images"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING ((EXISTS ( SELECT 1
   FROM admin_users
  WHERE ((admin_users.id = auth.uid()) AND (admin_users.is_active = true) AND (admin_users.role = ANY (ARRAY['admin'::text, 'super_admin'::text]))))))
    WITH CHECK ((EXISTS ( SELECT 1
   FROM admin_users
  WHERE ((admin_users.id = auth.uid()) AND (admin_users.is_active = true) AND (admin_users.role = ANY (ARRAY['admin'::text, 'super_admin'::text]))))))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."cms_blogs" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view published blogs" ON "public"."cms_blogs"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((status = 'published'::text))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."cms_blogs" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can manage blogs" ON "public"."cms_blogs"
    AS PERMISSIVE FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true)
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."blog_posts" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can read published blog posts" ON "public"."blog_posts"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((status = 'published'::text))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."cms_blogs" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can read published blogs" ON "public"."cms_blogs"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((status = 'published'::text))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "public"."blogs" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can read published blogs" ON "public"."blogs"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((status = 'published'::text))
  ;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

