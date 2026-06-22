import type { ProviderMetricBinding } from "./metric-contract";
import {
  canPresentMetricBindingAsDirectAnswer,
  resolveMetricBindingForRequest,
} from "./metric-contract";

/** Generic requested-metric alias groups — adapters supply maps; Core resolves bindings. */
export function resolveMetricBindingForRequestWithAliases(input: {
  bindings: readonly ProviderMetricBinding[];
  requested_metric: string | null;
  period?: string | null;
  metric_aliases?: Readonly<Record<string, readonly string[]>>;
}): ProviderMetricBinding | null {
  if (!input.requested_metric) {
    return resolveMetricBindingForRequest({
      bindings: input.bindings,
      requested_metric: null,
      period: input.period,
    });
  }

  const aliases = input.metric_aliases?.[input.requested_metric] ?? [input.requested_metric];

  for (const alias of aliases) {
    const match = resolveMetricBindingForRequest({
      bindings: input.bindings,
      requested_metric: alias,
      period: input.period,
    });
    if (match && canPresentMetricBindingAsDirectAnswer(match)) {
      return match;
    }
    if (match) {
      return match;
    }
  }

  return null;
}

export function hasExactPresentableBinding(
  bindings: readonly ProviderMetricBinding[],
): boolean {
  return bindings.some(
    (binding) => binding.semantic_match === "exact" && binding.value !== null,
  );
}

export function hasPresentableBinding(
  bindings: readonly ProviderMetricBinding[],
): boolean {
  return bindings.some((binding) => canPresentMetricBindingAsDirectAnswer(binding));
}
