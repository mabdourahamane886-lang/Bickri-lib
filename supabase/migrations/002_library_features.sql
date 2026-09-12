create table if not exists public.reading_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  progress numeric(5,2) not null default 0 check (progress >= 0 and progress <= 100),
  last_read_at timestamptz not null default now(),
  unique(user_id, book_id)
);

create table if not exists public.book_collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.collection_books (
  collection_id uuid not null references public.book_collections(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(collection_id, book_id)
);

alter table public.reading_progress enable row level security;
alter table public.book_collections enable row level security;
alter table public.collection_books enable row level security;

create policy "users can read their reading progress" on public.reading_progress
for select to authenticated using ((select auth.uid()) = user_id);
create policy "users can insert their reading progress" on public.reading_progress
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users can update their reading progress" on public.reading_progress
for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users can delete their reading progress" on public.reading_progress
for delete to authenticated using ((select auth.uid()) = user_id);

create policy "users can read their collections" on public.book_collections
for select to authenticated using ((select auth.uid()) = user_id);
create policy "users can create their collections" on public.book_collections
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users can update their collections" on public.book_collections
for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users can delete their collections" on public.book_collections
for delete to authenticated using ((select auth.uid()) = user_id);

create policy "users can read their collection books" on public.collection_books
for select to authenticated using (exists (select 1 from public.book_collections c where c.id = collection_id and c.user_id = (select auth.uid())));
create policy "users can add to their collections" on public.collection_books
for insert to authenticated with check (exists (select 1 from public.book_collections c where c.id = collection_id and c.user_id = (select auth.uid())));
create policy "users can remove from their collections" on public.collection_books
for delete to authenticated using (exists (select 1 from public.book_collections c where c.id = collection_id and c.user_id = (select auth.uid())));
