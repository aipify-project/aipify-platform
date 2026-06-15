import type { BillingPath, EnterpriseOnboardingAction, EnterpriseProcurementMethod } from "./constants";

export type BillingExperienceLabels = {
  principle: string;
  commercialPrinciple: {
    instant: string;
    enterprise: string;
    footer: string;
  };
  instantActivation: {
    title: string;
    description: string;
    message: string;
    activateWith: string;
    checkout: string;
    checkingOut: string;
  };
  enterpriseProcurement: {
    title: string;
    description: string;
    message: string;
    manageLink: string;
    supportedMethodsLabel: string;
    methods: Record<EnterpriseProcurementMethod, string>;
    actions: Record<EnterpriseOnboardingAction, string>;
  };
  smartRouting: {
    title: string;
    instant: { label: string; description: string };
    enterprise: { label: string; description: string };
  };
};

export type BillingPathSelection = BillingPath | "";
