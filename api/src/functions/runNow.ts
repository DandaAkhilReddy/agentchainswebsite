/** HTTP POST/GET /api/run — trigger a digest run on demand (manual refresh). */
import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from "@azure/functions";
import { loadConfig } from "../lib/config.js";
import { runDigest } from "../lib/pipeline.js";

const cfg = loadConfig();

export async function runNow(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const cors = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
  };
  try {
    const ignoreDedup = req.query.get("all") === "1";
    const { digest, emailed, totalFetched } = await runDigest(cfg, {
      ignoreDedup,
      log: (m) => context.log(m),
    });
    return {
      status: 200,
      headers: cors,
      jsonBody: {
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
