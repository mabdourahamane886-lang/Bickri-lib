import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return <main className="container" style={{ padding: "64px 0" }}>
    <div className="card">
      <h1>Tableau de bord Bickri Lib</h1>
      <p>Bienvenue, {user.email}.</p>
      <p>Cette zone est protégée par Supabase Auth et vérifiée côté serveur.</p>
    </div>
  </main>;
}
