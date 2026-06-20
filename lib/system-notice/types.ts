export type SystemNoticeStatus =
  | "forbidden"
  | "not_found"
  | "unauthorized_panel"
  | "growth_partner_required"
  | "business_pack_required"
  | "professional_plan_required"
  | "enterprise_access_required"
  | "administrator_access_required"
  | "executive_access_required"
  | "platform_required"
  | "super_admin_required"
  | "app_required"
  | "subscription_required"
  | "suspended_account"
  | "cancelled_account";

export type SystemNoticeLayout = {
  /** Hide the filled secondary button (e.g. Contact Support). */
  hideSecondary?: boolean;
  /** Show ghost Return to Dashboard button below primary CTA. */
  ghostDashboard?: boolean;
  dashboardHref?: string;
};

export type SystemNoticePreset = {
  status: SystemNoticeStatus;
  icon: string;
  titleKey: string;
  messageKey: string;
  primaryLabelKey: string;
  primaryHref: string;
  secondaryLabelKey: string;
  secondaryHref: string;
  layout?: SystemNoticeLayout;
};

export type SystemNoticeLabels = {
  backToAipify: string;
  goToLogin: string;
  goToHome: string;
  knowledgeCenter: string;
  contactSupport: string;
  becomeGrowthPartner: string;
  registerGrowthPartnerAccount: string;
  returnToDashboard: string;
  viewBusinessPacks: string;
  upgradePlan: string;
  upgradeToEnterprise: string;
  renewSubscription: string;
  billing: string;
  invoices: string;
  verificationRequired: string;
  presets: Record<
    SystemNoticeStatus,
    {
      title: string;
      message: string;
      primaryLabel: string;
      secondaryLabel: string;
    }
  >;
};

export type HumanVerificationLabels = {
  title: string;
  description: string;
  prompt: string;
  selectMatching: string;
  verified: string;
  failed: string;
  required: string;
  refresh: string;
  shapes: Record<"diamond" | "circle" | "triangle" | "square" | "star", string>;
};
