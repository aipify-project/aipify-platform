import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  WPKF_ANSWER_MAX_LENGTH,
  WPKF_CATEGORY_MAX_LENGTH,
  WPKF_CONTENT_TYPES,
  WPKF_QUESTION_MAX_LENGTH,
  WPKF_SOURCE_URL_MAX_LENGTH,
  WPKF_TAG_MAX_LENGTH,
  WPKF_TITLE_MAX_LENGTH,
  type WpkfContentType,
} from "@/lib/website-kompis-faq/constants";
import { resolveFaqContentLanguageForSave } from "@/lib/website-kompis-faq/content-languages";
import { faqCountContractMissing } from "@/lib/website-kompis-faq/count-contract";
import { parseWebsiteKompisFaqItem } from "@/lib/website-kompis-faq/parse";

function rpcUnavailable(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return error.code === "42883" || faqCountContractMissing(error);
}

function roleDenied(error: { message?: string } | null): boolean {
  return /owner or admin/i.test(error?.message ?? "");
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  return { supabase };
}

function readUuid(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim().toLowerCase();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(trimmed)
    ? trimmed
    : null;
}

export async function GET(request: Request) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const url = new URL(request.url);
  const itemId = readUuid(url.searchParams.get("itemId"));
  const locale = resolveFaqContentLanguageForSave(url.searchParams.get("locale") ?? "", null);
  if (!itemId || !locale) {
    return NextResponse.json({ error: "FAQ language version is invalid", code: "invalid_locale_version" }, { status: 400 });
  }

  const { data, error } = await auth.supabase.rpc("get_tenant_public_companion_faq_locale_version", {
    p_item_id: itemId,
    p_locale: locale,
  });
  if (error) {
    if (rpcUnavailable(error)) {
      return NextResponse.json(
        { error: "FAQ language family is not available", code: "translation_group_unavailable" },
        { status: 503 },
      );
    }
    if (roleDenied(error)) {
      return NextResponse.json({ error: "Owner or admin role required" }, { status: 403 });
    }
    if (/not found/i.test(error.message)) {
      return NextResponse.json({ error: "FAQ item not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "FAQ language version could not be loaded", code: "locale_version_failed" }, { status: 400 });
  }

  const payload = data as { outcome?: string; item?: Record<string, unknown>; source_item_id?: string; translation_group_id?: string } | null;
  if (payload?.outcome === "found" && payload.item) {
    try {
      return NextResponse.json({ outcome: "found", item: parseWebsiteKompisFaqItem(payload.item) });
    } catch {
      return NextResponse.json({ error: "FAQ language version could not be loaded", code: "locale_version_failed" }, { status: 400 });
    }
  }
  if (payload?.outcome === "missing") {
    return NextResponse.json({
      outcome: "missing",
      sourceItemId: payload.source_item_id ?? itemId,
      translationGroupId: payload.translation_group_id ?? null,
    });
  }
  if (payload?.outcome === "unlinked") {
    return NextResponse.json(
      { error: "FAQ language family is not available", code: "translation_group_unavailable" },
      { status: 503 },
    );
  }
  return NextResponse.json({ error: "FAQ language version could not be loaded", code: "locale_version_failed" }, { status: 409 });
}

export async function POST(request: Request) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const body = (await request.json()) as Record<string, unknown>;
  const sourceItemId = readUuid(typeof body.sourceItemId === "string" ? body.sourceItemId : null);
  const locale = resolveFaqContentLanguageForSave(typeof body.locale === "string" ? body.locale : "", null);
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const answer = typeof body.answer === "string" ? body.answer.trim() : "";
  const question = typeof body.question === "string" ? body.question.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const contentType = WPKF_CONTENT_TYPES.includes(body.contentType as WpkfContentType)
    ? (body.contentType as WpkfContentType)
    : null;
  const priority = typeof body.priority === "number" && Number.isFinite(body.priority) ? Math.round(body.priority) : null;
  const tags = Array.isArray(body.tags)
    ? body.tags.filter((entry): entry is string => typeof entry === "string").map((entry) => entry.trim()).filter((entry) => entry && entry.length <= WPKF_TAG_MAX_LENGTH).slice(0, 20)
    : [];
  const sourceUrl = typeof body.sourceUrl === "string" ? body.sourceUrl.trim() : "";

  if (
    !sourceItemId ||
    !locale ||
    !title ||
    title.length > WPKF_TITLE_MAX_LENGTH ||
    !answer ||
    answer.length > WPKF_ANSWER_MAX_LENGTH ||
    question.length > WPKF_QUESTION_MAX_LENGTH ||
    category.length > WPKF_CATEGORY_MAX_LENGTH ||
    sourceUrl.length > WPKF_SOURCE_URL_MAX_LENGTH
  ) {
    return NextResponse.json({ error: "FAQ language version is invalid", code: "invalid_locale_version" }, { status: 400 });
  }

  const { data, error } = await auth.supabase.rpc("insert_tenant_public_companion_faq_locale_version", {
    p_source_item_id: sourceItemId,
    p_locale: locale,
    p_title: title,
    p_question: question,
    p_answer: answer,
    p_category: category,
    p_content_type: contentType,
    p_priority: priority,
    p_tags: tags,
    p_source_url: sourceUrl,
    p_valid_from: typeof body.validFrom === "string" ? body.validFrom : null,
    p_valid_until: typeof body.validUntil === "string" ? body.validUntil : null,
  });
  if (error) {
    if (rpcUnavailable(error) || /not linked/i.test(error.message)) {
      return NextResponse.json(
        { error: "FAQ language family is not available", code: "translation_group_unavailable" },
        { status: 503 },
      );
    }
    if (roleDenied(error)) {
      return NextResponse.json({ error: "Owner or admin role required" }, { status: 403 });
    }
    if (/already exists/i.test(error.message)) {
      return NextResponse.json({ error: "FAQ language version already exists", code: "locale_version_exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "FAQ language version was not created", code: "locale_version_failed" }, { status: 400 });
  }

  const created = data as { id?: string; status?: string; created?: boolean } | null;
  if (!created?.id || created.status !== "draft" || created.created !== true) {
    return NextResponse.json({ error: "FAQ language version was not created", code: "locale_version_failed" }, { status: 400 });
  }
  return NextResponse.json({ id: created.id, status: "draft", created: true });
}
