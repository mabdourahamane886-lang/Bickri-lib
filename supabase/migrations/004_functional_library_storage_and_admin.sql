-- Applied to Supabase project with the Supabase migration tool.

alter table public.profiles add column if not exists role text not null default 'user' check (role in ('user','admin'));

alter table public.books add column if not exists file_path text;
alter table public.books add column if not exists file_type text default 'pdf' check (file_type in ('pdf','epub','other'));
alter table public.books add column if not exists file_size bigint;
alter table public.books add column if not exists page_count integer;
alter table public.books add column if not exists license text;
alter table public.books add column if not exists source_url text;
alter table public.books add column if not exists publisher text;
alter table public.books add column if not exists isbn text;
alter table public.books add column if not exists reading_time integer;
alter table public.books add column if not exists download_enabled boolean not null default false;
alter table public.books add column if not exists view_count bigint not null default 0;
alter table public.books add column if not exists updated_at timestamptz not null default now();

create index if not exists books_file_path_idx on public.books(file_path);
create index if not exists books_is_premium_idx on public.books(is_premium);
create index if not exists books_language_idx on public.books(language);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('bickri-books', 'bickri-books', false, 52428800, array['application/pdf','application/epub+zip'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "admins can upload bickri books" on storage.objects for insert to authenticated with check (bucket_id = 'bickri-books' and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
create policy "admins can update bickri books" on storage.objects for update to authenticated using (bucket_id = 'bickri-books' and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')) with check (bucket_id = 'bickri-books' and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
create policy "admins can delete bickri books" on storage.objects for delete to authenticated using (bucket_id = 'bickri-books' and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
create policy "signed-in users can read bickri books" on storage.objects for select to authenticated using (bucket_id = 'bickri-books' and exists (select 1 from public.books b where b.file_path = name));

create policy "admins can insert books" on public.books for insert to authenticated with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
create policy "admins can update books" on public.books for update to authenticated using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')) with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
create policy "admins can delete books" on public.books for delete to authenticated using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

-- The first existing profile in the project was promoted to admin during deployment.
