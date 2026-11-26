import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/translate";

/**
 * Short Platform Admin labels. Applied at dictionary load so menu names and
 * page headings change together without editing locale files owned by the
 * parallel seller-admin workspace.
 */
const SHORT: Record<string, Record<Locale, string>> = {
  partners: {
    en: "Partners",
    no: "Partnere",
    sv: "Partner",
    da: "Partnere",
    pl: "Partnerzy",
    uk: "Партнери",
    es: "Socios",
  },
  links: {
    en: "Sales links",
    no: "Salgslenker",
    sv: "Säljlänkar",
    da: "Salgslinks",
    pl: "Linki sprzedażowe",
    uk: "Посилання",
    es: "Enlaces de venta",
  },
  materials: {
    en: "Sales materials",
    no: "Salgsmateriell",
    sv: "Säljmaterial",
    da: "Salgsmateriale",
    pl: "Materiały sprzedażowe",
    uk: "Матеріали",
    es: "Material de ventas",
  },
  communication: {
    en: "Communication",
    no: "Kommunikasjon",
    sv: "Kommunikation",
    da: "Kommunikation",
    pl: "Komunikacja",
    uk: "Комунікація",
    es: "Comunicación",
  },
  security: {
    en: "Security",
    no: "Sikkerhet",
    sv: "Säkerhet",
    da: "Sikkerhed",
    pl: "Bezpieczeństwo",
    uk: "Безпека",
    es: "Seguridad",
  },
  pilot: {
    en: "Pilot control",
    no: "Pilotkontroll",
    sv: "Pilotkontroll",
    da: "Pilotkontrol",
    pl: "Kontrola pilotażu",
    uk: "Пілотний контроль",
    es: "Control del piloto",
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function withString(record: Record<string, unknown>, key: string, value: string): Record<string, unknown> {
  if (typeof record[key] !== "string") return record;
  return { ...record, [key]: value };
}

export function sellerAdminShortLabel(kind: keyof typeof SHORT, locale: Locale): string {
  return SHORT[kind][locale];
}

export function applySellerAdminShortLabels<T extends Dictionary>(dict: T, locale: Locale): T {
  if (!isRecord(dict.platform)) return dict;
  const text = (kind: keyof typeof SHORT) => SHORT[kind][locale];
  const platform: Record<string, unknown> = { ...dict.platform };
  if (isRecord(platform.nav)) {
    platform.nav = {
      ...platform.nav,
      sellersPartners: text("partners"),
      sellersAttribution: text("links"),
      sellersMaterials: text("materials"),
      sellersMessages: text("communication"),
      securityReviews: text("security"),
      unonightPilot: text("pilot"),
    };
  }
  if (isRecord(platform.sellers)) {
    const sellers: Record<string, unknown> = { ...platform.sellers };
    if (isRecord(sellers.overview)) sellers.overview = withString(sellers.overview, "openPartners", text("partners"));
    if (isRecord(sellers.partners)) sellers.partners = withString(sellers.partners, "title", text("partners"));
    if (isRecord(sellers.attribution)) sellers.attribution = withString(sellers.attribution, "title", text("links"));
    if (isRecord(sellers.materials)) sellers.materials = withString(sellers.materials, "title", text("materials"));
    if (isRecord(sellers.messages)) sellers.messages = withString(sellers.messages, "title", text("communication"));
    platform.sellers = sellers;
  }
  if (isRecord(platform.unonightPilot621)) {
    platform.unonightPilot621 = withString(platform.unonightPilot621, "title", text("pilot"));
  }
  return { ...dict, platform };
}
