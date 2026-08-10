import { describe, expect, it } from "vitest";
import { parseAdmin1, parseCities } from "./geonames/parse";
import { resolveCategory } from "./providers/osm/categories";
import { buildOverpassQuery } from "./providers/osm/query-builder";
import { normalizeOsmElement } from "./providers/osm/normalize";
import { haversineKm } from "./geo/distance";
import { deduplicateLeads } from "./search/dedupe";
import { searchSchema } from "./search/validation";
import { leadsToCsv, leadsToGeoJson } from "./csv/export";
import type { BusinessLead } from "@/types/lead";
const lead: BusinessLead = {
  id: "osm-node-1",
  source: "openstreetmap",
  sourceId: "node/1",
  businessName: "=Example",
  category: "electronics",
  latitude: 0,
  longitude: 0,
  emails: [],
  socials: [],
};
describe("open data pipeline", () => {
  it("parses GeoNames records", () => {
    const admin = parseAdmin1("PK.04\tPunjab\tPunjab\t1167710");
    const cities = parseCities(
      "1172451\tLahore\tLahore\t\t31.55\t74.34\tP\tPPLA\tPK\t\t04\t\t\t\t13004135\t\t\tAsia/Karachi\t2024-01-01",
      admin,
    );
    expect(cities[0]).toMatchObject({ name: "Lahore", admin1: "Punjab" });
  });
  it("resolves aliases and rejects query injection", () => {
    expect(resolveCategory("phone shop")?.id).toBe("electronics");
    expect(() =>
      buildOverpassQuery({
        categories: ['electronics\"];out;'],
        latitude: 0,
        longitude: 0,
        radiusKm: 10,
      }),
    ).toThrow();
  });
  it("normalizes nodes and addresses", () => {
    expect(
      normalizeOsmElement(
        {
          type: "node",
          id: 1,
          lat: 1,
          lon: 2,
          tags: { name: "Shop", "addr:street": "Main", phone: "123" },
        },
        {
          countryName: "Pakistan",
          cityName: "Lahore",
          latitude: 1,
          longitude: 2,
          categories: ["electronics"],
        },
      ),
    ).toMatchObject({ businessName: "Shop", address: "Main", phone: "123" });
  });
  it("calculates distance and validates radius", () => {
    expect(haversineKm(0, 0, 0, 1)).toBeGreaterThan(110);
    expect(
      searchSchema.safeParse({
        countryCode: "PK",
        cityId: "1",
        categories: ["electronics"],
        radiusKm: 500,
      }).success,
    ).toBe(false);
  });
  it("deduplicates source identities", () =>
    expect(
      deduplicateLeads([lead, { ...lead, businessName: "Example" }]),
    ).toHaveLength(1));
  it("exports safe CSV and GeoJSON", () => {
    expect(leadsToCsv([lead])).toContain("'=Example");
    expect(leadsToGeoJson([lead]).features[0]?.geometry.coordinates).toEqual([
      0, 0,
    ]);
  });
});
