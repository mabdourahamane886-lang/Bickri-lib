import { createAdminClient } from "@/lib/supabase/admin";

export type ExternalBook = {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  cover_url: string | null;
  level: string | null;
  subject: string | null;
  category: string;
  language: string | null;
  published_year: number | null;
  publisher: string | null;
  isbn: string | null;
  source: "google_books" | "open_library" | "openalex" | "internet_archive" | "openstax";
  source_url: string | null;
  access_type: "full" | "preview" | "external";
  download_url: string | null;
};

const DEFAULT_TIMEOUT = 5000;
const LIMIT = 8;
const MAX_RESULTS = 40;
const CACHE_TTL_MS = 60 * 60 * 1000;

function cleanText(value: unknown, max = 700): string | null {
  if (typeof value !== "string") return null;
  const text = value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text ? text.slice(0, max) : null;
}

function normalizeQuery(value: string) {
  return value.toLocaleLowerCase("fr-FR").normalize("NFKC").replace(/\s+/g, " ").trim();
}

function yearFrom(value: unknown): number | null {
  const match = String(value ?? "").match(/(19|20)\d{2}/);
  return match ? Number(match[0]) : null;
}

function coverFromGoogle(info: any): string | null {
  const url = info?.imageLinks?.thumbnail || info?.imageLinks?.smallThumbnail;
  return typeof url === "string" ? url.replace(/^http:/, "https:") : null;
}

async function fetchJson(url: string, init: RequestInit = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "Bickri Lib/1.0 (bickriservice.com)",
        ...(init.headers || {}),
      },
      next: { revalidate: 300 },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function searchGoogleBooks(query: string): Promise<ExternalBook[]> {
  const url = new URL("https://www.googleapis.com/books/v1/volumes");
  url.searchParams.set("q", query);
  url.searchParams.set("maxResults", String(LIMIT));
  url.searchParams.set("printType", "books");
  url.searchParams.set("orderBy", "relevance");
  const key = process.env.GOOGLE_BOOKS_API_KEY;
  if (key) url.searchParams.set("key", key);

  const data = await fetchJson(url.toString());
  return Array.isArray(data?.items) ? data.items.map((item: any) => {
    const info = item?.volumeInfo || {};
    const access = item?.accessInfo || {};
    const viewability = access?.viewability;
    const accessType: ExternalBook["access_type"] = viewability === "ALL_PAGES" ? "full" : viewability === "PARTIAL" ? "preview" : "external";
    return {
      id: `google:${item?.id || crypto.randomUUID()}`,
      title: cleanText(info?.title, 220) || "Sans titre",
      author: Array.isArray(info?.authors) ? info.authors.slice(0, 5).join(", ") : null,
      description: cleanText(info?.description),
      cover_url: coverFromGoogle(info),
      level: null,
      subject: Array.isArray(info?.categories) ? info.categories[0] ?? null : null,
      category: "Catalogue",
      language: info?.language || null,
      published_year: yearFrom(info?.publishedDate),
      publisher: cleanText(info?.publisher, 160),
      isbn: Array.isArray(info?.industryIdentifiers) ? (info.industryIdentifiers.find((x: any) => x?.type === "ISBN_13")?.identifier || info.industryIdentifiers[0]?.identifier || null) : null,
      source: "google_books" as const,
      source_url: info?.infoLink || item?.selfLink || null,
      access_type: accessType,
      download_url: access?.epub?.isAvailable ? access?.epub?.acsTokenLink || null : null,
    };
  }) : [];
}

