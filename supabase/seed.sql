insert into public.books (title, author, description)
values
  ('Introduction à l''informatique', 'Bickri Lib', 'Ressource de démonstration pour la bibliothèque.'),
  ('Méthodes de travail pour les élèves', 'Bickri Lib', 'Conseils pratiques pour apprendre efficacement.')
on conflict do nothing;
