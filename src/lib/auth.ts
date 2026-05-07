import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "salma_admin_session";
const encoder = new TextEncoder();

function secret() {
  const value = process.env.JWT_SECRET || process.env.AUTH_SECRET || "dev-only-change-me";
  return encoder.encode(value);
}

export type AdminSession = {
  userId: string;
  email: string;
  role: "ADMIN" | "VIEWER";
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(session: AdminSession) {
  return new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function readSession(request: Request): Promise<AdminSession | null> {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`))
    ?.split("=")[1];

  if (!token) return null;

  try {
    const verified = await jwtVerify(token, secret());
    const payload = verified.payload as Partial<AdminSession>;
    if (!payload.userId || !payload.email || !payload.role) return null;
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export async function requireAdmin(request: Request) {
  const session = await readSession(request);
  if (!session) {
    return { session: null, response: json({ error: "Unauthenticated" }, 401) };
  }
  if (session.role !== "ADMIN") {
    return { session: null, response: json({ error: "Forbidden" }, 403) };
  }
  return { session, response: null };
}

export function sessionCookie(token: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${secure}`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export async function findAdminByEmail(email: string) {
  return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
}

export function json(data: unknown, status = 200, headers?: HeadersInit) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json",
      ...headers,
    },
  });
}
