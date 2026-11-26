import type { Translator } from "@/lib/i18n/translate";
import type { AccountProfileLicense, AccountProfileRole } from "./types";

const NS = "customerApp.portalStructure.accountProfile";

export type AccountProfileLabels = {
  eyebrow: string;
  title: string;
  description: string;
  personalTitle: string;
  relationshipTitle: string;
  securityTitle: string;
  tabsAria: string;
  tabPersonal: string;
  tabCompany: string;
  tabRelationship: string;
  tabSecurity: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  notRegistered: string;
  unavailable: string;
  readOnlyReason: string;
  emailLockedReason: string;
  save: string;
  saveSuccess: string;
  saveError: string;
  avatarUpload: string;
  avatarRemove: string;
  avatarUploadError: string;
  avatarRemoveError: string;
  avatarFallback: string;
  addCompanyDetails: string;
  companyTitle: string;
  companyName: string;
  companyWebsite: string;
  companyPhone: string;
  companyAddress: string;
  companyOptionalNote: string;
  companyEmpty: string;
  companyEmptyBody: string;
  workspace: string;
  plan: string;
  license: string;
  customerReference: string;
  registeredAt: string;
  updatedAt: string;
  referenceHidden: string;
  statusUnknown: string;
  openSubscription: string;
  openInvoices: string;
  openLicense: string;
  openSecurity: string;
  openPrivacy: string;
  openNotifications: string;
  openCompanySettings: string;
  screenLockTitle: string;
  screenLockBody: string;
  screenLockStatus: string;
  roles: Record<AccountProfileRole, string>;
  licenses: Record<AccountProfileLicense, string>;
};

export function buildAccountProfileLabels(t: Translator): AccountProfileLabels {
  return {
    eyebrow: t(`${NS}.eyebrow`),
    title: t(`${NS}.title`),
    description: t(`${NS}.description`),
    personalTitle: t(`${NS}.personalTitle`),
    relationshipTitle: t(`${NS}.relationshipTitle`),
    securityTitle: t(`${NS}.securityTitle`),
    tabsAria: t(`${NS}.tabsAria`),
    tabPersonal: t(`${NS}.tabPersonal`),
    tabCompany: t(`${NS}.tabCompany`),
    tabRelationship: t(`${NS}.tabRelationship`),
    tabSecurity: t(`${NS}.tabSecurity`),
    fullName: t(`${NS}.fullName`),
    email: t(`${NS}.email`),
    phone: t(`${NS}.phone`),
    address: t(`${NS}.address`),
    role: t(`${NS}.role`),
    notRegistered: t(`${NS}.notRegistered`),
    unavailable: t(`${NS}.unavailable`),
    readOnlyReason: t(`${NS}.readOnlyReason`),
    emailLockedReason: t(`${NS}.emailLockedReason`),
    save: t(`${NS}.save`),
    saveSuccess: t(`${NS}.saveSuccess`),
    saveError: t(`${NS}.saveError`),
    avatarUpload: t(`${NS}.avatarUpload`),
    avatarRemove: t(`${NS}.avatarRemove`),
    avatarUploadError: t(`${NS}.avatarUploadError`),
    avatarRemoveError: t(`${NS}.avatarRemoveError`),
    avatarFallback: t(`${NS}.avatarFallback`),
    addCompanyDetails: t(`${NS}.addCompanyDetails`),
    companyTitle: t(`${NS}.companyTitle`),
    companyName: t(`${NS}.companyName`),
    companyWebsite: t(`${NS}.companyWebsite`),
    companyPhone: t(`${NS}.companyPhone`),
    companyAddress: t(`${NS}.companyAddress`),
    companyOptionalNote: t(`${NS}.companyOptionalNote`),
    companyEmpty: t(`${NS}.companyEmpty`),
    companyEmptyBody: t(`${NS}.companyEmptyBody`),
    workspace: t(`${NS}.workspace`),
    plan: t(`${NS}.plan`),
    license: t(`${NS}.license`),
    customerReference: t(`${NS}.customerReference`),
    registeredAt: t(`${NS}.registeredAt`),
    updatedAt: t(`${NS}.updatedAt`),
    referenceHidden: t(`${NS}.referenceHidden`),
    statusUnknown: t(`${NS}.statusUnknown`),
    openSubscription: t(`${NS}.openSubscription`),
    openInvoices: t(`${NS}.openInvoices`),
    openLicense: t(`${NS}.openLicense`),
    openSecurity: t(`${NS}.openSecurity`),
    openPrivacy: t(`${NS}.openPrivacy`),
    openNotifications: t(`${NS}.openNotifications`),
    openCompanySettings: t(`${NS}.openCompanySettings`),
    screenLockTitle: t(`${NS}.screenLockTitle`),
    screenLockBody: t(`${NS}.screenLockBody`),
    screenLockStatus: t(`${NS}.screenLockStatus`),
    roles: {
      owner: t(`${NS}.roles.owner`),
      admin: t(`${NS}.roles.admin`),
      support: t(`${NS}.roles.support`),
      staff: t(`${NS}.roles.staff`),
      read_only: t(`${NS}.roles.readOnly`),
      member: t(`${NS}.roles.member`),
    },
    licenses: {
      active: t(`${NS}.licenses.active`),
      paused: t(`${NS}.licenses.paused`),
      grace: t(`${NS}.licenses.grace`),
      trialing: t(`${NS}.licenses.trialing`),
      cancelled: t(`${NS}.licenses.cancelled`),
    },
  };
}
