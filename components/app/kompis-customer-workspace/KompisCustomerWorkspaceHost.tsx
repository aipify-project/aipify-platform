"use client";

import { useEffect, useMemo, useState } from "react";
import {
  KompisCustomerWorkspaceShell,
  type KompisCustomerWorkspaceShellProps,
} from "./KompisCustomerWorkspaceShell";
import type { KompisConfirmationCard, KompisWorkspacePermissions } from "@/lib/kompis-customer-workspace";

type HostLabels = KompisCustomerWorkspaceShellProps["labelsCatalog"] & {
  readAction: string;
  draftAction: string;
  confirmPrefAction: string;
  draftTitle: string;
  draftBody: string;
  resultTitle: string;
  adminTitle: string;
  adminEnable: string;
  adminDisable: string;
  adminHidden: string;
  receiptOk: string;
};

type AdminState = {
  admin?: boolean;
  visible?: boolean;
  enabled?: boolean;
  authenticated_enabled?: boolean;
  status?: string;
};

type Props = {
  locale: string;
  labelsCatalog: HostLabels;
  organizationName: string;
  userRole: string;
  initialPermissions: KompisWorkspacePermissions | null;
  contextSummary: string;
  isAdmin: boolean;
  /** Server-validated current route; defaults to dedicated workspace page. */
  route?: string;
  module?: string;
  /** When true, omit floating shell (global APP shell owns presentation). */
  suppressFloatingShell?: boolean;
};

type RuntimeResult = {
  kind: string;
  title: string;
  body: string;
  source?: string;
  draft_id?: string;
  executed?: boolean;
};

