# msjobs2linkedin — Microsoft jobs → ready-to-paste LinkedIn posts

Every day, Microsoft posts hundreds of new roles on its careers site. This
pipeline pulls the **fresh** ones, formats each into a clean LinkedIn post
(title, location, level, pay, a short teaser, emojis, apply link, hashtags),
and hands you the text to **copy-paste** — you add the image and hit *Post*.

It runs two ways, and you can use either or both:

| Mode | What you get | Azure needed? |
| --- | --- | --- |
| **Local CLI** | Run one command, get today's posts in your terminal + a Markdown file | ❌ No |
| **Azure pipeline** | A timer runs every morning, saves the digest, and a web dashboard shows each post with a **Copy** button (optionally emails you) | ✅ Yes (free tiers) |

> **"Should I build it in Azure, or just get the content to copy-paste?"**
> Both are built here. Use the **CLI today** for instant copy-paste, and deploy the
> **Azure pipeline** so it happens automatically each morning without you running anything.

---

## Architecture

```mermaid
flowchart TD
    subgraph Source
      MS["Microsoft Careers API<br/>gcsservices.careers.microsoft.com"]
    end

    subgraph Pipeline["Pipeline (shared TypeScript lib)"]
      F["fetchFreshJobs()<br/>search + detail + filter"]
      R["renderPost()<br/>LinkedIn template + emojis"]
    end

    subgraph Azure["Azure (free / consumption tiers)"]
      T["⏰ Timer Function<br/>dailyDigest (daily)"]
      H["🌐 HTTP Functions<br/>/api/posts · /api/run"]
      B[("📦 Blob Storage<br/>digests + dedup state")]
      SWA["🖥️ Static Web App<br/>copy-paste dashboard"]
      EM(["✉️ ACS Email<br/>(optional)"])
    end

    CLI["💻 Local CLI<br/>npm run digest"]
    You(["🧑 You → paste into LinkedIn"])

    MS --> F --> R
    T --> F
    R --> B
    B --> H --> SWA --> You
    R --> EM --> You
    CLI --> F
    R --> CLI --> You
```

### How a run works
1. **Fetch** — query the Microsoft careers search API (newest-first, paginated),
   keep only jobs posted within the last *N* hours (default 24 = "today") that
   match your location/title filters.
2. **Enrich** — for each job, pull the detail endpoint to get a description
   teaser and, when the listing exposes it (US pay-transparency), the pay range.
3. **De-dup** — skip any job already included in a previous digest (state kept
   in Blob Storage).
4. **Render** — format each job into the LinkedIn template below.
5. **Deliver** — save to Blob (served to the dashboard), print to console + a
   Markdown file (CLI), and optionally email.

### The LinkedIn post template

```text
🚀 We're hiring at Microsoft!

💻 Senior Software Engineer
📍 Redmond, Washington, United States   🎯 Senior   🕐 Full-Time
🏠 Up to 50% work from home
💰 USD $137,600 - $272,800 per year
🗓️ Posted Jul 12, 2026

📝 Come build Azure! Design and ship services used by millions…

🔗 Apply here: https://jobs.careers.microsoft.com/global/en/job/1830000

#Microsoft #Hiring #TechJobs #NowHiring #Careers #JobSearch #SoftwareEngineering
```

---

## Repository layout

```
.
├── api/                       Azure Functions (TypeScript) + shared pipeline lib
│   ├── src/lib/               fetch, format, storage, email, config (reusable core)
│   ├── src/functions/         dailyDigest (timer), posts (HTTP), runNow (HTTP)
│   └── src/scripts/digest.ts  local CLI entry point
├── web/                       self-contained static dashboard (no build step)
│   ├── index.html             cards with Copy buttons, reads /api/posts
│   └── staticwebapp.config.json
├── infra/
│   ├── main.bicep             all Azure resources (free/consumption)
│   └── deploy.sh              one-shot provision + publish
├── .env.example               every config option, documented
└── README.md
```

---

## Option A — Get today's posts right now (no Azure)

```bash
cd api
npm install
npm run digest
```

