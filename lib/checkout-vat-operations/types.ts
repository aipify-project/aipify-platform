export type CheckoutVatLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  legalReviewBanner: string;
  customerType: string;
  privatePerson: string;
  business: string;
  companyName: string;
  organizationNumber: string;
  country: string;
  billingAddress: string;
  billingEmail: string;
  reference: string;
  purchaseOrder: string;
  subtotal: string;
  vat: string;
  total: string;
  reverseChargeNote: string;
  confirmPurchase: string;
  continueToPayment: string;
  validating: string;
  validationValid: string;
  invalidBusinessNumber: string;
  invalidEuVatNumber: string;
  validationUnavailable: string;
  productType: string;
  paymentProvider: string;
  requiredField: string;
  businessNumberRequired: string;
};

export type CheckoutVatFormState = {
  customerType: "private" | "business";
  companyName: string;
  organizationNumber: string;
  country: string;
  billingAddress: string;
  billingEmail: string;
  reference: string;
  purchaseOrderNumber: string;
  productType: string;
  paymentProvider: string;
  subtotal: number;
  currency: string;
};

export type CheckoutVatBreakdown = {
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  reverseCharge: boolean;
  reverseChargeNote: string;
  validationStatus: string;
};
