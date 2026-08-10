import { getCity } from "@/lib/cities";
import { getBusinessProvider } from "@/lib/providers";
import { getCountryName } from "@/lib/countries";
import { deduplicateLeads } from "./dedupe";
import type { SearchResponse } from "@/types/lead";
import type { ValidSearchInput } from "./validation";
export async function executeSearch(
  input: ValidSearchInput,
): Promise<SearchResponse> {
  const city = getCity(input.cityId);
  if (!city || city.countryCode !== input.countryCode)
    throw new Error("The selected city does not belong to that country.");
  const leads = await getBusinessProvider().search({
    ...input,
    countryName: getCountryName(input.countryCode),
    cityName: city.name,
    latitude: input.latitude ?? city.latitude,
    longitude: input.longitude ?? city.longitude,
  });
  return { leads: deduplicateLeads(leads), warnings: [], totalQueries: 1 };
}
