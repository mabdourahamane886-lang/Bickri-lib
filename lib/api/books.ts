import { createClient } from "@/lib/supabase/server";
import type { Book } from "@/types/database";

const demoBooks: Book[] = [
  {id:"demo-1",title:"Apprendre et réussir",author:"Bickri Lib",description:"Une ressource de démonstration pour votre bibliothèque numérique.",cover_url:"https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80",created_at:"2026-01-01T00:00:00.000Z"},
  {id:"demo-2",title:"Guide du numérique",author:"Bickri Service Agency",description:"Découvrez les fondamentaux du monde numérique.",cover_url:"https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80",created_at:"2026-01-02T00:00:00.000Z"},
  {id:"demo-3",title:"Entreprendre à l'ère digitale",author:"Bickri Lib",description:"Principes pratiques pour développer un projet digital.",cover_url:"https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=700&q=80",created_at:"2026-01-03T00:00:00.000Z"},
];

export async function getBooks(): Promise<Book[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) return demoBooks;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("books").select("id,title,author,description,cover_url,created_at").order("created_at", { ascending: false });
    if (error) return demoBooks;
    return (data as Book[]) || demoBooks;
  } catch { return demoBooks; }
}
