/** Convert a dotted i18n key into professional display text when translation is missing. */
export function humanizeTranslationKey(key: string): string {
  const overrides: Record<string, string> = {
    "superAdmin.modules.academyStudio": "Aipify Academy Studio",
    "superAdmin.modules.academyStudioDescription":
      "Create certification programs, onboarding experiences, and internal learning journeys.",
    "superAdmin.academyStudio.title": "Aipify Academy Studio",
    "superAdmin.academyStudio.emptyState":
      "No learning content available yet. Create certification programs and onboarding journeys for your ecosystem.",
  };

  if (overrides[key]) return overrides[key];

  const last = key.split(".").pop() ?? key;
  return last
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
