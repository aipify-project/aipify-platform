import { isAppProductContextId, type AppProductContextId } from "./constants";

export type AccountSettingsParent = AppProductContextId | "account";

/** Shared account pages keep the product the user is in. A missing cookie stays on Account. */
export function accountSettingsParent(cookieValue: string | null | undefined): AccountSettingsParent {
  if (isAppProductContextId(cookieValue)) return cookieValue;
  return "account";
}
