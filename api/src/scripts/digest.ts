/**
 * Local CLI: run the pipeline on your machine and get today's LinkedIn posts.
 *
 *   cd api
 *   npm install
 *   npm run digest
 *
 * Prints every post to the console and writes a Markdown file to ./output/.
 * No Azure required. Reads config from environment or a .env file at the repo
 * root or in ./api. Flags:
 *   --no-dedup   include all fresh jobs even if storage would de-dup them (default local)
 *   --save       persist to blob storage if AZURE_STORAGE_CONNECTION_STRING is set
 */
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "../lib/config.js";
import { runDigest } from "../lib/pipeline.js";
import { renderMarkdown } from "../lib/format.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Minimal .env loader (no dependency): first existing file wins per key. */
async function loadDotEnv(): Promise<void> {
  const candidates = [
    resolve(__dirname, "../../../.env"), // repo root
    resolve(__dirname, "../../.env"), // api/
    resolve(process.cwd(), ".env"),
  ];
  for (const file of candidates) {
    if (!existsSync(file)) continue;
    const text = await readFile(file, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (!m) continue;
      const key = m[1];
      let val = m[2];
      if (/^".*"$/.test(val) || /^'.*'$/.test(val)) val = val.slice(1, -1);
      if (process.env[key] === undefined) process.env[key] = val;
    }
  }
}

async function main() {
  await loadDotEnv();
  const args = new Set(process.argv.slice(2));
  const cfg = loadConfig();

  const { digest, totalFetched, emailed } = await runDigest(cfg, {
    ignoreDedup: !args.has("--dedup"),
    skipSave: !args.has("--save"),
    skipEmail: !args.has("--email"),
    log: (m) => console.error(`• ${m}`),
  });

  // Console output — each post separated clearly for easy copy/paste.
  console.log("\n" + "=".repeat(64));
  console.log(`  Microsoft → LinkedIn digest — ${digest.date}  (${digest.count} post(s))`);
  console.log("=".repeat(64) + "\n");
  if (digest.count === 0) {
    console.log("No new matching jobs found in the configured window.");
    console.log(`(Scanned ${totalFetched} recent posting(s). Try widening MSJOBS_* filters.)\n`);
  }
  digest.posts.forEach((p, i) => {
    console.log(`\n----- POST ${i + 1} / ${digest.count} ` + "-".repeat(40) + "\n");
    console.log(p.text);
    console.log("");
  });

  // Also write a Markdown file with fenced blocks.
  const outDir = resolve(process.cwd(), "output");
  await mkdir(outDir, { recursive: true });
  const outFile = resolve(outDir, `${digest.date}.md`);
  await writeFile(outFile, renderMarkdown(digest.date, digest.posts), "utf8");
  console.error(`\n• Wrote ${digest.posts.length} post(s) to ${outFile}`);
  if (emailed) console.error("• Digest emailed.");
}

main().catch((err) => {
  console.error("Digest failed:", err);
  process.exit(1);
});
