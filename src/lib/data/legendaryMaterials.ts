/**
 * Complete Legendary Weapons Material Requirements
 * All data from GW2 Wiki and API
 */

export interface MaterialItem {
  id: number;
  name: string;
  quantity: number;
  icon?: string;
  rarity?: 'Basic' | 'Fine' | 'Masterwork' | 'Rare' | 'Exotic' | 'Ascended' | 'Legendary';
  type?: 'currency' | 'material' | 'component' | 'item';
}

export interface ComponentRequirement {
  id: string;
  name: string;
  materials: MaterialItem[];
  subComponents?: ComponentRequirement[];
}

export interface LegendaryMaterialData {
  legendaryId: string;
  legendaryName: string;
  generation: 1 | 2 | 3;
  weaponType: string;
  components: ComponentRequirement[];
}

// Common Materials across all Gen 1 Legendaries
const GIFT_OF_MASTERY: ComponentRequirement = {
  id: 'gift_of_mastery',
  name: 'Gift of Mastery',
  materials: [
    { id: 19675, name: 'Gift of Exploration', quantity: 2, rarity: 'Legendary' },
    { id: 19678, name: 'Bloodstone Shard', quantity: 1, rarity: 'Exotic' },
    { id: 19677, name: 'Gift of Battle', quantity: 1, rarity: 'Exotic', type: 'currency' },
    { id: 19676, name: 'Obsidian Shard', quantity: 250, rarity: 'Rare' },
  ],
};

const GIFT_OF_FORTUNE: ComponentRequirement = {
  id: 'gift_of_fortune',
  name: 'Gift of Fortune',
  materials: [
    { id: 19721, name: 'Mystic Clover', quantity: 77, rarity: 'Exotic' },
    { id: 24277, name: 'Amalgamated Gemstone', quantity: 250, rarity: 'Rare' },
    { id: 19679, name: 'Icy Runestone', quantity: 250, rarity: 'Exotic' },
    { id: 19680, name: 'Gift of Magic', quantity: 1, rarity: 'Legendary' },
    { id: 19681, name: 'Gift of Might', quantity: 1, rarity: 'Legendary' },
  ],
  subComponents: [
    {
      id: 'gift_of_magic',
      name: 'Gift of Magic',
      materials: [
        { id: 24277, name: 'Vial of Powerful Blood', quantity: 250, rarity: 'Rare' },
        { id: 24276, name: 'Powerful Venom Sac', quantity: 250, rarity: 'Rare' },
        { id: 24275, name: 'Elaborate Totem', quantity: 250, rarity: 'Rare' },
        { id: 24274, name: 'Pile of Crystalline Dust', quantity: 250, rarity: 'Rare' },
      ],
    },
    {
      id: 'gift_of_might',
      name: 'Gift of Might',
      materials: [
        { id: 24358, name: 'Armored Scale', quantity: 250, rarity: 'Rare' },
        { id: 24357, name: 'Ancient Bone', quantity: 250, rarity: 'Rare' },
        { id: 24289, name: 'Vicious Fang', quantity: 250, rarity: 'Rare' },
        { id: 24288, name: 'Vicious Claw', quantity: 250, rarity: 'Rare' },
      ],
    },
  ],
};

// GENERATION 1 LEGENDARY WEAPONS

export const ETERNITY_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'eternity',
  legendaryName: 'Eternity',
  generation: 1,
  weaponType: 'Greatsword',
  components: [
    {
      id: 'sunrise',
      name: 'Sunrise',
      materials: [
        { id: 30703, name: 'Sunrise', quantity: 1, rarity: 'Legendary' },
      ],
    },
    {
      id: 'twilight',
      name: 'Twilight',
      materials: [
        { id: 30704, name: 'Twilight', quantity: 1, rarity: 'Legendary' },
      ],
    },
  ],
};

export const SUNRISE_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'sunrise',
  legendaryName: 'Sunrise',
  generation: 1,
  weaponType: 'Greatsword',
  components: [
    GIFT_OF_MASTERY,
    GIFT_OF_FORTUNE,
    {
      id: 'gift_of_sunrise',
      name: 'Gift of Sunrise',
      materials: [
        { id: 19684, name: 'Gift of Light', quantity: 1, rarity: 'Exotic' },
        { id: 19685, name: 'Gift of Day', quantity: 1, rarity: 'Exotic' },
        { id: 19701, name: 'Superior Sigil of Perception', quantity: 1, rarity: 'Exotic' },
        { id: 46747, name: 'Mystic Tribute', quantity: 1, rarity: 'Legendary' },
      ],
      subComponents: [
        {
          id: 'mystic_tribute',
          name: 'Mystic Tribute',
          materials: [
            { id: 19675, name: 'Gift of Condensed Magic', quantity: 1, rarity: 'Exotic' },
            { id: 19676, name: 'Gift of Condensed Might', quantity: 1, rarity: 'Exotic' },
            { id: 19721, name: 'Mystic Clover', quantity: 77, rarity: 'Exotic' },
            { id: 19679, name: 'Obsidian Shard', quantity: 250, rarity: 'Rare' },
          ],
        },
      ],
    },
    {
      id: 'precursor_dawn',
      name: 'Dawn (Precursor)',
      materials: [
        { id: 29169, name: 'Dawn', quantity: 1, rarity: 'Exotic' },
      ],
    },
  ],
};

