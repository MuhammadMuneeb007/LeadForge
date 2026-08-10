import type { BusinessLead } from "@/types/lead";
import type { BusinessSearchInput, BusinessSearchProvider } from "../types";
/** Extension point for an Overture GeoParquet backend; disabled until a bounded spatial service is configured. */
export class OvertureProvider implements BusinessSearchProvider {
  readonly name = "Overture Maps";
  async search(input: BusinessSearchInput): Promise<BusinessLead[]> {
    void input;
    throw new Error(
      "Overture Maps is not enabled. Configure a spatial backend before selecting it.",
    );
  }
}
