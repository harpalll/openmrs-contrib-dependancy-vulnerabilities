import { Tag } from "@carbon/react";

type Severity = "critical" | "high" | "medium" | "low";

const severityColorMap = {
  critical: "red",
  high: "magenta",
  medium: "warm-gray",
  low: "green",
} as const;

export const SeverityTag = ({ severity }: { severity: Severity }) => {
  return <Tag type={severityColorMap[severity]}>{severity}</Tag>;
};
