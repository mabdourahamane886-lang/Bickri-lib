# Bickri Lib

Bibliothèque numérique intelligente de Bickri Service Agency.

## Stack
- Next.js App Router + TypeScript
- Supabase Auth + PostgreSQL
- `@supabase/ssr` pour les sessions SSR par cookies
- Vercel pour le déploiement

## Architecture
```text
app/                 Pages et routes Next.js
components/          Composants UI, auth et livres
lib/supabase/        Clients Supabase navigateur/serveur
lib/api/              Fonctions API
public/               Assets
supabase/migrations/  Schéma SQL et RLS
supabase/seed.sql     Données de démonstration
proxy.ts              Rafraîchissement/protection de session
```

## Authentification
```text
Utilisateur
   ↓
/login ou /register
   ↓
Supabase Auth
   ↓
session dans cookies sécurisés
   ↓
proxy.ts rafraîchit la session
   ↓
getUser() côté serveur
   ↓
/dashboard protégé
   ↓
PostgreSQL + RLS
```

### Credentials et tokens
- `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` peuvent être utilisés côté navigateur.
- La clé publishable/anon n'est pas un secret : la sécurité des données repose sur RLS.
- `SUPABASE_SERVICE_ROLE_KEY` est strictement serveur et ne doit jamais commencer par `NEXT_PUBLIC_`.
- Ne pas stocker manuellement les access/refresh tokens dans `localStorage`.
- Le client SSR utilise les cookies et `@supabase/ssr` pour la rotation/actualisation de session.
- Les routes protégées vérifient l'utilisateur côté serveur ; ne pas considérer un simple état React comme une autorisation.

## Installation
```bash
npm install
cp .env.example .env.local
npm run dev
```

`npm install` génère le `package-lock.json` correspondant à l'environnement installé ; il doit ensuite être commit dans Git.

## Variables
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Ne commit jamais `.env.local`.

## Sécurité base de données
Les tables applicatives utilisent Row Level Security (RLS). Les politiques limitent les données utilisateur à `auth.uid()` et les livres publics peuvent être lus selon les politiques définies dans les migrations.

## État
Scaffold initial prêt pour le développement de Bickri Lib.