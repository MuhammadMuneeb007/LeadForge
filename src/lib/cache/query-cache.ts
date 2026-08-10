const values = new Map<string, { expires: number; value: unknown }>();
const pending = new Map<string, Promise<unknown>>();
export async function cached<T>(
  key: string,
  seconds: number,
  load: () => Promise<T>,
): Promise<T> {
  const hit = values.get(key);
  if (hit && hit.expires > Date.now()) return hit.value as T;
  const existing = pending.get(key);
  if (existing) return existing as Promise<T>;
  const promise = load()
    .then((value) => {
      if (values.size >= 200) values.delete(values.keys().next().value!);
      values.set(key, { expires: Date.now() + seconds * 1000, value });
      return value;
    })
    .finally(() => pending.delete(key));
  pending.set(key, promise);
  return promise;
}
