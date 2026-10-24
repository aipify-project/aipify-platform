import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { faqCountContractMissing } from "@/lib/website-kompis-faq/count-contract";
import { resolveFaqContentLanguageForSave } from "@/lib/website-kompis-faq/content-languages";
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

const LINK_CONFLICTS = new Set([
  "family_conflict",
  "locale_taken",
  "locale_mismatch",
  "website",
  "archived",
  "same_row",
  "invalid_locale",
  "conflict",
]);

export async function GET(request: Request) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const url = new URL(request.url);
  const itemId = readUuid(url.searchParams.get("itemId"));
  const locale = resolveFaqContentLanguageForSave(url.searchParams.get("locale") ?? "", null);
  const query = (url.searchParams.get("q") ?? "").trim().slice(0, 80);
  if (!itemId || !locale) {
    return NextResponse.json({ error: "FAQ language version is invalid", code: "invalid_locale" }, { status: 400 });
  }

  const { data, error } = await auth.supabase.rpc("search_tenant_public_companion_faq_locale_candidates", {
    p_source_item_id: itemId,
    p_locale: locale,
    p_query: query,
  });
  if (error) {
    if (rpcUnavailable(error) || /not linked/i.test(error.message)) {
      return NextResponse.json(
        { error: "FAQ language family is not available", code: "translation_group_unavailable" },
        { status: 503 },
      );
    }
    if (roleDenied(error)) return NextResponse.json({ error: "Owner or admin role required" }, { status: 403 });
    if (/not found/i.test(error.message)) return NextResponse.json({ error: "FAQ item not found" }, { status: 404 });
    return NextResponse.json({ error: "FAQ translations could not be searched", code: "locale_link_failed" }, { status: 400 });
  }

  const payload = data as { candidates?: unknown } | null;
  const candidates = Array.isArray(payload?.candidates) ? payload.candidates : [];
  return NextResponse.json({ candidates });
}

export async function POST(request: Request) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const body = (await request.json()) as Record<string, unknown>;
  const sourceItemId = readUuid(typeof body.sourceItemId === "string" ? body.sourceItemId : null);
  const candidateId = readUuid(typeof body.candidateId === "string" ? body.candidateId : null);
  const locale = resolveFaqContentLanguageForSave(typeof body.locale === "string" ? body.locale : "", null);
  if (!sourceItemId || !candidateId || !locale) {
    return NextResponse.json({ error: "FAQ language version is invalid", code: "invalid_locale" }, { status: 400 });
  }
  if (body.confirmed !== true) {
    return NextResponse.json({ error: "Confirmation is required", code: "confirmation_required" }, { status: 400 });
  }

  const { data, error } = await auth.supabase.rpc("link_tenant_public_companion_faq_locale_member", {
    p_source_item_id: sourceItemId,
    p_candidate_id: candidateId,
    p_locale: locale,
    p_confirmed: true,
  });
  if (error) {
    if (rpcUnavailable(error) || /not linked/i.test(error.message)) {
      return NextResponse.json(
        { error: "FAQ language family is not available", code: "translation_group_unavailable" },
        { status: 503 },
      );
    }
    if (roleDenied(error)) return NextResponse.json({ error: "Owner or admin role required" }, { status: 403 });
    if (/not found/i.test(error.message)) return NextResponse.json({ error: "FAQ item not found" }, { status: 404 });
    return NextResponse.json({ error: "FAQ translation was not linked", code: "locale_link_failed" }, { status: 400 });
  }

  const payload = data as { outcome?: string; code?: string; item?: Record<string, unknown> } | null;
  const code = payload?.code ?? "";
  if (code && LINK_CONFLICTS.has(code)) {
    return NextResponse.json({ error: "FAQ translation was not linked", code }, { status: 409 });
  }
  if ((payload?.outcome === "linked" || payload?.outcome === "already_linked") && payload.item) {
    try {
      return NextResponse.json({ outcome: payload.outcome, item: parseWebsiteKompisFaqItem(payload.item) });
    } catch {
      return NextResponse.json({ error: "FAQ translation was not linked", code: "locale_link_failed" }, { status: 400 });
    }
  }
  return NextResponse.json({ error: "FAQ translation was not linked", code: "locale_link_failed" }, { status: 400 });
}
