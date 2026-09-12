export type Book = {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  cover_url: string | null;
  level: string | null;
  subject: string | null;
  category: string | null;
  language: string;
  is_premium: boolean;
  published_year: number | null;
  created_at: string;
};
