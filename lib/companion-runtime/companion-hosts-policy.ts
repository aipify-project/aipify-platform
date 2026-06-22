export const COMPANION_HOSTS_POLICY = {
  orchestrator: "lib/companion-runtime/hosts-read-orchestrator.ts",
  write_orchestrator: "lib/companion-runtime/hosts-write-orchestrator.ts",
  semantic: "lib/companion-runtime/hosts-semantic-intent.ts",
  audit: "lib/companion-runtime/hosts-audit.ts",
  provider_contract: "lib/integration-intelligence/providers/aipify-hosts/hosts-v1-contract.ts",
  source_map: "lib/integration-intelligence/providers/aipify-hosts/hosts-source-map.ts",
  auto_message_send_blocked: true,
  payment_execution_blocked: true,
  reservation_delete_blocked: true,
  v2_engines_specification_only: true,
} as const;
