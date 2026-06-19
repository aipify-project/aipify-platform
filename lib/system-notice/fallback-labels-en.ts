import type { SystemNoticeLabels } from "./types";

/** English fallback when SystemNoticeProvider is not mounted. */
export const SYSTEM_NOTICE_LABELS_EN: SystemNoticeLabels = {
  backToAipify: "Back to Aipify",
  goToLogin: "Go to Login",
  goToHome: "Go to Aipify Home",
  knowledgeCenter: "Visit Knowledge Center",
  contactSupport: "Contact Support",
  becomeGrowthPartner: "Become a Growth Partner",
  registerGrowthPartnerAccount: "Register Growth Partner Account",
  returnToDashboard: "Return to Dashboard",
  viewBusinessPacks: "View Business Packs",
  upgradePlan: "Upgrade Plan",
  upgradeToEnterprise: "Upgrade to Enterprise",
  renewSubscription: "Renew Subscription",
  billing: "Billing",
  invoices: "Invoices",
  verificationRequired: "Verification required",
  presets: {
    forbidden: {
      title: "Access denied",
      message: "You do not have permission to view this area.",
      primaryLabel: "Go to Login",
      secondaryLabel: "Back to Aipify",
    },
    not_found: {
      title: "Page not found",
      message: "The page you are looking for may have moved, changed, or no longer exists.",
      primaryLabel: "Go to Aipify Home",
      secondaryLabel: "Visit Knowledge Center",
    },
    unauthorized_panel: {
      title: "Administrator Access Required",
      message:
        "You need administrator permissions to access this area. Contact your organization administrator if you believe this is an error.",
      primaryLabel: "Return to Dashboard",
      secondaryLabel: "Return to Dashboard",
    },
    growth_partner_required: {
      title: "Growth Partner Account Required",
      message:
        "You need an approved Growth Partner account to access this area.\n\nBecome a certified Aipify Growth Partner and gain access to partner tools, commissions, training, lead management and business resources.",
      primaryLabel: "Register Growth Partner Account",
      secondaryLabel: "Return to Dashboard",
    },
    business_pack_required: {
      title: "Business Pack Required",
      message:
        "This area requires an active Business Pack for your organization. Enable the pack in Module Management to continue.",
      primaryLabel: "View Business Packs",
      secondaryLabel: "Return to Dashboard",
    },
    professional_plan_required: {
      title: "Professional Plan Required",
      message:
        "This area requires a Professional plan or higher. Upgrade your subscription to unlock this capability.",
      primaryLabel: "Upgrade Plan",
      secondaryLabel: "Return to Dashboard",
    },
    enterprise_access_required: {
      title: "Enterprise Access Required",
      message:
        "This area is available on Enterprise plans. Upgrade to Enterprise to access advanced organizational capabilities.",
      primaryLabel: "Upgrade to Enterprise",
      secondaryLabel: "Return to Dashboard",
    },
    administrator_access_required: {
      title: "Administrator Access Required",
      message:
        "You need administrator permissions to access this area. Contact your organization administrator if you believe this is an error.",
      primaryLabel: "Return to Dashboard",
      secondaryLabel: "Return to Dashboard",
    },
    executive_access_required: {
      title: "Executive Access Required",
      message:
        "This area is reserved for executive roles in your organization. Contact your administrator if you need access.",
      primaryLabel: "Return to Dashboard",
      secondaryLabel: "Return to Dashboard",
    },
    platform_required: {
      title: "Platform access required",
      message: "This area is only available for authorized Aipify Platform users.",
      primaryLabel: "Go to Login",
      secondaryLabel: "Back to Aipify",
    },
    super_admin_required: {
      title: "Super Admin access required",
      message: "This area is restricted to authorized Aipify Group AS system administrators.",
      primaryLabel: "Go to Login",
      secondaryLabel: "Back to Aipify",
    },
    app_required: {
      title: "APP access required",
      message:
        "This area belongs to an Aipify customer organization. Please log in with an authorized account.",
      primaryLabel: "Go to Login",
      secondaryLabel: "Back to Aipify",
    },
    subscription_required: {
      title: "Subscription required",
      message: "This organization requires an active subscription to access operational features.",
      primaryLabel: "Renew Subscription",
      secondaryLabel: "Billing",
    },
    suspended_account: {
      title: "Subscription required",
      message:
        "This organization is currently paused because the subscription requires attention. Billing, invoices, and support remain available.",
      primaryLabel: "Renew Subscription",
      secondaryLabel: "Contact Support",
    },
    cancelled_account: {
      title: "Account cancelled",
      message: "This organization subscription has been cancelled. Contact support if you need to restore access.",
      primaryLabel: "Contact Support",
      secondaryLabel: "Back to Aipify",
    },
  },
};
