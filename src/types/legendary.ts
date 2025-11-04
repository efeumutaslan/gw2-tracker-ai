/**
 * Legendary Weapon and Material Tracking Types
 */

export type MaterialAcquisitionType =
  | 'vendor'
  | 'mystic_forge'
  | 'crafting'
  | 'achievement'
  | 'reward_track'
  | 'world_completion'
  | 'salvage'
  | 'loot'
  | 'trading_post'
  | 'multiple';

export type CurrencyType =
  | 'gold'
  | 'karma'
  | 'laurels'
  | 'fractal_relics'
  | 'spirit_shards'
  | 'volatile_magic'
  | 'magnetite_shards'
  | 'prophet_shards'
  | 'mystic_coins';

export interface VendorInfo {
  name: string;
  location: string;
  waypointLink?: string;
  currency: CurrencyType;
  cost: number;
  alternativeCost?: {
    currency: CurrencyType;
    cost: number;
  }[];
}

export interface MysticForgeRecipe {
  ingredients: {
    itemId?: number;
    itemName: string;
    quantity: number;
  }[];
  outputQuantity?: string; // e.g., "0.308 average" for Mystic Clovers
  successRate?: string;
  notes?: string;
}

export interface AcquisitionMethod {
  type: MaterialAcquisitionType;
  description: string;
  vendors?: VendorInfo[];
  mysticForge?: MysticForgeRecipe;
  achievementId?: number;
  achievementName?: string;
  rewardTrack?: string;
  notes?: string;
  efficiency?: 'high' | 'medium' | 'low'; // Farming efficiency rating
}

export interface MaterialRequirement {
  itemId?: number; // GW2 API item ID if available
  itemName: string;
  quantity: number;
  owned: number; // User's current amount
  reserved: number; // Reserved for other legendaries
  available: number; // owned - reserved
  completed: boolean; // available >= quantity
  wikiLink: string;
  icon?: string; // Item icon URL from GW2 API
  acquisitionMethods: AcquisitionMethod[];
  subComponents?: MaterialRequirement[]; // Hierarchical structure
}

export interface LegendaryComponent {
  id: string;
  name: string;
  description?: string;
  wikiLink: string;
  materials: MaterialRequirement[];
  completed: boolean;
  progress: number; // 0-100
}

export interface LegendaryWeapon {
  id: string;
  name: string;
  type: 'greatsword' | 'sword' | 'axe' | 'mace' | 'hammer' | 'staff' | 'rifle' | 'shortbow' | 'longbow' | 'pistol' | 'scepter' | 'focus' | 'dagger' | 'torch' | 'warhorn' | 'shield';
  generation: 1 | 2 | 3; // Gen 1, 2, or 3 legendary
  icon: string;
  wikiLink: string;
  description?: string;

  // Main components (top-level gifts)
  components: LegendaryComponent[];

  // Overall progress
  overallProgress: number; // 0-100
  totalMaterialsRequired: number;
  totalMaterialsOwned: number;

  // Tracking info
  isTracking: boolean;
  startedAt?: Date;
  estimatedCompletionDays?: number;
}

