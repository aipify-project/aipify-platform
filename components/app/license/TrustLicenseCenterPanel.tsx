"use client";

import Link from "next/link";
import { CheckCircle2, Copy, Eye, EyeOff } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { formatDate } from "@/lib/i18n/format-date";
import { formatSoftwareVersion } from "@/lib/license";
import {
  AIPIFY_OFFICIAL_WEBSITE,
  AIPIFY_PRIVACY_EMAIL,
  AIPIFY_SOFTWARE_OWNER,
  AIPIFY_SUPPORT_EMAIL,
} from "@/lib/license/engine";
import {
  parseCustomerLicenseCenter,
  parseRevealCustomerAppLicenseCode,
} from "@/lib/license/types";
import {
  presentAgreementName,
  presentLicensePaymentStatus,
  presentLicenseStatusLabelKey,
} from "@/lib/license/license-center-presentation";
import { resolveAppHref } from "@/lib/app/route-aliases";
import { createClient } from "@/lib/supabase/client";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";

type TrustLicenseCenterPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    backToApp: string;
    sections: Record<string, { title: string; body: string[] }>;
    subscription: {
      currentPlan: string;
      renewalDate: string;
      licenseStatus: string;
      installations: string;
      domains: string;
      users: string;
      paymentStatus: string;
      agreementName: string;
      productPlanHint: string;
      lifetimeAgreement: string;
      paymentActive: string;
      paymentPendingSetup: string;
      paymentPaused: string;
      paymentUnknown: string;
      licenseActive: string;
      licenseLifetime: string;
      licensePaused: string;
      licenseGrace: string;
      licenseUnknown: string;
      usersUnknown: string;
    };
    licenseCode: {
      title: string;
      description: string;
      reveal: string;
      hide: string;
      copy: string;
      copied: string;
      unavailable: string;
      revealError: string;
      status: string;
    };
    pausedBanner: string;
    graceBanner: string;
    billingCta: string;
  };
};

