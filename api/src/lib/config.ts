/** Central configuration, read from environment variables with safe defaults. */

function str(name: string, fallback = ""): string {
  const v = process.env[name];
  return v === undefined || v === null ? fallback : v.trim();
}

function num(name: string, fallback: number): number {
  const v = Number(process.env[name]);
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

function list(name: string, fallback: string[] = []): string[] {
  const raw = str(name);
  if (!raw) return fallback;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export interface AppConfig {
  query: string;
  locations: string[];
  titleIncludes: string[];
  titleExcludes: string[];
  maxAgeHours: number;
  maxJobs: number;
  maxPages: number;
  schedule: string;
  storageConnection: string;
  blobContainer: string;
  acsConnection: string;
  acsSender: string;
  emailTo: string[];
}

export function loadConfig(): AppConfig {
  return {
    query: str("MSJOBS_QUERY", "Software Engineer"),
    locations: list("MSJOBS_LOCATIONS", ["United States"]),
    titleIncludes: list("MSJOBS_TITLE_INCLUDES"),
    titleExcludes: list("MSJOBS_TITLE_EXCLUDES", ["Intern", "Internship"]),
    maxAgeHours: num("MSJOBS_MAX_AGE_HOURS", 24),
    maxJobs: num("MSJOBS_MAX_JOBS", 15),
    maxPages: num("MSJOBS_MAX_PAGES", 4),
    schedule: str("MSJOBS_SCHEDULE", "0 30 7 * * *"),
    storageConnection: str("AZURE_STORAGE_CONNECTION_STRING"),
    blobContainer: str("MSJOBS_BLOB_CONTAINER", "digests"),
    acsConnection: str("ACS_CONNECTION_STRING"),
    acsSender: str("ACS_SENDER_ADDRESS"),
    emailTo: list("MSJOBS_EMAIL_TO"),
  };
}
