/**
 * Playwright/browser fallback source — a documented, drop-in slot.
 *
 * WHY THIS EXISTS
 * The default `apiSource` calls Microsoft's careers JSON API directly, which is
 * what almost every "MS jobs scraper" does under the hood. The only real risk is
 * that Microsoft one day adds a token/bot-check to that endpoint. If that
 * happens, implement `fetchFreshJobs` below to drive a headless browser against
 * https://jobs.careers.microsoft.com and parse the rendered results.
 *
 * NOT ENABLED BY DEFAULT because:
 *   - Playwright pulls a headless Chromium (~300MB) — it will NOT run on the
 *     Azure Functions **Consumption** plan. You'd move the Function App to a
 *     **Premium** or **container** plan first.
 *   - It is slower and more brittle than the JSON API.
 *
 * TO ACTIVATE
 *   1. `npm i playwright` (and `npx playwright install chromium`), or run on a
 *      Playwright-enabled container image.
 *   2. Implement the body below (navigate, wait for the job list, extract the
 *      same fields the API source produces — see `Job` in types.ts).
 *   3. Set `MSJOBS_SOURCE=playwright` (globally) or `MSJOBS_INDIA_SOURCE=playwright`
 *      (per edition).
 */
import type { Edition } from "./config.js";
import type { Job } from "./types.js";
import type { JobSource } from "./source.js";

export const playwrightSource: JobSource = {
  name: "playwright",
  async fetchFreshJobs(_edition: Edition): Promise<Job[]> {
    throw new Error(
      "Playwright source is not implemented. It's a documented fallback slot — " +
        "see api/src/lib/playwrightSource.ts. Install playwright, implement " +
        "fetchFreshJobs(), and run on a Premium/container plan (not Consumption).",
    );
  },
};
