import { UserRound, ShieldCheck, KeyRound, Link2 } from "lucide-react";
import { createClient, getSupabaseConfig } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import MobileNavigation from "@/components/mobile-navigation";
import { LogoutButton } from "@/components/auth/logout-button";
import ProfileForm from "@/components/profile/profile-form";
import IdentityConnections from "@/components/auth/identity-connections";

export default async function ProfilePage() {
  if (!getSupabaseConfig().configured) {
    return <main className="container" style={{padding:"80px 0"}}><div className="card empty-state"><h1 style={{color:"#071a33"}}>Profil temporairement indisponible</h1><p className="muted">Le service de connexion n'est pas encore configuré sur cette version du site.</p><Link href="/" className="btn btn-dark" style={{marginTop:12}}>Retour à l'accueil</Link></div></main>;
  }

  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) redirect("/login?next=/profile");

  const { data: profile } = await client
    .from("profiles")
    .select("account_code")
    .eq("id", user.id)
    .maybeSingle();

  const initialName = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "";
  const accountCode = profile?.account_code ?? "Code indisponible";

  return <div className="shell"><Sidebar/><MobileNavigation/><main className="page-main"><div className="container">
    <div className="topbar"><div><p className="eyebrow" style={{color:"#9a6b0e",margin:0}}>Mon profil</p><h1>Mon espace</h1><p className="muted" style={{margin:"5px 0"}}>Gérez réellement vos informations de compte.</p></div><LogoutButton/></div>
    <section className="section"><div className="card"><div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24}}><div className="feature-icon"><UserRound size={25}/></div><div><h2 style={{margin:0,color:"#071a33"}}>Informations du compte</h2><p className="muted" style={{margin:"5px 0 0"}}>Ces informations sont liées à votre compte.</p></div></div><ProfileForm initialName={initialName} email={user.email ?? "Non renseigné"} accountCode={accountCode}/></div></section>
    <section className="section"><div className="grid grid-2"><div className="card"><ShieldCheck size={24} color="#d09a32"/><h3 style={{color:"#071a33"}}>Compte sécurisé</h3><p className="muted">Votre espace personnel nécessite une authentification avant l'accès.</p><Link href="/forgot-password" className="btn btn-light" style={{marginTop:12,display:"inline-block"}}>Réinitialiser mon mot de passe</Link></div><div className="card"><UserRound size={24} color="#d09a32"/><h3 style={{color:"#071a33"}}>Profil personnalisé</h3><p className="muted">Votre nom est enregistré dans votre compte et peut être modifié à tout moment.</p></div></div></section>
    <section className="section"><div className="card"><div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}><div className="feature-icon"><Link2 size={25}/></div><div><h2 style={{margin:0,color:"#071a33"}}>Comptes associés</h2><p className="muted" style={{margin:"5px 0 0"}}>Ajoutez Google, Facebook et d’autres fournisseurs pour vous connecter plus facilement.</p></div></div><IdentityConnections/></div></section>
    <section className="section"><div className="card"><KeyRound size={24} color="#d09a32"/><h3 style={{color:"#071a33"}}>Mot de passe</h3><p className="muted">Réinitialisez votre mot de passe avec un lien sécurisé envoyé à votre adresse e-mail.</p><Link href="/forgot-password" className="btn btn-dark" style={{marginTop:12,display:"inline-block"}}>Changer mon mot de passe</Link></div></section>
  </div></main></div>;
}
