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

        let user;
        try {
          user = await authenticateAdmin(email, password);
        } catch (error) {
          // This will fire if JWT_SECRET is missing in production
          console.error("[auth] Login error:", error instanceof Error ? error.message : error);
          return json(
            {
              error:
                process.env.NODE_ENV !== "production"
                  ? `Server error: ${error instanceof Error ? error.message : "unknown"}`
                  : "Server configuration error. Contact the administrator.",
            },
            500,
          );
        }

        if (!user) {
          console.log("[auth] Login rejected for:", email);
          return json({ error: "Invalid credentials" }, 401);
        }

        console.log("[auth] Login accepted for:", user.email);

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
