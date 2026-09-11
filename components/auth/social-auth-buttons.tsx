"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type SocialAuthButtonsProps = {
  next?: string;
};

export default function SocialAuthButtons({ next = "/dashboard" }: SocialAuthButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function signIn(provider: "google" | "facebook") {
    setLoading(provider);
    setError("");
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });
    if (authError) {
      setError(authError.message);
      setLoading(null);
    }
  }

  return (
    <div className="social-auth">
      <div className="social-divider"><span>ou continuer avec</span></div>
      <div className="social-grid">
        <button type="button" className="social-btn social-google" onClick={() => signIn("google")} disabled={!!loading}>
          <span className="social-letter">G</span>
          {loading === "google" ? "Connexion…" : "Google"}
        </button>
        <button type="button" className="social-btn social-facebook" onClick={() => signIn("facebook")} disabled={!!loading}>
          <span className="social-letter">f</span>
          {loading === "facebook" ? "Connexion…" : "Facebook"}
        </button>
        <button type="button" className="social-btn" disabled title="Configuration OAuth Instagram à ajouter dans Supabase">
          <span className="social-letter">◎</span> Instagram
        </button>
        <button type="button" className="social-btn" disabled title="Configuration OAuth TikTok à ajouter dans Supabase">
          <span className="social-letter">♪</span> TikTok
        </button>
      </div>
      {error && <p role="alert" className="form-message">{error}</p>}
      <p className="social-note">Instagram et TikTok sont affichés comme options mais restent désactivés tant que leurs fournisseurs OAuth personnalisés ne sont pas configurés.</p>
    </div>
  );
}
