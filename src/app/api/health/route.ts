export const runtime = "nodejs";

export function GET() {
  return Response.json({
    status: "ok",
    version: "2.0.0-beta.1",
    provider: process.env.BUSINESS_DATA_PROVIDER ?? "mock",
  });
}
