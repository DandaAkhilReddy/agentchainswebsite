/** Orchestrates a per-edition digest run, shared by the timer, HTTP, and CLI entry points. */
import { loadConfig, type AppConfig, type Edition } from "./config.js";
import { getSource } from "./source.js";
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

/** Run the digest for a single edition. */
export async function runEdition(
  edition: Edition,
  cfg: AppConfig = loadConfig(),
  opts: RunOptions = {},
): Promise<RunResult> {
  const log = opts.log ?? (() => {});
  const store = new DigestStore(cfg, edition.key);

  log(
    `[${edition.key}] fetching via '${edition.source}' ` +
      `(query="${edition.query}", locations=${edition.locations.join("/") || "any"})`,
  );
  const source = await getSource(edition.source);
  const fetched = await source.fetchFreshJobs(edition);
  log(`[${edition.key}] fetched ${fetched.length} job(s) within ${edition.maxAgeHours}h.`);

  let jobs = fetched;
  if (!opts.ignoreDedup && store.enabled) {
    const posted = await store.loadPostedIds();
    jobs = fetched.filter((j) => !posted.has(j.id));
    log(`[${edition.key}] ${jobs.length} new after de-dup (${fetched.length - jobs.length} seen).`);
  }

  const posts = renderAll(jobs);
  const digest: Digest = {
    edition: edition.key,
    editionLabel: edition.label,
    date: today(),
    generatedAt: new Date().toISOString(),
    count: posts.length,
    posts,
  };

  if (!opts.skipSave && store.enabled) {
    await store.saveDigest(digest);
    await store.recordPostedIds(jobs.map((j) => j.id));
    log(`[${edition.key}] saved digest + dedup state to blob storage.`);
  }

  let emailed = false;
  if (!opts.skipEmail) {
    emailed = await sendDigestEmail(cfg, digest);
    if (emailed) log(`[${edition.key}] emailed digest to ${cfg.emailTo.join(", ")}.`);
  }

  return { digest, emailed, totalFetched: fetched.length };
}

/** Run every configured edition in sequence. */
export async function runAllEditions(
  cfg: AppConfig = loadConfig(),
  opts: RunOptions = {},
): Promise<RunResult[]> {
  const results: RunResult[] = [];
  for (const edition of cfg.editions) {
    results.push(await runEdition(edition, cfg, opts));
  }
  return results;
}
