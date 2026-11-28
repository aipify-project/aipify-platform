/**
 * Shared public marketing form chrome.
 * Certified Sales Partner apply and Contact support use the same design family.
 */

export const AipifyPublicFormClasses = {
  panel:
    "w-full rounded-2xl border border-aipify-border bg-aipify-surface p-6 shadow-sm sm:p-8",
  title: "text-xl font-semibold text-aipify-text",
  subtitle: "mt-2 text-sm leading-relaxed text-aipify-text-secondary",
  formStack: "relative mt-6 grid gap-4",
  field: "block text-sm text-aipify-text",
  label: "font-medium",
  input:
    "mt-1 w-full rounded-xl border border-aipify-border bg-white px-3 py-2.5 text-aipify-text focus:outline-none focus:ring-2 focus:ring-aipify-focus disabled:cursor-not-allowed disabled:opacity-60",
  hint: "mt-1 block text-xs leading-relaxed text-aipify-text-muted",
  infoBox:
    "flex items-start gap-2.5 rounded-xl border border-aipify-border bg-aipify-canvas px-4 py-3 text-sm",
  noticeWarning:
    "rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950",
  noticeSuccess:
    "rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-950",
  submit:
    "inline-flex w-full items-center justify-center rounded-xl bg-[color:var(--aipify-companion-purple)] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto",
  submitQuiet:
    "inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl border border-aipify-border bg-aipify-surface px-5 py-3 text-sm font-semibold text-aipify-text opacity-70 sm:w-auto",
  footerRule: "border-t border-aipify-border pt-4",
  link: "text-sm font-semibold text-aipify-companion hover:underline",
} as const;
