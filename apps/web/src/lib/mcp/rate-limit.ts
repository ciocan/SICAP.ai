import { sql } from "drizzle-orm";
import { db, mcpRateLimit } from "@/db/schema";

const MINUTE_LIMIT = 60; // calls per minute: stops runaway agent loops
const DAY_LIMIT = 500; // calls per UTC day: stops sustained scraping
const MINUTE_MS = 60_000;
const DAY_MS = 86_400_000;

export class RateLimitError extends Error {
  constructor(window: "minute" | "day") {
    super(
      window === "minute"
        ? `Limită depășită: maxim ${MINUTE_LIMIT} apeluri pe minut. Încetinește ritmul. Pentru limite mai mari folosește https://api.sicap.ai/`
        : `Limită zilnică depășită: maxim ${DAY_LIMIT} apeluri pe zi. Încearcă din nou mâine (UTC). Pentru limite mai mari folosește https://api.sicap.ai/`,
    );
    this.name = "RateLimitError";
  }
}

/**
 * Fixed-window per-user limiter backed by Turso, with a per-minute and a per-day window.
 * Both counters live in `mcp_rate_limit`: the minute row is keyed `${userId}:${minute}`,
 * the day row `${userId}:d:${day}`. Each count is incremented atomically with a single
 * upsert (INSERT ... ON CONFLICT DO UPDATE ... RETURNING) sent in one batch, so parallel
 * tool calls can't race past either limit. Goal is to stop runaway loops and all-day
 * scraping, not exact metering.
 */
export async function enforceRateLimit(userId: string): Promise<void> {
  const now = Date.now();
  const minute = Math.floor(now / MINUTE_MS);
  const day = Math.floor(now / DAY_MS);

  const upsert = (id: string, windowStart: number) =>
    db
      .insert(mcpRateLimit)
      .values({ id, userId, windowStart, count: 1 })
      .onConflictDoUpdate({
        target: mcpRateLimit.id,
        set: { count: sql`${mcpRateLimit.count} + 1` },
      })
      .returning({ count: mcpRateLimit.count });

  const [[minuteRow], [dayRow]] = await db.batch([
    upsert(`${userId}:${minute}`, minute),
    upsert(`${userId}:d:${day}`, day),
  ]);

  if (dayRow && dayRow.count > DAY_LIMIT) {
    throw new RateLimitError("day");
  }
  if (minuteRow && minuteRow.count > MINUTE_LIMIT) {
    throw new RateLimitError("minute");
  }
}
