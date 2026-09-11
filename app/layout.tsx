import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {default:"Bickri Lib — Bibliothèque numérique intelligente",template:"%s | Bickri Lib"},
  description:"Bickri Lib est une bibliothèque numérique moderne pour découvrir, rechercher et consulter des ressources éducatives.",
  keywords:["Bickri Lib","bibliothèque numérique","livres","éducation","Niger"],
  openGraph:{title:"Bickri Lib",description:"Votre bibliothèque numérique intelligente.",type:"website"},
};

export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fr"><body>{children}</body></html>}
