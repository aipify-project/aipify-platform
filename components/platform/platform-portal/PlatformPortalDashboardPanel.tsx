"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  buildPlatformPortalLabels,
  parsePlatformPortalDashboard,
  type PlatformPortalDashboard,
} from "@/lib/platform-portal";
import type { PlatformNavGroupConfig } from "@/lib/platform/build-nav";
import { AipifyLoader } from "@/components/ui/aipify-loader";

type PlatformPortalDashboardPanelProps = {
  labels: ReturnType<typeof buildPlatformPortalLabels>["dashboard"];
  navGroups: PlatformNavGroupConfig[];
};

type MetricVariant = "neutral" | "success" | "warning" | "danger";

const METRIC_VARIANT_STYLES: Record<
  MetricVariant,
  { card: string; label: string; value: string; marker: string }
> = {
  neutral: {
    card: "border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900/50",
    label: "text-slate-500 dark:text-slate-400",
    value: "text-slate-900 dark:text-slate-100",
    marker: "bg-slate-400 ring-slate-200 dark:bg-slate-500 dark:ring-slate-700",
  },
  success: {
    card: "border-emerald-200/90 bg-emerald-50/70 dark:border-emerald-800/70 dark:bg-emerald-950/35",
    label: "text-emerald-800/80 dark:text-emerald-300/90",
    value: "text-emerald-950 dark:text-emerald-50",
    marker: "bg-emerald-500 ring-emerald-200 dark:bg-emerald-400 dark:ring-emerald-900",
  },
  warning: {
    card: "border-amber-200/90 bg-amber-50/70 dark:border-amber-800/70 dark:bg-amber-950/35",
    label: "text-amber-800/80 dark:text-amber-300/90",
    value: "text-amber-950 dark:text-amber-50",
    marker: "bg-amber-500 ring-amber-200 dark:bg-amber-400 dark:ring-amber-900",
  },
  danger: {
    card: "border-rose-200/90 bg-rose-50/70 dark:border-rose-800/70 dark:bg-rose-950/35",
    label: "text-rose-800/80 dark:text-rose-300/90",
    value: "text-rose-950 dark:text-rose-50",
    marker: "bg-rose-500 ring-rose-200 dark:bg-rose-400 dark:ring-rose-900",
  },
};

/** Problem/waiting counts: zero is healthy; non-zero uses the elevated variant. */
function countVariant(
  count: number,
  elevated: "warning" | "danger" = "warning",
): "success" | "warning" | "danger" {
  return count === 0 ? "success" : elevated;
}

