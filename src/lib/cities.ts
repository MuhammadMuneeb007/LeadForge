import cityData from "@/data/cities/cities.json";
import type { CityRecord } from "@/data/cities/types";
const cities = cityData as CityRecord[];
const byId = new Map(cities.map((city) => [city.id, city]));
export const getCity = (id: string) => byId.get(id);
export function nearestCity(latitude: number, longitude: number) {
  let nearest: CityRecord | undefined;
  let best = Number.POSITIVE_INFINITY;
  for (const city of cities) {
    const score =
      (city.latitude - latitude) ** 2 +
      (city.longitude - longitude) ** 2 *
        Math.cos((latitude * Math.PI) / 180) ** 2;
    if (score < best) {
      best = score;
      nearest = city;
    }
  }
  return nearest;
}
export function searchCities(query: string, countryCode?: string, limit = 10) {
  const needle = query.trim().toLocaleLowerCase();
  if (needle.length < 2) {
    return cities
      .filter((city) => !countryCode || city.countryCode === countryCode)
      .sort((a, b) => b.population - a.population)
      .slice(0, limit);
  }
  return cities
    .filter(
      (city) =>
        (!countryCode || city.countryCode === countryCode) &&
        (city.name.toLocaleLowerCase().includes(needle) ||
          city.asciiName.toLocaleLowerCase().includes(needle)),
    )
    .sort((a, b) => {
      const aPrefix = a.name.toLocaleLowerCase().startsWith(needle) ? 1 : 0;
      const bPrefix = b.name.toLocaleLowerCase().startsWith(needle) ? 1 : 0;
      return bPrefix - aPrefix || b.population - a.population;
    })
    .slice(0, limit);
}
