import { executeSearch } from "@/lib/search/execute";
import {
  parseBoundedJson,
  RequestValidationError,
  searchSchema,
} from "@/lib/search/validation";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 45;

export async function POST(request: Request) {
  try {
    if (!rateLimit(request, "search", 5))
      return Response.json(
        { error: "Too many searches. Please wait a few minutes." },
        { status: 429, headers: { "Retry-After": "600" } },
      );
    const parsed = searchSchema.safeParse(await parseBoundedJson(request));
    if (!parsed.success)
      return Response.json(
        {
          error: "Invalid search request.",
          issues: parsed.error.issues.map((issue) => issue.message),
        },
        { status: 400 },
      );
    const result = await executeSearch(parsed.data);
    return Response.json(result);
  } catch (error) {
    if (error instanceof RequestValidationError)
      return Response.json({ error: error.message }, { status: error.status });
    console.error("Search endpoint failure", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return Response.json(
      {
        error:
          error instanceof Error && error.message.includes("selected city")
            ? error.message
            : "The OpenStreetMap service is busy. Please try again shortly or use a smaller radius.",
      },
      {
        status:
          error instanceof Error && error.message.includes("selected city")
            ? 400
            : 503,
      },
    );
  }
}
