# msjobs2linkedin — Microsoft jobs → ready-to-paste LinkedIn posts

Every day, Microsoft posts hundreds of new roles on its careers site. This
pipeline pulls the **fresh** ones, formats each into a clean LinkedIn post
(title, location, level, pay, a short teaser, emojis, apply link, hashtags),
and hands you the text to **copy-paste** — you add the image and hit *Post*.

It runs two ways, and you can use either or both:

| Mode | What you get | Azure needed? |
| --- | --- | --- |
| **Local CLI** | Run one command, get today's posts in your terminal + a Markdown file | ❌ No |
| **GitHub Actions** | A daily workflow opens a **GitHub Issue** with the posts (+ optional Gmail email) — free, no server | ❌ No |
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
│   ├── src/lib/               config (editions), source (pluggable), fetch,
│   │                          format, storage, email — the reusable core
│   ├── src/functions/         dailyDigest + dailyDigestIndia (timers),
│   │                          posts (HTTP), runNow (HTTP)
│   └── src/scripts/digest.ts  local CLI entry point (runs all editions)
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

This runs **all editions** (US + India by default), prints each post in the
terminal, and writes a file per edition to `api/output/<date>-<edition>.md`.
Tune what you get with env vars (or a `.env` file in the repo root) — see
`.env.example`:

```bash
# just the US edition, wider window
MSJOBS_MAX_AGE_HOURS=48 MSJOBS_MAX_JOBS=10 npm run digest -- --edition=us

# India, senior roles only
MSJOBS_INDIA_TITLE_INCLUDES="Senior,Principal" npm run digest -- --edition=india
```

Useful flags: `--edition=<key>` (run one edition), `--dedup` (respect blob dedup
state), `--save` (persist to Azure if `AZURE_STORAGE_CONNECTION_STRING` is set),
`--email` (send via ACS).

---

## Option B — Daily posts via GitHub Actions (free, no Azure)

`.github/workflows/daily-post.yml` runs the pipeline on GitHub's runners every
morning and delivers the posts two ways:

1. **A GitHub Issue** in this repo — you get GitHub's email notification automatically.
2. **An email to your inbox** via Gmail SMTP (optional).

You copy the post, add your image, and post to LinkedIn manually. If a run finds
no new jobs, nothing is sent. Each run also uploads `post.txt` as a workflow
artifact (backup copy).

### Configure
Edit the `env:` block at the top of the workflow:

| Var | Default | Meaning |
| --- | --- | --- |
| `FILTER_COUNTRY` | `United States` | `United States`, `India`, or `""` for all |
| `MAX_JOBS_TOTAL` | `30` | Cap on jobs per day |
| `LOOKBACK_HOURS` | `24` | Posting window |
| `FILTER_TITLE_KEYWORDS` | *(none)* | e.g. `software engineer,senior` |

Schedule is the `cron` line (`0 11 * * *` = 11:00 UTC = 07:00 EDT / 06:00 EST).

### Optional email delivery
Add these repo secrets (**Settings → Secrets and variables → Actions**). Skip
them and the Issue notification alone still works (the email step is
`continue-on-error`).

| Secret | Value |
| --- | --- |
| `GMAIL_USERNAME` | your Gmail address |
| `GMAIL_APP_PASSWORD` | an app password from https://myaccount.google.com/apppasswords (needs 2FA on) |
| `MAIL_TO` | where to receive the post, e.g. you@example.com |

### Test it
**Actions** tab → **Daily Microsoft Jobs LinkedIn Post** → **Run workflow**.
Within ~2 minutes you should see a new Issue with the formatted posts.

---

## Option C — Deploy the automated Azure pipeline

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

### Deploy from CI (Azure OIDC — no local az needed)

`.github/workflows/deploy-azure.yml` provisions the infra (Bicep) and deploys
the Function App + dashboard straight from GitHub Actions, authenticating with
Azure via **OIDC** (no passwords/publish-profiles in the repo). Note: `az login`
is interactive, so it can't run inside a headless agent — CI (or your own
machine) is where the Azure connection actually happens.

