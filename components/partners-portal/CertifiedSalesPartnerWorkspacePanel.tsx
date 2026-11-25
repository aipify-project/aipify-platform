"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { classifyCspPortalResponse, type CspPendingStatus } from "@/lib/certified-sales-partner/portal-gate";
import { parseCspPortalView, type CspPortalView } from "@/lib/certified-sales-partner/portal-view";
import { buildCspLoginUrl } from "@/lib/certified-sales-partner/registration-outcome";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";

export type CspWorkspaceLabels = {
  title: string;
  subtitle: string;
  loading: string;
  notReadyTitle: string;
  notReadyBody: string;
  retry: string;
  errorTitle: string;
  /** No signed-in session. */
  unauthorizedTitle: string;
  unauthorizedBody: string;
  signIn: string;
  /** Core is ready, but this account has no partner application yet. */
  notRegisteredTitle: string;
  notRegisteredBody: string;
  applyCta: string;
  /** Application exists but is not approved yet (or is closed). */
  pending: {
    statusLabel: string;
    nextTitle: string;
    contactCta: string;
    statuses: Record<CspPendingStatus, { title: string; body: string; next: string }>;
  };
};

type Props = {
  labels: CspWorkspaceLabels;
  children?: ReactNode;
};

type WorkspaceState = "loading" | "ready" | "closed" | "error" | "unauthorized" | "not_registered" | "pending";

/**
 * Core portal bundle shared with child panels so the dashboard, certifications and settlement pages
 * read ONE `GET /api/certified-sales-partner/portal` response. `null` until Core confirms it is ready.
 */
const CspPortalContext = createContext<CspPortalView | null>(null);

export function useCspPortal(): CspPortalView | null {
  return useContext(CspPortalContext);
}

const PANEL =
  "rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-6 shadow-sm";
const PRIMARY_LINK =
  "inline-flex rounded-xl bg-[color:var(--aipify-companion-purple)] px-4 py-2 text-sm font-semibold text-white";

export function CertifiedSalesPartnerWorkspacePanel({ labels, children }: Props) {
  const [state, setState] = useState<WorkspaceState>("loading");
  const [pendingStatus, setPendingStatus] = useState<CspPendingStatus | null>(null);
  const [portal, setPortal] = useState<CspPortalView | null>(null);
  const [detail, setDetail] = useState<string | null>(null);

  async function load() {
    setState("loading");
    setPortal(null);
    setPendingStatus(null);
    try {
      const res = await fetch("/api/certified-sales-partner/portal", { cache: "no-store" });
      const data: unknown = await res.json().catch(() => ({}));
      const gate = classifyCspPortalResponse(res.status, data);
      switch (gate.kind) {
        case "unauthorized":
          setState("unauthorized");
          return;
        case "not_registered":
          setState("not_registered");
          return;
        case "backend_closed":
          // Core CSP storage/RPC genuinely not applied — keep the fail-closed message.
          setDetail(gate.detail);
          setState("closed");
          return;
        case "error":
          setDetail(gate.detail);
          setState("error");
          return;
        case "pending":
          setPendingStatus(gate.status);
          setState("pending");
          return;
        case "ready":
          setPortal(parseCspPortalView(data));
          setState("ready");
          return;
      }
    } catch {
      setState("error");
      setDetail(null);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className={`${AipifyShellClasses.canvas} space-y-6 p-6 lg:p-8`}>
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--aipify-companion-purple)]">
          Aipify
        </p>
        <h1 className="text-2xl font-semibold text-[color:var(--aipify-text-primary)]">{labels.title}</h1>
        <p className="max-w-3xl text-sm text-[color:var(--aipify-text-secondary)]">{labels.subtitle}</p>
      </header>

      {state === "loading" ? (
        <p className="sr-only">{labels.loading}</p>
      ) : null}

      {state === "closed" ? (
        <section className="rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-6 shadow-sm" role="status">
          <h2 className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">{labels.notReadyTitle}</h2>
          <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{labels.notReadyBody}</p>
          {detail ? (
            <p className="mt-2 text-xs text-[color:var(--aipify-text-secondary)]">{detail}</p>
          ) : null}
          <button
            type="button"
            onClick={() => void load()}
            className="mt-4 inline-flex rounded-xl bg-[color:var(--aipify-companion-purple)] px-4 py-2 text-sm font-semibold text-white"
          >
            {labels.retry}
          </button>
        </section>
      ) : null}

      {state === "unauthorized" ? (
        <section className={PANEL} role="status">
          <h2 className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">{labels.unauthorizedTitle}</h2>
          <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{labels.unauthorizedBody}</p>
          <Link href={buildCspLoginUrl("/partners")} className={`mt-4 ${PRIMARY_LINK}`}>
            {labels.signIn}
          </Link>
        </section>
      ) : null}

      {state === "not_registered" ? (
        <section className={PANEL} role="status">
          <h2 className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">{labels.notRegisteredTitle}</h2>
          <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{labels.notRegisteredBody}</p>
          <Link href="/certified-sales-partner#apply" className={`mt-4 ${PRIMARY_LINK}`}>
            {labels.applyCta}
          </Link>
        </section>
      ) : null}

      {state === "pending" && pendingStatus ? (
        <section className={PANEL} role="status" aria-labelledby="csp-pending-title">
          <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--aipify-companion-purple)]">
            {labels.pending.statusLabel}
          </p>
          <h2 id="csp-pending-title" className="mt-1 text-lg font-semibold text-[color:var(--aipify-text-primary)]">
            {labels.pending.statuses[pendingStatus].title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-[color:var(--aipify-text-secondary)]">
            {labels.pending.statuses[pendingStatus].body}
          </p>
          <h3 className="mt-4 text-sm font-semibold text-[color:var(--aipify-text-primary)]">{labels.pending.nextTitle}</h3>
          <p className="mt-1 max-w-3xl text-sm text-[color:var(--aipify-text-secondary)]">
            {labels.pending.statuses[pendingStatus].next}
          </p>
          {pendingStatus !== "under_review" ? (
            <Link href="/contact" className={`mt-4 ${PRIMARY_LINK}`}>
              {labels.pending.contactCta}
            </Link>
          ) : null}
        </section>
      ) : null}

      {state === "error" ? (
        <section className="rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-6" role="alert">
          <h2 className="text-lg font-semibold">{labels.errorTitle}</h2>
          {detail ? <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{detail}</p> : null}
          <button type="button" onClick={() => void load()} className="mt-4 text-sm font-semibold text-[color:var(--aipify-companion-purple)]">
            {labels.retry}
          </button>
        </section>
      ) : null}

      {/* One stable container so children are not remounted when Core finishes loading. */}
      {children && state !== "pending" && state !== "unauthorized" && state !== "not_registered" ? (
        <CspPortalContext.Provider value={state === "ready" ? portal : null}>
          <div className={state === "ready" ? undefined : "opacity-90"}>{children}</div>
        </CspPortalContext.Provider>
      ) : null}
    </div>
  );
}
