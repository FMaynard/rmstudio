import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureSeeded } from "@/lib/seed";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  await ensureSeeded();
  try {
    const body = await request.json();
    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const password = (body.password || "").trim();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Preencha nome, e-mail e senha para criar seu cadastro gratuito." },
        { status: 400 }
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 4 caracteres." },
        { status: 400 }
      );
    }

    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado. Faça login para baixar as músicas." },
        { status: 409 }
      );
    }

    const [inserted] = await db
      .insert(users)
      .values({
        name,
        email,
        passwordHash: password,
        role: "visitor", // Apenas o proprietário possui role 'admin'
      })
      .returning();

    const sessionUser = {
      id: inserted.id,
      name: inserted.name,
      email: inserted.email,
      role: "visitor" as const,
    };

    const response = NextResponse.json({ user: sessionUser }, { status: 201 });
    response.cookies.set(SESSION_COOKIE_NAME, String(inserted.id), {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Erro ao realizar cadastro de visitante." },
      { status: 500 }
    );
  }
}
