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
  const section = (id: string, href?: string) => ({
    id,
    title: t(`${p}.sections.${id}.title`),
    body: t(`${p}.sections.${id}.body`),
    href,
    cta: href ? t(`${p}.sections.${id}.cta`) : undefined,
  });
  return {
    title: t(`${p}.title`),
    intro: t(`${p}.intro`),
    sections: [
      section("gettingStarted", "/partners"),
      section("academy", "/partners/academy/training"),
      section("salesLinks", "/partners/referrals/links"),
      section("commission", "/partners/customers/pipeline"),
      section("payouts", "/partners/settlement"),
      section("materials", "/partners/marketing/assets"),
      section("contact", "/partners/account/messages"),
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
  };
}
