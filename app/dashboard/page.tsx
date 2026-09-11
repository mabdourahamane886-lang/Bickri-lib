import { BookOpen, Download, Heart, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar";
import MobileNavigation from "@/components/mobile-navigation";
import StatCard from "@/components/dashboard/stat-card";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function DashboardPage(){const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");return <div className="shell"><Sidebar/><MobileNavigation/><main className="page-main"><div className="container"><div className="topbar"><div><p className="eyebrow" style={{color:"#9a6b0e",margin:0}}>Espace personnel</p><h1>Bonjour 👋</h1><p className="muted" style={{margin:"5px 0"}}>{user.email}</p></div><LogoutButton/></div><div className="grid grid-4"><StatCard title="Mes livres" value="0" subtitle="Dans votre bibliothèque" icon={BookOpen}/><StatCard title="Favoris" value="0" subtitle="Livres enregistrés" icon={Heart}/><StatCard title="Téléchargements" value="0" subtitle="Fichiers téléchargés" icon={Download}/><StatCard title="Profil" value="100%" subtitle="Compte actif" icon={UserRound}/></div><section className="section"><div className="card"><h2 style={{marginTop:0,color:"#071a33"}}>Votre espace de lecture</h2><p className="muted" style={{lineHeight:1.7}}>Retrouvez bientôt votre historique, vos favoris, vos téléchargements et vos recommandations personnalisées.</p><div className="actions"><a href="/books" className="btn btn-gold">Explorer les livres</a></div></div></section></div></main></div>}
