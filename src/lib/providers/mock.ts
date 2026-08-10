import type { BusinessLead } from "@/types/lead";
import type { BusinessSearchInput, BusinessSearchProvider } from "./types";
export class MockProvider implements BusinessSearchProvider {
  readonly name = "mock";
  async search(input: BusinessSearchInput): Promise<BusinessLead[]> {
    await new Promise((resolve) => setTimeout(resolve, 180));
    const category = input.categories[0] ?? "business";
    return Array.from(
      { length: Math.min(input.resultLimit, 50) },
      (_, index): BusinessLead => {
        const latitude = input.latitude + index * 0.003;
        const longitude = input.longitude + index * 0.003;
        const sourceId = `mock-${input.cityId}-${category}-${index}`;
        return {
          id: `mock:${sourceId}`,
          source: "mock",
          sourceId,
          businessName: `${input.cityName} ${category.replace(/\b\w/g, (letter) => letter.toUpperCase())} ${index + 1}`,
          country: input.countryName,
          city: input.cityName,
          category,
          address: `${20 + index} Market Street, ${input.cityName}`,
          phone: index % 3 === 0 ? undefined : `+61 7 5555 ${1000 + index}`,
          website:
            index % 4 === 0
              ? undefined
              : `https://example-${index + 1}.invalid`,
          email: index % 5 === 0 ? `hello${index}@example.invalid` : undefined,
          emails: index % 5 === 0 ? [`hello${index}@example.invalid`] : [],
          socials: [],
          openingHours: index % 2 ? "Mo-Fr 09:00-17:00" : undefined,
          latitude,
          longitude,
          mapsUrl: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}`,
        };
      },
    );
  }
}
