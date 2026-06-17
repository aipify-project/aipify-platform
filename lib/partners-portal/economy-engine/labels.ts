import type { GrowthPartnerEconomyLabels } from "./types";
import type { Translator } from "@/lib/i18n/translate";

export function buildGrowthPartnerEconomyLabels(t: Translator): GrowthPartnerEconomyLabels {
  const p = "partnersPortal.economyEngine";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    principle: t(`${p}.principle`),
    oneTimeNote: t(`${p}.oneTimeNote`),
    noCompanyTitle: t(`${p}.noCompanyTitle`),
    noCompanyBody: t(`${p}.noCompanyBody`),
    createBusinessCta: t(`${p}.createBusinessCta`),
    norwayGuidance: t(`${p}.norwayGuidance`),
    brregLink: t(`${p}.brregLink`),
    accessDenied: t(`${p}.accessDenied`),
    sections: {
      overview: t(`${p}.sections.overview`),
      salesHistory: t(`${p}.sections.salesHistory`),
      commissionHistory: t(`${p}.sections.commissionHistory`),
      commissionTier: t(`${p}.sections.commissionTier`),
      milestones: t(`${p}.sections.milestones`),
      pendingSettlements: t(`${p}.sections.pendingSettlements`),
      settlementHistory: t(`${p}.sections.settlementHistory`),
      invoices: t(`${p}.sections.invoices`),
      companyInfo: t(`${p}.sections.companyInfo`),
      bankDetails: t(`${p}.sections.bankDetails`),
      agreements: t(`${p}.sections.agreements`),
    },
    tier: {
      current: t(`${p}.tier.current`),
      salesCount: t(`${p}.tier.salesCount`),
      ladderNote: t(`${p}.tier.ladderNote`),
    },
    settlement: {
      prepare: t(`${p}.settlement.prepare`),
      approve: t(`${p}.settlement.approve`),
      approvalStatement: t(`${p}.settlement.approvalStatement`),
      approveSuccess: t(`${p}.settlement.approveSuccess`),
      prepareSuccess: t(`${p}.settlement.prepareSuccess`),
      reviewDetails: t(`${p}.settlement.reviewDetails`),
    },
    agreements: {
      growthPartner: t(`${p}.agreements.growthPartner`),
      selfBilling: t(`${p}.agreements.selfBilling`),
      partnerTerms: t(`${p}.agreements.partnerTerms`),
      accept: t(`${p}.agreements.accept`),
      acceptSuccess: t(`${p}.agreements.acceptSuccess`),
    },
    onboarding: {
      companyType: t(`${p}.onboarding.companyType`),
      companyName: t(`${p}.onboarding.companyName`),
      organizationNumber: t(`${p}.onboarding.organizationNumber`),
      vatNumber: t(`${p}.onboarding.vatNumber`),
      vatRegistered: t(`${p}.onboarding.vatRegistered`),
      address: t(`${p}.onboarding.address`),
      bankAccount: t(`${p}.onboarding.bankAccount`),
      submit: t(`${p}.onboarding.submit`),
    },
    companyTypes: {
      norwegian_as: t(`${p}.companyTypes.norwegianAs`),
      norwegian_enk: t(`${p}.companyTypes.norwegianEnk`),
      foreign_equivalent: t(`${p}.companyTypes.foreignEquivalent`),
    },
    faq: {
      title: t(`${p}.faq.title`),
      notEmployee: t(`${p}.faq.notEmployee`),
      notEmployeeAnswer: t(`${p}.faq.notEmployeeAnswer`),
      recurring: t(`${p}.faq.recurring`),
      recurringAnswer: t(`${p}.faq.recurringAnswer`),
      selfBilling: t(`${p}.faq.selfBilling`),
      selfBillingAnswer: t(`${p}.faq.selfBillingAnswer`),
    },
  };
}
