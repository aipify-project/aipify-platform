import { normalizeIntegrationQuery } from "@/lib/integration-intelligence/normalize-text";

const ORGANIZATION_DATA_SIGNAL =
  /\b(medlem|member|medlemmer|members|medlemskap|membership|medlemstall|member count|organisasjon(?:ens|s)?|organization(?:'s|s)?|support(?:sak| case| queue)?|verifisering|verification|sla|kundebase|customer directory)\b/i;

const USER_OWNED_CONTROL_SIGNAL =
  /\b(styr|styre|control|spill av|play|pause|skip|volume|musikk|music|song|sang|spilleliste|playlist|streaming|stream|lyd|audio|media account|musikkonto|musikkontoen|music account|koble til.*konto|connect.*account|koble til.*musikk|connect.*music)\b/i;

const LOCAL_DEVICE_SIGNAL =
  /\b(enhet|device|speaker|høyttaler|microphone|mikrofon|bluetooth|notification permission|varsel(?:tillatelse)?|camera|kamera|os permission|system permission|lokal tilgang|local permission)\b/i;

const EXPLICIT_MEMBER_COUNT_SIGNAL =
  /\b(hvor mange|how many|antall|medlemstall|member count)\b.*\b(medlem|member|medlemmer|members)\b|\b(medlem|member|medlemmer|members)\b.*\b(hvor mange|how many|antall|medlemstall|member count)\b|\borganisasjon(?:ens|s)?\s+medlem|\borganization(?:'s|s)?\s+member/i;

export function normalizeAuthorizationQuery(query: string): string {
  return normalizeIntegrationQuery(query);
}

export function hasOrganizationDataDomainSignal(query: string): boolean {
  const normalized = normalizeAuthorizationQuery(query);
  return ORGANIZATION_DATA_SIGNAL.test(normalized);
}

export function hasExplicitOrganizationMemberCountSignal(query: string): boolean {
  const normalized = normalizeAuthorizationQuery(query);
  return EXPLICIT_MEMBER_COUNT_SIGNAL.test(normalized);
}

export function hasOrganizationMemberDomainSignal(query: string): boolean {
  const normalized = normalizeAuthorizationQuery(query);
  return /\b(medlem|member|medlemmer|members|medlemskap|membership|medlemstall|member count)\b/i.test(
    normalized,
  );
}

export function isUserOwnedAccountControlQuery(query: string): boolean {
  const normalized = normalizeAuthorizationQuery(query);
  if (!USER_OWNED_CONTROL_SIGNAL.test(normalized)) return false;
  if (hasOrganizationDataDomainSignal(query)) return false;
  return true;
}

export function isLocalDevicePermissionQuery(query: string): boolean {
  const normalized = normalizeAuthorizationQuery(query);
  if (!LOCAL_DEVICE_SIGNAL.test(normalized)) return false;
  if (hasOrganizationDataDomainSignal(query)) return false;
  return true;
}

export function shouldBlockOrganizationCapabilityRoute(query: string): boolean {
  return isUserOwnedAccountControlQuery(query) || isLocalDevicePermissionQuery(query);
}

export function queryMentionsProviderKey(normalizedQuery: string, providerKey: string): boolean {
  const normalizedKey = normalizeAuthorizationQuery(providerKey.replace(/_/g, " "));
  if (!normalizedKey) return false;
  if (normalizedQuery.includes(normalizedKey.replace(/\s+/g, ""))) return true;
  if (normalizedQuery.includes(normalizedKey)) return true;
  const tokens = normalizedKey.split(" ").filter((token) => token.length >= 4);
  return tokens.some((token) => normalizedQuery.includes(token));
}
