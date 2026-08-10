import type { BusinessLead } from "@/types/lead";

export type BusinessSearchInput = {
  countryCode: string;
  countryName: string;
  cityId: string;
  cityName: string;
  latitude: number;
  longitude: number;
  categories: string[];
  radiusKm: number;
  resultLimit: number;
};

export interface BusinessSearchProvider {
  readonly name: string;
  search(input: BusinessSearchInput): Promise<BusinessLead[]>;
}

export class ProviderError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "NOT_CONFIGURED"
      | "TIMEOUT"
      | "QUOTA"
      | "UPSTREAM"
      | "INVALID_RESPONSE",
    public readonly retryable = false,
  ) {
    super(message);
    this.name = "ProviderError";
  }
}
