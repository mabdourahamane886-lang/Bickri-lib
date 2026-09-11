import { UserRound, ShieldCheck } from "lucide-react";
import { createClient, getSupabaseConfig } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import MobileNavigation from "@/components/mobile-navigation";
import { LogoutButton } from "@/components/auth/logout-button";
import ProfileForm from "@/components/profile/profile-form";

export default async function ProfilePage() {
  if (!getSupabaseConfig().configured) {
    return <main className="container" style={{padding:"80px 0"}}><div className="card empty-state"><h1 style={{color:"#071a33"}}>Profil temporairement indisponible</h1><p className="muted">Le service de connexion n'est pas encore configuré sur cette version du site.</p><Link href="/" className="btn btn-dark" style={{marginTop:12}}>Retour à l'accueil</Link></div></main>;
  }

  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) redirect("/login?next=/profile");

  const initialName = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "";

  return <div className="shell"><Sidebar/><MobileNavigation/><main className="page-main"><div className="container">
    <div className="topbar"><div><p className="eyebrow" style={{color:"#9a6b0e",margin:0}}>Mon profil</p><h1>Mon espace</h1><p className="muted" style={{margin:"5px 0"}}>Gérez réellement vos informations de compte.</p></div><LogoutButton/></div>
    <section className="section"><div className="card"><div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24}}><div className="feature-icon"><UserRound size={25}/></div><div><h2 style={{margin:0,color:"#071a33"}}>Informations du compte</h2><p className="muted" style={{margin:"5px 0 0"}}>Ces informations sont liées à votre compte.</p></div></div><ProfileForm initialName={initialName} email={user.email ?? "Non renseigné"}/></div></section>
    <section className="section"><div className="grid grid-2"><div className="card"><ShieldCheck size={24} color="#d09a32"/><h3 style={{color:"#071a33"}}>Compte sécurisé</h3><p className="muted">Votre espace personnel nécessite une authentification avant l'accès.</p></div><div className="card"><UserRound size={24} color="#d09a32"/><h3 style={{color:"#071a33"}}>Profil personnalisé</h3><p className="muted">Votre nom est enregistré dans votre compte et peut être modifié à tout moment.</p></div></div></section>
  </div></main></div>;
}
