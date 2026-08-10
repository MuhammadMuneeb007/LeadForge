import type { BusinessLead } from "@/types/lead";
export function completenessScore(lead: BusinessLead) {
  return Math.min(
    100,
    20 +
      (lead.address ? 15 : 0) +
      (lead.phone ? 20 : 0) +
      (lead.website ? 20 : 0) +
      (lead.emails?.length ? 15 : 0) +
      (lead.openingHours ? 5 : 0) +
      (lead.latitude && lead.longitude ? 5 : 0),
  );
}
export const scoreLeads = (leads: BusinessLead[]) =>
  leads.map((lead) => ({
    ...lead,
    completenessScore: completenessScore(lead),
  }));
