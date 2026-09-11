export default function HomePage() {
  return (
    <main className="container" style={{ padding: "72px 0" }}>
      <section className="card">
        <p style={{ marginTop: 0, fontWeight: 700 }}>BICKRI LIB</p>
        <h1>Votre bibliothèque numérique intelligente.</h1>
        <p>Découvrez, recherchez et consultez des ressources éducatives dans une plateforme moderne et sécurisée.</p>
        <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
          <a className="card" style={{ padding: "12px 18px" }} href="/login">Se connecter</a>
          <a className="card" style={{ padding: "12px 18px" }} href="/register">Créer un compte</a>
        </div>
      </section>
    </main>
  );
}
