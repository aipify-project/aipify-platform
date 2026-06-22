import { UNONIGHT_INTEGRATION_MANIFEST } from "./providers/unonight/manifest";

/**
 * Pilot tenant integration provider key for tests and fixtures outside Core.
 * Core must import this symbol — never hardcode customer names.
 */
export const PILOT_INTEGRATION_PROVIDER_KEY = UNONIGHT_INTEGRATION_MANIFEST.provider;
