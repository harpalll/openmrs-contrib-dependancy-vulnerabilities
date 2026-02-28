import type {
  Cve,
  Dependency,
  NormalizedSeverity,
  RepositoryReport,
} from "../types/report.types";
import { severityRank } from "./severity";

export const sortCves = (cves: Cve[]): Cve[] => {
  return [...cves].sort((a, b) => b.score - a.score);
};

export const getHighestSeverity = (cves: Cve[]): NormalizedSeverity => {
  if (cves.length === 0) return "low";
  return cves.reduce<NormalizedSeverity>(
    (highest, current) =>
      severityRank[current.severity] > severityRank[highest]
        ? current.severity
        : highest,
    cves[0].severity,
  );
};

export const getHighestScore = (cves: Cve[]): number => {
  if (cves.length === 0) return 0;
  return Math.max(...cves.map((c) => c.score));
};

export const sortDependencies = (deps: Dependency[]): Dependency[] => {
  return [...deps].sort((a, b) => {
    const sevDiff = severityRank[b.severity] - severityRank[a.severity];
    if (sevDiff !== 0) return sevDiff;

    const scoreA = getHighestScore(a.cves);
    const scoreB = getHighestScore(b.cves);
    if (scoreB !== scoreA) return scoreB - scoreA;

    return a.name.localeCompare(b.name);
  });
};

export const sortRepositories = (
  repos: RepositoryReport[],
): RepositoryReport[] => {
  return [...repos].sort((a, b) => {
    const sevDiff = severityRank[b.severity] - severityRank[a.severity];
    if (sevDiff !== 0) return sevDiff;

    if (b.highestScore !== a.highestScore) return b.highestScore - a.highestScore;

    return a.name.localeCompare(b.name);
  });
};
