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

import depCheckCore from "../../data/dependency-reports/dependency-check-report-openmrs-core.json";
import depCheckBilling from "../../data/dependency-reports/dependency-check-report-openmrs-module-billing.json";
import depCheckIdgen from "../../data/dependency-reports/dependency-check-report-openmrs-moduel-idgen.json";

/* ── Enrichment types for the dependency-check-report format ── */
interface DepCheckVulnSoftware {
  software: {
    id: string;
    vulnerabilityIdMatched?: string;
    versionStartIncluding?: string;
    versionEndExcluding?: string;
    versionEndIncluding?: string;
  };
}

interface DepCheckVuln {
  name: string;
  cwes?: string[];
  cvssv3?: { baseScore: number };
  cvssv2?: { score: number };
  vulnerableSoftware?: DepCheckVulnSoftware[];
}

interface DepCheckDependency {
  vulnerabilities?: DepCheckVuln[];
}

interface DepCheckReport {
  dependencies?: DepCheckDependency[];
}

/* ── Build enrichment map from all three dep-check reports ── */
interface CveEnrichment {
  cwe: string;
  affectedVersions: string;
  fixedIn: string;
  score: number;
}

const buildVersionRange = (sw: DepCheckVulnSoftware["software"]): string => {
  const parts: string[] = [];
  if (sw.versionStartIncluding) parts.push(`≥${sw.versionStartIncluding}`);
  if (sw.versionEndExcluding) parts.push(`<${sw.versionEndExcluding}`);
  if (sw.versionEndIncluding) parts.push(`≤${sw.versionEndIncluding}`);
  return parts.length ? parts.join(" & ") : "";
};

const buildEnrichmentMap = (
  ...reports: DepCheckReport[]
): Map<string, CveEnrichment> => {
  const map = new Map<string, CveEnrichment>();

  for (const report of reports) {
    for (const dep of report.dependencies ?? []) {
      for (const vuln of dep.vulnerabilities ?? []) {
        if (map.has(vuln.name)) continue; // first occurrence wins

        const cwe =
          vuln.cwes
            ?.filter((c) => c !== "NVD-CWE-noinfo" && c !== "NVD-CWE-Other")
            .join(", ") || "";

        /* Pick only the matched entry (the one that actually applies to this
           dependency) instead of listing every affected product range. */
        const matchedSw =
          vuln.vulnerableSoftware?.find(
            (vs) => vs.software.vulnerabilityIdMatched === "true",
          ) ?? vuln.vulnerableSoftware?.[0];

        const affectedVersions = matchedSw
          ? buildVersionRange(matchedSw.software)
          : "";

        const fixedIn = matchedSw?.software.versionEndExcluding ?? "";

        const score =
          vuln.cvssv3?.baseScore ?? vuln.cvssv2?.score ?? 0;

        map.set(vuln.name, { cwe, affectedVersions, fixedIn, score });
      }
    }
  }
  return map;
};

const enrichmentMap = buildEnrichmentMap(
  depCheckCore as unknown as DepCheckReport,
  depCheckBilling as unknown as DepCheckReport,
  depCheckIdgen as unknown as DepCheckReport,
);

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

    const nvdIdentifier = vuln.identifiers?.find((id) => id.type === "NVD");
    const npmIdentifier = vuln.identifiers?.find((id) => id.type === "NPM");
    const cveUrl = nvdIdentifier?.url ?? npmIdentifier?.url;

    const enrichment = enrichmentMap.get(vuln.id);

    const cve: Cve = {
      id: vuln.id,
      severity: normalized,
      score: enrichment?.score || severityScoreMap[normalized],
      description: vuln.description,
      exploit: hasExploit,
      url: cveUrl,
      affectedVersions: enrichment?.affectedVersions || undefined,
      fixedIn: enrichment?.fixedIn || undefined,
      cwe: enrichment?.cwe || undefined,
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
