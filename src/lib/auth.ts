import { jwtVerify, SignJWT } from "jose";

const SESSION_COOKIE = "salma_admin_session";
const encoder = new TextEncoder();
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

function cleanEnvValue(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function secret() {
  const raw =
    process.env.JWT_SECRET ||
    process.env.AUTH_SECRET ||
    (process.env.NODE_ENV !== "production" ? "dev-only-secret-change-me" : "");

  if (!raw) {
    throw new Error("[auth] JWT_SECRET is not set. Add it to your Vercel environment variables.");
  }

  return encoder.encode(cleanEnvValue(raw));
}

export type AdminSession = {
  userId: string;
  email: string;
  role: "ADMIN" | "VIEWER";
};

export function configuredAdminCredentials() {
  const isProduction = process.env.NODE_ENV === "production";
  const email = cleanEnvValue(process.env.ADMIN_EMAIL ?? "").toLowerCase();
  const password = cleanEnvValue(process.env.ADMIN_PASSWORD ?? "");
  const name = cleanEnvValue(process.env.ADMIN_NAME ?? "") || "Salma Hani";

  if (!email || !password) {
    const message =
      "[auth] ADMIN_EMAIL and ADMIN_PASSWORD are not configured. Add them without surrounding quotes.";
    if (isProduction) console.error(message);
    else console.warn(message);
    return null;
  }

  return { email, password, name };
}

export async function authenticateAdmin(inputEmail: string, inputPassword: string) {
  const configured = configuredAdminCredentials();
  const submittedPassword = cleanEnvValue(inputPassword);
  const matches =
    configured !== null &&
    configured.email === inputEmail.toLowerCase().trim() &&
    configured.password === submittedPassword;

  if (!matches) return null;

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

export function json(data: unknown, status = 200, headers?: HeadersInit) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json",
      ...headers,
    },
  });
}

export function clientKey(request: Request, scope: string) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return `${scope}:${forwarded || realIp || "unknown"}`;
}

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const current = Date.now();
  const bucket = rateLimitBuckets.get(key);
  if (!bucket || bucket.resetAt <= current) {
    rateLimitBuckets.set(key, { count: 1, resetAt: current + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - current) / 1000) };
  }

  return { ok: true, retryAfter: 0 };
}
