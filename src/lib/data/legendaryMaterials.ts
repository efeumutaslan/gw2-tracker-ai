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

export const FROSTFANG_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'frostfang',
  legendaryName: 'Frostfang',
  generation: 1,
  weaponType: 'Axe',
  components: [
    GIFT_OF_MASTERY,
    GIFT_OF_FORTUNE,
    {
      id: 'gift_of_frostfang',
      name: 'Gift of Frostfang',
      materials: [
        { id: 19696, name: 'Gift of Ice', quantity: 1, rarity: 'Exotic' },
        { id: 19697, name: 'Gift of the Blizzard', quantity: 1, rarity: 'Exotic' },
        { id: 24502, name: 'Glacial Lodestone', quantity: 250, rarity: 'Exotic' },
        { id: 46747, name: 'Mystic Tribute', quantity: 1, rarity: 'Legendary' },
      ],
    },
    {
      id: 'precursor_rage',
      name: 'Rage (Precursor)',
      materials: [
        { id: 29166, name: 'Rage', quantity: 1, rarity: 'Exotic' },
      ],
    },
  ],
};

export const JUGGERNAUT_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'the_juggernaut',
  legendaryName: 'The Juggernaut',
  generation: 1,
  weaponType: 'Hammer',
  components: [
    GIFT_OF_MASTERY,
    GIFT_OF_FORTUNE,
    {
      id: 'gift_of_juggernaut',
      name: 'Gift of The Juggernaut',
      materials: [
        { id: 19698, name: 'Gift of Metal', quantity: 1, rarity: 'Exotic' },
        { id: 19699, name: 'Gift of the Colossus', quantity: 1, rarity: 'Exotic' },
        { id: 24499, name: 'Onyx Lodestone', quantity: 250, rarity: 'Exotic' },
        { id: 46747, name: 'Mystic Tribute', quantity: 1, rarity: 'Legendary' },
      ],
    },
    {
      id: 'precursor_colossus',
      name: 'The Colossus (Precursor)',
      materials: [
        { id: 29181, name: 'The Colossus', quantity: 1, rarity: 'Exotic' },
      ],
    },
  ],
};

export const METEORLOGICUS_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'meteorlogicus',
  legendaryName: 'Meteorlogicus',
  generation: 1,
  weaponType: 'Scepter',
  components: [
    GIFT_OF_MASTERY,
    GIFT_OF_FORTUNE,
    {
      id: 'gift_of_meteorlogicus',
      name: 'Gift of Meteorlogicus',
      materials: [
        { id: 19700, name: 'Gift of the Cosmos', quantity: 1, rarity: 'Exotic' },
        { id: 19701, name: 'Gift of Meteorites', quantity: 1, rarity: 'Exotic' },
        { id: 24500, name: 'Charged Lodestone', quantity: 250, rarity: 'Exotic' },
        { id: 46747, name: 'Mystic Tribute', quantity: 1, rarity: 'Legendary' },
      ],
    },
    {
      id: 'precursor_the_anomaly',
      name: 'The Anomaly (Precursor)',
      materials: [
        { id: 29182, name: 'The Anomaly', quantity: 1, rarity: 'Exotic' },
      ],
    },
  ],
};

export const MINSTREL_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'the_minstrel',
  legendaryName: 'The Minstrel',
  generation: 1,
  weaponType: 'Focus',
  components: [
    GIFT_OF_MASTERY,
    GIFT_OF_FORTUNE,
    {
      id: 'gift_of_minstrel',
      name: 'Gift of The Minstrel',
      materials: [
        { id: 19702, name: 'Gift of Music', quantity: 1, rarity: 'Exotic' },
        { id: 19703, name: 'Gift of Minstrelsy', quantity: 1, rarity: 'Exotic' },
        { id: 24502, name: 'Glacial Lodestone', quantity: 250, rarity: 'Exotic' },
        { id: 46747, name: 'Mystic Tribute', quantity: 1, rarity: 'Legendary' },
      ],
    },
    {
      id: 'precursor_chaos_gun',
      name: 'Chaos Gun (Precursor)',
      materials: [
        { id: 29178, name: 'Chaos Gun', quantity: 1, rarity: 'Exotic' },
      ],
    },
  ],
};

export const PREDATOR_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'the_predator',
  legendaryName: 'The Predator',
  generation: 1,
  weaponType: 'Rifle',
  components: [
    GIFT_OF_MASTERY,
    GIFT_OF_FORTUNE,
    {
      id: 'gift_of_predator',
      name: 'Gift of The Predator',
      materials: [
        { id: 19704, name: 'Gift of Stealth', quantity: 1, rarity: 'Exotic' },
        { id: 19705, name: 'Gift of the Hunt', quantity: 1, rarity: 'Exotic' },
        { id: 24499, name: 'Onyx Lodestone', quantity: 250, rarity: 'Exotic' },
        { id: 46747, name: 'Mystic Tribute', quantity: 1, rarity: 'Legendary' },
      ],
    },
    {
      id: 'precursor_hunter',
      name: 'The Hunter (Precursor)',
      materials: [
        { id: 29184, name: 'The Hunter', quantity: 1, rarity: 'Exotic' },
      ],
    },
  ],
};

