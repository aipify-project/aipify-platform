import { PlatformCustomerSuccessHubPanel } from "@/components/platform/platform-customer-success-hub";
import { buildPlatformCustomerSuccessHubLabels } from "@/lib/platform-customer-success-hub";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformCustomerSuccessOnboardingPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <PlatformCustomerSuccessHubPanel
      backHref="/platform/customer-success"
      initialTab="onboarding"
      visibleTabs={["overview", "onboarding", "guidance", "risks", "companion_insights"]}
      titleOverride={t("platform.customerSuccessHub.onboardingPage.title")}
      subtitleOverride={t("platform.customerSuccessHub.onboardingPage.subtitle")}
      labels={buildPlatformCustomerSuccessHubLabels(t)}
    />
  );
}
