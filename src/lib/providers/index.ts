import type { BusinessSearchProvider } from "./types";
import { MockProvider } from "./mock";
import { OpenStreetMapProvider } from "./osm/overpass";

export function getBusinessProvider(): BusinessSearchProvider {
  const defaultProvider = process.env.NODE_ENV === "test" ? "mock" : "osm";
  const provider = (
    process.env.BUSINESS_DATA_PROVIDER ?? defaultProvider
  ).toLowerCase();
  if (provider === "osm") return new OpenStreetMapProvider();
  if (provider === "mock") return new MockProvider();
  if (provider === "overture")
    throw new Error("Overture provider is not enabled in this release.");
  throw new Error(
    `Unsupported BUSINESS_DATA_PROVIDER: ${provider}. Use osm or mock.`,
  );
}
