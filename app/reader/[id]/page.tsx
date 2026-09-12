import { notFound, redirect } from "next/navigation";
import ReaderClient from "@/components/reader/reader-client";
import { createClient } from "@/lib/supabase/server";
import { getBookById } from "@/lib/api/books";

export default async function ReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect(`/login?next=/reader/${id}`);
  const book = await getBookById(id);
  if (!book) notFound();
  return <ReaderClient book={book} />;
}
