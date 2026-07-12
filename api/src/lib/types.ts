/** Shared domain types for the MS-jobs -> LinkedIn pipeline. */

/** A normalized job, distilled from the Microsoft careers API. */
export interface Job {
  id: string;
  title: string;
  /** ISO timestamp the job was first posted. */
  postingDate: string;
  /** Human-friendly primary location, e.g. "Redmond, Washington, United States". */
  primaryLocation: string;
  /** All locations the role is offered in. */
  locations: string[];
  employmentType: string;
  workSiteFlexibility: string;
  profession: string;
  discipline: string;
  roleType: string;
  /** Derived seniority label, e.g. "Senior", "Principal", "Entry / New Grad". */
  level: string;
  /** Short plain-text teaser pulled from the job description. */
  summary: string;
  /** Pay range string if the listing exposes one (US pay-transparency), else "". */
  payRange: string;
  /** Public apply/details URL. */
  url: string;
}

/** A job plus its rendered LinkedIn post text. */
export interface RenderedPost {
  job: Job;
  /** The copy-paste-ready LinkedIn post body. */
  text: string;
}

/** The full daily digest persisted to storage and served to the dashboard. */
export interface Digest {
  /** Edition key this digest belongs to, e.g. "us" or "india". */
  edition: string;
  /** Human label for the edition, e.g. "United States". */
  editionLabel: string;
  /** Calendar date the digest was generated for (YYYY-MM-DD). */
  date: string;
  /** ISO timestamp the digest was generated. */
  generatedAt: string;
  /** Number of new (deduped) jobs in this digest. */
  count: number;
  posts: RenderedPost[];
}
