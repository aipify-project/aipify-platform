import { COMPANY_CONFIG } from "@/lib/company/company.config";

const PLACEHOLDER_MAP: Record<string, string> = {
  "{{legal_company_name}}": COMPANY_CONFIG.legalCompanyName,
  "{{organization_number}}": COMPANY_CONFIG.organizationNumber,
  "{{headquarters_address}}": COMPANY_CONFIG.headquartersAddress,
  "{{country}}": COMPANY_CONFIG.country,
  "{{contact_email}}": COMPANY_CONFIG.contactEmail,
  "{{website}}": COMPANY_CONFIG.website,
};

export function getLegalCompanyContext() {
  return {
    legal_company_name: COMPANY_CONFIG.legalCompanyName,
    organization_number: COMPANY_CONFIG.organizationNumber,
    headquarters_address: COMPANY_CONFIG.headquartersAddress,
    country: COMPANY_CONFIG.country,
    contact_email: COMPANY_CONFIG.contactEmail,
    website: COMPANY_CONFIG.website,
  };
}

export function renderLegalDocumentTemplate(template: string, packName?: string): string {
  let body = template;
  for (const [token, value] of Object.entries(PLACEHOLDER_MAP)) {
    body = body.split(token).join(value);
  }
  if (packName) {
    body = body.split("{{pack_name}}").join(packName);
  }
  return body;
}
