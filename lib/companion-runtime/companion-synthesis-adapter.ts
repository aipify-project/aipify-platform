import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Translator } from "@/lib/i18n/translate";
import { extractPreservedTokens, validateFactIntegrity } from "./companion-output-pipeline";
import type { CompanionModelContext } from "./companion-model-context";

export type CompanionSynthesisAdapterInput = {
  modelContext: CompanionModelContext;
  deterministicDirect: string;
  deterministicExplanation?: string;
  locale: CustomerActiveLocale;
  naturalLead: string;
};

export type CompanionSynthesisAdapterResult =
  | {
      ok: true;
      directAnswer: string;
      explanation?: string;
    }
  | {
      ok: false;
      code: "provider_failure" | "integrity_failed" | "validation_failed";
      message: string;
    };

export type CompanionSynthesisAdapter = {
  provider_key: string;
  synthesize(input: CompanionSynthesisAdapterInput): CompanionSynthesisAdapterResult;
};

const SECRET_FIELD_PATTERN =
  /password|secret|token|credential|api_key|private_key|auth_header|bearer/i;

function sanitizeSynthesisText(text: string): string {
  return text
    .split("\n")
    .filter((line) => !SECRET_FIELD_PATTERN.test(line))
    .join("\n")
    .trim();
}

function buildFactBlock(context: CompanionModelContext): string {
  const lines = [...context.grounded_facts];
  if (lines.length === 0) {
    return context.source_metadata
      .map((source) => `${source.label}: ${source.id}`)
      .join("\n");
  }
  return lines.join("\n");
}

function createManagedAdapter(providerKey: string): CompanionSynthesisAdapter {
  return {
    provider_key: providerKey,
    synthesize(input) {
      const factBlock = buildFactBlock(input.modelContext);
      const preservedTokens = extractPreservedTokens(input.deterministicDirect);

      const directAnswer = sanitizeSynthesisText(
        [input.naturalLead.trim(), factBlock].filter(Boolean).join("\n"),
      );

      if (
        !validateFactIntegrity(
          input.deterministicDirect,
          directAnswer,
          preservedTokens,
        )
      ) {
        return {
          ok: false,
          code: "integrity_failed",
          message: "Synthesized output failed grounded fact integrity checks.",
        };
      }

      const sourceLines = input.modelContext.source_metadata.map(
        (source) => `${source.label} (${source.priority})`,
      );
      const explanation = sanitizeSynthesisText(
        [input.deterministicExplanation?.trim(), sourceLines.join(" · ")].filter(Boolean).join("\n"),
      );

      return {
        ok: true,
        directAnswer,
        explanation: explanation || input.deterministicExplanation,
      };
    },
  };
}

const ADAPTERS: Record<string, CompanionSynthesisAdapter> = {
  "managed-fast": createManagedAdapter("managed-fast"),
  "managed-balanced": createManagedAdapter("managed-balanced"),
  "managed-reasoning": createManagedAdapter("managed-reasoning"),
};

let failingProviderKey: string | null = null;

export function setSynthesisAdapterFailureForTests(providerKey: string | null): void {
  failingProviderKey = providerKey;
}

export function getCompanionSynthesisAdapter(providerKey: string): CompanionSynthesisAdapter | null {
  if (failingProviderKey && failingProviderKey === providerKey) {
    return {
      provider_key: providerKey,
      synthesize() {
        return {
          ok: false,
          code: "provider_failure",
          message: "Managed synthesis provider unavailable.",
        };
      },
    };
  }
  return ADAPTERS[providerKey] ?? null;
}

export function executeCompanionSynthesisAdapter(
  providerKey: string,
  input: CompanionSynthesisAdapterInput,
): CompanionSynthesisAdapterResult {
  const adapter = getCompanionSynthesisAdapter(providerKey);
  if (!adapter) {
    return {
      ok: false,
      code: "provider_failure",
      message: "No synthesis adapter registered for provider.",
    };
  }
  return adapter.synthesize(input);
}

export function buildCompanionSynthesisNaturalLead(
  context: CompanionModelContext,
  t: Translator,
): string {
  return t("customerApp.companionPlatformKnowledge.synthesis.naturalLead")
    .replace("{locale}", context.locale)
    .replace("{sourceCount}", String(context.source_metadata.length));
}
