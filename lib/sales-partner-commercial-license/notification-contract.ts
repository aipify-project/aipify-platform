/**
 * Capacity-limit notification — contract only.
 * Never claims delivery is live; never fabricates a purchase CTA.
 */

import { SALES_PARTNER_CAPACITY_LIMIT_NOTIFICATION_CONTRACT } from "./contract";
import { isCapacityLimitReached } from "./capacity";
import type { SalesPartnerLicenseSnapshot } from "./types";

export type CapacityLimitNotificationPayload = {
  event: "sales_partner_seller_capacity_reached";
  ownerTenantId: string;
  programId: string;
  activeSellerCount: number;
  maxActiveSellers: number;
  deliveryImplemented: false;
  purchaseCtaAllowed: false;
};

/**
 * Build a notification payload when capacity is reached.
 * Returns null when not at limit or when capacity is unconfigured.
 */
export function buildCapacityLimitReachedNotification(
  snapshot: SalesPartnerLicenseSnapshot,
): CapacityLimitNotificationPayload | null {
  if (!isCapacityLimitReached(snapshot)) return null;
  if (snapshot.maxActiveSellers == null) return null;

  return {
    event: SALES_PARTNER_CAPACITY_LIMIT_NOTIFICATION_CONTRACT.event,
    ownerTenantId: snapshot.program.ownerTenantId,
    programId: snapshot.program.programId,
    activeSellerCount: snapshot.activeSellerCount,
    maxActiveSellers: snapshot.maxActiveSellers,
    deliveryImplemented: false,
    purchaseCtaAllowed: false,
  };
}

export function assertNotificationContractNeverPurchasable(
  payload: CapacityLimitNotificationPayload,
): boolean {
  return (
    payload.deliveryImplemented === false &&
    payload.purchaseCtaAllowed === false &&
    SALES_PARTNER_CAPACITY_LIMIT_NOTIFICATION_CONTRACT.neverFabricatesPurchaseCta === true
  );
}
