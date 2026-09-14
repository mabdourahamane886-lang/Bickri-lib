import Link from "next/link";
import { ArrowRight, BookOpen, Search, ShieldCheck, Sparkles } from "lucide-react";
import Sidebar from "@/components/sidebar";
import MobileNavigation from "@/components/mobile-navigation";

const highlights = [
  [BookOpen, "Bibliothèque structurée", "Un espace clair pour retrouver vos ressources et organiser votre parcours de lecture."],
  [Search, "Recherche rapide", "Trouvez un livre, un auteur ou un thème depuis une recherche centrale et professionnelle."],
  [ShieldCheck, "Expérience sécurisée", "Votre espace personnel est pensé pour protéger votre compte et vos préférences."],
];

const audiences = [
  ["Élèves", "Réviser, lire et découvrir des ressources adaptées à chaque étape de l’apprentissage."],
  ["Étudiants", "Accéder rapidement à des ouvrages et ressources utiles pour vos études et vos recherches."],
  ["Enseignants & lecteurs", "Explorer une bibliothèque numérique conçue pour apprendre, transmettre et progresser."],
];

const pageStyles = `
  .lib-home{min-height:100vh}
  .home-toolbar{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:24px;padding:8px 0 18px}
  .home-brand{display:flex;align-items:center;gap:10px;min-width:max-content}
  .home-brand .brand-mark-icon{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;background:linear-gradient(135deg,var(--gold2),var(--gold));color:var(--navy);box-shadow:0 8px 22px #e2b24b24}
  .home-brand strong{display:block;color:var(--navy);font-size:17px;line-height:1.05}.home-brand small{display:block;color:var(--muted);font-size:11px;margin-top:3px}
  .desktop-nav{display:flex;justify-content:center;gap:4px}.desktop-nav a{padding:9px 12px;border-radius:10px;color:#526174;font-size:13px;font-weight:800}.desktop-nav a:hover,.desktop-nav a.active{background:#eaf1f8;color:var(--navy)}
  .top-actions{display:flex;align-items:center;gap:10px}.top-login{font-size:13px;font-weight:800;color:var(--navy)}.btn-small{padding:10px 14px}
  .reference-hero{position:relative;overflow:hidden;display:grid;grid-template-columns:minmax(0,1.15fr) minmax(300px,.85fr);gap:36px;align-items:center;padding:54px;border-radius:32px;background:radial-gradient(circle at 88% 14%,#1c5a89 0,#0b3157 34%,#06152b 76%);color:#fff;box-shadow:0 28px 80px #06152b26}
  .reference-hero:before{content:"";position:absolute;width:420px;height:420px;border:1px solid #ffffff14;border-radius:50%;right:-160px;bottom:-190px}
  .hero-copy,.hero-panel{position:relative;z-index:1}.hero-eyebrow{display:inline-flex;align-items:center;gap:7px;padding:8px 11px;border:1px solid #ffffff1c;border-radius:999px;background:#ffffff0b}
  .reference-hero h1{margin:20px 0 18px;max-width:720px;font-size:clamp(48px,6vw,76px);line-height:.98;letter-spacing:-.05em}.reference-hero h1 span{color:var(--gold2)}.reference-hero p{max-width:650px;margin:0;color:#d6e3ef;font-size:17px;line-height:1.75}
  .btn-outline-light{border:1px solid #ffffff3d;background:#ffffff0b;color:#fff}.btn-outline-light:hover{background:#fff;color:var(--navy)}
  .hero-panel{min-height:310px;padding:25px;border:1px solid #ffffff1a;border-radius:24px;background:linear-gradient(145deg,#ffffff12,#ffffff05);backdrop-filter:blur(12px);box-shadow:0 24px 60px #0000001c;display:flex;flex-direction:column;justify-content:space-between}.hero-panel-top{display:flex;justify-content:space-between;color:#b9c9d8;font-size:10px;font-weight:900;letter-spacing:.16em;text-transform:uppercase}.hero-book{width:104px;height:132px;border-radius:10px;background:linear-gradient(145deg,var(--gold2),var(--gold));color:var(--navy);display:grid;place-items:center;box-shadow:18px 18px 0 #ffffff0a,0 22px 40px #0003;margin:auto}.hero-panel-title{font-size:24px;font-weight:900;letter-spacing:-.03em}.hero-panel-lines{display:flex;gap:6px}.hero-panel-lines i{height:4px;border-radius:999px;background:#ffffff33;flex:1}.hero-panel-lines i:first-child{background:var(--gold)}
  .search-stage{position:relative;z-index:3;width:min(900px,calc(100% - 40px));margin:-38px auto 0;padding:24px;background:#fff;border:1px solid #dbe4ee;border-radius:22px;box-shadow:0 20px 60px #06152b16}.search-stage-label{font-size:13px;font-weight:900;color:var(--navy);margin:0 0 11px}.professional-search{display:flex;align-items:center;gap:11px;min-height:60px;padding:7px 8px 7px 17px;border:1px solid #cdd9e6;border-radius:16px;background:#f9fbfd;box-shadow:inset 0 1px 2px #06152b08}.professional-search:focus-within{background:#fff;border-color:var(--gold);box-shadow:0 0 0 4px #e2b24b1e}.professional-search svg{color:#64748b}.professional-search input{flex:1;min-width:0;border:0;outline:0;background:transparent;font-size:15px;color:var(--ink)}.professional-search button{min-height:46px;border:0;border-radius:12px;padding:0 18px;background:var(--navy);color:#fff;font-weight:850}.search-hints{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:12px;font-size:11px;color:#64748b}.search-hints span{font-weight:800}.search-hints a{padding:5px 9px;border-radius:999px;background:#f1f5f9;color:#475569;font-weight:800}
  .trust-strip{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:24px 4px 6px;border-bottom:1px solid var(--line)}.trust-strip strong{display:block;color:var(--navy);font-size:14px}.trust-strip>div:first-child span{display:block;margin-top:5px;color:var(--muted);font-size:12px}.trust-items{display:flex;gap:22px;color:#526174;font-size:11px;font-weight:800}.trust-items span{display:flex;align-items:center;gap:7px}.trust-items span:before{content:"";width:6px;height:6px;border-radius:50%;background:var(--gold)}
  .reference-section{margin-top:48px}.reference-head{margin-bottom:20px}.gold-eyebrow{color:#9a6b0e;margin:0 0 7px}.section-link{display:inline-flex;align-items:center;gap:6px;color:#8b620d;font-size:12px;font-weight:900}.premium-features{gap:14px}.premium-feature{position:relative;min-height:210px;padding:24px;transition:transform .2s,box-shadow .2s}.premium-feature:hover{transform:translateY(-4px);box-shadow:0 20px 45px #06152b14}.premium-feature h3{margin:18px 0 8px;color:var(--navy);font-size:18px}.premium-feature p{margin:0;color:var(--muted);font-size:13px;line-height:1.7}.premium-feature>a{display:inline-flex;align-items:center;gap:5px;margin-top:20px;color:#8b620d;font-size:12px;font-weight:900}
  .audience-section{margin-top:52px}.audience-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.audience-card{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:14px;padding:19px;border:1px solid var(--line);border-radius:18px;background:#fff;transition:.2s}.audience-card:hover{border-color:#c6d5e5;transform:translateY(-2px);box-shadow:0 15px 35px #06152b0e}.audience-card>span{font-size:11px;font-weight:900;color:#9a6b0e}.audience-card h3{margin:0 0 5px;color:var(--navy);font-size:14px}.audience-card p{margin:0;color:var(--muted);font-size:12px;line-height:1.55}.audience-card>svg{color:#9a6b0e}
  .final-cta{display:flex;align-items:center;justify-content:space-between;gap:25px;margin-top:52px;padding:35px 38px;border-radius:24px;background:linear-gradient(135deg,#071a33,#0b3157);color:#fff;box-shadow:0 22px 55px #06152b20}.final-cta .eyebrow{margin:0 0 6px}.final-cta h2{margin:0 0 7px;font-size:27px;letter-spacing:-.03em}.final-cta p:last-child{margin:0;color:#bdccdb;font-size:13px}
  @media(max-width:1000px){.home-toolbar{grid-template-columns:auto 1fr}.desktop-nav{display:none}.reference-hero{grid-template-columns:1fr;padding:44px}.hero-panel{display:none}.trust-items{display:none}.audience-grid{grid-template-columns:1fr}}
  @media(max-width:640px){.home-toolbar{padding-top:12px;gap:12px}.top-actions .top-login{display:none}.reference-hero{margin-top:8px;padding:34px 24px;min-height:auto;border-radius:24px}.reference-hero h1{font-size:48px}.reference-hero p{font-size:15px}.search-stage{width:calc(100% - 18px);margin:-22px auto 0;padding:17px;border-radius:18px}.professional-search{min-height:54px}.professional-search button{padding:0 13px;font-size:12px}.search-hints{gap:6px}.trust-strip{padding-top:20px}.reference-section{margin-top:38px}.section-head.reference-head{align-items:flex-start}.section-head.reference-head h2{font-size:22px}.premium-feature{min-height:auto}.audience-section{margin-top:38px}.final-cta{align-items:flex-start;flex-direction:column;padding:28px 24px}.final-cta h2{font-size:23px}}
`;

