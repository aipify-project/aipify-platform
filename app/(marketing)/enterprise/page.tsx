import type { Metadata } from "next";
import {
  EnterpriseBuyerFitSection,
  EnterpriseBuyerValueSection,
  EnterpriseCtaBand,
  EnterpriseReadinessSection,
  HumanApprovalModelSection,
  ImplementationJourneySection,
  MarketingDifferentiationStrip,
  MarketingPageHeader,
  PlatformDifferentiationSection,
  TrustedPurchaseExperienceSection,
} from "@/components/marketing";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import {
  getSection,
  parseEnterpriseCtaLabels,
  parseJourneySteps,
  parseProcurementQuestions,
  parseStringList,
} from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const meta = getSection<{ enterpriseTitle?: string; enterpriseDescription?: string }>(marketing, "meta");
  return { title: meta.enterpriseTitle, description: meta.enterpriseDescription };
}

export default async function EnterprisePage() {
  const { marketing } = await getMarketingContext();
  const enterprisePage = getSection<Record<string, string>>(marketing, "enterprisePage");
  const enterpriseCta = parseEnterpriseCtaLabels(marketing);

  return (
    <>
      <MarketingPageHeader
        title={enterprisePage.title ?? ""}
        subtitleLines={parseStringList(marketing, "enterprisePage", "subtitleLines")}
      />

      <EnterpriseBuyerFitSection
        title={getSection<{ title?: string }>(marketing, "enterpriseBuyerFit").title ?? ""}
        audiences={parseStringList(marketing, "enterpriseBuyerFit", "audiences")}
      />

      <PlatformDifferentiationSection
        title={getSection<{ title?: string }>(marketing, "procurementQuestions").title ?? ""}
        items={parseProcurementQuestions(marketing)}
      />

      <EnterpriseReadinessSection
        title={getSection<{ title?: string }>(marketing, "enterpriseSecuritySummary").title ?? ""}
        items={parseStringList(marketing, "enterpriseSecuritySummary", "items")}
      />

      <HumanApprovalModelSection
        title={getSection<{ title?: string }>(marketing, "humanApprovalModel").title ?? ""}
        statements={parseStringList(marketing, "humanApprovalModel", "statements")}
      />

      <EnterpriseBuyerValueSection
        sectionId="executive-buyer-section"
        title={getSection<{ title?: string }>(marketing, "executiveBuyer").title ?? ""}
        items={parseStringList(marketing, "executiveBuyer", "items")}
      />

      <EnterpriseBuyerValueSection
        sectionId="it-buyer-section"
        title={getSection<{ title?: string }>(marketing, "itBuyer").title ?? ""}
        items={parseStringList(marketing, "itBuyer", "items")}
        muted
      />

      <EnterpriseBuyerValueSection
        sectionId="operations-buyer-section"
        title={getSection<{ title?: string }>(marketing, "operationsBuyer").title ?? ""}
        items={parseStringList(marketing, "operationsBuyer", "items")}
      />

      <ImplementationJourneySection
        title={getSection<{ title?: string }>(marketing, "implementationExpectations").title ?? ""}
        steps={parseJourneySteps(marketing, "implementationExpectations")}
      />

      <TrustedPurchaseExperienceSection
        title={getSection<{ title?: string }>(marketing, "trustedPurchaseExperience").title ?? ""}
        intro={getSection<{ intro?: string }>(marketing, "trustedPurchaseExperience").intro ?? ""}
        steps={parseStringList(marketing, "trustedPurchaseExperience", "steps")}
      />

      <MarketingDifferentiationStrip themes={parseStringList(marketing, "differentiationStrip", "themes")} />

      <EnterpriseCtaBand {...enterpriseCta} />
    </>
  );
}
