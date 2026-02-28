export type RawSeverity = "Critical" | "High" | "Medium" | "Low";

export type Identifier = {
  type: string;
  name: string;
  value: string;
  url?: string;
};

export interface RawVulnerability {
  id: string;
  name: string;
  description: string;
  severity: RawSeverity;
  identifiers: Identifier[];
  location: {
    file: string;
    dependency: {
      package: {
        name: string;
      };
      version: string;
    };
  };
  links?: {
    name?: string;
    url: string;
  }[];
}

export type Scan = {
  scanner: {
    id: string;
    name: string;
    version: string;
    vendor: {
      name: string;
    };
    url: string;
  };
  analyzer: {
    id: string;
    name: string;
    version: string;
    vendor: {
      name: string;
    };
    url: string;
  };

  end_time: string;
  start_time: string;
  status: string;
  type: string;
};

export interface RawReport {
  version: string;
  schema: string;
  scan: Scan;
  vulnerabilities: RawVulnerability[];
  dependency_files: {
    path: string;
    package_manager: string;
    dependencies: {
      package: {
        name: string;
      };
      version: string;
    }[];
  }[];
  remediations: [];
}

export type NormalizedSeverity = "critical" | "high" | "medium" | "low";

export interface Cve {
  id: string;
  severity: NormalizedSeverity;
  score: number;
  description: string;
  exploit: boolean;
  url?: string;
  affectedVersions?: string;
  fixedIn?: string;
  cwe?: string;
}

export interface Dependency {
  name: string;
  version: string;
  severity: NormalizedSeverity;
  cves: Cve[];
  fixVersion?: string;
  hasExploit: boolean;
}

export interface RepositoryReport {
  name: string;
  severity: NormalizedSeverity;
  highestScore: number;
  dependencies: Dependency[];
}
