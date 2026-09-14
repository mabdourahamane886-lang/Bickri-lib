"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Provider = "google" | "facebook" | "github" | "apple" | "azure";

type SocialAuthButtonsProps = { next?: string; mode?: "signin" | "link" };

const providers: Array<{ id: Provider; label: string; mark: string }> = [
  { id: "google", label: "Google", mark: "G" },
  { id: "facebook", label: "Facebook", mark: "f" },
  { id: "github", label: "GitHub", mark: "⌘" },
  { id: "apple", label: "Apple", mark: "" },
  { id: "azure", label: "Microsoft", mark: "M" },
];

export default function SocialAuthButtons({ next = "/dashboard", mode = "signin" }: SocialAuthButtonsProps) {
  const [loading, setLoading] = useState<Provider | null>(null);
  const [error, setError] = useState("");

  async function handle(provider: Provider) {
    setLoading(provider);
    setError("");
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const result = mode === "link"
      ? await supabase.auth.linkIdentity({ provider, options: { redirectTo } })
      : await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });

    if (result.error) {
      setError(result.error.message);
      setLoading(null);
    }
  }

  return (
    <div className="social-auth">
      <div className="social-divider"><span>{mode === "link" ? "Ajouter un compte" : "ou continuer avec"}</span></div>
      <div className="social-grid">
        {providers.map(provider => (
          <button key={provider.id} type="button" className={`social-btn social-${provider.id}`} onClick={() => handle(provider.id)} disabled={!!loading}>
            <span className="social-letter">{provider.mark}</span>
            {loading === provider.id ? "Connexion…" : provider.label}
          </button>
        ))}
      </div>
      {error && <p role="alert" className="form-message">{error}</p>}
      <p className="social-note">Les fournisseurs doivent être activés et configurés dans Supabase Auth avant de fonctionner.</p>
    </div>
  );
}
