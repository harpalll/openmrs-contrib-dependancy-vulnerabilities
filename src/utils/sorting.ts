import type { NormalizedSeverity } from "../types/report.types";

export const severityScoreMap: Record<NormalizedSeverity, number> = {
  critical: 9,
  high: 7,
  medium: 5,
  low: 3,
};
