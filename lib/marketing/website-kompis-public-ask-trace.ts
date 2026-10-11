/**
 * Structured, redacted server trace for public Website Kompis asks.
 * Never logs raw questions, answers, prompts, cookies, tokens, or page body text.
 */

import { randomUUID } from "node:crypto";
import type { WebsiteKompisPublicAnswerPath } from "@/lib/marketing/website-kompis-public-answer-policy";

export const WEBSITE_KOMPIS_PUBLIC_ASK_TRACE_EVENT = "[website-kompis-ask-trace]" as const;
export const WEBSITE_KOMPIS_PUBLIC_ASK_POLICY_ID = "website_kompis_public_v1" as const;

export type WebsiteKompisPublicAskTracePayload = {
  event: "public_ask_complete";
  correlationId: string;
  installValidated: boolean;
  /** Pseudonymized install reference (suffix only). */
  installRef: string | null;
  /** Pseudonymized verified host. */
  domainHost: string | null;
  pagePathname: string | null;
  pageLocale: string | null;
  titlePresent: boolean;
  pageContextPresent: boolean;
  /** Signal keys present on sanitized pageContext (not values). */
  pageSignalsAvailable: string[];
  /** Signal keys that contributed to the chosen branch (not values). */
  pageSignalsUsed: string[];
  /** Public source routes only (already visitor-safe URLs/paths). */
  sourceRoutes: string[];
  sourceCount: number;
  /** Approximate evidence budget used (chars), not content. */
  contextChars: number;
  policy: typeof WEBSITE_KOMPIS_PUBLIC_ASK_POLICY_ID;
  answerPath: WebsiteKompisPublicAnswerPath;
  rejectReason: string | null;
  status: "ok" | "disabled" | "private_scope" | "rejected_chain";
};

const FORBIDDEN_TRACE_KEYS = [
  "question",
  "answer",
  "directAnswer",
  "prompt",
  "textSnippets",
  "headings",
  "cookie",
  "token",
  "authorization",
  "password",
] as const;

export function createWebsiteKompisPublicAskCorrelationId(): string {
  return randomUUID();
}

/** Last 8 hex chars of install UUID — enough to correlate owner test window. */
export function pseudonymizeInstallId(installId: string | null | undefined): string | null {
  const trimmed = installId?.trim().toLowerCase() ?? "";
  if (!trimmed) return null;
  const compact = trimmed.replace(/-/g, "");
  if (compact.length < 8) return compact.slice(-compact.length);
  return compact.slice(-8);
}

export function pseudonymizeDomainHost(domain: string | null | undefined): string | null {
  const trimmed = domain?.trim().toLowerCase() ?? "";
  if (!trimmed) return null;
  // Keep hostname shape; strip accidental credentials/paths.
  try {
    if (trimmed.includes("://")) {
      return new URL(trimmed).hostname || null;
    }
  } catch {
    /* fall through */
  }
  return trimmed.split("/")[0]?.split("@").pop() || null;
}

export function listAvailablePublicPageSignals(pageContext: {
  pathname?: string;
  title?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  locale?: string;
  headings?: unknown[];
  textSnippets?: unknown[];
  structuredDataSummary?: unknown[];
} | null | undefined): string[] {
  if (!pageContext) return [];
  const signals: string[] = [];
  if (pageContext.pathname) signals.push("pathname");
  if (pageContext.title?.trim()) signals.push("title");
  if (pageContext.metaDescription?.trim()) signals.push("metaDescription");
  if (pageContext.canonicalUrl?.trim()) signals.push("canonicalUrl");
  if (pageContext.locale?.trim()) signals.push("locale");
  if (Array.isArray(pageContext.headings) && pageContext.headings.length > 0) {
    signals.push("headings");
  }
  if (Array.isArray(pageContext.textSnippets) && pageContext.textSnippets.length > 0) {
    signals.push("textSnippets");
  }
  if (
    Array.isArray(pageContext.structuredDataSummary) &&
    pageContext.structuredDataSummary.length > 0
  ) {
    signals.push("structuredDataSummary");
  }
  return signals;
}

