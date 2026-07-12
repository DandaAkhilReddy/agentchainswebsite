/** Renders a normalized Job into a copy-paste-ready LinkedIn post. */
import type { Job, RenderedPost } from "./types.js";

/** Trim a summary to a clean sentence-ish teaser of ~maxLen chars. */
function teaser(summary: string, maxLen = 280): string {
  if (!summary) return "";
  const clean = summary.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLen) return clean;
  const cut = clean.slice(0, maxLen);
  const lastStop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
  if (lastStop > maxLen * 0.5) return cut.slice(0, lastStop + 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLen).trim()}…`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Emoji chosen from the job's discipline/profession for a little variety. */
function disciplineEmoji(job: Job): string {
  const key = `${job.profession} ${job.discipline} ${job.title}`.toLowerCase();
  if (/data|machine learning|\bml\b|\bai\b|scientist/.test(key)) return "🤖";
  if (/security|crypto/.test(key)) return "🔐";
  if (/hardware|silicon|electrical/.test(key)) return "🔧";
  if (/design|ux|research/.test(key)) return "🎨";
  if (/product manage/.test(key)) return "📦";
  if (/program manage/.test(key)) return "🗂️";
  if (/cloud|azure|infrastructure|devops|site reliab/.test(key)) return "☁️";
  if (/software|engineer|developer/.test(key)) return "💻";
  if (/sales|account|marketing/.test(key)) return "📈";
  if (/finance|accounting/.test(key)) return "💰";
  return "💼";
}

const HASHTAGS = [
  "#Microsoft",
  "#Hiring",
  "#TechJobs",
  "#NowHiring",
  "#Careers",
  "#JobSearch",
];

/**
 * Build the LinkedIn post text for a single job.
 *
 * Layout (all fields degrade gracefully if data is missing):
 *   🚀 We're hiring at Microsoft!
 *   💻 <Title>
 *   📍 <Location>   🎯 <Level>   🕐 <Employment>
 *   💰 <Pay range>
 *   🗓️ Posted <date>
 *   <one-paragraph teaser>
 *   🔗 Apply: <url>
 *   <hashtags>
 */
export function renderPost(job: Job): RenderedPost {
  const lines: string[] = [];
  const emoji = disciplineEmoji(job);

  lines.push("🚀 We're hiring at Microsoft!");
  lines.push("");
  lines.push(`${emoji} ${job.title}`);

  const meta: string[] = [];
  if (job.primaryLocation) meta.push(`📍 ${job.primaryLocation}`);
  if (job.level) meta.push(`🎯 ${job.level}`);
  if (job.employmentType) meta.push(`🕐 ${job.employmentType}`);
  if (meta.length) lines.push(meta.join("   "));

  if (job.workSiteFlexibility) lines.push(`🏠 ${job.workSiteFlexibility}`);
  lines.push(`💰 ${job.payRange || "Competitive (see listing for details)"}`);

  const posted = formatDate(job.postingDate);
  if (posted) lines.push(`🗓️ Posted ${posted}`);

  const t = teaser(job.summary);
  if (t) {
    lines.push("");
    lines.push(`📝 ${t}`);
  }

  lines.push("");
  lines.push(`🔗 Apply here: ${job.url}`);
  lines.push("");
  lines.push([...HASHTAGS, `#${job.discipline.replace(/[^a-z0-9]/gi, "")}`].filter(Boolean).join(" "));

  return { job, text: lines.join("\n") };
}

export function renderAll(jobs: Job[]): RenderedPost[] {
  return jobs.map(renderPost);
}

/** Render the whole digest as a single Markdown document (for email / CLI / file). */
export function renderMarkdown(date: string, posts: RenderedPost[]): string {
  const header = [
    `# Microsoft jobs → LinkedIn posts — ${date}`,
    "",
    `**${posts.length}** new posting${posts.length === 1 ? "" : "s"} found. ` +
      "Copy any block below straight into LinkedIn (add your image manually).",
    "",
    "---",
    "",
  ].join("\n");

  const body = posts
    .map((p, i) => {
      return [
        `## ${i + 1}. ${p.job.title}`,
        "",
        "```text",
        p.text,
        "```",
        "",
        "---",
        "",
      ].join("\n");
    })
    .join("\n");

  return header + body;
}
