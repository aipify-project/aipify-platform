"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Award, BadgeCheck, Building2, LockKeyhole, ShieldCheck, ShieldOff, UserRound, Wallet } from "lucide-react";
import { PartnersProfileAvatarPanel } from "@/components/partners-portal/PartnersProfileAvatarPanel";
import { CertifiedSalesPartnerBankPanel } from "@/components/partners-portal/CertifiedSalesPartnerBankPanel";
import type { PartnersPortalAvatarLabels } from "@/lib/partners-portal/shell-labels";
import type { CspBankPanelLabels } from "@/lib/partners-portal/csp-section-labels";
import { CSP_PROFILE_FIELD_MODE, type CspProfileFieldMode } from "@/lib/certified-sales-partner/csp-profile-form";
import { useCspPortal } from "./CspPortalSessionProvider";
import { AipifyAlert, AipifyCard, AipifyPageHeader, AipifyStatusBadge, AipifyTabs } from "./design";

export type CspProfilePageLabels = {
  headerTitle: string;
  headerSubtitle: string;
  personTab: string;
  companyTab: string;
  payoutTab: string;
  securityTab: string;
  displayName: string;
  status: string;
  email: string;
  emailUnavailable: string;
  phone: string;
  phoneUnavailable: string;
  country: string;
  certification: string;
  certificationPassed: string;
  certificationNone: string;
  readOnlyHint: string;
  coreBlockedHint: string;
  formIntroPerson: string;
  formIntroCompany: string;
  companyContact: string;
  organizationNumber: string;
  address: string;
  website: string;
  contactCta: string;
  companyUnavailableTitle: string;
  companyUnavailableBody: string;
  payoutIntro: string;
  securityIntro: string;
  securityAccountNote: string;
  securityPasswordTitle: string;
  twoFactorTitle: string;
  openTwoFactor: string;
  lockScreenTitle: string;
  lockScreenBody: string;
  openSettlement: string;
  notAvailable: string;
  partnerStatus: Record<string, string>;
};

type Props = {
  labels: CspProfilePageLabels;
  avatarLabels: PartnersPortalAvatarLabels;
  bankLabels: CspBankPanelLabels;
  initialAvatarUrl: string | null;
  loginEmail: string | null;
  locale: string;
};

const INPUT =
  "mt-1.5 w-full rounded-xl border border-[#E8E4F2] bg-[#F7F6F3] px-3 py-2.5 text-sm text-[#1E293B] outline-none";

function hintFor(mode: CspProfileFieldMode, labels: CspProfilePageLabels): string | null {
  if (mode === "read_only") return labels.readOnlyHint;
  if (mode === "core_blocked") return labels.coreBlockedHint;
  return null;
}

