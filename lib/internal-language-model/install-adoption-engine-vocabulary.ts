export const INSTALL_ADOPTION_MISSION =
  "Reduce friction during onboarding and accelerate time-to-value through intelligent installation, discovery and adoption experiences.";

export const INSTALL_ADOPTION_PHILOSOPHY =
  "The easiest systems to adopt are the systems that understand their environment.";

export const INSTALL_ADOPTION_ABOS_PRINCIPLE =
  "Technology should adapt to people. People should not be forced to adapt entirely to technology.";

export const INSTALL_ADOPTION_VISION_PHRASES = [
  "It understood us.",
  "It helped us quickly.",
  "It became part of how we work.",
] as const;

export function getInstallAdoptionEngineVocabulary() {
  return {
    mission: INSTALL_ADOPTION_MISSION,
    philosophy: INSTALL_ADOPTION_PHILOSOPHY,
    abosPrinciple: INSTALL_ADOPTION_ABOS_PRINCIPLE,
    visionPhrases: INSTALL_ADOPTION_VISION_PHRASES,
  };
}
