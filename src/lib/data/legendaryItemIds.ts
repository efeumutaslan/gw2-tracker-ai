/**
 * GW2 API Item IDs for Legendary Weapons
 * Source: https://api.guildwars2.com/v2/items
 */

export const LEGENDARY_ITEM_IDS: Record<string, number> = {
  // Generation 1 - Classic Legendaries
  'eternity': 30704,
  'sunrise': 30703,
  'twilight': 30702,
  'bolt': 30699,
  'the_flameseeker_prophecies': 30696,
  'incinerator': 30684,
  'the_dreamer': 30686,
  'frostfang': 30689,
  'the_juggernaut': 30690,
  'meteorlogicus': 30695,
  'the_minstrel': 30692,
  'quip': 30693,
  'rodgorts_flame': 30697,
  'the_howler': 30701,
  'kudzu': 30685,
  'the_predator': 30694,
  'the_bifrost': 30698,
  'frenzy': 30700,
  'the_moot': 30691,

  // Generation 2 - Heart of Thorns & Path of Fire Legendaries
  'nevermore': 76158,
  'astralaria': 71383,
  'h_o_p_e': 74155,
  'chuka_and_champawat': 75624,
  'exordium': 95808,
  'sharur': 95684,
  'claw_of_the_khan-ur': 96028,
  'xiuquatl': 95675,
  'pharus': 96221,
  'eureka': 96203,
  'flames_of_war': 97077,
  'the_binding_of_ipos': 96356,
  'shooshadoo': 97165,
  'hms_divinity': 97783,
  'the_shining_blade': 95612,

  // Generation 3 - End of Dragons Legendaries (Aurene)
  'aurenes_tail': 95612,
  'aurenes_fang': 95675,
  'aurenes_weight': 95684,
  'aurenes_argument': 95808,
  'aurenes_scale': 96028,
  'aurenes_claw': 96203,
  'aurenes_wisdom': 96221,
  'aurenes_bite': 96356,
  'aurenes_insight': 96652,
  'aurenes_rending': 96937,
  'aurenes_wing': 97077,
  'aurenes_breath': 97099,
  'aurenes_gaze': 97165,
  'aurenes_persuasion': 97377,
  'aurenes_flight': 97590,
  'aurenes_voice': 97783,
};

/**
 * Get GW2 API item ID for a legendary
 */
export function getLegendaryItemId(legendaryId: string): number | null {
  return LEGENDARY_ITEM_IDS[legendaryId] ?? null;
}

/**
 * Get all legendary item IDs as an array
 */
export function getAllLegendaryItemIds(): number[] {
  return Object.values(LEGENDARY_ITEM_IDS);
}

/**
 * Find legendary ID by item ID
 */
export function findLegendaryById(itemId: number): string | null {
  const entry = Object.entries(LEGENDARY_ITEM_IDS).find(([_, id]) => id === itemId);
  return entry ? entry[0] : null;
}
