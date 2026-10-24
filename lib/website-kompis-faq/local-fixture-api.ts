/**
 * Local-only synthetic FAQ library for browser QA.
 * Not imported by the Customer App. Production builds must not serve it.
 */
import { FAQ_MATCH_PAGE_CAP, FAQ_MATCH_PAGE_SIZE, FAQ_PUBLIC_SAFE_BATCH_SIZE, authoritativeMatchAllowed, planPublicSafeReview } from "@/lib/website-kompis-faq/bulk-review";
import type { WpkfContentType, WpkfStatus } from "@/lib/website-kompis-faq/constants";
import {
  applyExplicitFaqLocaleLink,
  lookupExplicitFaqLocale,
  planExplicitFaqLocaleLink,
  searchExplicitFaqLocaleCandidates,
} from "@/lib/website-kompis-faq/locale-family";
import type { WebsiteKompisFaqItem } from "@/lib/website-kompis-faq/types";
import { applyAuthoritativeFaqCount, buildFaqListWindow, type FaqListWindow } from "@/lib/website-kompis-faq/list-window";
import { filterWebsiteKompisFaqItemsForSiteContext } from "@/lib/website-kompis-site-context/filter";

export const AIPIFY_FAQ_LOCAL_FIXTURE_NOT_PRODUCTION = "AIPIFY_FAQ_LOCAL_FIXTURE_NOT_PRODUCTION";

export const FIXTURE_SITE_A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
export const FIXTURE_SITE_B = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

export type FixtureRole = "owner" | "viewer" | "anonymous";
export type FixtureSites = "single" | "multi" | "none";

export type FixtureOptions = {
  count: number;
  role?: FixtureRole;
  sites?: FixtureSites;
  countFails?: boolean;
  installId?: string | null;
};

type FixtureRow = WebsiteKompisFaqItem;

export type FixtureResult = {
  status: number;
  body: Record<string, unknown>;
};

function fixtureId(index: number): string {
  return `00000000-0000-4000-8000-${index.toString(16).padStart(12, "0")}`;
}

function nowIso(): string {
  return "2026-10-23T12:00:00.000Z";
}

export function createFixtureRows(count: number): FixtureRow[] {
  const rows: FixtureRow[] = [];
  for (let index = 0; index < count; index += 1) {
    const legacy = index === 4;
    const onBeta = !legacy && index % 17 === 0 && index > 0;
    const locale = index % 3 === 0 ? "en" : index % 3 === 1 ? "no" : "sv";
    let status: WpkfStatus = "draft";
    let publicSafe = false;
    let title = `Synthetic question ${index + 1}`;
    let answer = "Public opening hours for the synthetic website.";
    if (index === 0) {
      title = "Staff desk";
      answer = "Internal note: member id A-48291. Do not publish.";
    } else if (index === 1) {
      status = "published";
      publicSafe = true;
      title = "Already published";
    } else if (index === 2) {
      status = "archived";
      title = "Archived notice";
    } else if (index === 3) {
      publicSafe = true;
      title = "Already marked safe";
    } else if (index === 5) {
      title = "Unique lighthouse";
      answer = "The synthetic lighthouse is open.";
    }
    rows.push({
      id: fixtureId(index),
      installId: legacy ? null : onBeta ? FIXTURE_SITE_B : FIXTURE_SITE_A,
      domain: legacy ? null : onBeta ? "beta.example" : "alpha.example",
      locale,
      title,
      question: null,
      answer,
      category: null,
      contentType: index % 5 === 0 ? "opening_hours" : "faq",
      status,
      publicSafe,
      priority: 100,
      tags: index === 5 ? ["lighthouse"] : [],
      sourceUrl: null,
      validFrom: null,
      validUntil: null,
      lastReviewedAt: null,
      publishedAt: status === "published" ? nowIso() : null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      translationGroupId: fixtureId(index),
    });
  }
  return rows;
}

function textMatch(row: FixtureRow, query: string): boolean {
  if (!query) return true;
  const needle = query.toLowerCase();
  const haystack = [row.title, row.question ?? "", row.answer, row.category ?? "", ...row.tags]
    .join("\n")
    .toLowerCase();
  return haystack.includes(needle);
}

export class FaqLocalFixture {
  readonly rows: FixtureRow[];
  readonly role: FixtureRole;
  readonly sitesMode: FixtureSites;
  readonly countFails: boolean;

  constructor(options: FixtureOptions) {
    this.rows = createFixtureRows(Math.max(0, options.count));
    this.role = options.role ?? "owner";
    this.sitesMode = options.sites ?? "single";
    this.countFails = options.countFails === true;
  }

