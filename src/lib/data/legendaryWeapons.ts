/**
 * Legendary Weapons Data
 * Comprehensive list of all Gen 1, 2, and 3 legendary weapons
 */

export interface LegendaryWeaponBasic {
  id: string;
  name: string;
  type: 'greatsword' | 'sword' | 'axe' | 'mace' | 'hammer' | 'staff' | 'rifle' | 'shortbow' | 'longbow' | 'pistol' | 'scepter' | 'focus' | 'dagger' | 'torch' | 'warhorn' | 'shield';
  generation: 1 | 2 | 3;
  icon: string;
  wikiLink: string;
  description?: string;
}

export const LEGENDARY_WEAPONS: LegendaryWeaponBasic[] = [
  // Generation 1 - Classic Legendaries
  {
    id: 'eternity',
    name: 'Eternity',
    type: 'greatsword',
    generation: 1,
    icon: '/images/legendary/eternity.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/Eternity',
    description: 'A legendary greatsword combining the powers of Sunrise and Twilight.',
  },
  {
    id: 'sunrise',
    name: 'Sunrise',
    type: 'greatsword',
    generation: 1,
    icon: '/images/legendary/sunrise.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/Sunrise',
    description: 'The legendary greatsword of dawn.',
  },
  {
    id: 'twilight',
    name: 'Twilight',
    type: 'greatsword',
    generation: 1,
    icon: '/images/legendary/twilight.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/Twilight',
    description: 'The legendary greatsword of dusk.',
  },
  {
    id: 'bolt',
    name: 'Bolt',
    type: 'sword',
    generation: 1,
    icon: '/images/legendary/bolt.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/Bolt',
    description: 'A legendary sword crackling with lightning.',
  },
  {
    id: 'the_flameseeker_prophecies',
    name: 'The Flameseeker Prophecies',
    type: 'shield',
    generation: 1,
    icon: '/images/legendary/the_flameseeker_prophecies.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/The_Flameseeker_Prophecies',
    description: 'A legendary shield inscribed with ancient prophecies.',
  },
  {
    id: 'incinerator',
    name: 'Incinerator',
    type: 'dagger',
    generation: 1,
    icon: '/images/legendary/incinerator.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/Incinerator',
    description: 'A legendary dagger wreathed in flames.',
  },
  {
    id: 'the_dreamer',
    name: 'The Dreamer',
    type: 'shortbow',
    generation: 1,
    icon: '/images/legendary/the_dreamer.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/The_Dreamer',
    description: 'A legendary shortbow that shoots rainbows and unicorns.',
  },
  {
    id: 'frostfang',
    name: 'Frostfang',
    type: 'axe',
    generation: 1,
    icon: '/images/legendary/frostfang.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/Frostfang',
    description: 'A legendary axe of ice and winter.',
  },
  {
    id: 'the_juggernaut',
    name: 'The Juggernaut',
    type: 'hammer',
    generation: 1,
    icon: '/images/legendary/the_juggernaut.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/The_Juggernaut',
    description: 'An unstoppable legendary hammer.',
  },
  {
    id: 'meteorlogicus',
    name: 'Meteorlogicus',
    type: 'scepter',
    generation: 1,
    icon: '/images/legendary/meteorlogicus.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/Meteorlogicus',
    description: 'A legendary scepter of celestial power.',
  },
  {
    id: 'the_minstrel',
    name: 'The Minstrel',
    type: 'focus',
    generation: 1,
    icon: '/images/legendary/the_minstrel.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/The_Minstrel',
    description: 'A legendary musical focus.',
  },
  {
    id: 'the_predator',
    name: 'The Predator',
    type: 'rifle',
    generation: 1,
    icon: '/images/legendary/the_predator.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/The_Predator',
    description: 'A legendary high-tech rifle.',
  },
  {
    id: 'kudzu',
    name: 'Kudzu',
    type: 'longbow',
    generation: 1,
    icon: '/images/legendary/kudzu.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/Kudzu',
    description: 'A legendary longbow of nature.',
  },
  {
    id: 'quip',
    name: 'Quip',
    type: 'pistol',
    generation: 1,
    icon: '/images/legendary/quip.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/Quip',
    description: 'A legendary festive pistol.',
  },
  {
    id: 'rodgorts_flame',
    name: "Rodgort's Flame",
    type: 'torch',
    generation: 1,
    icon: '/images/legendary/rodgorts_flame.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/Rodgort%27s_Flame',
    description: 'A legendary torch of eternal flame.',
  },
  {
    id: 'the_bifrost',
    name: 'The Bifrost',
    type: 'staff',
    generation: 1,
    icon: '/images/legendary/the_bifrost.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/The_Bifrost',
    description: 'A legendary rainbow staff.',
  },
  {
    id: 'the_howler',
    name: 'The Howler',
    type: 'warhorn',
    generation: 1,
    icon: '/images/legendary/the_howler.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/The_Howler',
    description: 'A legendary wolf warhorn.',
  },
  {
    id: 'the_moot',
    name: 'The Moot',
    type: 'mace',
    generation: 1,
    icon: '/images/legendary/the_moot.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/The_Moot',
    description: 'A legendary party mace.',
  },

  // Generation 2 - HoT/PoF Legendaries
  {
    id: 'nevermore',
    name: 'Nevermore',
    type: 'staff',
    generation: 2,
    icon: '/images/legendary/nevermore.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/Nevermore',
    description: 'A legendary raven staff.',
  },
  {
    id: 'chuka_and_champawat',
    name: 'Chuka and Champawat',
    type: 'shortbow',
    generation: 2,
    icon: '/images/legendary/chuka_and_champawat.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/Chuka_and_Champawat',
    description: 'A legendary tiger shortbow.',
  },
  {
    id: 'astralaria',
    name: 'Astralaria',
    type: 'axe',
    generation: 2,
    icon: '/images/legendary/astralaria.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/Astralaria',
    description: 'A legendary celestial axe.',
  },
  {
    id: 'the_shining_blade',
    name: 'The Shining Blade',
    type: 'sword',
    generation: 2,
    icon: '/images/legendary/the_shining_blade.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/The_Shining_Blade',
    description: 'A legendary sword of the Shining Blade.',
  },
  {
    id: 'h_o_p_e',
    name: 'H.O.P.E.',
    type: 'pistol',
    generation: 2,
    icon: '/images/legendary/h_o_p_e.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/H.O.P.E.',
    description: 'A legendary high-tech pistol.',
  },
  {
    id: 'frenzy',
    name: 'Frenzy',
    type: 'longbow',
    generation: 2,
    icon: '/images/legendary/frenzy.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/Frenzy',
    description: 'A legendary longbow of rage.',
  },
  {
    id: 'flames_of_war',
    name: 'Flames of War',
    type: 'torch',
    generation: 2,
    icon: '/images/legendary/flames_of_war.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/Flames_of_War',
    description: 'A legendary torch of war.',
  },
  {
    id: 'the_binding_of_ipos',
    name: 'The Binding of Ipos',
    type: 'focus',
    generation: 2,
    icon: '/images/legendary/the_binding_of_ipos.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/The_Binding_of_Ipos',
    description: 'A legendary demonic focus.',
  },
  {
    id: 'shooshadoo',
    name: 'Shooshadoo',
    type: 'hammer',
    generation: 2,
    icon: '/images/legendary/shooshadoo.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/Shooshadoo',
    description: 'A legendary quaggan hammer.',
  },
  {
    id: 'eureka',
    name: 'Eureka',
    type: 'rifle',
    generation: 2,
    icon: '/images/legendary/eureka.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/Eureka',
    description: 'A legendary experimental rifle.',
  },
  {
    id: 'sharur',
    name: 'Sharur',
    type: 'mace',
    generation: 2,
    icon: '/images/legendary/sharur.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/Sharur',
    description: 'A legendary ancient mace.',
  },
  {
    id: 'hms_divinity',
    name: 'HMS Divinity',
    type: 'greatsword',
    generation: 2,
    icon: '/images/legendary/hms_divinity.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/HMS_Divinity',
    description: 'A legendary airship greatsword.',
  },
  {
    id: 'xiuquatl',
    name: 'Xiuquatl',
    type: 'scepter',
    generation: 2,
    icon: '/images/legendary/xiuquatl.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/Xiuquatl',
    description: 'A legendary serpent scepter.',
  },
  {
    id: 'exordium',
    name: 'Exordium',
    type: 'dagger',
    generation: 2,
    icon: '/images/legendary/exordium.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/Exordium',
    description: 'A legendary cosmic dagger.',
  },
  {
    id: 'pharus',
    name: 'Pharus',
    type: 'warhorn',
    generation: 2,
    icon: '/images/legendary/pharus.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/Pharus',
    description: 'A legendary lighthouse warhorn.',
  },
  {
    id: 'claw_of_the_khan-ur',
    name: 'Claw of the Khan-Ur',
    type: 'dagger',
    generation: 2,
    icon: '/images/legendary/claw_of_the_khan-ur.png',
    wikiLink: 'https://wiki.guildwars2.com/wiki/Claw_of_the_Khan-Ur',
    description: 'A legendary charr dagger.',
  },
];

// Helper functions
export function getLegendaryById(id: string): LegendaryWeaponBasic | undefined {
  return LEGENDARY_WEAPONS.find(l => l.id === id);
}

export function getLegendariesByGeneration(generation: 1 | 2 | 3): LegendaryWeaponBasic[] {
  return LEGENDARY_WEAPONS.filter(l => l.generation === generation);
}

export function getLegendariesByType(type: string): LegendaryWeaponBasic[] {
  return LEGENDARY_WEAPONS.filter(l => l.type === type);
}
