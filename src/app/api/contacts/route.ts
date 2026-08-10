import { z } from "zod";
import { limits } from "@/lib/config";
import { getContactProvider } from "@/lib/contacts";
import {
  parseBoundedJson,
  RequestValidationError,
} from "@/lib/search/validation";
import { rateLimit } from "@/lib/rate-limit";
export const runtime = "nodejs";
export const maxDuration = 30;
const leadSchema = z
  .object({
    id: z.string().min(1).max(128),
    source: z.enum(["openstreetmap", "overture", "mock", "imported"]),
    sourceId: z.string().max(128),
    businessName: z.string().min(1).max(200),
    country: z.string().max(100).optional(),
    city: z.string().max(100).optional(),
    category: z.string().max(100),
    address: z.string().max(500).optional(),
    phone: z.string().max(100).optional(),
    website: z.url().max(500).optional(),
    email: z.email().optional(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    distanceKm: z.number().optional(),
    mapsUrl: z.url().optional(),
    emails: z.array(z.email()).max(20),
    socials: z.array(z.url()).max(20),
    openingHours: z.string().max(300).optional(),
    osm: z
      .object({ type: z.enum(["node", "way", "relation"]), id: z.number() })
      .optional(),
    tags: z.record(z.string(), z.string()).optional(),
    completenessScore: z.number().optional(),
  })
  .strict();
export const contactsSchema = z
  .object({
    leads: z.array(leadSchema).min(1).max(limits.maxContactEnrichment),
  })
  .strict();
export async function POST(request: Request) {
  try {
    if (!rateLimit(request, "contacts", 10))
      return Response.json(
        { error: "Too many contact requests. Please wait." },
        { status: 429 },
      );
    const parsed = contactsSchema.safeParse(
      await parseBoundedJson(request, 150_000),
    );
    if (!parsed.success)
      return Response.json(
        {
          error: `Select 1-${limits.maxContactEnrichment} valid website leads.`,
          issues: parsed.error.issues.map((i) => i.message),
        },
        { status: 400 },
      );
    return Response.json({
      results: await getContactProvider().enrich(parsed.data.leads),
    });
  } catch (error) {
    if (error instanceof RequestValidationError)
      return Response.json({ error: error.message }, { status: error.status });
    return Response.json(
      { error: "Contacts could not be enriched right now." },
      { status: 502 },
    );
  }
}
