export function createWaypointChatCode(poiId: number): string {
  const header = 0x04;

  const byte1 = poiId & 0xFF;
  const byte2 = (poiId >> 8) & 0xFF;
  const byte3 = (poiId >> 16) & 0xFF;

  const bytes = new Uint8Array([header, byte1, byte2, byte3]);

  const base64 = Buffer.from(bytes).toString('base64');

  return `[&${base64}]`;
}

export function parseWaypointChatCode(chatCode: string): number | null {
  try {
    if (!chatCode.match(/^\[&[A-Za-z0-9+/=]+\]$/)) {
      return null;
    }

    const base64 = chatCode.slice(2, -1);

    const bytes = Buffer.from(base64, 'base64');

    if (bytes[0] !== 0x04) {
      return null;
    }

    const poiId = bytes[1] | (bytes[2] << 8) | (bytes[3] << 16);

    return poiId;
  } catch {
    return null;
  }
}

export function isValidWaypointCode(chatCode: string): boolean {
  return parseWaypointChatCode(chatCode) !== null;
}

export const COMMON_WAYPOINTS = {
  LIONS_ARCH_AERODROME: '[&BNUGAAA=]',
  DIVINITY_REACH: '[&BEgAAAA=]',
  BLACK_CITADEL: '[&BA4DAAA=]',
  HOELBRAK: '[&BBABAAA=]',
  RATA_SUM: '[&BFAGAAA=]',
  THE_GROVE: '[&BFABAAA=]',
} as const;
