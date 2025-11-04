const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

async function setupLegendaryTables() {
  const sql = postgres(process.env.DATABASE_URL, {
    max: 1,
  });

  try {
    console.log('Reading legendary tables SQL file...');
    const sqlContent = fs.readFileSync(path.join(__dirname, 'setup-legendary-tables.sql'), 'utf8');

    console.log('Creating legendary tracking tables...');
    await sql.unsafe(sqlContent);

    console.log('✓ Legendary tracking tables created successfully!');
  } catch (error) {
    console.error('Error setting up legendary tables:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

setupLegendaryTables();
