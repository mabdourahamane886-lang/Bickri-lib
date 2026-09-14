"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError("Veuillez saisir votre adresse e-mail.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setMessage("Si cette adresse possède un compte, un lien de réinitialisation a été envoyé. Vérifiez aussi vos spams.");
    } catch {
      setError("Impossible d'envoyer le lien de réinitialisation pour le moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container" style={{ padding: "64px 0" }}>
      <div className="card" style={{ maxWidth: 520, margin: "auto" }}>
        <p className="eyebrow" style={{ color: "#9a6b0e" }}>Bickri Lib</p>
        <h1>Mot de passe oublié ?</h1>
        <p className="muted">Saisissez votre e-mail pour recevoir un lien permettant de choisir un nouveau mot de passe.</p>

        <form onSubmit={submit} style={{ display: "grid", gap: 14, marginTop: 22 }}>
          <label style={{ display: "grid", gap: 7 }}>
            <span>Adresse e-mail</span>
            <input required type="email" autoComplete="email" placeholder="vous@exemple.com" value={email} onChange={e => setEmail(e.target.value)} />
          </label>

          {error && <p role="alert" className="error-message">{error}</p>}
          {message && <p role="status" className="success-message">{message}</p>}

          <button className="btn btn-dark" type="submit" disabled={loading}>
            {loading ? "Envoi en cours…" : "Envoyer le lien"}
          </button>
        </form>

        <p style={{ marginTop: 18 }}>
          <Link href="/login">Retour à la connexion</Link>
        </p>
      </div>
    </main>
  );
}
