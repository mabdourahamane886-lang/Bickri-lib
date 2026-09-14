import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2, FileText, ShieldCheck } from "lucide-react";
import Sidebar from "@/components/sidebar";
import MobileNavigation from "@/components/mobile-navigation";
import { getBookById } from "@/lib/api/books";
import { notFound } from "next/navigation";

const mobileStyles = `
  .book-detail-card{display:grid;grid-template-columns:minmax(220px,300px) 1fr;gap:30px;align-items:center}
  .book-detail-cover{height:390px;border-radius:18px;overflow:hidden}
  .book-detail-content{min-width:0}
  .book-detail-title{font-size:clamp(30px,5vw,48px);color:#071a33;margin:8px 0 12px;line-height:1.08}
  .book-detail-description{line-height:1.8;color:#475569}
  .book-detail-tags{margin:14px 0;display:flex;flex-wrap:wrap;gap:6px}
  .book-detail-features{margin:20px 0;display:grid;gap:10px}
  .book-detail-feature{display:flex;align-items:center;gap:12px}
  .book-detail-file{padding:16px;border-radius:16px;background:#fff8e7;border:1px solid #ead19a}
  @media(max-width:700px){
    .book-detail-card{grid-template-columns:1fr;gap:20px;align-items:start;padding:16px}
    .book-detail-cover{width:100%;height:min(76vw,360px);max-height:360px;border-radius:16px}
    .book-detail-content{width:100%;display:flex;flex-direction:column;align-items:stretch}
    .book-detail-title{font-size:30px;line-height:1.12;margin:8px 0 10px;overflow-wrap:anywhere}
    .book-detail-description{font-size:14px;line-height:1.7;margin:10px 0}
    .book-detail-tags{display:flex;flex-direction:column;align-items:flex-start;gap:8px;margin:14px 0}
    .book-detail-tags .book-tag{display:inline-flex;align-items:center;gap:5px;max-width:100%;white-space:normal;overflow-wrap:anywhere}
    .book-detail-features{gap:9px;margin:16px 0}
    .book-detail-feature{width:100%;padding:10px 0;font-size:13px;line-height:1.45;align-items:flex-start}
    .book-detail-feature .feature-icon{flex:0 0 40px}
    .book-detail-file{width:100%;margin-top:4px}
    .book-detail-file p{margin:7px 0 0;line-height:1.6;font-size:13px}
    .book-detail-content > .btn{width:100%;min-height:48px}
  }
`;

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getBookById(id);
  if (!book) notFound();

  return (
    <div className="shell">
      <style dangerouslySetInnerHTML={{ __html: mobileStyles }} />
      <Sidebar/>
      <MobileNavigation/>
      <main className="page-main">
        <div className="container">
          <Link href="/books" className="btn" style={{ padding: 0, marginBottom: 22, color: "#071a33" }}><ArrowLeft size={18}/> Retour à la bibliothèque</Link>
          <section className="card book-detail-card">
            <div className="cover book-detail-cover">
              {book.cover_url && <img src={book.cover_url} alt={book.title}/>} 
            </div>
            <div className="book-detail-content">
              <p className="eyebrow" style={{ color: "#9a6b0e", margin: 0 }}>{book.category || "Ressource"}</p>
              <h1 className="book-detail-title">{book.title}</h1>
              <p className="muted" style={{ fontSize: 16, margin: "0 0 8px" }}>{book.author || "Auteur non renseigné"}</p>
              <p className="book-detail-description">{book.description || "Cette ressource est disponible dans Bickri Lib."}</p>
              <div className="book-detail-tags">
                {book.level && <span className="book-tag">{book.level}</span>}
                {book.subject && <span className="book-tag">{book.subject}</span>}
                {book.file_type && <span className="book-tag"><FileText size={13}/> {book.file_type.toUpperCase()}</span>}
                {book.license && <span className="book-tag"><ShieldCheck size={13}/> {book.license}</span>}
              </div>
              <div className="book-detail-features">
                <div className="book-detail-feature"><div className="feature-icon"><CheckCircle2 size={18}/></div><span>Lecture numérique sécurisée</span></div>
                <div className="book-detail-feature"><div className="feature-icon"><CheckCircle2 size={18}/></div><span>Accessible depuis ordinateur et mobile</span></div>
              </div>
              {book.file_path ? <Link href={`/reader/${book.id}`} className="btn btn-gold"><BookOpen size={18}/> Commencer la lecture</Link> : <div className="book-detail-file"><strong>Fichier à ajouter</strong><p className="muted">Ce livre est actuellement une fiche catalogue. Un administrateur doit associer le PDF ou EPUB.</p></div>}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
