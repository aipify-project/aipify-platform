import assert from "node:assert/strict";
import { parseSupportHistory } from "./parse";
import {
  buildHistoryQueryParams,
  clampPage,
  clampPageSize,
  containsPhasePlaceholderText,
  filterCasesExcludeActive,
  hasPagination,
  isActiveStatus,
  isHistoricalStatus,
  isValidChannel,
  isValidSortOption,
  mapSupportHistoryStatusToSemantic,
  mapSupportPriorityToSeverity,
  parseHistoryFiltersFromSearchParams,
} from "./presentation";
import {
  DEFAULT_PAGE_SIZE,
  HISTORICAL_STATUSES,
  MAX_PAGE_SIZE,
  SUPPORT_HISTORY_LANDING_HREF,
  resolveCaseDetailHref,
} from "./config";

// 1. Parser handles null.
assert.equal(parseSupportHistory(null).found, false);

// 2. Parser maps overview metrics.
const parsed = parseSupportHistory({
  found: true,
  can_manage: true,
  can_reopen: true,
  overview: {
    total_historical: 12,
    resolved: 5,
    closed: 4,
    reopened: 2,
    archived: 1,
    avg_resolution_days: 3.5,
  },
  insights: {
    top_categories: [{ category: "billing", count: 4 }],
    reopen_rate_percent: 16.7,
    most_recent_resolution_at: "2026-06-20T10:00:00Z",
  },
  items: [
    {
      id: "case-1",
      title: "Billing question",
      description: "Invoice mismatch",
      category: "billing",
      priority: "medium",
      status: "resolved",
      channel: "app_portal",
      created_by: "Owner",
      assigned_support_owner: "Unassigned",
      created_at: "2026-06-01T00:00:00Z",
      updated_at: "2026-06-05T00:00:00Z",
      resolved_at: "2026-06-05T00:00:00Z",
    },
    {
      id: "case-2",
      title: "Open case",
      description: "Should be filtered client-side",
      category: "general",
      priority: "low",
      status: "open",
      created_by: "Staff",
      assigned_support_owner: "Unassigned",
      created_at: "2026-06-10T00:00:00Z",
      updated_at: "2026-06-10T00:00:00Z",
    },
  ],
  pagination: { page: 1, page_size: 10, total: 12, total_pages: 2 },
  principle: "Support History preserves resolved cases for your organization.",
});
assert.equal(parsed.overview?.total_historical, 12);
assert.equal(parsed.items[0]?.status, "resolved");
assert.equal(parsed.pagination?.total_pages, 2);

// 3. Historical status guard.
assert.equal(isHistoricalStatus("resolved"), true);
assert.equal(isHistoricalStatus("closed"), true);
assert.equal(isHistoricalStatus("reopened"), true);
assert.equal(isHistoricalStatus("archived"), true);
assert.equal(isHistoricalStatus("open"), false);

// 4. Active status inverse.
assert.equal(isActiveStatus("open"), true);
assert.equal(isActiveStatus("resolved"), false);

// 5. Client-side filter excludes active cases.
assert.equal(filterCasesExcludeActive(parsed.items).length, 1);

// 6. Resolved maps to completed workflow semantic.
assert.deepEqual(mapSupportHistoryStatusToSemantic("resolved"), { type: "workflow", value: "completed" });

// 7. Reopened maps to in_progress workflow semantic.
assert.deepEqual(mapSupportHistoryStatusToSemantic("reopened"), { type: "workflow", value: "in_progress" });

// 8. Archived maps to lifecycle archived semantic.
assert.deepEqual(mapSupportHistoryStatusToSemantic("archived"), { type: "lifecycle", value: "archived" });

// 9. Urgent priority maps to high severity band.
assert.equal(mapSupportPriorityToSeverity("urgent"), "high");

// 10. Low priority maps to info severity band.
assert.equal(mapSupportPriorityToSeverity("low"), "info");

// 11. Sort option validation.
assert.equal(isValidSortOption("updated_desc"), true);
assert.equal(isValidSortOption("invalid"), false);

// 12. Channel validation.
assert.equal(isValidChannel("app_portal"), true);
assert.equal(isValidChannel("unknown"), false);

// 13. Page clamp minimum.
assert.equal(clampPage(0), 1);
assert.equal(clampPage(-3), 1);

