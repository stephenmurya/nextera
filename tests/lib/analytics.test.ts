import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const analyticsMocks = vi.hoisted(() => ({
  track: vi.fn(),
}));

vi.mock("@vercel/analytics", () => ({
  track: analyticsMocks.track,
}));

import { trackAnalyticsEvent } from "@/lib/analytics";

describe("trackAnalyticsEvent", () => {
  beforeEach(() => {
    analyticsMocks.track.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("forwards typed events to the analytics provider in the browser", () => {
    vi.stubGlobal("window", {} as Window & typeof globalThis);

    trackAnalyticsEvent("page_view", {
      path: "/about",
      template: "landing",
    });

    expect(analyticsMocks.track).toHaveBeenCalledWith("page_view", {
      path: "/about",
      template: "landing",
    });
  });

  it("does not attempt to track events on the server", () => {
    trackAnalyticsEvent("form_submit_success", {
      formType: "demo",
    });

    expect(analyticsMocks.track).not.toHaveBeenCalled();
  });
});
