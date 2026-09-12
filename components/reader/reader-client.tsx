"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpen, CheckCircle2, ExternalLink, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Book, ReadingProgress } from "@/types/database";

export default function ReaderClient({ book }: { book: Book }) {
  const supabase = useMemo(() => createClient(), []);
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [zoom, setZoom] = useState(100);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      const response = await fetch(`/api/books/${book.id}/url`);
      const body = await response.json();
      if (!active) return;
      if (!response.ok) {
        setError(body.error || "Lecture indisponible");
        return;
      }
      setUrl(body.url);
      const { data: session } = await supabase.auth.getUser();
      if (!session.user) return;
      const { data } = await supabase.from("reading_progress").select("id,user_id,book_id,current_page,progress_percent,completed,last_read_at").eq("user_id", session.user.id).eq("book_id", book.id).maybeSingle();
      const saved = data as ReadingProgress | null;
      if (saved && active) {
        setProgress(Number(saved.progress_percent || 0));
        setCompleted(Boolean(saved.completed));
      }
    }
    load();
    return () => { active = false; };
  }, [book.id, supabase]);

  async function saveProgress(next: number) {
    const value = Math.min(100, Math.max(0, Math.round(next)));
    setProgress(value);
    const { data: session } = await supabase.auth.getUser();
    if (!session.user) return;
    const isComplete = value >= 100;
    setCompleted(isComplete);
    await supabase.from("reading_progress").upsert({ user_id: session.user.id, book_id: book.id, current_page: 0, progress_percent: value, completed: isComplete, last_read_at: new Date().toISOString() }, { onConflict: "user_id,book_id" });
  }

  return (
    <div className="reader-page">
      <header className="reader-topbar">
        <Link href={`/books/${book.id}`} className="btn"><ArrowLeft size={17}/> Retour</Link>
        <div className="reader-title"><BookOpen size={18}/><span>{book.title}</span></div>
        <div className="reader-actions">
          <button className="btn" onClick={() => setZoom(v => Math.max(70, v - 10))} aria-label="Réduire"><Minus size={16}/></button>
          <span>{zoom}%</span>
          <button className="btn" onClick={() => setZoom(v => Math.min(150, v + 10))} aria-label="Agrandir"><Plus size={16}/></button>
        </div>
      </header>

      <main className="reader-body">
        {!url && !error && <div className="card reader-empty">Préparation de votre lecture…</div>}
        {error && <div className="card reader-empty"><strong>{error}</strong><p className="muted">Ce livre doit d'abord recevoir un fichier depuis l'espace administrateur.</p></div>}
        {url && book.file_type === "pdf" && (
          <div className="reader-frame-wrap" style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}>
            <iframe src={`${url}#toolbar=1&navpanes=0`} title={book.title} className="reader-frame" />
          </div>
        )}
        {url && book.file_type !== "pdf" && (
          <div className="card reader-empty">
            <h2>Fichier EPUB disponible</h2>
            <p className="muted">Ton fichier est bien sécurisé dans Bickri Lib. Ouvre-le dans un lecteur EPUB compatible.</p>
            <a className="btn btn-gold" href={url} target="_blank" rel="noreferrer"><ExternalLink size={17}/> Ouvrir le fichier</a>
          </div>
        )}
      </main>

      <footer className="reader-footer">
        <div className="reader-progress-label"><span>Progression</span><strong>{progress}%</strong></div>
        <div className="progress-track"><div className="progress-value" style={{ width: `${progress}%` }} /></div>
        <div className="reader-progress-controls">
          <input aria-label="Progression de lecture" type="range" min="0" max="100" value={progress} onChange={e => saveProgress(Number(e.target.value))}/>
          <button className={`btn ${completed ? "btn-gold" : ""}`} onClick={() => saveProgress(completed ? 0 : 100)}>{completed ? <><CheckCircle2 size={17}/> Terminé</> : "Marquer comme terminé"}</button>
        </div>
      </footer>
    </div>
  );
}
