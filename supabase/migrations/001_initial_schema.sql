create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text,
  description text,
  cover_url text,
  created_at timestamptz not null default now()
);

alter table public.books enable row level security;

create policy "books are publicly readable"
on public.books
for select
to anon, authenticated
using (true);
