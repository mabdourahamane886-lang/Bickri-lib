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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name.trim() },
        },
      });
      if (error) setError(error.message);
      else if (data.session) router.push(getNextPath());
      else setError("Compte créé. Vérifiez votre adresse e-mail pour terminer l'inscription.");
    } catch {
      setError("Le service d'inscription est temporairement indisponible.");
    } finally {
      setLoading(false);
    }
  }

  return <main className="container" style={{ padding: "64px 0" }}><div className="card" style={{ maxWidth: 520, margin: "auto" }}>
    <h1>Créer un compte</h1>
    <p className="muted">Créez votre espace personnel pour retrouver vos informations, vos favoris et votre bibliothèque.</p>
    <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
      <input required type="text" minLength={2} placeholder="Nom complet" value={name} onChange={e => setName(e.target.value)} />
      <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input required minLength={8} type="password" placeholder="Mot de passe (8 caractères minimum)" value={password} onChange={e => setPassword(e.target.value)} />
      {error && <p role="alert" className="form-message">{error}</p>}
      <button className="btn btn-dark" disabled={loading} type="submit">{loading ? "Création…" : "Créer mon compte"}</button>
    </form>
    <SocialAuthButtons next={getNextPath()} />
    <p>Déjà inscrit ? <Link href="/login">Se connecter</Link></p>
  </div></main>;
}
