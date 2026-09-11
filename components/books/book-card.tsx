import Link from "next/link";
import type { Book } from "@/types/database";

export default function BookCard({ book }: { book: Book }) {
  return <article className="book-card">
    <div className="cover">
      {book.cover_url ? <img src={book.cover_url} alt={`Couverture de ${book.title}`} loading="lazy"/> : <div style={{height:"100%",display:"grid",placeItems:"center",fontSize:48,fontWeight:900,color:"#071a33"}}>B</div>}
      <span className="badge">Disponible</span>
    </div>
    <div className="book-body">
      <p className="eyebrow" style={{letterSpacing:".05em",margin:"0 0 5px"}}>Livre numérique</p>
      <h3>{book.title}</h3>
      <p className="book-author">{book.author || "Auteur non renseigné"}</p>
      <div className="book-meta"><span className="rating">★ 4.8</span><Link className="btn btn-dark" style={{padding:"8px 12px",fontSize:12}} href={`/books/${book.id}`}>Lire</Link></div>
    </div>
  </article>;
}
