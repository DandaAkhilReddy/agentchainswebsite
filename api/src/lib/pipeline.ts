/** Orchestrates the end-to-end digest run, shared by the timer, HTTP, and CLI entry points. */
import { loadConfig, type AppConfig } from "./config.js";
import { fetchFreshJobs } from "./msCareers.js";
import { renderAll } from "./format.js";
import { DigestStore } from "./store.js";
import { sendDigestEmail } from "./email.js";
import type { Digest } from "./types.js";

export interface RunOptions {
  /** Skip the dedup check and include every fresh job (useful for local testing). */
  ignoreDedup?: boolean;
  /** Skip persisting to blob storage. */
  skipSave?: boolean;
  /** Skip email delivery even if configured. */
  skipEmail?: boolean;
  log?: (msg: string) => void;
}

export interface RunResult {
  digest: Digest;
  emailed: boolean;
  totalFetched: number;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function runDigest(
  cfg: AppConfig = loadConfig(),
  opts: RunOptions = {},
): Promise<RunResult> {
  const log = opts.log ?? (() => {});
  const store = new DigestStore(cfg);

  log(`Fetching Microsoft jobs (query="${cfg.query}", locations=${cfg.locations.join("/") || "any"})`);
  const fetched = await fetchFreshJobs(cfg);
  log(`Fetched ${fetched.length} job(s) within ${cfg.maxAgeHours}h.`);

  let jobs = fetched;
  if (!opts.ignoreDedup && store.enabled) {
    const posted = await store.loadPostedIds();
    jobs = fetched.filter((j) => !posted.has(j.id));
    log(`${jobs.length} new after de-dup (${fetched.length - jobs.length} already posted).`);
  }

  const posts = renderAll(jobs);
  const digest: Digest = {
    date: today(),
    generatedAt: new Date().toISOString(),
    count: posts.length,
    posts,
  };

  if (!opts.skipSave && store.enabled) {
    await store.saveDigest(digest);
    await store.recordPostedIds(jobs.map((j) => j.id));
    log("Saved digest + dedup state to blob storage.");
  }

  let emailed = false;
  if (!opts.skipEmail) {
    emailed = await sendDigestEmail(cfg, digest);
    if (emailed) log(`Emailed digest to ${cfg.emailTo.join(", ")}.`);
  }

  return { digest, emailed, totalFetched: fetched.length };
}
