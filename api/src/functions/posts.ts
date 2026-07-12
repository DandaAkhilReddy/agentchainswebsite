/** HTTP GET /api/posts — returns the latest saved digest for the dashboard. */
import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from "@azure/functions";
import { loadConfig } from "../lib/config.js";
import { DigestStore } from "../lib/store.js";
import { runDigest } from "../lib/pipeline.js";

const cfg = loadConfig();

export async function posts(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const store = new DigestStore(cfg);
  const cors = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
  };

  try {
    let digest = await store.loadLatest();

    // If nothing has been generated yet (fresh deploy) and the caller opts in,
    // generate on the fly so the dashboard isn't empty on day one.
    if (!digest && req.query.get("generate") === "1") {
      context.log("posts: no saved digest, generating on demand");
      ({ digest } = await runDigest(cfg, { log: (m) => context.log(m) }));
    }

    if (!digest) {
      return {
        status: 200,
        headers: cors,
        jsonBody: {
          date: new Date().toISOString().slice(0, 10),
          count: 0,
          posts: [],
          note: "No digest generated yet. It will appear after the first scheduled run, or call /api/run.",
        },
      };
    }

    return { status: 200, headers: cors, jsonBody: digest };
  } catch (err) {
    context.error("posts failed:", err);
    return { status: 500, headers: cors, jsonBody: { error: "Failed to load posts." } };
  }
}

app.http("posts", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "posts",
  handler: posts,
});
