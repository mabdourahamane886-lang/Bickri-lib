"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Upload, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const categories = ["Scolaire", "Roman", "Contes", "Éducation", "Formation", "Examens"];
const levels = ["CI", "CP", "CE1", "CE2", "CM1", "CM2", "6e", "5e", "4e", "3e", "Seconde", "1ère", "Tle", "Collège", "Lycée", "Université", "Tous niveaux", "Débutant", "Intermédiaire", "Avancé"];

export default function BookUploadForm() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage(""); setError("");
    const form = new FormData(event.currentTarget);
    const file = form.get("file") as File | null;
    if (!file || file.size === 0) { setError("Sélectionne un PDF ou EPUB."); setBusy(false); return; }
    if (file.size > 50 * 1024 * 1024) { setError("Le fichier dépasse la limite de 50 Mo."); setBusy(false); return; }
    if (!(["application/pdf", "application/epub+zip"] as string[]).includes(file.type)) { setError("Format accepté : PDF ou EPUB."); setBusy(false); return; }

    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Connexion requise.");
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", userData.user.id).maybeSingle();
      if (profile?.role !== "admin") throw new Error("Accès administrateur requis.");

      const title = String(form.get("title") || "").trim();
      if (!title) throw new Error("Le titre est obligatoire.");
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
      const path = `books/${crypto.randomUUID()}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from("bickri-books").upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) throw new Error(uploadError.message);

      const book = {
        title,
        author: String(form.get("author") || "").trim() || null,
        description: String(form.get("description") || "").trim() || null,
        cover_url: String(form.get("cover_url") || "").trim() || null,
        level: String(form.get("level") || "").trim() || null,
        subject: String(form.get("subject") || "").trim() || null,
        category: String(form.get("category") || "Formation"),
        language: String(form.get("language") || "fr"),
        is_premium: form.get("is_premium") === "on",
        published_year: Number(form.get("published_year")) || new Date().getFullYear(),
        file_path: path,
        file_type: file.type === "application/pdf" ? "pdf" : "epub",
        file_size: file.size,
        license: String(form.get("license") || "").trim() || "Droits vérifiés par Bickri Lib",
        source_url: String(form.get("source_url") || "").trim() || null,
        publisher: String(form.get("publisher") || "").trim() || null,
        isbn: String(form.get("isbn") || "").trim() || null,
        reading_time: Number(form.get("reading_time")) || null,
        download_enabled: form.get("download_enabled") === "on",
      };
      const { error: insertError } = await supabase.from("books").insert(book);
      if (insertError) {
        await supabase.storage.from("bickri-books").remove([path]);
        throw new Error(insertError.message);
      }
      event.currentTarget.reset();
      setMessage("Livre ajouté avec succès dans Bickri Lib.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally { setBusy(false); }
  }

  return <form onSubmit={submit} className="card admin-form">
    <div className="section-heading"><div><p className="eyebrow">Administration</p><h2>Ajouter un livre ou une formation</h2></div><Upload size={22}/></div>
    <div className="form-grid">
      <label>Titre<input name="title" required placeholder="Ex. Guide de marketing digital"/></label>
      <label>Auteur / formateur<input name="author" placeholder="Auteur ou formateur"/></label>
      <label>Catégorie<select name="category" defaultValue="Formation">{categories.map(x => <option key={x}>{x}</option>)}</select></label>
      <label>Niveau<select name="level" defaultValue="Tous niveaux"><option value="">Non précisé</option>{levels.map(x => <option key={x}>{x}</option>)}</select></label>
      <label>Matière / domaine<input name="subject" placeholder="Entrepreneuriat, IA, Maths…"/></label>
      <label>Langue<select name="language" defaultValue="fr"><option value="fr">Français</option><option value="en">Anglais</option><option value="ar">Arabe</option><option value="ha">Haoussa</option><option value="dje">Zarma</option></select></label>
      <label>Année<input name="published_year" type="number" min="1900" max="2100" defaultValue={new Date().getFullYear()}/></label>
      <label>Temps estimé (minutes)<input name="reading_time" type="number" min="1" placeholder="60"/></label>
      <label>Éditeur<input name="publisher" placeholder="Éditeur / organisme"/></label>
      <label>ISBN<input name="isbn" placeholder="Optionnel"/></label>
      <label>Licence<input name="license" placeholder="Domaine public, CC BY, autorisation…" required/></label>
      <label>Source URL<input name="source_url" type="url" placeholder="https://…"/></label>
      <label className="full">Description<textarea name="description" rows={4} placeholder="Décris le contenu et le public cible."/></label>
      <label>URL couverture<input name="cover_url" type="url" placeholder="https://…"/></label>
      <label>Fichier PDF / EPUB<input name="file" type="file" accept="application/pdf,.pdf,application/epub+zip,.epub" required/></label>
    </div>
    <div className="form-checks"><label><input name="is_premium" type="checkbox"/> Contenu premium</label><label><input name="download_enabled" type="checkbox"/> Autoriser le téléchargement</label></div>
    <button className="btn btn-gold" disabled={busy}>{busy ? <><Loader2 className="spin" size={17}/> Upload…</> : <><Upload size={17}/> Ajouter à la bibliothèque</>}</button>
    {message && <p className="success-message"><CheckCircle2 size={17}/> {message}</p>}
    {error && <p className="error-message">{error}</p>}
  </form>;
}
