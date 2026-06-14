const GENERIC_PROFILE_NAMES = new Set(["aipify", "user", "admin", "administrator"]);

export type ProfileHeaderDisplay = {
  primary: string;
  secondary: string | null;
  roleKey: string;
};

export function isGenericProfileName(
  profileName: string,
  companyName: string
): boolean {
  const normalized = profileName.trim().toLowerCase();
  if (!normalized || normalized === "…") return true;
  if (GENERIC_PROFILE_NAMES.has(normalized)) return true;
  return normalized === companyName.trim().toLowerCase();
}

export function resolveProfileHeaderDisplay(
  profileName: string,
  companyName: string,
  roleKey: string,
  roleLabel: string,
  workspaceName?: string | null
): ProfileHeaderDisplay {
  const workspace =
    workspaceName?.trim() &&
    workspaceName.trim().toLowerCase() !== companyName.trim().toLowerCase()
      ? workspaceName.trim()
      : null;

  if (isGenericProfileName(profileName, companyName)) {
    return {
      primary: workspace ?? companyName,
      secondary: workspace ? companyName : null,
      roleKey,
    };
  }

  return {
    primary: profileName,
    secondary: workspace ? `${roleLabel} · ${workspace}` : roleLabel,
    roleKey,
  };
}
