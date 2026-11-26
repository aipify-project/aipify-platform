"use client";

import Link from "next/link";
import { useState } from "react";
import { Building2, ShieldCheck, UserRound, Wallet } from "lucide-react";
import { PartnersProfileAvatarPanel } from "@/components/partners-portal/PartnersProfileAvatarPanel";
import { CertifiedSalesPartnerBankPanel } from "@/components/partners-portal/CertifiedSalesPartnerBankPanel";
import type { PartnersPortalAvatarLabels } from "@/lib/partners-portal/shell-labels";
import type { CspBankPanelLabels } from "@/lib/partners-portal/csp-section-labels";
import { useCspPortal } from "./CspPortalSessionProvider";
import { AipifyAlert, AipifyCard, AipifyStatusBadge, AipifyTabs } from "./design";

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
  companyUnavailableTitle: string;
  companyUnavailableBody: string;
  payoutIntro: string;
  securityIntro: string;
  securityAccountNote: string;
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
};

export function CertifiedSalesPartnerProfilePanel({
  labels,
  avatarLabels,
  bankLabels,
  initialAvatarUrl,
}: Props) {
  const portal = useCspPortal();
  const [tab, setTab] = useState("person");
  const status = portal?.overview.partnerStatus ?? null;
  const approved = status === "approved" || status === "active" || status === "certified";
  const statusLabel =
    (status && labels.partnerStatus[status]) || labels.partnerStatus.unknown || labels.notAvailable;

  return (
    <div className="space-y-5">
      <AipifyCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#7C3AED]">Aipify</p>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1E293B]">{labels.headerTitle}</h1>
            <p className="max-w-3xl text-sm text-[#64748B]">{labels.headerSubtitle}</p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <p className="text-sm font-semibold text-[#1E293B]">
                {portal?.overview.displayName || labels.notAvailable}
              </p>
              <AipifyStatusBadge tone={approved ? "success" : "info"} label={statusLabel} />
            </div>
          </div>
        </div>
      </AipifyCard>

      <AipifyTabs
        ariaLabel={labels.headerTitle}
        activeId={tab}
        onChange={setTab}
        items={[
          { id: "person", label: labels.personTab, icon: <UserRound className="h-4 w-4" aria-hidden /> },
          { id: "company", label: labels.companyTab, icon: <Building2 className="h-4 w-4" aria-hidden /> },
          { id: "payout", label: labels.payoutTab, icon: <Wallet className="h-4 w-4" aria-hidden /> },
          { id: "security", label: labels.securityTab, icon: <ShieldCheck className="h-4 w-4" aria-hidden /> },
        ]}
      />

      {tab === "person" ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)]">
          <AipifyCard>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{labels.displayName}</dt>
                <dd className="mt-1 text-sm font-medium text-[#1E293B]">
                  {portal?.overview.displayName || labels.notAvailable}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{labels.status}</dt>
                <dd className="mt-1">
                  <AipifyStatusBadge tone={approved ? "success" : "info"} label={statusLabel} />
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{labels.email}</dt>
                <dd className="mt-1 text-sm text-[#64748B]">{labels.emailUnavailable}</dd>
              </div>
            </dl>
          </AipifyCard>
          <PartnersProfileAvatarPanel labels={avatarLabels} initialAvatarUrl={initialAvatarUrl} />
        </div>
      ) : null}

      {tab === "company" ? (
        <AipifyAlert tone="info" title={labels.companyUnavailableTitle}>
          {labels.companyUnavailableBody}
        </AipifyAlert>
      ) : null}

      {tab === "payout" ? (
        <div className="space-y-4">
          <AipifyAlert tone="info">{labels.payoutIntro}</AipifyAlert>
          <CertifiedSalesPartnerBankPanel labels={bankLabels} />
          <Link
            href="/partners/settlement"
            className="inline-flex min-h-11 items-center rounded-xl border border-[#E8E4F2] bg-white px-4 text-sm font-semibold text-[#1E293B]"
          >
            {labels.openSettlement}
          </Link>
        </div>
      ) : null}

      {tab === "security" ? (
        <div className="space-y-4">
          <AipifyCard>
            <h2 className="text-base font-semibold text-[#1E293B]">{labels.securityTab}</h2>
            <p className="mt-2 text-sm text-[#64748B]">{labels.securityIntro}</p>
            <p className="mt-3 text-sm text-[#64748B]">{labels.securityAccountNote}</p>
            <Link
              href="/app/settings/two-factor"
              className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-[#7C3AED] px-4 text-sm font-semibold text-white"
            >
              {labels.openTwoFactor}
            </Link>
          </AipifyCard>
          <AipifyAlert tone="neutral" title={labels.lockScreenTitle}>
            {labels.lockScreenBody}
          </AipifyAlert>
        </div>
      ) : null}
    </div>
  );
}
