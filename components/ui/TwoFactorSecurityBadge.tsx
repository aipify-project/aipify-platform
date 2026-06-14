"use client";

import { useEffect, useState } from "react";

type TwoFactorSecurityBadgeProps = {
  labels: {
    enabled: string;
    required: string;
  };
};

type BadgeStatus = {
  enabled: boolean;
  required: boolean;
};

export function TwoFactorSecurityBadge({ labels }: TwoFactorSecurityBadgeProps) {
  const [status, setStatus] = useState<BadgeStatus | null>(null);

  useEffect(() => {
    void fetch("/api/auth/2fa/status")
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as BadgeStatus;
        setStatus(data);
      })
      .catch(() => undefined);
  }, []);

  if (!status) return null;

  if (status.enabled) {
    return (
      <span
        title={labels.enabled}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700"
        aria-label={labels.enabled}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      </span>
    );
  }

  if (status.required) {
    return (
      <span
        title={labels.required}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-700"
        aria-label={labels.required}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </span>
    );
  }

  return null;
}
