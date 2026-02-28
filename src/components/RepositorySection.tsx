import React, { useState } from "react";
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableExpandRow,
  TableExpandedRow,
  TableExpandHeader,
} from "@carbon/react";
import { ChevronDown, ChevronUp } from "@carbon/react/icons";
import type { RepositoryReport } from "../types/report.types";
import { SeverityTag } from "./SeverityTag";
import { CveTable } from "./CveTable";
import { severityRank } from "../utils/severity";
import "./RepositorySection.css";

type Props = {
  report: RepositoryReport;
};

const headers = [
  { key: "name", header: "Dependency" },
  { key: "version", header: "Version" },
  { key: "severity", header: "Severity", isSortable: true },
  { key: "cveCount", header: "CVEs" },
  { key: "exploit", header: "Exploit?" },
  { key: "fixVersion", header: "Fix Version" },
];

export const RepositorySection = ({ report }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const toggle = () => setExpanded((prev) => !prev);

  const rows = report.dependencies.map((dep) => ({
    id: `${dep.name}@${dep.version}`,
    name: dep.name,
    version: dep.version,
    severity: dep.severity,
    cveCount: dep.cves.length,
    exploit: dep.hasExploit ? "Yes" : "-",
    fixVersion: dep.fixVersion ?? "-",
  }));

  const customSortRow = (
    cellA: any,
    cellB: any,
    { sortDirection, sortStates, key }: { sortDirection: string; sortStates: any; key: string }
  ) => {
    if (key === "severity") {
      const rankA = severityRank[cellA as keyof typeof severityRank] ?? 0;
      const rankB = severityRank[cellB as keyof typeof severityRank] ?? 0;
      if (sortDirection === sortStates.DESC) {
        return rankA - rankB;
      }
      return rankB - rankA;
    }
    if (typeof cellA === "number" && typeof cellB === "number") {
      return sortDirection === sortStates.DESC ? cellA - cellB : cellB - cellA;
    }
    if (typeof cellA === "string" && typeof cellB === "string") {
      return sortDirection === sortStates.DESC
        ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    }
    return 0;
  };

  const depMap = new Map(
    report.dependencies.map((dep) => [`${dep.name}@${dep.version}`, dep])
  );

  return (
    <div className="repo-section">
      <div
        className="repo-section__header"
        onClick={toggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") toggle();
        }}
      >
        <div className="repo-section__title">
          <strong className="repo-section__name">{report.name}</strong>
          <SeverityTag severity={report.severity} />
        </div>
        <span className="repo-section__chevron">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </div>

      {expanded && (
        <div className="repo-section__body">
          <DataTable
            rows={rows}
            headers={headers}
            isSortable
            sortRow={customSortRow}
            size="lg"
          >
            {({
              rows: dtRows,
              headers: dtHeaders,
              getHeaderProps,
              getRowProps,
              getExpandHeaderProps,
              getTableProps,
            }) => (
              <TableContainer>
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      <TableExpandHeader {...getExpandHeaderProps()} />
                      {dtHeaders.map((header) => {
                        const headerProps = getHeaderProps({ header });
                        return (
                          <TableHeader key={header.key} {...headerProps}>
                            {header.header}
                          </TableHeader>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dtRows.map((row) => {
                      const dep = depMap.get(row.id);
                      return (
                        <React.Fragment key={row.id}>
                          <TableExpandRow {...getRowProps({ row })}>
                            {row.cells.map((cell) => (
                              <TableCell key={cell.id}>
                                {cell.info.header === "severity" ? (
                                  <SeverityTag severity={cell.value as any} />
                                ) : (
                                  cell.value
                                )}
                              </TableCell>
                            ))}
                          </TableExpandRow>
                          {row.isExpanded && dep && (
                            <TableExpandedRow colSpan={headers.length + 1}>
                              <CveTable cves={dep.cves} />
                            </TableExpandedRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DataTable>
        </div>
      )}
    </div>
  );
};
