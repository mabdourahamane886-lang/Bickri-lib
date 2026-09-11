import { createClient } from "@/lib/supabase/server";
import type { Book } from "@/types/database";

export async function getBooks(): Promise<Book[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("books")
    .select("id,title,author,description,cover_url,created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Book[];
}
