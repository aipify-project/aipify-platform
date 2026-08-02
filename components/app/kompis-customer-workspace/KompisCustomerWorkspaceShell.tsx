"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  buildKompisWorkspaceLabels,
  listKompisWorkspaceLocales,
  resolveKompisWorkspaceTextDirection,
  type KompisConfirmationCard,
  type KompisWorkspacePermissions,
} from "@/lib/kompis-customer-workspace";

function catalogTranslate(catalog: Record<string, string>, key: string): string {
  return catalog[key] ?? "";
}

export type KompisWorkspacePresentation = "overlay" | "docked" | "full";

export type KompisCustomerWorkspaceShellProps = {
  locale: string;
  labelsCatalog: Record<string, string>;
  contextHeader: {
    module: string;
    route: string;
    safeSummary: string;
    status?: string | null;
  };
  permissions: KompisWorkspacePermissions | null;
  confirmation?: KompisConfirmationCard | null;
  onConfirm?: () => void;
  onCancelConfirm?: () => void;
  onMinimizeChange?: (minimized: boolean) => void;
  onClose?: () => void;
  presentation?: KompisWorkspacePresentation;
  suggestedPrompts?: string[];
  onPromptSelect?: (prompt: string) => void;
  runtimeSlot?: React.ReactNode;
  rtlSupport?: boolean;
};

function toneClass(kind: "ok" | "info" | "warn" | "danger" | "assist" | "muted"): string {
  switch (kind) {
    case "ok":
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100";
    case "info":
      return "border-sky-500/40 bg-sky-500/10 text-sky-900 dark:text-sky-100";
    case "warn":
      return "border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-50";
    case "danger":
      return "border-rose-500/40 bg-rose-500/10 text-rose-900 dark:text-rose-100";
    case "assist":
      return "border-violet-500/40 bg-violet-500/10 text-violet-950 dark:text-violet-50";
    default:
      return "border-slate-300/60 bg-slate-100/70 text-slate-700 dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-200";
  }
}

