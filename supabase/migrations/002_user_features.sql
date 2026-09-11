create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id text not null,
  title text not null,
  author text,
  cover_url text,
  created_at timestamptz not null default now(),
  unique(user_id, book_id)
);

alter table public.favorites enable row level security;

create policy "users can read their favorites"
on public.favorites
for select
to authenticated
using (auth.uid() = user_id);

create policy "users can add their favorites"
on public.favorites
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "users can delete their favorites"
on public.favorites
for delete
to authenticated
using (auth.uid() = user_id);

create index if not exists favorites_user_id_idx on public.favorites(user_id);
