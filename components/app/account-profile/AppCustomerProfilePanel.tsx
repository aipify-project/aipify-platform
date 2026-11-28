import {
  Ban,
  Bell,
  Building2,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Hourglass,
  PauseCircle,
  ShieldCheck,
  ShieldEllipsis,
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
import {
  ACCOUNT_PROFILE_FIELD_GRID_CLASS,
  ACCOUNT_PROFILE_HINT_CLASS,
  ACCOUNT_PROFILE_LINK_BUTTON_CLASS,
  ACCOUNT_PROFILE_READONLY_VALUE_CLASS,
} from "@/lib/app/account-profile/form-styles";
import { formatPlatformDateTimeShort } from "@/lib/platform-presentation-quality/date-time";
import { AccountPersonalEditor } from "./AccountPersonalEditor";
import { OfficialCustomerNumberValue } from "./OfficialCustomerNumberValue";
import {
  AccountProfileFormCard,
  AccountProfileFormField,
} from "./AccountProfileFormCard";

function fieldText(field: AccountProfileField, labels: AccountProfileLabels): string {
  if (field.value) return field.value;
  if (field.source === "unavailable") return labels.unavailable;
  return labels.notRegistered;
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
        : "border-gray-200 bg-gray-50 text-gray-800";
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

  const companyValue = (field: AccountProfileField) => {
    if (view.companyReadUnavailable) return labels.unavailable;
    return fieldText(field, labels);
  };

  const relationshipLinks = [
    { href: view.links.subscription, label: labels.openSubscription },
    { href: view.links.license, label: labels.openLicense },
    { href: view.links.invoices, label: labels.openInvoices },
  ];
  const securityLinks = [
    {
      href: view.links.security,
      label: labels.openSecurity,
      body: labels.securityLoginBody,
      icon: <ShieldCheck aria-hidden className="h-5 w-5 text-[#7C3AED]" />,
    },
    {
      href: view.links.privacy,
      label: labels.openPrivacy,
      body: labels.securityPrivacyBody,
      icon: <ShieldEllipsis aria-hidden className="h-5 w-5 text-[#7C3AED]" />,
    },
    {
      href: view.links.notifications,
      label: labels.openNotifications,
      body: labels.securityNotificationsBody,
      icon: <Bell aria-hidden className="h-5 w-5 text-[#7C3AED]" />,
    },
  ];

  return (
    <div className="w-full min-w-0 space-y-6">
      <section className="flex flex-col gap-4 rounded-[28px] border border-[rgba(96,82,176,.15)] bg-white p-5 shadow-[0_12px_30px_rgba(38,33,87,.07)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
          {view.avatarUrl ? (
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
              className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl bg-[rgba(124,58,237,.12)] text-xl font-semibold text-[#7C3AED]"
              aria-hidden
            >
              {view.initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-xl font-semibold text-gray-900">{name}</p>
            {view.companyName.value ? (
              <p className="mt-1 truncate text-sm text-gray-900">
                <span className="text-gray-500">{labels.organizationLabel}: </span>
                {view.companyName.value}
              </p>
            ) : null}
            <p className="mt-1 text-sm text-gray-500">{roleLabel}</p>
          </div>
        </div>
        <StatusPill label={license.label} icon={license.icon} tone={license.tone} />
      </section>

      <div className="-mx-1 overflow-x-auto px-1" role="tablist" aria-label={labels.tabsAria}>
        <div className="flex min-w-max gap-2 border-b border-gray-200">
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
                className={`inline-flex min-h-11 items-center rounded-t-xl px-4 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-100 ${
                  selected
                    ? "border-b-2 border-[#7C3AED] font-semibold text-[#7C3AED]"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {typeof label === "string" ? label : tab}
              </Link>
            );
          })}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`account-panel-${activeTab}`}
        aria-labelledby={`account-tab-${activeTab}`}
      >
        {activeTab === "personal" ? <AccountPersonalEditor view={view} labels={labels} /> : null}

        {activeTab === "company" ? (
          <AccountProfileFormCard
            title={labels.companyTitle}
            titleIcon={<Building2 aria-hidden className="h-4 w-4 text-[#7C3AED]" />}
            footer={
              <Link href={labels.requestChangeHref} className={ACCOUNT_PROFILE_LINK_BUTTON_CLASS}>
                {labels.requestChange}
              </Link>
            }
          >
            {view.companyName.value || view.hasCompanyDetails ? (
              <div className="space-y-5">
                <p className={ACCOUNT_PROFILE_HINT_CLASS}>{labels.companyOptionalNote}</p>
                <div className={ACCOUNT_PROFILE_FIELD_GRID_CLASS}>
                  <AccountProfileFormField
                    label={labels.companyName}
                    lockReason={labels.companyLegalNote}
                  >
                    <div className={ACCOUNT_PROFILE_READONLY_VALUE_CLASS}>
                      {companyValue(view.companyName)}
                    </div>
                  </AccountProfileFormField>
                  <AccountProfileFormField
                    label={labels.companyOrganizationNumber}
                    lockReason={labels.companyLegalNote}
                  >
                    <div className={ACCOUNT_PROFILE_READONLY_VALUE_CLASS}>
                      {companyValue(view.companyOrganizationNumber)}
                    </div>
                  </AccountProfileFormField>
                  <AccountProfileFormField
                    label={labels.companyWebsite}
                    lockReason={labels.companyLegalNote}
                  >
                    <div className={ACCOUNT_PROFILE_READONLY_VALUE_CLASS}>
                      {view.companyWebsiteHref && view.companyWebsite.value ? (
                        <a
                          href={view.companyWebsiteHref}
                          className="font-medium text-[#7C3AED] underline-offset-2 hover:underline"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {view.companyWebsite.value}
                        </a>
                      ) : (
                        companyValue(view.companyWebsite)
                      )}
                    </div>
                  </AccountProfileFormField>
                  <AccountProfileFormField
                    label={labels.companyPhone}
                    lockReason={labels.companyLegalNote}
                  >
                    <div className={ACCOUNT_PROFILE_READONLY_VALUE_CLASS}>
                      {companyValue(view.companyPhone)}
                    </div>
                  </AccountProfileFormField>
                </div>
                <AccountProfileFormField
                  label={labels.companyAddress}
                  lockReason={labels.companyLegalNote}
                >
                  <div className={`${ACCOUNT_PROFILE_READONLY_VALUE_CLASS} whitespace-pre-line`}>
                    {companyValue(view.companyAddress)}
                  </div>
                </AccountProfileFormField>
                {view.companyInvoiceAddress.value || view.companyReadUnavailable ? (
                  <AccountProfileFormField
                    label={labels.companyInvoiceAddress}
                    lockReason={labels.companyLegalNote}
                  >
                    <div className={`${ACCOUNT_PROFILE_READONLY_VALUE_CLASS} whitespace-pre-line`}>
                      {companyValue(view.companyInvoiceAddress)}
                    </div>
                  </AccountProfileFormField>
                ) : null}
                <p className={ACCOUNT_PROFILE_HINT_CLASS}>{labels.companyLegalNote}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-900">{labels.companyEmpty}</p>
                <p className={ACCOUNT_PROFILE_HINT_CLASS}>{labels.companyEmptyBody}</p>
              </div>
            )}
          </AccountProfileFormCard>
        ) : null}

        {activeTab === "relationship" ? (
          <AccountProfileFormCard title={labels.relationshipTitle}>
            <div className="space-y-5">
              <div className={ACCOUNT_PROFILE_FIELD_GRID_CLASS}>
                <AccountProfileFormField label={labels.workspace} lockReason={labels.readOnlyReason}>
                  <div className={ACCOUNT_PROFILE_READONLY_VALUE_CLASS}>
                    {fieldText(view.relationship.workspaceName, labels)}
                  </div>
                </AccountProfileFormField>
                <AccountProfileFormField label={labels.license} lockReason={labels.readOnlyReason}>
                  <div className="mt-2">
                    <StatusPill label={license.label} icon={license.icon} tone={license.tone} />
                  </div>
                </AccountProfileFormField>
              </div>
              <AccountProfileFormField
                label={labels.officialCustomerNumber}
                lockReason={labels.readOnlyReason}
              >
                <OfficialCustomerNumberValue
                  value={view.relationship.officialCustomerNumber.value}
                  empty={labels.unavailable}
                  copyLabel={labels.copyCustomerNumber}
                  copiedLabel={labels.copiedCustomerNumber}
                />
              </AccountProfileFormField>
              <AccountProfileFormField label={labels.plan} lockReason={labels.readOnlyReason}>
                <div className={ACCOUNT_PROFILE_READONLY_VALUE_CLASS}>
                  {fieldText(view.relationship.planName, labels)}
                </div>
              </AccountProfileFormField>
              <div className={ACCOUNT_PROFILE_FIELD_GRID_CLASS}>
                <AccountProfileFormField
                  label={labels.registeredAt}
                  lockReason={labels.readOnlyReason}
                >
                  <div className={ACCOUNT_PROFILE_READONLY_VALUE_CLASS}>{registeredAt}</div>
                </AccountProfileFormField>
                <AccountProfileFormField
                  label={labels.updatedAt}
                  lockReason={labels.readOnlyReason}
                >
                  <div className={ACCOUNT_PROFILE_READONLY_VALUE_CLASS}>{updatedAt}</div>
                </AccountProfileFormField>
              </div>
              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
                {relationshipLinks.map((link) => (
                  <Link key={link.href} href={link.href} className={ACCOUNT_PROFILE_LINK_BUTTON_CLASS}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </AccountProfileFormCard>
        ) : null}

        {activeTab === "security" ? (
          <AccountProfileFormCard
            title={labels.securityTitle}
            titleIcon={<ShieldCheck aria-hidden className="h-4 w-4 text-[#7C3AED]" />}
          >
            <div className="space-y-4">
              {securityLinks.map((link) => (
                <div
                  key={link.href}
                  className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-gray-50/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-0.5 shrink-0">{link.icon}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{link.label}</p>
                      <p className="mt-1 text-sm leading-relaxed text-gray-600">{link.body}</p>
                    </div>
                  </div>
                  <Link href={link.href} className={`${ACCOUNT_PROFILE_LINK_BUTTON_CLASS} shrink-0`}>
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          </AccountProfileFormCard>
        ) : null}
      </div>
    </div>
  );
}
