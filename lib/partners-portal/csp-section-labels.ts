import { mapPartnersHrefToAppHost } from "@/lib/sales-partner-app-migration/phase-c-shared-surfaces";
import { SALES_PARTNER_SHARED_APP_SURFACES } from "@/lib/sales-partner-app-migration/shared-surfaces-complete";

export type CspHelpLabels = {
  title: string;
  intro: string;
  sections: Array<{
    id: string;
    title: string;
    body: string;
    href?: string;
    cta?: string;
  }>;
  sharedAppTitle: string;
  sharedApp: Array<{
    id: string;
    title: string;
    body: string;
    href: string;
    cta: string;
  }>;
};

export type CspNotificationsLabels = {
  title: string;
  intro: string;
  emptyTitle: string;
  emptyBody: string;
  messagesCta: string;
  homeCta: string;
  unreadTitle: string;
  unreadBody: string;
  retry: string;
  errorTitle: string;
  errorBody: string;
};

/** Server-safe. Must not live in a client component module. */
export function buildCspHelpLabels(t: (key: string) => string): CspHelpLabels {
  const p = "partnersPortal.certifiedSalesPartner.help";
  const section = (id: string, partnersHref?: string) => {
    const href = partnersHref ? mapPartnersHrefToAppHost(partnersHref) : undefined;
    return {
      id,
      title: t(`${p}.sections.${id}.title`),
      body: t(`${p}.sections.${id}.body`),
      href,
      cta: href ? t(`${p}.sections.${id}.cta`) : undefined,
    };
  };
  const shared = (id: string, href: string) => ({
    id,
    title: t(`${p}.sharedApp.${id}.title`),
    body: t(`${p}.sharedApp.${id}.body`),
    href,
    cta: t(`${p}.sharedApp.${id}.cta`),
  });
  return {
    title: t(`${p}.title`),
    intro: t(`${p}.intro`),
    sections: [
      section("gettingStarted", "/partners/account/help/getting-started"),
      section("academy", "/partners/academy/training"),
      section("salesLinks", "/partners/referrals/links"),
      section("commission", "/partners/account/help/commission"),
      section("payouts", "/partners/settlement"),
      section("materials", "/partners/marketing/assets?section=library"),
      section("contact", "/partners/account/help/contact"),
    ],
    sharedAppTitle: t(`${p}.sharedAppTitle`),
    sharedApp: [
      shared("profile", SALES_PARTNER_SHARED_APP_SURFACES.appProfile.href),
      shared("support", SALES_PARTNER_SHARED_APP_SURFACES.appSupport.href),
      shared("notifications", SALES_PARTNER_SHARED_APP_SURFACES.appNotifications.href),
      shared("knowledge", SALES_PARTNER_SHARED_APP_SURFACES.knowledgeCenter.href),
    ],
  };
}

/** Server-safe. Must not live in a client component module. */
export function buildCspNotificationsLabels(t: (key: string) => string): CspNotificationsLabels {
  const p = "partnersPortal.certifiedSalesPartner.notifications";
  const messages = "partnersPortal.certifiedSalesPartner.messages";
  return {
    title: t(`${p}.title`),
    intro: t(`${p}.intro`),
    emptyTitle: t(`${p}.emptyTitle`),
    emptyBody: t(`${p}.emptyBody`),
    messagesCta: t(`${p}.messagesCta`),
    homeCta: t(`${p}.homeCta`),
    unreadTitle: t(`${p}.unreadTitle`),
    unreadBody: t(`${p}.unreadBody`),
    retry: t(`${messages}.retry`),
    errorTitle: t(`${messages}.errorTitle`),
    errorBody: t(`${messages}.errorBody`),
  };
}

export type CspBankPanelLabels = {
  title: string;
  intro: string;
  accountHolder: string;
  country: string;
  currency: string;
  iban: string;
  swiftBic: string;
  save: string;
  saving: string;
  saved: string;
  error: string;
  unavailable: string;
  maskedLabel: string;
  noneSaved: string;
  retry: string;
  manualPayoutNote: string;
  cancel: string;
  unsaved: string;
  fieldErrors: Record<string, string>;
};

/** Server-safe. Must not live in a client component module (settlement P0). */
export function buildCspBankPanelLabels(t: (key: string) => string): CspBankPanelLabels {
  const p = "partnersPortal.certifiedSalesPartner.bank";
  return {
    title: t(`${p}.title`),
    intro: t(`${p}.intro`),
    accountHolder: t(`${p}.accountHolder`),
    country: t(`${p}.country`),
    currency: t(`${p}.currency`),
    iban: t(`${p}.iban`),
    swiftBic: t(`${p}.swiftBic`),
    save: t(`${p}.save`),
    saving: t(`${p}.saving`),
    saved: t(`${p}.saved`),
    error: t(`${p}.error`),
    unavailable: t(`${p}.unavailable`),
    maskedLabel: t(`${p}.maskedLabel`),
    noneSaved: t(`${p}.noneSaved`),
    retry: t(`${p}.retry`),
    manualPayoutNote: t(`${p}.manualPayoutNote`),
    cancel: t(`${p}.cancel`),
    unsaved: t(`${p}.unsaved`),
    fieldErrors: {
      country_must_be_two_letter_code: t(`${p}.fieldErrors.country_must_be_two_letter_code`),
      account_holder_required: t(`${p}.fieldErrors.account_holder_required`),
      currency_must_be_three_letter_code: t(`${p}.fieldErrors.currency_must_be_three_letter_code`),
      invalid_swift_bic: t(`${p}.fieldErrors.invalid_swift_bic`),
      invalid_iban: t(`${p}.fieldErrors.invalid_iban`),
      norwegian_account_or_iban_required: t(`${p}.fieldErrors.norwegian_account_or_iban_required`),
      iban_required_for_country: t(`${p}.fieldErrors.iban_required_for_country`),
      us_routing_number_required: t(`${p}.fieldErrors.us_routing_number_required`),
      local_account_number_required: t(`${p}.fieldErrors.local_account_number_required`),
      swift_bic_required: t(`${p}.fieldErrors.swift_bic_required`),
    },
  };
}
