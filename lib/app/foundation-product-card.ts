/**
 * Home product cards. Kompis Bedrift opens only when Core says the module is usable.
 * Unknown and false stay closed, matching the shell redirect.
 */
export function bedriftHomeCardState(available: boolean | null): "open" | "unavailable" {
  return available === true ? "open" : "unavailable";
}