function MetricCard({
  label,
  value,
  variant = "neutral",
}: {
  label: string;
  value: string | number;
  variant?: MetricVariant;
}) {
  const styles = METRIC_VARIANT_STYLES[variant];

  return (
    <div
      className={`rounded-xl border px-4 py-3.5 shadow-sm ${styles.card}`}
      data-variant={variant}
    >
      <div className="flex items-start justify-between gap-3">
        <dt className={`text-xs font-medium uppercase tracking-wide ${styles.label}`}>{label}</dt>
        <span
          className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ring-2 ${styles.marker}`}
          aria-hidden="true"
          data-status={variant}
        />
      </div>
      <dd className={`mt-2 text-2xl font-semibold tabular-nums tracking-tight ${styles.value}`}>
        {value}
      </dd>
    </div>
  );
}

const ATTENTION_ICON_STYLES: Record<"success" | "warning" | "danger", string> = {
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  danger: "text-rose-600 dark:text-rose-400",
};

function AttentionStatusIcon({ variant }: { variant: "success" | "warning" | "danger" }) {
  const className = `h-4 w-4 shrink-0 ${ATTENTION_ICON_STYLES[variant]}`;

  if (variant === "success") {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm3.78 5.97-4.34 4.35a.75.75 0 0 1-1.06 0L4.22 8.16a.75.75 0 0 1 1.06-1.06l1.63 1.63 3.81-3.82a.75.75 0 1 1 1.06 1.06Z" />
      </svg>
    );
  }

  if (variant === "danger") {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0Zm-.75 4.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5Zm.75 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575L6.457 1.047ZM8 5a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 0 1.5 0v-3.5A.75.75 0 0 0 8 5Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
    </svg>
  );
}

function AttentionCard({
  label,
  value,
  elevated = "warning",
}: {
  label: string;
  value: number;
  elevated?: "warning" | "danger";
}) {
  const variant = countVariant(value, elevated);
  const styles = METRIC_VARIANT_STYLES[variant];

  return (
    <div
      className={`rounded-xl border px-3.5 py-3 shadow-sm ${styles.card}`}
      data-variant={variant}
      data-attention="true"
    >
      <div className="flex items-center gap-2">
        <AttentionStatusIcon variant={variant} />
        <dt className={`min-w-0 truncate text-xs font-medium uppercase tracking-wide ${styles.label}`}>
          {label}
        </dt>
      </div>
      <dd className={`mt-1.5 text-xl font-semibold tabular-nums tracking-tight ${styles.value}`}>
        {value}
      </dd>
    </div>
  );
}

const FINANCE_NAV_ROUTES = [
  {
    href: "/platform/billing/invoices",
    aliases: ["/platform/billing/enterprise-invoices"],
    icon: "invoices",
  },
  {
    href: "/platform/billing/payment-providers",
    aliases: ["/platform/payment-providers"],
    icon: "providers",
  },
  {
    href: "/platform/billing/accounting-integration",
    aliases: [] as string[],
    icon: "accounting",
  },
] as const;

function flattenNavLinks(navGroups: PlatformNavGroupConfig[]) {
  return navGroups.flatMap((group) => group.items);
}

/** Resolve a localized nav label from portal navGroups (exact, alias, then longest href prefix). */
function resolveNavLabel(
  navGroups: PlatformNavGroupConfig[],
  href: string,
  aliases: readonly string[] = [],
): string | null {
  const flat = flattenNavLinks(navGroups);
  const candidates = [href, ...aliases];
  const exact = flat.find((item) => candidates.includes(item.href));
  if (exact) return exact.label;

  const prefixes = flat
    .filter((item) => href === item.href || href.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length);
  return prefixes[0]?.label ?? null;
}

function FinanceMetricCard({
  label,
  value,
  variant,
}: {
  label: string;
  value: number;
  variant: "success" | "warning" | "danger";
}) {
  const styles = METRIC_VARIANT_STYLES[variant];

  return (
    <div className={`rounded-xl border px-3.5 py-3 shadow-sm ${styles.card}`} data-variant={variant}>
      <div className="flex items-center gap-2">
        <AttentionStatusIcon variant={variant} />
        <dt className={`min-w-0 truncate text-xs font-medium uppercase tracking-wide ${styles.label}`}>
          {label}
        </dt>
      </div>
      <dd className={`mt-1.5 text-xl font-semibold tabular-nums tracking-tight ${styles.value}`}>
        {value}
      </dd>
    </div>
  );
}

function FinanceNavIcon({ kind }: { kind: (typeof FINANCE_NAV_ROUTES)[number]["icon"] }) {
  const className = "h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400";

  if (kind === "invoices") {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M2 1.75A.75.75 0 0 1 2.75 1h8.5a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-1.14.643L9 13.563l-1.86 1.33a.75.75 0 0 1-.88 0L4.4 13.563l-1.86 1.33A.75.75 0 0 1 1.4 14.25V1.75c0-.192.168.1.2.75ZM4.75 4a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5ZM4 7.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 4 7.25ZM4.75 9a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5Z" />
      </svg>
    );
  }

  if (kind === "providers") {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M1.5 3.5A1.5 1.5 0 0 1 3 2h10a1.5 1.5 0 0 1 1.5 1.5v2A1.5 1.5 0 0 1 13 7H3A1.5 1.5 0 0 1 1.5 5.5v-2ZM3 3a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5v-2A.5.5 0 0 0 13 3H3Zm-.5 6A1.5 1.5 0 0 1 4 7.5h8A1.5 1.5 0 0 1 13.5 9v2a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 11V9ZM4 8.5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V9a.5.5 0 0 0-.5-.5H4Z" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8.75 1.75a.75.75 0 0 0-1.5 0V3H4.75A1.75 1.75 0 0 0 3 4.75v6.5c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 13 11.25v-6.5A1.75 1.75 0 0 0 11.25 3H8.75V1.75ZM4.75 4.5a.25.25 0 0 0-.25.25v6.5c0 .172.16.0.3.25h6.5a.25.25 0 0 0 .25-.25v-6.5a.25.25 0 0 0-.25-.25h-6.5ZM5.5 7a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5A.75.75 0 0 1 5.5 7Zm0 2.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Z" />
    </svg>
  );
}

function FinanceNavCard({
  href,
  label,
  actionLabel,
  icon,
}: {
  href: string;
  label: string;
  actionLabel: string;
  icon: (typeof FINANCE_NAV_ROUTES)[number]["icon"];
}) {
  const styles = METRIC_VARIANT_STYLES.neutral;

  return (
    <Link
      href={href}
      className={`block rounded-xl border px-3.5 py-3 shadow-sm transition hover:border-slate-300 hover:shadow-md dark:hover:border-slate-600 ${styles.card}`}
      data-variant="neutral"
      data-finance-nav={icon}
    >
      <div className="flex items-center gap-2">
        <FinanceNavIcon kind={icon} />
        <span className={`min-w-0 truncate text-xs font-medium uppercase tracking-wide ${styles.label}`}>
          {label}
        </span>
      </div>
      <span className={`mt-1.5 block text-sm font-semibold ${styles.value}`}>{actionLabel}</span>
    </Link>
  );
}

const PARTNER_NAV_ROUTES = [
  {
    href: "/platform/billing/growth-partner-attribution",
    icon: "attribution",
  },
  {
    href: "/platform/billing/commissions",
    icon: "commissions",
  },
] as const;

function resolveNavLink(navGroups: PlatformNavGroupConfig[], href: string) {
  return flattenNavLinks(navGroups).find((item) => item.href === href) ?? null;
}

function PartnerNavIcon({ kind }: { kind: (typeof PARTNER_NAV_ROUTES)[number]["icon"] }) {
  const className = "h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400";

  if (kind === "attribution") {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 1.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM6.5 4.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM3.25 13.5A4.75 4.75 0 0 1 8 8.75a4.75 4.75 0 0 1 4.75 4.75.75.75 0 0 1-1.5 0A3.25 3.25 0 0 0 8 10.25 3.25 3.25 0 0 0 4.75 13.5a.75.75 0 0 1-1.5 0Z" />
        <path d="M12.78 2.22a.75.75 0 0 1 0 1.06l-1.5 1.5a.75.75 0 1 1-1.06-1.06l1.5-1.5a.75.75 0 0 1 1.06 0ZM14.25 5.5a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h2Z" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M2.5 3.75A1.75 1.75 0 0 1 4.25 2h7.5A1.75 1.75 0 0 1 13.5 3.75v8.5A1.75 1.75 0 0 1 11.75 14h-7.5A1.75 1.75 0 0 1 2.5 12.25v-8.5ZM4.25 3.5a.25.25 0 0 0-.25.25v8.5c0 .172.16.0.3.25h7.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25h-7.5ZM5 6.25A.75.75 0 0 1 5.75 5.5h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 5 6.25Zm0 2.5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5A.75.75 0 0 1 5 8.75Z" />
    </svg>
  );
}

function PartnerNavCard({
  href,
  label,
  actionLabel,
  icon,
}: {
  href: string;
  label: string;
  actionLabel: string;
  icon: (typeof PARTNER_NAV_ROUTES)[number]["icon"];
}) {
  const styles = METRIC_VARIANT_STYLES.neutral;

  return (
    <Link
      href={href}
      className={`block rounded-xl border px-4 py-3.5 shadow-sm transition hover:border-slate-300 hover:shadow-md dark:hover:border-slate-600 ${styles.card}`}
      data-variant="neutral"
      data-partner-nav={icon}
    >
      <div className="flex items-center gap-2">
        <PartnerNavIcon kind={icon} />
        <span className={`min-w-0 truncate text-xs font-medium uppercase tracking-wide ${styles.label}`}>
          {label}
        </span>
      </div>
      <span className={`mt-2 block text-sm font-semibold ${styles.value}`}>{actionLabel}</span>
    </Link>
  );
}

const QUICK_ACTION_ROUTES = [
  { href: "/platform/customers", icon: "customers" },
  { href: "/platform/subscriptions", icon: "subscriptions" },
  { href: "/platform/installations", icon: "installations" },
  { href: "/platform/support", icon: "support" },
] as const;

function QuickActionNavIcon({ kind }: { kind: (typeof QUICK_ACTION_ROUTES)[number]["icon"] }) {
  const className = "h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400";

  if (kind === "customers") {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M5.5 3.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0ZM8 0a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM2.25 14.5A4.75 4.75 0 0 1 7 9.75h2a4.75 4.75 0 0 1 4.75 4.75.75.75 0 0 1-1.5 0A3.25 3.25 0 0 0 9 11.25H7A3.25 3.25 0 0 0 3.75 14.5a.75.75 0 0 1-1.5 0Z" />
      </svg>
    );
  }

  if (kind === "subscriptions") {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M2 3.75A1.75 1.75 0 0 1 3.75 2h8.5A1.75 1.75 0 0 1 14 3.75v8.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5ZM3.75 3.5a.25.25 0 0 0-.25.25v8.5c0 .172.16.0.3.25h8.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25h-8.5ZM5 6.25A.75.75 0 0 1 5.75 5.5h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 5 6.25Zm0 2.5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5A.75.75 0 0 1 5 8.75Z" />
      </svg>
    );
  }

  if (kind === "installations") {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8.75 1.75a.75.75 0 0 0-1.5 0V6H4.56a.75.75 0 0 0-.53 1.28l3.44 3.44a.75.75 0 0 0 1.06 0l3.44-3.44A.75.75 0 0 0 11.44 6H8.75V1.75ZM3.5 12.25a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5h-9Z" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M2.5 4.5A2.5 2.5 0 0 1 5 2h6a2.5 2.5 0 0 1 2.5 2.5v1.1c0 .192.168.0.4.668l.9.45A1.75 1.75 0 0 1 16 8.28v.44a1.75 1.75 0 0 1-.95 1.562l-.9.45a.75.75 0 0 0-.4.668V13.5A2.5 2.5 0 0 1 11 16H5a2.5 2.5 0 0 1-2.5-2.5v-1.1a.75.75 0 0 0-.4-.668l-.9-.45A1.75 1.75 0 0 1 0 8.72v-.44c0-.66.372-1.263.95-1.562l.9-.45a.75.75 0 0 0 .4-.668V4.5ZM5 3.5a1 1 0 0 0-1 1v1.1c0 .66-.372 1.263-.95 1.562l-.9.45a.25.25 0 0 0-.15.225v.44c0 .10.0.1.2.226l.9.45c.578.299.95.902.95 1.562v1.1a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-1.1c0-.66.372-1.263.95-1.562l.9-.45a.25.25 0 0 0 .15-.226v-.44a.25.25 0 0 0-.15-.225l-.9-.45A1.75 1.75 0 0 1 12 5.6V4.5a1 1 0 0 0-1-1H5Z" />
    </svg>
  );
}

function QuickActionNavCard({
  href,
  label,
  actionLabel,
  icon,
}: {
  href: string;
  label: string;
  actionLabel: string;
  icon: (typeof QUICK_ACTION_ROUTES)[number]["icon"];
}) {
  const styles = METRIC_VARIANT_STYLES.neutral;

  return (
    <Link
      href={href}
      className={`block rounded-xl border px-4 py-3.5 shadow-sm transition hover:border-slate-300 hover:shadow-md dark:hover:border-slate-600 ${styles.card}`}
      data-variant="neutral"
      data-quick-action={icon}
    >
      <div className="flex items-center gap-2">
        <QuickActionNavIcon kind={icon} />
        <span className={`min-w-0 truncate text-xs font-medium uppercase tracking-wide ${styles.label}`}>
          {label}
        </span>
      </div>
      <span className={`mt-2 block text-sm font-semibold ${styles.value}`}>{actionLabel}</span>
    </Link>
  );
}

export function PlatformPortalDashboardPanel({
  labels,
  navGroups,
}: PlatformPortalDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<PlatformPortalDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/platform-portal/dashboard");
    if (res.ok) setDashboard(parsePlatformPortalDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !dashboard) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-[1680px] items-center justify-center p-6">
        <AipifyLoader centered label={labels.loading} />
      </div>
    );
  }

  if (!dashboard) {
    return <p className="p-6 text-sm text-red-600">{labels.loading}</p>;
  }

  const financeNavCards = FINANCE_NAV_ROUTES.flatMap((route) => {
    const label = resolveNavLabel(navGroups, route.href, route.aliases);
    if (!label) return [];
    return [{ ...route, label }];
  });

  const partnerNavCards = PARTNER_NAV_ROUTES.flatMap((route) => {
    const item = resolveNavLink(navGroups, route.href);
    if (!item) return [];
    return [{ ...route, label: item.label }];
  });

  const quickActionNavCards = QUICK_ACTION_ROUTES.flatMap((route) => {
    const item = resolveNavLink(navGroups, route.href);
    if (!item) return [];
    return [{ ...route, label: item.label }];
  });
  const activityUpdates = dashboard.product_deployment_updates.slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-[1680px] space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-slate-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm text-slate-800">
          {dashboard.principle}
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <AttentionCard
            label={labels.organizationsRequiringAttention}
            value={dashboard.organizations_requiring_attention}
          />
          <AttentionCard
            label={labels.openSupportWorkload}
            value={dashboard.open_support_workload}
          />
          <AttentionCard
            label={labels.paymentPastDue}
            value={dashboard.payment_status_summary.past_due}
            elevated="danger"
          />
          <AttentionCard
            label={labels.pendingReview}
            value={dashboard.marketplace_moderation.pending_review}
          />
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {labels.paymentStatusSummary}
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <dl className="contents">
            <FinanceMetricCard
              label={labels.paymentActive}
              value={dashboard.payment_status_summary.active}
              variant="success"
            />
            <FinanceMetricCard
              label={labels.paymentTrialing}
              value={dashboard.payment_status_summary.trialing}
              variant={countVariant(dashboard.payment_status_summary.trialing)}
            />
            <FinanceMetricCard
              label={labels.paymentPastDue}
              value={dashboard.payment_status_summary.past_due}
              variant={countVariant(dashboard.payment_status_summary.past_due, "danger")}
            />
          </dl>
          {financeNavCards.map((card) => (
            <FinanceNavCard
              key={card.href}
              href={card.href}
              label={card.label}
              actionLabel={labels.openModule}
              icon={card.icon}
            />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            label={labels.activeSubscriptions}
            value={dashboard.active_subscriptions}
            variant="success"
          />
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">{labels.customerSuccessIndicators}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <MetricCard
            label={labels.healthyRatio}
            value={`${dashboard.customer_success_indicators.healthy_ratio_pct}%`}
            variant="success"
          />
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">
          {labels.marketplaceModeration}
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            label={labels.published}
            value={dashboard.marketplace_moderation.published}
            variant="success"
          />
        </dl>
      </section>

      {partnerNavCards.length > 0 ? (
        <section
          className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/40"
          data-area="partners"
        >
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {labels.partnerProgramSummary}
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {partnerNavCards.map((card) => (
              <PartnerNavCard
                key={card.href}
                href={card.href}
                label={card.label}
                actionLabel={labels.openModule}
                icon={card.icon}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950/40"
        data-area="activity"
      >
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {labels.productDeploymentUpdates}
        </h2>
        {activityUpdates.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{labels.noUpdates}</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
            {activityUpdates.map((update) => (
              <li
                key={update.id}
                className="flex items-start justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                    {update.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {update.version ? `v${update.version}` : null}
                    {update.version && update.classification ? " · " : null}
                    {update.classification || null}
                  </p>
                </div>
                {update.scheduled_at ? (
                  <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                    {new Date(update.scheduled_at).toLocaleDateString()}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      {quickActionNavCards.length === QUICK_ACTION_ROUTES.length ? (
        <section
          className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/40"
          data-area="quick-actions"
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {quickActionNavCards.map((card) => (
              <QuickActionNavCard
                key={card.href}
                href={card.href}
                label={card.label}
                actionLabel={labels.openModule}
                icon={card.icon}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">{labels.portalModules}</h2>
        {navGroups.map((group) => (
          <div key={group.id}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {group.label}
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                >
                  <h4 className="font-medium text-slate-900">{item.label}</h4>
                  <span className="mt-4 inline-block text-sm font-medium text-indigo-600">
                    {labels.openModule} →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <p className="text-xs text-slate-500">{dashboard.privacy_note || labels.privacyNote}</p>
    </div>
  );
}
