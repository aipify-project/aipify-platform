export const LIFE_AREAS = [
  "personal",
  "family",
  "health",
  "work",
  "finance",
  "travel",
  "education",
  "home",
] as const;

export type LifeArea = (typeof LIFE_AREAS)[number];

export function isLifeArea(value: string): value is LifeArea {
  return (LIFE_AREAS as readonly string[]).includes(value);
}

export function defaultLifeAreaToggles(): Record<LifeArea, boolean> {
  return {
    personal: true,
    family: true,
    health: true,
    work: true,
    finance: true,
    travel: true,
    education: true,
    home: true,
  };
}
