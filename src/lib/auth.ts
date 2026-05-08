const SESSION_COOKIE = "salma_admin_session";
const SESSION_TOKEN = "salma-admin-open-session";
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();
const FALLBACK_ADMIN_EMAIL = "salmahani963@gmail.com";
const FALLBACK_ADMIN_PASSWORD = "salmamorv";

function normalizeCredential(value: string): string {
  const trimmed = value.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

export type AdminSession = {
  userId: string;
  email: string;
  role: "ADMIN" | "VIEWER";
};

export function configuredAdminCredentials() {
  const email = FALLBACK_ADMIN_EMAIL;
  const password = FALLBACK_ADMIN_PASSWORD;
  const name = "Salma Hani";

  return { email, password, name };
}

export async function authenticateAdmin(inputEmail: string, inputPassword: string) {
  const configured = configuredAdminCredentials();
  const submittedEmail = normalizeCredential(inputEmail).toLowerCase();
  const submittedPassword = normalizeCredential(inputPassword);
  const matches =
    configured !== null &&
    configured.email === submittedEmail &&
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
  return `${SESSION_TOKEN}:${session.email}`;
}

export async function readSession(request: Request): Promise<AdminSession | null> {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`))
    ?.split("=")[1];

  if (!token) return null;

  if (!decodeURIComponent(token).startsWith(SESSION_TOKEN)) return null;

  return {
    userId: "configured-admin",
    email: FALLBACK_ADMIN_EMAIL,
    role: "ADMIN",
  };
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