export function KompisCustomerWorkspaceShell({
  locale,
  labelsCatalog,
  contextHeader,
  permissions,
  confirmation = null,
  onConfirm,
  onCancelConfirm,
  onMinimizeChange,
  onClose,
  presentation = "overlay",
  suggestedPrompts = [],
  onPromptSelect,
  runtimeSlot,
  rtlSupport = true,
}: KompisCustomerWorkspaceShellProps) {
  const [minimized, setMinimized] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const labels = useMemo(
    () => buildKompisWorkspaceLabels((key) => catalogTranslate(labelsCatalog, key)),
    [labelsCatalog]
  );
  const dir = resolveKompisWorkspaceTextDirection(locale, rtlSupport);
  const locales = listKompisWorkspaceLocales();
  const isDocked = presentation === "docked" || presentation === "full";

  const setMin = (value: boolean) => {
    setMinimized(value);
    onMinimizeChange?.(value);
  };

  if (minimized && !isDocked) {
    return (
      <button
        type="button"
        dir={dir}
        onClick={() => setMin(false)}
        className="fixed bottom-4 right-4 z-40 inline-flex min-h-12 min-w-12 items-center justify-center rounded-full bg-violet-600 px-4 text-sm font-semibold text-white shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
        aria-label={labels.expand}
        data-kompis-workspace-locales={locales.join(",")}
      >
        {labels.title}
      </button>
    );
  }

  const denied = permissions != null && !permissions.enabled;

  const surfaceClass = isDocked
    ? "relative flex h-full min-h-[24rem] w-full flex-col border-0 bg-transparent shadow-none"
    : [
        "fixed z-40 flex flex-col border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-950",
        "bottom-0 right-0 left-0 max-h-[92vh] rounded-t-2xl sm:bottom-4 sm:right-4 sm:left-auto sm:w-[26rem] sm:max-h-[80vh] sm:rounded-2xl",
        expanded ? "sm:w-[36rem]" : "",
      ].join(" ");

  return (
    <section
      dir={dir}
      data-kompis-workspace-locales={locales.join(",")}
      data-kompis-presentation={presentation}
      aria-label={labels.title}
      className={surfaceClass}
    >
      <header className={`border-b px-4 py-3 ${toneClass("assist")}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-semibold">{labels.title}</h2>
            <p className="mt-1 text-sm opacity-90">{labels.reassurance}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            {!isDocked ? (
              <button
                type="button"
                className="min-h-10 rounded-lg border border-current/20 px-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? labels.minimize : labels.expand}
              </button>
            ) : null}
            <button
              type="button"
              className="min-h-10 rounded-lg border border-current/20 px-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              onClick={() => {
                if (onClose) {
                  onClose();
                  return;
                }
                setMin(true);
              }}
            >
              {onClose ? labels.close : labels.minimize}
            </button>
          </div>
        </div>
        <div className="mt-3 rounded-xl border border-white/30 bg-white/40 px-3 py-2 text-sm dark:bg-black/20">
          <p className="font-medium">{contextHeader.module}</p>
          <p className="mt-0.5 opacity-90">{contextHeader.safeSummary}</p>
          {contextHeader.status ? (
            <p className="mt-1 text-xs opacity-80" aria-live="polite">
              {contextHeader.status}
            </p>
          ) : null}
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4" role="region" aria-live="polite">
        {suggestedPrompts.length > 0 ? (
          <section aria-labelledby="kompis-suggestions-heading">
            <h3
              id="kompis-suggestions-heading"
              className="text-sm font-semibold text-slate-900 dark:text-slate-50"
            >
              {labels.suggestions}
            </h3>
            <ul className="mt-2 space-y-2">
              {suggestedPrompts.map((prompt) => (
                <li key={prompt}>
                  <button
                    type="button"
                    className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${toneClass("assist")}`}
                    onClick={() => onPromptSelect?.(prompt)}
                  >
                    {prompt}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {runtimeSlot}

        {denied ? (
          <div className={`rounded-xl border px-3 py-3 text-sm ${toneClass("danger")}`} role="alert">
            <p className="font-medium">{labels.denied}</p>
            <p className="mt-1 opacity-90">
              {labels.whyDenied}: {(permissions?.denied_reasons ?? []).join(", ") || labels.emptyFallback}
            </p>
          </div>
        ) : null}

        {!denied && permissions ? (
          <>
            <section aria-labelledby="kompis-knowledge-heading">
              <h3 id="kompis-knowledge-heading" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {labels.knowledge}
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                {permissions.allowed_knowledge_sources.length ? (
                  permissions.allowed_knowledge_sources.map((source) => (
                    <li key={source} className={`rounded-lg border px-3 py-2 ${toneClass("info")}`}>
                      {source}
                    </li>
                  ))
                ) : (
                  <li className={`rounded-lg border px-3 py-2 ${toneClass("muted")}`}>{labels.empty}</li>
                )}
              </ul>
            </section>

            <section aria-labelledby="kompis-actions-heading">
              <h3 id="kompis-actions-heading" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {labels.actions}
              </h3>
              <ul className="mt-2 space-y-1 text-sm">
                {permissions.allowed_tools.length ? (
                  permissions.allowed_tools.map((tool) => (
                    <li key={tool} className={`rounded-lg border px-3 py-2 ${toneClass("assist")}`}>
                      {tool}
                      <span className="ml-2 text-xs opacity-70">
                        {permissions.confirmation_levels[tool] ?? "none"}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className={`rounded-lg border px-3 py-2 ${toneClass("muted")}`}>{labels.empty}</li>
                )}
              </ul>
            </section>

            {permissions.support_handoff_enabled ? (
              <section className={`rounded-xl border px-3 py-3 text-sm ${toneClass("warn")}`}>
                <h3 className="font-semibold">{labels.support}</h3>
                <p className="mt-1 opacity-90">{labels.reassurance}</p>
              </section>
            ) : null}

            {!permissions.commercial_guidance_enabled ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">{labels.commercialDisabled}</p>
            ) : null}
          </>
        ) : null}

        {confirmation ? (
          <section
            className={`rounded-xl border px-3 py-3 text-sm ${toneClass("warn")}`}
            aria-labelledby="kompis-confirm-heading"
            role="dialog"
            aria-modal="true"
          >
            <h3 id="kompis-confirm-heading" className="font-semibold">
              {labels.confirmation}
            </h3>
            <p className="mt-2">{confirmation.summary}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {confirmation.consequences.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                onClick={onConfirm}
              >
                {labels.confirmAction}
              </button>
              <button
                type="button"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-medium dark:border-slate-600"
                onClick={onCancelConfirm}
              >
                {labels.cancelAction}
              </button>
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}
