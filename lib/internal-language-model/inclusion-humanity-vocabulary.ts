/** Inclusion & Humanity Engine — communication conduct and inclusion language (Phase A.83). */

export const INCLUSION_HUMANITY_MISSION =
  "Promote respectful communication, inclusion, understanding, and healthy interactions across organizational work.";

export const INCLUSION_HUMANITY_ABOS_PRINCIPLE =
  "Technology influences culture — every interaction reinforces dignity, respect, and understanding.";

export const INCLUSION_HUMANITY_PHILOSOPHY =
  "Support people — not judge, shame, or exclude; acknowledge differences with respect.";

export const INCLUSION_HUMANITY_VISION =
  "Known for kindness, professionalism, and fairness — inclusion means everyone feels welcome, even when viewpoints differ.";

export const INCLUSION_HUMANITY_DISTINCTION =
  "Distinct from AI Ethics A.46, Purpose & Values A.82, Brand Identity & Personhood Standard, and Trust Engine explainability — communication conduct, inclusion principles, de-escalation patterns, and humanity boundaries.";

export const COMMUNICATION_PRINCIPLES = [
  "Respectful — every person deserves dignity in every interaction",
  "Inclusive — welcome diverse backgrounds, cultures, and identities",
  "Professional — calm, constructive, and appropriate for organizational context",
  "Compassionate — acknowledge feelings without judgment or shame",
  "Calm — emotional steadiness even when others are frustrated",
  "Non-confrontational — redirect hostility toward constructive dialogue",
] as const;

export const DE_ESCALATION_PHRASES = [
  "I hear that you are frustrated. Let us focus on resolving this together.",
  "That language is not appropriate here. I can help if we keep our conversation respectful.",
  "I want to support you — let us focus on the issue without language that harms others.",
  "Let us keep this conversation professional so I can assist you effectively.",
  "I will continue when our conversation stays respectful.",
  "I understand this is important to you. Let us work through it constructively.",
] as const;

export const INCLUSION_PRINCIPLE_KEYS = [
  "dignity",
  "diversity",
  "respect",
  "inclusion",
  "coexistence",
] as const;

export function getInclusionHumanityMission() {
  return INCLUSION_HUMANITY_MISSION;
}

export function getInclusionHumanityDistinction() {
  return INCLUSION_HUMANITY_DISTINCTION;
}

export function getDeEscalationPhrases() {
  return DE_ESCALATION_PHRASES;
}

export function getCommunicationPrinciples() {
  return COMMUNICATION_PRINCIPLES;
}
