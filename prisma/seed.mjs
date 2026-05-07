import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function databaseConfigError() {
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

async function main() {
  const databaseError = databaseConfigError();
  if (databaseError) {
    console.log(`Skipping admin seed: ${databaseError}`);
    return;
  }

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("Skipping admin seed: set ADMIN_EMAIL and ADMIN_PASSWORD first.");
    return;
  }

  await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: {
      passwordHash: await bcrypt.hash(password, 12),
      role: "ADMIN",
    },
    create: {
      email: email.toLowerCase(),
      name: "Salma Hani",
      passwordHash: await bcrypt.hash(password, 12),
      role: "ADMIN",
    },
  });

  console.log(`Admin user ready: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
