/** RSI ethical boundaries — enforced in product copy and API behavior. */
export const RSI_ETHICAL_BOUNDARIES = [
  "Never impersonate the user",
  "Never send personal messages automatically",
  "Never manipulate relationships",
  "Never create artificial emotional dependency",
  "Never pressure the user into action",
  "Suggestions only — you always decide",
] as const;

export function isAutomatedMessagingAllowed(): false {
  return false;
}
