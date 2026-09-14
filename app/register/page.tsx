"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import SocialAuthButtons from "@/components/auth/social-auth-buttons";

function getNextPath() {
  if (typeof window === "undefined") return "/dashboard";
  const value = new URLSearchParams(window.location.search).get("next");
  return value?.startsWith("/") ? value : "/dashboard";
}

export default function RegisterPage() {
  const router = useRouter();
  const nextPath = getNextPath();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    setError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < 2) return setError("Veuillez saisir votre nom complet.");
    if (!cleanEmail.includes("@")) return setError("Veuillez saisir une adresse e-mail valide.");
    if (password.length < 8) return setError("Le mot de passe doit contenir au moins 8 caractères.");
    if (password !== confirmPassword) return setError("Les deux mots de passe ne correspondent pas.");

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName, email: cleanEmail, password }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(result?.error || "Impossible de créer le compte.");
        return;
      }

      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (signInError) {
        setError("Le compte a été créé, mais la connexion automatique a échoué. Connectez-vous avec vos identifiants.");
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("Le service d'inscription est temporairement indisponible. Réessayez dans quelques instants.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container" style={{ padding: "32px 0 64px" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "stretch" }}>
        <section className="card" style={{ padding: 32, background: "linear-gradient(145deg, #071a33, #0d2a4d)", color: "white", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <p className="eyebrow" style={{ color: "#d9a441" }}>Bickri Lib</p>
            <h1 style={{ color: "white", fontSize: "clamp(2rem, 5vw, 3.2rem)", lineHeight: 1.05, marginBottom: 16 }}>Votre bibliothèque commence ici.</h1>
            <p style={{ color: "rgba(255,255,255,.78)", lineHeight: 1.7 }}>Créez votre espace personnel pour retrouver vos favoris, votre progression et vos ressources au même endroit.</p>
          </div>
          <div style={{ display: "grid", gap: 10, marginTop: 28 }}>
            <div style={{ padding: 12, borderRadius: 14, background: "rgba(255,255,255,.08)" }}>✓ Compte personnel sécurisé</div>
            <div style={{ padding: 12, borderRadius: 14, background: "rgba(255,255,255,.08)" }}>✓ Accès à vos favoris et à votre historique</div>
            <div style={{ padding: 12, borderRadius: 14, background: "rgba(255,255,255,.08)" }}>✓ Confirmation e-mail gérée automatiquement</div>
          </div>
        </section>

        <section className="card" style={{ padding: 32 }}>
          <div style={{ marginBottom: 22 }}>
            <p className="eyebrow" style={{ color: "#9a6b0e" }}>Inscription</p>
            <h2 style={{ marginBottom: 8 }}>Créer un compte</h2>
            <p className="muted">Remplissez les informations ci-dessous. Votre adresse e-mail n'a pas besoin d'être confirmée manuellement.</p>
          </div>

          <form onSubmit={submit} style={{ display: "grid", gap: 15 }}>
            <label style={{ display: "grid", gap: 7 }}>
              <span>Nom complet</span>
              <input required type="text" minLength={2} placeholder="Ex. Mohamed Bickri Jr." value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
            </label>

            <label style={{ display: "grid", gap: 7 }}>
              <span>Adresse e-mail</span>
              <input required type="email" placeholder="vous@exemple.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            </label>

            <label style={{ display: "grid", gap: 7 }}>
              <span>Mot de passe</span>
              <div style={{ position: "relative" }}>
                <input required minLength={8} type={showPassword ? "text" : "password"} placeholder="8 caractères minimum" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" style={{ paddingRight: 95, width: "100%" }} />
                <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: "absolute", right: 8, top: 8, height: 34, padding: "0 10px", border: 0, borderRadius: 8, background: "#f0f2f5", cursor: "pointer" }}>{showPassword ? "Masquer" : "Afficher"}</button>
              </div>
            </label>

            <label style={{ display: "grid", gap: 7 }}>
              <span>Confirmer le mot de passe</span>
              <input required minLength={8} type={showPassword ? "text" : "password"} placeholder="Retapez votre mot de passe" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} autoComplete="new-password" />
            </label>

            {error && <p role="alert" className="error-message" style={{ margin: 0 }}>{error}</p>}

            <button className="btn btn-dark" disabled={loading} type="submit" style={{ minHeight: 48, fontSize: 16 }}>
              {loading ? "Création de votre compte…" : "Créer mon compte"}
            </button>
          </form>

          <SocialAuthButtons next={nextPath} />
          <p style={{ marginTop: 20, textAlign: "center" }}>Déjà inscrit ? <Link href={`/login?next=${encodeURIComponent(nextPath)}`}>Se connecter</Link></p>
        </section>
      </div>

      <style jsx>{`@media (max-width: 760px) { main > div { grid-template-columns: 1fr !important; } }`}</style>
    </main>
  );
}
