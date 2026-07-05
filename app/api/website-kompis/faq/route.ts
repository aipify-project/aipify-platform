import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  WPKF_ANSWER_MAX_LENGTH,
  WPKF_CATEGORY_MAX_LENGTH,
  WPKF_CONTENT_TYPES,
  WPKF_LIST_LIMIT_DEFAULT,
  WPKF_QUERY_MAX_LENGTH,
  WPKF_QUESTION_MAX_LENGTH,
  WPKF_SOURCE_URL_MAX_LENGTH,
  WPKF_STATUSES,
  WPKF_TAG_MAX_LENGTH,
  WPKF_TITLE_MAX_LENGTH,
  type WpkfContentType,
  type WpkfStatus,
} from "@/lib/website-kompis-faq/constants";
import {
  parseWebsiteKompisFaqList,
  parseWebsiteKompisFaqUpsertResult,
} from "@/lib/website-kompis-faq/parse";

async function requireAuthenticatedSupabase() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  return { supabase };
}

function sanitizeStatus(value: string | null): WpkfStatus | null {
  if (!value) return null;
  return WPKF_STATUSES.includes(value as WpkfStatus) ? (value as WpkfStatus) : null;
}

function sanitizeContentType(value: string | null): WpkfContentType | null {
  if (!value) return null;
  return WPKF_CONTENT_TYPES.includes(value as WpkfContentType)
    ? (value as WpkfContentType)
    : null;
}

function sanitizeTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0 && entry.length <= WPKF_TAG_MAX_LENGTH)
    .slice(0, 20);
}

function sanitizeOptionalTimestamp(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return null;
  return new Date(parsed).toISOString();
}

function sanitizeOptionalUuid(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const trimmed = value.trim().toLowerCase();
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(trimmed)
  ) {
    return null;
  }
  return trimmed;
}

export async function GET(request: Request) {
  try {
    const auth = await requireAuthenticatedSupabase();
    if ("error" in auth) return auth.error;

    const url = new URL(request.url);
    const status = sanitizeStatus(url.searchParams.get("status"));
    const locale = url.searchParams.get("locale")?.trim() || null;
    const contentType = sanitizeContentType(url.searchParams.get("contentType"));
    const query = url.searchParams.get("query")?.trim().slice(0, WPKF_QUERY_MAX_LENGTH) || null;

    const { data, error } = await auth.supabase.rpc("list_tenant_public_companion_faq_items", {
      p_status: status,
      p_locale: locale,
      p_content_type: contentType,
      p_query: query,
      p_limit: WPKF_LIST_LIMIT_DEFAULT,
      p_offset: 0,
    });

    if (error) {
      const statusCode = /owner or admin/i.test(error.message) ? 403 : 400;
      return NextResponse.json({ error: error.message }, { status: statusCode });
    }

    return NextResponse.json({ items: parseWebsiteKompisFaqList(data) });
  } catch {
    return NextResponse.json({ error: "FAQ list request failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuthenticatedSupabase();
    if ("error" in auth) return auth.error;

    const body = (await request.json()) as Record<string, unknown>;

    const locale = typeof body.locale === "string" ? body.locale.trim() : "";
    const title = typeof body.title === "string" ? body.title.trim().slice(0, WPKF_TITLE_MAX_LENGTH) : "";
    const answer =
      typeof body.answer === "string" ? body.answer.trim().slice(0, WPKF_ANSWER_MAX_LENGTH) : "";
    const contentType = sanitizeContentType(
      typeof body.contentType === "string" ? body.contentType : "faq",
    );

    if (!locale || !title || !answer || !contentType) {
      return NextResponse.json(
        { error: "locale, title, answer, and contentType are required" },
        { status: 400 },
      );
    }

    const { data, error } = await auth.supabase.rpc("upsert_tenant_public_companion_faq_item", {
      p_item_id: sanitizeOptionalUuid(body.itemId),
      p_install_id: sanitizeOptionalUuid(body.installId),
      p_domain: typeof body.domain === "string" ? body.domain.trim().slice(0, 253) || null : null,
      p_locale: locale,
      p_title: title,
      p_question:
        typeof body.question === "string"
          ? body.question.trim().slice(0, WPKF_QUESTION_MAX_LENGTH) || null
          : null,
      p_answer: answer,
      p_category:
        typeof body.category === "string"
          ? body.category.trim().slice(0, WPKF_CATEGORY_MAX_LENGTH) || null
          : null,
      p_content_type: contentType,
      p_public_safe: body.publicSafe === true,
      p_priority:
        typeof body.priority === "number" && Number.isFinite(body.priority)
          ? Math.max(1, Math.min(9999, Math.round(body.priority)))
          : 100,
      p_tags: sanitizeTags(body.tags),
      p_source_url:
        typeof body.sourceUrl === "string"
          ? body.sourceUrl.trim().slice(0, WPKF_SOURCE_URL_MAX_LENGTH) || null
          : null,
      p_valid_from: sanitizeOptionalTimestamp(body.validFrom),
      p_valid_until: sanitizeOptionalTimestamp(body.validUntil),
      p_last_reviewed_at: sanitizeOptionalTimestamp(body.lastReviewedAt),
    });

    if (error) {
      const statusCode = /owner or admin/i.test(error.message) ? 403 : 400;
      return NextResponse.json({ error: error.message }, { status: statusCode });
    }

    return NextResponse.json(parseWebsiteKompisFaqUpsertResult(data));
  } catch {
    return NextResponse.json({ error: "FAQ save request failed" }, { status: 500 });
  }
}
