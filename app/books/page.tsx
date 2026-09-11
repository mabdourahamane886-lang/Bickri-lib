import { getBooks } from "@/lib/api/books";
import { BookCard } from "@/components/books/book-card";

export default async function BooksPage() {
  const books = await getBooks();
  return <main className="container" style={{ padding: "48px 0" }}>
    <h1>Bibliothèque</h1>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 }}>
      {books.map(book => <BookCard key={book.id} book={book} />)}
    </div>
  </main>;
}