function ReadOnlyField({
  id,
  label,
  value,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  hint: string | null;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="flex items-center gap-2 text-sm font-semibold text-[#1E293B]">
        {label}
        <LockKeyhole className="h-3.5 w-3.5 text-[#64748B]" aria-hidden />
      </label>
      <input id={id} readOnly value={value} aria-readonly="true" aria-describedby={hintId} className={INPUT} />
      {hint ? (
        <p id={hintId} className="mt-1.5 text-xs leading-relaxed text-[#64748B]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function CertifiedSalesPartnerProfilePanel({
  labels,
  avatarLabels,
  bankLabels,
  initialAvatarUrl,
  loginEmail,
  locale,
}: Props) {
  const portal = useCspPortal();
  const searchParams = useSearchParams();
  const initialTab = useMemo(() => {
    const raw = searchParams.get("tab");
    if (raw === "company" || raw === "payout" || raw === "security" || raw === "person") return raw;
    return "person";
  }, [searchParams]);
  const [tab, setTab] = useState(initialTab);
  const [payoutDirty, setPayoutDirty] = useState(false);
  const status = portal?.overview.partnerStatus ?? null;
  const approved = status === "approved" || status === "active" || status === "certified";
  const statusLabel =
    (status && labels.partnerStatus[status]) || labels.partnerStatus.unknown || labels.notAvailable;
  const displayName = portal?.overview.displayName || labels.notAvailable;
  const email = loginEmail?.trim() || labels.notAvailable;
  const countryCode = portal?.overview.country ?? null;
  const countryName = useMemo(() => {
    if (!countryCode) return labels.notAvailable;
    try {
      return new Intl.DisplayNames([locale, "en"], { type: "region" }).of(countryCode) ?? countryCode;
    } catch {
      return countryCode;
    }
  }, [countryCode, labels.notAvailable, locale]);
  const certified = (portal?.passedCertificationCount ?? 0) > 0;
  const blocked = labels.notAvailable;

  function changeTab(next: string) {
    if (tab === "payout" && next !== "payout" && payoutDirty) {
      if (!window.confirm(bankLabels.unsaved)) return;
    }
    setTab(next);
  }

  return (
    <div className="space-y-5">
      <AipifyPageHeader title={labels.headerTitle} description={labels.headerSubtitle} />

      <AipifyTabs
        ariaLabel={labels.headerTitle}
        activeId={tab}
        onChange={changeTab}
        items={[
          { id: "person", label: labels.personTab, icon: <UserRound className="h-4 w-4" aria-hidden /> },
          { id: "company", label: labels.companyTab, icon: <Building2 className="h-4 w-4" aria-hidden /> },
          { id: "payout", label: labels.payoutTab, icon: <Wallet className="h-4 w-4" aria-hidden /> },
          { id: "security", label: labels.securityTab, icon: <ShieldCheck className="h-4 w-4" aria-hidden /> },
        ]}
      />

      {tab === "person" ? (
        <div className="space-y-4">
          <AipifyCard>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <PartnersProfileAvatarPanel labels={avatarLabels} initialAvatarUrl={initialAvatarUrl} embedded />
              <div className="min-w-0 space-y-2 lg:text-right">
                <p className="truncate text-base font-semibold text-[#1E293B]">{displayName}</p>
                <div className="flex flex-wrap gap-2 lg:justify-end" aria-label={labels.certification}>
                  <AipifyStatusBadge
                    tone={approved ? "success" : "info"}
                    label={statusLabel}
                    icon={<BadgeCheck className="h-3.5 w-3.5" />}
                  />
                  <AipifyStatusBadge
                    tone={certified ? "success" : "neutral"}
                    label={certified ? labels.certificationPassed : labels.certificationNone}
                    icon={<Award className="h-3.5 w-3.5" />}
                  />
                </div>
              </div>
            </div>
          </AipifyCard>

          <AipifyCard padding="lg">
            <h2 className="text-base font-semibold text-[#1E293B]">{labels.personTab}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#64748B]">{labels.formIntroPerson}</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <ReadOnlyField
                id="csp-profile-name"
                label={labels.displayName}
                value={displayName}
                hint={hintFor(CSP_PROFILE_FIELD_MODE.displayName, labels)}
              />
              <ReadOnlyField
                id="csp-profile-email"
                label={labels.email}
                value={email}
                hint={labels.emailUnavailable}
              />
              <ReadOnlyField
                id="csp-profile-phone"
                label={labels.phone}
                value={blocked}
                hint={labels.phoneUnavailable}
              />
              <ReadOnlyField
                id="csp-profile-country"
                label={labels.country}
                value={countryName}
                hint={hintFor(CSP_PROFILE_FIELD_MODE.country, labels)}
              />
            </div>
          </AipifyCard>
        </div>
      ) : null}

      {tab === "company" ? (
        <AipifyCard padding="lg">
          <h2 className="text-base font-semibold text-[#1E293B]">{labels.companyTab}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#64748B]">{labels.formIntroCompany}</p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#64748B]">{labels.companyUnavailableBody}</p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <ReadOnlyField
              id="csp-company-name"
              label={labels.companyUnavailableTitle}
              value={portal?.overview.legalBusinessName || blocked}
              hint={portal?.overview.legalBusinessName ? labels.readOnlyHint : labels.coreBlockedHint}
            />
            <ReadOnlyField
              id="csp-company-org"
              label={labels.organizationNumber}
              value={blocked}
              hint={labels.coreBlockedHint}
            />
            <ReadOnlyField
              id="csp-company-contact"
              label={labels.companyContact}
              value={blocked}
              hint={labels.coreBlockedHint}
            />
            <ReadOnlyField
              id="csp-company-country"
              label={labels.country}
              value={countryName}
              hint={hintFor(CSP_PROFILE_FIELD_MODE.country, labels)}
            />
            <ReadOnlyField
              id="csp-company-address"
              label={labels.address}
              value={blocked}
              hint={labels.coreBlockedHint}
            />
            <ReadOnlyField
              id="csp-company-website"
              label={labels.website}
              value={blocked}
              hint={labels.coreBlockedHint}
            />
          </div>
          <Link
            href="/partners/account/help/contact"
            className="mt-6 inline-flex min-h-11 items-center rounded-xl border border-[#E8E4F2] px-4 text-sm font-semibold text-[#7C3AED]"
          >
            {labels.contactCta}
          </Link>
        </AipifyCard>
      ) : null}

      {tab === "payout" ? (
        <div className="space-y-4">
          <AipifyAlert tone="info">{labels.payoutIntro}</AipifyAlert>
          <CertifiedSalesPartnerBankPanel labels={bankLabels} onDirtyChange={setPayoutDirty} />
          <Link
            href="/partners/settlement"
            className="inline-flex min-h-11 items-center rounded-xl border border-[#E8E4F2] bg-white px-4 text-sm font-semibold text-[#1E293B]"
          >
            {labels.openSettlement}
          </Link>
        </div>
      ) : null}

      {tab === "security" ? (
        <AipifyCard padding="lg">
          <h2 className="text-base font-semibold text-[#1E293B]">{labels.securityTab}</h2>
          <div className="mt-6 grid gap-5">
            <div className="rounded-xl border border-[#E8E4F2] bg-white p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[#1E293B]">
                <ShieldCheck className="h-4 w-4 text-[#7C3AED]" aria-hidden />
                {labels.twoFactorTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{labels.securityIntro}</p>
              <Link
                href="/app/settings/two-factor"
                className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-[#7C3AED] px-4 text-sm font-semibold text-white"
              >
                {labels.openTwoFactor}
              </Link>
            </div>
            <div className="rounded-xl border border-[#E8E4F2] bg-white p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[#1E293B]">
                <LockKeyhole className="h-4 w-4 text-[#64748B]" aria-hidden />
                {labels.securityPasswordTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{labels.securityAccountNote}</p>
            </div>
            <div className="rounded-xl border border-[#E8E4F2] bg-[#F7F6F3] p-4">
              <AipifyStatusBadge tone="neutral" label={labels.lockScreenTitle} icon={<ShieldOff className="h-3.5 w-3.5" />} />
              <p className="mt-3 text-sm leading-relaxed text-[#64748B]">{labels.lockScreenBody}</p>
            </div>
          </div>
        </AipifyCard>
      ) : null}
    </div>
  );
}
