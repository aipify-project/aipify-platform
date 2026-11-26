export { buildAccountProfileLabels, type AccountProfileLabels } from "./labels";
export {
  accountProfileDataMapping,
  buildAccountProfileView,
  mapAccountProfileLicense,
  mapAccountProfileRole,
} from "./view-model";
export type {
  AccountProfileDataMappingRow,
  AccountProfileField,
  AccountProfileFieldSource,
  AccountProfileLicense,
  AccountProfileRole,
  AccountProfileView,
} from "./types";

export const ACCOUNT_PROFILE_ROUTE = "/app/profile";
export const ACCOUNT_PROFILE_LEGACY_ROUTE = "/app/account/profile";
export { parseAccountProfileTab, ACCOUNT_PROFILE_TABS, type AccountProfileTab } from "./tabs";
