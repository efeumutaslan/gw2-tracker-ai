// Legendary weapons and armor data with crafting requirements
// Data compiled from GW2 Wiki and API

export interface LegendaryItem {
  id: number;
  name: string;
  type: 'weapon' | 'armor' | 'trinket' | 'backpack';
  weaponType?: 'Greatsword' | 'Sword' | 'Staff' | 'Rifle' | 'Shortbow' | 'Longbow' | 'Hammer' | 'Axe' | 'Dagger' | 'Mace' | 'Pistol' | 'Scepter' | 'Focus' | 'Shield' | 'Torch' | 'Warhorn';
  armorType?: 'Heavy' | 'Medium' | 'Light';
  tier: 'gen1' | 'gen2' | 'gen3';
  iconUrl: string;
  requiredMaterials: MaterialRequirement[];
  estimatedCost?: number;
  description?: string;
}

export interface MaterialRequirement {
  id: number;
  name: string;
  quantity: number;
  iconUrl?: string;
  tradingPostPrice?: number;
}

// Generation 1 Legendary Weapons
export const GEN1_WEAPONS: LegendaryItem[] = [
  {
    id: 30704,
    name: 'Twilight',
    type: 'weapon',
    weaponType: 'Greatsword',
    tier: 'gen1',
    iconUrl: 'https://render.guildwars2.com/file/6B2228E8C6A17248CF0FEFC6E1A2F0537E8C5C0D/340596.png',
    description: 'The legendary greatsword of the night',
    requiredMaterials: [
      { id: 19675, name: 'Gift of Twilight', quantity: 1 },
      { id: 19675, name: 'Gift of Mastery', quantity: 1 },
      { id: 19675, name: 'Gift of Fortune', quantity: 1 },
      { id: 29185, name: 'Dusk (Precursor)', quantity: 1 },
      { id: 19976, name: 'Mystic Tribute', quantity: 1 },
      { id: 19675, name: 'Icy Runestone', quantity: 250 },
      { id: 24277, name: 'Amalgamated Gemstone', quantity: 250 },
    ],
  },
  {
    id: 30703,
    name: 'Sunrise',
    type: 'weapon',
    weaponType: 'Greatsword',
    tier: 'gen1',
    iconUrl: 'https://render.guildwars2.com/file/CCFD4AFFC0E078F1A0DA6F5E789E2C3D2396BDFF/340595.png',
    description: 'The legendary greatsword of the dawn',
    requiredMaterials: [
      { id: 19675, name: 'Gift of Sunrise', quantity: 1 },
      { id: 19675, name: 'Gift of Mastery', quantity: 1 },
      { id: 19675, name: 'Gift of Fortune', quantity: 1 },
      { id: 29169, name: 'Dawn (Precursor)', quantity: 1 },
      { id: 19976, name: 'Mystic Tribute', quantity: 1 },
      { id: 19976, name: 'Molten Lodestone', quantity: 250 },
      { id: 24277, name: 'Amalgamated Gemstone', quantity: 250 },
    ],
  },
  {
    id: 30699,
    name: 'The Flameseeker Prophecies',
    type: 'weapon',
    weaponType: 'Shield',
    tier: 'gen1',
    iconUrl: 'https://render.guildwars2.com/file/FEF9AD3F989E5B23F0B22C908E626394F6C78ED3/340591.png',
    description: 'The legendary shield',
    requiredMaterials: [
      { id: 19675, name: 'Gift of The Flameseeker Prophecies', quantity: 1 },
      { id: 19675, name: 'Gift of Mastery', quantity: 1 },
      { id: 19675, name: 'Gift of Fortune', quantity: 1 },
      { id: 29180, name: 'The Chosen (Precursor)', quantity: 1 },
      { id: 19976, name: 'Mystic Tribute', quantity: 1 },
    ],
  },
  {
    id: 30686,
    name: 'Bolt',
    type: 'weapon',
    weaponType: 'Sword',
    tier: 'gen1',
    iconUrl: 'https://render.guildwars2.com/file/F8F607B3A0C88FC693F3237BC7ABF6507D8D4AF6/340578.png',
    description: 'The legendary sword of lightning',
    requiredMaterials: [
      { id: 19675, name: 'Gift of Bolt', quantity: 1 },
      { id: 19675, name: 'Gift of Mastery', quantity: 1 },
      { id: 19675, name: 'Gift of Fortune', quantity: 1 },
      { id: 29167, name: 'Zap (Precursor)', quantity: 1 },
      { id: 24277, name: 'Charged Lodestone', quantity: 250 },
    ],
  },
  {
    id: 30684,
    name: 'The Bifrost',
    type: 'weapon',
    weaponType: 'Staff',
    tier: 'gen1',
    iconUrl: 'https://render.guildwars2.com/file/02C5333DB1C0BE9FBE5B6D5FA92D8670C8FA526C/340576.png',
    description: 'The legendary rainbow bridge staff',
    requiredMaterials: [
      { id: 19675, name: 'Gift of The Bifrost', quantity: 1 },
      { id: 19675, name: 'Gift of Mastery', quantity: 1 },
      { id: 19675, name: 'Gift of Fortune', quantity: 1 },
      { id: 29166, name: 'The Legend (Precursor)', quantity: 1 },
      { id: 24277, name: 'Crystalline Lodestone', quantity: 250 },
    ],
  },
  {
    id: 30685,
    name: 'Incinerator',
    type: 'weapon',
    weaponType: 'Dagger',
    tier: 'gen1',
    iconUrl: 'https://render.guildwars2.com/file/2A5C1FEEA7CFB19B3E8D0D3A7870874028B3E1AB/340577.png',
    description: 'The legendary dagger of flames',
    requiredMaterials: [
      { id: 19675, name: 'Gift of Incinerator', quantity: 1 },
      { id: 19675, name: 'Gift of Mastery', quantity: 1 },
      { id: 19675, name: 'Gift of Fortune', quantity: 1 },
      { id: 29168, name: 'Spark (Precursor)', quantity: 1 },
      { id: 24277, name: 'Molten Lodestone', quantity: 250 },
    ],
  },
];

