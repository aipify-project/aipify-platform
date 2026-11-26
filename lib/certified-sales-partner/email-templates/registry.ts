import type {
  CspEmailLocalizedFields,
  CspEmailTemplateDefinition,
  CspEmailTemplateLocale,
} from "./types";

function L(
  en: CspEmailLocalizedFields,
  no: CspEmailLocalizedFields,
  sv?: CspEmailLocalizedFields,
  da?: CspEmailLocalizedFields,
  pl?: CspEmailLocalizedFields,
  uk?: CspEmailLocalizedFields,
  es?: CspEmailLocalizedFields,
): Partial<Record<CspEmailTemplateLocale, CspEmailLocalizedFields>> {
  return {
    en,
    no,
    ...(sv ? { sv } : {}),
    ...(da ? { da } : {}),
    ...(pl ? { pl } : {}),
    ...(uk ? { uk } : {}),
    ...(es ? { es } : {}),
  };
}

const WEB_INTRO_EN: CspEmailLocalizedFields = {
  subject: "A short introduction to Kompis Web",
  preheader: "Website help based on content you approve.",
  body:
    "Hello,\n\n{{seller_display_name}} from {{seller_company}} would like to introduce Kompis Web — Aipify’s companion that answers visitor questions using content you have approved.\n\n{{product_description}}\n\nYou stay in control of what it can use. No invented claims or prices are included here.\n\nIf this is relevant, open the personal link below.",
  ctaLabel: "Learn more",
};

const WEB_INTRO_NO: CspEmailLocalizedFields = {
  subject: "En kort introduksjon til Kompis Web",
  preheader: "Nettsidehjelp basert på innhold du godkjenner.",
  body:
    "Hei,\n\n{{seller_display_name}} fra {{seller_company}} vil gjerne presentere Kompis Web — Aipifys løsning som svarer på besøkendes spørsmål med innhold du har godkjent.\n\n{{product_description}}\n\nDu beholder kontrollen over hva den kan bruke. Ingen priser eller resultatløfter er inkludert her.\n\nHvis dette er relevant, åpne den personlige lenken under.",
  ctaLabel: "Les mer",
};

const WEB_FOLLOW_EN: CspEmailLocalizedFields = {
  subject: "Following up on Kompis Web",
  preheader: "A calm follow-up — no pressure.",
  body:
    "Hello,\n\nThis is a short follow-up from {{seller_display_name}} ({{seller_company}}) about Kompis Web.\n\nIf you have questions, reply to this email. {{seller_contact}}\n\nPersonal link:",
  ctaLabel: "Open link",
};

const WEB_FOLLOW_NO: CspEmailLocalizedFields = {
  subject: "Oppfølging om Kompis Web",
  preheader: "En rolig oppfølging — uten press.",
  body:
    "Hei,\n\nDette er en kort oppfølging fra {{seller_display_name}} ({{seller_company}}) om Kompis Web.\n\nHar du spørsmål, svar gjerne på denne e-posten. {{seller_contact}}\n\nPersonlig lenke:",
  ctaLabel: "Åpne lenke",
};

const WEB_MEET_EN: CspEmailLocalizedFields = {
  subject: "Would a short meeting about Kompis Web help?",
  preheader: "Optional meeting request — you decide.",
  body:
    "Hello,\n\n{{seller_display_name}} from {{seller_company}} is available for a short meeting about Kompis Web if that would be useful.\n\n{{product_description}}\n\nReply to this email if you want to schedule something. No obligation.",
  ctaLabel: "View product page",
};

const WEB_MEET_NO: CspEmailLocalizedFields = {
  subject: "Kan et kort møte om Kompis Web være nyttig?",
  preheader: "Valgfri møteforespørsel — du bestemmer.",
  body:
    "Hei,\n\n{{seller_display_name}} fra {{seller_company}} kan ta et kort møte om Kompis Web hvis det er nyttig.\n\n{{product_description}}\n\nSvar på denne e-posten hvis du vil avtale noe. Ingen forpliktelse.",
  ctaLabel: "Se produktside",
};

const WEB_INFO_EN: CspEmailLocalizedFields = {
  subject: "Product information: Kompis Web",
  preheader: "Approved product information only.",
  body:
    "Hello,\n\nHere is approved product information for Kompis Web from {{seller_display_name}} at {{seller_company}}.\n\n{{product_description}}\n\nUse the personal referral link for the official page.",
  ctaLabel: "Open referral link",
};

const WEB_INFO_NO: CspEmailLocalizedFields = {
  subject: "Produktinformasjon: Kompis Web",
  preheader: "Kun godkjent produktinformasjon.",
  body:
    "Hei,\n\nHer er godkjent produktinformasjon om Kompis Web fra {{seller_display_name}} hos {{seller_company}}.\n\n{{product_description}}\n\nBruk den personlige salgslenken for den offisielle siden.",
  ctaLabel: "Åpne salgslenke",
};

/**
 * Code-reviewed marketing templates for Aipify’s own sellers.
 * Incomplete locales are simply absent — UI must show unavailable, never English fallback.
 */
export const CSP_EMAIL_TEMPLATE_REGISTRY: readonly CspEmailTemplateDefinition[] = [
  {
    id: "kompis-web-product-introduction-v1",
    type: "product_introduction",
    productKey: "kompis_web",
    version: 1,
    published: true,
    locales: L(WEB_INTRO_EN, WEB_INTRO_NO),
  },
  {
    id: "kompis-web-follow-up-v1",
    type: "follow_up",
    productKey: "kompis_web",
    version: 1,
    published: true,
    locales: L(WEB_FOLLOW_EN, WEB_FOLLOW_NO),
  },
  {
    id: "kompis-web-meeting-request-v1",
    type: "meeting_request",
    productKey: "kompis_web",
    version: 1,
    published: true,
    locales: L(WEB_MEET_EN, WEB_MEET_NO),
  },
  {
    id: "kompis-web-product-information-v1",
    type: "product_information",
    productKey: "kompis_web",
    version: 1,
    published: true,
    locales: L(WEB_INFO_EN, WEB_INFO_NO),
  },
  // Bedrift templates are registered as unpublished examples for later activation.
  {
    id: "kompis-bedrift-product-introduction-v1",
    type: "product_introduction",
    productKey: "kompis_bedrift",
    version: 1,
    published: false,
    locales: L(
      {
        subject: "A short introduction to Kompis Bedrift",
        preheader: "Internal knowledge companion — draft template.",
        body: "Hello,\n\n{{seller_display_name}} from {{seller_company}} would like to introduce Kompis Bedrift.\n\n{{product_description}}",
        ctaLabel: "Learn more",
      },
      {
        subject: "En kort introduksjon til Kompis Bedrift",
        preheader: "Intern kunnskaps-kompis — utkast.",
        body: "Hei,\n\n{{seller_display_name}} fra {{seller_company}} vil gjerne presentere Kompis Bedrift.\n\n{{product_description}}",
        ctaLabel: "Les mer",
      },
    ),
  },
];

export function listPublishedCspEmailTemplates(opts?: {
  productKey?: string;
  type?: string;
}): CspEmailTemplateDefinition[] {
  return CSP_EMAIL_TEMPLATE_REGISTRY.filter(
    (t) =>
      t.published &&
      (!opts?.productKey || t.productKey === opts.productKey) &&
      (!opts?.type || t.type === opts.type),
  );
}

export function getCspEmailTemplateById(id: string): CspEmailTemplateDefinition | null {
  return CSP_EMAIL_TEMPLATE_REGISTRY.find((t) => t.id === id) ?? null;
}
