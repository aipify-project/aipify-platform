"use client";

import Link from "next/link";
import { Copy, Eye, EyeOff } from "lucide-react";
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
import { resolveAppHref } from "@/lib/app/route-aliases";
import { createClient } from "@/lib/supabase/client";

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
  const billingHref = resolveAppHref("/app/billing");

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

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
        <p className="mt-2 text-sm text-gray-500">
          {String(data?.company_name ?? "")} · {formatSoftwareVersion(String(data?.software_version))}
        </p>
      </div>

      {licenseStatus === "paused" && data?.paused_message ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {String(data.paused_message)}
          <div className="mt-2">
            <Link href={billingHref} className="font-medium text-amber-900 underline">
              {labels.billingCta}
            </Link>
          </div>
        </div>
      ) : null}

      {licenseStatus === "grace_period" ? (
        <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
          {labels.graceBanner}
        </div>
      ) : null}

      {data?.pricing_philosophy_note ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
          {String(data.pricing_philosophy_note)}
        </div>
      ) : null}

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-gray-900">
          {labels.sections.subscription_status.title}
        </h2>
        <dl className="mt-3 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
          <div>
            <dt className="font-medium text-gray-700">{labels.subscription.currentPlan}</dt>
            <dd>{String(subscription.plan_name ?? "—")}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">{labels.subscription.renewalDate}</dt>
            <dd>
              {subscription.renewal_date
                ? formatDate(String(subscription.renewal_date), locale)
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">{labels.subscription.licenseStatus}</dt>
            <dd className="capitalize">{licenseStatus.replace(/_/g, " ")}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">{labels.subscription.paymentStatus}</dt>
            <dd>{String(subscription.payment_status ?? "—")}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">{labels.subscription.installations}</dt>
            <dd>{String(subscription.installation_count ?? 0)}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">{labels.subscription.domains}</dt>
            <dd>{String(subscription.domain_count ?? 0)}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">{labels.subscription.users}</dt>
            <dd>{String(subscription.user_count ?? 0)}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-gray-900">{labels.licenseCode.title}</h2>
        <p className="mt-2 text-sm text-gray-600">{labels.licenseCode.description}</p>

        {hasLicenseCode && displayCode ? (
          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap items-start gap-2">
              <code className="min-w-0 flex-1 break-all rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 font-mono text-sm text-gray-900">
                {displayCode}
              </code>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => void handleToggleReveal()}
                  disabled={revealLoading}
                  aria-label={isRevealed ? labels.licenseCode.hide : labels.licenseCode.reveal}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  {isRevealed ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                </button>
                <button
                  type="button"
                  onClick={() => void handleCopy()}
                  aria-label={labels.licenseCode.copy}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  <Copy className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            {data?.app_subscription_license_status ? (
              <p className="text-xs text-gray-500">
                {labels.licenseCode.status}:{" "}
                <span className="capitalize">
                  {String(data.app_subscription_license_status).replace(/_/g, " ")}
                </span>
              </p>
            ) : null}
            {copyState === "copied" ? (
              <p className="text-xs font-medium text-emerald-700">{labels.licenseCode.copied}</p>
            ) : null}
          </div>
        ) : (
          <p className="mt-3 text-sm text-gray-500">{labels.licenseCode.unavailable}</p>
        )}

        {revealError ? <p className="mt-3 text-sm text-red-600">{revealError}</p> : null}
      </section>

      {Object.entries(labels.sections)
        .filter(([key]) => key !== "subscription_status")
        .map(([key, section]) => (
          <section
            key={key}
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            <h2 className="text-sm font-semibold text-gray-900">{section.title}</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
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

      <p className="text-center text-sm text-gray-500">
        <Link href={resolveAppHref("/app")} className="text-indigo-600 hover:text-indigo-800">
          {labels.backToApp}
        </Link>
      </p>
    </div>
  );
}
