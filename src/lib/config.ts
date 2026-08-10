const boundedInteger = (
  name: string,
  fallback: number,
  min: number,
  max: number,
) => {
  const parsed = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(parsed)
    ? Math.min(max, Math.max(min, parsed))
    : fallback;
};

export const limits = {
  maxCategories: boundedInteger("MAX_CATEGORIES_PER_SEARCH", 3, 1, 5),
  defaultRadiusKm: boundedInteger("DEFAULT_RADIUS_KM", 10, 5, 50),
  maxRadiusKm: boundedInteger("MAX_RADIUS_KM", 50, 5, 50),
  maxResults: boundedInteger("MAX_RESULTS", 200, 10, 500),
  maxContactEnrichment: boundedInteger("MAX_CONTACT_ENRICHMENT", 10, 1, 25),
  cacheSeconds: boundedInteger("OVERPASS_CACHE_SECONDS", 1800, 900, 3600),
} as const;
