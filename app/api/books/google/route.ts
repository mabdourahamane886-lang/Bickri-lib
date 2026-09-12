import { NextResponse } from "next/server";

const API_URL = "https://www.googleapis.com/books/v1/volumes";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ items: [] });

  const key = process.env.GOOGLE_BOOKS_API_KEY;
  const url = new URL(API_URL);
  url.searchParams.set("q", q);
  url.searchParams.set("maxResults", "20");
  url.searchParams.set("printType", "books");
  url.searchParams.set("langRestrict", "fr");
  if (key) url.searchParams.set("key", key);

  try {
    const response = await fetch(url, { next: { revalidate: 300 } });
    if (!response.ok) {
      return NextResponse.json({ error: "Google Books est temporairement indisponible." }, { status: 502 });
    }
    const data = await response.json();
    const items = (data.items ?? []).map((item: any) => {
      const info = item.volumeInfo ?? {};
      return {
        id: item.id,
        title: info.title ?? "Sans titre",
        authors: info.authors ?? [],
        description: info.description ?? "",
        publishedDate: info.publishedDate ?? "",
        categories: info.categories ?? [],
        thumbnail: info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail ?? null,
        previewLink: info.previewLink ?? null,
      };
    });
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "Impossible de contacter Google Books." }, { status: 500 });
  }
}
