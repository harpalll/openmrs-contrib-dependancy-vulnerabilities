import type {
  Cve,
  Dependency,
  NormalizedSeverity,
} from "../types/report.types";

export const severityScoreMap: Record<NormalizedSeverity, number> = {
  critical: 9,
  high: 7,
  medium: 5,
  low: 3,
};

export const severityRank: Record<NormalizedSeverity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export const getHighestSeverity = (cves: Cve[]): NormalizedSeverity => {
  return cves.reduce(
    (highest, current) =>
      severityRank[current.severity] > severityRank[highest]
        ? current.severity
        : highest,
    cves[0]?.severity ?? "low",
  );
};

export const getHighestScore = (cves: Cve[]) => {
  return Math.max(...cves.map((c) => c.score), 0);
};

export const getRepoHighestSeverity = (deps: Dependency[]) => {
  const allCves = deps.flatMap((d) => d.cves);
  return getHighestSeverity(allCves);
};

export type DependencySort = "severity" | "score" | "name";

export const sortDependencies = (
  deps: Dependency[],
  sortBy: DependencySort,
): Dependency[] => {
  return [...deps].sort((a, b) => {
    if (sortBy === "severity") {
      return (
        severityRank[getHighestSeverity(b.cves)] -
        severityRank[getHighestSeverity(a.cves)]
      );
    }

    if (sortBy === "score") {
      return getHighestScore(b.cves) - getHighestScore(a.cves);
    }

    return a.name.localeCompare(b.name);
  });
};

