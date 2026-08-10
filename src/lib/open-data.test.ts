import { describe, expect, it } from "vitest";
import { parseAdmin1, parseCities } from "./geonames/parse";
import { resolveCategory } from "./providers/osm/categories";
import { buildOverpassQuery } from "./providers/osm/query-builder";
import { normalizeOsmElement } from "./providers/osm/normalize";
import { haversineKm } from "./geo/distance";
import { deduplicateLeads } from "./search/dedupe";
import { searchSchema } from "./search/validation";
import { leadsToCsv, leadsToGeoJson } from "./csv/export";
import { searchCities } from "./cities";
import { isForbiddenAddress, assertPublicUrl } from "./contacts/ssrf";
import { extractContactsFromHtml } from "./contacts/website";
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
  it("searches cities locally, ranks matches, and filters by country", () => {
    expect(searchCities("brisbane", "AU")[0]).toMatchObject({
      name: "Brisbane",
      countryCode: "AU",
    });
    expect(searchCities("lahore", "AU")).toEqual([]);
    expect(searchCities("lahore", "PK")[0]?.countryCode).toBe("PK");
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
  it.each([
    ["way", { center: { lat: 1.1, lon: 2.1 } }],
    ["relation", { center: { lat: 1.2, lon: 2.2 } }],
  ] as const)("normalizes %s center coordinates", (type, coordinates) => {
    expect(
      normalizeOsmElement(
        { type, id: 2, ...coordinates, tags: { name: "Centre" } },
        {
          countryName: "Australia",
          cityName: "Brisbane",
          latitude: 1,
          longitude: 2,
          categories: ["electronics"],
        },
      ),
    ).toMatchObject({
      latitude: coordinates.center.lat,
      longitude: coordinates.center.lon,
    });
  });
  it("extracts contact tags, social tags, and composed addresses", () => {
    expect(
      normalizeOsmElement(
        {
          type: "node",
          id: 3,
          lat: 1,
          lon: 2,
          tags: {
            name: "Contact Shop",
            "contact:email": "HELLO@EXAMPLE.COM",
            "contact:instagram": "https://instagram.com/example",
            "addr:housenumber": "10",
            "addr:street": "Queen Street",
            "addr:city": "Brisbane",
          },
        },
        {
          countryName: "Australia",
          cityName: "Brisbane",
          latitude: 1,
          longitude: 2,
          categories: ["electronics"],
        },
      ),
    ).toMatchObject({
      address: "10, Queen Street, Brisbane",
      email: "HELLO@EXAMPLE.COM",
      emails: ["hello@example.com"],
      socials: ["https://instagram.com/example"],
    });
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
  it("enforces category count, result, and strict input limits", () => {
    const base = {
      countryCode: "AU",
      cityId: "2174003",
      categories: ["electronics"],
      radiusKm: 10,
      resultLimit: 100,
    };
    expect(searchSchema.safeParse(base).success).toBe(true);
    expect(
      searchSchema.safeParse({
        ...base,
        categories: ["electronics", "dentist", "restaurant", "cafe"],
      }).success,
    ).toBe(false);
    expect(searchSchema.safeParse({ ...base, resultLimit: 201 }).success).toBe(
      false,
    );
    expect(searchSchema.safeParse({ ...base, unexpected: true }).success).toBe(
      false,
    );
  });
  it("deduplicates source identities", () =>
    expect(
      deduplicateLeads([lead, { ...lead, businessName: "Example" }]),
    ).toHaveLength(1));
  it("merges likely duplicates by name and website, not name alone", () => {
    const first = {
      ...lead,
      id: "a",
      sourceId: "node/1",
      businessName: "Example Store",
    };
    const sameSite = {
      ...lead,
      id: "b",
      sourceId: "node/2",
      businessName: "Example Store",
      website: "https://example.com",
    };
    const withSite = { ...first, website: "https://www.example.com" };
    expect(deduplicateLeads([withSite, sameSite])).toHaveLength(1);
    expect(
      deduplicateLeads([first, { ...sameSite, website: undefined }]),
    ).toHaveLength(2);
  });
  it("exports safe CSV and GeoJSON", () => {
    expect(leadsToCsv([lead])).toContain("'=Example");
    expect(leadsToGeoJson([lead]).features[0]?.geometry.coordinates).toEqual([
      0, 0,
    ]);
    expect(leadsToCsv([{ ...lead, address: 'A "quoted", address' }])).toContain(
      '"A ""quoted"", address"',
    );
    expect(
      leadsToGeoJson([{ ...lead, tags: { secret: "not-exported" } }])
        .features[0]?.properties,
    ).not.toHaveProperty("tags");
  });
  it("rejects local, private, credentialed, and unsupported website URLs", async () => {
    for (const address of [
      "127.0.0.1",
      "10.0.0.1",
      "172.16.0.1",
      "192.168.1.1",
      "169.254.169.254",
      "::1",
      "fd00::1",
    ]) {
      expect(isForbiddenAddress(address)).toBe(true);
    }
    await expect(assertPublicUrl("http://127.0.0.1")).rejects.toThrow();
    await expect(assertPublicUrl("file:///etc/passwd")).rejects.toThrow();
    await expect(
      assertPublicUrl("https://user:pass@example.com"),
    ).rejects.toThrow();
  });
  it("extracts visible, mailto, and social contacts from HTML", () => {
    const contacts = extractContactsFromHtml(
      '<p>Sales@Example.com</p><a href="mailto:hello@example.com?subject=Hi">Email</a><a href="tel:+61 7 3000 0000">Call</a><a href="https://www.instagram.com/example">Instagram</a><a href="/contact">Contact</a>',
      new URL("https://example.com"),
    );
    expect(contacts.emails).toEqual(
      expect.arrayContaining(["sales@example.com", "hello@example.com"]),
    );
    expect(contacts.socials).toEqual(["https://www.instagram.com/example"]);
    expect(contacts.phones).toEqual(["+61 7 3000 0000"]);
  });
});
