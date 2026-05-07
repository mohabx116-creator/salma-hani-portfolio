import { jwtVerify, SignJWT } from "jose";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const SESSION_COOKIE = "salma_admin_session";
const encoder = new TextEncoder();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Strip surrounding single or double quotes that users sometimes paste into
 * the Vercel dashboard (e.g. "salmamorv" instead of salmamorv).
 */
function stripEnvQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function secret() {
  const raw =
    process.env.JWT_SECRET ||
    process.env.AUTH_SECRET ||
    (process.env.NODE_ENV !== "production" ? "dev-only-secret-change-me" : "");

  if (!raw) {
    // Hard-fail at token-creation time in production so the misconfiguration
    // is visible immediately rather than producing invalid tokens.
    throw new Error(
      "[auth] JWT_SECRET is not set. Add it to your Vercel environment variables.",
    );
  }

  return encoder.encode(stripEnvQuotes(raw));
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type AdminSession = {
  userId: string;
  email: string;
  role: "ADMIN" | "VIEWER";
};

// ---------------------------------------------------------------------------
// Credential resolution
// ---------------------------------------------------------------------------

/**
 * Returns the configured admin credentials from environment variables.
 *
 * Required env vars (set these in the Vercel dashboard – NO surrounding quotes):
 *   ADMIN_EMAIL    e.g.  salmahani963@gmail.com
 *   ADMIN_PASSWORD e.g.  yourSecurePassword
 *   JWT_SECRET     e.g.  a-long-random-string-at-least-32-chars
 *
 * In development (NODE_ENV !== "production") the app will warn but continue.
 * In production, missing credentials result in every login attempt failing.
 */
export function configuredAdminCredentials() {
  const isProduction = process.env.NODE_ENV === "production";

  const rawEmail = process.env.ADMIN_EMAIL ?? "";
  const rawPassword = process.env.ADMIN_PASSWORD ?? "";

  const email = stripEnvQuotes(rawEmail).toLowerCase().trim();
  const password = stripEnvQuotes(rawPassword);
  const name = stripEnvQuotes(process.env.ADMIN_NAME?.trim() ?? "") || "Salma Hani";

  // ── server-side debug logging (never logs actual secret values) ──────────
  console.log("[auth] NODE_ENV           :", process.env.NODE_ENV ?? "(not set)");
  console.log("[auth] ADMIN_EMAIL present :", rawEmail.length > 0);
  console.log("[auth] ADMIN_PASSWORD present:", rawPassword.length > 0);
  console.log("[auth] JWT_SECRET present :", !!(process.env.JWT_SECRET || process.env.AUTH_SECRET));
  // ------------------------------------------------------------------------

  if (!email || !password) {
    if (isProduction) {
      console.error(
        "[auth] FATAL: ADMIN_EMAIL and/or ADMIN_PASSWORD are not set in environment variables. " +
        "Go to Vercel → Project Settings → Environment Variables and add them without surrounding quotes.",
      );
    } else {
      console.warn(
        "[auth] WARNING: ADMIN_EMAIL or ADMIN_PASSWORD missing from .env – login will fail. " +
        "Copy .env.example to .env and fill in the values.",
      );
    }
    return null;
  }

  return { email, password, name };
}

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------
export async function authenticateAdmin(inputEmail: string, inputPassword: string) {
  const configured = configuredAdminCredentials();

  // Debug: log what we're comparing (never log the actual password)
  console.log("[auth] Submitted email    :", inputEmail);
  console.log("[auth] Configured email   :", configured?.email ?? "(none)");
  console.log(
    "[auth] Password length match:",
    configured ? inputPassword.length === configured.password.length : false,
  );

  const matches =
    configured !== null &&
    configured.email === inputEmail &&
    configured.password === inputPassword;

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

// ---------------------------------------------------------------------------
// Session / JWT
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Cookie helpers
// ---------------------------------------------------------------------------
export function sessionCookie(token: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${secure}`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

// ---------------------------------------------------------------------------
// JSON response helper
// ---------------------------------------------------------------------------
export function json(data: unknown, status = 200, headers?: HeadersInit) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json",
      ...headers,
    },
  });
}
