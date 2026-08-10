const buckets = new Map<string, number[]>();
export function rateLimit(
  request: Request,
  scope: string,
  maximum: number,
  windowMs = 600_000,
) {
  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const key = `${scope}:${forwarded || request.headers.get("x-real-ip") || "local"}`;
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter(
    (time) => time > now - windowMs,
  );
  if (recent.length >= maximum) return false;
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 5000) buckets.delete(buckets.keys().next().value!);
  return true;
}
