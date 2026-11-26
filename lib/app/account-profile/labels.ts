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
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  notRegistered: string;
  readOnlyReason: string;
  avatarFallback: string;
  companyTitle: string;
  companyName: string;
  companyWebsite: string;
  companyPhone: string;
  companyAddress: string;
  companyOptionalNote: string;
  plan: string;
  license: string;
  customerReference: string;
  registeredAt: string;
  openSubscription: string;
  openInvoices: string;
  openSecurity: string;
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
    fullName: t(`${NS}.fullName`),
    email: t(`${NS}.email`),
    phone: t(`${NS}.phone`),
    address: t(`${NS}.address`),
    role: t(`${NS}.role`),
    notRegistered: t(`${NS}.notRegistered`),
    readOnlyReason: t(`${NS}.readOnlyReason`),
    avatarFallback: t(`${NS}.avatarFallback`),
    companyTitle: t(`${NS}.companyTitle`),
    companyName: t(`${NS}.companyName`),
    companyWebsite: t(`${NS}.companyWebsite`),
    companyPhone: t(`${NS}.companyPhone`),
    companyAddress: t(`${NS}.companyAddress`),
    companyOptionalNote: t(`${NS}.companyOptionalNote`),
    plan: t(`${NS}.plan`),
    license: t(`${NS}.license`),
    customerReference: t(`${NS}.customerReference`),
    registeredAt: t(`${NS}.registeredAt`),
    openSubscription: t(`${NS}.openSubscription`),
    openInvoices: t(`${NS}.openInvoices`),
    openSecurity: t(`${NS}.openSecurity`),
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
