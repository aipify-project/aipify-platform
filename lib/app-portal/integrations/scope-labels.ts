/** Resolves integration scope IDs to customer-facing labels without changing API scope values. */
export function resolveIntegrationScopeLabel(
  scope: string,
  scopeDescriptions: Record<string, string>,
  unknownFallback: string,
): string {
  const trimmed = scope.trim();
  if (!trimmed) return unknownFallback;

  const candidates = [
    trimmed,
    trimmed.toLowerCase(),
    trimmed.replace(/\./g, "_"),
    trimmed.toLowerCase().replace(/\./g, "_"),
  ];

  for (const candidate of candidates) {
    const label = scopeDescriptions[candidate];
    if (label) return label;
  }

  return unknownFallback;
}
