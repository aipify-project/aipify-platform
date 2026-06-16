import type { GrowthPartnerPortalSectionKey } from "./types";

export function buildGrowthPartnerPortalLabels(
  t: (key: string) => string,
  section: GrowthPartnerPortalSectionKey,
): Record<string, string> {
  const p = "growthPartnerPortal";
  const c = `${p}.common`;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${c}.retry`),
    governanceNote: t(`${p}.governanceNote`),
    leadsThisMonth: t(`${p}.leadsThisMonth`),
    activeReferrals: t(`${p}.activeReferrals`),
    convertedCustomers: t(`${p}.convertedCustomers`),
    pendingCommissions: t(`${p}.pendingCommissions`),
    upcomingPayouts: t(`${p}.upcomingPayouts`),
    certificationStatus: t(`${p}.certificationStatus`),
    certificationProgress: t(`${p}.certificationProgress`),
    company: t(`${p}.company`),
    contact: t(`${p}.contact`),
    status: t(`${p}.status`),
    source: t(`${p}.source`),
    actions: t(`${p}.actions`),
    prospect: t(`${p}.prospect`),
    invitedAt: t(`${p}.invitedAt`),
    customer: t(`${p}.customer`),
    amount: t(`${p}.amount`),
    expectedPayout: t(`${p}.expectedPayout`),
    period: t(`${p}.period`),
    scheduledDate: t(`${p}.scheduledDate`),
    viewPayout: t(`${p}.viewPayout`),
    member: t(`${p}.member`),
    role: t(`${p}.role`),
    markContacted: t(`${p}.markContacted`),
    markQualified: t(`${p}.markQualified`),
    markRegistered: t(`${p}.markRegistered`),
    inviteMember: t(`${p}.inviteMember`),
    defaultInviteEmail: t(`${p}.defaultInviteEmail`),
    defaultInviteName: t(`${p}.defaultInviteName`),
    settingsTitle: t(`${p}.settingsTitle`),
    settingsDescription: t(`${p}.settingsDescription`),
    notificationEmail: t(`${p}.notificationEmail`),
    updateSettings: t(`${p}.updateSettings`),
    defaultNotificationEmail: t(`${p}.defaultNotificationEmail`),
    completed: t(`${p}.completed`),
    actionRecorded: t(`${c}.actionRecorded`),
    actionFailed: t(`${c}.actionFailed`),
    pageTitle: t(`${p}.sections.${section}.title`),
    pageSubtitle: t(`${p}.sections.${section}.subtitle`),
    emptyLeadsTitle: t(`${p}.empty.leadsTitle`),
    emptyLeadsMessage: t(`${p}.empty.leadsMessage`),
    emptyReferralsTitle: t(`${p}.empty.referralsTitle`),
    emptyReferralsMessage: t(`${p}.empty.referralsMessage`),
    emptyCommissionsTitle: t(`${p}.empty.commissionsTitle`),
    emptyCommissionsMessage: t(`${p}.empty.commissionsMessage`),
    emptyPayoutsTitle: t(`${p}.empty.payoutsTitle`),
    emptyPayoutsMessage: t(`${p}.empty.payoutsMessage`),
    emptyAcademyTitle: t(`${p}.empty.academyTitle`),
    emptyAcademyMessage: t(`${p}.empty.academyMessage`),
    emptyAssetsTitle: t(`${p}.empty.assetsTitle`),
    emptyAssetsMessage: t(`${p}.empty.assetsMessage`),
    emptyTeamTitle: t(`${p}.empty.teamTitle`),
    emptyTeamMessage: t(`${p}.empty.teamMessage`),
  };

  const leadStatuses = ["new", "contacted", "qualified", "trial_started", "converted", "lost"] as const;
  const referralStatuses = ["invited", "registered", "trial_started", "converted", "active", "rewarded"] as const;
  const commissionStatuses = ["pending", "approved", "scheduled", "paid", "rejected"] as const;
  const payoutStatuses = ["scheduled", "processing", "completed", "failed"] as const;
  const teamRoles = ["partner_owner", "partner_manager", "sales_member"] as const;
  const memberStatuses = ["invited", "active", "suspended"] as const;
  const certificationStatuses = ["pending", "certified", "professional", "enterprise", "master"] as const;
  const moduleTypes = ["training", "playbook", "product_knowledge", "compliance", "certification"] as const;
  const assetTypes = ["logo", "banner", "email_template", "sales_deck", "one_pager", "social"] as const;

  for (const key of leadStatuses) labels[`leadStatus_${key}`] = t(`${p}.leadStatuses.${key}`);
  for (const key of referralStatuses) labels[`referralStatus_${key}`] = t(`${p}.referralStatuses.${key}`);
  for (const key of commissionStatuses) labels[`commissionStatus_${key}`] = t(`${p}.commissionStatuses.${key}`);
  for (const key of payoutStatuses) labels[`payoutStatus_${key}`] = t(`${p}.payoutStatuses.${key}`);
  for (const key of teamRoles) labels[`teamRole_${key}`] = t(`${p}.teamRoles.${key}`);
  for (const key of memberStatuses) labels[`memberStatus_${key}`] = t(`${p}.memberStatuses.${key}`);
  for (const key of certificationStatuses) labels[`certificationStatus_${key}`] = t(`${p}.certificationStatuses.${key}`);
  for (const key of moduleTypes) labels[`moduleType_${key}`] = t(`${p}.moduleTypes.${key}`);
  for (const key of assetTypes) labels[`assetType_${key}`] = t(`${p}.assetTypes.${key}`);

  return labels;
}

export function buildGrowthPartnerPortalNavLabels(t: (key: string) => string): Record<string, string> {
  const p = "growthPartnerPortal.nav";
  return {
    dashboard: t(`${p}.dashboard`),
    leads: t(`${p}.leads`),
    referrals: t(`${p}.referrals`),
    commissions: t(`${p}.commissions`),
    payouts: t(`${p}.payouts`),
    academy: t(`${p}.academy`),
    assets: t(`${p}.assets`),
    team: t(`${p}.team`),
    settings: t(`${p}.settings`),
  };
}
