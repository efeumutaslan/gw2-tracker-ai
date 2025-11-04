const postgres = require('postgres');
const fs = require('fs');

const sql = postgres(process.env.DATABASE_URL || 'postgresql://postgres.inyjvfzqkoeuijlxmkye:ufAVCOsZFuTQxekQ@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres');

async function runMigration() {
  try {
    console.log('Reading migration file...');
    const migration = fs.readFileSync('MIGRATION_PROGRESS_HISTORY.sql', 'utf8');

    console.log('Running progress history migration...');
    await sql.unsafe(migration);

    console.log('✅ Migration completed successfully!');
    await sql.end();
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await sql.end();
    process.exit(1);
  }
}

runMigration();