export const KUDZU_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'kudzu',
  legendaryName: 'Kudzu',
  generation: 1,
  weaponType: 'Longbow',
  components: [
    GIFT_OF_MASTERY,
    GIFT_OF_FORTUNE,
    {
      id: 'gift_of_kudzu',
      name: 'Gift of Kudzu',
      materials: [
        { id: 19706, name: 'Gift of Nature', quantity: 1, rarity: 'Exotic' },
        { id: 19707, name: 'Gift of Wood', quantity: 1, rarity: 'Exotic' },
        { id: 24505, name: 'Vial of Quicksilver', quantity: 250, rarity: 'Exotic' },
        { id: 46747, name: 'Mystic Tribute', quantity: 1, rarity: 'Legendary' },
      ],
    },
    {
      id: 'precursor_leaf_of_kudzu',
      name: 'Leaf of Kudzu (Precursor)',
      materials: [
        { id: 29176, name: 'Leaf of Kudzu', quantity: 1, rarity: 'Exotic' },
      ],
    },
  ],
};

export const QUIP_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'quip',
  legendaryName: 'Quip',
  generation: 1,
  weaponType: 'Pistol',
  components: [
    GIFT_OF_MASTERY,
    GIFT_OF_FORTUNE,
    {
      id: 'gift_of_quip',
      name: 'Gift of Quip',
      materials: [
        { id: 19708, name: 'Gift of Entertainment', quantity: 1, rarity: 'Exotic' },
        { id: 19709, name: 'Gift of Mirth', quantity: 1, rarity: 'Exotic' },
        { id: 24500, name: 'Crystalline Lodestone', quantity: 250, rarity: 'Exotic' },
        { id: 46747, name: 'Mystic Tribute', quantity: 1, rarity: 'Legendary' },
      ],
    },
    {
      id: 'precursor_chaos_gun',
      name: 'Chaos Gun (Precursor)',
      materials: [
        { id: 29170, name: 'Chaos Gun', quantity: 1, rarity: 'Exotic' },
      ],
    },
  ],
};

export const RODGORT_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'rodgorts_flame',
  legendaryName: "Rodgort's Flame",
  generation: 1,
  weaponType: 'Torch',
  components: [
    GIFT_OF_MASTERY,
    GIFT_OF_FORTUNE,
    {
      id: 'gift_of_rodgort',
      name: "Gift of Rodgort's Flame",
      materials: [
        { id: 19710, name: 'Gift of Fire', quantity: 1, rarity: 'Exotic' },
        { id: 19711, name: 'Gift of Rodgort', quantity: 1, rarity: 'Exotic' },
        { id: 24501, name: 'Molten Lodestone', quantity: 250, rarity: 'Exotic' },
        { id: 46747, name: 'Mystic Tribute', quantity: 1, rarity: 'Legendary' },
      ],
    },
    {
      id: 'precursor_spark',
      name: 'Spark (Precursor)',
      materials: [
        { id: 29171, name: 'Spark', quantity: 1, rarity: 'Exotic' },
      ],
    },
  ],
};

export const BIFROST_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'the_bifrost',
  legendaryName: 'The Bifrost',
  generation: 1,
  weaponType: 'Staff',
  components: [
    GIFT_OF_MASTERY,
    GIFT_OF_FORTUNE,
    {
      id: 'gift_of_bifrost',
      name: 'Gift of The Bifrost',
      materials: [
        { id: 19712, name: 'Gift of Color', quantity: 1, rarity: 'Exotic' },
        { id: 19713, name: 'Gift of the Rainbow', quantity: 1, rarity: 'Exotic' },
        { id: 24500, name: 'Crystalline Lodestone', quantity: 250, rarity: 'Exotic' },
        { id: 46747, name: 'Mystic Tribute', quantity: 1, rarity: 'Legendary' },
      ],
    },
    {
      id: 'precursor_legend',
      name: 'The Legend (Precursor)',
      materials: [
        { id: 29172, name: 'The Legend', quantity: 1, rarity: 'Exotic' },
      ],
    },
  ],
};

export const HOWLER_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'the_howler',
  legendaryName: 'The Howler',
  generation: 1,
  weaponType: 'Warhorn',
  components: [
    GIFT_OF_MASTERY,
    GIFT_OF_FORTUNE,
    {
      id: 'gift_of_howler',
      name: 'Gift of The Howler',
      materials: [
        { id: 19714, name: 'Gift of the Wolves', quantity: 1, rarity: 'Exotic' },
        { id: 19715, name: 'Gift of the Moon', quantity: 1, rarity: 'Exotic' },
        { id: 24502, name: 'Glacial Lodestone', quantity: 250, rarity: 'Exotic' },
        { id: 46747, name: 'Mystic Tribute', quantity: 1, rarity: 'Legendary' },
      ],
    },
    {
      id: 'precursor_howl',
      name: 'Howl (Precursor)',
      materials: [
        { id: 29179, name: 'Howl', quantity: 1, rarity: 'Exotic' },
      ],
    },
  ],
};

