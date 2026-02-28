import type { NormalizedSeverity } from "../types/report.types";

export const normalizeSeverity = (
  severity: string,
): NormalizedSeverity => {
  const lower = severity.toLowerCase();
  if (lower === "critical" || lower === "high" || lower === "medium" || lower === "low") {
    return lower;
  }
  return "low";
};

export const severityRank: Record<NormalizedSeverity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export const severityScoreMap: Record<NormalizedSeverity, number> = {
  critical: 9.0,
  high: 7.0,
  medium: 5.0,
  low: 3.0,
};
