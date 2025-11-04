const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  const sql = postgres(process.env.DATABASE_URL, {
    max: 1,
  });

  try {
    console.log('Reading SQL file...');
    const sqlContent = fs.readFileSync(path.join(__dirname, 'setup-db.sql'), 'utf8');

    console.log('Executing SQL...');
    await sql.unsafe(sqlContent);

    console.log('✓ Database schema created successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

setupDatabase();
