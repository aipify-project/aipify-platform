"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AppLayoutClasses } from "@/lib/design/app-layout";
import { kompisContextLabelKey } from "@/lib/kompis-customer-workspace/route-layout";
import type { KompisConfirmationCard, KompisWorkspacePermissions } from "@/lib/kompis-customer-workspace";
import { useKompisGlobal } from "./KompisGlobalProvider";
import { KompisCustomerWorkspaceShell } from "./KompisCustomerWorkspaceShell";

type RuntimeResult = {
  kind: string;
  title: string;
  body: string;
  source?: string;
  draft_id?: string;
  executed?: boolean;
};

function parsePermissions(json: string | null): KompisWorkspacePermissions | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as KompisWorkspacePermissions;
  } catch {
    return null;
  }
}

export function KompisGlobalPanel() {
  const {
    open,
    closeKompis,
    layoutMode,
    capability,
    labels,
    locale,
    organizationName,
    userRole,
    initialPermissionsJson,
  } = useKompisGlobal();

  const panelRef = useRef<HTMLDivElement>(null);
  const [permissions, setPermissions] = useState<KompisWorkspacePermissions | null>(() =>
    parsePermissions(initialPermissionsJson)
  );
  const [confirmation, setConfirmation] = useState<KompisConfirmationCard | null>(null);
  const [result, setResult] = useState<RuntimeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [bootedForRoute, setBootedForRoute] = useState<string | null>(null);

  const contextKey = kompisContextLabelKey(capability.contextKey);
  const contextLabel = labels.contexts[contextKey] ?? labels.contexts.generic;
  const prompts =
    labels.prompts[contextKey as keyof typeof labels.prompts] ?? labels.prompts.generic;

  const contextHeader = useMemo(
    () => ({
      module: contextLabel,
      route: capability.route,
      safeSummary: `${labels.contextPrefix}: ${contextLabel}`,
      status: permissions?.enabled
        ? undefined
        : labels.labelsCatalog["customerApp.portalStructure.kompisWorkspace.states.denied"],
    }),
    [capability.route, contextLabel, labels.contextPrefix, labels.labelsCatalog, permissions?.enabled]
  );

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const boot = async () => {
      if (bootedForRoute === capability.route && sessionId) return;
      try {
        const sessionRes = await fetch("/api/kompis-customer-workspace/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locale, surface: "authenticated_portal" }),
        });
        const sessionJson = await sessionRes.json().catch(() => ({}));
        if (!cancelled && sessionRes.ok && typeof sessionJson?.session_id === "string") {
          setSessionId(sessionJson.session_id);
          setBootedForRoute(capability.route);
        }

        const permRes = await fetch(
          `/api/kompis-customer-workspace/permissions?route=${encodeURIComponent(capability.route)}&module=${encodeURIComponent(capability.module)}`,
          { cache: "no-store" }
        );
        if (!cancelled && permRes.ok) {
          const permJson = await permRes.json().catch(() => ({}));
          if (permJson?.permissions) {
            setPermissions(permJson.permissions as KompisWorkspacePermissions);
          }
        }
      } catch {
        if (!cancelled) {
          setError(
            labels.labelsCatalog["customerApp.portalStructure.kompisWorkspace.states.error"]
          );
        }
      }
    };
    void boot();
    return () => {
      cancelled = true;
    };
  }, [bootedForRoute, capability.module, capability.route, labels.labelsCatalog, locale, open, sessionId]);

  useEffect(() => {
    if (!open || layoutMode !== "overlay") return;
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    return () => {
      previous?.focus?.();
    };
  }, [layoutMode, open]);

  // Clear confirmation when route changes — never auto-resume privileged confirm
  useEffect(() => {
    setConfirmation(null);
    setResult(null);
    setError(null);
  }, [capability.route]);

  const invoke = async (toolKey: string, extra?: Record<string, unknown>) => {
    setActing(true);
    setError(null);
    try {
      const res = await fetch("/api/kompis-customer-workspace/invoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool_key: toolKey,
          route: capability.route,
          module: capability.module,
          locale,
          session_id: sessionId,
          ...extra,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.ok === false) {
        setError(
          json?.message ||
            labels.labelsCatalog["customerApp.portalStructure.kompisWorkspace.states.error"]
        );
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
      setError(labels.labelsCatalog["customerApp.portalStructure.kompisWorkspace.states.error"]);
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
          route: capability.route,
          locale,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.ok === false) {
        setError(
          json?.message ||
            labels.labelsCatalog["customerApp.portalStructure.kompisWorkspace.states.error"]
        );
        return;
      }
      setConfirmation(null);
      setResult({
        kind: json.kind ?? "receipt",
        title: json.title ?? labels.labelsCatalog.resultTitle,
        body: json.body ?? "",
        executed: json.executed === true,
      });
    } catch {
      setError(labels.labelsCatalog["customerApp.portalStructure.kompisWorkspace.states.error"]);
    } finally {
      setActing(false);
    }
  };

  if (!open) return null;

  const presentation = layoutMode === "split" ? "docked" : layoutMode === "full" ? "full" : "overlay";

  const body = (
    <div
      ref={panelRef}
      tabIndex={-1}
      className={
        presentation === "docked"
          ? AppLayoutClasses.dockedPanel
          : presentation === "full"
            ? "flex h-full flex-col"
            : "flex h-full min-h-0 flex-col"
      }
      data-kompis-global-panel="true"
      data-kompis-layout={layoutMode}
      data-kompis-route={capability.route}
      aria-label={labels.title}
    >
      <KompisCustomerWorkspaceShell
        locale={locale}
        labelsCatalog={labels.labelsCatalog}
        contextHeader={contextHeader}
        permissions={permissions}
        confirmation={confirmation}
        onConfirm={() => void onConfirm()}
        onCancelConfirm={() => setConfirmation(null)}
        onClose={closeKompis}
        presentation={presentation}
        suggestedPrompts={prompts}
        onPromptSelect={(prompt) => {
          void invoke("get_current_page_help", { prompt });
        }}
        runtimeSlot={
          <div className="space-y-3" data-kompis-runtime-actions="true">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {organizationName} · {userRole}
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                disabled={acting}
                data-kompis-action="read"
                onClick={() => void invoke("get_my_access_status")}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white disabled:opacity-60"
              >
                {labels.labelsCatalog.readAction}
              </button>
              <button
                type="button"
                disabled={acting}
                data-kompis-action="draft"
                onClick={() =>
                  void invoke("create_draft", {
                    title: labels.labelsCatalog.draftTitle,
                    body: labels.labelsCatalog.draftBody,
                  })
                }
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-violet-400 px-4 text-sm font-semibold text-violet-800 dark:text-violet-200 disabled:opacity-60"
              >
                {labels.labelsCatalog.draftAction}
              </button>
              <button
                type="button"
                disabled={acting}
                data-kompis-action="confirm-pref"
                onClick={() =>
                  void invoke("update_preference", {
                    preference_key: "workspace_assist",
                    preference_value: "enabled",
                    idempotency_key: `pref_${capability.route}_${Date.now()}`,
                  })
                }
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-amber-400 px-4 text-sm font-semibold text-amber-900 dark:text-amber-100 disabled:opacity-60"
              >
                {labels.labelsCatalog.confirmPrefAction}
              </button>
            </div>
            {error ? (
              <p
                className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-800 dark:text-rose-200"
                role="alert"
              >
                {error}
              </p>
            ) : null}
            {result ? (
              <section
                className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm"
                data-kompis-result={result.kind}
                aria-live="polite"
              >
                <p className="font-semibold">{labels.labelsCatalog.resultTitle}</p>
                <p className="mt-1 font-medium">{result.title}</p>
                <pre className="mt-2 whitespace-pre-wrap font-sans text-xs opacity-90">
                  {result.body}
                </pre>
                {result.draft_id ? (
                  <p className="mt-1 text-xs opacity-80" data-kompis-draft="true">
                    {labels.labelsCatalog.draftBody}
                  </p>
                ) : null}
                {result.executed ? (
                  <p className="mt-1 text-xs opacity-80">{labels.labelsCatalog.receiptOk}</p>
                ) : null}
              </section>
            ) : null}
          </div>
        }
      />
    </div>
  );

  if (layoutMode === "overlay") {
    return (
      <>
        <button
          type="button"
          className={AppLayoutClasses.overlayBackdrop}
          aria-label={labels.closeButton}
          onClick={closeKompis}
        />
        <aside className={AppLayoutClasses.overlayPanel} role="dialog" aria-modal="true">
          {body}
        </aside>
      </>
    );
  }

  return body;
}
