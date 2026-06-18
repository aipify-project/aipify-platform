import { DEFAULT_LOCALE, type Locale } from "./config";
import { getDictionary } from "./get-dictionary";
import type { Dictionary } from "./translate";

const APP_LAYOUT_NAMESPACES = [
  "common",
  "auth",
  "dashboard",
  "branding",
  "presence",
  "license",
  "commandBar",
] as const;

/** Lightweight shell dictionary for /app layout — avoids loading full customerApp (~1.6MB). */
export async function getAppLayoutDictionary(locale: Locale = DEFAULT_LOCALE) {
  const [base, shell] = await Promise.all([
    getDictionary(locale, [...APP_LAYOUT_NAMESPACES]),
    getDictionary(locale, ["customerAppShell"]),
  ]);

  return {
    ...base,
    customerApp: shell.customerAppShell as Dictionary,
  };
}
