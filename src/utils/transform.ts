import type {
  RawReport,
  RepositoryReport,
  Dependency,
  Cve,
} from "../types/report.types";
import { normalizeSeverity, severityScoreMap } from "./severity";
import { getHighestSeverity, getHighestScore, sortDependencies, sortCves } from "./sorting";

import openmrsCoreData from "../../data/openmrs-core.json";
import openmrsModuleBillingData from "../../data/openmrs-module-billing.json";
import openmrsModuleIdgenData from "../../data/openmrs-module-idgen.json";

export const transformReport = (
  raw: RawReport,
  repoName: string,
): RepositoryReport => {
  const dependencyMap = new Map<string, Dependency>();

  raw.vulnerabilities.forEach((vuln) => {
    const depName = vuln.location.dependency.package.name;
    const version = vuln.location.dependency.version;
    const key = `${depName}@${version}`;

    if (!dependencyMap.has(key)) {
      dependencyMap.set(key, {
        name: depName,
        version,
        severity: "low",
        cves: [],
        hasExploit: false,
      });
    }

    const hasExploit = vuln.links?.some(
      (link) => link.name?.includes("EXPLOIT"),
    ) ?? false;

    const normalized = normalizeSeverity(vuln.severity);

    const nvdUrl = vuln.identifiers?.find((id) => id.type === "NVD")?.url;

    const cve: Cve = {
      id: vuln.id,
      severity: normalized,
      score: severityScoreMap[normalized],
      description: vuln.description,
      exploit: hasExploit,
      url: nvdUrl,
    };

    const dep = dependencyMap.get(key)!;

    const alreadyExists = dep.cves.some((c) => c.id === cve.id);
    if (!alreadyExists) {
      dep.cves.push(cve);
    }

    if (hasExploit) {
      dep.hasExploit = true;
    }
  });

  const dependencies: Dependency[] = Array.from(dependencyMap.values()).map((dep) => ({
    ...dep,
    severity: getHighestSeverity(dep.cves),
    cves: sortCves(dep.cves),
  }));

  const sortedDeps = sortDependencies(dependencies);

  const allCves = sortedDeps.flatMap((d) => d.cves);
  const repoSeverity = getHighestSeverity(allCves);
  const repoHighestScore = getHighestScore(allCves);

  return {
    name: repoName,
    severity: repoSeverity,
    highestScore: repoHighestScore,
    dependencies: sortedDeps,
  };
};

export const allReports: RepositoryReport[] = [
  transformReport(openmrsCoreData as unknown as RawReport, "openmrs-core"),
  transformReport(openmrsModuleBillingData as unknown as RawReport, "openmrs-module-billing"),
  transformReport(openmrsModuleIdgenData as unknown as RawReport, "openmrs-module-idgen"),
];
