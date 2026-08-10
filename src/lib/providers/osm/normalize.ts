import type { BusinessLead } from "@/types/lead";
import { haversineKm } from "@/lib/geo/distance";
import { resolveCategory } from "./categories";
import type { OsmElement } from "./types";

const first = (tags: Record<string, string>, keys: string[]) =>
  keys.map((key) => tags[key]).find(Boolean);
const url = (value?: string) => {
  if (!value) return undefined;
  try {
    return new URL(
      /^https?:\/\//i.test(value) ? value : `https://${value}`,
    ).toString();
  } catch {
    return undefined;
  }
};
const address = (t: Record<string, string>) =>
  t["addr:full"] ||
  [
    t["addr:housenumber"],
    t["addr:street"],
    t["addr:suburb"],
    t["addr:city"],
    t["addr:state"],
    t["addr:postcode"],
    t["addr:country"],
  ]
    .filter(Boolean)
    .join(", ") ||
  undefined;
export function normalizeOsmElement(
  element: OsmElement,
  input: {
    countryName: string;
    cityName: string;
    latitude: number;
    longitude: number;
    categories: string[];
  },
): BusinessLead | undefined {
  const tags = element.tags ?? {};
  const latitude = element.lat ?? element.center?.lat;
  const longitude = element.lon ?? element.center?.lon;
  if (latitude === undefined || longitude === undefined) return;
  const businessName = first(tags, ["name", "brand", "operator"]);
  if (!businessName) return;
  const category =
    input.categories.find((id) =>
      resolveCategory(id)?.filters.some((f) =>
        (f.values ?? [f.value]).includes(tags[f.key]),
      ),
    ) ?? input.categories[0]!;
  const website = url(first(tags, ["contact:website", "website", "url"]));
  const email = first(tags, ["contact:email", "email"]);
  const socials = Object.entries(tags)
    .filter(([key]) =>
      /^(contact:)?(facebook|instagram|linkedin|twitter|x|youtube)$/.test(key),
    )
    .map(([, value]) => url(value) ?? value);
  return {
    id: `osm-${element.type}-${element.id}`,
    source: "openstreetmap",
    sourceId: `${element.type}/${element.id}`,
    businessName,
    country: input.countryName,
    city: input.cityName,
    category,
    address: address(tags),
    phone: first(tags, ["contact:phone", "phone", "contact:mobile", "mobile"]),
    website,
    email,
    emails: email ? [email.toLowerCase()] : [],
    socials,
    openingHours: tags.opening_hours,
    latitude,
    longitude,
    distanceKm: haversineKm(
      input.latitude,
      input.longitude,
      latitude,
      longitude,
    ),
    mapsUrl: `https://www.openstreetmap.org/${element.type}/${element.id}`,
    osm: { type: element.type, id: element.id },
    tags,
  };
}
