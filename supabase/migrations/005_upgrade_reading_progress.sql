-- Applied to Supabase with the migration tool.
alter table public.reading_progress add column if not exists current_page integer not null default 0;
alter table public.reading_progress add column if not exists progress_percent numeric(5,2) not null default 0;
alter table public.reading_progress add column if not exists completed boolean not null default false;
update public.reading_progress set progress_percent = greatest(0, least(100, coalesce(progress, 0)));
create unique index if not exists reading_progress_user_book_uidx on public.reading_progress(user_id, book_id);
