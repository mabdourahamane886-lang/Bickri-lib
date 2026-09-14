"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const needsConfirmation = useMemo(() => /email not confirmed|confirm.*email|not confirmed/i.test(error), [error]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
      if (authError) setError(authError.message);
      else {
        router.replace(getNextPath());
        router.refresh();
      }
    } catch {
      setError("Le service de connexion est temporairement indisponible.");
    } finally {
      setLoading(false);
    }
  }

  return <main className="container" style={{ padding: "64px 0" }}><div className="card" style={{ maxWidth: 520, margin: "auto" }}>
    <p className="eyebrow" style={{ color: "#9a6b0e" }}>Bickri Lib</p>
    <h1>Connexion</h1>
    <p className="muted">Accédez à votre espace personnel Bickri Lib.</p>
    <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
      <input required type="email" autoComplete="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} />
      <input required type="password" autoComplete="current-password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
      {error && <p role="alert" className="error-message">{error}</p>}
      <button className="btn btn-dark" disabled={loading} type="submit">{loading ? "Connexion…" : "Se connecter"}</button>
      {needsConfirmation && <p className="muted" style={{ margin: 0 }}>Cette version crée automatiquement les nouveaux comptes comme confirmés. Pour un ancien compte non confirmé, utilisez le lien de confirmation reçu précédemment.</p>}
      <Link href={`/forgot-password?email=${encodeURIComponent(email.trim().toLowerCase())}`} className="muted" style={{ textAlign: "right" }}>Mot de passe oublié ?</Link>
    </form>
    <SocialAuthButtons next={getNextPath()} />
    <p>Pas encore de compte ? <Link href={`/register?next=${encodeURIComponent(getNextPath())}`}>Créer un compte</Link></p>
  </div></main>;
}
