/** Platform Customer 360 horizontal tabs — contact/company first. */

export const CUSTOMER_360_TABS = [
  "contact",
  "company",
  "products",
  "subscription",
  "support",
  "technical",
] as const;

export type Customer360Tab = (typeof CUSTOMER_360_TABS)[number];

export function isCustomer360Tab(value: string | null | undefined): value is Customer360Tab {
  return (CUSTOMER_360_TABS as readonly string[]).includes(value ?? "");
}

export type Customer360TabLabels = Record<Customer360Tab, string>;
