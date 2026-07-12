/**
 * Optional email delivery via Azure Communication Services (ACS) Email.
 *
 * Entirely optional: if ACS is not configured, sendDigestEmail() is a no-op.
 * The dependency is loaded dynamically so the pipeline still runs when the
 * optional @azure/communication-email package isn't installed.
 */
import type { AppConfig } from "./config.js";
import type { Digest } from "./types.js";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function digestToHtml(digest: Digest): string {
  const blocks = digest.posts
    .map(
      (p, i) => `
      <h3 style="margin:24px 0 8px;font-family:Segoe UI,Arial,sans-serif">${i + 1}. ${escapeHtml(
        p.job.title,
      )}</h3>
      <pre style="white-space:pre-wrap;background:#f5f5f7;border:1px solid #e2e2e6;border-radius:8px;padding:16px;font-family:Consolas,Menlo,monospace;font-size:13px;line-height:1.5">${escapeHtml(
        p.text,
      )}</pre>`,
    )
    .join("\n");
  return `<div style="max-width:640px;margin:0 auto">
    <h2 style="font-family:Segoe UI,Arial,sans-serif">Microsoft jobs → LinkedIn — ${digest.date}</h2>
    <p style="font-family:Segoe UI,Arial,sans-serif;color:#444">${digest.count} new posting(s). Copy any block below into LinkedIn and add your image.</p>
    ${blocks}
  </div>`;
}

export async function sendDigestEmail(cfg: AppConfig, digest: Digest): Promise<boolean> {
  if (!cfg.acsConnection || !cfg.acsSender || cfg.emailTo.length === 0) return false;
  if (digest.count === 0) return false;

  let EmailClient: any;
  try {
    ({ EmailClient } = await import("@azure/communication-email"));
  } catch {
    // Optional dependency not installed — silently skip email delivery.
    return false;
  }

  const client = new EmailClient(cfg.acsConnection);
  const poller = await client.beginSend({
    senderAddress: cfg.acsSender,
    content: {
      subject: `Microsoft jobs → LinkedIn (${digest.count}) — ${digest.date}`,
      html: digestToHtml(digest),
    },
    recipients: { to: cfg.emailTo.map((address) => ({ address })) },
  });
  await poller.pollUntilDone();
  return true;
}
