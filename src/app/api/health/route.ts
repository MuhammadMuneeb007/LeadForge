export const runtime = "nodejs";

export function GET() {
  const defaultProvider = process.env.NODE_ENV === "test" ? "mock" : "osm";
  return Response.json({
    status: "ok",
    version: "1.0.0",
    provider: process.env.BUSINESS_DATA_PROVIDER ?? defaultProvider,
  });
}