export function estimatePublicPageContextChars(pageContext: {
  pathname?: string;
  title?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  locale?: string;
  headings?: Array<{ text?: string }>;
  textSnippets?: string[];
  structuredDataSummary?: string[];
} | null | undefined): number {
  if (!pageContext) return 0;
  let total = 0;
  total += pageContext.pathname?.length ?? 0;
  total += pageContext.title?.length ?? 0;
  total += pageContext.metaDescription?.length ?? 0;
  total += pageContext.canonicalUrl?.length ?? 0;
  total += pageContext.locale?.length ?? 0;
  for (const heading of pageContext.headings ?? []) {
    total += heading.text?.length ?? 0;
  }
  for (const snippet of pageContext.textSnippets ?? []) {
    total += snippet.length;
  }
  for (const summary of pageContext.structuredDataSummary ?? []) {
    total += summary.length;
  }
  return total;
}

export function buildWebsiteKompisPublicAskTracePayload(input: {
  correlationId: string;
  installValidated: boolean;
  installId?: string | null;
  domain?: string | null;
  pagePathname?: string | null;
  pageLocale?: string | null;
  titlePresent: boolean;
  pageContextPresent: boolean;
  pageSignalsAvailable: string[];
  pageSignalsUsed: string[];
  sourceRoutes: string[];
  contextChars: number;
  answerPath: WebsiteKompisPublicAnswerPath;
  rejectReason?: string | null;
  status?: WebsiteKompisPublicAskTracePayload["status"];
}): WebsiteKompisPublicAskTracePayload {
  const sourceRoutes = input.sourceRoutes
    .map((route) => route.trim())
    .filter(Boolean)
    .slice(0, 5);

  return {
    event: "public_ask_complete",
    correlationId: input.correlationId,
    installValidated: input.installValidated,
    installRef: pseudonymizeInstallId(input.installId),
    domainHost: pseudonymizeDomainHost(input.domain),
    pagePathname: input.pagePathname?.trim() || null,
    pageLocale: input.pageLocale?.trim() || null,
    titlePresent: input.titlePresent,
    pageContextPresent: input.pageContextPresent,
    pageSignalsAvailable: [...input.pageSignalsAvailable],
    pageSignalsUsed: [...input.pageSignalsUsed],
    sourceRoutes,
    sourceCount: sourceRoutes.length,
    contextChars: Math.max(0, Math.floor(input.contextChars)),
    policy: WEBSITE_KOMPIS_PUBLIC_ASK_POLICY_ID,
    answerPath: input.answerPath,
    rejectReason: input.rejectReason ?? null,
    status: input.status ?? "ok",
  };
}

/** Guard: payload must never include forbidden content keys. */
export function assertWebsiteKompisPublicAskTraceRedacted(
  payload: Record<string, unknown>,
): void {
  const serialized = JSON.stringify(payload).toLowerCase();
  for (const key of FORBIDDEN_TRACE_KEYS) {
    if (Object.prototype.hasOwnProperty.call(payload, key)) {
      throw new Error(`ask-trace forbidden key present: ${key}`);
    }
  }
  // Soft check: raw-looking long prose blobs should not appear as string values.
  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === "string" && value.length > 220 && key !== "correlationId") {
      throw new Error(`ask-trace value too long for key: ${key}`);
    }
  }
  void serialized;
}

export function logWebsiteKompisPublicAskTrace(
  payload: WebsiteKompisPublicAskTracePayload,
): void {
  assertWebsiteKompisPublicAskTraceRedacted(
    payload as unknown as Record<string, unknown>,
  );
  console.info(WEBSITE_KOMPIS_PUBLIC_ASK_TRACE_EVENT, payload);
}
