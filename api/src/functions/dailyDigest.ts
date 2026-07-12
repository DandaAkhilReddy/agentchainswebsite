/** Timer-triggered function: runs the digest once a day and persists/emails it. */
import { app, type InvocationContext, type Timer } from "@azure/functions";
import { loadConfig } from "../lib/config.js";
import { runDigest } from "../lib/pipeline.js";

const cfg = loadConfig();

export async function dailyDigest(_myTimer: Timer, context: InvocationContext): Promise<void> {
  context.log("dailyDigest: starting run");
  try {
    const { digest, emailed, totalFetched } = await runDigest(cfg, {
      log: (m) => context.log(m),
    });
    context.log(
      `dailyDigest: done — ${digest.count} new post(s) from ${totalFetched} fetched, emailed=${emailed}`,
    );
  } catch (err) {
    context.error("dailyDigest failed:", err);
    throw err;
  }
}

app.timer("dailyDigest", {
  schedule: process.env.MSJOBS_SCHEDULE || "0 30 7 * * *",
  runOnStartup: false,
  handler: dailyDigest,
});
