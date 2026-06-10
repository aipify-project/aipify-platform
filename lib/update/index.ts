/**
 * Update Engine — safe version deployment foundation (Phase 18).
 * Platform: app/platform/updates/ · Embedded: app/api/install/version
 */
export const UPDATES_API_PREFIX = "/api/platform/updates";
export const INSTALL_VERSION_API = "/api/install/version";
export const INSTALL_UPDATE_STATUS_API = "/api/install/update-status";

export * from "./types";
export * from "./engine";
export * from "./safety";
export * from "./presence";
export * from "./rollback";
