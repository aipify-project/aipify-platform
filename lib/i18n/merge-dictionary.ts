import type { Dictionary } from "./translate";

export function mergeDictionary(base: Dictionary, override: Dictionary): Dictionary {
  const result: Dictionary = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const baseValue = base[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      baseValue &&
      typeof baseValue === "object" &&
      !Array.isArray(baseValue)
    ) {
      result[key] = mergeDictionary(baseValue as Dictionary, value as Dictionary);
    } else {
      result[key] = value;
    }
  }

  return result;
}
