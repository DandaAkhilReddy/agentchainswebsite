/**
 * Azure Blob Storage persistence: daily digests + dedup state, scoped per edition.
 *
 * Layout inside the container (default "digests"), one subtree per edition:
 *   editions/<key>/latest.json              -> most recent digest (dashboard)
 *   editions/<key>/history/<YYYY-MM-DD>.json -> one digest per day
 *   editions/<key>/state/posted-ids.json     -> ids already included in a past digest
 *
 * All methods no-op gracefully when no storage connection string is configured,
 * so the local CLI works with zero Azure setup.
 */
import { BlobServiceClient, type ContainerClient } from "@azure/storage-blob";
import type { AppConfig } from "./config.js";
import type { Digest } from "./types.js";

const STATE_TTL_DAYS = 45;

export class DigestStore {
  private container: ContainerClient | null = null;
  private prefix: string;

  /** @param editionKey scopes all blob paths under editions/<key>/ */
  constructor(private cfg: AppConfig, editionKey: string) {
    this.prefix = `editions/${editionKey}`;
  }

  get enabled(): boolean {
    return Boolean(this.cfg.storageConnection);
  }

  private path(name: string): string {
    return `${this.prefix}/${name}`;
  }

  private async getContainer(): Promise<ContainerClient> {
    if (this.container) return this.container;
    const service = BlobServiceClient.fromConnectionString(this.cfg.storageConnection);
    const container = service.getContainerClient(this.cfg.blobContainer);
    await container.createIfNotExists();
    this.container = container;
    return container;
  }

  private async readJson<T>(blobName: string): Promise<T | null> {
    if (!this.enabled) return null;
    try {
      const container = await this.getContainer();
      const blob = container.getBlockBlobClient(blobName);
      if (!(await blob.exists())) return null;
      const buf = await blob.downloadToBuffer();
      return JSON.parse(buf.toString("utf8")) as T;
    } catch {
      return null;
    }
  }

  private async writeJson(blobName: string, value: unknown): Promise<void> {
    if (!this.enabled) return;
    const container = await this.getContainer();
    const blob = container.getBlockBlobClient(blobName);
    const body = JSON.stringify(value, null, 2);
    await blob.upload(body, Buffer.byteLength(body), {
      blobHTTPHeaders: { blobContentType: "application/json; charset=utf-8" },
    });
  }

  /** Ids already posted in a previous digest, for de-duplication. */
  async loadPostedIds(): Promise<Set<string>> {
    const state = await this.readJson<{ ids: { id: string; at: string }[] }>(
      this.path("state/posted-ids.json"),
    );
    return new Set((state?.ids ?? []).map((e) => e.id));
  }

  /** Record newly-included ids and prune entries older than the TTL. */
  async recordPostedIds(ids: string[]): Promise<void> {
    if (!this.enabled || ids.length === 0) return;
    const stateBlob = this.path("state/posted-ids.json");
    const state = (await this.readJson<{ ids: { id: string; at: string }[] }>(stateBlob)) ?? {
      ids: [],
    };
    const now = new Date();
    const nowIso = now.toISOString();
    const cutoff = now.getTime() - STATE_TTL_DAYS * 86_400_000;
    const existing = state.ids.filter((e) => new Date(e.at).getTime() >= cutoff);
    const merged = new Map(existing.map((e) => [e.id, e]));
    for (const id of ids) if (!merged.has(id)) merged.set(id, { id, at: nowIso });
    await this.writeJson(stateBlob, { ids: [...merged.values()] });
  }

  async saveDigest(digest: Digest): Promise<void> {
    if (!this.enabled) return;
    await this.writeJson(this.path("latest.json"), digest);
    await this.writeJson(this.path(`history/${digest.date}.json`), digest);
  }

  async loadLatest(): Promise<Digest | null> {
    return this.readJson<Digest>(this.path("latest.json"));
  }
}
