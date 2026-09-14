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
      <style>{`
        .reader-page .reader-mobile-style{display:none}
        @media(max-width:700px){
          .reader-topbar{padding:9px 10px;gap:7px;align-items:center}
          .reader-topbar .btn{padding:9px 10px;border-radius:10px;font-size:11px;min-height:40px}
          .reader-topbar .btn svg{width:15px;height:15px}
          .reader-title{order:2;flex:1;max-width:none;width:auto;min-width:0;font-size:12px;gap:6px}
          .reader-actions{gap:4px;flex:0 0 auto}
          .reader-actions .btn{padding:8px;width:38px;min-width:38px;justify-content:center}
          .reader-actions>span{font-size:10px;min-width:30px;text-align:center;color:#cbd5e1}
          .reader-body{min-height:calc(100vh - 170px);padding:8px 6px;overflow:hidden;align-items:flex-start}
          .reader-frame-wrap{width:100%;height:calc(100vh - 250px);min-height:420px;transform-origin:top center!important}
          .reader-frame{width:100%;height:100%;border-radius:8px}
          .reader-empty{width:100%;margin:12px 0;padding:22px 16px;border-radius:14px}
          .reader-footer{padding:9px 10px 10px}
          .reader-progress-label{font-size:10px;margin-bottom:5px}
          .progress-track{height:5px}
          .reader-progress-controls{margin-top:8px;gap:7px}
          .reader-progress-controls input{width:100%;min-height:26px}
          .reader-progress-controls .btn{width:100%;min-height:40px;padding:9px 10px;font-size:11px}
        }
        @media(max-width:430px){
          .reader-topbar .btn span{display:none}
          .reader-title span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
          .reader-frame-wrap{height:calc(100vh - 245px);min-height:380px}
          .reader-progress-controls .btn{font-size:10px}
        }
      `}</style>
      <header className="reader-topbar">
        <Link href={`/books/${book.id}`} className="btn"><ArrowLeft size={17}/> <span>Retour</span></Link>
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
