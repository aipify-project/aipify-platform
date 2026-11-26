"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { CspPendingStatus } from "@/lib/certified-sales-partner/portal-gate";
import { buildCspLoginUrl } from "@/lib/certified-sales-partner/registration-outcome";
import {
  CspPortalSessionProvider,
  useCspPortal,
  useOptionalCspPortalSession,
} from "./CspPortalSessionProvider";

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

export { useCspPortal };

const PANEL =
  "rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-6 shadow-sm";
const PRIMARY_LINK =
  "inline-flex rounded-xl bg-[color:var(--aipify-companion-purple)] px-4 py-2 text-sm font-semibold text-white";

/**
 * Page chrome + gate UI. Portal data comes from `CspPortalSessionProvider` in the
 * partners layout so menu navigation does not re-hit Core on every route.
 *
 * When rendered without a layout provider (legacy/tests), wraps children in a
 * one-off session provider so behaviour stays fail-closed.
 */
export function CertifiedSalesPartnerWorkspacePanel({ labels, children }: Props) {
  const session = useOptionalCspPortalSession();
  if (!session) {
    return (
      <CspPortalSessionProvider>
        <WorkspaceBody labels={labels}>{children}</WorkspaceBody>
      </CspPortalSessionProvider>
    );
  }
  return <WorkspaceBody labels={labels}>{children}</WorkspaceBody>;
}

function WorkspaceBody({ labels, children }: Props) {
  const session = useOptionalCspPortalSession();
  if (!session) return null;

  const { state, pendingStatus, detail, reload } = session;

  return (
    <div className="space-y-5">
      {state === "loading" ? <p className="sr-only">{labels.loading}</p> : null}

      {state === "closed" ? (
        <section
          className="rounded-2xl border border-[#E8E4F2] bg-white p-5 shadow-sm"
          role="status"
        >
          <h2 className="text-lg font-semibold text-[#1E293B]">{labels.notReadyTitle}</h2>
          <p className="mt-2 text-sm text-[#64748B]">{labels.notReadyBody}</p>
          {detail ? <p className="mt-2 text-xs text-[#64748B]">{detail}</p> : null}
          <button
            type="button"
            onClick={() => void reload()}
            className="mt-4 inline-flex rounded-xl bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white"
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
        <section
          className="rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-6"
          role="alert"
        >
          <h2 className="text-lg font-semibold">{labels.errorTitle}</h2>
          {detail ? <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{detail}</p> : null}
          <button
            type="button"
            onClick={() => void reload()}
            className="mt-4 text-sm font-semibold text-[color:var(--aipify-companion-purple)]"
          >
            {labels.retry}
          </button>
        </section>
      ) : null}

      {children && state !== "pending" && state !== "unauthorized" && state !== "not_registered" ? (
        <div className={state === "ready" ? undefined : "opacity-90"}>{children}</div>
      ) : null}
    </div>
  );
}
