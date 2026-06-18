export * from "./types";
export * from "./parse";
export * from "./labels";

export const CUSTOMER_SUCCESS_BASE = "/app/customer-success";

export const CUSTOMER_SUCCESS_SECTIONS = [
  { key: "overview", href: "/app/customer-success" },
  { key: "adoption", href: "/app/customer-success/adoption" },
  { key: "health", href: "/app/customer-success/health" },
  { key: "expansion", href: "/app/customer-success/expansion" },
  { key: "plans", href: "/app/customer-success/plans" },
  { key: "training", href: "/app/customer-success/training" },
  { key: "engagement", href: "/app/customer-success/engagement" },
  { key: "businessPacks", href: "/app/customer-success/business-packs" },
  { key: "journey", href: "/app/customer-success/journey" },
  { key: "reviews", href: "/app/customer-success/reviews" },
  { key: "tasks", href: "/app/customer-success/tasks" },
  { key: "executive", href: "/app/customer-success/executive" },
  { key: "governance", href: "/app/customer-success/governance" },
] as const;
