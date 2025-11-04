/**
 * Crafting Guides for Legendary Weapons
 * Detailed step-by-step instructions for crafting legendary weapons
 */

export interface CraftingStep {
  id: string;
  title: string;
  description: string;
  requirements?: string[];
  tips?: string[];
  estimatedTime?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  substeps?: CraftingStep[];
}

export interface LegendaryCraftingGuide {
  legendaryId: string;
  legendaryName: string;
  overview: string;
  prerequisites: string[];
  estimatedTotalTime: string;
  estimatedTotalCost: string;
  steps: CraftingStep[];
}

// Generation 1 Legendary Crafting Guide Template
export const GEN1_CRAFTING_GUIDE: CraftingStep[] = [
  {
    id: 'gift-of-mastery',
    title: '1. Craft Gift of Mastery',
    description: 'The Gift of Mastery represents your achievements and dedication in Tyria.',
    requirements: [
      '250 Obsidian Shards',
      'Gift of Battle',
      'Gift of Exploration',
      'Bloodstone Shard',
    ],
    tips: [
      'Obsidian Shards can be obtained from various sources including Fractals, raids, and vendors',
      'Gift of Battle requires WvW participation (completing the Gift of Battle reward track)',
      'Gift of Exploration requires 100% world completion',
      'Bloodstone Shard costs 200 Spirit Shards from Miyani in Lion\'s Arch',
    ],
    estimatedTime: '40-80 hours',
    difficulty: 'hard',
    substeps: [
      {
        id: 'obsidian-shards',
        title: 'Collect 250 Obsidian Shards',
        description: 'Obsidian Shards are a rare material needed for legendary crafting.',
        tips: [
          'Farm Fractals of the Mists (daily chests)',
          'Purchase from Temple of Balthazar vendor (Karma)',
          'Obtain from PvP/WvW reward tracks',
          'Purchase from various living world vendors',
        ],
      },
      {
        id: 'gift-of-battle',
        title: 'Obtain Gift of Battle',
        description: 'Complete the Gift of Battle reward track in World vs World.',
        estimatedTime: '8-10 hours',
        tips: [
          'Play WvW and capture objectives for faster track progress',
          'Use WvW reward track boosters to speed up progress',
          'Participate in large-scale battles for maximum participation',
        ],
      },
      {
        id: 'gift-of-exploration',
        title: 'Obtain Gift of Exploration',
        description: 'Complete 100% world exploration of core Tyria.',
        estimatedTime: '30-60 hours',
        tips: [
          'Use teleport to friend feature to reach hard-to-access areas',
          'Complete hearts, waypoints, vistas, and points of interest',
          'Use mounts if available to speed up travel',
          'Join map completion trains in LFG for group events',
        ],
      },
      {
        id: 'bloodstone-shard',
        title: 'Purchase Bloodstone Shard',
        description: 'Buy from Miyani in Lion\'s Arch for 200 Spirit Shards.',
        tips: [
          'Spirit Shards are obtained by leveling up at level 80',
          'Convert tomes of knowledge for quick Spirit Shards',
        ],
      },
    ],
  },
  {
    id: 'gift-of-fortune',
    title: '2. Craft Gift of Fortune',
    description: 'The Gift of Fortune requires a significant investment in materials and gold.',
    requirements: [
      '77 Mystic Clovers',
      '250 Mystic Coins',
      'Gift of Magic (250 Vials of Powerful Blood + 250 Powerful Venom Sacs + 250 Elaborate Totems + 250 Piles of Crystalline Dust)',
      'Gift of Might (250 Armored Scales + 250 Vicious Fangs + 250 Vicious Claws + 250 Ancient Bones)',
    ],
    tips: [
      'Mystic Clovers are the most RNG-dependent part - save your materials',
      'Use the 10-clover recipe for better material efficiency',
      'Buy Mystic Coins from daily login rewards and trading post',
      'Farm T6 materials in Silverwastes, Dragonfall, or Drizzlewood Coast',
    ],
    estimatedTime: '20-40 hours',
    difficulty: 'hard',
    substeps: [
      {
        id: 'mystic-clovers',
        title: 'Obtain 77 Mystic Clovers',
        description: 'Craft Mystic Clovers in the Mystic Forge using various recipes.',
        tips: [
          'Use the 10-clover recipe: 10 Obsidian Shards + 10 Mystic Coins + 10 Ectoplasm + 10 Crystals/Philosopher\'s Stones',
          'Approximately 30-50% success rate per attempt',
          'Alternative: Complete reward tracks in PvP/WvW for guaranteed clovers',
          'Fractal vendors sell 2 clovers per day for Fractal Relics',
          'Save all Mystic Clover rewards from other sources',
        ],
      },
      {
        id: 'mystic-coins',
        title: 'Collect 250 Mystic Coins',
        description: 'Mystic Coins are obtained from daily login rewards and can be purchased.',
        tips: [
          'Daily login rewards give 20 Mystic Coins per month (day 28)',
          'Purchase from Trading Post (can be expensive)',
          'Save all Mystic Coins from reward tracks and chests',
        ],
      },
      {
        id: 'gift-of-magic',
        title: 'Craft Gift of Magic',
        description: 'Combine 250 of each: Vials of Powerful Blood, Powerful Venom Sacs, Elaborate Totems, and Crystalline Dust.',
        tips: [
          'Farm T6 materials in level 80 maps',
          'Purchase from Trading Post',
          'Use Pact Supply Network Agent for cheaper T6 materials',
          'Promote lower tier materials using the Mystic Forge',
        ],
      },
      {
        id: 'gift-of-might',
        title: 'Craft Gift of Might',
        description: 'Combine 250 of each: Armored Scales, Vicious Fangs, Vicious Claws, and Ancient Bones.',
        tips: [
          'Same farming methods as Gift of Magic',
          'Laurel merchants sell T6 material bags',
          'Salvage rare and exotic equipment for materials',
        ],
      },
    ],
  },
  {
    id: 'precursor',
    title: '3. Obtain Precursor Weapon',
    description: 'The precursor is a rare exotic weapon that serves as the base for your legendary.',
    tips: [
      'Option 1: Purchase from Trading Post (most expensive but guaranteed)',
      'Option 2: Craft through precursor collection achievements (long quest chain)',
      'Option 3: Try your luck in the Mystic Forge (very RNG-dependent)',
      'Option 4: Obtain from rare drops in high-level content',
    ],
    estimatedTime: '0-100 hours (depending on method)',
    difficulty: 'hard',
    substeps: [
      {
        id: 'precursor-trading-post',
        title: 'Option A: Buy from Trading Post',
        description: 'The most straightforward but expensive method.',
        tips: [
          'Check current prices before committing',
          'Save gold from daily fractals, raids, and meta events',
          'Sell valuable materials and items you don\'t need',
        ],
      },
      {
        id: 'precursor-collection',
        title: 'Option B: Complete Precursor Collection',
        description: 'Complete a multi-tier achievement to craft your precursor.',
        estimatedTime: '40-100 hours',
        tips: [
          'Start the collection from the Collections tab in your Achievement panel',
          'Each tier has specific tasks: crafting, map completion, dungeons, etc.',
          'More time-consuming but costs less gold overall',
          'Allows you to experience various game content',
        ],
      },
      {
        id: 'precursor-forge',
        title: 'Option C: Mystic Forge RNG',
        description: 'Throw rare/exotic weapons of the same type into the Mystic Forge.',
        tips: [
          'Very unreliable - not recommended unless you\'re feeling lucky',
          'Can be extremely expensive with no guarantee',
          'Best combined with materials you obtain naturally',
        ],
      },
    ],
  },
  {
    id: 'weapon-specific-gift',
    title: '4. Craft Weapon-Specific Gift',
    description: 'Each legendary requires a unique gift specific to that weapon type.',
    requirements: [
      'Gift of [Weapon Type] - varies by weapon',
      '100 Icy Runestones (or weapon-specific material)',
      'Sigil of [specific type]',
      'Various weapon-specific materials',
    ],
    tips: [
      'Check the specific recipe for your legendary weapon',
      'Icy Runestones require dungeon tokens from specific dungeons',
      'Some gifts require map currencies from specific zones',
    ],
    estimatedTime: '10-20 hours',
    difficulty: 'medium',
  },
  {
    id: 'forge-legendary',
    title: '5. Forge Your Legendary',
    description: 'Combine all four components in the Mystic Forge to create your legendary weapon!',
    requirements: [
      'Precursor Weapon',
      'Gift of Mastery',
      'Gift of Fortune',
      'Weapon-Specific Gift',
    ],
    tips: [
      'Double-check you have all components before throwing them in',
      'The Mystic Forge is located in Lion\'s Arch',
      'Take a screenshot of this momentous occasion!',
      'Your legendary will have unique visual effects and can freely change stats',
    ],
    estimatedTime: '5 minutes',
    difficulty: 'easy',
  },
];

