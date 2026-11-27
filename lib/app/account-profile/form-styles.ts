/**
 * Visual tokens aligned with registration step 1 «Kontoeier»
 * (`AuthLayout` white card + `RegistrationWizard` field rhythm).
 * Keep APP profile in the same form family — do not invent a third style.
 */

/** Outer white form surface matching AuthLayout card. */
export const ACCOUNT_PROFILE_FORM_CARD_CLASS =
  "mx-auto w-full max-w-[40rem] rounded-[28px] border border-[rgba(96,82,176,.15)] bg-white p-6 shadow-[0_12px_30px_rgba(38,33,87,.07)] sm:p-8";

/** Label above each field — same weight/size as RegistrationWizard. */
export const ACCOUNT_PROFILE_LABEL_CLASS = "block text-sm font-medium text-gray-700";

/** Editable input / select — matches RegistrationWizard `inputClass`. */
export const ACCOUNT_PROFILE_INPUT_CLASS =
  "mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100";

/** Read-only value surface inside the same form card (not a separate mini-card). */
export const ACCOUNT_PROFILE_READONLY_VALUE_CLASS =
  "mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900";

/** Helper / lock explanation under a field. */
export const ACCOUNT_PROFILE_HINT_CLASS = "mt-1.5 text-xs leading-relaxed text-gray-500";

/** Primary save — bottom-right of the card. */
export const ACCOUNT_PROFILE_PRIMARY_BUTTON_CLASS =
  "inline-flex min-h-11 items-center justify-center rounded-xl bg-[#7C3AED] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-60";

/** Secondary cancel. */
export const ACCOUNT_PROFILE_SECONDARY_BUTTON_CLASS =
  "inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60";

/** In-card navigation / request-change control. */
export const ACCOUNT_PROFILE_LINK_BUTTON_CLASS =
  "inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-[#7C3AED] transition hover:border-violet-300 hover:bg-violet-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-100";
