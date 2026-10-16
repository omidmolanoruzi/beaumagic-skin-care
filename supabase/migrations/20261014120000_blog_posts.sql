create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  blog_date date not null,
  subject text not null,
  title text not null,
  slug text,
  summary text not null default '',
  picture_url text,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists blog_posts_date_idx
  on public.blog_posts (blog_date desc, created_at desc);
