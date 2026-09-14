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
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const needsConfirmation = useMemo(() => /email not confirmed|confirm.*email|not confirmed/i.test(error), [error]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    setResent(false);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
      if (authError) {
        setError(authError.message);
      } else {
        router.replace(getNextPath());
        router.refresh();
      }
    } catch {
      setError("Le service de connexion est temporairement indisponible.");
    } finally {
      setLoading(false);
    }
  }

  async function resendConfirmation() {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || resending) return;
    setResending(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: cleanEmail,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(getNextPath())}` },
      });
      if (resendError) setError(resendError.message);
      else setResent(true);
    } catch {
      setError("Impossible de renvoyer l'e-mail de confirmation pour le moment.");
    } finally {
      setResending(false);
    }
  }

  return <main className="container" style={{ padding: "64px 0" }}><div className="card" style={{ maxWidth: 520, margin: "auto" }}>
    <p className="eyebrow" style={{ color: "#9a6b0e" }}>Bickri Lib</p>
    <h1>Connexion</h1>
    <p className="muted">Accédez à votre espace personnel Bickri Lib.</p>
    <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
      <input required type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} />
      <input required type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
      {error && <p role="alert" className="error-message">{error}</p>}
      {resent && <p role="status" className="success-message">E-mail de confirmation renvoyé. Vérifiez votre boîte de réception et vos spams.</p>}
      <button className="btn btn-dark" disabled={loading} type="submit">{loading ? "Connexion…" : "Se connecter"}</button>
      {needsConfirmation && <button type="button" className="btn btn-light" onClick={resendConfirmation} disabled={resending}>{resending ? "Envoi…" : "Renvoyer l’e-mail de confirmation"}</button>}
    </form>
    <SocialAuthButtons next={getNextPath()} />
    <p>Pas encore de compte ? <Link href={`/register?next=${encodeURIComponent(getNextPath())}`}>Créer un compte</Link></p>
  </div></main>;
}
