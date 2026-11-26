import {
  Ban,
  Building2,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Hourglass,
  LockKeyhole,
  PauseCircle,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ACCOUNT_PROFILE_ROUTE } from "@/lib/app/account-profile";
import type { AccountProfileLabels } from "@/lib/app/account-profile/labels";
import { ACCOUNT_PROFILE_TABS, type AccountProfileTab } from "@/lib/app/account-profile/tabs";
import type {
  AccountProfileField,
  AccountProfileLicense,
  AccountProfileView,
} from "@/lib/app/account-profile/types";
import { formatPlatformDateTimeShort } from "@/lib/platform-presentation-quality/date-time";
import { AccountPersonalEditor } from "./AccountPersonalEditor";

function fieldText(field: AccountProfileField, labels: AccountProfileLabels): string {
  if (field.value) return field.value;
  if (field.source === "unavailable") return labels.unavailable;
  return labels.notRegistered;
}

function LockedField({
  label,
  value,
  reason,
}: {
  label: string;
  value: string;
  reason: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-[var(--app-text-muted)]">{label}</p>
        <span className="inline-flex items-center text-[var(--app-text-muted)]" title={reason}>
          <LockKeyhole aria-hidden className="h-3.5 w-3.5" />
          <span className="sr-only">{reason}</span>
        </span>
      </div>
      <p className="mt-1 break-words text-sm font-medium text-[var(--app-text)]">{value}</p>
    </div>
  );
}

