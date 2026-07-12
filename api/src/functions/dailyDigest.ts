/**
 * Timer-triggered functions: one per edition, each on its own schedule.
 * They share a single runner so adding an edition is a two-line change.
 */
import { app, type InvocationContext, type Timer } from "@azure/functions";
import { loadConfig, getEdition } from "../lib/config.js";
import { runEdition } from "../lib/pipeline.js";

const cfg = loadConfig();

async function runEditionTimer(editionKey: string, context: InvocationContext): Promise<void> {
  const edition = getEdition(cfg, editionKey);
  context.log(`dailyDigest[${edition.key}]: starting`);
  try {
    const { digest, emailed, totalFetched } = await runEdition(edition, cfg, {
      log: (m) => context.log(m),
    });
    context.log(
      `dailyDigest[${edition.key}]: done — ${digest.count} new from ${totalFetched} fetched, emailed=${emailed}`,
    );
  } catch (err) {
    context.error(`dailyDigest[${edition.key}] failed:`, err);
    throw err;
  }
}

const usEdition = getEdition(cfg, "us");
app.timer("dailyDigest", {
  schedule: usEdition.schedule || "0 30 7 * * *",
  runOnStartup: false,
  handler: (_t: Timer, ctx) => runEditionTimer("us", ctx),
});

// Register the India edition timer only when that edition is configured.
const indiaEdition = cfg.editions.find((e) => e.key === "india");
if (indiaEdition) {
  app.timer("dailyDigestIndia", {
    schedule: indiaEdition.schedule || "0 30 3 * * *",
    runOnStartup: false,
    handler: (_t: Timer, ctx) => runEditionTimer("india", ctx),
  });
}
