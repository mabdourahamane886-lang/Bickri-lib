import { NextRequest, NextResponse } from 'next/server';
import { searchExternalBooks } from '@/lib/api/external-books';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim() || '';
  if (q.length < 2) {
    return NextResponse.json({ query: q, results: [], error: 'La recherche doit contenir au moins 2 caractères.' }, { status: 400 });
  }

  try {
    const results = await searchExternalBooks(q);
    return NextResponse.json({
      query: q,
      results,
      meta: {
        count: results.length,
        sources: ['bickri_lib', 'google_books', 'open_library', 'openalex', 'internet_archive', 'openstax'],
      },
    }, {
      headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' },
    });
  } catch (error) {
    console.error('Bickri Lib external search error', error);
    return NextResponse.json({ query: q, results: [], error: 'Les sources externes sont temporairement indisponibles.' }, { status: 502 });
  }
}
