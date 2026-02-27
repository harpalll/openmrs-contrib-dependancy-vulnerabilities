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
}

export interface Dependency {
  name: string;
  version: string;
  cves: Cve[];
}

export interface RepositoryReport {
  name: string;
  schema?: string;
  dependencies: Dependency[];
}
