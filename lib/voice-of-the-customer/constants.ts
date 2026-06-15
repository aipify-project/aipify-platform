export const FEEDBACK_TYPES = [
  "bug_report",
  "improvement_suggestion",
  "feature_request",
  "compliment",
  "usability_issue",
  "general_feedback",
] as const;

export type FeedbackType = (typeof FEEDBACK_TYPES)[number];

export const FEEDBACK_PRIORITIES = ["low", "medium", "high"] as const;

export type FeedbackPriority = (typeof FEEDBACK_PRIORITIES)[number];

export const WORKFLOW_STATUSES = [
  "new",
  "under_review",
  "planned",
  "in_development",
  "released",
  "closed",
] as const;

export type WorkflowStatus = (typeof WORKFLOW_STATUSES)[number];

export const CUSTOMER_STATUSES = [
  "received",
  "under_review",
  "planned",
  "implemented",
] as const;

export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];

export const STATUS_BADGES: Record<WorkflowStatus, string> = {
  new: "bg-sky-50 text-sky-800 ring-sky-200",
  under_review: "bg-amber-50 text-amber-900 ring-amber-200",
  planned: "bg-violet-50 text-violet-800 ring-violet-200",
  in_development: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  released: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  closed: "bg-gray-100 text-gray-800 ring-gray-200",
};

export const CUSTOMER_STATUS_BADGES: Record<CustomerStatus, string> = {
  received: "bg-sky-50 text-sky-800 ring-sky-200",
  under_review: "bg-amber-50 text-amber-900 ring-amber-200",
  planned: "bg-violet-50 text-violet-800 ring-violet-200",
  implemented: "bg-emerald-50 text-emerald-800 ring-emerald-200",
};

export const PRIORITY_BADGES: Record<FeedbackPriority, string> = {
  low: "bg-gray-100 text-gray-800 ring-gray-200",
  medium: "bg-blue-50 text-blue-800 ring-blue-200",
  high: "bg-red-50 text-red-800 ring-red-200",
};
