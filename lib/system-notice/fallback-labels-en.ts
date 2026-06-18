import type { SystemNoticeLabels } from "./types";

/** English fallback when SystemNoticeProvider is not mounted. */
export const SYSTEM_NOTICE_LABELS_EN: SystemNoticeLabels = {
  backToAipify: "Back to Aipify",
  goToLogin: "Go to Login",
  goToHome: "Go to Aipify Home",
  knowledgeCenter: "Visit Knowledge Center",
  contactSupport: "Contact Support",
  becomeGrowthPartner: "Become a Growth Partner",
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
      title: "Access required",
      message:
        "You need appropriate permissions to view this area. Contact your administrator if you believe this is an error.",
      primaryLabel: "Back to Aipify",
      secondaryLabel: "Contact Support",
    },
    growth_partner_required: {
      title: "Growth Partner account required",
      message:
        "This area is available for registered Aipify Growth Partners. If you want to represent Aipify, complete the Growth Partner registration and certification process.",
      primaryLabel: "Become a Growth Partner",
      secondaryLabel: "Back to Aipify",
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
