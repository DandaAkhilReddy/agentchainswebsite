/** HTTP POST/GET /api/run[?edition=us|india][&all=1] — trigger a digest run on demand. */
import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from "@azure/functions";
import { loadConfig, getEdition } from "../lib/config.js";
import { runEdition } from "../lib/pipeline.js";

const cfg = loadConfig();

export async function runNow(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const cors = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
  };
  try {
    const edition = getEdition(cfg, req.query.get("edition"));
    const ignoreDedup = req.query.get("all") === "1";
    const { digest, emailed, totalFetched } = await runEdition(edition, cfg, {
      ignoreDedup,
      log: (m) => context.log(m),
    });
    return {
      status: 200,
      headers: cors,
      jsonBody: {
        edition: digest.edition,
        editionLabel: digest.editionLabel,
        date: digest.date,
        count: digest.count,
        totalFetched,
        emailed,
        posts: digest.posts,
      },
    };
  } catch (err) {
    context.error("runNow failed:", err);
    return { status: 500, headers: cors, jsonBody: { error: "Digest run failed." } };
  }
}

app.http("runNow", {
  methods: ["GET", "POST"],
  authLevel: "function",
  route: "run",
  handler: runNow,
});
