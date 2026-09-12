import { createClient } from "@/lib/supabase/server";
import type { Book } from "@/types/database";

const demoBooks: Book[] = [
  {id:"demo-1",title:"Apprendre et réussir",author:"Bickri Lib",description:"Une ressource de démonstration pour votre bibliothèque numérique.",cover_url:"https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80",level:"Tous niveaux",subject:"Méthodologie",category:"Éducation",language:"fr",is_premium:false,published_year:2026,file_path:null,file_type:"pdf",file_size:null,page_count:null,license:"Démo",source_url:null,publisher:null,isbn:null,reading_time:10,download_enabled:false,view_count:0,created_at:"2026-01-01T00:00:00.000Z",updated_at:"2026-01-01T00:00:00.000Z"},
  {id:"demo-2",title:"Guide du numérique",author:"Bickri Service Agency",description:"Découvrez les fondamentaux du monde numérique.",cover_url:"https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80",level:"Tous niveaux",subject:"Informatique",category:"Éducation",language:"fr",is_premium:false,published_year:2026,file_path:null,file_type:"pdf",file_size:null,page_count:null,license:"Démo",source_url:null,publisher:null,isbn:null,reading_time:15,download_enabled:false,view_count:0,created_at:"2026-01-02T00:00:00.000Z",updated_at:"2026-01-02T00:00:00.000Z"},
  {id:"demo-3",title:"Entreprendre à l'ère digitale",author:"Bickri Lib",description:"Principes pratiques pour développer un projet digital.",cover_url:"https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=700&q=80",level:"Tous niveaux",subject:"Entrepreneuriat",category:"Formation",language:"fr",is_premium:false,published_year:2026,file_path:null,file_type:"pdf",file_size:null,page_count:null,license:"Démo",source_url:null,publisher:null,isbn:null,reading_time:20,download_enabled:false,view_count:0,created_at:"2026-01-03T00:00:00.000Z",updated_at:"2026-01-03T00:00:00.000Z"},
];

export async function getBooks(query = "", level = "", category = "", subject = ""): Promise<Book[]> {
  const normalized = query.trim();
  const normalizedLevel = level.trim();
  const normalizedCategory = category.trim();
  const normalizedSubject = subject.trim();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return demoBooks.filter(book => {
      const haystack = `${book.title} ${book.author ?? ""} ${book.description ?? ""} ${book.subject ?? ""}`.toLowerCase();
      return (!normalized || haystack.includes(normalized.toLowerCase())) && (!normalizedLevel || book.level === normalizedLevel) && (!normalizedCategory || book.category === normalizedCategory) && (!normalizedSubject || book.subject === normalizedSubject);
    });
  }

  try {
    const supabase = await createClient();
    let request = supabase.from("books").select("id,title,author,description,cover_url,level,subject,category,language,is_premium,published_year,file_path,file_type,file_size,page_count,license,source_url,publisher,isbn,reading_time,download_enabled,view_count,created_at,updated_at").order("created_at", { ascending: false });
    if (normalized) {
      const safeQuery = normalized.replace(/[%_,]/g, " ").trim();
      request = request.or(`title.ilike.%${safeQuery}%,author.ilike.%${safeQuery}%,description.ilike.%${safeQuery}%,subject.ilike.%${safeQuery}%,category.ilike.%${safeQuery}%`);
    }
    if (normalizedLevel) request = request.eq("level", normalizedLevel);
    if (normalizedCategory) request = request.eq("category", normalizedCategory);
    if (normalizedSubject) request = request.eq("subject", normalizedSubject);
    const { data, error } = await request;
    if (error) return [];
    return (data as Book[]) || [];
  } catch {
    return [];
  }
}

export async function getBookById(id: string): Promise<Book | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("books").select("id,title,author,description,cover_url,level,subject,category,language,is_premium,published_year,file_path,file_type,file_size,page_count,license,source_url,publisher,isbn,reading_time,download_enabled,view_count,created_at,updated_at").eq("id", id).maybeSingle();
    if (error || !data) return null;
    return data as Book;
  } catch {
    return null;
  }
}