// Generation 2 Legendary Weapons
export const GEN2_WEAPONS: LegendaryItem[] = [
  {
    id: 79557,
    name: 'Nevermore',
    type: 'weapon',
    weaponType: 'Staff',
    tier: 'gen2',
    iconUrl: 'https://render.guildwars2.com/file/8BF612A1B779D7EB38E5C2E09E2BECA1ADDB1EF5/1123851.png',
    description: 'The legendary raven staff',
    requiredMaterials: [
      { id: 79557, name: 'Gift of Nevermore', quantity: 1 },
      { id: 77334, name: 'Gift of Maguuma Mastery', quantity: 1 },
      { id: 19675, name: 'Gift of Fortune', quantity: 1 },
      { id: 79578, name: 'The Raven Staff (Precursor)', quantity: 1 },
      { id: 46740, name: 'Amalgamated Draconic Lodestone', quantity: 250 },
    ],
  },
  {
    id: 80145,
    name: 'Astralaria',
    type: 'weapon',
    weaponType: 'Axe',
    tier: 'gen2',
    iconUrl: 'https://render.guildwars2.com/file/6B93B2C2E7CD7AA8CAF0AAE9A9E0C8F6C49F3B9B/1302636.png',
    description: 'The legendary celestial axe',
    requiredMaterials: [
      { id: 80145, name: 'Gift of Astralaria', quantity: 1 },
      { id: 77334, name: 'Gift of Maguuma Mastery', quantity: 1 },
      { id: 19675, name: 'Gift of Fortune', quantity: 1 },
      { id: 80161, name: 'The Mechanism (Precursor)', quantity: 1 },
      { id: 46740, name: 'Mystic Curio', quantity: 250 },
    ],
  },
];

