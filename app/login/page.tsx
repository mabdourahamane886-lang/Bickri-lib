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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("error") === "oauth"
      ? "La connexion avec le réseau social a échoué. Vérifiez que le fournisseur est configuré."
      : "";
  });
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) setError(authError.message);
      else router.push(getNextPath());
    } catch {
      setError("Le service de connexion est temporairement indisponible.");
    } finally {
      setLoading(false);
    }
  }

  return <main className="container" style={{ padding: "64px 0" }}><div className="card" style={{ maxWidth: 520, margin: "auto" }}>
    <h1>Connexion</h1>
    <p className="muted">Accédez à votre espace personnel Bickri Lib.</p>
    <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
      <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input required type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
      {error && <p role="alert" className="form-message">{error}</p>}
      <button className="btn btn-dark" disabled={loading} type="submit">{loading ? "Connexion…" : "Se connecter"}</button>
    </form>
    <SocialAuthButtons next={getNextPath()} />
    <p>Pas encore de compte ? <Link href="/register">Créer un compte</Link></p>
  </div></main>;
}
