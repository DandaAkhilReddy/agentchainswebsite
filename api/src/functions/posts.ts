/** HTTP GET /api/posts[?edition=us|india] — returns the latest saved digest for the dashboard. */
import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from "@azure/functions";
import { loadConfig, getEdition } from "../lib/config.js";
import { DigestStore } from "../lib/store.js";
import { runEdition } from "../lib/pipeline.js";

const cfg = loadConfig();

export async function posts(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const edition = getEdition(cfg, req.query.get("edition"));
  const store = new DigestStore(cfg, edition.key);
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
      context.log(`posts[${edition.key}]: no saved digest, generating on demand`);
      ({ digest } = await runEdition(edition, cfg, { log: (m) => context.log(m) }));
    }

    if (!digest) {
      return {
        status: 200,
        headers: cors,
        jsonBody: {
          edition: edition.key,
          editionLabel: edition.label,
          date: new Date().toISOString().slice(0, 10),
          count: 0,
          posts: [],
          editions: cfg.editions.map((e) => ({ key: e.key, label: e.label })),
          note: "No digest generated yet. It will appear after the first scheduled run, or call /api/run.",
        },
      };
    }

    return {
      status: 200,
      headers: cors,
      jsonBody: { ...digest, editions: cfg.editions.map((e) => ({ key: e.key, label: e.label })) },
    };
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
