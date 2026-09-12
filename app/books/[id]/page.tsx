import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2, FileText, ShieldCheck } from "lucide-react";
import Sidebar from "@/components/sidebar";
import MobileNavigation from "@/components/mobile-navigation";
import { getBookById } from "@/lib/api/books";
import { notFound } from "next/navigation";

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getBookById(id);
  if (!book) notFound();

  return (
    <div className="shell"><Sidebar/><MobileNavigation/>
      <main className="page-main"><div className="container">
        <Link href="/books" className="btn" style={{ padding: 0, marginBottom: 22, color: "#071a33" }}><ArrowLeft size={18}/> Retour à la bibliothèque</Link>
        <section className="card" style={{ display: "grid", gridTemplateColumns: "minmax(220px,300px) 1fr", gap: 30, alignItems: "center" }}>
          <div className="cover" style={{ height: 390, borderRadius: 18 }}>{book.cover_url && <img src={book.cover_url} alt={book.title}/>}</div>
          <div>
            <p className="eyebrow" style={{ color: "#9a6b0e" }}>{book.category || "Ressource"}</p>
            <h1 style={{ fontSize: "clamp(30px,5vw,48px)", color: "#071a33", margin: "8px 0 12px" }}>{book.title}</h1>
            <p className="muted" style={{ fontSize: 16 }}>{book.author || "Auteur non renseigné"}</p>
            <p style={{ lineHeight: 1.8, color: "#475569" }}>{book.description || "Cette ressource est disponible dans Bickri Lib."}</p>
            <div className="book-tags" style={{ margin: "14px 0" }}>
              {book.level && <span className="book-tag">{book.level}</span>}
              {book.subject && <span className="book-tag">{book.subject}</span>}
              {book.file_type && <span className="book-tag"><FileText size={13}/> {book.file_type.toUpperCase()}</span>}
              {book.license && <span className="book-tag"><ShieldCheck size={13}/> {book.license}</span>}
            </div>
            <div className="feature-list" style={{ margin: "20px 0" }}>
              <div className="feature"><div className="feature-icon"><CheckCircle2 size={18}/></div><span>Lecture numérique sécurisée</span></div>
              <div className="feature"><div className="feature-icon"><CheckCircle2 size={18}/></div><span>Accessible depuis ordinateur et mobile</span></div>
            </div>
            {book.file_path ? <Link href={`/reader/${book.id}`} className="btn btn-gold"><BookOpen size={18}/> Commencer la lecture</Link> : <div className="card" style={{ background: "#fff8e7", border: "1px solid #ead19a" }}><strong>Fichier à ajouter</strong><p className="muted">Ce livre est actuellement une fiche catalogue. Un administrateur doit associer le PDF ou EPUB.</p></div>}
          </div>
        </section>
      </div></main>
    </div>
  );
}
