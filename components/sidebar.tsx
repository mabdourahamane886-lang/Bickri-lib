"use client";

import { BookOpen, Heart, Home, LogOut, Menu, Search, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { label: "Accueil", href: "/", icon: Home },
  { label: "Bibliothèque", href: "/books", icon: BookOpen },
  { label: "Rechercher", href: "/books", icon: Search },
  { label: "Mes favoris", href: "/dashboard", icon: Heart },
  { label: "Mon profil", href: "/dashboard", icon: UserRound },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return <>
    <button className="mobile-menu" onClick={() => setOpen(true)} aria-label="Ouvrir le menu"><Menu size={21}/></button>
    {open && <button onClick={() => setOpen(false)} aria-label="Fermer" style={{position:"fixed",inset:0,zIndex:45,border:0,background:"#0006"}}/>}
    <aside className="sidebar" style={open ? {transform:"translateX(0)"} : undefined}>
      <Link href="/" className="brand" onClick={() => setOpen(false)}>
        <span className="brand-mark">B</span><span><strong>Bickri Lib</strong><small>Bibliothèque intelligente</small></span>
      </Link>
      <button onClick={() => setOpen(false)} aria-label="Fermer" style={{display:open?"block":"none",position:"absolute",right:18,top:22,background:"none",border:0,color:"white"}}><X/></button>
      <nav className="nav">
        {links.map(({label,href,icon:Icon}) => { const active = href === "/" ? pathname === "/" : pathname.startsWith(href); return <Link key={label} href={href} className={active ? "active" : ""} onClick={() => setOpen(false)}><Icon size={18}/>{label}</Link>; })}
      </nav>
      <div className="sidebar-footer"><Link href="/dashboard">Aide et support</Link><Link href="/login"><LogOut size={17} style={{verticalAlign:"middle",marginRight:8}}/>Connexion</Link></div>
    </aside>
  </>;
}
