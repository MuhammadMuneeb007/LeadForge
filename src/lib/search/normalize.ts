import { createHash } from "node:crypto";
import type { BusinessLead } from "@/types/lead";
export const text = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;
export function stableLeadId(
  lead: Pick<
    BusinessLead,
    "sourceId" | "source" | "businessName" | "address" | "phone"
  >,
) {
  if (lead.sourceId) return `${lead.source}:${lead.sourceId}`;
  const raw = [lead.businessName, lead.address, lead.phone]
    .map((item) => item?.trim().toLowerCase() ?? "")
    .join("|");
  return createHash("sha256").update(raw).digest("hex").slice(0, 24);
}
