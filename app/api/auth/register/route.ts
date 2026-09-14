import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (name.length < 2) {
      return NextResponse.json({ error: "Veuillez saisir votre nom complet." }, { status: 400 });
    }
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Veuillez saisir une adresse e-mail valide." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Le mot de passe doit contenir au moins 8 caractères." }, { status: 400 });
    }

    const admin = createAdminClient();
    if (!admin) {
      console.error("Bickri Lib registration server config missing: SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY");
      return NextResponse.json(
        { error: "Le serveur d'inscription n'est pas encore configuré. Ajoutez la clé serveur Supabase dans les variables d'environnement Vercel." },
        { status: 500 },
      );
    }

    const { data, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name },
    });

    if (createError || !data.user) {
      const message = createError?.message || "Impossible de créer le compte.";
      const lower = message.toLowerCase();
      if (lower.includes("already") || lower.includes("registered") || lower.includes("exists")) {
        return NextResponse.json(
          { error: "Cette adresse e-mail est déjà utilisée. Connectez-vous avec ce compte." },
          { status: 409 },
        );
      }
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (error) {
    console.error("Bickri Lib register error", error);
    return NextResponse.json(
      { error: "Le service d'inscription est temporairement indisponible." },
      { status: 500 },
    );
  }
}
