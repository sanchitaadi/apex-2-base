'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ExternalLink,
  Eye,
  ImageIcon,
  Link2,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/browser';

type Config = {
  table: string;
  section: string;
  adminHref: string;
  pageHref: string;
  bucket: string;
  titleFields: string[];
  imageFields: string[];
};

type MediaItem = {
  key: string;
  table: string;
  rowId: string;
  section: string;
  title: string;
  field: string;
  url: string;
  bucket: string;
  adminHref: string;
  pageHref: string;
};

/*
  Central media map.
  The manager scans these existing CMS tables and only exposes image-like
  columns that actually exist on each row. This lets one page replace photos
  used across the website without inventing a new database structure.
*/
const CONFIGS: Config[] = [
  {
    table: 'hero_slides',
    section: 'Homepage / Hero',
    adminHref: '/admin/hero',
    pageHref: '/',
    bucket: 'gallery',
    titleFields: ['title', 'heading', 'eyebrow', 'id'],
    imageFields: ['desktop_image_url', 'mobile_image_url', 'background_image_url', 'image_url'],
  },
  {
    table: 'site_settings',
    section: 'Website Settings',
    adminHref: '/admin/settings',
    pageHref: '/',
    bucket: 'gallery',
    titleFields: ['site_name', 'title', 'key', 'name', 'id'],
    imageFields: ['logo_url', 'favicon_url', 'og_image_url', 'image_url'],
  },
  {
    table: 'about_content',
    section: 'About / Homepage',
    adminHref: '/admin/about',
    pageHref: '/about',
    bucket: 'about',
    titleFields: ['title', 'section_key', 'eyebrow', 'id'],
    imageFields: ['image_url', 'founder_image_url'],
  },
  {
    table: 'about_pages',
    section: 'About / Leadership Pages',
    adminHref: '/admin/about2',
    pageHref: '/about',
    bucket: 'about-pages',
    titleFields: ['person_name', 'menu_label', 'title', 'slug', 'id'],
    imageFields: ['image_url', 'photo_url', 'banner_image_url'],
  },
  {
    table: 'academic_stages',
    section: 'Academics / School Stages',
    adminHref: '/admin/academics',
    pageHref: '/academics',
    bucket: 'academic-resources',
    titleFields: ['title', 'classes', 'id'],
    imageFields: ['image_url', 'photo_url'],
  },
  {
    table: 'academic_streams',
    section: 'Academics / Senior Secondary',
    adminHref: '/admin/academics',
    pageHref: '/academics',
    bucket: 'academic-resources',
    titleFields: ['title', 'subjects', 'id'],
    imageFields: ['image_url', 'photo_url'],
  },
  {
    table: 'academic_coordinators',
    section: 'Academics / Coordinators',
    adminHref: '/admin/academic-coordinators',
    pageHref: '/academic-coordinators',
    bucket: 'academic-coordinators',
    titleFields: ['name', 'person_name', 'title', 'id'],
    imageFields: ['image_url', 'photo_url'],
  },
  {
    table: 'faculty_members',
    section: 'Academics / Faculty',
    adminHref: '/admin/faculty',
    pageHref: '/faculty',
    bucket: 'faculty',
    titleFields: ['name', 'full_name', 'person_name', 'designation', 'id'],
    imageFields: ['image_url', 'photo_url', 'profile_image_url'],
  },
  {
    table: 'campus_facilities',
    section: 'Homepage / Campus',
    adminHref: '/admin/campus',
    pageHref: '/campus',
    bucket: 'gallery',
    titleFields: ['title', 'name', 'facility_name', 'id'],
    imageFields: ['image_url', 'photo_url', 'cover_image_url'],
  },
  {
    table: 'gallery_albums',
    section: 'Gallery / Albums',
    adminHref: '/admin/gallery',
    pageHref: '/gallery',
    bucket: 'gallery',
    titleFields: ['title', 'name', 'album_name', 'slug', 'id'],
    imageFields: ['cover_image_url', 'image_url', 'thumbnail_url'],
  },
  {
    table: 'gallery_images',
    section: 'Gallery / Images',
    adminHref: '/admin/gallery',
    pageHref: '/gallery',
    bucket: 'gallery',
    titleFields: ['title', 'caption', 'name', 'id'],
    imageFields: ['image_url', 'thumbnail_url', 'photo_url'],
  },
  {
    table: 'gallery_preview_items',
    section: 'Homepage / Gallery Preview',
    adminHref: '/admin/gallery-preview',
    pageHref: '/',
    bucket: 'gallery',
    titleFields: ['title', 'caption', 'name', 'id'],
    imageFields: ['image_url', 'photo_url', 'thumbnail_url'],
  },
  {
    table: 'virtual_tour_settings',
    section: 'Virtual Tour / Settings',
    adminHref: '/admin/virtual-tour',
    pageHref: '/virtual-tour',
    bucket: 'gallery',
    titleFields: ['title', 'name', 'id'],
    imageFields: ['hero_image_url', 'background_image_url', 'image_url'],
  },
  {
    table: 'virtual_tour_highlights',
    section: 'Virtual Tour / Highlights',
    adminHref: '/admin/virtual-tour',
    pageHref: '/virtual-tour',
    bucket: 'gallery',
    titleFields: ['title', 'name', 'id'],
    imageFields: ['image_url', 'photo_url'],
  },
  {
    table: 'events',
    section: 'Content / Events',
    adminHref: '/admin/events',
    pageHref: '/news-events',
    bucket: 'gallery',
    titleFields: ['title', 'event_name', 'name', 'id'],
    imageFields: ['image_url', 'cover_image_url', 'thumbnail_url', 'photo_url'],
  },
  {
    table: 'activities',
    section: 'Content / Activities',
    adminHref: '/admin/activities',
    pageHref: '/activities',
    bucket: 'gallery',
    titleFields: ['title', 'activity_name', 'name', 'id'],
    imageFields: ['image_url', 'cover_image_url', 'thumbnail_url', 'photo_url'],
  },
  {
    table: 'achievements',
    section: 'Content / Achievements',
    adminHref: '/admin/achievements',
    pageHref: '/achievements',
    bucket: 'gallery',
    titleFields: ['title', 'achievement_name', 'name', 'id'],
    imageFields: ['image_url', 'cover_image_url', 'thumbnail_url', 'photo_url'],
  },
  {
    table: 'sdg_items',
    section: 'Content / SDG',
    adminHref: '/admin/sdg',
    pageHref: '/sdg',
    bucket: 'sdg',
    titleFields: ['title', 'name', 'goal', 'id'],
    imageFields: ['image_url', 'photo_url', 'icon_url', 'banner_image_url'],
  },
  {
    table: 'kaushal_bodh',
    section: 'Content / Kaushal Bodh',
    adminHref: '/admin/kaushalbodh',
    pageHref: '/kaushal-bodh',
    bucket: 'gallery',
    titleFields: ['title', 'name', 'id'],
    imageFields: ['image_url', 'photo_url', 'cover_image_url', 'banner_image_url'],
  },
  {
    table: 'cbse_result_banners',
    section: 'Academics / CBSE Results',
    adminHref: '/admin/cbse-results',
    pageHref: '/cbse-results',
    bucket: 'cbse-results',
    titleFields: ['title', 'year', 'name', 'id'],
    imageFields: ['image_url', 'banner_url', 'background_image_url'],
  },
  {
    table: 'admission_settings',
    section: 'Admissions',
    adminHref: '/admin/admissions',
    pageHref: '/admissions',
    bucket: 'gallery',
    titleFields: ['title', 'name', 'key', 'id'],
    imageFields: ['hero_image_url', 'banner_image_url', 'image_url', 'photo_url'],
  },
  {
    table: 'admission_criteria',
    section: 'Admissions / Criteria',
    adminHref: '/admin/admission-criteria',
    pageHref: '/admission-criteria',
    bucket: 'admission-criteria',
    titleFields: ['title', 'name', 'class_name', 'id'],
    imageFields: ['image_url', 'photo_url', 'banner_image_url'],
  },
  {
    table: 'contact_settings',
    section: 'Contact',
    adminHref: '/admin/contact',
    pageHref: '/contact',
    bucket: 'gallery',
    titleFields: ['school_name', 'title', 'name', 'id'],
    imageFields: ['image_url', 'map_image_url', 'banner_image_url'],
  },
  {
    table: 'news_events_settings',
    section: 'Homepage / News & Events',
    adminHref: '/admin/news-events',
    pageHref: '/news-events',
    bucket: 'gallery',
    titleFields: ['title', 'name', 'id'],
    imageFields: ['hero_image_url', 'banner_image_url', 'image_url'],
  },
];

