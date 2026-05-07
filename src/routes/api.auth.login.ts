import { createFileRoute } from "@tanstack/react-router";
import { authenticateAdmin, createSessionToken, databaseConfigError, json, sessionCookie } from "@/lib/auth";

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

        const databaseError = databaseConfigError();
        if (databaseError) return json({ error: databaseError }, 500);

        let user;
        try {
          user = await authenticateAdmin(email, password);
        } catch (error) {
          console.error("[auth] Login failed", error);
          return json({ error: "Authentication database is unavailable. Check DATABASE_URL." }, 500);
        }
        if (!user) return json({ error: "Invalid credentials" }, 401);

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
