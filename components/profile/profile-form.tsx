"use client";

import { Eye, EyeOff } from "lucide-react";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProfileForm({ initialName, email, accountCode }: { initialName: string; email: string; accountCode: string }) {
  const [name, setName] = useState(initialName);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [showCode, setShowCode] = useState(false);

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ data: { full_name: name.trim() } });
    setMessage(error ? error.message : "Profil mis à jour avec succès.");
    setSaving(false);
  }

  return (
    <form className="profile-form" onSubmit={save}>
      <div>
        <label htmlFor="full-name">Nom complet</label>
        <input id="full-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Votre nom complet" maxLength={80}/>
      </div>
      <div>
        <label htmlFor="profile-email">Adresse e-mail</label>
        <input id="profile-email" value={email} disabled readOnly />
      </div>
      <div>
        <label htmlFor="account-code">Code du compte</label>
        <div style={{position:"relative"}}>
          <input
            id="account-code"
            value={showCode ? accountCode : "••••••••"}
            readOnly
            aria-label={showCode ? "Code du compte visible" : "Code du compte masqué"}
            style={{paddingRight:52, letterSpacing: showCode ? "0.08em" : "0.18em"}}
          />
          <button
            type="button"
            onClick={() => setShowCode((visible) => !visible)}
            aria-label={showCode ? "Masquer le code" : "Afficher le code"}
            title={showCode ? "Masquer le code" : "Afficher le code"}
            style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",border:0,background:"transparent",padding:8,cursor:"pointer",color:"#071a33"}}
          >
            {showCode ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
          </button>
        </div>
        <p className="muted" style={{margin:"6px 0 0",fontSize:13}}>Ce code identifie votre compte Bickri Lib. Vous pouvez le masquer ou l’afficher.</p>
      </div>
      {message && <p className="form-message" role="status">{message}</p>}
      <button className="btn btn-gold" type="submit" disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer les modifications"}</button>
    </form>
  );
}
