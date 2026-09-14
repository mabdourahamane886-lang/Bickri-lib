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

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    setError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < 2) return setError("Veuillez saisir votre nom complet.");
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

  return <main className="container" style={{ padding: "64px 0" }}><div className="card" style={{ maxWidth: 520, margin: "auto" }}>
    <p className="eyebrow" style={{ color: "#9a6b0e" }}>Bickri Lib</p>
    <h1>Créer un compte</h1>
    <p className="muted">Créez votre espace personnel pour retrouver vos favoris, votre progression et vos ressources.</p>
    <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
      <input required type="text" minLength={2} placeholder="Nom complet" value={name} onChange={e => setName(e.target.value)} />
      <input required type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} />
      <input required minLength={8} type="password" placeholder="Mot de passe (8 caractères minimum)" value={password} onChange={e => setPassword(e.target.value)} />
      <input required minLength={8} type="password" placeholder="Confirmer le mot de passe" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
      {error && <p role="alert" className="error-message">{error}</p>}
      <button className="btn btn-dark" disabled={loading} type="submit">{loading ? "Création du compte…" : "Créer mon compte"}</button>
    </form>
    <SocialAuthButtons next={nextPath} />
    <p>Déjà inscrit ? <Link href={`/login?next=${encodeURIComponent(nextPath)}`}>Se connecter</Link></p>
  </div></main>;
}