export const MOOT_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'the_moot',
  legendaryName: 'The Moot',
  generation: 1,
  weaponType: 'Mace',
  components: [
    GIFT_OF_MASTERY,
    GIFT_OF_FORTUNE,
    {
      id: 'gift_of_moot',
      name: 'Gift of The Moot',
      materials: [
        { id: 19716, name: 'Gift of Celebration', quantity: 1, rarity: 'Exotic' },
        { id: 19717, name: 'Gift of the Festival', quantity: 1, rarity: 'Exotic' },
        { id: 24500, name: 'Crystalline Lodestone', quantity: 250, rarity: 'Exotic' },
        { id: 46747, name: 'Mystic Tribute', quantity: 1, rarity: 'Legendary' },
      ],
    },
    {
      id: 'precursor_energizer',
      name: 'The Energizer (Precursor)',
      materials: [
        { id: 29183, name: 'The Energizer', quantity: 1, rarity: 'Exotic' },
      ],
    },
  ],
};

// GENERATION 2 LEGENDARY WEAPONS

// Common materials for Gen 2
const GIFT_OF_MASTERY_GEN2: ComponentRequirement = {
  id: 'gift_of_mastery_gen2',
  name: 'Gift of Mastery (Gen 2)',
  materials: [
    { id: 19675, name: 'Gift of Exploration', quantity: 2, rarity: 'Legendary' },
    { id: 19678, name: 'Bloodstone Shard', quantity: 1, rarity: 'Exotic' },
    { id: 19677, name: 'Gift of Battle', quantity: 1, rarity: 'Exotic', type: 'currency' },
    { id: 19676, name: 'Obsidian Shard', quantity: 250, rarity: 'Rare' },
  ],
};

