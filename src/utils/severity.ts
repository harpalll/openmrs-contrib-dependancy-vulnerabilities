import type { Cve } from "../types/report.types";

export const normalizeSeverity = (
  severity: string,
): "critical" | "high" | "medium" | "low" => {
  return severity.toLowerCase() as "critical" | "high" | "medium" | "low";
};

export function getHighestSeverity(cves: Cve[]) {
  const severityRank = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  return cves.reduce((highest, current) => {
    return severityRank[current.severity] > severityRank[highest]
      ? current.severity
      : highest;
  }, cves[0]?.severity ?? "low");
}
