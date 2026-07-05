import {
  WPKF_CONTENT_TYPES,
  WPKF_STATUSES,
  type WpkfContentType,
  type WpkfStatus,
} from "@/lib/website-kompis-faq/constants";
import type {
  WebsiteKompisFaqItem,
  WebsiteKompisFaqUpsertResult,
} from "@/lib/website-kompis-faq/types";

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asNullableString(value: unknown): string | null {
  if (value == null) return null;
  const text = String(value).trim();
  return text || null;
}

function asBoolean(value: unknown): boolean {
  return value === true;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string");
}

function parseContentType(value: unknown): WpkfContentType {
  if (typeof value === "string" && WPKF_CONTENT_TYPES.includes(value as WpkfContentType)) {
    return value as WpkfContentType;
  }
  return "faq";
}

function parseStatus(value: unknown): WpkfStatus {
  if (typeof value === "string" && WPKF_STATUSES.includes(value as WpkfStatus)) {
    return value as WpkfStatus;
  }
  return "draft";
}

export function parseWebsiteKompisFaqItem(row: Record<string, unknown>): WebsiteKompisFaqItem {
  const id = asString(row.id);
  const locale = asString(row.locale);
  const title = asString(row.title);
  const answer = asString(row.answer);

  if (!id || !locale || !title || !answer) {
    throw new Error("Invalid FAQ row");
  }

  return {
    id,
    installId: asNullableString(row.install_id),
    domain: asNullableString(row.domain),
    locale,
    title,
    question: asNullableString(row.question),
    answer,
    category: asNullableString(row.category),
    contentType: parseContentType(row.content_type),
    status: parseStatus(row.status),
    publicSafe: asBoolean(row.public_safe),
    priority: asNumber(row.priority, 100),
    tags: asStringArray(row.tags),
    sourceUrl: asNullableString(row.source_url),
    validFrom: asNullableString(row.valid_from),
    validUntil: asNullableString(row.valid_until),
    lastReviewedAt: asNullableString(row.last_reviewed_at),
    publishedAt: asNullableString(row.published_at),
    createdAt: asString(row.created_at) ?? "",
    updatedAt: asString(row.updated_at) ?? "",
  };
}

export function parseWebsiteKompisFaqList(data: unknown): WebsiteKompisFaqItem[] {
  if (!Array.isArray(data)) return [];
  return data
    .filter((row): row is Record<string, unknown> => row != null && typeof row === "object")
    .map((row) => {
      try {
        return parseWebsiteKompisFaqItem(row);
      } catch {
        return null;
      }
    })
    .filter((item): item is WebsiteKompisFaqItem => item != null);
}

export function parseWebsiteKompisFaqUpsertResult(data: unknown): WebsiteKompisFaqUpsertResult {
  const row = (data ?? {}) as Record<string, unknown>;
  const id = asString(row.id);
  if (!id) throw new Error("Invalid upsert result");

  return {
    id,
    status: parseStatus(row.status),
    created: row.created === true,
  };
}

export function parseWebsiteKompisFaqActionResult(data: unknown): { id: string; status: WpkfStatus } {
  const row = (data ?? {}) as Record<string, unknown>;
  const id = asString(row.id);
  if (!id) throw new Error("Invalid action result");

  return {
    id,
    status: parseStatus(row.status),
  };
}
