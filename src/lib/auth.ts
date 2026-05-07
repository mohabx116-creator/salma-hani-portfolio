import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "salma_admin_session";
const encoder = new TextEncoder();
const DEV_ADMIN_EMAIL = "salmahani963@gmail.com";
const DEV_ADMIN_PASSWORD = "salmamorv";

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

export function configuredAdminCredentials() {
  const allowDevFallback = process.env.NODE_ENV !== "production";
  const email = (process.env.ADMIN_EMAIL || (allowDevFallback ? DEV_ADMIN_EMAIL : "")).toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || (allowDevFallback ? DEV_ADMIN_PASSWORD : "");
  const name = process.env.ADMIN_NAME?.trim() || "Salma Hani";

  if (!email || !password) return null;
  return { email, password, name };
}

export function databaseConfigError() {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) return "DATABASE_URL is not set.";
  if (
    databaseUrl.includes("USER:PASSWORD@HOST") ||
    databaseUrl.includes("@HOST:") ||
    databaseUrl.includes("//USER:")
  ) {
    return "DATABASE_URL is still using the placeholder value.";
  }

  return null;
}

export async function syncConfiguredAdmin(password: string) {
  const configured = configuredAdminCredentials();
  if (!configured) return null;

  const passwordHash = await hashPassword(password);

  return prisma.user.upsert({
    where: { email: configured.email },
    update: {
      name: configured.name,
      passwordHash,
      role: "ADMIN",
    },
    create: {
      email: configured.email,
      name: configured.name,
      passwordHash,
      role: "ADMIN",
    },
  });
}

export async function authenticateAdmin(email: string, password: string) {
  const configured = configuredAdminCredentials();
  const matchesConfiguredAdmin = configured?.email === email && configured.password === password;

  if (matchesConfiguredAdmin && databaseConfigError()) {
    console.warn(`[auth] Signing in configured admin without database: ${email}`);
    return {
      id: "configured-admin",
      email: configured.email,
      name: configured.name,
      role: "ADMIN" as const,
      passwordHash: "",
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  const user = await findAdminByEmail(email);
  if (user?.role === "ADMIN" && (await verifyPassword(password, user.passwordHash))) {
    return user;
  }

  if (matchesConfiguredAdmin) {
    console.warn(`[auth] Syncing configured admin user: ${email}`);
    return syncConfiguredAdmin(password);
  }

  return null;
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
