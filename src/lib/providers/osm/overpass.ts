import { createHash } from "node:crypto";
import { limits } from "@/lib/config";
import { cached } from "@/lib/cache/query-cache";
import { scoreLeads } from "@/lib/scoring/score";
import type { BusinessSearchProvider, BusinessSearchInput } from "../types";
import type { OverpassResponse } from "./types";
import { buildOverpassQuery } from "./query-builder";
import { normalizeOsmElement } from "./normalize";

const endpoint =
  process.env.OVERPASS_API_URL ?? "https://overpass-api.de/api/interpreter";
async function fetchOverpass(query: string): Promise<OverpassResponse> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 18_000);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "LeadForge/1.0",
        },
        body: new URLSearchParams({ data: query }),
        signal: controller.signal,
      });
      if (!response.ok) {
        if (attempt === 0 && [429, 502, 503, 504].includes(response.status)) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          continue;
        }
        throw new Error(
          response.status === 429
            ? "OpenStreetMap is busy. Please wait and try again."
            : `OpenStreetMap query failed (${response.status}).`,
        );
      }
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.byteLength > 8_000_000)
        throw new Error(
          "The map response was too large. Try a smaller radius.",
        );
      return JSON.parse(new TextDecoder().decode(bytes)) as OverpassResponse;
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error("OpenStreetMap is temporarily unavailable.");
}
export class OpenStreetMapProvider implements BusinessSearchProvider {
  readonly name = "OpenStreetMap";
  async search(input: BusinessSearchInput) {
    const query = buildOverpassQuery(input);
    const key = createHash("sha256").update(query).digest("hex");
    const data = await cached(key, limits.cacheSeconds, () =>
      fetchOverpass(query),
    );
    return scoreLeads(
      (data.elements ?? [])
        .map((element) => normalizeOsmElement(element, input))
        .filter((lead) => lead !== undefined)
        .sort(
          (a, b) =>
            Number(Boolean(b.phone || b.website)) -
              Number(Boolean(a.phone || a.website)) ||
            (a.distanceKm ?? 0) - (b.distanceKm ?? 0),
        )
        .slice(0, Math.min(input.resultLimit, limits.maxResults)),
    );
  }
}
