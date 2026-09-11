import Link from "next/link";
import { BookOpen, Search, ShieldCheck } from "lucide-react";
import Sidebar from "@/components/sidebar";
import MobileNavigation from "@/components/mobile-navigation";

const features = [
  [BookOpen, "Bibliothèque organisée", "Retrouvez vos ressources numériques dans une interface simple et rapide."],
  [Search, "Recherche intelligente", "Recherchez par titre, auteur ou thème et trouvez rapidement votre prochain livre."],
  [ShieldCheck, "Accès sécurisé", "Votre espace personnel est protégé et vos informations restent confidentielles."],
];

export default function HomePage() {
  return <div className="shell"><Sidebar/><MobileNavigation/><main className="page-main"><div className="container">
    <section className="hero"><div className="eyebrow">Bickri Service Agency · Niger</div><h1>Votre bibliothèque numérique intelligente.</h1><p>Découvrez, recherchez et consultez des ressources éducatives dans une plateforme moderne, rapide et sécurisée.</p><div className="actions"><Link href="/books" className="btn btn-gold"><BookOpen size={18}/>Explorer la bibliothèque</Link><Link href="/register" className="btn btn-light">Créer mon compte</Link></div></section>
    <section className="section"><div className="section-head"><div><p className="eyebrow" style={{color:"#9a6b0e",margin:0}}>Pourquoi Bickri Lib</p><h2>Une expérience pensée pour apprendre</h2></div></div><div className="grid grid-3">{features.map(([Icon,title,text])=>{const I=Icon as typeof ShieldCheck;return <div className="card feature" key={title as string}><div className="feature-icon"><I size={20}/></div><div><h3 style={{margin:"0 0 7px",color:"#071a33"}}>{title as string}</h3><p className="muted" style={{margin:0,lineHeight:1.6,fontSize:14}}>{text as string}</p></div></div>})}</div></section>
    <section className="section"><div className="card" style={{background:"#071a33",color:"white",display:"flex",justifyContent:"space-between",gap:20,alignItems:"center",flexWrap:"wrap"}}><div><h2 style={{margin:"0 0 7px"}}>Prêt à commencer ?</h2><p style={{margin:0,color:"#cbd5e1"}}>Créez votre compte et commencez votre parcours de lecture.</p></div><Link href="/register" className="btn btn-gold">Commencer maintenant</Link></div></section>
    <footer className="footer">© {new Date().getFullYear()} Bickri Lib · Une solution Bickri Service Agency · Innover et réussir.</footer>
  </div></main></div>;
}
