import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Connexion requise" }, { status: 401 });

  const { data: book, error } = await supabase
    .from("books")
    .select("id,file_path,file_type,title,is_premium")
    .eq("id", id)
    .maybeSingle();

  if (error || !book) return NextResponse.json({ error: "Livre introuvable" }, { status: 404 });
  if (!book.file_path) return NextResponse.json({ error: "Aucun fichier associé à ce livre" }, { status: 404 });

  if (book.is_premium) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      return NextResponse.json(
        { error: "Ce contenu est premium. Un abonnement ou un achat est nécessaire pour y accéder." },
        { status: 403 }
      );
    }
  }

  const { data: signed, error: signedError } = await supabase.storage
    .from("bickri-books")
    .createSignedUrl(book.file_path, 60 * 60);

  if (signedError || !signed?.signedUrl) {
    return NextResponse.json({ error: "Impossible de préparer la lecture" }, { status: 500 });
  }

  return NextResponse.json({ url: signed.signedUrl, type: book.file_type, title: book.title });
}
