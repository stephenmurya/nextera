import { createHash, timingSafeEqual } from "node:crypto";

function toDigest(value: string) {
  return createHash("sha256").update(value).digest();
}

export function secureCompare(a: string, b: string) {
  if (
    typeof a !== "string" ||
    typeof b !== "string" ||
    a.length === 0 ||
    b.length === 0
  ) {
    return false;
  }

  try {
    return timingSafeEqual(toDigest(a), toDigest(b));
  } catch {
    return false;
  }
}
