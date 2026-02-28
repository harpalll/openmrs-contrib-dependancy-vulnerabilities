import type { NormalizedSeverity } from "../types/report.types";
import "./SeverityTag.css";

const severityLabelMap: Record<NormalizedSeverity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const SeverityTag = ({ severity }: { severity: NormalizedSeverity }) => {
  return (
    <span className={`severity-tag severity-tag--${severity}`}>
      {severityLabelMap[severity]}
    </span>
  );
};
