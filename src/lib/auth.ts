import { cookies } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureSeeded } from "./seed";

export const SESSION_COOKIE_NAME = "rm_studio_session_uid";

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "visitor";
}

export async function getSessionUser(): Promise<SessionUser | null> {
  await ensureSeeded();
  try {
    const cookieStore = await cookies();
    const rawUid = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!rawUid) return null;

    const userId = parseInt(rawUid, 10);
    if (isNaN(userId)) return null;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role === "admin" ? "admin" : "visitor",
    };
  } catch {
    return null;
  }
}
