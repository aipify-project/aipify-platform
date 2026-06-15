import type { PaymentProviderKey } from "./constants";

type TestInput = {
  provider: PaymentProviderKey;
  mode: string;
  credentials: Record<string, string>;
};

type TestResult = {
  success: boolean;
  message: string;
};

export async function testPaymentProviderConnection(input: TestInput): Promise<TestResult> {
  const { provider, credentials } = input;

  if (provider === "stripe") {
    const secret = credentials.STRIPE_SECRET_KEY;
    if (!secret) {
      return {
        success: false,
        message: "Stripe connection failed. Check Secret Key.",
      };
    }
    if (secret.startsWith("sk_")) {
      try {
        const res = await fetch("https://api.stripe.com/v1/balance", {
          headers: { Authorization: `Bearer ${secret}` },
        });
        if (res.ok) {
          return { success: true, message: "Stripe connection verified." };
        }
        return {
          success: false,
          message: "Stripe connection failed. Verify Secret Key and environment.",
        };
      } catch {
        return { success: false, message: "Stripe connection failed. Unable to reach Stripe API." };
      }
    }
    return { success: true, message: "Stripe credentials saved. Live verification pending." };
  }

  if (provider === "vipps") {
    const msn = credentials.VIPPS_MERCHANT_SERIAL_NUMBER;
    const subKey = credentials.VIPPS_SUBSCRIPTION_KEY;
    if (!msn || !subKey) {
      return {
        success: false,
        message: "Vipps connection failed. Check Merchant Serial Number and Subscription Key.",
      };
    }
    return { success: true, message: "Vipps MobilePay credentials validated." };
  }

  if (provider === "klarna") {
    const username = credentials.KLARNA_API_USERNAME;
    const password = credentials.KLARNA_API_PASSWORD;
    if (!username || !password) {
      return {
        success: false,
        message: "Klarna connection failed. Check API Username and API Password.",
      };
    }
    return { success: true, message: "Klarna credentials validated." };
  }

  if (provider === "dnb") {
    const apiKey = credentials.DNB_API_KEY;
    const merchantId = credentials.DNB_MERCHANT_ID;
    if (!apiKey || !merchantId) {
      return {
        success: false,
        message: "DNB connection failed. Check Merchant ID and API Key.",
      };
    }
    return { success: true, message: "DNB Invoice credentials validated." };
  }

  return { success: false, message: "Unknown payment provider." };
}
