import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2, FileText, ShieldCheck } from "lucide-react";
import Sidebar from "@/components/sidebar";
import MobileNavigation from "@/components/mobile-navigation";
import { getBookById } from "@/lib/api/books";
import { notFound } from "next/navigation";

const mobileStyles = `
  .book-detail-card{display:grid;grid-template-columns:minmax(220px,300px) 1fr;gap:30px;align-items:start}
  .book-detail-cover{height:390px;border-radius:18px;overflow:hidden}
  .book-detail-content{min-width:0}
  .book-detail-title{font-size:clamp(30px,5vw,48px);color:#071a33;margin:8px 0 12px;line-height:1.08}
  .book-detail-description{line-height:1.8;color:#475569}
  .book-detail-tags{margin:14px 0;display:flex;flex-wrap:wrap;gap:6px}
  .book-detail-features{margin:20px 0;display:grid;gap:10px}
  .book-detail-feature{display:flex;align-items:center;gap:12px}
  .book-detail-file{padding:16px;border-radius:16px;background:#fff8e7;border:1px solid #ead19a}
  @media(max-width:700px){
    .book-detail-card{display:flex;flex-direction:column;width:100%;gap:18px;align-items:stretch;padding:16px;overflow:hidden}
    .book-detail-cover{width:100%;height:280px;max-height:none;border-radius:16px;flex:none}
    .book-detail-cover img{width:100%;height:100%;object-fit:cover;display:block}
    .book-detail-content{width:100%;min-width:0;display:flex;flex-direction:column;align-items:stretch;gap:0}
    .book-detail-content > *{max-width:100%;box-sizing:border-box}
    .book-detail-title{font-size:28px;line-height:1.15;margin:8px 0 10px;overflow-wrap:anywhere;word-break:break-word}
    .book-detail-description{font-size:14px;line-height:1.65;margin:8px 0}
    .book-detail-tags{display:flex;flex-direction:column;align-items:stretch;gap:8px;margin:12px 0}
    .book-detail-tags .book-tag{display:flex;align-items:center;gap:6px;width:100%;max-width:100%;min-height:36px;padding:8px 10px;white-space:normal;overflow-wrap:anywhere;box-sizing:border-box}
    .book-detail-features{display:flex;flex-direction:column;gap:8px;margin:14px 0}
    .book-detail-feature{display:flex;width:100%;min-width:0;padding:10px 0;font-size:13px;line-height:1.45;align-items:flex-start}
    .book-detail-feature .feature-icon{flex:0 0 40px}
    .book-detail-feature span{min-width:0;overflow-wrap:anywhere}
    .book-detail-file{width:100%;margin-top:4px;box-sizing:border-box}
    .book-detail-file strong{display:block;font-size:15px;line-height:1.3}
    .book-detail-file p{margin:7px 0 0;line-height:1.6;font-size:13px;overflow-wrap:anywhere}
    .book-detail-content > .btn{width:100%;min-height:48px;margin-top:4px}
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
