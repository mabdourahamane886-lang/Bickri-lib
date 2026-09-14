"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => setReady(!!data.session));
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    setError("");
    setMessage("");

    if (password.length < 8) return setError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
    if (password !== confirmPassword) return setError("Les deux mots de passe ne correspondent pas.");

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message);
        return;
      }

      setMessage("Votre mot de passe a été modifié avec succès.");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => router.replace("/login"), 900);
    } catch {
      setError("Impossible de modifier le mot de passe pour le moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container" style={{ padding: "64px 0" }}>
      <div className="card" style={{ maxWidth: 520, margin: "auto" }}>
        <p className="eyebrow" style={{ color: "#9a6b0e" }}>Bickri Lib</p>
        <h1>Nouveau mot de passe</h1>
        <p className="muted">Choisissez un nouveau mot de passe sécurisé pour protéger votre compte.</p>

        {!ready ? (
          <p className="muted" style={{ marginTop: 22 }}>Vérification du lien de réinitialisation…</p>
        ) : (
          <form onSubmit={submit} style={{ display: "grid", gap: 14, marginTop: 22 }}>
            <label style={{ display: "grid", gap: 7 }}>
              <span>Nouveau mot de passe</span>
              <input required minLength={8} type="password" autoComplete="new-password" placeholder="8 caractères minimum" value={password} onChange={e => setPassword(e.target.value)} />
            </label>
            <label style={{ display: "grid", gap: 7 }}>
              <span>Confirmer le mot de passe</span>
              <input required minLength={8} type="password" autoComplete="new-password" placeholder="Répétez le mot de passe" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </label>

            {error && <p role="alert" className="error-message">{error}</p>}
            {message && <p role="status" className="success-message">{message}</p>}

            <button className="btn btn-dark" type="submit" disabled={loading}>
              {loading ? "Modification…" : "Modifier mon mot de passe"}
            </button>
          </form>
        )}

        <p style={{ marginTop: 18 }}><Link href="/login">Retour à la connexion</Link></p>
      </div>
    </main>
  );
}
