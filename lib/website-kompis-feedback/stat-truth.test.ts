import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { isHistoryFeedback, isOpenNegativeReview } from "@/lib/website-kompis-feedback/disposition";
import {
  feedbackListFiltersActive,
  feedbackQueueEmptyKind,
  presentFeedbackStatCards,
} from "@/lib/website-kompis-feedback/stat-truth";

const idleFilters = {
  vote: "all",
  comment: "all",
  query: "",
  locale: "",
  page: "",
  dateFrom: "",
  dateTo: "",
};

function main() {
  const historical = presentFeedbackStatCards({
    answers: 191,
    helpful: 19,
    notHelpful: 16,
    withComment: 8,
    openReview: 0,
    openReviewIsQueue: true,
    filtersActive: false,
  });
  assert.equal(historical.answers, 191);
  assert.equal(historical.helpful, 19);
  assert.equal(historical.notHelpful, 16);
  assert.equal(historical.withComment, 8);
  assert.equal(historical.openReview, 0);
  assert.equal(historical.openReviewIsQueue, true);
  assert.equal(historical.scope, "organization_all_time");

  const closedNegative = {
    vote: "not_helpful" as const,
    reviewDisposition: "rejected" as const,
    reviewStatus: "closed" as const,
  };
  assert.equal(isOpenNegativeReview(closedNegative), false);
  assert.equal(isHistoryFeedback(closedNegative), true);
  const afterClose = presentFeedbackStatCards({
    answers: 191,
    helpful: 19,
    notHelpful: 16,
    withComment: 8,
    openReview: 0,
    openReviewIsQueue: true,
    filtersActive: false,
  });
  assert.equal(afterClose.notHelpful, 16);
  assert.equal(afterClose.openReview, 0);

  const search = { ...idleFilters, query: "mangler" };
  assert.equal(feedbackListFiltersActive(search), true);
  assert.equal(feedbackListFiltersActive({ ...idleFilters, dateFrom: "2026-01-01" }), true);
  assert.equal(feedbackListFiltersActive(idleFilters), false);
  const filteredCards = presentFeedbackStatCards({
    answers: 191,
    helpful: 19,
    notHelpful: 16,
    withComment: 8,
    openReview: 0,
    openReviewIsQueue: true,
    filtersActive: true,
  });
  assert.deepEqual(filteredCards, historical);
  assert.equal(
    feedbackQueueEmptyKind({
      view: "review",
      visibleCount: 0,
      openReview: 0,
      filtersActive: true,
      datasetEmpty: false,
    }),
    "filtered",
  );
  assert.equal(
    feedbackQueueEmptyKind({
      view: "review",
      visibleCount: 0,
      openReview: 0,
      filtersActive: false,
      datasetEmpty: false,
    }),
    "review_clear",
  );
  assert.equal(
    feedbackQueueEmptyKind({
      view: "history",
      visibleCount: 0,
      openReview: 0,
      filtersActive: false,
      datasetEmpty: false,
    }),
    "history_clear",
  );
  assert.equal(
    feedbackQueueEmptyKind({
      view: "review",
      visibleCount: 0,
      openReview: 4,
      filtersActive: false,
      datasetEmpty: false,
    }),
    "outside_window",
  );

  const dated = presentFeedbackStatCards({
    answers: 191,
    helpful: 19,
    notHelpful: 16,
    withComment: 8,
    openReview: 0,
    openReviewIsQueue: true,
    filtersActive: feedbackListFiltersActive({ ...idleFilters, dateFrom: "2026-10-01", dateTo: "2026-10-24" }),
  });
  assert.equal(dated.scope, "organization_all_time");
  assert.equal(dated.notHelpful, 16);

  const panel = readFileSync("components/app/website-kompis/WebsiteKompisFeedbackOverviewPanel.tsx", "utf8");
  assert.match(panel, /presentFeedbackStatCards/);
  assert.match(panel, /labels\.quality\.reviewCleared/);
  assert.match(panel, /labels\.noResultsTitle/);
  assert.doesNotMatch(panel, /filtersActive[\s\S]{0,80}statCards\.notHelpful/);

  const required = [
    "answers",
    "answersHint",
    "helpful",
    "helpfulHint",
    "notHelpful",
    "notHelpfulHint",
    "withComment",
    "withCommentHint",
    "openReview",
    "openReviewHint",
    "scope",
  ];
  const locales = ["en", "no", "sv", "da", "pl", "uk", "es"] as const;
  const totals = Object.fromEntries(
    locales.map((locale) => {
      const json = JSON.parse(readFileSync(`locales/${locale}/customer-app/core.json`, "utf8")) as {
        websiteKompisFeedback: {
          totals: Record<string, string>;
          quality: Record<string, string>;
        };
      };
      return [locale, json.websiteKompisFeedback];
    }),
  );
  for (const locale of locales) {
    for (const key of required) {
      assert.equal(typeof totals[locale].totals[key], "string");
      assert.ok(totals[locale].totals[key].trim().length > 0);
    }
    assert.ok(totals[locale].quality.reviewCleared.trim().length > 0);
    assert.ok(totals[locale].quality.reviewClearedBody.trim().length > 0);
    assert.ok(totals[locale].quality.historyHint.trim().length > 0);
  }
  assert.equal(totals.no.totals.answers, "Registrerte svar");
  assert.equal(totals.no.totals.notHelpful, "Negative vurderinger");
  assert.equal(totals.no.totals.openReview, "Åpne saker");
  assert.match(totals.no.totals.scope, /organisasjonen/);
  assert.match(totals.no.totals.scope, /Filtrene endrer listen/);
  assert.doesNotMatch(totals.no.totals.scope, /nettstedet du har valgt|valgt nettsted|denne perioden/);
  assert.equal(totals.no.quality.reviewCleared, "Alle gjennomgangssaker er behandlet. Ingen åpne saker.");
  assert.equal(totals.en.totals.notHelpful, "Negative ratings");
  assert.equal(totals.en.totals.openReview, "Open cases");
  for (const locale of ["sv", "da", "pl", "uk", "es"] as const) {
    assert.notEqual(totals[locale].totals.notHelpful, totals.en.totals.notHelpful);
    assert.notEqual(totals[locale].totals.openReview, totals.en.totals.openReview);
    assert.notEqual(totals[locale].quality.reviewCleared, totals.en.quality.reviewCleared);
  }

  console.log("website-kompis-feedback-stat-truth.test.ts: all assertions passed");
}

main();
