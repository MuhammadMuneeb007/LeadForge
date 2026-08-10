import type { BusinessLead } from "@/types/lead";
const clean = (value?: string) =>
  value?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "";
const host = (value?: string) => {
  try {
    return new URL(value ?? "").hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};
const keys = (lead: BusinessLead) =>
  [
    `source:${lead.source}:${lead.sourceId}`,
    clean(lead.businessName) &&
      clean(lead.address) &&
      `address:${clean(lead.businessName)}:${clean(lead.address)}`,
    clean(lead.businessName) &&
      host(lead.website) &&
      `site:${clean(lead.businessName)}:${host(lead.website)}`,
  ].filter(Boolean) as string[];
export function mergeLeads(a: BusinessLead, b: BusinessLead): BusinessLead {
  return {
    ...b,
    ...a,
    address: a.address ?? b.address,
    phone: a.phone ?? b.phone,
    website: a.website ?? b.website,
    email: a.email ?? b.email,
    openingHours: a.openingHours ?? b.openingHours,
    emails: [...new Set([...a.emails, ...b.emails])],
    socials: [...new Set([...a.socials, ...b.socials])],
    tags: { ...b.tags, ...a.tags },
  };
}
export function deduplicateLeads(leads: BusinessLead[]) {
  const out: BusinessLead[] = [];
  const index = new Map<string, number>();
  for (const lead of leads) {
    const match = keys(lead)
      .map((key) => index.get(key))
      .find((value) => value !== undefined);
    if (match === undefined) {
      const i = out.push(lead) - 1;
      keys(lead).forEach((key) => index.set(key, i));
    } else {
      out[match] = mergeLeads(out[match]!, lead);
      keys(out[match]!).forEach((key) => index.set(key, match));
    }
  }
  return out;
}
