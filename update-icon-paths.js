const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'lib', 'data', 'legendaryWeapons.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all render.guildwars2.com URLs with local paths
content = content.replace(
  /icon: 'https:\/\/render\.guildwars2\.com\/file\/[A-F0-9]+\/\d+\.png'/g,
  (match) => {
    // Extract the legendary ID from the surrounding context
    // We'll use a simpler approach: just replace with placeholder pattern
    return match; // Keep for now, we'll do manual mapping
  }
);

// Manual mapping based on legendary IDs
const replacements = [
  { from: /id: 'eternity',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/eternity.png'") },
  { from: /id: 'sunrise',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/sunrise.png'") },
  { from: /id: 'twilight',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/twilight.png'") },
  { from: /id: 'bolt',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/bolt.png'") },
  { from: /id: 'the_flameseeker_prophecies',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/the_flameseeker_prophecies.png'") },
  { from: /id: 'incinerator',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/incinerator.png'") },
  { from: /id: 'the_dreamer',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/the_dreamer.png'") },
  { from: /id: 'frostfang',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/frostfang.png'") },
  { from: /id: 'the_juggernaut',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/the_juggernaut.png'") },
  { from: /id: 'meteorlogicus',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/meteorlogicus.png'") },
  { from: /id: 'the_minstrel',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/the_minstrel.png'") },
  { from: /id: 'the_predator',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/the_predator.png'") },
  { from: /id: 'kudzu',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/kudzu.png'") },
  { from: /id: 'quip',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/quip.png'") },
  { from: /id: 'rodgorts_flame',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/rodgorts_flame.png'") },
  { from: /id: 'the_bifrost',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/the_bifrost.png'") },
  { from: /id: 'the_howler',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/the_howler.png'") },
  { from: /id: 'the_moot',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/the_moot.png'") },
  { from: /id: 'nevermore',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/nevermore.png'") },
  { from: /id: 'chuka_and_champawat',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/chuka_and_champawat.png'") },
  { from: /id: 'astralaria',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/astralaria.png'") },
  { from: /id: 'the_shining_blade',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/the_shining_blade.png'") },
  { from: /id: 'h_o_p_e',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/h_o_p_e.png'") },
  { from: /id: 'frenzy',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/frenzy.png'") },
  { from: /id: 'flames_of_war',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/flames_of_war.png'") },
  { from: /id: 'the_binding_of_ipos',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/the_binding_of_ipos.png'") },
  { from: /id: 'shooshadoo',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/shooshadoo.png'") },
  { from: /id: 'eureka',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/eureka.png'") },
  { from: /id: 'sharur',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/sharur.png'") },
  { from: /id: 'hms_divinity',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/hms_divinity.png'") },
  { from: /id: 'xiuquatl',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/xiuquatl.png'") },
  { from: /id: 'exordium',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/exordium.png'") },
  { from: /id: 'pharus',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/pharus.png'") },
  { from: /id: 'claw_of_the_khan-ur',[\s\S]*?icon: '[^']*'/, to: (match) => match.replace(/icon: '[^']*'/, "icon: '/images/legendary/claw_of_the_khan-ur.png'") },
];

// Apply each replacement
replacements.forEach(({ from, to }) => {
  content = content.replace(from, to);
});

// Write back
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Updated all icon paths to use local images!');
console.log('📁 Path format: /images/legendary/{id}.png');
