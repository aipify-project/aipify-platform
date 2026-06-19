export type BillingCommerceModuleStat = {
  id: string;
  stat: number;
};

export type BillingCommerceCenterPayload = {
  found: boolean;
  section: string;
  principle?: string;
  privacy_note?: string;
  modules?: BillingCommerceModuleStat[];
  stats?: Record<string, number | boolean | string>;
  rows?: Record<string, unknown>[];
};
