import PlatformGlobalPatternsPanel from "@/components/platform/PlatformGlobalPatternsPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function IntelligenceGlobalPatternsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform", "branding"]);
  const t = createTranslator(dict);

  return (
    <PlatformGlobalPatternsPanel
      locale={locale}
      labels={{
        title: t("platform.intelligence.globalPatterns.title"),
        subtitle: t("platform.intelligence.globalPatterns.subtitle"),
        loading: t("platform.intelligence.globalPatterns.loading"),
        empty: t("platform.intelligence.globalPatterns.empty"),
        pulseLabel: t("branding.pulseLabel"),
        category: t("platform.intelligence.globalPatterns.category"),
        confidence: t("platform.intelligence.globalPatterns.confidence"),
        detections: t("platform.intelligence.globalPatterns.detections"),
        suggestedAction: t("platform.intelligence.globalPatterns.suggestedAction"),
        sourceEnvironment: t("platform.intelligence.globalPatterns.sourceEnvironment"),
        approvedAt: t("platform.intelligence.globalPatterns.approvedAt"),
        approvedBy: t("platform.intelligence.globalPatterns.approvedBy"),
        detectedAcross: t("platform.intelligence.globalPatterns.detectedAcross"),
        potentialImpact: t("platform.intelligence.globalPatterns.potentialImpact"),
        estimatedBenefit: t("platform.intelligence.globalPatterns.estimatedBenefit"),
        supportReduction: t("platform.intelligence.globalPatterns.supportReduction"),
        failurePrevention: t("platform.intelligence.globalPatterns.failurePrevention"),
        onboardingImprovement: t("platform.intelligence.globalPatterns.onboardingImprovement"),
        privacyNote: t("platform.intelligence.privacyNote"),
      }}
    />
  );
}