async function searchOpenLibrary(query: string): Promise<ExternalBook[]> {
  const url = new URL("https://openlibrary.org/search.json");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", String(LIMIT));
  url.searchParams.set("lang", "fr");
  url.searchParams.set("fields", "key,title,author_name,first_publish_year,cover_i,isbn,subject,publisher,language,ebook_access,public_scan_b");

  const data = await fetchJson(url.toString());
  return Array.isArray(data?.docs) ? data.docs.map((item: any) => {
    const access = item?.ebook_access;
    const accessType: ExternalBook["access_type"] = access === "public" ? "full" : access === "borrowable" ? "preview" : "external";
    const key = String(item?.key || "").replace(/^\//, "");
    return {
      id: `openlibrary:${key || item?.isbn?.[0] || crypto.randomUUID()}`,
      title: cleanText(item?.title, 220) || "Sans titre",
      author: Array.isArray(item?.author_name) ? item.author_name.slice(0, 5).join(", ") : null,
      description: null,
      cover_url: item?.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg` : null,
      level: null,
      subject: Array.isArray(item?.subject) ? item.subject[0] ?? null : null,
      category: "Catalogue",
      language: Array.isArray(item?.language) ? item.language[0] ?? null : null,
      published_year: yearFrom(item?.first_publish_year),
      publisher: Array.isArray(item?.publisher) ? item.publisher[0] ?? null : null,
      isbn: Array.isArray(item?.isbn) ? item.isbn[0] ?? null : null,
      source: "open_library" as const,
      source_url: key ? `https://openlibrary.org/${key}` : null,
      access_type: accessType,
      download_url: item?.public_scan_b && key ? `https://openlibrary.org/${key}` : null,
    };
  }) : [];
}

async function searchOpenAlex(query: string): Promise<ExternalBook[]> {
  const url = new URL("https://api.openalex.org/works");
  url.searchParams.set("search", query);
  url.searchParams.set("per-page", String(LIMIT));
  url.searchParams.set("select", "id,title,publication_year,authorships,primary_location,open_access,best_oa_location,type");
  if (process.env.OPENALEX_API_KEY) url.searchParams.set("api_key", process.env.OPENALEX_API_KEY);
  if (process.env.OPENALEX_EMAIL) url.searchParams.set("mailto", process.env.OPENALEX_EMAIL);

  const data = await fetchJson(url.toString());
  return Array.isArray(data?.results) ? data.results.map((item: any) => {
    const authors = Array.isArray(item?.authorships) ? item.authorships.map((a: any) => a?.author?.display_name).filter(Boolean).slice(0, 4).join(", ") : null;
    const landing = item?.best_oa_location?.landing_page_url || item?.primary_location?.landing_page_url || null;
    const pdf = item?.best_oa_location?.pdf_url || item?.primary_location?.pdf_url || null;
    return {
      id: `openalex:${String(item?.id || crypto.randomUUID()).split("/").pop()}`,
      title: cleanText(item?.title, 220) || "Sans titre",
      author: authors,
      description: null,
      cover_url: null,
      level: "Université",
      subject: item?.type || "Recherche",
      category: "Université",
      language: null,
      published_year: typeof item?.publication_year === "number" ? item.publication_year : null,
      publisher: item?.primary_location?.source?.display_name || null,
      isbn: null,
      source: "openalex" as const,
      source_url: landing || item?.id || null,
      access_type: item?.open_access?.is_oa || pdf ? "full" : "external",
      download_url: pdf || landing,
    };
  }) : [];
}

async function searchInternetArchive(query: string): Promise<ExternalBook[]> {
  const url = new URL("https://archive.org/advancedsearch.php");
  const safeQuery = query.replace(/[{}[\]\\]/g, " ").trim();
  url.searchParams.set("q", `mediatype:texts AND ${safeQuery}`);
  url.searchParams.set("fl[]", "identifier,title,creator,description,year,language,publisher");
  url.searchParams.set("rows", String(LIMIT));
  url.searchParams.set("page", "1");
  url.searchParams.set("output", "json");

  const data = await fetchJson(url.toString());
  return Array.isArray(data?.response?.docs) ? data.response.docs.map((item: any) => {
    const identifier = item?.identifier;
    return {
      id: `internet_archive:${identifier || crypto.randomUUID()}`,
      title: cleanText(item?.title, 220) || "Sans titre",
      author: cleanText(Array.isArray(item?.creator) ? item.creator.join(", ") : item?.creator, 180),
      description: cleanText(Array.isArray(item?.description) ? item.description[0] : item?.description),
      cover_url: identifier ? `https://archive.org/services/img/${identifier}` : null,
      level: null,
      subject: null,
      category: "Archives",
      language: Array.isArray(item?.language) ? item.language[0] ?? null : item?.language || null,
      published_year: yearFrom(item?.year),
      publisher: cleanText(Array.isArray(item?.publisher) ? item.publisher[0] : item?.publisher, 160),
      isbn: null,
      source: "internet_archive" as const,
      source_url: identifier ? `https://archive.org/details/${identifier}` : null,
      access_type: "full" as const,
      download_url: identifier ? `https://archive.org/details/${identifier}` : null,
    };
  }) : [];
}

async function searchOpenStax(query: string): Promise<ExternalBook[]> {
  const data = await fetchJson("https://exercises.openstax.org/api/books", {
    headers: { Accept: "application/vnd.exercises.openstax.v1" },
  });
  const books = Array.isArray(data) ? data : Array.isArray(data?.books) ? data.books : [];
  const terms = normalizeQuery(query).split(" ").filter(Boolean);

  return books
    .filter((item: any) => {
      const haystack = normalizeQuery(`${item?.title || ""} ${item?.name || ""} ${item?.subject || ""} ${item?.description || ""}`);
      return terms.every(term => haystack.includes(term));
    })
    .slice(0, LIMIT)
    .map((item: any) => ({
      id: `openstax:${item?.id || item?.uuid || item?.slug || crypto.randomUUID()}`,
      title: cleanText(item?.title || item?.name, 220) || "Sans titre",
      author: cleanText(item?.authors || item?.author, 180),
      description: cleanText(item?.description),
      cover_url: item?.cover_image || item?.image || null,
      level: "Université",
      subject: cleanText(item?.subject, 120),
      category: "Formation",
      language: "en",
      published_year: yearFrom(item?.published || item?.updated_at),
      publisher: "OpenStax",
      isbn: null,
      source: "openstax" as const,
      source_url: item?.web_url || item?.url || "https://openstax.org/",
      access_type: "full" as const,
      download_url: item?.web_url || item?.url || null,
    }));
}

function scoreBook(book: ExternalBook, query: string) {
  const q = normalizeQuery(query);
  const title = normalizeQuery(book.title);
  const author = normalizeQuery(book.author || "");
  let score = 0;
  if (title === q) score += 100;
  if (title.includes(q)) score += 50;
  if (author.includes(q)) score += 25;
  if (book.access_type === "full") score += 10;
  if (book.cover_url) score += 4;
  if (book.source === "google_books" || book.source === "open_library") score += 2;
  return score;
}

function deduplicateAndRank(books: ExternalBook[], query: string) {
  const seen = new Set<string>();
  return books
    .filter(book => {
      const fingerprint = `${normalizeQuery(book.title)}|${normalizeQuery(book.author || "")}`;
      if (seen.has(fingerprint)) return false;
      seen.add(fingerprint);
      return true;
    })
    .sort((a, b) => scoreBook(b, query) - scoreBook(a, query))
    .slice(0, MAX_RESULTS);
}

async function readCache(query: string): Promise<ExternalBook[] | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("library_search_cache")
    .select("results,expires_at")
    .eq("normalized_query", normalizeQuery(query))
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (!data?.results) return null;
  return Array.isArray(data.results) ? (data.results as ExternalBook[]) : null;
}

async function writeCache(query: string, results: ExternalBook[]) {
  const supabase = createAdminClient();
  if (!supabase) return;
  const created = new Date();
  const expires = new Date(created.getTime() + CACHE_TTL_MS);
  await supabase.from("library_search_cache").upsert({
    normalized_query: normalizeQuery(query),
    results,
    sources: [...new Set(results.map(result => result.source))],
    created_at: created.toISOString(),
    expires_at: expires.toISOString(),
  }, { onConflict: "normalized_query" });
}

export async function searchExternalBooks(query: string): Promise<ExternalBook[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const cached = await readCache(q);
  if (cached) return cached;

  const results = await Promise.allSettled([
    searchGoogleBooks(q),
    searchOpenLibrary(q),
    searchOpenAlex(q),
    searchInternetArchive(q),
    searchOpenStax(q),
  ]);

  const merged: ExternalBook[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") merged.push(...result.value);
  }

  const finalResults = deduplicateAndRank(merged, q);
  await writeCache(q, finalResults);
  return finalResults;
}
