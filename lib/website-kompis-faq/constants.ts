import { FAQ_CONTENT_LANGUAGE_CODES } from "@/lib/website-kompis-faq/content-languages";

export const WPKF_CONTENT_TYPES = [
  "faq",
  "opening_hours",
  "holiday_notice",
  "contact",
  "policy",
  "product_info",
  "service_info",
  "link",
] as const;

export type WpkfContentType = (typeof WPKF_CONTENT_TYPES)[number];

export const WPKF_STATUSES = ["draft", "published", "archived"] as const;

export type WpkfStatus = (typeof WPKF_STATUSES)[number];

export const WPKF_LOCALES = FAQ_CONTENT_LANGUAGE_CODES;

export const WPKF_TITLE_MAX_LENGTH = 200;
export const WPKF_QUESTION_MAX_LENGTH = 500;
export const WPKF_ANSWER_MAX_LENGTH = 4000;
export const WPKF_CATEGORY_MAX_LENGTH = 100;
export const WPKF_SOURCE_URL_MAX_LENGTH = 500;
export const WPKF_TAG_MAX_LENGTH = 50;
export const WPKF_MAX_TAGS = 20;
export const WPKF_QUERY_MAX_LENGTH = 200;
export const WPKF_LIST_LIMIT_DEFAULT = 100;
