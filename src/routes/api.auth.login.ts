import { createFileRoute } from "@tanstack/react-router";
import { createSessionToken, findAdminByEmail, json, sessionCookie, verifyPassword } from "@/lib/auth";

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null);
        const email = String(body?.email ?? "").toLowerCase().trim();
        const password = String(body?.password ?? "");

        if (!email || !password) {
          return json({ error: "Email and password are required" }, 400);
        }

        const user = await findAdminByEmail(email);
        if (!user || user.role !== "ADMIN") {
          return json({ error: "Invalid credentials" }, 401);
        }

        const ok = await verifyPassword(password, user.passwordHash);
        if (!ok) {
          return json({ error: "Invalid credentials" }, 401);
        }

        const token = await createSessionToken({
          userId: user.id,
          email: user.email,
          role: "ADMIN",
        });

        return json(
          { user: { id: user.id, email: user.email, name: user.name, role: user.role } },
          200,
          { "set-cookie": sessionCookie(token) },
        );
      },
    },
  },
});
