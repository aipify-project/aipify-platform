"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { parseCspPortalView, type CspPortalView } from "@/lib/certified-sales-partner/portal-view";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";

export type CspWorkspaceLabels = {
  title: string;
  subtitle: string;
  loading: string;
  notReadyTitle: string;
  notReadyBody: string;
  retry: string;
  errorTitle: string;
};

type Props = {
  labels: CspWorkspaceLabels;
  children?: ReactNode;
};

type PortalPayload = {
  backend_ready?: boolean;
  found?: boolean;
  error?: string;
  kompis_help_enabled?: boolean;
};

/**
 * Core portal bundle shared with child panels so the dashboard, certifications and settlement pages
 * read ONE `GET /api/certified-sales-partner/portal` response. `null` until Core confirms it is ready.
 */
const CspPortalContext = createContext<CspPortalView | null>(null);

export function useCspPortal(): CspPortalView | null {
  return useContext(CspPortalContext);
}

export function CertifiedSalesPartnerWorkspacePanel({ labels, children }: Props) {
  const [state, setState] = useState<"loading" | "ready" | "closed" | "error">("loading");
  const [portal, setPortal] = useState<CspPortalView | null>(null);
  const [detail, setDetail] = useState<string | null>(null);

  async function load() {
    setState("loading");
    setPortal(null);
    try {
      const res = await fetch("/api/certified-sales-partner/portal", { cache: "no-store" });
      const data = (await res.json().catch(() => ({}))) as PortalPayload;
      if (res.status === 503 || data.backend_ready === false || data.found === false) {
        setDetail(data.error ?? null);
        setState("closed");
        return;
      }
      if (!res.ok) {
        setDetail(data.error ?? String(res.status));
        setState("error");
        return;
      }
      setPortal(parseCspPortalView(data));
      setState("ready");
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
      {children ? (
        <CspPortalContext.Provider value={state === "ready" ? portal : null}>
          <div className={state === "ready" ? undefined : "opacity-90"}>{children}</div>
        </CspPortalContext.Provider>
      ) : null}
    </div>
  );
}
