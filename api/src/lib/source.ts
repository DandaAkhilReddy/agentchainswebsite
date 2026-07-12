/**
 * Pluggable job source.
 *
 * The pipeline talks to jobs only through the `JobSource` interface, so the
 * data-acquisition strategy can be swapped without touching formatting,
 * storage, or the functions. Today there is one real source (the Microsoft
 * careers JSON API); a Playwright/browser source is stubbed as a drop-in
 * fallback for the day Microsoft locks the JSON endpoint down.
 */
import type { Edition, SourceName } from "./config.js";
import type { Job } from "./types.js";
import { fetchFreshJobs as fetchViaApi } from "./msCareers.js";

export interface JobSource {
  readonly name: SourceName;
  fetchFreshJobs(edition: Edition): Promise<Job[]>;
}

/** Default source: the careers site's own JSON API. Fast, structured, free-plan friendly. */
export const apiSource: JobSource = {
  name: "api",
  fetchFreshJobs: (edition) => fetchViaApi(edition),
};

/**
 * Resolve a source by name. Unknown names fall back to the API source.
 * The Playwright source is loaded lazily so its (heavy) dependency is only
 * required when actually selected.
 */
export async function getSource(name: SourceName): Promise<JobSource> {
  if (name === "playwright") {
    const { playwrightSource } = await import("./playwrightSource.js");
    return playwrightSource;
  }
  return apiSource;
}
