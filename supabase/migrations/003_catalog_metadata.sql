alter table public.books add column if not exists level text;
alter table public.books add column if not exists subject text;
alter table public.books add column if not exists category text;
alter table public.books add column if not exists language text not null default 'fr';
alter table public.books add column if not exists is_premium boolean not null default false;
alter table public.books add column if not exists published_year integer;

create index if not exists books_level_idx on public.books(level);
create index if not exists books_category_idx on public.books(category);
create index if not exists books_subject_idx on public.books(subject);

insert into public.books (title, author, description, cover_url, level, subject, category, language, is_premium, published_year) values
('Mon premier livre de lecture','Bickri Lib','Lecture et compréhension pour le primaire.','https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80','CI','Français','Scolaire','fr',false,2026),
('Mathématiques essentielles','Bickri Lib','Notions fondamentales de mathématiques pour le primaire.','https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=700&q=80','CM1','Mathématiques','Scolaire','fr',false,2026),
('Sciences naturelles','Bickri Lib','Introduction aux sciences naturelles pour les élèves du primaire.','https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=700&q=80','CM2','Sciences','Scolaire','fr',false,2026),
('Français et expression','Bickri Lib','Grammaire, vocabulaire et expression écrite au collège.','https://images.unsplash.com/photo-1455885666463-7ca7e5c5d9cc?auto=format&fit=crop&w=700&q=80','6e','Français','Scolaire','fr',false,2026),
('Mathématiques 5e','Bickri Lib','Cours de mathématiques pour la classe de cinquième.','https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=700&q=80','5e','Mathématiques','Scolaire','fr',false,2026),
('Histoire du Niger','Bickri Lib','Repères historiques et culturels pour les collégiens et lycéens.','https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=700&q=80','4e','Histoire','Scolaire','fr',false,2026),
('Sciences physiques 3e','Bickri Lib','Bases de physique et chimie adaptées au collège.','https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=700&q=80','3e','Sciences physiques','Scolaire','fr',false,2026),
('Français Première','Bickri Lib','Méthodes et notions pour la littérature et l’expression.','https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=700&q=80','1ère','Français','Scolaire','fr',true,2026),
('Mathématiques Terminale','Bickri Lib','Révision de mathématiques pour la préparation au bac.','https://images.unsplash.com/photo-1509869175650-a1d97972541a?auto=format&fit=crop&w=700&q=80','Tle','Mathématiques','Scolaire','fr',true,2026),
('Physique-Chimie Terminale','Bickri Lib','Révisions et exercices de physique-chimie niveau terminale.','https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=700&q=80','Tle','Physique-Chimie','Scolaire','fr',true,2026),
('Préparation au BAC','Bickri Lib','Méthodes de révision et entraînement au baccalauréat.','https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80','Tle','Méthodologie','Examens','fr',false,2026),
('Le voyage intérieur','Auteur Bickri','Roman original de démonstration pour la plateforme Bickri Lib.','https://images.unsplash.com/photo-1511108690759-009324a90311?auto=format&fit=crop&w=700&q=80','Tous niveaux','Littérature','Roman','fr',false,2026),
('Les chemins de l’espoir','Auteur Bickri','Roman original sur le courage et la persévérance.','https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=700&q=80','Tous niveaux','Littérature','Roman','fr',false,2026),
('Une nuit à Niamey','Auteur Bickri','Roman original inspiré d’une aventure urbaine.','https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80','Tous niveaux','Littérature','Roman','fr',false,2026),
('Contes du Sahel','Auteur Bickri','Recueil de contes original pour la lecture loisir.','https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=700&q=80','Tous niveaux','Littérature','Contes','fr',false,2026),
('Guide du numérique pour débutants','Bickri Lib','Introduction à la culture numérique et aux outils modernes.','https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=700&q=80','Tous niveaux','Informatique','Éducation','fr',false,2026),
('Anglais pratique collège','Bickri Lib','Vocabulaire et communication en anglais pour le collège.','https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=700&q=80','Collège','Anglais','Scolaire','fr',false,2026),
('Philosophie Terminale','Bickri Lib','Notions et méthodes pour l’épreuve de philosophie.','https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=700&q=80','Tle','Philosophie','Scolaire','fr',true,2026),
('Économie Première','Bickri Lib','Introduction aux grands thèmes d’économie pour le lycée.','https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=700&q=80','1ère','Économie','Scolaire','fr',false,2026),
('Culture générale','Bickri Lib','Sélection de ressources pour développer sa culture générale.','https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=700&q=80','Tous niveaux','Culture générale','Éducation','fr',false,2026)
on conflict do nothing;
