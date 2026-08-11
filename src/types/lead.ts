export type BusinessLead = {
  id: string;
  source: "openstreetmap" | "overture" | "mock" | "imported" | "manual";
  sourceId: string;
  businessName: string;
  country?: string;
  city?: string;
  category: string;
  address?: string;
  phone?: string;
  website?: string;
  email?: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
  mapsUrl?: string;
  emails: string[];
  socials: string[];
  openingHours?: string;
  osm?: { type: "node" | "way" | "relation"; id: number };
  tags?: Record<string, string>;
  completenessScore?: number;
};

export type SearchInput = {
  countryCode: string;
  cityId: string;
  categories: string[];
  radiusKm: number;
  latitude?: number;
  longitude?: number;
  resultLimit: number;
};

export type SearchWarning = { query: string; message: string };

export type SearchResponse = {
  leads: BusinessLead[];
  warnings: SearchWarning[];
  totalQueries: number;
};
