"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const providers = [
  { id: "google", label: "Google", mark: "G" },
  { id: "facebook", label: "Facebook", mark: "f" },
  { id: "github", label: "GitHub", mark: "⌘" },
  { id: "apple", label: "Apple", mark: "" },
  { id: "azure", label: "Microsoft", mark: "M" },
] as const;

type Provider = typeof providers[number]["id"];

type Identity = { id: string; provider?: string | null; identity_data?: Record<string, unknown> | null };

export default function IdentityConnections() {
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<Provider | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const supabase = createClient();
    const { data, error: identitiesError } = await supabase.auth.getUserIdentities();
    if (identitiesError) setError(identitiesError.message);
    else setIdentities((data?.identities ?? []) as Identity[]);
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  async function link(provider: Provider) {
    setWorking(provider);
    setError("");
    setMessage("");
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent("/profile")}`;
    const { error: linkError } = await supabase.auth.linkIdentity({ provider, options: { redirectTo } });
    if (linkError) {
      setError(linkError.message);
      setWorking(null);
    }
  }

  async function unlink(provider: Provider) {
    setWorking(provider);
    setError("");
    setMessage("");
    const supabase = createClient();
    const identity = identities.find(item => item.provider === provider);
    if (!identity || identities.length < 2) {
      setError("Gardez au moins une méthode de connexion active sur votre compte.");
      setWorking(null);
      return;
    }
    const { error: unlinkError } = await supabase.auth.unlinkIdentity(identity as never);
    if (unlinkError) setError(unlinkError.message);
    else {
      setMessage(`${providerLabel(provider)} a été retiré de votre compte.`);
      await load();
    }
    setWorking(null);
  }

  function providerLabel(provider: string) {
    return providers.find(item => item.id === provider)?.label ?? provider;
  }

  if (loading) return <p className="muted">Chargement des méthodes de connexion…</p>;

  return (
    <div>
      <div className="grid" style={{ gap: 10 }}>
        {providers.map(provider => {
          const linked = identities.some(identity => identity.provider === provider.id);
          return (
            <div key={provider.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 0", borderBottom: "1px solid rgba(7,26,51,.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="social-letter">{provider.mark}</span>
                <div><strong>{provider.label}</strong><div className="muted" style={{ fontSize: 13 }}>{linked ? "Compte associé" : "Non associé"}</div></div>
              </div>
              <button type="button" className={linked ? "btn btn-light" : "btn btn-dark"} disabled={!!working} onClick={() => linked ? unlink(provider.id) : link(provider.id)}>
                {working === provider.id ? "Ouverture…" : linked ? "Retirer" : "Ajouter"}
              </button>
            </div>
          );
        })}
      </div>
      {message && <p role="status" className="success-message">{message}</p>}
      {error && <p role="alert" className="error-message">{error}</p>}
      <p className="muted" style={{ marginTop: 14, fontSize: 13 }}>
        L’ajout d’une identité OAuth doit être autorisé dans les réglages Auth de Supabase. Les fournisseurs sont gérés par Supabase Auth.
      </p>
    </div>
  );
}