You'll see each post printed in the terminal and a file written to
`api/output/<date>.md` with fenced blocks you can copy. Tune what you get with
env vars (or a `.env` file in the repo root) — see `.env.example`:

```bash
MSJOBS_QUERY="Software Engineer" MSJOBS_LOCATIONS="United States" \
MSJOBS_MAX_AGE_HOURS=48 MSJOBS_MAX_JOBS=10 npm run digest
```

Useful flags: `--dedup` (respect blob dedup state), `--save` (persist to Azure
if `AZURE_STORAGE_CONNECTION_STRING` is set), `--email` (send via ACS).

---

## Option B — Deploy the automated Azure pipeline

**Prerequisites:** an Azure subscription, [Azure CLI](https://learn.microsoft.com/cli/azure/),
[Azure Functions Core Tools v4](https://learn.microsoft.com/azure/azure-functions/functions-run-local),
and the [SWA CLI](https://azure.github.io/static-web-apps-cli/) (`npm i -g @azure/static-web-apps-cli`).

```bash
az login
bash infra/deploy.sh          # provisions + publishes everything
```

The script prints your **dashboard URL** and **API base**. That's it — the
timer runs every morning (default 07:30, set `MSJOBS_SCHEDULE`), the dashboard
shows the latest posts with Copy buttons, and `/api/run` lets you refresh on
demand.

### What gets created (all free / consumption)
- **Storage account** — daily digests + dedup state (and the Functions runtime store)
- **Function App** (Linux, Node 20, Consumption Y1) — timer + HTTP endpoints
- **Application Insights** — logs/metrics
- **Static Web App** (Free) — the dashboard

### Manual deploy (if you prefer step-by-step)
```bash
az group create -n rg-msjobs -l eastus2
az deployment group create -g rg-msjobs -f infra/main.bicep -p namePrefix=msjobs
# then, using the output names:
cd api && npm ci && npm run build && func azure functionapp publish <functionAppName>
# deploy web/ to the Static Web App with its deployment token (see infra/deploy.sh)
```

### Endpoints
| Route | Method | Purpose |
| --- | --- | --- |
| `/api/posts` | GET | Latest saved digest (JSON) — the dashboard reads this. `?generate=1` builds one on first run. |
| `/api/run` | GET/POST | Run the pipeline on demand. `?all=1` ignores dedup. (function-key protected) |
| `dailyDigest` | timer | Scheduled daily run (no HTTP surface). |

---

## Configuration reference

All settings are environment variables (Function App *Application Settings*, or
a local `.env`). Full list with defaults in [`.env.example`](./.env.example).

| Variable | Default | Meaning |
| --- | --- | --- |
| `MSJOBS_QUERY` | `Software Engineer` | Free-text careers search query |
| `MSJOBS_LOCATIONS` | `United States` | Comma-separated location filters |
| `MSJOBS_TITLE_INCLUDES` | *(none)* | Title must contain one of these |
| `MSJOBS_TITLE_EXCLUDES` | `Intern,Internship` | Exclude titles containing these |
| `MSJOBS_MAX_AGE_HOURS` | `24` | Only jobs posted within this window |
| `MSJOBS_MAX_JOBS` | `15` | Cap per digest |
| `MSJOBS_MAX_PAGES` | `4` | Search pages to scan (20/page) |
| `MSJOBS_SCHEDULE` | `0 30 7 * * *` | Timer (NCRONTAB) |
| `AZURE_STORAGE_CONNECTION_STRING` | *(none)* | Enables blob output + dedup |
| `ACS_CONNECTION_STRING` / `ACS_SENDER_ADDRESS` / `MSJOBS_EMAIL_TO` | *(none)* | Optional email delivery |

---

## Notes & good citizenship
- Uses **public, unauthenticated** careers endpoints, lightly and once a day,
  with bounded concurrency. Posting is **manual** (you paste + add your image) —
  no automated LinkedIn posting, no ToS gray areas.
- Pay ranges only appear when the listing itself publishes one (mostly US roles).
- Microsoft may change its careers API; the fetch layer is isolated in
  `api/src/lib/msCareers.ts` so it's easy to adjust.
