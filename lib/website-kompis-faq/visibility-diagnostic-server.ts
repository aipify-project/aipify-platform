import "server-only";

import {
  isRelevantPublicCompanionTenantFaqResult,
  searchPublicCompanionTenantFaq,
} from "@/lib/marketing/public-companion-tenant-faq";
import { normalizeWebsiteKompisInstallConfig } from "@/lib/marketing/website-kompis-install-config";
import { loadWebsiteKompisInstallConfigForApp } from "@/lib/marketing/website-kompis-install-config-storage";
import { parseWebsiteKompisFaqItem } from "@/lib/website-kompis-faq/parse";
import type { WebsiteKompisFaqItem } from "@/lib/website-kompis-faq/types";
import {
  FAQ_VISIBILITY_VISITOR_LOCALES,
  buildFaqLocaleDryRunResult,
  buildFaqVisibilityDiagnosticReport,
  evaluateFaqVisibilityEligibility,
  resolveFaqVisibilityProbeQuery,
  type FaqSourceEnablement,
  type FaqVisibilityDiagnosticReport,
  type FaqVisibilityVisitorLocale,
} from "@/lib/website-kompis-faq/visibility-diagnostic";
import type { SupabaseClient } from "@supabase/supabase-js";

const FAQ_ITEM_SELECT =
  "id, install_id, domain, locale, title, question, answer, category, content_type, status, public_safe, priority, tags, source_url, valid_from, valid_until, last_reviewed_at, published_at, created_at, updated_at";

export async function loadTenantFaqItemForVisibilityDiagnostic(
  supabase: Pick<SupabaseClient, "from">,
  itemId: string,
): Promise<WebsiteKompisFaqItem | null> {
  const { data, error } = await supabase
    .from("tenant_public_companion_faq_items")
    .select(FAQ_ITEM_SELECT)
    .eq("id", itemId)
    .maybeSingle();

  if (error || !data || typeof data !== "object") {
    return null;
  }

  try {
    return parseWebsiteKompisFaqItem(data as Record<string, unknown>);
  } catch {
    return null;
  }
}

export async function resolveFaqSourceEnablementForInstall(
  supabase: Pick<SupabaseClient, "rpc">,
  installId: string | null,
): Promise<FaqSourceEnablement> {
  if (!installId) return "unknown";
  try {
    const rpcResult = await loadWebsiteKompisInstallConfigForApp(supabase, installId);
    if (!rpcResult?.ok) return "unknown";
    const config = normalizeWebsiteKompisInstallConfig(
      rpcResult.normalized_config ?? rpcResult.config ?? {},
    );
    return config.sources.faq ? "enabled" : "disabled";
  } catch {
    return "unknown";
  }
}

async function runLocaleDryRun(input: {
  item: WebsiteKompisFaqItem;
  visitorLocale: FaqVisibilityVisitorLocale;
  selectedInstallId: string | null;
  selectedDomain: string | null;
  faqSource: FaqSourceEnablement;
  nowMs: number;
  probeQuery: string;
}): Promise<ReturnType<typeof buildFaqLocaleDryRunResult>> {
  const eligibility = evaluateFaqVisibilityEligibility(input.item, {
    selectedInstallId: input.selectedInstallId,
    selectedDomain: input.selectedDomain,
    faqSource: input.faqSource,
    nowMs: input.nowMs,
    visitorLocale: input.visitorLocale,
  });

  const installId = input.item.installId ?? input.selectedInstallId;
  const domain = input.item.domain ?? input.selectedDomain;

  if (!installId && !domain) {
    return buildFaqLocaleDryRunResult({
      visitorLocale: input.visitorLocale,
      eligibility,
      dryRunSkipped: true,
      skipReason: "missing_context",
    });
  }

  if (eligibility.structuralReasons.length > 0 || !eligibility.eligibleForPathA) {
    return buildFaqLocaleDryRunResult({
      visitorLocale: input.visitorLocale,
      eligibility,
      dryRunSkipped: true,
      skipReason: "ineligible",
    });
  }

  let rows;
  try {
    rows = await searchPublicCompanionTenantFaq({
      installId,
      domain,
      locale: input.visitorLocale,
      query: input.probeQuery,
      limit: 5,
    });
  } catch {
    return buildFaqLocaleDryRunResult({
      visitorLocale: input.visitorLocale,
      eligibility,
      dryRunSkipped: true,
      skipReason: "rpc_unavailable",
    });
  }

  const candidate = rows.find((row) => row.item_id === input.item.id) ?? null;
  const relevant = isRelevantPublicCompanionTenantFaqResult(rows, input.probeQuery);
  const top = relevant ? rows[0] ?? null : null;

  return buildFaqLocaleDryRunResult({
    visitorLocale: input.visitorLocale,
    eligibility,
    sqlCandidateMatch: candidate != null,
    wouldBeSelectedAnswer: Boolean(relevant && top?.item_id === input.item.id),
    topMatchedItemId: top?.item_id ?? null,
    topScore: top?.score ?? candidate?.score ?? null,
  });
}

export async function buildFaqVisibilityDiagnosticForItem(input: {
  supabase: Pick<SupabaseClient, "from" | "rpc">;
  itemId: string;
  selectedInstallId?: string | null;
  selectedDomain?: string | null;
  nowMs?: number;
}): Promise<
  | { ok: true; report: FaqVisibilityDiagnosticReport }
  | { ok: false; code: "not_found" }
> {
  const item = await loadTenantFaqItemForVisibilityDiagnostic(input.supabase, input.itemId);
  if (!item) {
    return { ok: false, code: "not_found" };
  }

  const selectedInstallId = input.selectedInstallId ?? item.installId;
  const selectedDomain = input.selectedDomain ?? item.domain;
  const faqSource = await resolveFaqSourceEnablementForInstall(
    input.supabase,
    item.installId ?? selectedInstallId,
  );
  const nowMs = input.nowMs ?? Date.now();
  const probeQuery = resolveFaqVisibilityProbeQuery(item);

  const dryRuns = [];
  for (const visitorLocale of FAQ_VISIBILITY_VISITOR_LOCALES) {
    dryRuns.push(
      await runLocaleDryRun({
        item,
        visitorLocale,
        selectedInstallId,
        selectedDomain,
        faqSource,
        nowMs,
        probeQuery,
      }),
    );
  }

  return {
    ok: true,
    report: buildFaqVisibilityDiagnosticReport({
      item,
      selectedInstallId,
      selectedDomain,
      faqSource,
      nowMs,
      dryRuns,
    }),
  };
}