  sites() {
    if (this.sitesMode === "none") return [];
    const alpha = {
      installId: FIXTURE_SITE_A,
      domain: "alpha.example",
      verificationStatus: "verified",
      domainStatus: "active",
    };
    if (this.sitesMode === "single") return [alpha];
    return [
      alpha,
      {
        installId: FIXTURE_SITE_B,
        domain: "beta.example",
        verificationStatus: "verified",
        domainStatus: "active",
      },
    ];
  }

  private denied(): FixtureResult | null {
    if (this.role === "anonymous") return { status: 401, body: { error: "Unauthorized" } };
    if (this.role === "viewer") return { status: 403, body: { error: "owner or admin required" } };
    return null;
  }

  private context(installId: string | null): FixtureResult | { state: "no_sites" | "single_site" | "multi_site"; selectedInstallId: string | null; requiresSiteSelection: boolean } {
    const denied = this.denied();
    if (denied) return denied;
    if (this.sitesMode === "none") {
      return { state: "no_sites", selectedInstallId: null, requiresSiteSelection: false };
    }
    const known = new Set(this.sites().map((site) => site.installId));
    if (this.sitesMode === "single") {
      if (installId && !known.has(installId)) {
        return { status: 400, body: { error: "Invalid website selection", code: "invalid_site_selection" } };
      }
      return { state: "single_site", selectedInstallId: FIXTURE_SITE_A, requiresSiteSelection: false };
    }
    if (!installId) {
      return { state: "multi_site", selectedInstallId: null, requiresSiteSelection: true };
    }
    if (!known.has(installId)) {
      return { status: 400, body: { error: "Invalid website selection", code: "invalid_site_selection" } };
    }
    return { state: "multi_site", selectedInstallId: installId, requiresSiteSelection: false };
  }

  private filtered(input: {
    status: string | null;
    locale: string | null;
    contentType: string | null;
    query: string | null;
    installId: string | null;
  }): FixtureResult | { rows: FixtureRow[]; context: { state: "no_sites" | "single_site" | "multi_site"; selectedInstallId: string | null; requiresSiteSelection: boolean } } {
    const context = this.context(input.installId);
    if ("status" in context) return context;
    if (context.requiresSiteSelection) {
      return { rows: [], context };
    }
    const textFiltered = this.rows.filter((row) => {
      if (input.status && row.status !== input.status) return false;
      if (input.locale && row.locale !== input.locale) return false;
      if (input.contentType && row.contentType !== input.contentType) return false;
      return textMatch(row, input.query ?? "");
    });
    const rows = filterWebsiteKompisFaqItemsForSiteContext(textFiltered, context);
    return { rows, context };
  }

  list(url: URL): FixtureResult {
    const denied = this.denied();
    if (denied) return denied;
    const installId = url.searchParams.get("installId") || url.searchParams.get("site");
    const context = this.context(installId);
    if ("status" in context) return context;
    if (url.searchParams.get("scope") === "unassigned") {
      return {
        status: 200,
        body: {
          scope: "unassigned",
          items: this.rows
            .filter((row) => row.installId == null)
            .map((row) => ({ id: row.id, title: row.title, locale: row.locale })),
        },
      };
    }
    if (context.requiresSiteSelection) {
      const window = buildFaqListWindow({ offset: 0, limit: 100, tenantReturned: 0, visibleReturned: 0 });
      return {
        status: 200,
        body: {
          items: [],
          listWindow: window,
          siteContext: {
            state: context.state,
            selectedInstallId: null,
            sites: this.sites(),
            requiresSiteSelection: true,
          },
        },
      };
    }
    const found = this.filtered({
      status: url.searchParams.get("status"),
      locale: url.searchParams.get("locale"),
      contentType: url.searchParams.get("contentType"),
      query: url.searchParams.get("query"),
      installId,
    });
    if ("status" in found) return found;
    const offset = Number(url.searchParams.get("offset") ?? "0") || 0;
    const limit = 100;
    const page = found.rows.slice(offset, offset + limit);
    let listWindow: FaqListWindow = buildFaqListWindow({
      offset,
      limit,
      tenantReturned: page.length === limit ? limit : page.length,
      visibleReturned: page.length,
    });
    listWindow = {
      ...listWindow,
      hasMore: offset + page.length < found.rows.length,
    };
    if (this.countFails) {
      listWindow = { ...listWindow, countAvailable: false, selectAllSupported: false, siteTotal: null, totalState: page.length >= limit ? "at_least_tenant" : listWindow.totalState };
    } else {
      listWindow = applyAuthoritativeFaqCount(listWindow, found.rows.length);
    }
    return {
      status: 200,
      body: {
        items: page,
        listWindow,
        siteContext: {
          state: found.context.state,
          selectedInstallId: found.context.selectedInstallId,
          sites: this.sites(),
          requiresSiteSelection: false,
          legacyNullVisible: page.some((row) => row.installId == null),
          legacyNullHidden: found.context.state === "multi_site" && this.rows.some((row) => row.installId == null),
        },
      },
    };
  }

