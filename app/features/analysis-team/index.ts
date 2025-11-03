/**
 * Analysis Team Feature
 */

// Types (client-safe)
export type {
  AnalysisRecord,
  AnalysisRecordWithTrader,
  InsertAnalysisRecord,
} from "./database/types";

// API handlers (server-only - import via direct path in routes)
export {
  getAnalysisRecordsByTrader,
  getLatestAnalysisRecords,
  createAnalysisRecord,
} from "./api/handlers";

// Database schemas (server-only - import via @/schema in routes)
export {
  analysisRecords,
  insertAnalysisRecordSchema,
  selectAnalysisRecordSchema,
} from "./database/schema";

// Hooks (client-safe)
export {
  useLatestAnalysis,
  analysisKeys,
  type LatestAnalysisResponse,
} from "./hooks/use-latest-analysis";
