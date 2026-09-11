import { BookOpen, Download, Heart, Mail, UserRound } from "lucide-react";
import { createClient, getSupabaseConfig } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import MobileNavigation from "@/components/mobile-navigation";
import StatCard from "@/components/dashboard/stat-card";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function DashboardPage() {
  if (!getSupabaseConfig().configured) return <ServiceUnavailable />;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const { count: favoriteCount } = await supabase.from("favorites").select("id", { count: "exact", head: true }).eq("user_id", user.id);
  const name = typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim() ? user.user_metadata.full_name.trim() : "Lecteur";

  return <div className="shell"><Sidebar/><MobileNavigation/><main className="page-main"><div className="container">
    <div className="topbar"><div><p className="eyebrow" style={{color:"#9a6b0e",margin:0}}>Espace personnel</p><h1>Bonjour {name} 👋</h1><p className="muted" style={{margin:"5px 0"}}>{user.email}</p></div><LogoutButton/></div>
    <div className="grid grid-4"><StatCard title="Mes livres" value="0" subtitle="Dans votre bibliothèque" icon={BookOpen}/><StatCard title="Favoris" value={String(favoriteCount ?? 0)} subtitle="Livres enregistrés" icon={Heart}/><StatCard title="Téléchargements" value="0" subtitle="Fichiers téléchargés" icon={Download}/><StatCard title="Profil" value="100%" subtitle="Compte actif" icon={UserRound}/></div>
    <section className="section"><div className="card"><div style={{display:"flex",alignItems:"center",gap:16,marginBottom:18}}><div className="feature-icon"><UserRound size={25}/></div><div><h2 style={{margin:0,color:"#071a33"}}>Mon compte</h2><p className="muted" style={{margin:"5px 0 0"}}>Vos informations personnelles enregistrées sur Bickri Lib.</p></div></div><div className="grid grid-2"><div><p className="muted" style={{margin:"0 0 4px"}}>Nom</p><strong>{name}</strong></div><div><p className="muted" style={{margin:"0 0 4px",display:"flex",alignItems:"center",gap:6}}><Mail size={15}/> Adresse e-mail</p><strong style={{overflowWrap:"anywhere"}}>{user.email ?? "Non renseigné"}</strong></div></div><div className="actions" style={{marginTop:20}}><Link href="/profile" className="btn btn-dark">Gérer mon compte</Link><Link href="/favorites" className="btn btn-light">Voir mes favoris</Link></div></div></section>
    <section className="section"><div className="card" style={{background:"#071a33",color:"white"}}><h2 style={{margin:"0 0 7px"}}>Votre espace de lecture</h2><p style={{margin:0,color:"#cbd5e1",lineHeight:1.7}}>Accédez à votre bibliothèque, retrouvez vos favoris et gérez votre profil depuis un seul espace.</p><div className="actions"><Link href="/books" className="btn btn-gold">Explorer les livres</Link><Link href="/favorites" className="btn btn-light">Voir mes favoris</Link></div></div></section>
  </div></main></div>;
}

function ServiceUnavailable() {
  return <main className="container" style={{padding:"80px 0"}}><div className="card empty-state"><h1 style={{color:"#071a33"}}>Espace temporairement indisponible</h1><p className="muted">Le service de connexion n'est pas encore configuré sur cette version du site. Revenez après la configuration du déploiement.</p><Link href="/" className="btn btn-dark" style={{marginTop:12}}>Retour à l'accueil</Link></div></main>;
}
