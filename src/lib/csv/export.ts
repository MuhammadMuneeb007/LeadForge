import type { BusinessLead } from "@/types/lead";
const columns = [
  "business_name",
  "category",
  "city",
  "country",
  "address",
  "phone",
  "email",
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
        lead.email,
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
    features: leads.map((lead) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lead.longitude, lead.latitude],
      },
      properties: {
        id: lead.id,
        business_name: lead.businessName,
        category: lead.category,
        city: lead.city,
        country: lead.country,
        address: lead.address,
        phone: lead.phone,
        email: lead.email,
        emails: lead.emails,
        website: lead.website,
        socials: lead.socials,
        opening_hours: lead.openingHours,
        distance_km: lead.distanceKm,
        source: lead.source,
        source_id: lead.sourceId,
      },
    })),
  };
}
export function downloadCsv(leads: BusinessLead[], filename: string) {
  downloadBlob(leadsToCsv(leads), filename, "text/csv;charset=utf-8");
}
function downloadBlob(contents: string, filename: string, type: string) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([contents], { type }));
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
export function downloadGeoJson(leads: BusinessLead[], filename: string) {
  downloadBlob(
    JSON.stringify(leadsToGeoJson(leads), null, 2),
    filename,
    "application/geo+json;charset=utf-8",
  );
}
