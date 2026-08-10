import type { CityRecord } from "@/data/cities/types";
export function parseAdmin1(text: string) {
  return new Map(
    text
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const [code, name] = line.split("\t");
        return [code!, name!] as const;
      }),
  );
}
export function parseCities(
  text: string,
  admin: Map<string, string>,
): CityRecord[] {
  return text
    .split(/\r?\n/)
    .filter(Boolean)
    .flatMap((line) => {
      const c = line.split("\t");
      if (c.length < 18) return [];
      const countryCode = c[8]!;
      return [
        {
          id: c[0]!,
          name: c[1]!,
          asciiName: c[2]!,
          latitude: Number(c[4]),
          longitude: Number(c[5]),
          countryCode,
          admin1: admin.get(`${countryCode}.${c[10]}`) ?? c[10]!,
          population: Number(c[14]) || 0,
          timezone: c[17]!,
        },
      ];
    });
}
