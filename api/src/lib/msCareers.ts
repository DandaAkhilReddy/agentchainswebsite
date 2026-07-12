/**
 * Client for Microsoft's public careers search API.
 *
 * The careers site (https://jobs.careers.microsoft.com) is a SPA backed by a
 * JSON API at gcsservices.careers.microsoft.com. We use two endpoints:
 *   - /search/api/v1/search        -> paginated list of jobs (no description)
 *   - /search/api/v1/job/{id}      -> full detail incl. description + pay range
 *
 * Nothing here requires auth. We send a browser-like User-Agent because the CDN
 * rejects some default agents.
 */
import type { AppConfig } from "./config.js";
import type { Job } from "./types.js";

const SEARCH_URL = "https://gcsservices.careers.microsoft.com/search/api/v1/search";
const JOB_URL = "https://gcsservices.careers.microsoft.com/search/api/v1/job";
const PUBLIC_JOB_URL = "https://jobs.careers.microsoft.com/global/en/job";
const PAGE_SIZE = 20;

const HEADERS = {
  Accept: "application/json",
  "Accept-Language": "en-US,en;q=0.9",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  Referer: "https://jobs.careers.microsoft.com/",
};

interface RawSearchJob {
  jobId: string;
  title: string;
  postingDate: string;
  properties?: {
    locations?: string[];
    primaryLocation?: string;
    employmentType?: string;
    workSiteFlexibility?: string;
    profession?: string;
    discipline?: string;
    roleType?: string;
  };
}

async function getJson(url: string): Promise<any> {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) {
    throw new Error(`Microsoft careers API ${res.status} ${res.statusText} for ${url}`);
  }
  return res.json();
}

function buildSearchUrl(cfg: AppConfig, page: number): string {
  const params = new URLSearchParams({
    l: "en_us",
    pg: String(page),
    pgSz: String(PAGE_SIZE),
    o: "Recent",
    flt: "true",
  });
  if (cfg.query) params.set("q", cfg.query);
  // The API accepts a single location hint via `lc`; broader location filtering
  // is done client-side against each job's `locations` array.
  if (cfg.locations.length === 1) params.set("lc", cfg.locations[0]);
  return `${SEARCH_URL}?${params.toString()}`;
}

