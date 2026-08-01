import { buildOnboardingMessageCatalog } from "@/lib/app-portal/integrations/labels";
import type { Translator } from "@/lib/i18n/translate";

export type PlatformProviderOnboardingLabels = {
  title: string;
  subtitle: string;
  loading: string;
  loadFailed: string;
  pageLoadFailed: string;
  retry: string;
  goBack: string;
  providers: string;
  fixtures: string;
  save: string;
  saved: string;
  invalidContract: string;
  invalidContractBody: string;
  partialLoadWarning: string;
  openContract: string;
  contactAdmin: string;
  technicalReference: string;
  denied: string;
  advancedEditor: string;
  selectProvider: string;
  available: string;
  unavailable: string;
  preview: string;
  backHref: string;
};

export type PlatformProviderOnboardingPanelSerializableProps = {
  labels: PlatformProviderOnboardingLabels;
  messageCatalog: Record<string, string>;
};

/**
 * Build Client Component props for Platform provider onboarding.
 * Must remain JSON-serializable — never include translator/functions (RSC → client).
 */
export function buildPlatformProviderOnboardingPanelProps(
  t: Translator
): PlatformProviderOnboardingPanelSerializableProps {
  return {
    messageCatalog: buildOnboardingMessageCatalog(t),
    labels: {
      title: t("platform.providerOnboarding.title"),
      subtitle: t("platform.providerOnboarding.subtitle"),
      loading: t("platform.providerOnboarding.loading"),
      loadFailed: t("platform.providerOnboarding.loadFailed"),
      pageLoadFailed: t("platform.providerOnboarding.pageLoadFailed"),
      retry: t("platform.providerOnboarding.retry"),
      goBack: t("platform.providerOnboarding.goBack"),
      providers: t("platform.providerOnboarding.providers"),
      fixtures: t("platform.providerOnboarding.fixtures"),
      save: t("platform.providerOnboarding.save"),
      saved: t("platform.providerOnboarding.saved"),
      invalidContract: t("platform.providerOnboarding.invalidContract"),
      invalidContractBody: t("platform.providerOnboarding.invalidContractBody"),
      partialLoadWarning: t("platform.providerOnboarding.partialLoadWarning"),
      openContract: t("platform.providerOnboarding.openContract"),
      contactAdmin: t("platform.providerOnboarding.contactAdmin"),
      technicalReference: t("platform.providerOnboarding.technicalReference"),
      denied: t("platform.providerOnboarding.denied"),
      advancedEditor: t("platform.providerOnboarding.advancedEditor"),
      selectProvider: t("platform.providerOnboarding.selectProvider"),
      available: t("platform.providerOnboarding.available"),
      unavailable: t("platform.providerOnboarding.unavailable"),
      preview: t("platform.providerOnboarding.preview"),
      backHref: "/platform",
    },
  };
}

/** Detect the Production crash class: functions passed across the RSC client boundary. */
export function assertSerializableClientProps(value: unknown): void {
  const seen = new WeakSet<object>();
  const walk = (node: unknown, path: string): void => {
    if (typeof node === "function") {
      throw new Error(
        `Functions cannot be passed directly to Client Components (${path})`
      );
    }
    if (node === null || typeof node !== "object") return;
    if (seen.has(node as object)) return;
    seen.add(node as object);
    if (Array.isArray(node)) {
      node.forEach((item, index) => walk(item, `${path}[${index}]`));
      return;
    }
    for (const [key, child] of Object.entries(node as Record<string, unknown>)) {
      walk(child, path ? `${path}.${key}` : key);
    }
  };
  walk(value, "props");
  // Also ensure JSON round-trip (Date/Map/etc. would fail here if introduced).
  JSON.parse(JSON.stringify(value));
}
