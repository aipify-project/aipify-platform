import { INSTALL_API_PREFIX, type DetectedSystem, type WorkflowArea } from "@/lib/install";

export type ContextScanResult = {
  systems: DetectedSystem[];
  workflows: WorkflowArea[];
  pageSignals: string[];
};

/** Layer 3 — lightweight environment signals for discovery (scaffold). */
export function scanPageContext(): ContextScanResult {
  if (typeof window === "undefined") {
    return { systems: [], workflows: [], pageSignals: [] };
  }

  const signals: string[] = [];
  const systems: DetectedSystem[] = [];
  const html = document.documentElement.innerHTML.toLowerCase();

  if (html.includes("shopify")) {
    systems.push("shopify");
    signals.push("shopify_detected");
  }
  if (html.includes("woocommerce")) {
    systems.push("woocommerce");
    signals.push("woocommerce_detected");
  }
  if (html.includes("wp-content")) {
    systems.push("wordpress");
    signals.push("wordpress_detected");
  }
  if (html.includes("stripe")) {
    systems.push("stripe");
    signals.push("stripe_detected");
  }

  return {
    systems,
    workflows: systems.length ? ["customer_support", "billing"] : [],
    pageSignals: signals,
  };
}

export const DISCOVERY_ENDPOINT = `${INSTALL_API_PREFIX}/discover`;