/** Strip HTML tags and collapse whitespace into a plain-text string. */
export function htmlToText(html: string): string {
  return (html || "")
    .replace(/<\s*br\s*\/?\s*>/gi, " ")
    .replace(/<\/(p|li|div|h[1-6])>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;|&rsquo;|&lsquo;/gi, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/** Extract a US pay-transparency range from a description, if present. */
export function extractPayRange(text: string): string {
  // Matches "USD $137,600 - $272,800 per year" and similar variants.
  const m = text.match(
    /(USD\s*)?\$\s?[\d,]{4,}\s*[-–to]{1,3}\s*\$?\s?[\d,]{4,}(\s*(USD|per year|annually|\/year))?/i,
  );
  if (!m) return "";
  return m[0].replace(/\s+/g, " ").trim();
}

/** Derive a seniority label from the title + role type. */
export function deriveLevel(title: string, roleType: string): string {
  const t = title.toLowerCase();
  if (/\b(intern|internship)\b/.test(t)) return "Internship";
  if (/\b(new grad|university|graduate|entry[- ]level|early in career|aspire)\b/.test(t))
    return "Entry / New Grad";
  if (/\b(principal|principle)\b/.test(t)) return "Principal";
  if (/\b(distinguished|fellow)\b/.test(t)) return "Distinguished";
  if (/\b(partner)\b/.test(t)) return "Partner";
  if (/\b(director|gm|general manager|vp|vice president|head of)\b/.test(t)) return "Leadership";
  if (/\b(senior|sr\.?|staff|lead)\b/.test(t)) return "Senior";
  if (/\bii\b|\b2\b/.test(t)) return "Mid (L60/62)";
  if (/\bmanager\b/.test(t)) return "Manager";
  return roleType || "Individual Contributor";
}

/** Build the public apply URL for a job id. */
export function jobUrl(id: string): string {
  return `${PUBLIC_JOB_URL}/${id}`;
}

/** Fetch one page of search results, normalized (without descriptions yet). */
async function fetchSearchPage(cfg: AppConfig, page: number): Promise<RawSearchJob[]> {
  const data = await getJson(buildSearchUrl(cfg, page));
  const jobs = data?.operationResult?.result?.jobs;
  return Array.isArray(jobs) ? jobs : [];
}

/** Fetch full detail (description + pay range) for a single job. */
async function fetchDetail(id: string): Promise<{ summary: string; payRange: string }> {
  try {
    const data = await getJson(`${JOB_URL}/${id}?lang=en_us`);
    const result = data?.operationResult?.result ?? {};
    const descText = htmlToText(result.description ?? "");
    const respText = htmlToText(result.responsibilities ?? "");
    const qualText = htmlToText(result.qualifications ?? "");
    const summary = descText || respText;
    const payRange = extractPayRange(`${descText} ${qualText}`);
    return { summary, payRange };
  } catch {
    return { summary: "", payRange: "" };
  }
}

function ageHours(postingDate: string): number {
  const posted = new Date(postingDate).getTime();
  if (!Number.isFinite(posted)) return Number.POSITIVE_INFINITY;
  return (Date.now() - posted) / 3_600_000;
}

function matchesLocations(job: RawSearchJob, wanted: string[]): boolean {
  if (wanted.length === 0) return true;
  const hay = [job.properties?.primaryLocation ?? "", ...(job.properties?.locations ?? [])]
    .join(" | ")
    .toLowerCase();
  return wanted.some((w) => hay.includes(w.toLowerCase()));
}

function matchesTitle(title: string, includes: string[], excludes: string[]): boolean {
  const t = title.toLowerCase();
  if (excludes.some((w) => t.includes(w.toLowerCase()))) return false;
  if (includes.length === 0) return true;
  return includes.some((w) => t.includes(w.toLowerCase()));
}

/**
 * Fetch fresh Microsoft jobs matching the configured filters, newest first,
 * each enriched with a description teaser and pay range.
 */
export async function fetchFreshJobs(cfg: AppConfig): Promise<Job[]> {
  const raw: RawSearchJob[] = [];
  for (let page = 1; page <= cfg.maxPages; page++) {
    const pageJobs = await fetchSearchPage(cfg, page);
    if (pageJobs.length === 0) break;
    raw.push(...pageJobs);
    // Results are ordered newest-first; once a page is entirely too old we stop.
    const allTooOld = pageJobs.every((j) => ageHours(j.postingDate) > cfg.maxAgeHours);
    if (allTooOld) break;
  }

  const filtered = raw.filter(
    (j) =>
      ageHours(j.postingDate) <= cfg.maxAgeHours &&
      matchesLocations(j, cfg.locations) &&
      matchesTitle(j.title, cfg.titleIncludes, cfg.titleExcludes),
  );

  // De-dup by id (a role can appear under multiple locations) and cap.
  const seen = new Set<string>();
  const unique = filtered.filter((j) => (seen.has(j.jobId) ? false : seen.add(j.jobId)));
  unique.sort((a, b) => +new Date(b.postingDate) - +new Date(a.postingDate));
  const capped = unique.slice(0, cfg.maxJobs);

  // Enrich with details (bounded concurrency to be polite to the API).
  const jobs: Job[] = [];
  const CONCURRENCY = 4;
  for (let i = 0; i < capped.length; i += CONCURRENCY) {
    const batch = capped.slice(i, i + CONCURRENCY);
    const details = await Promise.all(batch.map((j) => fetchDetail(j.jobId)));
    batch.forEach((j, idx) => {
      const p = j.properties ?? {};
      const { summary, payRange } = details[idx];
      jobs.push({
        id: j.jobId,
        title: j.title,
        postingDate: j.postingDate,
        primaryLocation: p.primaryLocation || (p.locations?.[0] ?? "Microsoft"),
        locations: p.locations ?? [],
        employmentType: p.employmentType || "Full-Time",
        workSiteFlexibility: p.workSiteFlexibility || "",
        profession: p.profession || "",
        discipline: p.discipline || "",
        roleType: p.roleType || "",
        level: deriveLevel(j.title, p.roleType || ""),
        summary,
        payRange,
        url: jobUrl(j.jobId),
      });
    });
  }
  return jobs;
}
