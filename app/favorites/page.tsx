import Link from "next/link";
import { Heart, BookOpen } from "lucide-react";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar";
import MobileNavigation from "@/components/mobile-navigation";
import { createClient, getSupabaseConfig } from "@/lib/supabase/server";

export default async function FavoritesPage() {
  if (!getSupabaseConfig().configured) {
    return <main className="container" style={{padding:"80px 0"}}><div className="card empty-state"><h1 style={{color:"#071a33"}}>Favoris temporairement indisponibles</h1><p className="muted">Le service de connexion n'est pas encore configuré sur cette version du site.</p><Link href="/" className="btn btn-dark" style={{marginTop:12}}>Retour à l'accueil</Link></div></main>;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/favorites");

  const { data: favorites } = await supabase.from("favorites").select("id,book_id,title,author,cover_url,created_at").eq("user_id", user.id).order("created_at", { ascending: false });

  return <div className="shell"><Sidebar/><MobileNavigation/><main className="page-main"><div className="container">
    <div className="topbar"><div><p className="eyebrow" style={{color:"#9a6b0e",margin:0}}>Ma bibliothèque</p><h1>Mes favoris</h1><p className="muted" style={{margin:"5px 0"}}>Les livres que vous avez enregistrés.</p></div><Link href="/books" className="btn btn-gold"><BookOpen size={17}/> Explorer</Link></div>
    {favorites?.length ? <div className="book-grid">{favorites.map((book)=><article className="book-card" key={book.id}><div className="cover">{book.cover_url ? <img src={book.cover_url} alt={`Couverture de ${book.title}`} loading="lazy"/> : <div style={{height:"100%",display:"grid",placeItems:"center",fontSize:48,fontWeight:900,color:"#071a33"}}>B</div>}<span className="badge">Favori</span></div><div className="book-body"><p className="eyebrow" style={{letterSpacing:".05em",margin:"0 0 5px"}}>Livre numérique</p><h3>{book.title}</h3><p className="book-author">{book.author || "Auteur non renseigné"}</p><div className="book-meta"><span className="rating">♥ Enregistré</span><Link className="btn btn-dark" style={{padding:"8px 12px",fontSize:12}} href={`/books/${book.book_id}`}>Lire</Link></div></div></article>)}</div> : <div className="card empty-state"><Heart size={38} color="#d9a441" style={{margin:"0 auto 12px"}}/><h2 style={{color:"#071a33",marginBottom:8}}>Aucun favori pour le moment</h2><p className="muted">Appuyez sur le cœur d'un livre pour l'ajouter ici. Vos favoris resteront enregistrés dans votre compte.</p><Link href="/books" className="btn btn-dark" style={{marginTop:12}}>Découvrir les livres</Link></div>}
  </div></main></div>;
}