export function KompisCustomerWorkspaceHost({
  locale,
  labelsCatalog,
  organizationName,
  userRole,
  initialPermissions,
  contextSummary,
  isAdmin,
  route = "/app/kompis-workspace",
  module = "account",
  suppressFloatingShell = false,
}: Props) {
  const [permissions, setPermissions] = useState(initialPermissions);
  const [confirmation, setConfirmation] = useState<KompisConfirmationCard | null>(null);
  const [result, setResult] = useState<RuntimeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [admin, setAdmin] = useState<AdminState | null>(null);
  const [handoffTopic, setHandoffTopic] = useState<string | null>(null);

  const contextHeader = useMemo(
    () => ({
      module,
      route,
      safeSummary: handoffTopic
        ? `${contextSummary} · ${handoffTopic}`
        : contextSummary,
      status: permissions?.enabled ? undefined : labelsCatalog["customerApp.portalStructure.kompisWorkspace.states.denied"],
    }),
    [contextSummary, handoffTopic, labelsCatalog, module, permissions?.enabled, route]
  );

  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const publicSessionId = params.get("kompis_public_session");
        const topic = params.get("kompis_topic");
        if (topic) setHandoffTopic(topic.slice(0, 280));

        if (publicSessionId) {
          const handoffRes = await fetch("/api/kompis-customer-workspace/handoff", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              public_session_id: publicSessionId,
              topic_summary: topic,
              locale,
              return_path: route,
            }),
          });
          const handoffJson = await handoffRes.json().catch(() => ({}));
          if (!cancelled && handoffRes.ok) {
            setSessionId(
              typeof handoffJson?.session?.session_id === "string"
                ? handoffJson.session.session_id
                : null
            );
            if (typeof handoffJson?.preserved_topic === "string") {
              setHandoffTopic(handoffJson.preserved_topic);
            }
          }
        } else {
          const sessionRes = await fetch("/api/kompis-customer-workspace/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ locale, surface: "authenticated_portal" }),
          });
          const sessionJson = await sessionRes.json().catch(() => ({}));
          if (!cancelled && sessionRes.ok && typeof sessionJson?.session_id === "string") {
            setSessionId(sessionJson.session_id);
          }
        }

        if (isAdmin) {
          const adminRes = await fetch("/api/kompis-customer-workspace/admin", {
            cache: "no-store",
          });
          const adminJson = (await adminRes.json().catch(() => ({}))) as AdminState;
          if (!cancelled && adminRes.ok) setAdmin(adminJson);
        }
      } catch {
        if (!cancelled) setError(labelsCatalog["customerApp.portalStructure.kompisWorkspace.states.error"]);
      }
    };
    void boot();
    return () => {
      cancelled = true;
    };
  }, [isAdmin, labelsCatalog, locale, route]);

  const invoke = async (toolKey: string, extra?: Record<string, unknown>) => {
    setActing(true);
    setError(null);
    try {
      const res = await fetch("/api/kompis-customer-workspace/invoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool_key: toolKey,
          route,
          module,
          locale,
          session_id: sessionId,
          ...extra,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.ok === false) {
        setError(json?.message || labelsCatalog["customerApp.portalStructure.kompisWorkspace.states.error"]);
        return;
      }
      if (json.kind === "confirmation_required" && json.confirmation) {
        setConfirmation(json.confirmation);
        setResult(null);
        return;
      }
      setConfirmation(null);
      setResult({
        kind: json.kind,
        title: json.title,
        body: json.body,
        source: json.source,
        draft_id: json.draft_id,
        executed: json.executed === true,
      });
    } catch {
      setError(labelsCatalog["customerApp.portalStructure.kompisWorkspace.states.error"]);
    } finally {
      setActing(false);
    }
  };

  const onConfirm = async () => {
    if (!confirmation) return;
    setActing(true);
    setError(null);
    try {
      const res = await fetch("/api/kompis-customer-workspace/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmation_id: confirmation.confirmation_id,
          route,
          locale,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.ok === false) {
        setError(json?.message || labelsCatalog["customerApp.portalStructure.kompisWorkspace.states.error"]);
        return;
      }
      setConfirmation(null);
      setResult({
        kind: json.kind,
        title: json.title,
        body: json.body,
        executed: json.executed === true,
      });
    } catch {
      setError(labelsCatalog["customerApp.portalStructure.kompisWorkspace.states.error"]);
    } finally {
      setActing(false);
    }
  };

  const toggleAdmin = async (enabled: boolean) => {
    setActing(true);
    try {
      const res = await fetch("/api/kompis-customer-workspace/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled, authenticated_enabled: enabled, reason: "admin_toggle" }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setAdmin((prev) => ({ ...(prev ?? {}), ...json, visible: true, admin: true }));
        // Refresh permissions via contract
        const contractRes = await fetch("/api/kompis-customer-workspace/contract", { cache: "no-store" });
        const contractJson = await contractRes.json().catch(() => ({}));
        if (contractJson?.contract) {
          setPermissions(initialPermissions);
        }
      } else {
        setError(json?.error || labelsCatalog["customerApp.portalStructure.kompisWorkspace.states.error"]);
      }
    } finally {
      setActing(false);
    }
  };

  return (
    <div className="space-y-6" data-kompis-customer-workspace="true">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          {labelsCatalog["customerApp.portalStructure.kompisWorkspace.title"]}
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
          {labelsCatalog["customerApp.portalStructure.kompisWorkspace.reassurance"]}
        </p>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          {organizationName} · {userRole}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            disabled={acting}
            data-kompis-action="read"
            onClick={() => void invoke("get_my_access_status")}
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
          >
            {labelsCatalog.readAction}
          </button>
          <button
            type="button"
            disabled={acting}
            data-kompis-action="draft"
            onClick={() =>
              void invoke("create_draft", {
                title: labelsCatalog.draftTitle,
                body: labelsCatalog.draftBody,
              })
            }
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-violet-400 px-5 text-sm font-semibold text-violet-800 dark:text-violet-200 disabled:opacity-60"
          >
            {labelsCatalog.draftAction}
          </button>
          <button
            type="button"
            disabled={acting}
            data-kompis-action="confirm-pref"
            onClick={() =>
              void invoke("update_preference", {
                preference_key: "workspace_assist",
                preference_value: "enabled",
                idempotency_key: `pref_${Date.now()}`,
              })
            }
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-amber-400 px-5 text-sm font-semibold text-amber-900 dark:text-amber-100 disabled:opacity-60"
          >
            {labelsCatalog.confirmPrefAction}
          </button>
        </div>

        {error ? (
          <p className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-800 dark:text-rose-200" role="alert">
            {error}
          </p>
        ) : null}

        {result ? (
          <section
            className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-950 dark:text-emerald-50"
            data-kompis-result={result.kind}
            aria-live="polite"
          >
            <h2 className="font-semibold">{labelsCatalog.resultTitle}</h2>
            <p className="mt-1 font-medium">{result.title}</p>
            <pre className="mt-2 whitespace-pre-wrap font-sans opacity-90">{result.body}</pre>
            {result.source ? <p className="mt-2 text-xs opacity-80">Source: {result.source}</p> : null}
            {result.draft_id ? (
              <p className="mt-1 text-xs opacity-80">Draft: {result.draft_id} · not executed</p>
            ) : null}
            {result.executed ? <p className="mt-1 text-xs opacity-80">{labelsCatalog.receiptOk}</p> : null}
          </section>
        ) : null}

        {isAdmin && admin?.visible ? (
          <section
            className="mt-6 rounded-xl border border-slate-300/70 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-800/50"
            data-kompis-admin="true"
          >
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {labelsCatalog.adminTitle}
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              status={admin.status ?? "missing"} · enabled={String(admin.enabled === true)}
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                disabled={acting}
                onClick={() => void toggleAdmin(true)}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white disabled:opacity-60"
              >
                {labelsCatalog.adminEnable}
              </button>
              <button
                type="button"
                disabled={acting}
                onClick={() => void toggleAdmin(false)}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-medium dark:border-slate-600 disabled:opacity-60"
              >
                {labelsCatalog.adminDisable}
              </button>
            </div>
          </section>
        ) : null}

        {!isAdmin ? (
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400" data-kompis-admin="hidden">
            {labelsCatalog.adminHidden}
          </p>
        ) : null}
      </div>

      {suppressFloatingShell ? null : (
        <KompisCustomerWorkspaceShell
          locale={locale}
          labelsCatalog={labelsCatalog}
          contextHeader={contextHeader}
          permissions={permissions}
          confirmation={confirmation}
          onConfirm={() => void onConfirm()}
          onCancelConfirm={() => setConfirmation(null)}
          presentation="overlay"
        />
      )}
    </div>
  );
}
