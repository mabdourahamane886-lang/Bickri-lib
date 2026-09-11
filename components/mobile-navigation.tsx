"use client";

import { BookOpen, Heart, Home, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Accueil", href: "/", icon: Home },
  { label: "Livres", href: "/books", icon: BookOpen },
  { label: "Favoris", href: "/favorites", icon: Heart },
  { label: "Profil", href: "/profile", icon: UserRound },
];

export default function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="Navigation mobile">
      {links.map(({ label, href, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link key={label} href={href} className={active ? "active" : ""}>
            <Icon size={19} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