export default function TrustLicenseCenterPanel({
  locale,
  labels,
}: TrustLicenseCenterPanelProps) {
  const [data, setData] = useState<ReturnType<typeof parseCustomerLicenseCenter> | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealedCode, setRevealedCode] = useState<string | null>(null);
  const [revealLoading, setRevealLoading] = useState(false);
  const [revealError, setRevealError] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const billingHref = resolveAppHref("/app/account/subscription");
  const backHref = resolveAppHref("/app/command-center");

  const loadCenter = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: center, error } = await supabase.rpc("get_customer_license_center");
    if (error) {
      setLoadError(error.message);
      setData(null);
    } else if (center) {
      setLoadError(null);
      setData(parseCustomerLicenseCenter(center));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadCenter();
  }, [loadCenter]);

  useEffect(() => {
    if (copyState !== "copied") return;
    const timer = window.setTimeout(() => setCopyState("idle"), 2000);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  const maskedCode =
    typeof data?.license_code === "string" && data.license_code.length > 0
      ? data.license_code
      : null;
  const hasLicenseCode = Boolean(data?.has_license_code && maskedCode);
  const displayCode = isRevealed && revealedCode ? revealedCode : maskedCode;

  async function handleToggleReveal() {
    if (isRevealed) {
      setIsRevealed(false);
      setRevealedCode(null);
      setRevealError(null);
      return;
    }

    setRevealLoading(true);
    setRevealError(null);

    const supabase = createClient();
    const { data: revealData, error } = await supabase.rpc("reveal_customer_app_license_code");

    setRevealLoading(false);

    if (error) {
      setRevealError(labels.licenseCode.revealError);
      return;
    }

    const parsed = parseRevealCustomerAppLicenseCode(revealData);
    if (!parsed.ok || !parsed.license_code) {
      setRevealError(labels.licenseCode.revealError);
      return;
    }

    setRevealedCode(parsed.license_code);
    setIsRevealed(true);
  }

  async function handleCopy() {
    if (!displayCode) return;
    try {
      await navigator.clipboard.writeText(displayCode);
      setCopyState("copied");
    } catch {
      setRevealError(labels.licenseCode.revealError);
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  if (loadError) {
    return <p className="text-sm text-red-600">{loadError}</p>;
  }

  const subscription = (data?.subscription as Record<string, unknown>) ?? {};
  const legal = (data?.legal as Record<string, unknown>) ?? {};
  const licenseStatus = String(data?.license_status ?? "active");
  const planName = presentAgreementName(
    typeof subscription.plan_name === "string" ? subscription.plan_name : null,
  );
  const renewalRaw =
    typeof subscription.renewal_date === "string" ? subscription.renewal_date : null;
  const paymentRaw =
    typeof subscription.payment_status === "string" ? subscription.payment_status : null;
  const paymentDisplay = presentLicensePaymentStatus({
    paymentStatus: paymentRaw,
    licenseStatus,
    planName,
    renewalDate: renewalRaw,
  });
  const paymentLabel =
    paymentDisplay.kind === "lifetime"
      ? labels.subscription.lifetimeAgreement
      : labels.subscription[paymentDisplay.labelKey];
  const licenseStatusLabel =
    labels.subscription[presentLicenseStatusLabelKey(licenseStatus)];
  const isActiveLicense = licenseStatus === "active" || licenseStatus === "lifetime";
  const userCountRaw = subscription.user_count;
  const usersDisplay =
    typeof userCountRaw === "number" && Number.isFinite(userCountRaw) && userCountRaw > 0
      ? String(userCountRaw)
      : labels.subscription.usersUnknown;

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className={AppPremiumShell.pageTitle}>{labels.title}</h1>
        <p className={`mt-2 ${AppPremiumShell.pageDescription}`}>{labels.subtitle}</p>
        <p className="mt-2 text-sm text-[var(--app-text-muted)]">
          {String(data?.company_name ?? "")} · {formatSoftwareVersion(String(data?.software_version))}
        </p>
      </div>

      {licenseStatus === "paused" && data?.paused_message ? (
        <div className="rounded-[var(--app-radius-lg)] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {String(data.paused_message)}
          <div className="mt-2">
            <Link href={billingHref} className="font-medium text-amber-900 underline">
              {labels.billingCta}
            </Link>
          </div>
        </div>
      ) : null}

      {licenseStatus === "grace_period" ? (
        <div className="rounded-[var(--app-radius-lg)] border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
          {labels.graceBanner}
        </div>
      ) : null}

      <section className="rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] p-5 shadow-[var(--app-shadow-card)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-sm font-semibold text-[var(--app-text)]">
            {labels.sections.subscription_status.title}
          </h2>
          {isActiveLicense ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F7F0] px-2.5 py-1 text-xs font-semibold text-[var(--app-positive)] ring-1 ring-[#B7E4CF]">
              <CheckCircle2 aria-hidden className="size-3.5" strokeWidth={2.25} />
              {licenseStatusLabel}
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-xs text-[var(--app-text-muted)]">{labels.subscription.productPlanHint}</p>
        <dl className="mt-4 grid gap-3 text-sm text-[var(--app-text-muted)] sm:grid-cols-2">
          <div>
            <dt className="font-medium text-[var(--app-text)]">{labels.subscription.agreementName}</dt>
            <dd className="mt-0.5">{planName ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--app-text)]">{labels.subscription.renewalDate}</dt>
            <dd className="mt-0.5">
              {paymentDisplay.kind === "lifetime"
                ? labels.subscription.lifetimeAgreement
                : renewalRaw
                  ? formatDate(renewalRaw, locale)
                  : "—"}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--app-text)]">{labels.subscription.licenseStatus}</dt>
            <dd className="mt-0.5">{licenseStatusLabel}</dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--app-text)]">{labels.subscription.paymentStatus}</dt>
            <dd className="mt-0.5">{paymentLabel}</dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--app-text)]">{labels.subscription.installations}</dt>
            <dd className="mt-0.5">{String(subscription.installation_count ?? "—")}</dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--app-text)]">{labels.subscription.domains}</dt>
            <dd className="mt-0.5">{String(subscription.domain_count ?? "—")}</dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--app-text)]">{labels.subscription.users}</dt>
            <dd className="mt-0.5">{usersDisplay}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] p-5 shadow-[var(--app-shadow-card)]">
        <h2 className="text-sm font-semibold text-[var(--app-text)]">{labels.licenseCode.title}</h2>
        <p className="mt-2 text-sm text-[var(--app-text-muted)]">{labels.licenseCode.description}</p>

        {hasLicenseCode && displayCode ? (
          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap items-start gap-2">
              <code className="min-w-0 flex-1 break-all rounded-lg border border-[var(--app-border)] bg-[var(--app-soft-surface)] px-3 py-2 font-mono text-sm text-[var(--app-text)]">
                {displayCode}
              </code>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => void handleToggleReveal()}
                  disabled={revealLoading}
                  aria-label={isRevealed ? labels.licenseCode.hide : labels.licenseCode.reveal}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--app-border)] text-[var(--app-text)] hover:bg-[var(--app-soft-surface)] disabled:opacity-50 ${AppPremiumShell.focusRing}`}
                >
                  {isRevealed ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                </button>
                <button
                  type="button"
                  onClick={() => void handleCopy()}
                  aria-label={labels.licenseCode.copy}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--app-border)] text-[var(--app-text)] hover:bg-[var(--app-soft-surface)] ${AppPremiumShell.focusRing}`}
                >
                  <Copy className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            {data?.app_subscription_license_status ? (
              <p className="text-xs text-[var(--app-text-muted)]">
                {labels.licenseCode.status}:{" "}
                <span className="capitalize">
                  {String(data.app_subscription_license_status).replace(/_/g, " ")}
                </span>
              </p>
            ) : null}
            {copyState === "copied" ? (
              <p className="text-xs font-medium text-[var(--app-positive)]">{labels.licenseCode.copied}</p>
            ) : null}
          </div>
        ) : (
          <p className="mt-3 text-sm text-[var(--app-text-muted)]">{labels.licenseCode.unavailable}</p>
        )}

        {revealError ? <p className="mt-3 text-sm text-rose-600">{revealError}</p> : null}
      </section>

      <details className="rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-soft-surface)] p-5">
        <summary className="cursor-pointer text-sm font-semibold text-[var(--app-text)]">
          {labels.sections.software_ownership?.title ?? "License details"}
        </summary>
        <div className="mt-4 space-y-5">
          {Object.entries(labels.sections)
            .filter(([key]) => key !== "subscription_status")
            .map(([key, section]) => (
              <section key={key}>
                <h3 className="text-sm font-medium text-[var(--app-text)]">{section.title}</h3>
                <ul className="mt-2 space-y-2 text-sm leading-relaxed text-[var(--app-text-muted)]">
                  {section.body.map((line) => (
                    <li key={line}>
                      {line
                        .replace("{website}", String(legal.website ?? AIPIFY_OFFICIAL_WEBSITE))
                        .replace("{support}", String(legal.support_email ?? AIPIFY_SUPPORT_EMAIL))
                        .replace("{privacy}", String(legal.privacy_email ?? AIPIFY_PRIVACY_EMAIL))
                        .replace("{owner}", String(data?.software_owner ?? AIPIFY_SOFTWARE_OWNER))}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
        </div>
      </details>

      <p className="text-center text-sm text-[var(--app-text-muted)]">
        <Link href={backHref} className="text-[var(--app-primary)] hover:underline">
          {labels.backToApp}
        </Link>
      </p>
    </div>
  );
}
