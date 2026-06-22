"use client";

import { useEffect, useRef } from "react";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import type { IntegrationRemoveDialogLabels } from "@/lib/app-portal/integrations/types";

export type IntegrationRemoveDialogVariant = "remove" | "disconnect";

type IntegrationRemoveDialogProps = {
  variant: IntegrationRemoveDialogVariant;
  title: string;
  body: string;
  labels: IntegrationRemoveDialogLabels;
  acting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function IntegrationRemoveDialog({
  variant,
  title,
  body,
  labels,
  acting,
  onCancel,
  onConfirm,
}: IntegrationRemoveDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmLabel = variant === "disconnect" ? labels.confirmDisconnect : labels.confirm;

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="remove-integration-title"
        aria-describedby="remove-integration-description"
        className="w-full max-w-md rounded-2xl border border-aipify-border bg-white p-6 shadow-xl"
      >
        <h2 id="remove-integration-title" className={AppPremiumShell.sectionTitle}>
          {title}
        </h2>
        <div id="remove-integration-description" className="mt-3 space-y-2 text-sm text-aipify-text-secondary">
          <p>{body}</p>
          {variant === "disconnect" ? (
            <ul className="list-disc space-y-1 pl-5">
              <li>{labels.disconnectWhat}</li>
              <li>{labels.syncStops}</li>
              <li>{labels.credentialsRemoved}</li>
              <li>{labels.auditRemains}</li>
            </ul>
          ) : null}
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            disabled={acting}
            onClick={onCancel}
            className={`rounded-lg border border-aipify-border px-4 py-2 text-sm font-medium text-aipify-text ${AppPremiumShell.focusRing}`}
          >
            {labels.cancel}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={onConfirm}
            className={`rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${AppPremiumShell.focusRing}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
