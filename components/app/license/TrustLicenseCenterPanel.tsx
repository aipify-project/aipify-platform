"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/i18n/format-date";
import { formatSoftwareVersion } from "@/lib/license";
import {
  AIPIFY_OFFICIAL_WEBSITE,
  AIPIFY_PRIVACY_EMAIL,
  AIPIFY_SOFTWARE_OWNER,
  AIPIFY_SUPPORT_EMAIL,
} from "@/lib/license/engine";
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
    pausedBanner: string;
    graceBanner: string;
    billingCta: string;
  };
};

export default function TrustLicenseCenterPanel({
  locale,
  labels,
}: TrustLicenseCenterPanelProps) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const billingHref = resolveAppHref("/app/billing");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: center, error } = await supabase.rpc("get_customer_license_center");
      if (!error && center) {
        setData(center as Record<string, unknown>);
      }
      setLoading(false);
    }
    void load();
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
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
