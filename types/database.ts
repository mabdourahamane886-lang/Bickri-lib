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
  file_path: string | null;
  file_type: "pdf" | "epub" | "other" | null;
  file_size: number | null;
  page_count: number | null;
  license: string | null;
  source_url: string | null;
  publisher: string | null;
  isbn: string | null;
  reading_time: number | null;
  download_enabled: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
};

export type ReadingProgress = {
  id: string;
  user_id: string;
  book_id: string;
  current_page: number;
  progress_percent: number;
  completed: boolean;
  last_read_at: string;
};

export type Profile = {
  id: string;
  role: "user" | "admin";
};