// Generation 3 Legendary Weapons
export const GEN3_WEAPONS: LegendaryItem[] = [
  {
    id: 95808,
    name: 'Aurene\'s Bite',
    type: 'weapon',
    weaponType: 'Dagger',
    tier: 'gen3',
    iconUrl: 'https://render.guildwars2.com/file/8DE9A514CD9357CAC41B7B1FE7E3C4F2BF9C7B2B/2232347.png',
    description: 'The legendary dragon dagger',
    requiredMaterials: [
      { id: 95808, name: 'Gift of Aurene\'s Bite', quantity: 1 },
      { id: 91740, name: 'Gift of the Dragonslayer', quantity: 1 },
      { id: 19675, name: 'Gift of Fortune', quantity: 1 },
      { id: 95882, name: 'Tooth of Fang (Precursor)', quantity: 1 },
      { id: 91718, name: 'Provisioner Token', quantity: 250 },
    ],
  },
  {
    id: 96028,
    name: 'Aurene\'s Claw',
    type: 'weapon',
    weaponType: 'Pistol',
    tier: 'gen3',
    iconUrl: 'https://render.guildwars2.com/file/1C8A3E6D4F9B8E7C3D2A1F6E5B4C3D2A1F6E5B4C/2232348.png',
    description: 'The legendary dragon pistol',
    requiredMaterials: [
      { id: 96028, name: 'Gift of Aurene\'s Claw', quantity: 1 },
      { id: 91740, name: 'Gift of the Dragonslayer', quantity: 1 },
      { id: 19675, name: 'Gift of Fortune', quantity: 1 },
      { id: 96203, name: 'Dragon\'s Fang (Precursor)', quantity: 1 },
      { id: 91718, name: 'Provisioner Token', quantity: 250 },
    ],
  },
];

// Legendary Armor
export const LEGENDARY_ARMOR: LegendaryItem[] = [
  {
    id: 80384,
    name: 'Perfected Envoy Helmet',
    type: 'armor',
    armorType: 'Heavy',
    tier: 'gen1',
    iconUrl: 'https://render.guildwars2.com/file/5B6C8D7E9F0A1B2C3D4E5F6A7B8C9D0E1F2A3B4C/1302891.png',
    description: 'Legendary heavy helmet',
    requiredMaterials: [
      { id: 80516, name: 'Legendary Insight', quantity: 150 },
      { id: 81743, name: 'Gift of Prowess', quantity: 1 },
      { id: 80384, name: 'Crystalline Ore', quantity: 250 },
    ],
  },
];

export const ALL_LEGENDARIES: LegendaryItem[] = [
  ...GEN1_WEAPONS,
  ...GEN2_WEAPONS,
  ...GEN3_WEAPONS,
  ...LEGENDARY_ARMOR,
];

// Helper functions
export function getLegendaryById(id: number): LegendaryItem | undefined {
  return ALL_LEGENDARIES.find(item => item.id === id);
}

export function getLegendariesByType(type: LegendaryItem['type']): LegendaryItem[] {
  return ALL_LEGENDARIES.filter(item => item.type === type);
}

export function getLegendariesByTier(tier: LegendaryItem['tier']): LegendaryItem[] {
  return ALL_LEGENDARIES.filter(item => item.tier === tier);
}

export function calculateTotalCost(materials: MaterialRequirement[]): number {
  return materials.reduce((total, mat) => {
    return total + (mat.tradingPostPrice || 0) * mat.quantity;
  }, 0);
}

export function calculateProgress(
  required: MaterialRequirement[],
  current: { [itemId: number]: number }
): number {
  if (required.length === 0) return 0;

  const completedMaterials = required.filter(mat => {
    const currentAmount = current[mat.id] || 0;
    return currentAmount >= mat.quantity;
  });

  return (completedMaterials.length / required.length) * 100;
}

// Format gold amount
export function formatGold(copper: number): string {
  const gold = Math.floor(copper / 10000);
  const silver = Math.floor((copper % 10000) / 100);
  const copperRemaining = copper % 100;

  const parts = [];
  if (gold > 0) parts.push(`${gold}g`);
  if (silver > 0) parts.push(`${silver}s`);
  if (copperRemaining > 0) parts.push(`${copperRemaining}c`);

  return parts.join(' ') || '0c';
}
