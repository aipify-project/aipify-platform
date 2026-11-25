"use client";

import { useState } from "react";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";

export type CspVerifyEmailResendLabels = {
  resendCta: string;
  resendAccepted: string;
  resendAlreadyVerified: string;
  resendRateLimited: string;
  resendFailed: string;
  loginCta: string;
};

type Outcome = "idle" | "accepted" | "already_verified" | "rate_limited" | "failed";

export function CspVerifyEmailResend({ labels }: { labels: CspVerifyEmailResendLabels }) {
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<Outcome>("idle");
  const [loginUrl, setLoginUrl] = useState<string | null>(null);

  async function resend() {
    setBusy(true);
    try {
      const res = await fetch("/api/certified-sales-partner/email/resend-verification", { method: "POST" });
      const json = (await res.json().catch(() => ({}))) as { status?: string; login_url?: string };
      if (res.status === 401 && typeof json.login_url === "string" && json.login_url.startsWith("/login")) {
        setLoginUrl(json.login_url);
        setOutcome("idle");
      } else if (json.status === "accepted" || json.status === "already_verified" || json.status === "rate_limited") {
        setOutcome(json.status);
      } else {
        setOutcome("failed");
      }
    } catch {
      setOutcome("failed");
    } finally {
      setBusy(false);
    }
  }

  const message =
    outcome === "accepted"
      ? labels.resendAccepted
      : outcome === "already_verified"
        ? labels.resendAlreadyVerified
        : outcome === "rate_limited"
          ? labels.resendRateLimited
          : outcome === "failed"
            ? labels.resendFailed
            : null;

  return (
    <div className="space-y-3">
      {loginUrl ? (
        <a href={loginUrl} className={AipifyMarketingClasses.primaryCta}>
          {labels.loginCta}
        </a>
      ) : (
        <button type="button" onClick={resend} disabled={busy} aria-busy={busy} className={AipifyMarketingClasses.primaryCta}>
          {labels.resendCta}
        </button>
      )}
      {message ? (
        <p role="status" className="text-sm text-aipify-text-secondary">
          {message}
        </p>
      ) : null}
    </div>
  );
}
