/**
 * Local CLI: run the pipeline on your machine and get today's LinkedIn posts.
 *
 *   cd api
 *   npm install
 *   npm run digest
 *
 * Runs every configured edition (US, India, …), prints each post, and writes a
 * Markdown file per edition to ./output/. No Azure required. Reads config from
 * environment or a .env file at the repo root or in ./api. Flags:
 *   --edition=india   run only this edition (default: all)
 *   --dedup           respect blob dedup state (default off locally)
 *   --save            persist to blob storage if AZURE_STORAGE_CONNECTION_STRING is set
 *   --email           send via ACS if configured
 */
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "../lib/config.js";
import { runEdition } from "../lib/pipeline.js";
import { renderMarkdown } from "../lib/format.js";
import type { Digest } from "../lib/types.js";

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

function argValue(argv: string[], name: string): string | undefined {
  const hit = argv.find((a) => a.startsWith(`${name}=`));
  return hit ? hit.slice(name.length + 1) : undefined;
}

async function printAndWrite(digest: Digest, totalFetched: number, emailed: boolean) {
  console.log("\n" + "=".repeat(64));
  console.log(
    `  Microsoft → LinkedIn — ${digest.editionLabel} — ${digest.date}  (${digest.count} post(s))`,
  );
  console.log("=".repeat(64) + "\n");
  if (digest.count === 0) {
    console.log("No new matching jobs found in the configured window.");
    console.log(`(Scanned ${totalFetched} recent posting(s). Try widening the filters.)\n`);
  }
  digest.posts.forEach((p, i) => {
    console.log(`\n----- POST ${i + 1} / ${digest.count} ` + "-".repeat(40) + "\n");
    console.log(p.text);
    console.log("");
  });

  const outDir = resolve(process.cwd(), "output");
  await mkdir(outDir, { recursive: true });
  const outFile = resolve(outDir, `${digest.date}-${digest.edition}.md`);
  await writeFile(
    outFile,
    renderMarkdown(`${digest.editionLabel} — ${digest.date}`, digest.posts),
    "utf8",
  );
  console.error(`• [${digest.edition}] wrote ${digest.posts.length} post(s) to ${outFile}`);
  if (emailed) console.error(`• [${digest.edition}] digest emailed.`);
}

async function main() {
  await loadDotEnv();
  const argv = process.argv.slice(2);
  const args = new Set(argv);
  const cfg = loadConfig();

  const only = argValue(argv, "--edition");
  const editions = only
    ? cfg.editions.filter((e) => e.key.toLowerCase() === only.toLowerCase())
    : cfg.editions;

  if (editions.length === 0) {
    console.error(`No edition matched "${only}". Available: ${cfg.editions.map((e) => e.key).join(", ")}`);
    process.exit(1);
  }

  for (const edition of editions) {
    const { digest, totalFetched, emailed } = await runEdition(edition, cfg, {
      ignoreDedup: !args.has("--dedup"),
      skipSave: !args.has("--save"),
      skipEmail: !args.has("--email"),
      log: (m) => console.error(`• ${m}`),
    });
    await printAndWrite(digest, totalFetched, emailed);
  }
}

main().catch((err) => {
  console.error("Digest failed:", err);
  process.exit(1);
});
