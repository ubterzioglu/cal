import { describe, expect, it } from "vitest";

import {
  DEFAULT_PUPPETEER_ARGS,
  getPuppeteerLaunchOptions,
} from "../../scripts/prerender-config.mjs";

describe("getPuppeteerLaunchOptions", () => {
  it("uses safe default launch args without forcing an executable path", () => {
    const launchOptions = getPuppeteerLaunchOptions({});

    expect(launchOptions).toEqual({
      headless: "new",
      args: DEFAULT_PUPPETEER_ARGS,
    });
  });

  it("passes through a configured executable path for container builds", () => {
    const launchOptions = getPuppeteerLaunchOptions({
      PUPPETEER_EXECUTABLE_PATH: "  /usr/bin/chromium-browser  ",
    });

    expect(launchOptions).toEqual({
      headless: "new",
      args: DEFAULT_PUPPETEER_ARGS,
      executablePath: "/usr/bin/chromium-browser",
    });
  });
});
