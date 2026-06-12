/**
 * API Platform Phase A.21 — re-exports full engine; scaffold constants preserved for A.39.
 * See API_PLATFORM_PHASE_A21.md and IMPLEMENTATION_BLUEPRINT_PHASE34_API_DEVELOPER_PLATFORM.md.
 */

export {
  API_PLATFORM_ENGINE_ROUTE,
  DEVELOPER_PORTAL_ROUTE,
  DEVELOPER_SETTINGS_ROUTE,
  API_PLATFORM_PERMISSION_KEYS,
  API_PLATFORM_MODULE_KEY,
} from "@/lib/core/api-platform-engine";

export * from "@/lib/aipify/api-platform-engine";

export const API_PLATFORM_A21_STATUS = "full_engine" as const;

/** @deprecated Use API platform engine routes — preserved for Enterprise Deployment A.39 */
export const DEPLOYMENT_API_PREFIX = "/api/deployment";

/** @deprecated Preserved for A.39 device enrollment integration */
export const DEVICE_ENROLLMENT_API = "/api/install/device-enroll";

/** @deprecated SCIM readiness stub for A.39 */
export const SCIM_READINESS_STUB = "/api/deployment/scim";
