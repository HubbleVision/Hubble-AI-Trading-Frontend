import { useQuery } from "@tanstack/react-query";
import type { AnalysisRecordWithTrader } from "../database/types";

/**
 * Query keys for analysis records
 */
export const analysisKeys = {
  all: ["analysis-records"] as const,
  latest: () => [...analysisKeys.all, "latest"] as const,
  latestByTrader: (traderId: string) => [...analysisKeys.all, "latest", traderId] as const,
};

/**
 * API response structure for latest analysis records
 */
export interface LatestAnalysisResponse {
  success: boolean;
  data?: AnalysisRecordWithTrader[];
  error?: string;
  message?: string;
}

/**
 * Fetch latest analysis records from API
 */
async function fetchLatestAnalysisRecords(params: {
  traderId?: string;
  limit?: number;
}): Promise<AnalysisRecordWithTrader[]> {
  const { traderId, limit = 20 } = params;

  const searchParams = new URLSearchParams();
  if (traderId) searchParams.set("traderId", traderId);
  if (limit) searchParams.set("limit", limit.toString());

  const url = `/api/v1/analysis-records?${searchParams.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch latest analysis records: ${response.statusText}`);
  }

  const result: LatestAnalysisResponse = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to fetch latest analysis records");
  }

  return result.data;
}

/**
 * Hook to fetch latest analysis records
 *
 * @param options - Query options
 * @returns Query result with latest analysis records
 */
export function useLatestAnalysis(options?: {
  traderId?: string;
  limit?: number;
  enabled?: boolean;
  refetchInterval?: number;
}) {
  const {
    traderId,
    limit = 20,
    enabled = true,
    refetchInterval = 1000 * 60, // Default: 1 minute
  } = options || {};

  return useQuery({
    queryKey: traderId ? analysisKeys.latestByTrader(traderId) : analysisKeys.latest(),
    queryFn: () => fetchLatestAnalysisRecords({ traderId, limit }),
    enabled,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval,
  });
}
