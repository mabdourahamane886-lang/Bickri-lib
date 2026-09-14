import Link from "next/link";
import { ArrowRight, BookOpen, Search, ShieldCheck, Sparkles, UserRound } from "lucide-react";
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

export default function HomePage() {
  return (
    <div className="shell">
      <Sidebar />
      <MobileNavigation />
      <main className="page-main">
        <div className="container">
          <header className="home-toolbar" style={{ marginBottom: 18 }}>
            <Link href="/" className="brand-mark" aria-label="Bickri Lib accueil">
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
              <div className="hero-panel-top"><span>BIckri Lib</span><span>01</span></div>
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
