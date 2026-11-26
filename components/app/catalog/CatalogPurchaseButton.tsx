"use client";

import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import { useState, useTransition } from "react";

type CatalogPurchaseButtonProps = {
  offerId: string;
  label: string;
  pendingLabel: string;
  errorLabel: string;
};

export function CatalogPurchaseButton({
  offerId,
  label,
  pendingLabel,
  errorLabel,
}: CatalogPurchaseButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={pending || !offerId}
        className={`inline-flex min-h-11 w-full items-center justify-center rounded-[var(--app-radius-md)] bg-[var(--app-primary)] px-4 text-sm font-medium text-white disabled:opacity-60 ${AppPremiumShell.focusRing}`}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              const response = await fetch("/api/app-commerce/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ offerId }),
              });
              const payload = (await response.json().catch(() => ({}))) as {
                checkoutUrl?: string;
                blocked?: boolean;
                message?: string;
                error?: string;
              };
              if (!response.ok) {
                setError(payload.message || errorLabel);
                return;
              }
              if (payload.blocked) {
                setError(payload.message || errorLabel);
                return;
              }
              if (payload.checkoutUrl) {
                window.location.assign(payload.checkoutUrl);
                return;
              }
              setError(errorLabel);
            } catch {
              setError(errorLabel);
            }
          });
        }}
      >
        {pending ? pendingLabel : label}
      </button>
      {error ? (
        <p className="text-center text-sm text-[var(--app-text-muted)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
