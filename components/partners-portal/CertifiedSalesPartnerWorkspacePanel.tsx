"use client";

import { useEffect, useState, type ReactNode } from "react";
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

export function CertifiedSalesPartnerWorkspacePanel({ labels, children }: Props) {
  const [state, setState] = useState<"loading" | "ready" | "closed" | "error">("loading");
  const [detail, setDetail] = useState<string | null>(null);

  async function load() {
    setState("loading");
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

      {state === "ready" ? children : null}
      {state !== "ready" && children ? <div className="opacity-90">{children}</div> : null}
    </div>
  );
}
