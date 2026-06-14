export const ENTERPRISE_LOADING_LANGUAGE_PRINCIPLE =
  "Loading states are part of the product experience. Every message must reinforce trust, competence, and executive readiness — never generic AI waiting language.";

export const AIPIFY_IDENTITY_LOADING_PRINCIPLE =
  "Aipify must never refer to itself as \"AI\" in loading states. Customers buy Aipify, not artificial intelligence.";

export const FORBIDDEN_LOADING_PHRASES = [
  "Loading AI...",
  "Loading AI dashboard...",
  "AI is thinking...",
  "Generating magic...",
  "Please wait...",
  "Fetching data...",
  "Processing...",
  "Thinking…",
  "Loading...",
] as const;

export const PREFERRED_LOADING_CATEGORIES = [
  "Executive dashboards — briefing, overview, organizational insights",
  "Operations — operational data, pending activities, approved workflows",
  "Security — security posture, compliance, governance",
  "Companion — workspace preparation, priorities, recommendations",
  "Commerce — commerce intelligence, performance, market insights",
] as const;
