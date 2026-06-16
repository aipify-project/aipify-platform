import type { Dictionary } from "@/lib/i18n/translate";
import { COMPANY_CONFIG } from "./company.config";
import {
  formatCopyrightLine,
  formatCopyrightNotice,
  formatHeadquartersLine,
  formatLegalContactLine,
  formatPrivacyContactLine,
  formatSoftwareLicenseNotice,
} from "./helpers";

function setNested(obj: Dictionary, path: string[], value: unknown): void {
  let cursor: Dictionary = obj;
  for (let i = 0; i < path.length - 1; i += 1) {
    const key = path[i];
    const next = cursor[key];
    if (!next || typeof next !== "object" || Array.isArray(next)) {
      cursor[key] = {};
    }
    cursor = cursor[key] as Dictionary;
  }
  cursor[path[path.length - 1]] = value;
}

/** Overlay branding namespace values from company.config.ts */
export function injectCompanyIntoBranding(dict: Dictionary): Dictionary {
  const branding = { ...(dict as Dictionary) };
  setNested(branding, ["company", "legalName"], COMPANY_CONFIG.legalCompanyName);
  setNested(branding, ["company", "brandName"], COMPANY_CONFIG.brandName);
  setNested(branding, ["company", "organizationNumber"], COMPANY_CONFIG.organizationNumber);
  setNested(branding, ["company", "headquarters"], formatHeadquartersLine());
  setNested(branding, ["company", "country"], COMPANY_CONFIG.country);
  setNested(branding, ["company", "website"], COMPANY_CONFIG.website);
  setNested(branding, ["company", "brandStatement"], COMPANY_CONFIG.brandStatement);
  setNested(branding, ["company", "officialStatement"], COMPANY_CONFIG.corporateSignature);
  setNested(branding, ["company", "marketingSignature"], COMPANY_CONFIG.corporateSignature);
  setNested(branding, ["company", "shortSignature"], COMPANY_CONFIG.corporateSignature.replace(/^Bergen\.\s*/, ""));
  setNested(branding, ["company", "footerDescription"], COMPANY_CONFIG.brandStatement);
  setNested(branding, ["company", "contactEmail"], COMPANY_CONFIG.contactEmail);
  setNested(branding, ["company", "supportEmail"], COMPANY_CONFIG.supportEmail);
  setNested(branding, ["company", "privacyEmail"], COMPANY_CONFIG.privacyContactEmail);
  setNested(branding, ["company", "billingEmail"], COMPANY_CONFIG.billingContactEmail);
  return branding;
}

/** Overlay marketing namespace legal/footer/contact values from company.config.ts */
export function injectCompanyIntoMarketing(dict: Dictionary): Dictionary {
  const marketing = { ...(dict as Dictionary) };

  setNested(marketing, ["footer", "companyName"], COMPANY_CONFIG.legalCompanyName);
  setNested(marketing, ["footer", "headquarters"], formatHeadquartersLine());
  setNested(marketing, ["footer", "description"], COMPANY_CONFIG.brandStatement);
  setNested(marketing, ["footer", "signature"], COMPANY_CONFIG.corporateSignature);
  setNested(marketing, ["footer", "copyright"], formatCopyrightNotice());

  setNested(marketing, ["contact", "emailValue"], COMPANY_CONFIG.contactEmail);

  setNested(
    marketing,
    ["earlyAccess", "error"],
    `Something went wrong. Please try again or email ${COMPANY_CONFIG.supportEmail}.`,
  );

  setNested(marketing, ["privacyPage", "sections", "contact", "body"], formatPrivacyContactLine());
  setNested(marketing, ["termsPage", "sections", "license", "body"], formatSoftwareLicenseNotice());
  setNested(marketing, ["termsPage", "sections", "contact", "body"], formatLegalContactLine());

  return marketing;
}

