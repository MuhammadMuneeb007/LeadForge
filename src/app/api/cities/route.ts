import { nearestCity, searchCities } from "@/lib/cities";
export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const latitude = Number(params.get("lat"));
  const longitude = Number(params.get("lon"));
  if (
    params.has("lat") &&
    params.has("lon") &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  ) {
    return Response.json({ city: nearestCity(latitude, longitude) });
  }
  const q = (params.get("q") ?? "").slice(0, 80);
  const country = (params.get("country") ?? "").toUpperCase();
  if (!/^[A-Z]{2}$/.test(country)) return Response.json({ cities: [] });
  return Response.json(
    { cities: searchCities(q, country) },
    { headers: { "Cache-Control": "public, max-age=300, s-maxage=86400" } },
  );
}