  matchIds(url: URL): FixtureResult {
    const found = this.filtered({
      status: url.searchParams.get("status"),
      locale: url.searchParams.get("locale"),
      contentType: url.searchParams.get("contentType"),
      query: url.searchParams.get("query"),
      installId: url.searchParams.get("installId") || url.searchParams.get("site"),
    });
    if ("status" in found) return found;
    if (this.countFails) return { status: 409, body: { code: "count_unavailable" } };
    const total = found.rows.length;
    const ids: string[] = [];
    let listEnded = false;
    for (let page = 0; page < FAQ_MATCH_PAGE_CAP; page += 1) {
      const slice = found.rows.slice(page * FAQ_MATCH_PAGE_SIZE, (page + 1) * FAQ_MATCH_PAGE_SIZE);
      ids.push(...slice.map((row) => row.id));
      if (slice.length < FAQ_MATCH_PAGE_SIZE) {
        listEnded = true;
        break;
      }
    }
    if (!listEnded && ids.length !== total) {
      return { status: 409, body: { code: "snapshot_incomplete", total } };
    }
    if (!authoritativeMatchAllowed({ countAvailable: true, reportedTotal: total, collectedIds: ids.length })) {
      return { status: 409, body: { code: "count_mismatch", total } };
    }
    return { status: 200, body: { ids, total } };
  }

  markPublicSafe(body: {
    confirm?: boolean;
    installId?: string | null;
    status?: string | null;
    locale?: string | null;
    contentType?: string | null;
    query?: string | null;
    itemIds?: string[];
  }): FixtureResult {
    const denied = this.denied();
    if (denied) return denied;
    if (body.confirm !== true) return { status: 400, body: { error: "Confirmation is required", code: "confirmation_required" } };
    const itemIds = body.itemIds ?? [];
    if (itemIds.length === 0 || itemIds.length > FAQ_PUBLIC_SAFE_BATCH_SIZE) {
      return { status: 400, body: { error: "Select a limited batch", code: "batch_limit" } };
    }
    const found = this.filtered({
      status: body.status ?? null,
      locale: body.locale ?? null,
      contentType: body.contentType ?? null,
      query: body.query ?? null,
      installId: body.installId ?? null,
    });
    if ("status" in found) return found;
    const visible = found.rows.filter((row) => itemIds.includes(row.id));
    const plan = planPublicSafeReview(visible, itemIds);
    for (const id of plan.readyIds) {
      const row = this.rows.find((entry) => entry.id === id);
      if (!row || row.status !== "draft") continue;
      row.publicSafe = true;
      row.lastReviewedAt = nowIso();
    }
    const results = [
      ...plan.readyIds.map((id) => ({ id, outcome: "marked" })),
      ...plan.skipped.map((row) => ({ id: row.id, outcome: row.reason })),
    ];
    return {
      status: 200,
      body: {
        results,
        marked: plan.readyIds,
        alreadySafe: plan.alreadySafeIds,
        manual: plan.manualIds,
      },
    };
  }

  publish(id: string): FixtureResult {
    const denied = this.denied();
    if (denied) return denied;
    const row = this.rows.find((entry) => entry.id === id);
    if (!row) return { status: 404, body: { error: "FAQ item not found" } };
    if (row.status !== "draft") return { status: 400, body: { error: "Only draft items can be published" } };
    if (row.publicSafe !== true) return { status: 400, body: { error: "public_safe must be true before publish" } };
    row.status = "published";
    row.publishedAt = nowIso();
    return { status: 200, body: { id: row.id, status: "published" } };
  }

  localeVersion(sourceId: string, locale: string): FixtureResult {
    const denied = this.denied();
    if (denied) return denied;
    const lookup = lookupExplicitFaqLocale(this.rows, sourceId, locale);
    if (lookup.outcome === "not_found") return { status: 404, body: { error: "FAQ item not found" } };
    if (lookup.outcome === "unlinked") {
      return { status: 503, body: { error: "FAQ language family is not available", code: "translation_group_unavailable" } };
    }
    if (lookup.outcome === "ambiguous") {
      return { status: 409, body: { error: "FAQ language version could not be loaded", code: "locale_version_failed" } };
    }
    if (lookup.outcome === "missing") {
      return {
        status: 200,
        body: {
          outcome: "missing",
          sourceItemId: lookup.sourceId,
          translationGroupId: lookup.translationGroupId,
        },
      };
    }
    return { status: 200, body: { outcome: "found", item: lookup.row } };
  }

