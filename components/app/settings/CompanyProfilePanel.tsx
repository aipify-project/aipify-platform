import { Building2, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { CompanyProfileView } from "@/lib/app/settings/company-profile-view";

export type CompanyProfileLabels = {
  businessTitle: string;
  contactTitle: string;
  systemTitle: string;
  securityTitle: string;
  locked: string;
  organizationName: string;
  loginEmail: string;
  role: string;
  plan: string;
  license: string;
  contactUnavailable: string;
  logoUnavailable: string;
  emptyName: string;
  roles: Record<CompanyProfileView["role"] & string, string>;
  licenses: Record<NonNullable<CompanyProfileView["license"]>, string>;
  securityLinks: Array<{ href: string; label: string }>;
};

function LockedValue({ label, value, locked }: { label: string; value: string; locked: string }) {
  return (
    <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-[var(--app-text-muted)]">{label}</p>
        <span className="inline-flex items-center text-[var(--app-text-muted)]" title={locked}>
          <LockKeyhole aria-hidden className="h-3.5 w-3.5" />
        </span>
      </div>
      <p className="mt-1 text-sm font-medium text-[var(--app-text)]">{value}</p>
      <p className="mt-1 text-xs text-[var(--app-text-muted)]">{locked}</p>
    </div>
  );
}

export function CompanyProfilePanel({
  view,
  labels,
}: {
  view: CompanyProfileView;
  labels: CompanyProfileLabels;
}) {
  const name = view.displayName ?? labels.emptyName;
  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] p-5 shadow-[var(--app-shadow-card)] sm:flex-row sm:items-center">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--app-primary-soft)] text-lg font-semibold text-[var(--app-primary)]"
          aria-hidden
        >
          {view.initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-xl font-semibold text-[var(--app-text)]">{name}</p>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">{labels.logoUnavailable}</p>
          {view.license ? (
            <p className="mt-2 inline-flex rounded-full bg-[#F4FBF7] px-2.5 py-1 text-xs font-medium text-[var(--app-positive)]">
              {labels.licenses[view.license]}
            </p>
          ) : null}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--app-text)]">
          <Building2 aria-hidden className="h-4 w-4 text-[var(--app-primary)]" />
          {labels.businessTitle}
        </h2>
        <LockedValue label={labels.organizationName} value={name} locked={labels.locked} />
        {view.planName ? <LockedValue label={labels.plan} value={view.planName} locked={labels.locked} /> : null}
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--app-text)]">
          <Mail aria-hidden className="h-4 w-4 text-[var(--app-primary)]" />
          {labels.contactTitle}
        </h2>
        {view.loginEmail ? (
          <LockedValue label={labels.loginEmail} value={view.loginEmail} locked={labels.locked} />
        ) : null}
        <p className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-soft-surface)] px-4 py-3 text-sm leading-relaxed text-[var(--app-text-muted)]">
          {labels.contactUnavailable}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-[var(--app-text-muted)]">{labels.systemTitle}</h2>
        {view.role ? <LockedValue label={labels.role} value={labels.roles[view.role]} locked={labels.locked} /> : null}
        {view.license ? (
          <LockedValue label={labels.license} value={labels.licenses[view.license]} locked={labels.locked} />
        ) : null}
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--app-text)]">
          <ShieldCheck aria-hidden className="h-4 w-4 text-[var(--app-primary)]" />
          {labels.securityTitle}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {labels.securityLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] px-4 text-sm font-medium text-[var(--app-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
