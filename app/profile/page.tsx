import { UserRound, Mail, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar";
import MobileNavigation from "@/components/mobile-navigation";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function ProfilePage() {
  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="shell">
      <Sidebar />
      <MobileNavigation />
      <main className="page-main">
        <div className="container">
          <div className="topbar">
            <div>
              <p className="eyebrow" style={{ color: "#9a6b0e", margin: 0 }}>Mon profil</p>
              <h1>Mon espace</h1>
              <p className="muted" style={{ margin: "5px 0" }}>Gérez votre compte et vos préférences.</p>
            </div>
            <LogoutButton />
          </div>

          <section className="section">
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                <div className="feature-icon"><UserRound size={25} /></div>
                <div>
                  <h2 style={{ margin: 0, color: "#071a33" }}>Informations du compte</h2>
                  <p className="muted" style={{ margin: "5px 0 0" }}>Vos informations personnelles</p>
                </div>
              </div>
              <div className="grid grid-2">
                <div className="card" style={{ background: "#f8fafc", boxShadow: "none" }}>
                  <p className="eyebrow" style={{ margin: 0 }}>Adresse e-mail</p>
                  <p style={{ fontWeight: 700, marginBottom: 0 }}>{user.email ?? "Non renseigné"}</p>
                </div>
                <div className="card" style={{ background: "#f8fafc", boxShadow: "none" }}>
                  <p className="eyebrow" style={{ margin: 0 }}>Statut</p>
                  <p style={{ fontWeight: 700, marginBottom: 0 }}>Compte actif</p>
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="grid grid-2">
              <div className="card">
                <ShieldCheck size={24} color="#d09a32" />
                <h3 style={{ color: "#071a33" }}>Compte sécurisé</h3>
                <p className="muted">Votre espace personnel est protégé et accessible uniquement après connexion.</p>
              </div>
              <div className="card">
                <Mail size={24} color="#d09a32" />
                <h3 style={{ color: "#071a33" }}>Identité de connexion</h3>
                <p className="muted">Utilisez votre adresse e-mail pour accéder à votre bibliothèque personnelle.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
