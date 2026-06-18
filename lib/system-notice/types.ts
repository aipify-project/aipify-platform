export type SystemNoticeStatus =
  | "forbidden"
  | "not_found"
  | "unauthorized_panel"
  | "growth_partner_required"
  | "platform_required"
  | "super_admin_required"
  | "app_required"
  | "subscription_required"
  | "suspended_account"
  | "cancelled_account";

export type SystemNoticePreset = {
  status: SystemNoticeStatus;
  icon: string;
  titleKey: string;
  messageKey: string;
  primaryLabelKey: string;
  primaryHref: string;
  secondaryLabelKey: string;
  secondaryHref: string;
};

export type SystemNoticeLabels = {
  backToAipify: string;
  goToLogin: string;
  goToHome: string;
  knowledgeCenter: string;
  contactSupport: string;
  becomeGrowthPartner: string;
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
};
