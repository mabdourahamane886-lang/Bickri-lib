import Link from "next/link";
import { Search, Sparkles } from "lucide-react";
import Sidebar from "@/components/sidebar";
import MobileNavigation from "@/components/mobile-navigation";
import BookCard from "@/components/books/book-card";
import { getBooks } from "@/lib/api/books";

export default async function BooksPage(){const books=await getBooks();return <div className="shell"><Sidebar/><MobileNavigation/><main className="page-main"><div className="container">
<div className="topbar"><div><p className="eyebrow" style={{color:"#9a6b0e",margin:0}}>Catalogue</p><h1>Bibliothèque</h1></div><Link href="/dashboard" className="btn btn-dark">Mon espace</Link></div>
<div className="searchbar"><Search size={20} color="#64748b"/><input placeholder="Rechercher un livre, un auteur ou un thème..."/><button className="btn btn-gold" style={{padding:"10px 16px"}}>Rechercher</button></div>
<div className="section-head" style={{marginTop:30}}><div><h2>Livres disponibles</h2><p className="muted" style={{margin:"5px 0 0"}}>{books.length} ressource{books.length>1?"s":""} dans votre bibliothèque.</p></div><span className="muted" style={{display:"flex",gap:6,alignItems:"center",fontSize:13}}><Sparkles size={16}/> Sélection Bickri</span></div>
{books.length ? <div className="book-grid">{books.map(book=><BookCard key={book.id} book={book}/>)}</div> : <div className="card" style={{textAlign:"center",padding:"60px 20px"}}><h2 style={{color:"#071a33"}}>Votre bibliothèque est prête</h2><p className="muted">Ajoutez vos premiers livres depuis Supabase pour les afficher ici.</p></div>}
<footer className="footer">Bickri Lib · Lecture, apprentissage et ressources numériques.</footer>
</div></main></div>}
