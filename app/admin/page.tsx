import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar";
import MobileNavigation from "@/components/mobile-navigation";
import BookUploadForm from "@/components/admin/book-upload-form";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login?next=/admin");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userData.user.id).maybeSingle();
  if (profile?.role !== "admin") redirect("/dashboard");

  const { count } = await supabase.from("books").select("id", { count: "exact", head: true });

  return <div className="shell"><Sidebar/><MobileNavigation/><main className="page-main"><div className="container">
    <section className="hero compact"><p className="eyebrow">Bickri Lib Admin</p><h1>Gérer la bibliothèque</h1><p>Ajoute tes formations PDF, tes ouvrages autorisés et construis progressivement le catalogue Bickri Lib. Livres actuels : <strong>{count ?? 0}</strong>.</p></section>
    <BookUploadForm/>
  </div></main></div>;
}