// 14. Page size clamp respects max.
assert.equal(clampPageSize(999), MAX_PAGE_SIZE);
assert.equal(clampPageSize(0), DEFAULT_PAGE_SIZE);

// 15. Canonical detail route.
assert.equal(resolveCaseDetailHref("abc-123"), "/app/support/requests/abc-123");

// 16. Support landing href canonical.
assert.equal(SUPPORT_HISTORY_LANDING_HREF, "/app/support/history");

// 17. Historical statuses constant covers spec set.
assert.deepEqual([...HISTORICAL_STATUSES], ["resolved", "closed", "reopened", "archived"]);

// 18. URL params parse status filter.
const params = new URLSearchParams("status=resolved&page=2&sort=priority_desc&search=billing");
const filters = parseHistoryFiltersFromSearchParams(params);
assert.equal(filters.status, "resolved");
assert.equal(filters.page, 2);
assert.equal(filters.sort, "priority_desc");
assert.equal(filters.search, "billing");

// 19. Invalid sort falls back to updated_desc.
assert.equal(parseHistoryFiltersFromSearchParams(new URLSearchParams("sort=bad")).sort, "updated_desc");

// 20. Query builder includes page when > 1.
assert.equal(buildHistoryQueryParams({ ...filters, page: 2 }).get("page"), "2");

// 21. Query builder omits default sort.
assert.equal(buildHistoryQueryParams({ ...filters, sort: "updated_desc", page: 1 }).has("sort"), false);

// 22. Pagination helper detects multi-page.
assert.equal(hasPagination({ page: 1, total_pages: 3 }), true);
assert.equal(hasPagination({ page: 1, total_pages: 1 }), false);

// 23. Phase placeholder text detector — foundation note blocked.
assert.equal(containsPhasePlaceholderText("Capabilities will expand in future phases."), true);

// 24. Phase placeholder text detector — production copy allowed.
assert.equal(containsPhasePlaceholderText("Review resolved support cases for your organization."), false);

// 25. Principle text must not contain phase placeholder patterns.
assert.equal(containsPhasePlaceholderText(parsed.principle ?? ""), false);

// 26. Parser preserves can_reopen flag.
assert.equal(parsed.can_reopen, true);

// 27. Insights top categories parse count.
assert.equal(parsed.insights?.top_categories[0]?.count, 4);

// 28. Reopen rate percent preserved.
assert.equal(parsed.insights?.reopen_rate_percent, 16.7);

// 29. Channel defaults in parser when missing on item — handled upstream; open item filtered.
assert.equal(parsed.items[1]?.status, "open");

// 30. Empty payload returns empty items array.
assert.deepEqual(parseSupportHistory({ found: false }).items, []);

// 31. Waiting for customer maps to pending workflow.
assert.deepEqual(mapSupportHistoryStatusToSemantic("waiting_for_customer"), { type: "workflow", value: "pending" });

// 32. In review maps to in_progress workflow.
assert.deepEqual(mapSupportHistoryStatusToSemantic("in_review"), { type: "workflow", value: "in_progress" });

// 33. High priority maps to medium severity (attention band).
assert.equal(mapSupportPriorityToSeverity("high"), "medium");

// 34. Category filter in query string.
assert.equal(buildHistoryQueryParams({ ...filters, category: "billing", page: 1 }).get("category"), "billing");

// 35. Channel filter in query string.
assert.equal(buildHistoryQueryParams({ ...filters, channel: "email", page: 1 }).get("channel"), "email");

// 36. Date filters serialize to query string.
const dateParams = buildHistoryQueryParams({
  ...filters,
  dateFrom: "2026-01-01",
  dateTo: "2026-06-01",
  page: 1,
});
assert.equal(dateParams.get("date_from"), "2026-01-01");
assert.equal(dateParams.get("date_to"), "2026-06-01");

// 37. Search trim in query builder.
assert.equal(
  buildHistoryQueryParams({ ...filters, search: "  invoice  ", page: 1 }).get("search"),
  "invoice"
);

// 38. Empty search omitted from query.
assert.equal(buildHistoryQueryParams({ ...filters, search: "   ", page: 1 }).has("search"), false);

// 39. Overview archived count parsed.
assert.equal(parsed.overview?.archived, 1);

// 40. GET route contract — parser never invents synthetic demo cases (items require ids from API).
assert.ok(parsed.items.every((item) => item.id.length > 0));

console.log("support-history.test.ts: 40 scenarios passed");
