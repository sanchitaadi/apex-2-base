create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  excerpt text,
  content text,
  image_url text,
  category text,
  author text,
  status text default 'draft',
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.blogs enable row level security;

create policy "Public can read published blogs"
on public.blogs
for select
using (status = 'published');

create policy "Authenticated users can read blogs"
on public.blogs
for select
to authenticated
using (true);

notify pgrst, 'reload schema';
