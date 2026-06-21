/** Deduplication key: org_id + source_system + source_record_id + event_type */

export type PilotSignalDedupKey = {
  organizationId: string;
  sourceSystem: string;
  sourceRecordId: string;
  eventType: string;
};

export function buildPilotSignalDedupKey(input: PilotSignalDedupKey): string {
  return [
    input.organizationId,
    input.sourceSystem,
    input.sourceRecordId,
    input.eventType,
  ].join("::");
}

export function parsePilotSignalDedupKey(key: string): PilotSignalDedupKey | null {
  const parts = key.split("::");
  if (parts.length !== 4) return null;
  const [organizationId, sourceSystem, sourceRecordId, eventType] = parts;
  if (!organizationId || !sourceSystem || !sourceRecordId || !eventType) return null;
  return { organizationId, sourceSystem, sourceRecordId, eventType };
}

export function isDuplicateSignal(
  existingKeys: Set<string>,
  input: PilotSignalDedupKey
): boolean {
  return existingKeys.has(buildPilotSignalDedupKey(input));
}
