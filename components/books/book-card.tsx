import type { Book } from "@/types/database";

export function BookCard({ book }: { book: Book }) {
  return <article className="card">
    {book.cover_url && <img src={book.cover_url} alt={book.title} style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", borderRadius: 10 }} />}
    <h2>{book.title}</h2>
    {book.author && <p>{book.author}</p>}
    {book.description && <p>{book.description}</p>}
  </article>;
}