  createLocaleVersion(body: {
    sourceItemId?: string;
    locale?: string;
    title?: string;
    question?: string | null;
    answer?: string;
    category?: string | null;
    contentType?: WpkfContentType;
    priority?: number;
    tags?: string[];
    sourceUrl?: string | null;
    publicSafe?: boolean;
  }): FixtureResult {
    const denied = this.denied();
    if (denied) return denied;
    const sourceId = body.sourceItemId ?? "";
    const locale = (body.locale ?? "").trim().toLowerCase();
    const title = (body.title ?? "").trim();
    const answer = (body.answer ?? "").trim();
    if (!sourceId || !locale || !title || !answer) {
      return { status: 400, body: { error: "FAQ language version is invalid", code: "invalid_locale_version" } };
    }
    const lookup = lookupExplicitFaqLocale(this.rows, sourceId, locale);
    if (lookup.outcome === "not_found") return { status: 404, body: { error: "FAQ item not found" } };
    if (lookup.outcome === "unlinked") {
      return { status: 503, body: { error: "FAQ language family is not available", code: "translation_group_unavailable" } };
    }
    if (lookup.outcome !== "missing") {
      return { status: 409, body: { error: "FAQ language version already exists", code: "locale_version_exists" } };
    }
    const source = this.rows.find((row) => row.id === sourceId)!;
    const created: FixtureRow = {
      id: `10000000-0000-4000-8000-${(this.rows.length + 1).toString(16).padStart(12, "0")}`,
      installId: source.installId,
      domain: source.domain,
      locale,
      title,
      question: body.question?.trim() || null,
      answer,
      category: body.category?.trim() || null,
      contentType: body.contentType ?? source.contentType,
      status: "draft",
      publicSafe: false,
      priority: body.priority ?? source.priority,
      tags: body.tags ?? [],
      sourceUrl: body.sourceUrl?.trim() || null,
      validFrom: null,
      validUntil: null,
      lastReviewedAt: null,
      publishedAt: null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      translationGroupId: source.translationGroupId,
    };
    this.rows.push(created);
    return { status: 200, body: { id: created.id, status: "draft", created: true } };
  }

  searchLocaleLink(sourceId: string, locale: string, query: string): FixtureResult {
    const denied = this.denied();
    if (denied) return denied;
    const found = searchExplicitFaqLocaleCandidates(this.rows, sourceId, locale, query);
    if (!Array.isArray(found)) {
      if (found.outcome === "unlinked") {
        return { status: 503, body: { error: "FAQ language family is not available", code: "translation_group_unavailable" } };
      }
      return { status: 404, body: { error: "FAQ item not found" } };
    }
    return { status: 200, body: { candidates: found } };
  }

  linkLocaleMember(body: { sourceItemId?: string; candidateId?: string; locale?: string; confirmed?: boolean }): FixtureResult {
    const denied = this.denied();
    if (denied) return denied;
    const sourceId = body.sourceItemId ?? "";
    const candidateId = body.candidateId ?? "";
    const locale = (body.locale ?? "").trim().toLowerCase();
    const plan = planExplicitFaqLocaleLink(this.rows, sourceId, candidateId, locale);
    if (!plan.ok) {
      if (plan.reason === "unlinked") {
        return { status: 503, body: { error: "FAQ language family is not available", code: "translation_group_unavailable" } };
      }
      if (plan.reason === "not_found") return { status: 404, body: { error: "FAQ item not found" } };
      return { status: 409, body: { error: "FAQ translation was not linked", code: plan.reason } };
    }
    if (body.confirmed !== true) {
      return { status: 400, body: { error: "Confirmation is required", code: "confirmation_required" } };
    }
    const applied = applyExplicitFaqLocaleLink(this.rows, sourceId, candidateId, locale);
    if (!applied.ok) return { status: 409, body: { error: "FAQ translation was not linked", code: applied.reason } };
    const linked = this.rows.find((row) => row.id === applied.candidateId);
    return { status: 200, body: { outcome: applied.outcome, item: linked } };
  }

  stats() {
    return {
      published: this.rows.filter((row) => row.status === "published").length,
      publicSafeDrafts: this.rows.filter((row) => row.status === "draft" && row.publicSafe).length,
      drafts: this.rows.filter((row) => row.status === "draft").length,
    };
  }
}

export function parseFixtureOptions(search: string): FixtureOptions {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const count = Number(params.get("count") ?? "8");
  const role = params.get("role");
  const sites = params.get("sites");
  return {
    count: Number.isInteger(count) && count >= 0 ? count : 8,
    role: role === "viewer" || role === "anonymous" ? role : "owner",
    sites: sites === "multi" || sites === "none" ? sites : "single",
    countFails: params.get("countFails") === "1",
    installId: params.get("installId"),
  };
}
