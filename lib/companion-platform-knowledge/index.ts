export * from "./types";
export * from "./route-registry";
export * from "./platform-corpus";
export * from "./permission-gate";
export * from "./pricing-bridge";
export * from "./answer-builder";
export * from "./search";
export * from "./intent-detection";
export * from "./language";
export * from "./quality-tracking";
export { detectLiveIntegrationStatusIntent } from "./integration-status-intent";
export { getConnectedIntegrationStatus } from "./integration-status-tool";
export type {
  ConnectedIntegrationStatusMetadata,
  IntegrationStatusFailureCode,
  IntegrationStatusToolResult,
} from "./integration-status-tool";

/** Stable corpus IDs for platform governance — publish changes via companionPlatformKnowledge i18n split. */
export const COMPANION_PLATFORM_KNOWLEDGE_CORPUS_VERSION = "1.0.0";
