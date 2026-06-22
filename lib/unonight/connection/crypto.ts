import {
  decryptPaymentCredential,
  encryptPaymentCredential,
  maskSecretValue,
} from "@/lib/payment-providers/crypto";

export function encryptIntegrationCredential(plaintext: string): string {
  return encryptPaymentCredential(plaintext);
}

export function decryptIntegrationCredential(ciphertext: string): string {
  return decryptPaymentCredential(ciphertext);
}

export function maskIntegrationCredential(value: string): string {
  return maskSecretValue(value);
}