/** Overlay license namespace values from company.config.ts */
export function injectCompanyIntoLicense(dict: Dictionary): Dictionary {
  const license = { ...(dict as Dictionary) };
  setNested(license, ["sidebar", "copyright"], formatCopyrightLine());
  setNested(
    license,
    ["center", "sections", "company_identity", "title"],
    `About ${COMPANY_CONFIG.legalCompanyName}`,
  );
  setNested(license, ["center", "sections", "company_identity", "body"], [
    `${COMPANY_CONFIG.legalCompanyName} is headquartered in ${formatHeadquartersLine()}.`,
    `Official brand statement: ${COMPANY_CONFIG.corporateSignature}`,
    `${COMPANY_CONFIG.brandName} was founded in Bergen — shaped by Norwegian values of trust, quality, and long-term thinking.`,
    "Our ambition is global. Our values remain Norwegian.",
    `We build intelligent business systems designed to help organizations work smarter, respond faster, and grow with confidence — for organizations everywhere.`,
  ]);
  return license;
}

/** Overlay common namespace brand name from company.config.ts */
export function injectCompanyIntoCommon(dict: Dictionary): Dictionary {
  const common = { ...(dict as Dictionary) };
  setNested(common, ["appName"], COMPANY_CONFIG.brandName);
  return common;
}

/** Overlay platform namespace organization label from company.config.ts */
export function injectCompanyIntoPlatform(dict: Dictionary): Dictionary {
  const platform = { ...(dict as Dictionary) };
  setNested(platform, ["brand", "organization"], COMPANY_CONFIG.legalCompanyName);
  return platform;
}

/** Overlay superAdmin namespace company references from company.config.ts */
export function injectCompanyIntoSuperAdmin(dict: Dictionary): Dictionary {
  const superAdmin = { ...(dict as Dictionary) };
  setNested(superAdmin, ["header", "organization"], COMPANY_CONFIG.legalCompanyName);
  setNested(
    superAdmin,
    ["header", "subtitle"],
    `Operational headquarters for ${COMPANY_CONFIG.legalCompanyName}`,
  );
  setNested(
    superAdmin,
    ["header", "headquarters"],
    `Operational headquarters for ${COMPANY_CONFIG.legalCompanyName}.`,
  );
  setNested(
    superAdmin,
    ["groupOrganization", "foundationStatement"],
    `${COMPANY_CONFIG.legalCompanyName} is the parent organization. ${COMPANY_CONFIG.brandName} is the operating system. Future ventures are opportunities waiting to be connected.`,
  );
  setNested(
    superAdmin,
    ["groupOrganization", "groupOverviewDescription"],
    `Companies, entities, investments, and shared intelligence under ${COMPANY_CONFIG.legalCompanyName}.`,
  );
  if (superAdmin.footer && typeof superAdmin.footer === "object") {
    const footer = { ...(superAdmin.footer as Dictionary) };
    footer.signature = COMPANY_CONFIG.corporateSignature;
    superAdmin.footer = footer;
  }
  if (superAdmin.brand && typeof superAdmin.brand === "object") {
    const brand = { ...(superAdmin.brand as Dictionary) };
    brand.tagline = COMPANY_CONFIG.corporateSignature;
    superAdmin.brand = brand;
  }
  return superAdmin;
}

/** Apply company.config overlays to loaded dictionary namespaces */
export function injectCompanyIntoDictionary(dict: Record<string, Dictionary>): Record<string, Dictionary> {
  const result = { ...dict };
  if (result.common) {
    result.common = injectCompanyIntoCommon(result.common);
  }
  if (result.branding) {
    result.branding = injectCompanyIntoBranding(result.branding);
  }
  if (result.marketing) {
    result.marketing = injectCompanyIntoMarketing(result.marketing);
  }
  if (result.license) {
    result.license = injectCompanyIntoLicense(result.license);
  }
  if (result.platform) {
    result.platform = injectCompanyIntoPlatform(result.platform);
  }
  if (result.superAdmin) {
    result.superAdmin = injectCompanyIntoSuperAdmin(result.superAdmin);
  }
  return result;
}