function makeTitle(row: Record<string, unknown>, fields: string[]) {
  for (const field of fields) {
    const value = row[field];
    if (value !== null && value !== undefined && String(value).trim()) {
      return String(value).trim();
    }
  }
  return 'Untitled item';
}

function cleanUrl(value: unknown) {
  return value === null || value === undefined ? '' : String(value);
}

function isUsableImageUrl(url: string) {
  return /^https?:\/\//i.test(url) || url.startsWith('/');
}

function shortenUrl(url: string) {
  if (!url) return 'No image selected';
  if (url.length <= 74) return url;
  return `${url.slice(0, 38)}…${url.slice(-30)}`;
}

export default function AdminMediaManagerPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'missing'>('all');

  useEffect(() => {
    void loadMedia();
  }, []);

  async function loadMedia() {
    setLoading(true);
    setMessage('');

    const results = await Promise.all(
      CONFIGS.map(async (config) => {
        const { data, error } = await supabase.from(config.table).select('*');

        if (error) {
          // Not every installation necessarily has every optional table.
          console.warn(`Media manager skipped ${config.table}:`, error.message);
          return [];
        }

        const rows = Array.isArray(data) ? data : [];

        return rows.flatMap((row) => {
          if (!row || typeof row !== 'object') return [];
          const objectRow = row as Record<string, unknown>;
          const rowId = String(objectRow.id ?? '');
          if (!rowId) return [];

          return config.imageFields
            .filter((field) => Object.prototype.hasOwnProperty.call(objectRow, field))
            .map((field) => ({
              key: `${config.table}:${rowId}:${field}`,
              table: config.table,
              rowId,
              section: config.section,
              title: `${makeTitle(objectRow, config.titleFields)} · ${field}`,
              field,
              url: cleanUrl(objectRow[field]),
              bucket: config.bucket,
              adminHref: config.adminHref,
              pageHref: config.pageHref,
            }));
        });
      }),
    );

    setItems(
      results
        .flat()
        .sort((a, b) => `${a.section}-${a.title}`.localeCompare(`${b.section}-${b.title}`)),
    );

    setLoading(false);
  }

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.section.toLowerCase().includes(query) ||
        item.table.toLowerCase().includes(query) ||
        item.field.toLowerCase().includes(query);

      const matchesFilter = filter === 'all' || !isUsableImageUrl(item.url);
      return matchesSearch && matchesFilter;
    });
  }, [items, search, filter]);

  const stats = useMemo(() => {
    const missing = items.filter((item) => !isUsableImageUrl(item.url)).length;
    return {
      total: items.length,
      missing,
      ready: items.length - missing,
      sections: new Set(items.map((item) => item.section)).size,
    };
  }, [items]);

  async function updateUrl(item: MediaItem, url: string) {
    const nextUrl = url.trim();
    setBusyKey(item.key);
    setMessage('');

    try {
      const payload: Record<string, string | null> = {
        [item.field]: nextUrl || null,
      };

      // Most CMS tables have updated_at. If a particular legacy table does not,
      // retrying without it keeps the manager compatible with that table.
      let result = await supabase.from(item.table).update({ ...payload, updated_at: new Date().toISOString() }).eq('id', item.rowId);
      if (result.error && /updated_at/i.test(result.error.message)) {
        result = await supabase.from(item.table).update(payload).eq('id', item.rowId);
      }
      if (result.error) throw result.error;

      setItems((current) => current.map((entry) => entry.key === item.key ? { ...entry, url: nextUrl } : entry));
      setMessage(`${item.title} updated.`);
    } catch (error) {
      console.error('Media URL update failed:', error);
      setMessage(`Could not update ${item.title}. Check the table RLS policy and column name.`);
    } finally {
      setBusyKey(null);
    }
  }

  async function uploadReplacement(item: MediaItem, file: File) {
    if (!file.type.startsWith('image/')) {
      setMessage('Please select an image file.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setMessage('Image must be smaller than 15MB.');
      return;
    }

    setBusyKey(item.key);
    setMessage('');

    try {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const safeTable = item.table.replace(/[^a-z0-9_-]/gi, '-');
      const safeRow = item.rowId.replace(/[^a-z0-9_-]/gi, '-');
      const safeField = item.field.replace(/[^a-z0-9_-]/gi, '-');
      const path = `media-manager/${safeTable}/${safeRow}-${safeField}-${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage.from(item.bucket).upload(path, file, {
        upsert: true,
        contentType: file.type,
      });
      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage.from(item.bucket).getPublicUrl(path);
      const publicUrl = publicData.publicUrl;
      const payload: Record<string, string> = { [item.field]: publicUrl };

      let result = await supabase.from(item.table).update({ ...payload, updated_at: new Date().toISOString() }).eq('id', item.rowId);
      if (result.error && /updated_at/i.test(result.error.message)) {
        result = await supabase.from(item.table).update(payload).eq('id', item.rowId);
      }
      if (result.error) throw result.error;

      setItems((current) => current.map((entry) => entry.key === item.key ? { ...entry, url: publicUrl } : entry));
      setMessage(`${item.title} replaced successfully.`);
    } catch (error: unknown) {
      console.error('Media upload failed:', error);
      const detail = error instanceof Error ? error.message : '';
      setMessage(detail || `Could not upload ${item.title}. Make sure the "${item.bucket}" storage bucket exists and the admin storage policy allows uploads.`);
    } finally {
      setBusyKey(null);
    }
  }

  async function removeImage(item: MediaItem) {
    const confirmed = window.confirm(`Remove the photo from "${item.title}"?`);
    if (!confirmed) return;

    setBusyKey(item.key);
    setMessage('');

    try {
      const payload: Record<string, null> = { [item.field]: null };
      let result = await supabase.from(item.table).update({ ...payload, updated_at: new Date().toISOString() }).eq('id', item.rowId);
      if (result.error && /updated_at/i.test(result.error.message)) {
        result = await supabase.from(item.table).update(payload).eq('id', item.rowId);
      }
      if (result.error) throw result.error;

      setItems((current) => current.map((entry) => entry.key === item.key ? { ...entry, url: '' } : entry));
      setMessage(`${item.title} photo removed.`);
    } catch (error) {
      console.error('Media remove failed:', error);
      setMessage(`Could not remove ${item.title}.`);
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-[1600px] space-y-8">
        <section className="overflow-hidden rounded-[2rem] bg-[#102A56] p-7 text-[#F5F0E6] shadow-[0_30px_80px_rgba(16,42,86,0.18)] md:p-10">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-[#F5F0E6]/35">Apex CMS / Media</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
                Every website photo,
                <br />
                in one place.
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-[#F5F0E6]/55 md:text-base">
                Replace photos used by the homepage, About pages, leadership pages, academics, faculty, campus, gallery, admissions, events, activities, achievements, SDG, Kaushal Bodh, CBSE results, contact and Virtual Tour.
                Changes are written directly to the same CMS field used by the public website.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                ['TOTAL', stats.total],
                ['IMAGES', stats.ready],
                ['MISSING', stats.missing],
                ['SECTIONS', stats.sections],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4">
                  <div className="text-2xl font-semibold">{value}</div>
                  <div className="mt-1 text-[8px] uppercase tracking-[0.2em] text-[#F5F0E6]/30">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="sticky top-[72px] z-20 rounded-2xl border border-[#102A56]/10 bg-[#F4F1EA]/95 p-3 shadow-sm backdrop-blur-xl">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#102A56]/35" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search page, photo, table or field..."
                className="w-full rounded-xl border border-[#102A56]/10 bg-white py-3 pl-11 pr-4 text-sm text-[#10203A] outline-none transition focus:border-[#102A56]/30"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`rounded-xl px-4 py-3 text-xs font-semibold transition ${filter === 'all' ? 'bg-[#102A56] !text-[#F5F0E6]' : 'bg-white !text-[#102A56]/55 hover:bg-[#102A56]/5'}`}
              >
                All photos
              </button>
              <button
                type="button"
                onClick={() => setFilter('missing')}
                className={`rounded-xl px-4 py-3 text-xs font-semibold transition ${filter === 'missing' ? 'bg-[#102A56] !text-[#F5F0E6]' : 'bg-white !text-[#102A56]/55 hover:bg-[#102A56]/5'}`}
              >
                Missing
              </button>
              <button
                type="button"
                onClick={() => void loadMedia()}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#102A56]/10 bg-white text-[#102A56] transition hover:bg-[#102A56]/5"
                title="Refresh"
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>
        </section>

        {message && (
          <div className="flex items-center gap-3 rounded-xl border border-[#102A56]/10 bg-white px-4 py-3 text-sm text-[#10203A] shadow-sm">
            <Check size={16} className="shrink-0 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {loading ? (
          <div className="grid min-h-[420px] place-items-center rounded-[2rem] border border-[#102A56]/10 bg-white">
            <div className="flex flex-col items-center">
              <Loader2 size={24} className="animate-spin text-[#102A56]" />
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#102A56]/35">Scanning CMS image fields</p>
            </div>
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="rounded-[2rem] border border-[#102A56]/10 bg-white p-12 text-center">
            <ImageIcon size={30} className="mx-auto text-[#102A56]/25" />
            <h2 className="mt-4 text-xl font-semibold text-[#102A56]">No image fields found</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#10203A]/50">
              Try another search or check that the relevant CMS tables contain image fields such as image_url or photo_url.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {visibleItems.map((item) => {
              const busy = busyKey === item.key;
              const hasImage = isUsableImageUrl(item.url);

              return (
                <article key={item.key} className="overflow-hidden rounded-[2rem] border border-[#102A56]/10 bg-white shadow-sm">
                  <div className="grid md:grid-cols-[230px_1fr]">
                    <div className="relative min-h-[220px] overflow-hidden bg-[#E9E2D5]">
                      {hasImage ? (
                        <img src={item.url} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center">
                          <div className="text-center">
                            <ImageIcon size={28} className="mx-auto text-[#102A56]/20" />
                            <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#102A56]/30">No photo</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-[#102A56]/75 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#F5F0E6] backdrop-blur-md">
                        {item.section}
                      </div>
                    </div>

                    <div className="flex min-w-0 flex-col p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#102A56]/30">{item.table} / {item.field}</p>
                          <h2 className="mt-2 text-lg font-semibold tracking-[-0.025em] text-[#102A56]">{item.title}</h2>
                        </div>
                        <a
                          href={item.pageHref}
                          target="_blank"
                          rel="noreferrer"
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#102A56]/10 text-[#102A56]/55 transition hover:bg-[#102A56] hover:!text-[#F5F0E6]"
                          title="Open public page"
                        >
                          <Eye size={14} />
                        </a>
                      </div>

                      <div className="mt-5 rounded-xl bg-[#F4F1EA] p-3">
                        <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#102A56]/30">Current image</p>
                        <p className="mt-1 break-all text-xs leading-5 text-[#10203A]/55">{shortenUrl(item.url)}</p>
                      </div>

                      <div className="mt-4">
                        <label htmlFor={`url-${item.key}`} className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#102A56]/40">Image URL</label>
                        <div className="flex gap-2">
                          <div className="relative min-w-0 flex-1">
                            <Link2 size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#102A56]/25" />
                            <input
                              id={`url-${item.key}`}
                              defaultValue={item.url}
                              key={`${item.key}:${item.url}`}
                              onBlur={(event) => {
                                const next = event.target.value.trim();
                                if (next !== item.url) void updateUrl(item, next);
                              }}
                              placeholder="https://..."
                              className="w-full rounded-xl border border-[#102A56]/10 bg-white px-9 py-2.5 text-xs text-[#10203A] outline-none focus:border-[#102A56]/30"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => void removeImage(item)}
                            disabled={busy || !item.url}
                            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-red-200 bg-white text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                            title="Remove image"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        <label
                          htmlFor={`file-${item.key}`}
                          className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#102A56] px-4 py-3 text-xs font-semibold !text-[#F5F0E6] transition hover:-translate-y-0.5 hover:bg-[#16386E] ${busy ? 'pointer-events-none opacity-50' : ''}`}
                        >
                          {busy ? <Loader2 size={14} className="animate-spin !text-[#F5F0E6]" /> : <Upload size={14} className="!text-[#F5F0E6]" />}
                          <span className="!text-[#F5F0E6]">Replace photo</span>
                        </label>
                        <input
                          id={`file-${item.key}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            event.target.value = '';
                            if (file) void uploadReplacement(item, file);
                          }}
                        />
                        <a
                          href={item.adminHref}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#102A56]/10 bg-[#F5F0E6] px-4 py-3 text-xs font-semibold !text-[#102A56] transition hover:bg-[#E9E2D5]"
                        >
                          Edit page settings
                          <ExternalLink size={13} className="!text-[#102A56]" />
                        </a>
                      </div>

                      <p className="mt-3 text-[9px] leading-5 text-[#10203A]/35">
                        Uploading here updates <span className="font-semibold">{item.table}.{item.field}</span> so the public page uses the new photo.
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
