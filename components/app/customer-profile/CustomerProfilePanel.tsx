import Link from "next/link";
import { AppLayoutClasses } from "@/lib/design/app-layout";
import type { CustomerProfileRole, CustomerProfileStatus, CustomerProfileView } from "@/lib/app/customer-profile/model";
import { formatPlatformDateTimeShort } from "@/lib/platform-presentation-quality/date-time";

export type CustomerProfileLabels = {
  eyebrow: string;
  title: string;
  subtitle: string;
  profileTitle: string;
  relationshipTitle: string;
  fullName: string;
  role: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  workspace: string;
  plan: string;
  status: string;
  reference: string;
  created: string;
  updated: string;
  unavailable: string;
  notRegistered: string;
  photoNote: string;
  actionsTitle: string;
  editProfile: string;
  updateContact: string;
  changePhoto: string;
  privacy: string;
  actionBlocked: string;
  lockTitle: string;
  lockBody: string;
  lockStatus: string;
  roles: Record<CustomerProfileRole, string>;
  statuses: Record<CustomerProfileStatus, string>;
  statusUnknown: string;
  dateEmpty: string;
  dateInvalid: string;
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-[var(--app-border)] bg-[var(--app-canvas)] px-4 py-3">
      <p className="text-xs font-medium text-[var(--app-text-muted)]">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-[var(--app-text)]">{value}</p>
    </div>
  );
}

function ActionButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      aria-describedby="customer-profile-action-note"
      className="rounded-xl border border-[var(--app-border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--app-text)] shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--app-primary)] hover:text-[var(--app-primary)] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-primary)]"
    >
      {label}
    </button>
  );
}

export function CustomerProfilePanel({
  view,
  labels,
  locale,
}: {
  view: CustomerProfileView;
  labels: CustomerProfileLabels;
  locale: string;
}) {
  const dateOptions = { locale, emptyFallback: labels.dateEmpty, invalidFallback: labels.dateInvalid };
  const name = view.fullName ?? labels.notRegistered;
  const role = view.role ? labels.roles[view.role] : labels.notRegistered;
  const status = view.status ? labels.statuses[view.status] : labels.statusUnknown;

  return (
    <div className={`${AppLayoutClasses.page} ${AppLayoutClasses.sectionGap}`}>
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--app-primary)]">{labels.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--app-text)]">{labels.title}</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--app-text-muted)]">{labels.subtitle}</p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className={`${AppLayoutClasses.card} lg:col-span-7`}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div
              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[var(--app-primary-soft)] text-2xl font-semibold text-[var(--app-primary)] shadow-inner"
              aria-hidden
            >
              {view.initials}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-semibold text-[var(--app-text)]">{labels.profileTitle}</h2>
              <p className="mt-1 text-lg font-medium text-[var(--app-text)]">{name}</p>
              <p className="mt-1 text-sm text-[var(--app-text-muted)]">{role}</p>
              <p className="mt-2 text-sm text-[var(--app-text-muted)]">{labels.photoNote}</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label={labels.fullName} value={name} />
            <Field label={labels.role} value={role} />
            <Field label={labels.email} value={view.email ?? labels.notRegistered} />
            <Field label={labels.phone} value={view.phone ?? labels.unavailable} />
            <Field label={labels.address} value={labels.unavailable} />
            <Field label={labels.website} value={labels.unavailable} />
          </div>
        </section>

        <section className={`${AppLayoutClasses.card} lg:col-span-5`}>
          <h2 className="text-xl font-semibold text-[var(--app-text)]">{labels.relationshipTitle}</h2>
          <div className="mt-5 grid grid-cols-1 gap-3">
            <Field label={labels.workspace} value={view.workspaceName ?? labels.notRegistered} />
            <Field label={labels.plan} value={view.planName ?? labels.notRegistered} />
            <Field label={labels.status} value={status} />
            <Field label={labels.reference} value={view.customerReference ?? labels.notRegistered} />
            <Field label={labels.created} value={formatPlatformDateTimeShort(view.createdAt, dateOptions)} />
            <Field label={labels.updated} value={formatPlatformDateTimeShort(view.updatedAt, dateOptions)} />
          </div>
        </section>
      </div>

      <section className={AppLayoutClasses.card}>
        <h2 className="text-xl font-semibold text-[var(--app-text)]">{labels.actionsTitle}</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <ActionButton label={labels.editProfile} />
          <ActionButton label={labels.updateContact} />
          <ActionButton label={labels.changePhoto} />
          <Link
            href="/app/settings/security"
            className="rounded-xl bg-[var(--app-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-primary)]"
          >
            {labels.privacy}
          </Link>
        </div>
        <p id="customer-profile-action-note" className="mt-4 text-sm leading-6 text-[var(--app-text-muted)]">
          {labels.actionBlocked}
        </p>
      </section>

      <section className={AppLayoutClasses.card} aria-labelledby="customer-profile-lock-title">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="customer-profile-lock-title" className="text-xl font-semibold text-[var(--app-text)]">
            {labels.lockTitle}
          </h2>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
            <span aria-hidden className="h-2 w-2 rounded-full bg-amber-500" />
            {labels.lockStatus}
          </span>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--app-text-muted)]">{labels.lockBody}</p>
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="mt-4 cursor-not-allowed rounded-xl border border-[var(--app-border)] px-4 py-2.5 text-sm font-semibold text-[var(--app-text-muted)]"
        >
          {labels.lockTitle}
        </button>
      </section>
    </div>
  );
}