function StatusPill({
  label,
  icon,
  tone,
}: {
  label: string;
  icon: ReactNode;
  tone: "ready" | "attention" | "neutral";
}) {
  const toneClass =
    tone === "ready"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : tone === "attention"
        ? "border-amber-200 bg-amber-50 text-amber-900"
        : "border-[var(--app-border)] bg-[var(--app-canvas)] text-[var(--app-text)]";
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${toneClass}`}>
      {icon}
      {label}
    </span>
  );
}

function licenseStatus(license: AccountProfileLicense | null, labels: AccountProfileLabels) {
  if (license === "active") {
    return { label: labels.licenses.active, tone: "ready" as const, icon: <CheckCircle2 aria-hidden className="h-3.5 w-3.5" /> };
  }
  if (license === "paused") {
    return { label: labels.licenses.paused, tone: "attention" as const, icon: <PauseCircle aria-hidden className="h-3.5 w-3.5" /> };
  }
  if (license === "grace") {
    return { label: labels.licenses.grace, tone: "attention" as const, icon: <Clock3 aria-hidden className="h-3.5 w-3.5" /> };
  }
  if (license === "trialing") {
    return { label: labels.licenses.trialing, tone: "neutral" as const, icon: <Hourglass aria-hidden className="h-3.5 w-3.5" /> };
  }
  if (license === "cancelled") {
    return { label: labels.licenses.cancelled, tone: "attention" as const, icon: <Ban aria-hidden className="h-3.5 w-3.5" /> };
  }
  return { label: labels.statusUnknown, tone: "neutral" as const, icon: <CircleAlert aria-hidden className="h-3.5 w-3.5" /> };
}

const TAB_LABEL: Record<AccountProfileTab, keyof AccountProfileLabels> = {
  personal: "tabPersonal",
  company: "tabCompany",
  relationship: "tabRelationship",
  security: "tabSecurity",
};

export function AppCustomerProfilePanel({
  view,
  labels,
  locale,
  activeTab,
}: {
  view: AccountProfileView;
  labels: AccountProfileLabels;
  locale: string;
  activeTab: AccountProfileTab;
}) {
  const name = fieldText(view.fullName, labels);
  const roleLabel = view.role ? labels.roles[view.role] : labels.notRegistered;
  const license = licenseStatus(view.relationship.license, labels);
  const registeredAt = formatPlatformDateTimeShort(view.relationship.registeredAt.value, {
    locale,
    emptyFallback: labels.notRegistered,
    invalidFallback: labels.unavailable,
  });
  const updatedAt = formatPlatformDateTimeShort(view.relationship.updatedAt.value, {
    locale,
    emptyFallback: labels.notRegistered,
    invalidFallback: labels.unavailable,
  });
  const reference = view.relationship.referenceHidden
    ? labels.referenceHidden
    : fieldText(view.relationship.customerReference, labels);
  const companyFields = [
    view.companyName.value ? { label: labels.companyName, value: view.companyName.value } : null,
    view.companyWebsite.value ? { label: labels.companyWebsite, value: view.companyWebsite.value } : null,
    view.companyPhone.value ? { label: labels.companyPhone, value: view.companyPhone.value } : null,
    view.companyAddress.value ? { label: labels.companyAddress, value: view.companyAddress.value } : null,
  ].filter((field): field is { label: string; value: string } => field !== null);

  const relationshipLinks = [
    { href: view.links.subscription, label: labels.openSubscription },
    { href: view.links.license, label: labels.openLicense },
    { href: view.links.invoices, label: labels.openInvoices },
  ];
  const securityLinks = [
    { href: view.links.security, label: labels.openSecurity },
    { href: view.links.privacy, label: labels.openPrivacy },
    { href: view.links.notifications, label: labels.openNotifications },
  ];

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] p-5 shadow-[var(--app-shadow-card)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
          {view.avatarUrl ? (
            // Auth metadata avatar may be any https host — avoid next/image remote allowlist coupling.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={view.avatarUrl}
              alt=""
              width={72}
              height={72}
              className="h-[72px] w-[72px] shrink-0 rounded-2xl object-cover"
            />
          ) : (
            <div
              className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl bg-[var(--app-primary-soft)] text-xl font-semibold text-[var(--app-primary)]"
              aria-hidden
            >
              {view.initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-xl font-semibold text-[var(--app-text)]">{name}</p>
            <p className="mt-1 text-sm text-[var(--app-text-muted)]">{roleLabel}</p>
            {!view.avatarUrl ? (
              <p className="mt-2 text-xs text-[var(--app-text-muted)]">{labels.avatarFallback}</p>
            ) : null}
          </div>
        </div>
        <StatusPill label={license.label} icon={license.icon} tone={license.tone} />
      </section>

      <div className="-mx-1 overflow-x-auto px-1" role="tablist" aria-label={labels.tabsAria}>
        <div className="flex min-w-max gap-2 border-b border-[var(--app-border)]">
          {ACCOUNT_PROFILE_TABS.map((tab) => {
            const selected = tab === activeTab;
            const label = labels[TAB_LABEL[tab]];
            return (
              <Link
                key={tab}
                id={`account-tab-${tab}`}
                href={`${ACCOUNT_PROFILE_ROUTE}?tab=${tab}`}
                role="tab"
                aria-selected={selected}
                aria-controls={`account-panel-${tab}`}
                className={`inline-flex min-h-11 items-center rounded-t-xl px-4 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)] ${
                  selected
                    ? "border-b-2 border-[var(--app-primary)] font-semibold text-[var(--app-primary)]"
                    : "text-[var(--app-text-muted)] hover:text-[var(--app-text)]"
                }`}
              >
                {typeof label === "string" ? label : tab}
              </Link>
            );
          })}
        </div>
      </div>

      <div role="tabpanel" id={`account-panel-${activeTab}`} aria-labelledby={`account-tab-${activeTab}`} className="space-y-4">
        {activeTab === "personal" ? <AccountPersonalEditor view={view} labels={labels} /> : null}

        {activeTab === "company" ? (
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--app-text)]">
              <Building2 aria-hidden className="h-4 w-4 text-[var(--app-primary)]" />
              {labels.companyTitle}
            </h2>
            {companyFields.length > 0 ? (
              <>
                <p className="max-w-3xl text-sm leading-relaxed text-[var(--app-text-muted)]">{labels.companyOptionalNote}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {companyFields.map((field) => (
                    <LockedField key={field.label} label={field.label} value={field.value} reason={labels.readOnlyReason} />
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] p-5">
                <p className="text-sm font-semibold text-[var(--app-text)]">{labels.companyEmpty}</p>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--app-text-muted)]">{labels.companyEmptyBody}</p>
                {view.links.companySettings ? (
                  <Link
                    href={view.links.companySettings}
                    className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-[var(--app-primary)] px-4 text-sm font-semibold text-white"
                  >
                    {labels.addCompanyDetails}
                  </Link>
                ) : null}
              </div>
            )}
            {view.hasCompanyDetails && view.links.companySettings ? (
              <Link
                href={view.links.companySettings}
                className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--app-primary)] underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
              >
                {labels.openCompanySettings}
              </Link>
            ) : null}
          </section>
        ) : null}

        {activeTab === "relationship" ? (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-[var(--app-text)]">{labels.relationshipTitle}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <LockedField
                label={labels.workspace}
                value={fieldText(view.relationship.workspaceName, labels)}
                reason={labels.readOnlyReason}
              />
              <LockedField
                label={labels.plan}
                value={fieldText(view.relationship.planName, labels)}
                reason={labels.readOnlyReason}
              />
              <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] px-4 py-3">
                <p className="text-xs font-medium text-[var(--app-text-muted)]">{labels.license}</p>
                <div className="mt-2">
                  <StatusPill label={license.label} icon={license.icon} tone={license.tone} />
                </div>
              </div>
              <LockedField label={labels.customerReference} value={reference} reason={labels.readOnlyReason} />
              <LockedField label={labels.registeredAt} value={registeredAt} reason={labels.readOnlyReason} />
              <LockedField label={labels.updatedAt} value={updatedAt} reason={labels.readOnlyReason} />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {relationshipLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex min-h-11 items-center rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] px-4 text-sm font-medium text-[var(--app-primary)] transition hover:-translate-y-0.5 hover:border-[var(--app-primary)] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === "security" ? (
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--app-text)]">
              <ShieldCheck aria-hidden className="h-4 w-4 text-[var(--app-primary)]" />
              {labels.securityTitle}
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {securityLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex min-h-11 items-center rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] px-4 text-sm font-medium text-[var(--app-primary)] transition hover:-translate-y-0.5 hover:border-[var(--app-primary)] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
