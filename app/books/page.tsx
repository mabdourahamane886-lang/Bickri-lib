import Link from "next/link";
import { Search, Sparkles } from "lucide-react";
import Sidebar from "@/components/sidebar";
import MobileNavigation from "@/components/mobile-navigation";
import BookCard from "@/components/books/book-card";
import { getBooks } from "@/lib/api/books";

export default async function BooksPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const books = await getBooks(query);
  return <div className="shell"><Sidebar/><MobileNavigation/><main className="page-main"><div className="container">
<div className="topbar"><div><p className="eyebrow" style={{color:"#9a6b0e",margin:0}}>Catalogue</p><h1>Bibliothèque</h1></div><Link href="/dashboard" className="btn btn-dark">Mon espace</Link></div>
<form action="/books" method="get" className="searchbar"><Search size={20} color="#64748b"/><input name="q" defaultValue={query} placeholder="Rechercher un livre, un auteur ou un thème..."/><button className="btn btn-gold" style={{padding:"10px 16px"}} type="submit">Rechercher</button></form>
<div className="section-head" style={{marginTop:30}}><div><h2>{query ? `Résultats pour « ${query} »` : "Livres disponibles"}</h2><p className="muted" style={{margin:"5px 0 0"}}>{books.length} ressource{books.length>1?"s":""} trouvée{books.length>1?"s":""}.</p></div><span className="muted" style={{display:"flex",gap:6,alignItems:"center",fontSize:13}}><Sparkles size={16}/> Sélection Bickri</span></div>
{books.length ? <div className="book-grid">{books.map(book=><BookCard key={book.id} book={book}/>)}</div> : <div className="card" style={{textAlign:"center",padding:"60px 20px"}}><h2 style={{color:"#071a33"}}>Aucun résultat</h2><p className="muted">Essayez un autre titre, auteur ou thème.</p><Link href="/books" className="btn btn-dark">Voir toute la bibliothèque</Link></div>}
<footer className="footer">Bickri Lib · Lecture, apprentissage et ressources numériques.</footer>
</div></main></div>;
}
