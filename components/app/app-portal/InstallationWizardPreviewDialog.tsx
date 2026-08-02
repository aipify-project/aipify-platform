"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { InstallationWizard } from "@/components/app/app-portal/InstallationWizard";
import {
  buildInstallationWizardLabels,
  prepareSetupForInstallationWizardPreview,
} from "@/lib/app-portal/integrations/installation";
import {
  parseAppPortalIntegrationSetup,
  type AppPortalIntegrationSetup,
  type AppPortalIntegrationsLabels,
} from "@/lib/app-portal/integrations";

type InstallationWizardPreviewDialogProps = {
  open: boolean;
  providerKey: string;
  labels: AppPortalIntegrationsLabels;
  locale: string;
  onClose: () => void;
};

export function InstallationWizardPreviewDialog({
  open,
  providerKey,
  labels,
  locale,
  onClose,
}: InstallationWizardPreviewDialogProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [setup, setSetup] = useState<AppPortalIntegrationSetup | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [instanceKey, setInstanceKey] = useState(0);

  const translate = useCallback(
    (key: string) => {
      const short = key.replace(/^customerApp\./, "");
      return (
        labels.setup.messageCatalog[key] ??
        labels.setup.messageCatalog[short] ??
        key
      );
    },
    [labels.setup.messageCatalog]
  );
  const wizLabels = buildInstallationWizardLabels(translate);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSetup(null);
    try {
      const res = await fetch(
        `/api/app-portal/integrations/${encodeURIComponent(providerKey)}?mode=preview`,
        { cache: "no-store" }
      );
      if (!res.ok) {
        setError(wizLabels.errorGeneric);
        return;
      }
      const parsed = parseAppPortalIntegrationSetup(await res.json());
      if (!parsed) {
        setError(wizLabels.errorGeneric);
        return;
      }
      setSetup(prepareSetupForInstallationWizardPreview(parsed));
      setInstanceKey((k) => k + 1);
    } catch {
      setError(wizLabels.errorGeneric);
    } finally {
      setLoading(false);
    }
  }, [providerKey, wizLabels.errorGeneric]);

  useEffect(() => {
    if (!open) {
      setSetup(null);
      setError(null);
      return;
    }
    void load();
  }, [open, load]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex h-full w-full max-w-6xl flex-col overflow-hidden bg-[#F7F6F3] shadow-2xl dark:bg-slate-950 sm:h-[min(92vh,56rem)] sm:rounded-2xl"
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900 sm:px-6">
          <div className="min-w-0">
            <p
              id={titleId}
              className="text-sm font-semibold text-violet-700 dark:text-violet-300"
            >
              {wizLabels.previewBadge}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {wizLabels.previewNotice}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {wizLabels.previewClose}
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {loading ? (
            <p className="p-6 text-sm text-slate-500" aria-live="polite">
              {translate(
                "customerApp.portalStructure.integrations.installationWizard.loading"
              )}
            </p>
          ) : null}
          {error ? (
            <p className="p-6 text-sm text-rose-700" role="alert">
              {error}
            </p>
          ) : null}
          {setup ? (
            <InstallationWizard
              key={`${providerKey}:${instanceKey}`}
              providerKey={providerKey}
              setup={setup}
              labels={labels}
              locale={locale}
              mode="preview"
              entry="preview_dialog"
              onReload={async () => {
                /* Preview never reloads persisted setup for mutation. */
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
