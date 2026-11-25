/**
 * Pure URL builders for cross-device recovery — no service-role dependency.
 */

import {
  AUTH_REDIRECT_PATHS,
  buildAuthRedirectUrl,
  type ResolveAuthAppOriginOptions,
} from "@/lib/auth/auth-redirect-urls";

/** Build absolute callback URL that uses token_hash (cross-device safe). */
export function buildTokenHashRecoveryUrl(
  tokenHash: string,
  options: ResolveAuthAppOriginOptions & { nextPath?: string } = {},
): string {
  const next = options.nextPath ?? AUTH_REDIRECT_PATHS.updatePassword;
  const params = new URLSearchParams({
    token_hash: tokenHash,
    type: "recovery",
    next,
  });
  return buildAuthRedirectUrl(AUTH_REDIRECT_PATHS.callback, params.toString(), options);
}
