export { COMPANY_CONFIG, companyConfig, type CompanyConfig } from "./company.config";
export {
  getCompanyConfig,
  formatHeadquartersLine,
  formatCopyrightLine,
  formatCopyrightNotice,
  formatLegalEntityLine,
  companyMailto,
  formatSoftwareLicenseNotice,
  formatPrivacyContactLine,
  formatLegalContactLine,
  formatCompanyLegalReference,
  formatCompanyProductLine,
  formatInvoiceIssuerHeader,
  toLegacyBrandGroup,
} from "./helpers";
export {
  injectCompanyIntoBranding,
  injectCompanyIntoMarketing,
  injectCompanyIntoLicense,
  injectCompanyIntoCommon,
  injectCompanyIntoPlatform,
  injectCompanyIntoSuperAdmin,
  injectCompanyIntoDictionary,
} from "./inject";
