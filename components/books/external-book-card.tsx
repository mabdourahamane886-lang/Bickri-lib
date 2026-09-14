import Link from 'next/link';
import { ExternalLink, Globe2 } from 'lucide-react';
import type { ExternalBook } from '@/lib/api/external-books';

export default function ExternalBookCard({ book }: { book: ExternalBook }) {
  const href = book.source_url || book.download_url || '#';
  const accessLabel = book.access_type === 'full' ? 'Lecture disponible' : book.access_type === 'preview' ? 'Aperçu' : 'Consulter';

  return (
    <article className="book-card">
      <div className="cover">
        {book.cover_url ? <img src={book.cover_url} alt={`Couverture de ${book.title}`} loading="lazy" /> : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', padding: 24, background: '#e8eef6', color: '#071a33', textAlign: 'center', fontWeight: 900 }}>{book.title}</div>}
        <span className="badge"><Globe2 size={11} /> Ressource externe</span>
      </div>
      <div className="book-body">
        <h3>{book.title}</h3>
        <p className="book-author">{book.author || 'Auteur non renseigné'}</p>
        <div className="book-tags">
          {book.category && <span className="book-tag">{book.category}</span>}
          {book.level && <span className="book-tag">{book.level}</span>}
          {book.language && <span className="book-tag">{book.language.toUpperCase()}</span>}
        </div>
        <div className="book-meta">
          <span className="rating">{accessLabel}</span>
          <Link href={href} target="_blank" rel="noreferrer" className="btn btn-dark" style={{ padding: '8px 11px', fontSize: 12 }}>
            Ouvrir <ExternalLink size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
