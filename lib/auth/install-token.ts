export const INSTALL_TOKEN_PREFIX = "aipify_";

export function isInstallTokenFormat(token: string): boolean {
  return token.startsWith(INSTALL_TOKEN_PREFIX) && token.length >= 20;
}

export type VerifiedInstallation = {
  installation_id: string;
  company_id: string;
  system_type: string;
  status: string;
};
