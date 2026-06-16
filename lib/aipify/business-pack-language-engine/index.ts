export * from "./types";
export * from "./parse";

export const BUSINESS_PACK_LANGUAGE_PRINCIPLE =
  "Multilingual by Design — every Business Pack must feel native to the customer language and region.";

export const TRANSLATION_STATUS_STYLE: Record<string, string> = {
  complete: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  partial: "bg-amber-50 text-amber-900 ring-amber-200",
  pending: "bg-gray-100 text-gray-600 ring-gray-200",
};
