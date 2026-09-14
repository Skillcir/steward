import { PrismaNeonHTTP } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Neon's HTTP driver talks over HTTPS instead of raw Postgres (port 5432),
// which some networks block outright. The app never uses interactive
// transactions, so the HTTP adapter's lack of persistent connections is fine.
const adapter = new PrismaNeonHTTP(process.env.DATABASE_URL!, {});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
