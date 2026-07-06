import "server-only"

import { Pool } from "pg"

declare global {
  // eslint-disable-next-line no-var
  var __reviewsPgPool: Pool | undefined
}

function getReviewsDatabaseUrl() {
  const connectionString =
    process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error(
      "Missing SUPABASE_DB_URL or DATABASE_URL for product reviews"
    )
  }

  // Transaction pooler (6543) supports many short-lived connections;
  // session pooler (5432) is shared with Medusa and caps at ~15 clients.
  if (connectionString.includes(":5432/")) {
    return connectionString.replace(":5432/", ":6543/")
  }

  return connectionString
}

export function getPgPool() {
  if (!global.__reviewsPgPool) {
    global.__reviewsPgPool = new Pool({
      connectionString: getReviewsDatabaseUrl(),
      ssl: { rejectUnauthorized: false },
      max: 1,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
      allowExitOnIdle: true,
    })
  }

  return global.__reviewsPgPool
}
