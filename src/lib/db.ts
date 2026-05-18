// Database client for Malaysia Open Data Command Center
// Note: Prisma with SQLite is NOT compatible with Cloudflare Workers edge runtime.
// This module provides a safe fallback for edge deployments.
// When D1 binding is configured in wrangler.toml, replace this with @prisma/adapter-d1.

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Only initialize PrismaClient in Node.js runtime (dev/local)
// On edge runtime (Cloudflare Workers), this will be null
function createPrismaClient(): PrismaClient | null {
  try {
    // Check if we're in a Node.js environment
    if (typeof process !== 'undefined' && process.env?.DATABASE_URL) {
      return globalForPrisma.prisma ?? new PrismaClient({ log: ['query'] });
    }
  } catch {
    // Edge runtime - PrismaClient not available
  }
  return null;
}

export const db = createPrismaClient();

if (db && process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
