import { desc, eq } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type * as schema from "@/schema";
import { analysisRecords } from "../database/schema";
import { traders } from "~/features/traders/database/schema";

/**
 * Get analysis records for specified trader
 * Sorted by time from newest to oldest
 */
export async function getAnalysisRecordsByTrader(
  db: DrizzleD1Database<typeof schema>,
  traderId: string,
  options?: {
    limit?: number;
    offset?: number;
  }
) {
  const { limit = 50, offset = 0 } = options || {};

  const records = await db
    .select({
      id: analysisRecords.id,
      role: analysisRecords.role,
      chat: analysisRecords.chat,
      jsonValue: analysisRecords.jsonValue,
      createdAt: analysisRecords.createdAt,
    })
    .from(analysisRecords)
    .where(eq(analysisRecords.traderId, traderId))
    .orderBy(desc(analysisRecords.createdAt))
    .limit(limit)
    .offset(offset);

  return records;
}

/**
 * Get latest analysis records
 * Sorted by time from newest to oldest, can filter by specific trader
 */
export async function getLatestAnalysisRecords(
  db: DrizzleD1Database<typeof schema>,
  params: {
    traderId?: string;
    limit?: number;
  } = {}
) {
  const { traderId, limit = 20 } = params;

  let query = db
    .select({
      // Analysis record fields
      id: analysisRecords.id,
      traderId: analysisRecords.traderId,
      role: analysisRecords.role,
      chat: analysisRecords.chat,
      jsonValue: analysisRecords.jsonValue,
      recordId: analysisRecords.recordId,
      orderId: analysisRecords.orderId,
      createdAt: analysisRecords.createdAt,
      updatedAt: analysisRecords.updatedAt,
      // Trader fields
      traderName: traders.name,
      traderDescription: traders.description,
    })
    .from(analysisRecords)
    .leftJoin(traders, eq(analysisRecords.traderId, traders.id));

  if (traderId) {
    query = query.where(eq(analysisRecords.traderId, traderId)) as any;
  }

  const records = await query.orderBy(desc(analysisRecords.createdAt)).limit(limit);

  return records;
}

/**
 * Create new analysis record
 */
export async function createAnalysisRecord(
  db: DrizzleD1Database<typeof schema>,
  data: {
    traderId: string;
    role: string;
    chat: string;
    jsonValue?: string;
    recordId?: string;
    createdAt?: string;
  }
) {
  const [record] = await db
    .insert(analysisRecords)
    .values({
      traderId: data.traderId,
      role: data.role,
      chat: data.chat,
      jsonValue: data.jsonValue,
      recordId: data.recordId,
      createdAt: data.createdAt,
    })
    .returning();

  return record;
}
