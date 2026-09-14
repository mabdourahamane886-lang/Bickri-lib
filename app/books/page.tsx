import Link from "next/link";
import { Search, Sparkles, Globe2 } from "lucide-react";
import Sidebar from "@/components/sidebar";
import MobileNavigation from "@/components/mobile-navigation";
import BookCard from "@/components/books/book-card";
import ExternalBookCard from "@/components/books/external-book-card";
import { getBooks } from "@/lib/api/books";
import { searchExternalBooks } from "@/lib/api/external-books";

const levels = ["", "CI", "CP", "CE1", "CE2", "CM1", "CM2", "6e", "5e", "4e", "3e", "Seconde", "1ère", "Tle", "Collège", "Lycée", "Université", "Tous niveaux"];
const categories = ["", "Scolaire", "Roman", "Contes", "Éducation", "Formation", "Examens", "Université", "Archives"];

const mobileStyles = `
  @media(max-width: 900px){
    .integrated-sources-block{display:none !important}
  }
`;

export default async function BooksPage({ searchParams }: { searchParams: Promise<{ q?: string; level?: string; category?: string; subject?: string }> }) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const level = params.level?.trim() ?? "";
  const category = params.category?.trim() ?? "";
  const subject = params.subject?.trim() ?? "";

  const [books, externalBooks] = await Promise.all([
    getBooks(query, level, category, subject),
    query.length >= 2 ? searchExternalBooks(query) : Promise.resolve([]),
  ]);

  return <div className="shell"><style dangerouslySetInnerHTML={{ __html: mobileStyles }} /><Sidebar/><MobileNavigation/><main className="page-main"><div className="container">
    <div className="topbar"><div><p className="eyebrow" style={{color:"#9a6b0e",margin:0}}>Catalogue scolaire & lecture</p><h1>Bibliothèque</h1><p className="muted" style={{margin:"5px 0 0"}}>Primaire, collège, lycée, université, formations et examens.</p></div><Link href="/dashboard" className="btn btn-dark">Mon espace</Link></div>
    <form action="/books" method="get" className="searchbar"><Search size={20} color="#64748b"/><input name="q" defaultValue={query} placeholder="Rechercher un livre, un auteur, une matière..."/><button className="btn btn-gold" style={{padding:"10px 16px"}} type="submit">Rechercher</button></form>
    <form action="/books" method="get" className="filter-row" style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:12,marginTop:14}}>
      <input type="hidden" name="q" value={query}/>
      <select name="level" defaultValue={level} aria-label="Niveau scolaire">
        <option value="">Tous les niveaux</option>{levels.filter(Boolean).map(item=><option key={item} value={item}>{item}</option>)}
      </select>
      <select name="category" defaultValue={category} aria-label="Catégorie">
        <option value="">Toutes les catégories</option>{categories.filter(Boolean).map(item=><option key={item} value={item}>{item}</option>)}
      </select>
      <input name="subject" defaultValue={subject} placeholder="Matière : français, maths, histoire..." aria-label="Matière"/>
      <button className="btn btn-dark" style={{gridColumn:"1 / -1",justifySelf:"start"}} type="submit">Appliquer les filtres</button>
    </form>

    <div className="section-head" style={{marginTop:30}}><div><h2>{query || level || category || subject ? "Ressources Bickri Lib" : "Livres disponibles"}</h2><p className="muted" style={{margin:"5px 0 0"}}>{books.length} ressource{books.length>1?"s":""} locale{books.length>1?"s":""}.</p></div><span className="muted" style={{display:"flex",gap:6,alignItems:"center",fontSize:13}}><Sparkles size={16}/> Catalogue Bickri</span></div>
    {books.length ? <div className="book-grid">{books.map(book=><BookCard key={book.id} book={book}/>)}</div> : <div className="card" style={{textAlign:"center",padding:"40px 20px"}}><h2 style={{color:"#071a33"}}>Aucune ressource locale</h2><p className="muted">Les sources externes peuvent quand même proposer des résultats ci-dessous.</p></div>}

    {externalBooks.length > 0 && <section className="section"><div className="section-head"><div><p className="eyebrow" style={{color:"#9a6b0e",margin:0}}>Recherche multi-sources</p><h2><Globe2 size={20} style={{verticalAlign:"-3px",marginRight:7}}/>Ressources externes</h2><p className="muted" style={{margin:"5px 0 0"}}>{externalBooks.length} résultats issus de plusieurs catalogues publics et académiques.</p></div></div><div className="book-grid">{externalBooks.map(book=><ExternalBookCard key={book.id} book={book}/>)}</div></section>}

    <div className="card section integrated-sources-block" style={{background:"#071a33",color:"white"}}><h2 style={{margin:"0 0 8px"}}>Sources intégrées</h2><p style={{margin:0,color:"#cbd5e1",lineHeight:1.6}}>Bickri Lib interroge son catalogue Supabase et complète les recherches avec Google Books, Open Library, OpenAlex et Internet Archive.</p></div>
    <footer className="footer">Bickri Lib · Lecture, apprentissage et ressources numériques.</footer>
  </div></main></div>;
}