export interface UserLegendaryTracking {
  id: string;
  userId: string;
  legendaryId: string;
  isTracking: boolean;
  materialsReserved: {
    [itemId: string]: number; // itemId -> reserved quantity
  };
  progress: number;
  notes?: string;
  startedAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// Eternity example data structure
export const ETERNITY_DATA: Omit<LegendaryWeapon, 'id' | 'overallProgress' | 'totalMaterialsOwned' | 'isTracking'> = {
  name: 'Eternity',
  type: 'greatsword',
  generation: 1,
  icon: 'https://render.guildwars2.com/file/E7FFB131E297FE6F7AA4C24D98E7D6F5AD12E7B4/61468.png',
  wikiLink: 'https://wiki.guildwars2.com/wiki/Eternity',
  description: 'A legendary greatsword combining the powers of Sunrise and Twilight.',
  totalMaterialsRequired: 0, // Calculated dynamically

  components: [
    {
      id: 'gifts_of_mastery',
      name: 'Gifts of Mastery (x2)',
      description: 'Requires world completion and PvP',
      wikiLink: 'https://wiki.guildwars2.com/wiki/Gift_of_Mastery',
      completed: false,
      progress: 0,
      materials: [
        {
          itemId: 24295,
          itemName: 'Bloodstone Shard',
          quantity: 2,
          owned: 0,
          reserved: 0,
          available: 0,
          completed: false,
          wikiLink: 'https://wiki.guildwars2.com/wiki/Bloodstone_Shard',
          acquisitionMethods: [
            {
              type: 'vendor',
              description: 'Purchase from Mystic Forge vendors',
              efficiency: 'high',
              vendors: [
                {
                  name: 'Miyani',
                  location: 'Trader\'s Forum, Lion\'s Arch',
                  waypointLink: '[&BNAHAAA=]',
                  currency: 'spirit_shards',
                  cost: 200,
                },
                {
                  name: 'Mystic Forge Attendant',
                  location: 'Multiple locations (Divinity\'s Reach, Stonemist Castle, etc.)',
                  currency: 'spirit_shards',
                  cost: 200,
                },
              ],
            },
          ],
        },
        {
          itemId: 19925,
          itemName: 'Obsidian Shard',
          quantity: 500,
          owned: 0,
          reserved: 0,
          available: 0,
          completed: false,
          wikiLink: 'https://wiki.guildwars2.com/wiki/Obsidian_Shard',
          acquisitionMethods: [
            {
              type: 'vendor',
              description: 'Purchase from various vendors',
              efficiency: 'high',
              vendors: [
                {
                  name: 'Laurel Merchant',
                  location: 'Multiple hub locations',
                  currency: 'laurels',
                  cost: 1, // 1 laurel = 1 shard
                },
                {
                  name: 'BUY-4373',
                  location: 'Mistlock Observatory',
                  currency: 'fractal_relics',
                  cost: 8.33, // 25 relics = 3 shards
                },
                {
                  name: 'Tactician Deathstrider',
                  location: 'Straits of Devastation',
                  currency: 'karma',
                  cost: 2100,
                },
              ],
            },
            {
              type: 'loot',
              description: 'Drops from various containers and chests',
              efficiency: 'medium',
              notes: 'Available from Gear Boxes, reward caches, and map bonus rewards',
            },
          ],
        },
        {
          itemName: 'Gift of Exploration',
          quantity: 2,
          owned: 0,
          reserved: 0,
          available: 0,
          completed: false,
          wikiLink: 'https://wiki.guildwars2.com/wiki/Gift_of_Exploration',
          acquisitionMethods: [
            {
              type: 'world_completion',
              description: 'Complete 100% world exploration',
              efficiency: 'medium',
              notes: 'Requires completing all waypoints, POIs, vistas, and hearts in core Tyria',
            },
          ],
        },
        {
          itemName: 'Gift of Battle',
          quantity: 2,
          owned: 0,
          reserved: 0,
          available: 0,
          completed: false,
          wikiLink: 'https://wiki.guildwars2.com/wiki/Gift_of_Battle',
          acquisitionMethods: [
            {
              type: 'reward_track',
              description: 'Complete Gift of Battle reward track in WvW or PvP',
              efficiency: 'medium',
              rewardTrack: 'Gift of Battle',
              notes: 'Takes approximately 8 hours of WvW/PvP gameplay',
            },
          ],
        },
      ],
    },
    {
      id: 'gifts_of_fortune',
      name: 'Gifts of Fortune (x2)',
      description: 'Requires Mystic Clovers and rare materials',
      wikiLink: 'https://wiki.guildwars2.com/wiki/Gift_of_Fortune',
      completed: false,
      progress: 0,
      materials: [
        {
          itemName: 'Mystic Clover',
          quantity: 154, // 77 x 2
          owned: 0,
          reserved: 0,
          available: 0,
          completed: false,
          wikiLink: 'https://wiki.guildwars2.com/wiki/Mystic_Clover',
          acquisitionMethods: [
            {
              type: 'mystic_forge',
              description: 'Mystic Forge recipe with ~30% success rate',
              efficiency: 'medium',
              mysticForge: {
                ingredients: [
                  { itemName: 'Obsidian Shard', quantity: 1 },
                  { itemName: 'Mystic Coin', quantity: 1 },
                  { itemName: 'Glob of Ectoplasm', quantity: 1 },
                  { itemName: 'Philosopher\'s Stone', quantity: 6 },
                ],
                outputQuantity: '0.308 average per attempt',
                successRate: '~30%',
              },
            },
            {
              type: 'vendor',
              description: 'Purchase from raid/fractal/strike vendors (weekly limits)',
              efficiency: 'high',
              notes: 'Most efficient method but limited to 10-20 per week',
            },
            {
              type: 'reward_track',
              description: 'Earn from PvP/WvW reward tracks',
              efficiency: 'medium',
              notes: 'Various tracks reward 2-7 clovers',
            },
          ],
        },
        {
          itemId: 19721,
          itemName: 'Glob of Ectoplasm',
          quantity: 500,
          owned: 0,
          reserved: 0,
          available: 0,
          completed: false,
          wikiLink: 'https://wiki.guildwars2.com/wiki/Glob_of_Ectoplasm',
          acquisitionMethods: [
            {
              type: 'salvage',
              description: 'Salvage rare (yellow) or exotic (orange) equipment',
              efficiency: 'high',
              notes: 'Most common method. Use Mystic or Black Lion Salvage Kits',
            },
            {
              type: 'trading_post',
              description: 'Purchase from Trading Post',
              efficiency: 'high',
              notes: 'Current price varies, typically 30-40 silver per glob',
            },
          ],
        },
        // Gift of Might and Gift of Magic would have their own sub-materials here
        // For brevity, showing the structure
      ],
    },
  ],
};
