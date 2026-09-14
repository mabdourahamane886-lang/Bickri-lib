"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Provider = "google" | "facebook" | "apple";

type SocialAuthButtonsProps = { next?: string; mode?: "signin" | "link" };

const providers: Array<{ id: Provider; label: string; logo: string; alt: string }> = [
  { id: "google", label: "Google", logo: "https://cdn.simpleicons.org/google", alt: "Logo Google" },
  { id: "facebook", label: "Facebook", logo: "https://cdn.simpleicons.org/facebook/1877F2", alt: "Logo Facebook" },
  { id: "apple", label: "Apple", logo: "https://cdn.simpleicons.org/apple/000000", alt: "Logo Apple" },
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
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            className={`social-btn social-${provider.id}`}
            onClick={() => handle(provider.id)}
            disabled={!!loading}
            aria-label={`${mode === "link" ? "Ajouter" : "Continuer avec"} ${provider.label}`}
          >
            <img
              src={provider.logo}
              alt={provider.alt}
              width={20}
              height={20}
              loading="lazy"
              referrerPolicy="no-referrer"
              style={{ width: 20, height: 20, objectFit: "contain", flexShrink: 0 }}
            />
            {loading === provider.id ? "Connexion…" : provider.label}
          </button>
        ))}
      </div>
      {error && <p role="alert" className="form-message">{error}</p>}
      <p className="social-note">Les fournisseurs doivent être activés et configurés dans Supabase Auth avant de fonctionner.</p>
    </div>
  );
}
