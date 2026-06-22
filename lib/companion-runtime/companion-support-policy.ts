export const COMPANION_SUPPORT_POLICY = {
  orchestrator: "lib/companion-runtime/support-read-orchestrator.ts",
  write_orchestrator: "lib/companion-runtime/support-write-orchestrator.ts",
  semantic: "lib/companion-runtime/support-semantic-intent.ts",
  audit: "lib/companion-runtime/support-audit.ts",
  provider_contract:
    "lib/integration-intelligence/providers/support-operations/support-operations-contract.ts",
  source_map: "lib/integration-intelligence/providers/support-operations/support-source-map.ts",
  auto_send_blocked: true,
  auto_close_blocked: true,
  draft_only_mode: true,
} as const;
