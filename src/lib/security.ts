import { headers } from "next/headers";

const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_MAX = 30;

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitRecord>();

export function rateLimit({
  key,
  windowMs = DEFAULT_WINDOW_MS,
  max = DEFAULT_MAX
}: {
  key: string;
  windowMs?: number;
  max?: number;
}) {
  const now = Date.now();
  const record = store.get(key);
  if (!record || record.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1 };
  }
  if (record.count >= max) {
    return { allowed: false, remaining: 0, retryAfter: record.resetAt - now };
  }
  record.count += 1;
  return { allowed: true, remaining: max - record.count };
}

export function getRequesterKey() {
  const forwarded = headers().get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "local";
  return ip;
}

export function sanitizeText(input: string) {
  return input.replace(/[<>]/g, "");
}