// Eternity specific guide (combines Sunrise and Twilight)
export const ETERNITY_GUIDE: LegendaryCraftingGuide = {
  legendaryId: 'eternity',
  legendaryName: 'Eternity',
  overview: 'Eternity is the ultimate legendary greatsword, combining the powers of both Sunrise and Twilight. This is one of the most challenging legendaries to craft as it requires crafting two other legendary weapons first.',
  prerequisites: [
    'Must craft both Sunrise and Twilight first',
    'All prerequisites from both Sunrise and Twilight',
    'Access to the Mystic Forge',
  ],
  estimatedTotalTime: '200-400 hours',
  estimatedTotalCost: '6,000-10,000 gold',
  steps: [
    {
      id: 'craft-sunrise',
      title: '1. Craft Sunrise',
      description: 'Follow the complete crafting guide for Sunrise, the legendary greatsword of dawn.',
      requirements: ['All Sunrise components'],
      estimatedTime: '100-200 hours',
      difficulty: 'hard',
      substeps: GEN1_CRAFTING_GUIDE,
    },
    {
      id: 'craft-twilight',
      title: '2. Craft Twilight',
      description: 'Follow the complete crafting guide for Twilight, the legendary greatsword of dusk.',
      requirements: ['All Twilight components'],
      estimatedTime: '100-200 hours',
      difficulty: 'hard',
      substeps: GEN1_CRAFTING_GUIDE,
    },
    {
      id: 'combine-eternity',
      title: '3. Combine into Eternity',
      description: 'Take both Sunrise and Twilight to the Mystic Forge in Lion\'s Arch and combine them.',
      requirements: ['Sunrise', 'Twilight'],
      tips: [
        'Make sure both weapons are in your inventory',
        'Simply place both in the Mystic Forge',
        'No additional materials required',
        'This creates a unique weapon that combines both day and night effects',
      ],
      estimatedTime: '5 minutes',
      difficulty: 'easy',
    },
  ],
};

// Helper function to get crafting guide
export function getCraftingGuide(legendaryId: string): LegendaryCraftingGuide | null {
  if (legendaryId === 'eternity') {
    return ETERNITY_GUIDE;
  }

  // For other Gen 1 legendaries, return a generic Gen 1 guide
  return {
    legendaryId,
    legendaryName: 'Legendary Weapon',
    overview: 'Crafting a Generation 1 legendary weapon is an epic journey that will test your dedication and skills across all game modes.',
    prerequisites: [
      'Level 80 character',
      'Access to all core Tyria maps',
      'Significant gold investment (2,000-4,000 gold)',
      'Time investment (80-150 hours)',
    ],
    estimatedTotalTime: '80-150 hours',
    estimatedTotalCost: '2,000-4,000 gold',
    steps: GEN1_CRAFTING_GUIDE,
  };
}
