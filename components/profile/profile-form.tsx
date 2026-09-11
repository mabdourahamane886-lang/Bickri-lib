"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProfileForm({ initialName, email }: { initialName: string; email: string }) {
  const [name, setName] = useState(initialName);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

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
      {message && <p className="form-message" role="status">{message}</p>}
      <button className="btn btn-gold" type="submit" disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer les modifications"}</button>
    </form>
  );
}
