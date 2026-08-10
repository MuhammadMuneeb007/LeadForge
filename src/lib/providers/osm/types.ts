export type OsmTagFilter = { key: string; value?: string; values?: string[] };
export type BusinessCategoryDefinition = {
  id: string;
  label: string;
  aliases: string[];
  filters: OsmTagFilter[];
};
export type OsmElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat?: number; lon?: number };
  tags?: Record<string, string>;
};
export type OverpassResponse = { elements?: OsmElement[] };
