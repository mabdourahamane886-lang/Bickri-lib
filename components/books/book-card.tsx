"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Book } from "@/types/database";
import { createClient } from "@/lib/supabase/client";

export default function BookCard({ book }: { book: Book }) {
  const router = useRouter();
  const [favorite, setFavorite] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    async function loadFavorite() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("book_id", book.id)
        .maybeSingle();
      if (mounted) setFavorite(Boolean(data));
    }

    loadFavorite();
    return () => { mounted = false; };
  }, [book.id]);

  async function toggleFavorite() {
    if (busy) return;
    setBusy(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/login?next=/books/${book.id}`);
      return;
    }

    if (favorite) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("book_id", book.id);
      if (!error) setFavorite(false);
    } else {
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        book_id: book.id,
        title: book.title,
        author: book.author,
        cover_url: book.cover_url,
      });
      if (!error) setFavorite(true);
    }

    setBusy(false);
  }

  return (
    <article className="book-card">
      <div className="cover">
        {book.cover_url ? <img src={book.cover_url} alt={`Couverture de ${book.title}`} loading="lazy"/> : <div style={{height:"100%",display:"grid",placeItems:"center",fontSize:48,fontWeight:900,color:"#071a33"}}>B</div>}
        <span className="badge">Disponible</span>
        <button
          type="button"
          className="favorite-button"
          onClick={toggleFavorite}
          disabled={busy}
          aria-label={favorite ? `Retirer ${book.title} des favoris` : `Ajouter ${book.title} aux favoris`}
          aria-pressed={favorite}
        >
          <Heart size={18} fill={favorite ? "currentColor" : "none"}/>
        </button>
      </div>
      <div className="book-body">
        <p className="eyebrow" style={{letterSpacing:".05em",margin:"0 0 5px"}}>Livre numérique</p>
        <h3>{book.title}</h3>
        <p className="book-author">{book.author || "Auteur non renseigné"}</p>
        <div className="book-meta"><span className="rating">★ 4.8</span><Link className="btn btn-dark" style={{padding:"8px 12px",fontSize:12}} href={`/books/${book.id}`}>Lire</Link></div>
      </div>
    </article>
  );
}
