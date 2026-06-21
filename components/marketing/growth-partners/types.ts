import type { PartnerAdvisorLabels } from "@/components/marketing/PartnerAdvisorCard";
import type { HumanVerificationLabels } from "@/lib/system-notice/types";

export type GrowthPartnerKeyPoint = { text: string };

export type GrowthPartnerFormLabels = {
  title: string;
  stepAbout: string;
  stepBusiness: string;
  stepAccount: string;
  continue: string;
  back: string;
  password: string;
  passwordConfirm: string;
  fullName: string;
  professionalRole: string;
  professionalRoleOptional: string;
  companyName: string;
  businessRegistrationNumber: string;
  businessRegistrationHelper: string;
  country: string;
  address: string;
  website: string;
  websiteOptional: string;
  market: string;
  marketOptional: string;
  experience: string;
  experienceOptional: string;
  phoneCountryCode: string;
  phoneNumber: string;
  email: string;
  checkboxRegisteredBusiness: string;
  checkboxCertification: string;
  checkboxInfoAccurate: string;
  checkboxTerms: string;
  termsLinkLabel: string;
  submit: string;
  submitting: string;
  errorGeneric: string;
  errorPasswordMismatch: string;
  errorRequired: string;
  legalNote: string;
  successTitle: string;
  successBody: string;
  successReferenceLabel: string;
  successNextStepsTitle: string;
  successNextSteps: string[];
  successContact: string;
  successPortalCta: string;
};

export type GrowthPartnersPageRedesignLabels = {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    headline: string;
    copy: string;
    keyPoints: GrowthPartnerKeyPoint[];
    trustStatus: string[];
    whatHappensNext: { title: string; steps: string[] };
  };
  form: GrowthPartnerFormLabels;
  split: {
    youBuild: { title: string; items: string[] };
    aipifyProvides: { title: string; items: string[] };
  };
  portalPreview: {
    title: string;
    subtitle: string;
    tabs: { leads: string; commissions: string; certification: string; resources: string };
    previewNote: string;
    leads: { heading: string; rows: Array<{ label: string; value: string }> };
    commissions: { heading: string; rows: Array<{ label: string; value: string }> };
    certification: { heading: string; modules: Array<{ name: string; status: string }> };
    resources: { heading: string; items: string[] };
  };
  journey: {
    title: string;
    steps: Array<{ title: string; description: string }>;
  };
  certification: {
    title: string;
    intro: string;
    topics: string[];
    note: string;
  };
  commission: {
    title: string;
    intro: string;
    lifecycleTitle: string;
    lifecycleStages: string[];
    exampleTitle: string;
    exampleRows: Array<{ label: string; value: string }>;
    disclaimer: string;
  };
  requirements: {
    title: string;
    cards: Array<{ title: string; body: string }>;
    checklistTitle: string;
    checklistItems: string[];
    copy: string;
  };
  businessModel: {
    title: string;
    intro: string;
    columns: Array<{ title: string; items: string[] }>;
  };
  faq: { title: string; items: Array<{ question: string; answer: string }> };
  finalCta: {
    title: string;
    subtitle: string;
    primary: string;
    secondary: string;
  };
  partnerAdvisor: PartnerAdvisorLabels;
  footerNote: string;
};

export type GrowthPartnersPageLabels = GrowthPartnersPageRedesignLabels;

export type GrowthPartnersPageContentProps = {
  labels: GrowthPartnersPageRedesignLabels;
  verificationLabels: HumanVerificationLabels;
};
