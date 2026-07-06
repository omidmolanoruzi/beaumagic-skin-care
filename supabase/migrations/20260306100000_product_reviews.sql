-- Product reviews for storefront (Medusa product_id + handle)
create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  product_handle text not null,
  rating smallint not null check (rating >= 1 and rating <= 5),
  title text,
  body text not null,
  author_name text not null,
  author_email text not null,
  status text not null default 'published' check (status in ('published', 'pending')),
  created_at timestamptz not null default now()
);

create index if not exists product_reviews_handle_status_created_idx
  on public.product_reviews (product_handle, status, created_at desc);

alter table public.product_reviews enable row level security;

drop policy if exists "Public read published reviews" on public.product_reviews;
create policy "Public read published reviews"
  on public.product_reviews
  for select
  using (status = 'published');