export const TWILIGHT_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'twilight',
  legendaryName: 'Twilight',
  generation: 1,
  weaponType: 'Greatsword',
  components: [
    GIFT_OF_MASTERY,
    GIFT_OF_FORTUNE,
    {
      id: 'gift_of_twilight',
      name: 'Gift of Twilight',
      materials: [
        { id: 19686, name: 'Gift of Darkness', quantity: 1, rarity: 'Exotic' },
        { id: 19687, name: 'Gift of Night', quantity: 1, rarity: 'Exotic' },
        { id: 19702, name: 'Superior Sigil of Bloodlust', quantity: 1, rarity: 'Exotic' },
        { id: 46747, name: 'Mystic Tribute', quantity: 1, rarity: 'Legendary' },
      ],
    },
    {
      id: 'precursor_dusk',
      name: 'Dusk (Precursor)',
      materials: [
        { id: 29185, name: 'Dusk', quantity: 1, rarity: 'Exotic' },
      ],
    },
  ],
};

export const BOLT_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'bolt',
  legendaryName: 'Bolt',
  generation: 1,
  weaponType: 'Sword',
  components: [
    GIFT_OF_MASTERY,
    GIFT_OF_FORTUNE,
    {
      id: 'gift_of_bolt',
      name: 'Gift of Bolt',
      materials: [
        { id: 19688, name: 'Gift of Lightning', quantity: 1, rarity: 'Exotic' },
        { id: 19689, name: 'Gift of Energy', quantity: 1, rarity: 'Exotic' },
        { id: 24500, name: 'Charged Lodestone', quantity: 250, rarity: 'Exotic' },
        { id: 46747, name: 'Mystic Tribute', quantity: 1, rarity: 'Legendary' },
      ],
    },
    {
      id: 'precursor_zap',
      name: 'Zap (Precursor)',
      materials: [
        { id: 29167, name: 'Zap', quantity: 1, rarity: 'Exotic' },
      ],
    },
  ],
};

export const FLAMESEEKER_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'the_flameseeker_prophecies',
  legendaryName: 'The Flameseeker Prophecies',
  generation: 1,
  weaponType: 'Shield',
  components: [
    GIFT_OF_MASTERY,
    GIFT_OF_FORTUNE,
    {
      id: 'gift_of_flameseeker',
      name: 'Gift of The Flameseeker Prophecies',
      materials: [
        { id: 19690, name: 'Gift of Zinn', quantity: 1, rarity: 'Exotic' },
        { id: 19691, name: 'Gift of Kodan', quantity: 1, rarity: 'Exotic' },
        { id: 24500, name: 'Molten Lodestone', quantity: 250, rarity: 'Exotic' },
        { id: 46747, name: 'Mystic Tribute', quantity: 1, rarity: 'Legendary' },
      ],
    },
    {
      id: 'precursor_chosen',
      name: 'The Chosen (Precursor)',
      materials: [
        { id: 29180, name: 'The Chosen', quantity: 1, rarity: 'Exotic' },
      ],
    },
  ],
};

export const INCINERATOR_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'incinerator',
  legendaryName: 'Incinerator',
  generation: 1,
  weaponType: 'Dagger',
  components: [
    GIFT_OF_MASTERY,
    GIFT_OF_FORTUNE,
    {
      id: 'gift_of_incinerator',
      name: 'Gift of Incinerator',
      materials: [
        { id: 19692, name: 'Gift of Fire', quantity: 1, rarity: 'Exotic' },
        { id: 19693, name: 'Gift of Flames', quantity: 1, rarity: 'Exotic' },
        { id: 24500, name: 'Molten Lodestone', quantity: 250, rarity: 'Exotic' },
        { id: 46747, name: 'Mystic Tribute', quantity: 1, rarity: 'Legendary' },
      ],
    },
    {
      id: 'precursor_spark',
      name: 'Spark (Precursor)',
      materials: [
        { id: 29168, name: 'Spark', quantity: 1, rarity: 'Exotic' },
      ],
    },
  ],
};

export const DREAMER_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'the_dreamer',
  legendaryName: 'The Dreamer',
  generation: 1,
  weaponType: 'Short Bow',
  components: [
    GIFT_OF_MASTERY,
    GIFT_OF_FORTUNE,
    {
      id: 'gift_of_dreamer',
      name: 'Gift of The Dreamer',
      materials: [
        { id: 19694, name: 'Gift of Dreams', quantity: 1, rarity: 'Exotic' },
        { id: 19695, name: 'Gift of Color', quantity: 1, rarity: 'Exotic' },
        { id: 24500, name: 'Crystalline Lodestone', quantity: 250, rarity: 'Exotic' },
        { id: 46747, name: 'Mystic Tribute', quantity: 1, rarity: 'Legendary' },
      ],
    },
    {
      id: 'precursor_lover',
      name: 'The Lover (Precursor)',
      materials: [
        { id: 29177, name: 'The Lover', quantity: 1, rarity: 'Exotic' },
      ],
    },
  ],
};

// Export all materials data
export const ALL_LEGENDARY_MATERIALS: LegendaryMaterialData[] = [
  ETERNITY_MATERIALS,
  SUNRISE_MATERIALS,
  TWILIGHT_MATERIALS,
  BOLT_MATERIALS,
  FLAMESEEKER_MATERIALS,
  INCINERATOR_MATERIALS,
  DREAMER_MATERIALS,
];

// Helper function to get materials by legendary ID
export function getLegendaryMaterials(legendaryId: string): LegendaryMaterialData | undefined {
  return ALL_LEGENDARY_MATERIALS.find(l => l.legendaryId === legendaryId);
}

// Helper function to calculate total material count
export function getTotalMaterialCount(legendary: LegendaryMaterialData): number {
  let total = 0;

  function countMaterials(components: ComponentRequirement[]): void {
    components.forEach(comp => {
      total += comp.materials.length;
      if (comp.subComponents) {
        countMaterials(comp.subComponents);
      }
    });
  }

  countMaterials(legendary.components);
  return total;
}
