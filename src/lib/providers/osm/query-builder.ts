import { resolveCategory } from "./categories";
const safeTag = /^[a-z0-9_:]+$/;
const safeValue = /^[a-z0-9_:-]+$/;
const selector = (key: string, value?: string) => {
  if (!safeTag.test(key) || (value !== undefined && !safeValue.test(value)))
    throw new Error("Unsafe OSM category mapping.");
  return value === undefined ? `["${key}"]` : `["${key}"="${value}"]`;
};
export function buildOverpassQuery(input: {
  categories: string[];
  latitude: number;
  longitude: number;
  radiusKm: number;
}) {
  if (
    !Number.isFinite(input.latitude) ||
    input.latitude < -90 ||
    input.latitude > 90 ||
    !Number.isFinite(input.longitude) ||
    input.longitude < -180 ||
    input.longitude > 180
  )
    throw new Error("Invalid trusted city coordinates.");
  if (
    !Number.isFinite(input.radiusKm) ||
    input.radiusKm < 1 ||
    input.radiusKm > 50
  )
    throw new Error("Invalid radius.");
  const radius = Math.round(input.radiusKm * 1000);
  const statements: string[] = [];
  for (const id of input.categories) {
    const category = resolveCategory(id);
    if (!category) throw new Error(`Unknown OSM category: ${id}`);
    for (const filter of category.filters) {
      const values = filter.values ?? [filter.value];
      values.forEach((value) =>
        statements.push(
          `nwr${selector(filter.key, value)}(around:${radius},${input.latitude},${input.longitude});`,
        ),
      );
    }
  }
  return `[out:json][timeout:15];\n(\n${statements.join("\n")}\n);\nout center tags;`;
}
