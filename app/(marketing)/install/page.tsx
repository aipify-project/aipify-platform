import type { Metadata } from "next";
import WebAppInstallPageContent from "@/components/marketing/install/WebAppInstallPageContent";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getPublicKnowledgeFaqs } from "@/lib/marketing/knowledge/load";
import { buildPwaInstallLabels } from "@/lib/pwa/labels";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["pwa"]);
  const t = createTranslator(dict);
  return {
    title: t("pwa.installPage.metaTitle"),
    description: t("pwa.installPage.metaDescription"),
    alternates: { canonical: "/install" },
  };
}

function flattenInstallPageLabels(t: ReturnType<typeof createTranslator>): Record<string, string> {
  const prefix = "pwa.installPage";
  const keys = [
    "heroTitle",
    "heroSubtitle",
    "whatIsTitle",
    "whatIsBody",
    "benefitsTitle",
    "devicesTitle",
    "instructionsTitle",
    "securityTitle",
    "securityBody",
    "offlineTitle",
    "offlineBody",
    "updatesTitle",
    "updatesBody",
    "removeTitle",
    "removeBody",
    "faqTitle",
    "faqIntro",
    "viewAllFaqs",
    "finalCtaTitle",
    "finalCtaBody",
    "supportStates.supported",
    "supportStates.limited",
    "supportStates.unsupported",
    "platforms.chromeDesktop.title",
    "platforms.chromeDesktop.state",
    "platforms.chromeDesktop.steps.1",
    "platforms.chromeDesktop.steps.2",
    "platforms.chromeDesktop.steps.3",
    "platforms.android.title",
    "platforms.android.state",
    "platforms.android.steps.1",
    "platforms.android.steps.2",
    "platforms.android.steps.3",
    "platforms.apple.title",
    "platforms.apple.state",
    "platforms.apple.steps.1",
    "platforms.apple.steps.2",
    "platforms.apple.steps.3",
  ];
  return Object.fromEntries(keys.map((key) => [key, t(`${prefix}.${key}`)]));
}

export default async function InstallPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["pwa"]);
  const t = createTranslator(dict);
  const { marketing } = await getMarketingContext();
  const labels = buildPwaInstallLabels(t);
  const page = flattenInstallPageLabels(t);
  const faqs = getPublicKnowledgeFaqs(marketing, "installing-aipify-web-app");

  return <WebAppInstallPageContent labels={labels} page={page} faqs={faqs} />;
}
