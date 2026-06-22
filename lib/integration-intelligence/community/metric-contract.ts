/** Generic provider metric contract — adapter populates; Core consumes without customer-specific logic. */

export type ProviderMetricSemanticMatch = "exact" | "compatible" | "proxy" | "incompatible";

export type ProviderMetricBinding = {
  source_field: string;
  source_metric: string;
  requested_metric: string;
  semantic_match: ProviderMetricSemanticMatch;
  period: string | null;
  value: number | null;
  completeness: "complete" | "partial" | "empty";
  confidence: "high" | "moderate" | "low";
  warnings: string[];
};

export function canPresentMetricBindingAsDirectAnswer(
  binding: ProviderMetricBinding | null | undefined,
): binding is ProviderMetricBinding {
  if (!binding) return false;
  if (binding.value === null) return false;
  return binding.semantic_match === "exact" || binding.semantic_match === "compatible";
}

export function resolveMetricBindingForRequest(input: {
  bindings: readonly ProviderMetricBinding[];
  requested_metric: string | null;
  period?: string | null;
}): ProviderMetricBinding | null {
  if (input.bindings.length === 0) return null;

  const candidates = input.bindings.filter((binding) => {
    if (input.requested_metric && binding.requested_metric !== input.requested_metric) {
      return false;
    }
    if (input.period && binding.period && binding.period !== input.period) {
      return false;
    }
    return true;
  });

  const direct = candidates.find((binding) => canPresentMetricBindingAsDirectAnswer(binding));
  if (direct) return direct;

  if (input.requested_metric) {
    return candidates[0] ?? null;
  }

  return candidates.find((binding) => canPresentMetricBindingAsDirectAnswer(binding)) ?? candidates[0] ?? null;
}

export function selectPresentableMetricBinding(
  bindings: readonly ProviderMetricBinding[],
): ProviderMetricBinding | null {
  return bindings.find((binding) => canPresentMetricBindingAsDirectAnswer(binding)) ?? null;
}
