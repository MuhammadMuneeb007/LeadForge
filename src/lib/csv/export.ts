import type { BusinessLead } from "@/types/lead";
const columns = [
  "business_name",
  "category",
  "city",
  "country",
  "address",
  "phone",
  "website",
  "opening_hours",
  "distance_km",
  "latitude",
  "longitude",
  "osm_url",
  "emails",
  "socials",
  "source",
  "source_id",
] as const;
const quote = (value: unknown) => {
  let text = value === undefined ? "" : String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
};
export function leadsToCsv(leads: BusinessLead[]) {
  return [
    columns.join(","),
    ...leads.map((lead) =>
      [
        lead.businessName,
        lead.category,
        lead.city,
        lead.country,
        lead.address,
        lead.phone,
        lead.website,
        lead.openingHours,
        lead.distanceKm?.toFixed(2),
        lead.latitude,
        lead.longitude,
        lead.mapsUrl,
        (lead.emails ?? []).join("; "),
        (lead.socials ?? []).join("; "),
        lead.source,
        lead.sourceId,
      ]
        .map(quote)
        .join(","),
    ),
  ].join("\r\n");
}
export function leadsToGeoJson(leads: BusinessLead[]) {
  return {
    type: "FeatureCollection",
    features: leads.map(({ longitude, latitude, ...properties }) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [longitude, latitude] },
      properties,
    })),
  };
}
export function downloadCsv(leads: BusinessLead[], filename: string) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(
    new Blob([leadsToCsv(leads)], { type: "text/csv;charset=utf-8" }),
  );
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
