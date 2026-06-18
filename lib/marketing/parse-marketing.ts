import type { MarketingDictionary } from "./get-marketing-context";

export function recordValues<T>(obj: Record<string, T> | undefined): T[] {
  if (!obj) return [];
  return Object.keys(obj)
    .sort((a, b) => {
      const na = Number(a);
      const nb = Number(b);
      if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
      return a.localeCompare(b);
    })
    .map((key) => obj[key]);
}

export function getSection<T>(marketing: MarketingDictionary, key: string): T {
  return (marketing[key] ?? {}) as T;
}

export function parseDemoSteps(
  marketing: MarketingDictionary
): Array<{ title: string; detail: string }> {
  const section = getSection<{ steps?: Record<string, { title: string; detail: string }> }>(
    marketing,
    "animatedDemo"
  );
  return recordValues(section.steps);
}

export function parseWorkSteps(
  marketing: MarketingDictionary
): Array<{ title: string; description: string }> {
  const section = getSection<{ steps?: Record<string, { title: string; description: string }> }>(
    marketing,
    "howItWorks"
  );
  return recordValues(section.steps).map(({ title, description }) => ({ title, description }));
}

export function parseModules(
  marketing: MarketingDictionary
): Array<{ name: string; description: string }> {
  const section = getSection<{ items?: Record<string, { name: string; description: string }> }>(
    marketing,
    "modules"
  );
  return recordValues(section.items).map(({ name, description }) => ({ name, description }));
}

export function parseTrustPoints(
  marketing: MarketingDictionary
): Array<{ title: string; description: string }> {
  const section = getSection<{ points?: Record<string, { title: string; description: string }> }>(
    marketing,
    "enterpriseTrust"
  );
  return recordValues(section.points).map(({ title, description }) => ({ title, description }));
}

export function parsePilotHighlights(marketing: MarketingDictionary): string[] {
  const section = getSection<{ highlights?: Record<string, string> }>(marketing, "pilot");
  return recordValues(section.highlights);
}

export function parseOutputs(marketing: MarketingDictionary): string[] {
  const section = getSection<{ items?: Record<string, string> }>(marketing, "outputs");
  return recordValues(section.items);
}

export function parseOversightLadder(
  marketing: MarketingDictionary
): Array<{ label: string; description: string }> {
  const section = getSection<{ ladder?: Record<string, { label: string; description: string }> }>(
    marketing,
    "humanOversight"
  );
  return recordValues(section.ladder).map(({ label, description }) => ({ label, description }));
}

const ORB_STATE_ALIASES: Record<string, string> = {
  report_ready: "attention",
  approval_required: "attention",
};

export function parseOrbStates(
  marketing: MarketingDictionary
): Record<string, { label: string; description: string }> {
  const section = getSection<{ states?: Record<string, { label: string; description: string }> }>(
    marketing,
    "companionOrb"
  );
  const raw = section.states ?? {};
  const normalized: Record<string, { label: string; description: string }> = {};

  for (const [key, value] of Object.entries(raw)) {
    const target = ORB_STATE_ALIASES[key] ?? key;
    if (!normalized[target]) normalized[target] = value;
  }

  return normalized;
}
