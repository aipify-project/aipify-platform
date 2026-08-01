import { buildOnboardingMessageCatalog } from "@/lib/app-portal/integrations/labels";
import type { Translator } from "@/lib/i18n/translate";
import { buildPlatformProviderOnboardingLabels } from "./admin-labels";
import type { PlatformProviderOnboardingLabels } from "./label-types";

export type { PlatformProviderOnboardingLabels, ProviderAdminStatusLabels } from "./label-types";

export type PlatformProviderOnboardingPanelSerializableProps = {
  labels: PlatformProviderOnboardingLabels;
  messageCatalog: Record<string, string>;
};

export function buildPlatformProviderOnboardingPanelProps(
  t: Translator
): PlatformProviderOnboardingPanelSerializableProps {
  return {
    messageCatalog: buildOnboardingMessageCatalog(t),
    labels: buildPlatformProviderOnboardingLabels(t),
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
  JSON.parse(JSON.stringify(value));
}
