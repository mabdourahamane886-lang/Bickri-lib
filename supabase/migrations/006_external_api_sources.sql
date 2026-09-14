create table if not exists public.library_api_sources (
  id uuid primary key default gen_random_uuid(),
  source text not null unique,
  display_name text not null,
  enabled boolean not null default true,
  requires_key boolean not null default false,
  search_endpoint text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.library_api_sources enable row level security;

drop policy if exists "library_api_sources_public_read" on public.library_api_sources;
create policy "library_api_sources_public_read" on public.library_api_sources
  for select to anon, authenticated using (enabled = true);

grant select on public.library_api_sources to anon, authenticated;

insert into public.library_api_sources (source, display_name, enabled, requires_key, search_endpoint, description)
values
  ('bickri_lib', 'Bickri Lib', true, false, '/api/library/search', 'Catalogue local Bickri Lib dans Supabase'),
  ('google_books', 'Google Books', true, false, 'https://www.googleapis.com/books/v1/volumes', 'Catalogue mondial et métadonnées de livres'),
  ('open_library', 'Open Library', true, false, 'https://openlibrary.org/search.json', 'Catalogue bibliographique ouvert'),
  ('openalex', 'OpenAlex', true, false, 'https://api.openalex.org/works', 'Travaux et ressources académiques'),
  ('internet_archive', 'Internet Archive', true, false, 'https://archive.org/advancedsearch.php', 'Recherche de contenus et ouvrages numérisés'),
  ('openstax', 'OpenStax', true, false, 'https://openstax.org/', 'Manuels éducatifs ouverts')
on conflict (source) do update set
  display_name = excluded.display_name,
  enabled = excluded.enabled,
  requires_key = excluded.requires_key,
  search_endpoint = excluded.search_endpoint,
  description = excluded.description,
  updated_at = now();
