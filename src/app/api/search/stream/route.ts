/** Kept as a compatibility response for older clients. New clients use POST /api/search. */
export function POST() {
  return Response.json(
    {
      error:
        "Streaming search was replaced by the bounded /api/search endpoint.",
    },
    { status: 410 },
  );
}
