import type { InstallPlatformOption } from "./experience";

export type InstallGuideStep = {
  order: number;
  titleKey: string;
  bodyKey: string;
};

export type InstallKnowledgeGuide = {
  platform: InstallPlatformOption;
  titleKey: string;
  summaryKey: string;
  steps: InstallGuideStep[];
};

/** Structured guides — Support AI should prefer these (Phase 24). */
export const INSTALL_KNOWLEDGE_GUIDES: InstallKnowledgeGuide[] = [
  {
    platform: "shopify",
    titleKey: "install.modern.guides.shopify.title",
    summaryKey: "install.modern.guides.shopify.summary",
    steps: [
      { order: 1, titleKey: "install.modern.guides.shopify.steps.installApp.title", bodyKey: "install.modern.guides.shopify.steps.installApp.body" },
      { order: 2, titleKey: "install.modern.guides.shopify.steps.approve.title", bodyKey: "install.modern.guides.shopify.steps.approve.body" },
      { order: 3, titleKey: "install.modern.guides.shopify.steps.confirmStore.title", bodyKey: "install.modern.guides.shopify.steps.confirmStore.body" },
      { order: 4, titleKey: "install.modern.guides.shopify.steps.recommendations.title", bodyKey: "install.modern.guides.shopify.steps.recommendations.body" },
      { order: 5, titleKey: "install.modern.guides.shopify.steps.activate.title", bodyKey: "install.modern.guides.shopify.steps.activate.body" },
    ],
  },
  {
    platform: "wordpress",
    titleKey: "install.modern.guides.wordpress.title",
    summaryKey: "install.modern.guides.wordpress.summary",
    steps: [
      { order: 1, titleKey: "install.modern.guides.wordpress.steps.installPlugin.title", bodyKey: "install.modern.guides.wordpress.steps.installPlugin.body" },
      { order: 2, titleKey: "install.modern.guides.wordpress.steps.signIn.title", bodyKey: "install.modern.guides.wordpress.steps.signIn.body" },
      { order: 3, titleKey: "install.modern.guides.wordpress.steps.verifyDomain.title", bodyKey: "install.modern.guides.wordpress.steps.verifyDomain.body" },
      { order: 4, titleKey: "install.modern.guides.wordpress.steps.recommendations.title", bodyKey: "install.modern.guides.wordpress.steps.recommendations.body" },
      { order: 5, titleKey: "install.modern.guides.wordpress.steps.activate.title", bodyKey: "install.modern.guides.wordpress.steps.activate.body" },
    ],
  },
  {
    platform: "woocommerce",
    titleKey: "install.modern.guides.woocommerce.title",
    summaryKey: "install.modern.guides.woocommerce.summary",
    steps: [
      { order: 1, titleKey: "install.modern.guides.woocommerce.steps.installPlugin.title", bodyKey: "install.modern.guides.woocommerce.steps.installPlugin.body" },
      { order: 2, titleKey: "install.modern.guides.woocommerce.steps.connect.title", bodyKey: "install.modern.guides.woocommerce.steps.connect.body" },
      { order: 3, titleKey: "install.modern.guides.woocommerce.steps.approve.title", bodyKey: "install.modern.guides.woocommerce.steps.approve.body" },
      { order: 4, titleKey: "install.modern.guides.woocommerce.steps.recommendations.title", bodyKey: "install.modern.guides.woocommerce.steps.recommendations.body" },
      { order: 5, titleKey: "install.modern.guides.woocommerce.steps.activate.title", bodyKey: "install.modern.guides.woocommerce.steps.activate.body" },
    ],
  },
  {
    platform: "custom_website",
    titleKey: "install.modern.guides.custom.title",
    summaryKey: "install.modern.guides.custom.summary",
    steps: [
      { order: 1, titleKey: "install.modern.guides.custom.steps.addScript.title", bodyKey: "install.modern.guides.custom.steps.addScript.body" },
      { order: 2, titleKey: "install.modern.guides.custom.steps.confirmDomain.title", bodyKey: "install.modern.guides.custom.steps.confirmDomain.body" },
      { order: 3, titleKey: "install.modern.guides.custom.steps.verify.title", bodyKey: "install.modern.guides.custom.steps.verify.body" },
      { order: 4, titleKey: "install.modern.guides.custom.steps.activate.title", bodyKey: "install.modern.guides.custom.steps.activate.body" },
    ],
  },
];

export function getInstallGuide(
  platform: InstallPlatformOption
): InstallKnowledgeGuide | undefined {
  return INSTALL_KNOWLEDGE_GUIDES.find((g) => g.platform === platform);
}
