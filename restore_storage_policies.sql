ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can view admission application files" ON "storage"."objects"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (((bucket_id = 'admission-applications'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Applicants can upload admission files" ON "storage"."objects"
    AS PERMISSIVE FOR INSERT
    TO anon, authenticated
    WITH CHECK ((bucket_id = 'admission-applications'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can upload SDG images" ON "storage"."objects"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK ((bucket_id = 'sdg'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can upload site assets" ON "storage"."objects"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (((bucket_id = 'site-assets'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update site assets" ON "storage"."objects"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (((bucket_id = 'site-assets'::text) AND is_admin()))
    WITH CHECK (((bucket_id = 'site-assets'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete site assets" ON "storage"."objects"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (((bucket_id = 'site-assets'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view site assets" ON "storage"."objects"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((bucket_id = 'site-assets'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view hero images" ON "storage"."objects"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((bucket_id = 'hero'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can upload hero images" ON "storage"."objects"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (((bucket_id = 'hero'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update hero images" ON "storage"."objects"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (((bucket_id = 'hero'::text) AND is_admin()))
    WITH CHECK (((bucket_id = 'hero'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete hero images" ON "storage"."objects"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (((bucket_id = 'hero'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view about images" ON "storage"."objects"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((bucket_id = 'about'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can upload about images" ON "storage"."objects"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (((bucket_id = 'about'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update about images" ON "storage"."objects"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (((bucket_id = 'about'::text) AND is_admin()))
    WITH CHECK (((bucket_id = 'about'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete about images" ON "storage"."objects"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (((bucket_id = 'about'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view about page images" ON "storage"."objects"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((bucket_id = 'about-pages'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can upload about page images" ON "storage"."objects"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (((bucket_id = 'about-pages'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update about page images" ON "storage"."objects"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (((bucket_id = 'about-pages'::text) AND is_admin()))
    WITH CHECK (((bucket_id = 'about-pages'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete about page images" ON "storage"."objects"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (((bucket_id = 'about-pages'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view campus images" ON "storage"."objects"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((bucket_id = 'campus'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can upload campus images" ON "storage"."objects"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (((bucket_id = 'campus'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update campus images" ON "storage"."objects"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (((bucket_id = 'campus'::text) AND is_admin()))
    WITH CHECK (((bucket_id = 'campus'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete campus images" ON "storage"."objects"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (((bucket_id = 'campus'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view gallery files" ON "storage"."objects"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((bucket_id = 'gallery'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can upload gallery files" ON "storage"."objects"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (((bucket_id = 'gallery'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update gallery files" ON "storage"."objects"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (((bucket_id = 'gallery'::text) AND is_admin()))
    WITH CHECK (((bucket_id = 'gallery'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete gallery files" ON "storage"."objects"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (((bucket_id = 'gallery'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view faculty images" ON "storage"."objects"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((bucket_id = 'faculty'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can upload faculty images" ON "storage"."objects"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (((bucket_id = 'faculty'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update faculty images" ON "storage"."objects"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (((bucket_id = 'faculty'::text) AND is_admin()))
    WITH CHECK (((bucket_id = 'faculty'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete faculty images" ON "storage"."objects"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (((bucket_id = 'faculty'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view accolade files" ON "storage"."objects"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((bucket_id = 'apexian-accolade'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can upload accolade files" ON "storage"."objects"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (((bucket_id = 'apexian-accolade'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update accolade files" ON "storage"."objects"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (((bucket_id = 'apexian-accolade'::text) AND is_admin()))
    WITH CHECK (((bucket_id = 'apexian-accolade'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete accolade files" ON "storage"."objects"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (((bucket_id = 'apexian-accolade'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view academic resource files" ON "storage"."objects"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((bucket_id = 'academic-resources'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can upload academic resource files" ON "storage"."objects"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (((bucket_id = 'academic-resources'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update academic resource files" ON "storage"."objects"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (((bucket_id = 'academic-resources'::text) AND is_admin()))
    WITH CHECK (((bucket_id = 'academic-resources'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete academic resource files" ON "storage"."objects"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (((bucket_id = 'academic-resources'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view CBSE result images" ON "storage"."objects"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((bucket_id = 'cbse-results'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can upload CBSE result images" ON "storage"."objects"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (((bucket_id = 'cbse-results'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update CBSE result images" ON "storage"."objects"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (((bucket_id = 'cbse-results'::text) AND is_admin()))
    WITH CHECK (((bucket_id = 'cbse-results'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete CBSE result images" ON "storage"."objects"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (((bucket_id = 'cbse-results'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view academic coordinator images" ON "storage"."objects"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((bucket_id = 'academic-coordinators'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can upload academic coordinator images" ON "storage"."objects"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (((bucket_id = 'academic-coordinators'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update academic coordinator images" ON "storage"."objects"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (((bucket_id = 'academic-coordinators'::text) AND is_admin()))
    WITH CHECK (((bucket_id = 'academic-coordinators'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete academic coordinator images" ON "storage"."objects"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (((bucket_id = 'academic-coordinators'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view admission criteria files" ON "storage"."objects"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((bucket_id = 'admission-criteria'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can upload admission criteria files" ON "storage"."objects"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (((bucket_id = 'admission-criteria'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update admission criteria files" ON "storage"."objects"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (((bucket_id = 'admission-criteria'::text) AND is_admin()))
    WITH CHECK (((bucket_id = 'admission-criteria'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete admission criteria files" ON "storage"."objects"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (((bucket_id = 'admission-criteria'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update admission application files" ON "storage"."objects"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (((bucket_id = 'admission-applications'::text) AND is_admin()))
    WITH CHECK (((bucket_id = 'admission-applications'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete admission application files" ON "storage"."objects"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (((bucket_id = 'admission-applications'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view admission notice files" ON "storage"."objects"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((bucket_id = 'admission-notices'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can upload admission notice files" ON "storage"."objects"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK ((bucket_id = 'admission-notices'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can update admission notice files" ON "storage"."objects"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING ((bucket_id = 'admission-notices'::text))
    WITH CHECK ((bucket_id = 'admission-notices'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can delete admission notice files" ON "storage"."objects"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING ((bucket_id = 'admission-notices'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view SDG images" ON "storage"."objects"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((bucket_id = 'sdg'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can update SDG images" ON "storage"."objects"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING ((bucket_id = 'sdg'::text))
    WITH CHECK ((bucket_id = 'sdg'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can delete SDG images" ON "storage"."objects"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING ((bucket_id = 'sdg'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can upload CMS files" ON "storage"."objects"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update CMS files" ON "storage"."objects"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete CMS files" ON "storage"."objects"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (is_admin())
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can upload notice files" ON "storage"."objects"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (((bucket_id = 'notices'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update notice files" ON "storage"."objects"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (((bucket_id = 'notices'::text) AND is_admin()))
    WITH CHECK (((bucket_id = 'notices'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete notice files" ON "storage"."objects"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (((bucket_id = 'notices'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view Apex notice files" ON "storage"."objects"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((bucket_id = 'apex-notices'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can upload Apex notice files" ON "storage"."objects"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (((bucket_id = 'apex-notices'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update Apex notice files" ON "storage"."objects"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (((bucket_id = 'apex-notices'::text) AND is_admin()))
    WITH CHECK (((bucket_id = 'apex-notices'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete Apex notice files" ON "storage"."objects"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (((bucket_id = 'apex-notices'::text) AND is_admin()))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can read notice documents" ON "storage"."objects"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((bucket_id = 'documents'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can read admission notices" ON "storage"."objects"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((bucket_id = 'admission-notices'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "CMS can upload admission notices" ON "storage"."objects"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK ((bucket_id = 'admission-notices'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "CMS can update admission notices" ON "storage"."objects"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING ((bucket_id = 'admission-notices'::text))
    WITH CHECK ((bucket_id = 'admission-notices'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "CMS can delete admission notices" ON "storage"."objects"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING ((bucket_id = 'admission-notices'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can read Apex admission files" ON "storage"."objects"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((bucket_id = 'apex-admission-notices'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "CMS can upload Apex admission files" ON "storage"."objects"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK ((bucket_id = 'apex-admission-notices'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "CMS can update Apex admission files" ON "storage"."objects"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING ((bucket_id = 'apex-admission-notices'::text))
    WITH CHECK ((bucket_id = 'apex-admission-notices'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "CMS can delete Apex admission files" ON "storage"."objects"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING ((bucket_id = 'apex-admission-notices'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view mandatory disclosure files" ON "storage"."objects"
    AS PERMISSIVE FOR SELECT
    TO public
    USING ((bucket_id = 'mandatory-disclosures'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can upload mandatory disclosure files" ON "storage"."objects"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK ((bucket_id = 'mandatory-disclosures'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can update mandatory disclosure files" ON "storage"."objects"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING ((bucket_id = 'mandatory-disclosures'::text))
    WITH CHECK ((bucket_id = 'mandatory-disclosures'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can delete mandatory disclosure files" ON "storage"."objects"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING ((bucket_id = 'mandatory-disclosures'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can view blog files" ON "storage"."objects"
    AS PERMISSIVE FOR SELECT
    TO anon, authenticated
    USING ((bucket_id = 'apex-blogs'::text))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can upload blog files" ON "storage"."objects"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (((bucket_id = 'apex-blogs'::text) AND (EXISTS ( SELECT 1
   FROM admin_users
  WHERE ((admin_users.id = auth.uid()) AND (admin_users.is_active = true) AND (admin_users.role = ANY (ARRAY['admin'::text, 'super_admin'::text])))))))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can update blog files" ON "storage"."objects"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (((bucket_id = 'apex-blogs'::text) AND (EXISTS ( SELECT 1
   FROM admin_users
  WHERE ((admin_users.id = auth.uid()) AND (admin_users.is_active = true) AND (admin_users.role = ANY (ARRAY['admin'::text, 'super_admin'::text])))))))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can delete blog files" ON "storage"."objects"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (((bucket_id = 'apex-blogs'::text) AND (EXISTS ( SELECT 1
   FROM admin_users
  WHERE ((admin_users.id = auth.uid()) AND (admin_users.is_active = true) AND (admin_users.role = ANY (ARRAY['admin'::text, 'super_admin'::text])))))))
  ;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
