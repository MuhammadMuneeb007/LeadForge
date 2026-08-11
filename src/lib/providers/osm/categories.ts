import type { BusinessCategoryDefinition } from "./types";
export const categories: BusinessCategoryDefinition[] = [
  {
    id: "electronics",
    label: "Electronics store",
    aliases: ["mobile shop", "computer store", "phone shop"],
    filters: [
      { key: "shop", values: ["electronics", "mobile_phone", "computer"] },
    ],
  },
  {
    id: "dentist",
    label: "Dentist",
    aliases: ["dental clinic", "dental"],
    filters: [{ key: "amenity", value: "dentist" }],
  },
  {
    id: "restaurant",
    label: "Restaurant",
    aliases: ["restaurants"],
    filters: [{ key: "amenity", value: "restaurant" }],
  },
  {
    id: "cafe",
    label: "Coffee shop",
    aliases: ["coffee shop", "coffee", "café"],
    filters: [{ key: "amenity", value: "cafe" }],
  },
  {
    id: "physiotherapist",
    label: "Physiotherapist",
    aliases: ["physio", "physical therapist"],
    filters: [{ key: "healthcare", value: "physiotherapist" }],
  },
  {
    id: "gym",
    label: "Gym",
    aliases: ["fitness centre", "fitness center"],
    filters: [{ key: "leisure", value: "fitness_centre" }],
  },
  {
    id: "pharmacy",
    label: "Pharmacy",
    aliases: ["chemist"],
    filters: [{ key: "amenity", value: "pharmacy" }],
  },
  {
    id: "accountant",
    label: "Accountant",
    aliases: ["accounting firm"],
    filters: [{ key: "office", value: "accountant" }],
  },
  {
    id: "lawyer",
    label: "Lawyer",
    aliases: ["law firm", "solicitor"],
    filters: [{ key: "office", value: "lawyer" }],
  },
  {
    id: "real_estate",
    label: "Real estate agent",
    aliases: ["real estate", "real estate agency", "estate agent"],
    filters: [{ key: "office", value: "estate_agent" }],
  },
  {
    id: "car_repair",
    label: "Car repair",
    aliases: ["mechanic", "auto repair"],
    filters: [{ key: "shop", value: "car_repair" }],
  },
  {
    id: "hotel",
    label: "Hotel",
    aliases: ["accommodation"],
    filters: [{ key: "tourism", values: ["hotel", "motel"] }],
  },
  {
    id: "barber",
    label: "Barber",
    aliases: ["barbershop"],
    filters: [
      { key: "shop", value: "hairdresser" },
      { key: "hairdresser", value: "barber" },
    ],
  },
  {
    id: "beauty_salon",
    label: "Beauty salon",
    aliases: ["beautician"],
    filters: [{ key: "shop", value: "beauty" }],
  },
  {
    id: "supermarket",
    label: "Supermarket",
    aliases: ["grocery store"],
    filters: [{ key: "shop", value: "supermarket" }],
  },
  {
    id: "bakery",
    label: "Bakery",
    aliases: ["baker"],
    filters: [{ key: "shop", value: "bakery" }],
  },
  {
    id: "veterinarian",
    label: "Veterinarian",
    aliases: ["vet", "veterinary clinic"],
    filters: [{ key: "amenity", value: "veterinary" }],
  },
  {
    id: "school",
    label: "School",
    aliases: ["education"],
    filters: [{ key: "amenity", value: "school" }],
  },
  {
    id: "clinic",
    label: "Clinic",
    aliases: ["medical clinic"],
    filters: [{ key: "amenity", value: "clinic" }],
  },
  {
    id: "hospital",
    label: "Hospital",
    aliases: [],
    filters: [{ key: "amenity", value: "hospital" }],
  },
  {
    id: "it_company",
    label: "IT company",
    aliases: ["software company", "computer company"],
    filters: [{ key: "office", values: ["it", "software"] }],
  },
  {
    id: "marketing_agency",
    label: "Marketing agency",
    aliases: ["marketing", "advertising agency"],
    filters: [{ key: "office", values: ["advertising_agency", "marketing"] }],
  },
  {
    id: "bank",
    label: "Bank",
    aliases: [],
    filters: [{ key: "amenity", value: "bank" }],
  },
  {
    id: "fuel",
    label: "Fuel station",
    aliases: ["petrol station", "gas station"],
    filters: [{ key: "amenity", value: "fuel" }],
  },
  {
    id: "bus_station",
    label: "Bus station",
    aliases: ["bus stations", "bus terminal", "bus stop"],
    filters: [
      { key: "amenity", value: "bus_station" },
      { key: "public_transport", value: "station" },
      { key: "highway", value: "bus_stop" },
    ],
  },
];
const lookup = new Map(
  categories.flatMap((category) =>
    [category.id, category.label, ...category.aliases].map(
      (term) => [term.toLocaleLowerCase(), category] as const,
    ),
  ),
);
export const resolveCategory = (value: string) =>
  lookup.get(value.trim().toLocaleLowerCase());
export const customCategoryPrefix = "custom:";
export const customCategoryTerm = (value: string) =>
  value.startsWith(customCategoryPrefix)
    ? value.slice(customCategoryPrefix.length).trim()
    : undefined;
export const suggestCategories = (value: string) =>
  categories
    .filter((category) =>
      `${category.label} ${category.aliases.join(" ")}`
        .toLocaleLowerCase()
        .includes(value.toLocaleLowerCase()),
    )
    .slice(0, 5);
