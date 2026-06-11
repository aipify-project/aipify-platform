const DEVELOPER_KNOWLEDGE_PATTERNS = [
  /\b(?:aipify )?(?:developer platform|developer portal|dev portal)\b/i,
  /\b(?:aipify )?sdk\b/i,
  /\bapp manifest\b/i,
  /\bdefineAipifySkill\b/,
  /\bdefineAgentExtension\b/,
  /\bdefineWorkflowPack\b/,
  /\bdefineDashboardWidget\b/,
  /\b(?:build|publish|install|submit) (?:an? )?app\b/i,
  /\bapp ecosystem\b/i,
  /\becosystem app\b/i,
  /\bsandbox runtime\b/i,
  /\b(?:third[- ]party )?extension\b/i,
  /\bagent extension\b/i,
  /\bknowledge pack\b/i,
  /\bworkflow pack\b/i,
  /\bautomation pack\b/i,
  /\bdashboard widget\b/i,
  /\bdesktop extension\b/i,
  /\bindustry blueprint\b.*\b(?:build|extend|develop)\b/i,
  /\b(?:support|knowledge|dashboard|workflow|integration)\.(?:read|write|create|register)\b/i,
  /\bpermission(?:s)? (?:for|required|model|request)\b/i,
  /\b(?:bypass|override) (?:governance|policy engine|security|sandbox)\b/i,
  /\btenant isolation\b/i,
  /\b(?:how (?:do|can) i|can i) (?:build|publish|sell|extend) (?:apps?|extensions?|skills?|integrations?)\b/i,
  /\bmanifest validation\b/i,
  /\bsecurity review\b.*\bapp\b/i,
  /\bgovernance review\b.*\bapp\b/i,
  /\bmarketplace.*\b(?:developer|partner|publish)\b/i,
  /\b(?:verified developer|agency partner|enterprise partner)\b/i,
  /\bapp_key\b/i,
  /\brisk_level\b.*\bmanifest\b/i,
];

export function isDeveloperKnowledgeQuestion(message: string): boolean {
  const trimmed = message.trim();
  if (!trimmed) return false;
  return DEVELOPER_KNOWLEDGE_PATTERNS.some((pattern) => pattern.test(trimmed));
}
