import Link from "next/link";

export default async function VerifyRegisterPage({ searchParams }: { searchParams: Promise<{ email?: string; next?: string }> }) {
  const params = await searchParams;
  const email = params.email || "votre adresse e-mail";
  const next = params.next?.startsWith("/") ? params.next : "/dashboard";

  return (
    <main className="container" style={{ padding: "64px 0" }}>
      <div className="card" style={{ maxWidth: 560, margin: "auto" }}>
        <p className="eyebrow" style={{ color: "#9a6b0e" }}>Inscription Bickri Lib</p>
        <h1>Vérifiez votre e-mail</h1>
        <p className="muted" style={{ lineHeight: 1.7 }}>
          Nous avons envoyé un lien de confirmation à <strong>{email}</strong>.
          Ouvrez ce message et cliquez sur le lien pour activer votre compte.
        </p>
        <div className="card" style={{ background: "#f8fafc", margin: "20px 0" }}>
          <strong>Après confirmation</strong>
          <p className="muted" style={{ margin: "7px 0 0", lineHeight: 1.6 }}>
            Votre profil Bickri Lib est créé automatiquement et vous serez redirigé vers votre espace personnel.
          </p>
        </div>
        <div className="actions">
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="btn btn-dark">J'ai confirmé mon e-mail</Link>
          <Link href="/register" className="btn btn-light">Modifier mon e-mail</Link>
        </div>
      </div>
    </main>
  );
}
