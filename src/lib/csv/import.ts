import type { BusinessLead } from "@/types/lead";
function row(line: string) {
  const values: string[] = [];
  let value = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        value += '"';
        i++;
      } else quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(value);
      value = "";
    } else value += char;
  }
  values.push(value);
  return values;
}
export function importLeadsCsv(text: string): BusinessLead[] {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter(Boolean);
  if (lines.length < 2) return [];
  const headers = row(lines[0]!).map((item) => item.trim().toLowerCase());
  const get = (values: string[], ...names: string[]) => {
    const index = headers.findIndex((header) => names.includes(header));
    return index >= 0 ? values[index]?.trim() || undefined : undefined;
  };
  return lines.slice(1).flatMap((line, index) => {
    const values = row(line);
    const businessName = get(values, "business_name", "business name", "name");
    if (!businessName) return [];
    const latitude = Number(get(values, "latitude", "lat"));
    const longitude = Number(get(values, "longitude", "lon", "lng"));
    const email = get(values, "email", "emails");
    return [
      {
        id: `import-${crypto.randomUUID()}`,
        source: "imported",
        sourceId: `csv-${index + 1}`,
        businessName,
        category: get(values, "category", "business_type") ?? "Imported",
        city: get(values, "city"),
        country: get(values, "country"),
        address: get(values, "address"),
        phone: get(values, "phone", "phone_number"),
        website: get(values, "website", "url"),
        email,
        emails: email
          ? email.split(/[;\s]+/).filter((item) => item.includes("@"))
          : [],
        socials: [],
        latitude: Number.isFinite(latitude) ? latitude : 0,
        longitude: Number.isFinite(longitude) ? longitude : 0,
        mapsUrl:
          Number.isFinite(latitude) && Number.isFinite(longitude)
            ? `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}`
            : undefined,
      },
    ];
  });
}
