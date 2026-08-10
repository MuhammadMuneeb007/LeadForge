import { openDB } from "idb";
import type { BusinessLead, SearchInput } from "@/types/lead";
export type HistoryEntry = {
  id: string;
  createdAt: string;
  input: SearchInput;
  leads: BusinessLead[];
};
const database = () =>
  openDB("leadforge", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("state")) db.createObjectStore("state");
    },
  });
const normalizeLead = (lead: BusinessLead): BusinessLead => ({
  ...lead,
  emails: Array.isArray(lead.emails) ? lead.emails : [],
  socials: Array.isArray(lead.socials) ? lead.socials : [],
  sourceId: lead.sourceId ?? lead.id,
  latitude: Number.isFinite(lead.latitude) ? lead.latitude : 0,
  longitude: Number.isFinite(lead.longitude) ? lead.longitude : 0,
});
export async function readHistory(): Promise<HistoryEntry[]> {
  const stored = (await (await database()).get("state", "history")) ?? [];
  if (!Array.isArray(stored)) return [];
  return stored.slice(0, 5).map((entry: HistoryEntry) => ({
    ...entry,
    leads: Array.isArray(entry.leads) ? entry.leads.map(normalizeLead) : [],
  }));
}
export async function saveHistory(entry: HistoryEntry) {
  const db = await database();
  const history = await readHistory();
  await db.put(
    "state",
    [entry, ...history.filter((item) => item.id !== entry.id)].slice(0, 5),
    "history",
  );
}
export async function readSelected(): Promise<BusinessLead[]> {
  const stored = (await (await database()).get("state", "selected")) ?? [];
  return Array.isArray(stored) ? stored.slice(0, 200).map(normalizeLead) : [];
}
export async function saveSelected(leads: BusinessLead[]) {
  await (await database()).put("state", leads.slice(0, 200), "selected");
}
export async function clearLocalData() {
  await (await database()).clear("state");
}
