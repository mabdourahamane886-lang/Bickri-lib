"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

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

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push(getNextPath());
    } catch {
      setError("Le service de connexion est temporairement indisponible.");
    } finally {
      setLoading(false);
    }
  }

  return <main className="container" style={{ padding: "64px 0" }}><div className="card" style={{ maxWidth: 480, margin: "auto" }}>
    <h1>Connexion</h1>
    <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
      <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input required type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
      {error && <p role="alert" className="form-message">{error}</p>}
      <button className="btn btn-dark" disabled={loading} type="submit">{loading ? "Connexion…" : "Se connecter"}</button>
    </form>
    <p>Pas encore de compte ? <a href="/register">Créer un compte</a></p>
  </div></main>;
}
