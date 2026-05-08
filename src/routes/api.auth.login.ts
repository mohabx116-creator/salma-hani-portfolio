import { createFileRoute } from "@tanstack/react-router";
import { authenticateAdmin, createSessionToken, json, sessionCookie } from "@/lib/auth";

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null);

        if (!body || typeof body !== "object") {
          return json({ error: "Invalid request body" }, 400);
        }

        const email = String(body?.email ?? "")
          .toLowerCase()
          .trim();
        const password = String(body?.password ?? "");

        if (!email || !password) {
          return json({ error: "Email and password are required" }, 400);
        }

        const user = await authenticateAdmin(email, password);

        if (!user) {
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
