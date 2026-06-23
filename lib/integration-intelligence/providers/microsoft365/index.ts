export {
  MICROSOFT365_APPLICATION_KEYS,
  MICROSOFT365_HANDOFF_CAPABILITIES,
  MICROSOFT365_HANDOFF_READINESS,
  MICROSOFT365_OAUTH_PROVIDER_KEY,
  MICROSOFT365_OAUTH_SCOPES,
  isMicrosoft365ApplicationKey,
  resolveMicrosoft365HandoffAction,
  microsoft365ApplicationSupportsOperation,
} from "./connect-capabilities-audit";
export {
  buildMicrosoft365OAuthAuthorizeUrl,
  createMicrosoft365OAuthCodeChallenge,
  createMicrosoft365OAuthCodeVerifier,
  getMicrosoft365OAuthEnv,
  parseMicrosoft365OAuthTokenPayload,
  serializeMicrosoft365OAuthTokenPayload,
} from "./oauth";
export {
  buildMicrosoft365DiscoverySnapshot,
  createMicrosoft365OfficeFile,
  exchangeMicrosoft365AuthorizationCode,
  fetchMicrosoft365AccountProfile,
  openMicrosoft365DriveItem,
  uploadMicrosoft365DriveContent,
} from "./graph-client";
export {
  assertMicrosoft365HandoffPermission,
  assertMicrosoft365HandoffPermissionForRole,
  microsoft365HandoffRequiresConsent,
} from "./permissions";
export {
  createMicrosoft365ArtifactHandoffAdapter,
  microsoftExcelArtifactHandoffAdapter,
  microsoftPowerpointArtifactHandoffAdapter,
  microsoftWordArtifactHandoffAdapter,
} from "./artifact-handoff-adapter";
export {
  buildMicrosoft365ActionPreview,
  executeMicrosoft365Action,
} from "./application-orchestration-adapter";
