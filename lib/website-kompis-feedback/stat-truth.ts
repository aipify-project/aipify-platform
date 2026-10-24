/** Presentation only. Counts stay on the overview and review-queue contracts. */

export type FeedbackListFilterState = {
  vote: string;
  comment: string;
  query: string;
  locale: string;
  page: string;
  dateFrom: string;
  dateTo: string;
};

export type FeedbackStatCards = {
  answers: number;
  helpful: number;
  notHelpful: number;
  withComment: number;
  openReview: number;
  /** Fifth card is the open review queue, not the historical negative total. */
  openReviewIsQueue: boolean;
  /** Cards ignore list filters, selected website, and date bounds. */
  scope: "organization_all_time";
};

export type FeedbackQueueEmptyKind =
  | "dataset"
  | "list"
  | "filtered"
  | "review_clear"
  | "history_clear"
  | "outside_window";

export function feedbackListFiltersActive(filters: FeedbackListFilterState): boolean {
  return (
    filters.vote !== "all" ||
    filters.comment !== "all" ||
    filters.query.trim().length > 0 ||
    filters.locale.trim().length > 0 ||
    filters.page.trim().length > 0 ||
    filters.dateFrom.trim().length > 0 ||
    filters.dateTo.trim().length > 0
  );
}

export function presentFeedbackStatCards(input: {
  answers: number;
  helpful: number;
  notHelpful: number;
  withComment: number;
  openReview: number;
  openReviewIsQueue: boolean;
  filtersActive: boolean;
}): FeedbackStatCards {
  return {
    answers: input.answers,
    helpful: input.helpful,
    notHelpful: input.notHelpful,
    withComment: input.withComment,
    openReview: input.openReview,
    openReviewIsQueue: input.openReviewIsQueue,
    scope: "organization_all_time",
  };
}

export function feedbackQueueEmptyKind(input: {
  view: "review" | "history";
  visibleCount: number;
  openReview: number;
  filtersActive: boolean;
  datasetEmpty: boolean;
}): FeedbackQueueEmptyKind {
  if (input.datasetEmpty) return "dataset";
  if (input.visibleCount > 0) return "list";
  if (input.filtersActive) return "filtered";
  if (input.view === "history") return "history_clear";
  if (input.openReview === 0) return "review_clear";
  return "outside_window";
}
