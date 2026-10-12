import {
  APP_PRODUCT_CONTEXT_IDS,
  isAppProductContextId,
  type AppProductContextId,
} from "@/lib/app-portal/product-context/constants";
import { inferProductContextFromPathname } from "@/lib/app-portal/product-context/infer-from-pathname";
import type { AccessControlPlaneSnapshot, AccessReasonCode } from "./types";

export type AuthorizeProductContextResult = {
  activeProduct: AppProductContextId | null;
  availableProducts: AppProductContextId[];
  reasonCode: AccessReasonCode;
  /** Path requested a product the server did not authorize. */
  pathDenied: boolean;
  /** Cookie suggested a product but was ignored (preference only). */
  cookieIgnored: boolean;
};

/**
 * Cookie is preference only. Path identifies intent. Server snapshot authorizes.
 */
export function authorizeProductContext(input: {
  snapshot: AccessControlPlaneSnapshot;
  pathname?: string | null;
  cookieValue?: string | null;
}): AuthorizeProductContextResult {
  const availableProducts = APP_PRODUCT_CONTEXT_IDS.filter((id) =>
    input.snapshot.authorizedProductIds.includes(id)
  );

  if (availableProducts.length === 0) {
    return {
      activeProduct: null,
      availableProducts: [],
      reasonCode: input.snapshot.membershipValid ? "fail_closed" : "membership_missing",
      pathDenied: Boolean(input.pathname && inferProductContextFromPathname(input.pathname)),
      cookieIgnored: isAppProductContextId(input.cookieValue),
    };
  }

  const fromPath = input.pathname ? inferProductContextFromPathname(input.pathname) : null;
  if (fromPath) {
    if (availableProducts.includes(fromPath)) {
      return {
        activeProduct: fromPath,
        availableProducts,
        reasonCode: "ok",
        pathDenied: false,
        cookieIgnored:
          isAppProductContextId(input.cookieValue) && input.cookieValue !== fromPath,
      };
    }
    return {
      activeProduct: availableProducts[0] ?? null,
      availableProducts,
      reasonCode: "path_not_authorized",
      pathDenied: true,
      cookieIgnored: true,
    };
  }

  if (isAppProductContextId(input.cookieValue)) {
    if (availableProducts.includes(input.cookieValue)) {
      return {
        activeProduct: input.cookieValue,
        availableProducts,
        reasonCode: "ok",
        pathDenied: false,
        cookieIgnored: false,
      };
    }
    return {
      activeProduct: availableProducts[0] ?? null,
      availableProducts,
      reasonCode: "cookie_not_authorization",
      pathDenied: false,
      cookieIgnored: true,
    };
  }

  return {
    activeProduct: availableProducts[0] ?? null,
    availableProducts,
    reasonCode: "ok",
    pathDenied: false,
    cookieIgnored: false,
  };
}

/** Direct URL / API helper — capability usable only when activation gate passed. */
export function isModuleUsableInSnapshot(
  snapshot: AccessControlPlaneSnapshot,
  capabilityKey: string
): boolean {
  const mod = snapshot.modules.find((m) => m.capabilityKey === capabilityKey);
  return mod?.usable === true && mod.visible === true;
}