**One-time setup** (run where you have Azure CLI, e.g. your laptop or the
[Azure Cloud Shell](https://shell.azure.com)):

```bash
az login
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
TENANT_ID=$(az account show --query tenantId -o tsv)

# 1. App registration + service principal
APP_ID=$(az ad app create --display-name msjobs-deployer --query appId -o tsv)
az ad sp create --id "$APP_ID" -o none

# 2. Federated credential so GitHub Actions can log in as this app (no secret)
az ad app federated-credential create --id "$APP_ID" --parameters '{
  "name": "github-main",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:DandaAkhilReddy/agentchainswebsite:ref:refs/heads/main",
  "audiences": ["api://AzureADTokenExchange"]
}'

# 3. Give it permission to deploy into your subscription
az role assignment create --assignee "$APP_ID" --role Contributor \
  --scope "/subscriptions/$SUBSCRIPTION_ID"

echo "AZURE_CLIENT_ID=$APP_ID"
echo "AZURE_TENANT_ID=$TENANT_ID"
echo "AZURE_SUBSCRIPTION_ID=$SUBSCRIPTION_ID"
```

Add those three values as repo secrets (**Settings → Secrets and variables →
Actions**): `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`.
(The `subject` above pins deploys to the `main` branch — change the ref if you
deploy from another branch.)

**Deploy:** Actions → **Deploy to Azure** → **Run workflow**. It prints the
dashboard URL + API base in the run summary.

### What gets created (all free / consumption)
- **Storage account** — daily digests + dedup state (and the Functions runtime store)
- **Function App** (Linux, Node 20, Consumption Y1) — timer + HTTP endpoints
- **Application Insights** — logs/metrics
- **Static Web App** (Free) — the dashboard
- **Communication Services + Email** (Azure-managed domain) — emails the daily
  digest automatically. Defaults to `areddy@hhamedicine.com`; override with the
  `emailTo` Bicep param, or set `enableEmail=false` to turn email off. No DNS
  setup — the managed `*.azurecomm.net` domain sends `DoNotReply@…` out of the box.

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
| `/api/posts` | GET | Latest saved digest (JSON) — the dashboard reads this. `?edition=us\|india` picks the edition; `?generate=1` builds one on first run. |
| `/api/run` | GET/POST | Run the pipeline on demand. `?edition=` picks the edition, `?all=1` ignores dedup. (function-key protected) |
| `dailyDigest` | timer | Scheduled daily US run. |
| `dailyDigestIndia` | timer | Scheduled daily India run (only when the India edition is enabled). |

---

## Editions (US + India)

The pipeline runs one or more **editions** — independent digests with their own
filters, schedule, storage, and dashboard tab. Two ship by default:

| Edition | Locations | Default schedule | Toggle |
| --- | --- | --- | --- |
| `us` | United States | 07:30 UTC | always on |
| `india` | India | 03:30 UTC (09:00 IST) | `MSJOBS_INDIA_ENABLED=false` to disable |

Each has its own timer function, its own `editions/<key>/…` blob subtree (so
de-dup never bleeds across editions), and its own dashboard dropdown entry
(`?edition=india`). Every `MSJOBS_*` knob has an `MSJOBS_INDIA_*` twin. Adding a
third edition (e.g. UK) is a few lines in `api/src/lib/config.ts` plus one timer.

## Job sources (pluggable)

Fetching sits behind a `JobSource` interface (`api/src/lib/source.ts`):

- **`api`** (default) — Microsoft's careers JSON API. This is the same endpoint
  the careers site itself calls and that virtually every "MS jobs scraper" uses
  under the hood. Fast, structured, and light enough for the free Consumption plan.
- **`playwright`** (stubbed) — a documented drop-in browser fallback for the day
  Microsoft locks the JSON endpoint down. It's intentionally **not** implemented
  or wired to a dependency, because a headless browser won't run on Consumption
  (you'd move to a Premium/container plan first). See
  `api/src/lib/playwrightSource.ts` for the exact activation steps.

Select per-edition with `MSJOBS_SOURCE` / `MSJOBS_INDIA_SOURCE`.

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
| `MSJOBS_SCHEDULE` | `0 30 7 * * *` | US timer (NCRONTAB) |
| `MSJOBS_SOURCE` | `api` | Fetch source: `api` or `playwright` |
| `MSJOBS_INDIA_ENABLED` | `true` | Enable the India edition |
| `MSJOBS_INDIA_*` | *(mirror of `MSJOBS_*`)* | India edition overrides (locations `India`, schedule `0 30 3 * * *`) |
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
