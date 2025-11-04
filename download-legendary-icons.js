const https = require('https');
const fs = require('fs');
const path = require('path');

// Legendary weapons with their wiki file names
const legendaries = [
  { id: 'eternity', name: 'Eternity' },
  { id: 'sunrise', name: 'Sunrise' },
  { id: 'twilight', name: 'Twilight' },
  { id: 'bolt', name: 'Bolt' },
  { id: 'the_flameseeker_prophecies', name: 'The_Flameseeker_Prophecies' },
  { id: 'incinerator', name: 'Incinerator' },
  { id: 'the_dreamer', name: 'The_Dreamer' },
  { id: 'frostfang', name: 'Frostfang' },
  { id: 'the_juggernaut', name: 'The_Juggernaut' },
  { id: 'meteorlogicus', name: 'Meteorlogicus' },
  { id: 'the_minstrel', name: 'The_Minstrel' },
  { id: 'the_predator', name: 'The_Predator' },
  { id: 'kudzu', name: 'Kudzu' },
  { id: 'quip', name: 'Quip' },
  { id: 'rodgorts_flame', name: 'Rodgort%27s_Flame' },
  { id: 'the_bifrost', name: 'The_Bifrost' },
  { id: 'the_howler', name: 'The_Howler' },
  { id: 'the_moot', name: 'The_Moot' },
  { id: 'nevermore', name: 'Nevermore' },
  { id: 'chuka_and_champawat', name: 'Chuka_and_Champawat' },
  { id: 'astralaria', name: 'Astralaria' },
  { id: 'the_shining_blade', name: 'The_Shining_Blade' },
  { id: 'h_o_p_e', name: 'H.O.P.E.' },
  { id: 'frenzy', name: 'Frenzy' },
  { id: 'flames_of_war', name: 'Flames_of_War' },
  { id: 'the_binding_of_ipos', name: 'The_Binding_of_Ipos' },
  { id: 'shooshadoo', name: 'Shooshadoo' },
  { id: 'eureka', name: 'Eureka' },
  { id: 'sharur', name: 'Sharur' },
  { id: 'hms_divinity', name: 'HMS_Divinity' },
  { id: 'xiuquatl', name: 'Xiuquatl' },
  { id: 'exordium', name: 'Exordium' },
  { id: 'pharus', name: 'Pharus' },
  { id: 'claw_of_the_khan-ur', name: 'Claw_of_the_Khan-Ur' },
];

// Create output directory
const outputDir = path.join(__dirname, 'public', 'images', 'legendary');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Fallback: use placeholder images
function createPlaceholder(legendary) {
  const outputPath = path.join(outputDir, `${legendary.id}.png`);

  // Use DiceBear API for placeholder
  const url = `https://api.dicebear.com/7.x/shapes/png?seed=${legendary.name}&size=128&backgroundColor=8b5cf6`;

  https.get(url, (response) => {
    if (response.statusCode === 200) {
      const file = fs.createWriteStream(outputPath);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded placeholder for ${legendary.name}`);
      });
    } else {
      console.log(`❌ Failed to download placeholder for ${legendary.name}`);
    }
  }).on('error', (err) => {
    console.error(`Error for ${legendary.name}:`, err.message);
  });
}

// Download all placeholders
console.log('🎨 Creating placeholder images for all legendaries...\n');
legendaries.forEach((legendary, index) => {
  setTimeout(() => {
    createPlaceholder(legendary);
  }, index * 200); // Stagger requests
});

console.log(`\n📦 Total legendaries: ${legendaries.length}`);
console.log(`📁 Output directory: ${outputDir}`);
