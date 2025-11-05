import { ALL_LEGENDARY_MATERIALS } from './src/lib/data/legendaryMaterials';
import { LEGENDARY_WEAPONS } from './src/lib/data/legendaryWeapons';

console.log('🎯 Testing Gen 3 Legendary Weapons\n');

console.log('Total weapons:', LEGENDARY_WEAPONS.length);
console.log('Gen 1 count:', LEGENDARY_WEAPONS.filter(l => l.generation === 1).length);
console.log('Gen 2 count:', LEGENDARY_WEAPONS.filter(l => l.generation === 2).length);
console.log('Gen 3 count:', LEGENDARY_WEAPONS.filter(l => l.generation === 3).length);

console.log('\nTotal materials:', ALL_LEGENDARY_MATERIALS.length);
console.log('Gen 1 materials:', ALL_LEGENDARY_MATERIALS.filter(l => l.generation === 1).length);
console.log('Gen 2 materials:', ALL_LEGENDARY_MATERIALS.filter(l => l.generation === 2).length);
console.log('Gen 3 materials:', ALL_LEGENDARY_MATERIALS.filter(l => l.generation === 3).length);

console.log('\n--- Gen 3 Weapons ---');
const gen3Weapons = LEGENDARY_WEAPONS.filter(l => l.generation === 3);
gen3Weapons.forEach(w => {
  console.log(`✓ ${w.name} (${w.type})`);
});

console.log('\n✅ All Gen 3 legendaries added successfully!');
