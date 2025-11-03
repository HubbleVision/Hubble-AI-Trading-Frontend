import type { z } from "zod";
import type {
  insertAnalysisRecordSchema,
  selectAnalysisRecordSchema,
} from "./schema";

export type AnalysisRecord = z.infer<typeof selectAnalysisRecordSchema>;
export type InsertAnalysisRecord = z.infer<typeof insertAnalysisRecordSchema>;

/**
 * Analysis record with trader information
 */
export interface AnalysisRecordWithTrader extends AnalysisRecord {
  traderName: string | null;
  traderDescription: string | null;
}