export default function HomePage() {
  return (
    <div className="shell lib-home">
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />
      <Sidebar />
      <MobileNavigation />
      <main className="page-main">
        <div className="container">
          <header className="home-toolbar">
            <Link href="/" className="home-brand" aria-label="Bickri Lib accueil">
              <span className="brand-mark-icon"><BookOpen size={21} /></span>
              <span><strong>Bickri Lib</strong><small>Bibliothèque numérique</small></span>
            </Link>
            <nav className="desktop-nav" aria-label="Navigation principale">
              <Link href="/" className="active">Accueil</Link>
              <Link href="/books">Bibliothèque</Link>
              <Link href="/dashboard">Mon espace</Link>
            </nav>
            <div className="top-actions">
              <Link href="/login" className="top-login">Connexion</Link>
              <Link href="/register" className="btn btn-gold btn-small">Créer un compte</Link>
            </div>
          </header>

          <section className="reference-hero">
            <div className="hero-copy">
              <div className="eyebrow hero-eyebrow"><Sparkles size={15} /> Bibliothèque numérique africaine</div>
              <h1>Apprendre.<br /><span>Lire. Progresser.</span></h1>
              <p>Une nouvelle façon de découvrir, rechercher et consulter des ressources éducatives, pensée pour les élèves, étudiants, enseignants et lecteurs.</p>
              <div className="actions">
                <Link href="/books" className="btn btn-gold"><BookOpen size={18} /> Explorer la bibliothèque <ArrowRight size={17} /></Link>
                <Link href="/register" className="btn btn-outline-light">Créer mon compte</Link>
              </div>
            </div>
            <div className="hero-panel" aria-hidden="true">
              <div className="hero-panel-top"><span>Bickri Lib</span><span>01</span></div>
              <div className="hero-book"><BookOpen size={54} /></div>
              <div className="hero-panel-title">Le savoir à portée de main.</div>
              <div className="hero-panel-lines"><i /><i /><i /></div>
            </div>
          </section>

          <section className="search-stage" aria-label="Recherche dans la bibliothèque">
            <div className="search-stage-label">Que souhaitez-vous lire aujourd’hui ?</div>
            <form action="/books" method="get" className="professional-search">
              <Search size={21} aria-hidden="true" />
              <input name="q" aria-label="Rechercher un livre, un auteur ou un thème" placeholder="Rechercher un livre, un auteur, un ISBN ou un thème..." />
              <button type="submit">Rechercher</button>
            </form>
            <div className="search-hints"><span>Suggestions :</span><Link href="/books">Romans</Link><Link href="/books">Éducation</Link><Link href="/books">Sciences</Link><Link href="/books">Formation</Link></div>
          </section>

          <section className="trust-strip">
            <div><strong>Une plateforme pensée pour apprendre</strong><span>Simple à utiliser · Moderne · Accessible</span></div>
            <div className="trust-items"><span>Ressources éducatives</span><span>Lecture numérique</span><span>Accès sécurisé</span></div>
          </section>

          <section className="section reference-section">
            <div className="section-head reference-head">
              <div><p className="eyebrow gold-eyebrow">L’expérience Bickri Lib</p><h2>Tout ce qu’il faut pour mieux apprendre</h2></div>
              <Link href="/books" className="section-link">Voir la bibliothèque <ArrowRight size={16} /></Link>
            </div>
            <div className="grid grid-3 premium-features">
              {highlights.map(([Icon, title, text]) => { const I = Icon as typeof ShieldCheck; return <div className="card premium-feature" key={title as string}><div className="feature-icon"><I size={21} /></div><h3>{title as string}</h3><p>{text as string}</p><Link href="/books">Découvrir <ArrowRight size={15} /></Link></div>; })}
            </div>
          </section>

          <section className="section audience-section">
            <div className="section-head reference-head"><div><p className="eyebrow gold-eyebrow">Pour vous</p><h2>Un espace pour chaque lecteur</h2></div></div>
            <div className="audience-grid">
              {audiences.map(([title, text], index) => <Link href="/books" className="audience-card" key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div><ArrowRight size={18} /></Link>)}
            </div>
          </section>

          <section className="final-cta">
            <div><p className="eyebrow">Bickri Lib</p><h2>Votre prochaine lecture commence ici.</h2><p>Explorez la bibliothèque et construisez votre propre parcours de lecture.</p></div>
            <Link href="/books" className="btn btn-gold">Explorer maintenant <ArrowRight size={17} /></Link>
          </section>

          <footer className="footer">© {new Date().getFullYear()} Bickri Lib · Une solution Bickri Service Agency · Innover et réussir.</footer>
        </div>
      </main>
    </div>
  );
}
