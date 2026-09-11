"use client";

import {
  BookMarked,
  BookOpen,
  Download,
  Heart,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  Search,
  Settings,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const mainLinks = [
  { label: "Accueil", href: "/", icon: Home },
  { label: "Bibliothèque", href: "/books", icon: BookOpen },
  { label: "Rechercher", href: "/books", icon: Search },
  { label: "Mes favoris", href: "/dashboard", icon: Heart },
  { label: "Mes lectures", href: "/dashboard", icon: BookMarked },
  { label: "Téléchargements", href: "/dashboard", icon: Download },
  { label: "Boutique", href: "/dashboard", icon: ShoppingBag },
  { label: "Mon profil", href: "/dashboard", icon: UserRound },
  { label: "Paramètres", href: "/dashboard", icon: Settings },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-xl bg-[#071a33] p-3 text-white shadow-lg lg:hidden"
        aria-label="Ouvrir le menu"
      >
        <Menu size={21} />
      </button>

      {open && (
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Fermer le menu"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[270px] flex-col bg-[#071a33] px-5 py-6 text-white transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="mb-10 flex items-center justify-between">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d9a441] text-xl font-bold text-[#071a33]">
              B
            </div>

            <div>
              <h1 className="text-lg font-bold">Bickri Lib</h1>
              <p className="text-xs text-slate-400">
                Bibliothèque intelligente
              </p>
            </div>
          </Link>

          <button
            onClick={() => setOpen(false)}
            className="text-slate-400 transition hover:text-white lg:hidden"
            aria-label="Fermer le menu"
          >
            <X size={21} />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {mainLinks.map((link) => {
            const Icon = link.icon;
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                  active
                    ? "bg-[#d9a441] font-semibold text-[#071a33]"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={19} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 pt-5">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <HelpCircle size={19} />
            Aide et support
          </Link>

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={19} />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
