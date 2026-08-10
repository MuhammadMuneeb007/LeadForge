import type { BusinessLead } from "@/types/lead";

export type ContactEnrichmentResult = {
  id: string;
  emails: string[];
  socials: string[];
  phone?: string;
  warning?: string;
};
export interface ContactEnrichmentProvider {
  enrich(leads: BusinessLead[]): Promise<ContactEnrichmentResult[]>;
}
