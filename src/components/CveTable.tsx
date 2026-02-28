import type { Cve } from "../types/report.types";
import { SeverityTag } from "./SeverityTag";
import "./CveTable.css";

type Props = {
  cves: Cve[];
};

export const CveTable = ({ cves }: Props) => {
  return (
    <div className="cve-table-wrapper">
      <table className="cve-table">
        <thead>
          <tr>
            <th>CVE ID</th>
            <th>Severity</th>
            <th>Score</th>
            <th>Description</th>
            <th>Affected Versions</th>
            <th>Fixed In</th>
            <th>CWE</th>
          </tr>
        </thead>
        <tbody>
          {cves.map((cve) => (
            <tr key={cve.id}>
              <td>
                {cve.url ? (
                  <a
                    href={cve.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cve-link"
                  >
                    {cve.id}
                  </a>
                ) : (
                  cve.id
                )}
              </td>
              <td>
                <SeverityTag severity={cve.severity} />
              </td>
              <td>{cve.score}/10</td>
              <td className="cve-description">{cve.description}</td>
              <td>{cve.affectedVersions ?? "-"}</td>
              <td>{cve.fixedIn ?? "-"}</td>
              <td>{cve.cwe ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
