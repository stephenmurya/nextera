import { secureCompare } from "@/lib/crypto";

describe("secureCompare", () => {
  it("returns true for identical strings", () => {
    expect(secureCompare("preview-secret", "preview-secret")).toBe(true);
  });

  it("returns false for mismatched strings", () => {
    expect(secureCompare("preview-secret", "wrong-secret")).toBe(false);
  });

  it("returns false and does not throw for length mismatches or empty input", () => {
    expect(() => secureCompare("short", "a-much-longer-secret")).not.toThrow();
    expect(secureCompare("short", "a-much-longer-secret")).toBe(false);
    expect(secureCompare("", "preview-secret")).toBe(false);
    expect(secureCompare("preview-secret", "")).toBe(false);
  });
});
