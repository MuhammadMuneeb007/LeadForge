import { z } from "zod";
import { limits } from "@/lib/config";
import { resolveCategory } from "@/lib/providers/osm/categories";

export const searchSchema = z
  .object({
    countryCode: z
      .string()
      .trim()
      .regex(/^[A-Z]{2}$/),
    cityId: z.string().trim().regex(/^\d+$/),
    categories: z
      .array(z.string())
      .min(1)
      .max(limits.maxCategories)
      .superRefine((items, ctx) =>
        items.forEach((item, index) => {
          if (!resolveCategory(item))
            ctx.addIssue({
              code: "custom",
              path: [index],
              message: `Unsupported category: ${item}`,
            });
        }),
      ),
    radiusKm: z.number().min(1).max(limits.maxRadiusKm),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    resultLimit: z.number().int().min(10).max(limits.maxResults),
  })
  .strict();
export type ValidSearchInput = z.infer<typeof searchSchema>;

export async function parseBoundedJson(
  request: Request,
  maxBytes = 20_000,
): Promise<unknown> {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > maxBytes)
    throw new RequestValidationError("Request body is too large.", 413);
  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > maxBytes)
    throw new RequestValidationError("Request body is too large.", 413);
  try {
    return JSON.parse(body) as unknown;
  } catch {
    throw new RequestValidationError("Request body must be valid JSON.", 400);
  }
}
export class RequestValidationError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
