import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2, Clock3, FileText, Languages, ShieldCheck } from "lucide-react";
import Sidebar from "@/components/sidebar";
import MobileNavigation from "@/components/mobile-navigation";
import { getBookById } from "@/lib/api/books";
import { notFound } from "next/navigation";

const detailStyles = `
  .book-detail-shell{display:grid;grid-template-columns:minmax(250px,330px) minmax(0,1fr);gap:36px;align-items:start;padding:30px}
  .book-detail-cover-wrap{position:relative}
  .book-detail-cover{width:100%;height:430px;overflow:hidden;border-radius:22px;background:#e9eef5;box-shadow:0 20px 45px rgba(7,26,51,.14)}
  .book-detail-cover img{display:block;width:100%;height:100%;object-fit:cover}
  .book-detail-cover-badge{position:absolute;left:16px;top:16px;display:inline-flex;align-items:center;gap:7px;padding:8px 11px;border-radius:999px;background:#071a33;color:#fff;font-size:12px;font-weight:800;box-shadow:0 8px 20px rgba(7,26,51,.18)}
  .book-detail-main{min-width:0}
  .book-detail-kicker{margin:0 0 8px;color:#9a6b0e;font-size:12px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
  .book-detail-title{margin:0;color:#071a33;font-size:clamp(30px,4.5vw,48px);line-height:1.08;letter-spacing:-.03em;overflow-wrap:anywhere}
  .book-detail-author{margin:12px 0 0;color:#64748b;font-size:15px;font-weight:700}
  .book-detail-description{margin:18px 0 0;color:#475569;font-size:16px;line-height:1.8;max-width:720px}
  .book-detail-tags{display:flex;flex-wrap:wrap;gap:9px;margin:20px 0}
  .book-detail-tag{display:inline-flex;align-items:center;gap:6px;min-height:34px;padding:7px 11px;border:1px solid #dbe3ec;border-radius:999px;background:#fff;color:#334155;font-size:12px;font-weight:800}
  .book-detail-facts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:20px 0}
  .book-detail-fact{display:flex;align-items:center;gap:10px;min-width:0;padding:13px 14px;border:1px solid #e3e9f0;border-radius:16px;background:#f8fafc;color:#334155}
  .book-detail-fact svg{flex:0 0 auto;color:#9a6b0e}
  .book-detail-fact span{min-width:0;overflow-wrap:anywhere;font-size:12px;line-height:1.35;font-weight:800}
  .book-detail-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}
  .book-detail-actions .btn{min-height:50px;padding:0 18px}
  .book-detail-notice{margin-top:18px;padding:16px 18px;border-radius:18px;border:1px solid #ead19a;background:#fff8e7;color:#6b4c11}
  .book-detail-notice strong{display:block;font-size:14px;line-height:1.3}
  .book-detail-notice p{margin:7px 0 0;font-size:13px;line-height:1.55;color:#7a5b1c}
  .book-detail-footer-line{display:flex;align-items:center;gap:8px;margin-top:18px;color:#64748b;font-size:12px;font-weight:700}

  @media(max-width:900px){
    .book-detail-shell{grid-template-columns:220px minmax(0,1fr);gap:22px;padding:22px}
    .book-detail-cover{height:330px}
    .book-detail-facts{grid-template-columns:1fr 1fr}
  }

  @media(max-width:700px){
    .book-detail-shell{display:flex;flex-direction:column;width:100%;gap:20px;padding:16px;box-sizing:border-box;overflow:hidden}
    .book-detail-cover-wrap{width:100%}
    .book-detail-cover{width:100%;height:280px;border-radius:18px;box-shadow:0 14px 30px rgba(7,26,51,.12)}
    .book-detail-cover-badge{left:12px;top:12px}
    .book-detail-main{width:100%;min-width:0}
    .book-detail-kicker{margin-top:0;font-size:11px}
    .book-detail-title{font-size:30px;line-height:1.1}
    .book-detail-author{font-size:14px}
    .book-detail-description{margin-top:14px;font-size:14px;line-height:1.65}
    .book-detail-tags{gap:7px;margin:16px 0}
    .book-detail-tag{font-size:11px;min-height:32px;padding:6px 9px;max-width:100%;box-sizing:border-box;white-space:normal}
    .book-detail-facts{display:flex;flex-direction:column;gap:8px;margin:16px 0}
    .book-detail-fact{width:100%;box-sizing:border-box;padding:11px 12px;border-radius:14px}
    .book-detail-actions{display:flex;flex-direction:column;gap:9px;margin-top:18px}
    .book-detail-actions .btn{width:100%;min-height:50px;justify-content:center;box-sizing:border-box}
    .book-detail-notice{width:100%;box-sizing:border-box;margin-top:14px;padding:14px}
    .book-detail-footer-line{align-items:flex-start;line-height:1.4}
  }
`;

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getBookById(id);
  if (!book) notFound();

  const readingTime = book.reading_time ? `${book.reading_time} min` : "À découvrir";
  const language = book.language === "fr" ? "Français" : (book.language || "Non précisé");

  return (
    <div className="shell">
      <style dangerouslySetInnerHTML={{ __html: detailStyles }} />
      <Sidebar />
      <MobileNavigation />
      <main className="page-main">
        <div className="container">
          <Link href="/books" className="btn" style={{ padding: 0, marginBottom: 18, color: "#071a33" }}>
            <ArrowLeft size={18} /> Retour à la bibliothèque
          </Link>

          <section className="card book-detail-shell">
            <div className="book-detail-cover-wrap">
              <div className="book-detail-cover">
                {book.cover_url ? <img src={book.cover_url} alt={`Couverture de ${book.title}`} /> : <div style={{ height: "100%", display: "grid", placeItems: "center", fontSize: 56, fontWeight: 900, color: "#071a33" }}>B</div>}
              </div>
              <span className="book-detail-cover-badge">
                <BookOpen size={14} /> Bickri Lib
              </span>
            </div>

            <div className="book-detail-main">
              <p className="book-detail-kicker">{book.category || "Ressource numérique"}</p>
              <h1 className="book-detail-title">{book.title}</h1>
              <p className="book-detail-author">{book.author || "Auteur non renseigné"}</p>
              <p className="book-detail-description">{book.description || "Cette ressource est disponible dans Bickri Lib."}</p>

              <div className="book-detail-tags">
                {book.level && <span className="book-detail-tag">{book.level}</span>}
                {book.subject && <span className="book-detail-tag">{book.subject}</span>}
                {book.file_type && <span className="book-detail-tag"><FileText size={13} /> {book.file_type.toUpperCase()}</span>}
                {book.license && <span className="book-detail-tag"><ShieldCheck size={13} /> {book.license}</span>}
              </div>

              <div className="book-detail-facts">
                <div className="book-detail-fact"><Clock3 size={17} /><span>Lecture estimée : {readingTime}</span></div>
                <div className="book-detail-fact"><Languages size={17} /><span>{language}</span></div>
                <div className="book-detail-fact"><CheckCircle2 size={17} /><span>Optimisé ordinateur et mobile</span></div>
              </div>

              <div className="book-detail-actions">
                {book.file_path ? (
                  <Link href={`/reader/${book.id}`} className="btn btn-gold"><BookOpen size={18} /> Commencer la lecture</Link>
                ) : (
                  <button className="btn btn-gold" type="button" disabled style={{ opacity: .72, cursor: "not-allowed" }}>
                    <BookOpen size={18} /> Lecture bientôt disponible
                  </button>
                )}
                <Link href="/books" className="btn">Voir d'autres livres</Link>
              </div>

              {!book.file_path && (
                <div className="book-detail-notice">
                  <strong>Cette fiche est prête, le fichier de lecture reste à ajouter.</strong>
                  <p>Le catalogue et les informations du livre sont déjà disponibles. Le PDF ou l'EPUB pourra être associé depuis l'administration.</p>
                </div>
              )}

              <div className="book-detail-footer-line">
                <CheckCircle2 size={15} /> Une interface pensée pour une lecture claire, sans éléments qui se chevauchent.
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