const MYSTIC_TRIBUTE: ComponentRequirement = {
  id: 'mystic_tribute',
  name: 'Mystic Tribute',
  materials: [
    { id: 70867, name: 'Gift of Condensed Might', quantity: 1, rarity: 'Exotic' },
    { id: 76530, name: 'Gift of Condensed Magic', quantity: 1, rarity: 'Exotic' },
    { id: 19721, name: 'Mystic Clover', quantity: 77, rarity: 'Exotic' },
    { id: 19679, name: 'Obsidian Shard', quantity: 250, rarity: 'Rare' },
  ],
  subComponents: [
    {
      id: 'gift_of_condensed_might',
      name: 'Gift of Condensed Might',
      materials: [
        { id: 24358, name: 'Gift of Fangs', quantity: 1, rarity: 'Exotic' },
        { id: 24357, name: 'Gift of Scales', quantity: 1, rarity: 'Exotic' },
        { id: 24289, name: 'Gift of Claws', quantity: 1, rarity: 'Exotic' },
        { id: 24288, name: 'Gift of Bones', quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'gift_of_condensed_magic',
      name: 'Gift of Condensed Magic',
      materials: [
        { id: 24277, name: 'Gift of Blood', quantity: 1, rarity: 'Exotic' },
        { id: 24276, name: 'Gift of Venom', quantity: 1, rarity: 'Exotic' },
        { id: 24275, name: 'Gift of Totems', quantity: 1, rarity: 'Exotic' },
        { id: 24274, name: 'Gift of Dust', quantity: 1, rarity: 'Exotic' },
      ],
    },
  ],
};

export const NEVERMORE_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'nevermore',
  legendaryName: 'Nevermore',
  generation: 2,
  weaponType: 'Staff',
  components: [
    GIFT_OF_MASTERY_GEN2,
    MYSTIC_TRIBUTE,
    {
      id: 'gift_of_nevermore',
      name: 'Gift of Nevermore',
      materials: [
        { id: 79378, name: 'Gift of the Raven', quantity: 1, rarity: 'Exotic' },
        { id: 79469, name: 'Gift of Nevermore', quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_raven_staff',
      name: 'The Raven Staff (Precursor)',
      materials: [
        { id: 79792, name: 'The Raven Staff', quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const CHUKA_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'chuka_and_champawat',
  legendaryName: 'Chuka and Champawat',
  generation: 2,
  weaponType: 'Short Bow',
  components: [
    GIFT_OF_MASTERY_GEN2,
    MYSTIC_TRIBUTE,
    {
      id: 'gift_of_the_chuka',
      name: 'Gift of the Chuka and Champawat',
      materials: [
        { id: 74997, name: 'Gift of the Tiger', quantity: 1, rarity: 'Exotic' },
        { id: 75013, name: 'Gift of the Chuka and Champawat', quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_tigris',
      name: 'Tigris (Precursor)',
      materials: [
        { id: 76158, name: 'Tigris', quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const ASTRALARIA_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'astralaria',
  legendaryName: 'Astralaria',
  generation: 2,
  weaponType: 'Axe',
  components: [
    GIFT_OF_MASTERY_GEN2,
    MYSTIC_TRIBUTE,
    {
      id: 'gift_of_astralaria',
      name: 'Gift of Astralaria',
      materials: [
        { id: 79672, name: 'Gift of the Cosmos', quantity: 1, rarity: 'Exotic' },
        { id: 79781, name: 'Gift of Astralaria', quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_chaos_axe',
      name: 'Chaos Axe (Precursor)',
      materials: [
        { id: 80111, name: 'Chaos Axe', quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const SHINING_BLADE_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'the_shining_blade',
  legendaryName: 'The Shining Blade',
  generation: 2,
  weaponType: 'Sword',
  components: [
    GIFT_OF_MASTERY_GEN2,
    MYSTIC_TRIBUTE,
    {
      id: 'gift_of_shining_blade',
      name: 'Gift of The Shining Blade',
      materials: [
        { id: 86601, name: 'Gift of the Blade', quantity: 1, rarity: 'Exotic' },
        { id: 86602, name: 'Gift of The Shining Blade', quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_shining_blade',
      name: 'Synergetics Blade (Precursor)',
      materials: [
        { id: 86600, name: 'Synergetics Blade', quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const HOPE_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'h_o_p_e',
  legendaryName: 'H.O.P.E.',
  generation: 2,
  weaponType: 'Pistol',
  components: [
    GIFT_OF_MASTERY_GEN2,
    MYSTIC_TRIBUTE,
    {
      id: 'gift_of_hope',
      name: 'Gift of H.O.P.E.',
      materials: [
        { id: 79447, name: 'Gift of Prosperity', quantity: 1, rarity: 'Exotic' },
        { id: 79597, name: 'Gift of H.O.P.E.', quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_prototype',
      name: 'Prototype (Precursor)',
      materials: [
        { id: 79830, name: 'Prototype', quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const FRENZY_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'frenzy',
  legendaryName: 'Frenzy',
  generation: 2,
  weaponType: 'Longbow',
  components: [
    GIFT_OF_MASTERY_GEN2,
    MYSTIC_TRIBUTE,
    {
      id: 'gift_of_frenzy',
      name: 'Gift of Frenzy',
      materials: [
        { id: 79393, name: 'Gift of the Wild', quantity: 1, rarity: 'Exotic' },
        { id: 79453, name: 'Gift of Frenzy', quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_rage',
      name: 'Rage (Precursor)',
      materials: [
        { id: 79921, name: 'Rage', quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const FLAMES_OF_WAR_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'flames_of_war',
  legendaryName: 'Flames of War',
  generation: 2,
  weaponType: 'Torch',
  components: [
    GIFT_OF_MASTERY_GEN2,
    MYSTIC_TRIBUTE,
    {
      id: 'gift_of_flames',
      name: 'Gift of Flames of War',
      materials: [
        { id: 86444, name: 'Gift of Embers', quantity: 1, rarity: 'Exotic' },
        { id: 86445, name: 'Gift of Flames of War', quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_flames',
      name: 'The Flames of War (Precursor)',
      materials: [
        { id: 86443, name: 'The Flames of War', quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const BINDING_OF_IPOS_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'the_binding_of_ipos',
  legendaryName: 'The Binding of Ipos',
  generation: 2,
  weaponType: 'Focus',
  components: [
    GIFT_OF_MASTERY_GEN2,
    MYSTIC_TRIBUTE,
    {
      id: 'gift_of_ipos',
      name: 'Gift of The Binding of Ipos',
      materials: [
        { id: 86522, name: 'Gift of the Abyss', quantity: 1, rarity: 'Exotic' },
        { id: 86523, name: 'Gift of The Binding of Ipos', quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_binding',
      name: 'The Binding of Ipos (Precursor)',
      materials: [
        { id: 86521, name: 'The Binding of Ipos', quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const SHOOSHADOO_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'shooshadoo',
  legendaryName: 'Shooshadoo',
  generation: 2,
  weaponType: 'Hammer',
  components: [
    GIFT_OF_MASTERY_GEN2,
    MYSTIC_TRIBUTE,
    {
      id: 'gift_of_shooshadoo',
      name: 'Gift of Shooshadoo',
      materials: [
        { id: 86467, name: 'Gift of the Deep', quantity: 1, rarity: 'Exotic' },
        { id: 86468, name: 'Gift of Shooshadoo', quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_shooshadoo',
      name: 'Shooshadoo (Precursor)',
      materials: [
        { id: 86466, name: 'Shooshadoo', quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const EUREKA_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'eureka',
  legendaryName: 'Eureka',
  generation: 2,
  weaponType: 'Rifle',
  components: [
    GIFT_OF_MASTERY_GEN2,
    MYSTIC_TRIBUTE,
    {
      id: 'gift_of_eureka',
      name: 'Gift of Eureka',
      materials: [
        { id: 86329, name: 'Gift of Experimentation', quantity: 1, rarity: 'Exotic' },
        { id: 86330, name: 'Gift of Eureka', quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_eureka',
      name: 'Eureka (Precursor)',
      materials: [
        { id: 86328, name: 'Eureka', quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const SHARUR_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'sharur',
  legendaryName: 'Sharur',
  generation: 2,
  weaponType: 'Mace',
  components: [
    GIFT_OF_MASTERY_GEN2,
    MYSTIC_TRIBUTE,
    {
      id: 'gift_of_sharur',
      name: 'Gift of Sharur',
      materials: [
        { id: 86549, name: 'Gift of the Voice', quantity: 1, rarity: 'Exotic' },
        { id: 86550, name: 'Gift of Sharur', quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_sharur',
      name: 'Sharur (Precursor)',
      materials: [
        { id: 86548, name: 'Sharur', quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const HMS_DIVINITY_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'hms_divinity',
  legendaryName: 'HMS Divinity',
  generation: 2,
  weaponType: 'Greatsword',
  components: [
    GIFT_OF_MASTERY_GEN2,
    MYSTIC_TRIBUTE,
    {
      id: 'gift_of_hms_divinity',
      name: 'Gift of HMS Divinity',
      materials: [
        { id: 86658, name: 'Gift of the Skies', quantity: 1, rarity: 'Exotic' },
        { id: 86659, name: 'Gift of HMS Divinity', quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_hms_divinity',
      name: 'HMS Divinity (Precursor)',
      materials: [
        { id: 86657, name: 'HMS Divinity', quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const XIUQUATL_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'xiuquatl',
  legendaryName: 'Xiuquatl',
  generation: 2,
  weaponType: 'Scepter',
  components: [
    GIFT_OF_MASTERY_GEN2,
    MYSTIC_TRIBUTE,
    {
      id: 'gift_of_xiuquatl',
      name: 'Gift of Xiuquatl',
      materials: [
        { id: 86617, name: 'Gift of the Serpent', quantity: 1, rarity: 'Exotic' },
        { id: 86618, name: 'Gift of Xiuquatl', quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_xiuquatl',
      name: 'Xiuquatl (Precursor)',
      materials: [
        { id: 86616, name: 'Xiuquatl', quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const EXORDIUM_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'exordium',
  legendaryName: 'Exordium',
  generation: 2,
  weaponType: 'Dagger',
  components: [
    GIFT_OF_MASTERY_GEN2,
    MYSTIC_TRIBUTE,
    {
      id: 'gift_of_exordium',
      name: 'Gift of Exordium',
      materials: [
        { id: 86574, name: 'Gift of Creation', quantity: 1, rarity: 'Exotic' },
        { id: 86575, name: 'Gift of Exordium', quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_exordium',
      name: 'Exordium (Precursor)',
      materials: [
        { id: 86573, name: 'Exordium', quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const PHARUS_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'pharus',
  legendaryName: 'Pharus',
  generation: 2,
  weaponType: 'Warhorn',
  components: [
    GIFT_OF_MASTERY_GEN2,
    MYSTIC_TRIBUTE,
    {
      id: 'gift_of_pharus',
      name: 'Gift of Pharus',
      materials: [
        { id: 86488, name: 'Gift of Light', quantity: 1, rarity: 'Exotic' },
        { id: 86489, name: 'Gift of Pharus', quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_pharus',
      name: 'Pharus (Precursor)',
      materials: [
        { id: 86487, name: 'Pharus', quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const CLAW_OF_KHAN_UR_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'claw_of_the_khan-ur',
  legendaryName: 'Claw of the Khan-Ur',
  generation: 2,
  weaponType: 'Dagger',
  components: [
    GIFT_OF_MASTERY_GEN2,
    MYSTIC_TRIBUTE,
    {
      id: 'gift_of_khan_ur',
      name: 'Gift of the Claw of the Khan-Ur',
      materials: [
        { id: 86631, name: 'Gift of the Khan-Ur', quantity: 1, rarity: 'Exotic' },
        { id: 86632, name: 'Gift of the Claw of the Khan-Ur', quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_claw',
      name: 'Claw of the Khan-Ur (Precursor)',
      materials: [
        { id: 86630, name: 'Claw of the Khan-Ur', quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

// GENERATION 3 LEGENDARY WEAPONS (End of Dragons - Aurene)

// Common materials for Gen 3
const DRACONIC_TRIBUTE: ComponentRequirement = {
  id: 'draconic_tribute',
  name: 'Draconic Tribute',
  materials: [
    { id: 19721, name: 'Mystic Clover', quantity: 38, rarity: 'Exotic' },
    { id: 70867, name: 'Gift of Condensed Might', quantity: 1, rarity: 'Exotic' },
    { id: 76530, name: 'Gift of Condensed Magic', quantity: 1, rarity: 'Exotic' },
    { id: 97099, name: 'Amalgamated Draconic Lodestone', quantity: 5, rarity: 'Ascended' },
  ],
  subComponents: [
    {
      id: 'gift_of_condensed_might',
      name: 'Gift of Condensed Might',
      materials: [
        { id: 24358, name: 'Gift of Fangs', quantity: 1, rarity: 'Exotic' },
        { id: 24357, name: 'Gift of Scales', quantity: 1, rarity: 'Exotic' },
        { id: 24289, name: 'Gift of Claws', quantity: 1, rarity: 'Exotic' },
        { id: 24288, name: 'Gift of Bones', quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'gift_of_condensed_magic',
      name: 'Gift of Condensed Magic',
      materials: [
        { id: 24277, name: 'Gift of Blood', quantity: 1, rarity: 'Exotic' },
        { id: 24276, name: 'Gift of Venom', quantity: 1, rarity: 'Exotic' },
        { id: 24275, name: 'Gift of Totems', quantity: 1, rarity: 'Exotic' },
        { id: 24274, name: 'Gift of Dust', quantity: 1, rarity: 'Exotic' },
      ],
    },
  ],
};

const GIFT_OF_JADE_MASTERY: ComponentRequirement = {
  id: 'gift_of_jade_mastery',
  name: 'Gift of Jade Mastery',
  materials: [
    { id: 96722, name: 'Gift of the Dragon Empire', quantity: 1, rarity: 'Exotic' },
    { id: 96052, name: 'Jade Runestone', quantity: 100, rarity: 'Rare' },
    { id: 97099, name: 'Chunk of Pure Jade', quantity: 200, rarity: 'Rare' },
    { id: 96937, name: 'Chunk of Ancient Ambergris', quantity: 100, rarity: 'Rare' },
    { id: 19678, name: 'Bloodstone Shard', quantity: 1, rarity: 'Exotic' },
    { id: 19676, name: 'Spirit Shard', quantity: 200, rarity: 'Rare', type: 'currency' },
  ],
};
export const AURENES_BITE_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'aurenes_bite',
  legendaryName: "Aurene's Bite",
  generation: 3,
  weaponType: 'Greatsword',
  components: [
    GIFT_OF_JADE_MASTERY,
    DRACONIC_TRIBUTE,
    {
      id: 'gift_of_aurenes_bite',
      name: "Gift of Aurene's Bite",
      materials: [
        { id: 97077, name: "Gift of Aurene's Bite", quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_dragons_bite',
      name: "Dragon's Bite (Precursor)",
      materials: [
        { id: 97076, name: "Dragon's Bite", quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const AURENES_CLAW_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'aurenes_claw',
  legendaryName: "Aurene's Claw",
  generation: 3,
  weaponType: 'Dagger',
  components: [
    GIFT_OF_JADE_MASTERY,
    DRACONIC_TRIBUTE,
    {
      id: 'gift_of_aurenes_claw',
      name: "Gift of Aurene's Claw",
      materials: [
        { id: 97138, name: "Gift of Aurene's Claw", quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_aurene_claw',
      name: "Aurene's Talon (Precursor)",
      materials: [
        { id: 97137, name: "Aurene's Talon", quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const AURENES_FLIGHT_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'aurenes_flight',
  legendaryName: "Aurene's Flight",
  generation: 3,
  weaponType: 'Longbow',
  components: [
    GIFT_OF_JADE_MASTERY,
    DRACONIC_TRIBUTE,
    {
      id: 'gift_of_aurenes_flight',
      name: "Gift of Aurene's Flight",
      materials: [
        { id: 96937, name: "Gift of Aurene's Flight", quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_aurene_flight',
      name: "Aurene's Wing (Precursor)",
      materials: [
        { id: 96936, name: "Aurene's Wing", quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const AURENES_GAZE_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'aurenes_gaze',
  legendaryName: "Aurene's Gaze",
  generation: 3,
  weaponType: 'Focus',
  components: [
    GIFT_OF_JADE_MASTERY,
    DRACONIC_TRIBUTE,
    {
      id: 'gift_of_aurenes_gaze',
      name: "Gift of Aurene's Gaze",
      materials: [
        { id: 97590, name: "Gift of Aurene's Gaze", quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_aurene_gaze',
      name: "Aurene's Eye (Precursor)",
      materials: [
        { id: 97589, name: "Aurene's Eye", quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const AURENES_PERSUASION_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'aurenes_persuasion',
  legendaryName: "Aurene's Persuasion",
  generation: 3,
  weaponType: 'Rifle',
  components: [
    GIFT_OF_JADE_MASTERY,
    DRACONIC_TRIBUTE,
    {
      id: 'gift_of_aurenes_persuasion',
      name: "Gift of Aurene's Persuasion",
      materials: [
        { id: 97165, name: "Gift of Aurene's Persuasion", quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_aurene_persuasion',
      name: "Aurene's Argument (Precursor)",
      materials: [
        { id: 97164, name: "Aurene's Argument", quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const AURENES_INSIGHT_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'aurenes_insight',
  legendaryName: "Aurene's Insight",
  generation: 3,
  weaponType: 'Staff',
  components: [
    GIFT_OF_JADE_MASTERY,
    DRACONIC_TRIBUTE,
    {
      id: 'gift_of_aurenes_insight',
      name: "Gift of Aurene's Insight",
      materials: [
        { id: 96652, name: "Gift of Aurene's Insight", quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_aurene_insight',
      name: "Aurene's Vision (Precursor)",
      materials: [
        { id: 96651, name: "Aurene's Vision", quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const AURENES_SCALE_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'aurenes_scale',
  legendaryName: "Aurene's Scale",
  generation: 3,
  weaponType: 'Shield',
  components: [
    GIFT_OF_JADE_MASTERY,
    DRACONIC_TRIBUTE,
    {
      id: 'gift_of_aurenes_scale',
      name: "Gift of Aurene's Scale",
      materials: [
        { id: 97099, name: "Gift of Aurene's Scale", quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_aurene_scale',
      name: "Aurene's Shard (Precursor)",
      materials: [
        { id: 97098, name: "Aurene's Shard", quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const AURENES_TAIL_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'aurenes_tail',
  legendaryName: "Aurene's Tail",
  generation: 3,
  weaponType: 'Mace',
  components: [
    GIFT_OF_JADE_MASTERY,
    DRACONIC_TRIBUTE,
    {
      id: 'gift_of_aurenes_tail',
      name: "Gift of Aurene's Tail",
      materials: [
        { id: 97783, name: "Gift of Aurene's Tail", quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_aurene_tail',
      name: "Aurene's Spine (Precursor)",
      materials: [
        { id: 97782, name: "Aurene's Spine", quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const AURENES_RENDING_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'aurenes_rending',
  legendaryName: "Aurene's Rending",
  generation: 3,
  weaponType: 'Axe',
  components: [
    GIFT_OF_JADE_MASTERY,
    DRACONIC_TRIBUTE,
    {
      id: 'gift_of_aurenes_rending',
      name: "Gift of Aurene's Rending",
      materials: [
        { id: 96937, name: "Gift of Aurene's Rending", quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_aurene_rending',
      name: "Aurene's Edge (Precursor)",
      materials: [
        { id: 96936, name: "Aurene's Edge", quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const AURENES_VOICE_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'aurenes_voice',
  legendaryName: "Aurene's Voice",
  generation: 3,
  weaponType: 'Warhorn',
  components: [
    GIFT_OF_JADE_MASTERY,
    DRACONIC_TRIBUTE,
    {
      id: 'gift_of_aurenes_voice',
      name: "Gift of Aurene's Voice",
      materials: [
        { id: 97829, name: "Gift of Aurene's Voice", quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_aurene_voice',
      name: "Aurene's Cry (Precursor)",
      materials: [
        { id: 97828, name: "Aurene's Cry", quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const AURENES_WEIGHT_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'aurenes_weight',
  legendaryName: "Aurene's Weight",
  generation: 3,
  weaponType: 'Hammer',
  components: [
    GIFT_OF_JADE_MASTERY,
    DRACONIC_TRIBUTE,
    {
      id: 'gift_of_aurenes_weight',
      name: "Gift of Aurene's Weight",
      materials: [
        { id: 96203, name: "Gift of Aurene's Weight", quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_aurene_weight',
      name: "Aurene's Heft (Precursor)",
      materials: [
        { id: 96202, name: "Aurene's Heft", quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const AURENES_WING_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'aurenes_wing',
  legendaryName: "Aurene's Wing",
  generation: 3,
  weaponType: 'Shortbow',
  components: [
    GIFT_OF_JADE_MASTERY,
    DRACONIC_TRIBUTE,
    {
      id: 'gift_of_aurenes_wing',
      name: "Gift of Aurene's Wing",
      materials: [
        { id: 97217, name: "Gift of Aurene's Wing", quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_aurene_wing',
      name: "Aurene's Pinion (Precursor)",
      materials: [
        { id: 97216, name: "Aurene's Pinion", quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const AURENES_WISDOM_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'aurenes_wisdom',
  legendaryName: "Aurene's Wisdom",
  generation: 3,
  weaponType: 'Scepter',
  components: [
    GIFT_OF_JADE_MASTERY,
    DRACONIC_TRIBUTE,
    {
      id: 'gift_of_aurenes_wisdom',
      name: "Gift of Aurene's Wisdom",
      materials: [
        { id: 97413, name: "Gift of Aurene's Wisdom", quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_aurene_wisdom',
      name: "Aurene's Knowledge (Precursor)",
      materials: [
        { id: 97412, name: "Aurene's Knowledge", quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

// Missing Gen 3 legendaries - To be added
export const AURENES_FANG_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'aurenes_fang',
  legendaryName: "Aurene's Fang",
  generation: 3,
  weaponType: 'Sword',
  components: [
    GIFT_OF_JADE_MASTERY,
    DRACONIC_TRIBUTE,
    {
      id: 'gift_of_aurenes_fang',
      name: "Gift of Aurene's Fang",
      materials: [
        { id: 95675, name: "Gift of Aurene's Fang", quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_aurene_fang',
      name: "Aurene's Tooth (Precursor)",
      materials: [
        { id: 95674, name: "Aurene's Tooth", quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const AURENES_ARGUMENT_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'aurenes_argument',
  legendaryName: "Aurene's Argument",
  generation: 3,
  weaponType: 'Pistol',
  components: [
    GIFT_OF_JADE_MASTERY,
    DRACONIC_TRIBUTE,
    {
      id: 'gift_of_aurenes_argument',
      name: "Gift of Aurene's Argument",
      materials: [
        { id: 95808, name: "Gift of Aurene's Argument", quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_aurene_argument',
      name: "Aurene's Debate (Precursor)",
      materials: [
        { id: 95807, name: "Aurene's Debate", quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

export const AURENES_BREATH_MATERIALS: LegendaryMaterialData = {
  legendaryId: 'aurenes_breath',
  legendaryName: "Aurene's Breath",
  generation: 3,
  weaponType: 'Torch',
  components: [
    GIFT_OF_JADE_MASTERY,
    DRACONIC_TRIBUTE,
    {
      id: 'gift_of_aurenes_breath',
      name: "Gift of Aurene's Breath",
      materials: [
        { id: 97099, name: "Gift of Aurene's Breath", quantity: 1, rarity: 'Exotic' },
      ],
    },
    {
      id: 'precursor_aurene_breath',
      name: "Aurene's Exhalation (Precursor)",
      materials: [
        { id: 97098, name: "Aurene's Exhalation", quantity: 1, rarity: 'Ascended' },
      ],
    },
  ],
};

// Export all materials data
export const ALL_LEGENDARY_MATERIALS: LegendaryMaterialData[] = [
  // Gen 1
  ETERNITY_MATERIALS,
  SUNRISE_MATERIALS,
  TWILIGHT_MATERIALS,
  BOLT_MATERIALS,
  FLAMESEEKER_MATERIALS,
  INCINERATOR_MATERIALS,
  DREAMER_MATERIALS,
  FROSTFANG_MATERIALS,
  JUGGERNAUT_MATERIALS,
  METEORLOGICUS_MATERIALS,
  MINSTREL_MATERIALS,
  PREDATOR_MATERIALS,
  KUDZU_MATERIALS,
  QUIP_MATERIALS,
  RODGORT_MATERIALS,
  BIFROST_MATERIALS,
  HOWLER_MATERIALS,
  MOOT_MATERIALS,
  // Gen 2
  NEVERMORE_MATERIALS,
  CHUKA_MATERIALS,
  ASTRALARIA_MATERIALS,
  SHINING_BLADE_MATERIALS,
  HOPE_MATERIALS,
  FRENZY_MATERIALS,
  FLAMES_OF_WAR_MATERIALS,
  BINDING_OF_IPOS_MATERIALS,
  SHOOSHADOO_MATERIALS,
  EUREKA_MATERIALS,
  SHARUR_MATERIALS,
  HMS_DIVINITY_MATERIALS,
  XIUQUATL_MATERIALS,
  EXORDIUM_MATERIALS,
  PHARUS_MATERIALS,
  CLAW_OF_KHAN_UR_MATERIALS,
  // Gen 3 - End of Dragons (Aurene)
  AURENES_TAIL_MATERIALS,
  AURENES_FANG_MATERIALS,
  AURENES_WEIGHT_MATERIALS,
  AURENES_ARGUMENT_MATERIALS,
  AURENES_SCALE_MATERIALS,
  AURENES_CLAW_MATERIALS,
  AURENES_WISDOM_MATERIALS,
  AURENES_BITE_MATERIALS,
  AURENES_INSIGHT_MATERIALS,
  AURENES_RENDING_MATERIALS,
  AURENES_WING_MATERIALS,
  AURENES_BREATH_MATERIALS,
  AURENES_GAZE_MATERIALS,
  AURENES_PERSUASION_MATERIALS,
  AURENES_FLIGHT_MATERIALS,
  AURENES_VOICE_MATERIALS,
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
