import { Accordion, AccordionItem, Tag } from "@carbon/react";

type Props = {
  name: string;
  severity: "critical" | "high" | "medium" | "low";
};

export const RepositorySection = ({ name, severity }: Props) => {
  return (
    <Accordion>
      <AccordionItem
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <strong>{name}</strong>
            <Tag type="red">{severity}</Tag>
          </div>
        }
      >
        <p>Dependencies will go here</p>
      </AccordionItem>
    </Accordion>
  );
};
