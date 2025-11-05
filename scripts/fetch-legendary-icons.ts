/**
 * Fetch Legendary Icons from GW2 API
 * This script fetches real legendary weapon icons from the GW2 API
 * and updates the legendaryWeapons.ts file
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const GW2_API_BASE = 'https://api.guildwars2.com/v2';

interface GW2Item {
  id: number;
  name: string;
  icon?: string;
  rarity: string;
  type: string;
}

const LEGENDARY_ITEM_IDS: Record<string, number> = {
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
};

async function fetchItems(itemIds: number[]): Promise<GW2Item[]> {
  const BATCH_SIZE = 200;
  const allItems: GW2Item[] = [];

  for (let i = 0; i < itemIds.length; i += BATCH_SIZE) {
    const batch = itemIds.slice(i, i + BATCH_SIZE);
    const idsParam = batch.join(',');
    const url = `${GW2_API_BASE}/items?ids=${idsParam}`;

    try {
      console.log(`Fetching batch ${i / BATCH_SIZE + 1}...`);
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`API error for batch: ${response.status}`);
        continue;
      }

      const data = await response.json();
      allItems.push(...data);

      // Rate limiting: wait 100ms between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error fetching batch:`, error);
    }
  }

  return allItems;
}

async function main() {
  console.log('🚀 Fetching legendary icons from GW2 API...\n');

  const itemIds = Object.values(LEGENDARY_ITEM_IDS);
  const items = await fetchItems(itemIds);

  console.log(`\n✅ Fetched ${items.length} items from GW2 API\n`);

  // Create icon mapping
  const iconMap = new Map<string, string>();

  items.forEach(item => {
    if (item.icon) {
      const legendaryId = Object.entries(LEGENDARY_ITEM_IDS).find(
        ([_, id]) => id === item.id
      )?.[0];

      if (legendaryId) {
        iconMap.set(legendaryId, item.icon);
        console.log(`✓ ${item.name}: ${item.icon}`);
      }
    }
  });

  console.log(`\n📝 Writing icon data to file...\n`);

  // Write the icon mapping to a JSON file for reference
  const iconMapPath = join(process.cwd(), 'legendary-icon-map.json');
  const iconMapData = Object.fromEntries(iconMap);
  writeFileSync(iconMapPath, JSON.stringify(iconMapData, null, 2));

  console.log(`✅ Icon map saved to: ${iconMapPath}\n`);
  console.log('📊 Summary:');
  console.log(`   Total legendary IDs: ${Object.keys(LEGENDARY_ITEM_IDS).length}`);
  console.log(`   Icons fetched: ${iconMap.size}`);
  console.log(`   Missing: ${Object.keys(LEGENDARY_ITEM_IDS).length - iconMap.size}\n`);

  // Now update the legendaryWeapons.ts file
  const legendaryWeaponsPath = join(process.cwd(), 'src/lib/data/legendaryWeapons.ts');

  try {
    let content = readFileSync(legendaryWeaponsPath, 'utf-8');

    // Replace icon paths
    iconMap.forEach((iconUrl, legendaryId) => {
      const oldPattern = new RegExp(
        `icon:\\s*'/images/legendary/${legendaryId}\\.png'`,
        'g'
      );
      const newValue = `icon: '${iconUrl}'`;
      content = content.replace(oldPattern, newValue);
    });

    writeFileSync(legendaryWeaponsPath, content);
    console.log(`✅ Updated ${legendaryWeaponsPath}\n`);
  } catch (error) {
    console.error('❌ Error updating legendaryWeapons.ts:', error);
  }

  console.log('🎉 Done! Legendary icons have been updated with real GW2 API URLs.\n');
}

main().catch(console.error);
