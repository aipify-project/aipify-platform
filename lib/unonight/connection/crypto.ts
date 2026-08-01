import {
  decryptIntegrationPortalCredential,
  encryptIntegrationPortalCredential,
} from "@/lib/app-portal/integrations/credential-crypto";
import { maskSecretValue } from "@/lib/payment-providers/crypto";

export function encryptIntegrationCredential(plaintext: string): string {
  return encryptIntegrationPortalCredential(plaintext).ciphertext;
}

export function encryptIntegrationCredentialWithMeta(plaintext: string): {
  ciphertext: string;
  keyFingerprint: string;
  envelopeVersion: number;
} {
  return encryptIntegrationPortalCredential(plaintext);
}

export function decryptIntegrationCredential(ciphertext: string): string {
  const result = decryptIntegrationPortalCredential(ciphertext);
  if (!result.ok) {
    throw new Error(result.code);
  }
  return result.plaintext;
}

export function decryptIntegrationCredentialSafe(ciphertext: string | null | undefined) {
  return decryptIntegrationPortalCredential(ciphertext);
}

export function maskIntegrationCredential(value: string): string {
  return maskSecretValue(value);
}
