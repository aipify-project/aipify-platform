import { LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import type { AccountProfileLabels } from "@/lib/app/account-profile/labels";
import type { AccountProfileField, AccountProfileView } from "@/lib/app/account-profile/types";
import { formatPlatformDateTimeShort } from "@/lib/platform-presentation-quality/date-time";

function displayField(
  field: AccountProfileField,
  notRegistered: string
): string {
  return field.value ?? notRegistered;
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

export function AppCustomerProfilePanel({
  view,
  labels,
  locale,
}: {
  view: AccountProfileView;
  labels: AccountProfileLabels;
  locale: string;
}) {
  const name = displayField(view.fullName, labels.notRegistered);
  const roleLabel = view.role ? labels.roles[view.role] : labels.notRegistered;
  const licenseLabel = view.relationship.license
    ? labels.licenses[view.relationship.license]
    : labels.notRegistered;
  const registeredAt = formatPlatformDateTimeShort(view.relationship.registeredAt.value, {
    locale,
    emptyFallback: labels.notRegistered,
    invalidFallback: labels.notRegistered,
  });

  const actionLinks = [
    { href: view.links.subscription, label: labels.openSubscription },
    { href: view.links.invoices, label: labels.openInvoices },
    { href: view.links.security, label: labels.openSecurity },
    { href: view.links.notifications, label: labels.openNotifications },
    ...(view.links.companySettings
      ? [{ href: view.links.companySettings, label: labels.openCompanySettings }]
      : []),
  ];

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] p-5 shadow-[var(--app-shadow-card)] sm:flex-row sm:items-center">
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
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--app-text)]">
          <UserRound aria-hidden className="h-4 w-4 text-[var(--app-primary)]" />
          {labels.personalTitle}
        </h2>
        <p className="text-sm leading-relaxed text-[var(--app-text-muted)]">{labels.readOnlyReason}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <LockedField
            label={labels.fullName}
            value={name}
            reason={labels.readOnlyReason}
          />
          <LockedField
            label={labels.email}
            value={displayField(view.email, labels.notRegistered)}
            reason={labels.readOnlyReason}
          />
          <LockedField
            label={labels.phone}
            value={displayField(view.phone, labels.notRegistered)}
            reason={labels.readOnlyReason}
          />
          <LockedField
            label={labels.address}
            value={displayField(view.address, labels.notRegistered)}
            reason={labels.readOnlyReason}
          />
          <LockedField label={labels.role} value={roleLabel} reason={labels.readOnlyReason} />
        </div>
      </section>

      {view.hasCompanyContext ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--app-text)]">{labels.companyTitle}</h2>
          <p className="text-sm leading-relaxed text-[var(--app-text-muted)]">
            {labels.companyOptionalNote}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <LockedField
              label={labels.companyName}
              value={displayField(view.companyName, labels.notRegistered)}
              reason={labels.readOnlyReason}
            />
            <LockedField
              label={labels.companyWebsite}
              value={displayField(view.companyWebsite, labels.notRegistered)}
              reason={labels.readOnlyReason}
            />
            <LockedField
              label={labels.companyPhone}
              value={displayField(view.companyPhone, labels.notRegistered)}
              reason={labels.readOnlyReason}
            />
            <LockedField
              label={labels.companyAddress}
              value={displayField(view.companyAddress, labels.notRegistered)}
              reason={labels.readOnlyReason}
            />
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-[var(--app-text)]">{labels.relationshipTitle}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <LockedField
            label={labels.plan}
            value={displayField(view.relationship.planName, labels.notRegistered)}
            reason={labels.readOnlyReason}
          />
          <LockedField label={labels.license} value={licenseLabel} reason={labels.readOnlyReason} />
          <LockedField
            label={labels.customerReference}
            value={displayField(view.relationship.customerReference, labels.notRegistered)}
            reason={labels.readOnlyReason}
          />
          <LockedField
            label={labels.registeredAt}
            value={registeredAt}
            reason={labels.readOnlyReason}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--app-text)]">
          <ShieldCheck aria-hidden className="h-4 w-4 text-[var(--app-primary)]" />
          {labels.securityTitle}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {actionLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] px-4 text-sm font-medium text-[var(--app-primary)] transition hover:border-[var(--app-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <section
        className="space-y-3 rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] p-5"
        aria-labelledby="app-account-screen-lock-title"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2
            id="app-account-screen-lock-title"
            className="flex items-center gap-2 text-sm font-semibold text-[var(--app-text)]"
          >
            <LockKeyhole aria-hidden className="h-4 w-4 text-[var(--app-primary)]" />
            {labels.screenLockTitle}
          </h2>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
            <LockKeyhole aria-hidden className="h-3.5 w-3.5" />
            {labels.screenLockStatus}
          </span>
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-[var(--app-text-muted)]">
          {labels.screenLockBody}
        </p>
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="inline-flex min-h-11 cursor-not-allowed items-center rounded-2xl border border-[var(--app-border)] px-4 text-sm font-medium text-[var(--app-text-muted)]"
        >
          {labels.screenLockTitle}
        </button>
      </section>
    </div>
  );
}
