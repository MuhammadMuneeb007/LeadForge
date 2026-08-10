import { randomUUID } from "node:crypto";
import { ProviderError } from "@/lib/providers/types";

type RequestOptions = RequestInit & { timeoutMs?: number; retries?: number };

const transientStatuses = new Set([408, 425, 429, 500, 502, 503, 504]);
const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function requestJson<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const { timeoutMs = 10_000, retries = 2, ...fetchOptions } = options;
  const requestId = randomUUID();
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
        cache: "no-store",
      });
      if (response.ok) return (await response.json()) as T;
      if (response.status === 429)
        throw new ProviderError(
          "Provider quota or rate limit reached.",
          "QUOTA",
          true,
        );
      if (!transientStatuses.has(response.status) || attempt === retries) {
        throw new ProviderError(
          `Provider request failed with status ${response.status}.`,
          "UPSTREAM",
          false,
        );
      }
    } catch (error) {
      const timedOut = error instanceof Error && error.name === "AbortError";
      const retryable =
        timedOut || (error instanceof ProviderError && error.retryable);
      if (!retryable || attempt === retries) {
        if (timedOut)
          throw new ProviderError(
            "Provider request timed out.",
            "TIMEOUT",
            true,
          );
        throw error;
      }
    } finally {
      clearTimeout(timeout);
    }
    const jitter = Math.floor(Math.random() * 150);
    console.info("Provider request retry", { requestId, attempt: attempt + 1 });
    await wait(250 * 2 ** attempt + jitter);
  }
  throw new ProviderError("Provider request failed.", "UPSTREAM");
}
