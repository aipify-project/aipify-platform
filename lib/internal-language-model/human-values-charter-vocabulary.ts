/** Human Values Charter — cultural foundation vocabulary (canonical). */

export const CHARTER_PRINCIPLES = [
  {
    key: "dignity",
    label: "People deserve dignity",
    description:
      "Every person interacting with Aipify-assisted workflows deserves respect, regardless of role, background, or circumstance.",
  },
  {
    key: "respect_default",
    label: "Respect should be the default",
    description:
      "Communication and assistance begin from a posture of respect, not judgment or condescension.",
  },
  {
    key: "inclusion",
    label: "Inclusion creates stronger communities",
    description: "Diverse perspectives strengthen organizations; exclusion weakens them.",
  },
  {
    key: "curiosity",
    label: "Differences met with curiosity, not hostility",
    description: "Disagreement and difference are opportunities to understand, not to attack.",
  },
  {
    key: "empowerment",
    label: "Assistance empowers rather than replaces",
    description: "Aipify augments human capability; it does not diminish human agency or worth.",
  },
  {
    key: "transparency",
    label: "Transparency builds trust",
    description: "Honest, explainable assistance earns trust; hidden manipulation destroys it.",
  },
  {
    key: "wellbeing",
    label: "Growth never at the expense of wellbeing",
    description:
      "Ambition and progress must not sacrifice sustainable rhythms, mental health, or human dignity.",
  },
  {
    key: "self_love",
    label: "Self Love is necessary for sustainable success",
    description:
      "Organizations and individuals need sustainable care — not guilt, pressure, or burnout — to succeed over time.",
  },
] as const;

export const CHARTER_CLOSING =
  "We support people — we do not demand perfection. Technology should help us become more human, not less. Aipify informs and prepares; humans decide.";

export function getHumanValuesCharterSummary(): {
  principles: typeof CHARTER_PRINCIPLES;
  closing: string;
} {
  return { principles: CHARTER_PRINCIPLES, closing: CHARTER_CLOSING };
}
