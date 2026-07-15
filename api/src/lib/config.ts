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

function bool(name: string, fallback: boolean): boolean {
  const v = str(name).toLowerCase();
  if (!v) return fallback;
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

/** Which fetch implementation to use for a given edition. */
export type SourceName = "api" | "playwright";

/**
 * A single "edition" of the digest — a self-contained set of what-to-fetch and
 * how-to-filter knobs. Ship one (US) by default and optionally a second (India)
 * so different audiences get their own daily post on their own schedule.
 */
export interface Edition {
  /** Stable key used in blob paths and the ?edition= query param. */
  key: string;
  /** Human label shown in output, e.g. "United States". */
  label: string;
  source: SourceName;
  query: string;
  locations: string[];
  titleIncludes: string[];
  titleExcludes: string[];
  maxAgeHours: number;
  maxJobs: number;
  maxPages: number;
  /** NCRONTAB schedule for this edition's timer. */
  schedule: string;
}

/** Global settings shared by all editions. */
export interface AppConfig {
  storageConnection: string;
  blobContainer: string;
  acsConnection: string;
  acsSender: string;
  emailTo: string[];
  editions: Edition[];
}

interface EditionDefaults {
  key: string;
  label: string;
  locations: string[];
  schedule: string;
}

/** Build an edition from a var prefix (e.g. "MSJOBS_" or "MSJOBS_INDIA_"). */
function loadEdition(prefix: string, d: EditionDefaults): Edition {
  return {
    key: str(`${prefix}KEY`, d.key),
    label: str(`${prefix}LABEL`, d.label),
    source: (str(`${prefix}SOURCE`, str("MSJOBS_SOURCE", "api")) as SourceName) || "api",
    query: str(`${prefix}QUERY`, "Software Engineer"),
    locations: list(`${prefix}LOCATIONS`, d.locations),
    titleIncludes: list(`${prefix}TITLE_INCLUDES`),
    titleExcludes: list(`${prefix}TITLE_EXCLUDES`, ["Intern", "Internship"]),
    maxAgeHours: num(`${prefix}MAX_AGE_HOURS`, 24),
    maxJobs: num(`${prefix}MAX_JOBS`, 15),
    maxPages: num(`${prefix}MAX_PAGES`, 4),
    schedule: str(`${prefix}SCHEDULE`, d.schedule),
  };
}

export function loadConfig(): AppConfig {
  const editions: Edition[] = [
    // Primary edition (US), driven by the flat MSJOBS_* vars.
    loadEdition("MSJOBS_", {
      key: "us",
      label: "United States",
      locations: ["United States"],
      schedule: "0 30 7 * * *", // 07:30 (UTC unless WEBSITE_TIME_ZONE set)
    }),
  ];

  // Optional India edition (on by default), driven by MSJOBS_INDIA_* vars.
  // Default schedule 03:30 UTC == 09:00 IST.
  if (bool("MSJOBS_INDIA_ENABLED", true)) {
    editions.push(
      loadEdition("MSJOBS_INDIA_", {
        key: "india",
        label: "India",
        locations: ["India"],
        schedule: "0 30 3 * * *",
      }),
    );
  }

  return {
    storageConnection: str("AZURE_STORAGE_CONNECTION_STRING"),
    blobContainer: str("MSJOBS_BLOB_CONTAINER", "digests"),
    acsConnection: str("ACS_CONNECTION_STRING"),
    acsSender: str("ACS_SENDER_ADDRESS"),
    emailTo: list("MSJOBS_EMAIL_TO"),
    editions,
  };
}

/** Look up an edition by key (case-insensitive); falls back to the first edition. */
export function getEdition(cfg: AppConfig, key: string | null | undefined): Edition {
  if (!key) return cfg.editions[0];
  const found = cfg.editions.find((e) => e.key.toLowerCase() === key.toLowerCase());
  return found ?? cfg.editions[0];
}
