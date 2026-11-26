"use client";

/**
 * Shared client helpers for the partner's own sales links (catalog, links page, sales tools).
 *
 * - `useCspSalesLinks` reads `GET /api/certified-sales-partner/links` (own links + visit counts).
 * - `ensureCspSalesLink` reuses an active link for the channel when one exists, otherwise asks the
 *   server to issue one. Gates are NEVER sent from the client; the server derives them from Core.
 */
import { useCallback, useEffect, useState } from "react";
import { buildCspPublicLinkPath } from "@/lib/certified-sales-partner/attribution-policy";

export type CspOwnLink = {
  code: string;
  channel: string | null;
  active: boolean;
  createdAt: string | null;
  /** Recorded visits; `null` = not reported (read failed or not available). */
  visits: number | null;
};

export type CspSalesLinksState =
  | { phase: "loading" }
  | { phase: "unavailable" }
  | { phase: "error" }
  | { phase: "ready"; links: CspOwnLink[] };

function parseLinks(payload: unknown): CspOwnLink[] | null {
  if (!payload || typeof payload !== "object") return null;
  const raw = (payload as { links?: unknown }).links;
  if (!Array.isArray(raw)) return null;
  return raw.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const l = item as Record<string, unknown>;
    if (typeof l.code !== "string" || !l.code) return [];
    return [
      {
        code: l.code,
        channel: typeof l.channel === "string" ? l.channel : null,
        active: l.active !== false,
        createdAt: typeof l.created_at === "string" ? l.created_at : null,
        visits: typeof l.visits === "number" && Number.isFinite(l.visits) ? l.visits : null,
      },
    ];
  });
}

export function useCspSalesLinks(enabled: boolean) {
  const [state, setState] = useState<CspSalesLinksState>({ phase: "loading" });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/certified-sales-partner/links", { cache: "no-store" });
        const data: unknown = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.status === 503 || (data as { backend_ready?: boolean } | null)?.backend_ready === false) {
          setState({ phase: "unavailable" });
          return;
        }
        const links = res.ok ? parseLinks(data) : null;
        setState(links ? { phase: "ready", links } : { phase: "error" });
      } catch {
        if (!cancelled) setState({ phase: "error" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return { state, reload };
}

export type CspLinkOutcome =
  | { ok: true; url: string; reused: boolean }
  | { ok: false; reason: "unavailable" | "gates" | "not_sellable" | "error" };

export function buildCspLinkUrl(origin: string, link: { code: string; channel: string | null }, productKey: string): string | null {
  const path = buildCspPublicLinkPath({ code: link.code, productKey, channel: link.channel ?? "referral_link" });
  return path ? `${origin}${path}` : null;
}

/** Reuse an active link for `channel`; otherwise ask the server to create one (server re-checks every gate). */
export async function ensureCspSalesLink(input: {
  productKey: string;
  channel: string;
  existing: readonly CspOwnLink[];
}): Promise<CspLinkOutcome> {
  const origin = window.location.origin;
  const reusable = input.existing.find((l) => l.active && l.channel === input.channel);
  if (reusable) {
    const url = buildCspLinkUrl(origin, reusable, input.productKey);
    if (url) return { ok: true, url, reused: true };
  }
  try {
    const res = await fetch("/api/certified-sales-partner/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: input.productKey, channel: input.channel }),
    });
    const data = (await res.json().catch(() => ({}))) as { path?: string | null; backend_ready?: boolean };
    if (res.status === 503 || data.backend_ready === false) return { ok: false, reason: "unavailable" };
    if (res.status === 403) return { ok: false, reason: "gates" };
    if (res.status === 409) return { ok: false, reason: "not_sellable" };
    if (!res.ok || typeof data.path !== "string") return { ok: false, reason: "error" };
    return { ok: true, url: `${origin}${data.path}`, reused: false };
  } catch {
    return { ok: false, reason: "error" };
  }
}

export async function writeClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export type CspDeactivateLinkOutcome =
  | { ok: true; changed: boolean }
  | { ok: false; reason: "unavailable" | "forbidden" | "not_found" | "error" };

/** Deactivate an own sales link by code. Fail-closed when Core RPC is not applied yet. */
export async function deactivateCspSalesLink(code: string): Promise<CspDeactivateLinkOutcome> {
  const trimmed = code.trim();
  if (!trimmed) return { ok: false, reason: "error" };
  try {
    const res = await fetch("/api/certified-sales-partner/links", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deactivate", code: trimmed }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      backend_ready?: boolean;
      changed?: boolean;
      error?: string;
    };
    if (res.status === 503 || data.backend_ready === false) return { ok: false, reason: "unavailable" };
    if (res.status === 403) return { ok: false, reason: "forbidden" };
    if (res.status === 404) return { ok: false, reason: "not_found" };
    if (!res.ok) return { ok: false, reason: "error" };
    return { ok: true, changed: data.changed === true };
  } catch {
    return { ok: false, reason: "error" };
  }
}
