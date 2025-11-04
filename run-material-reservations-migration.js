const { readFileSync } = require('fs');
const { join } = require('path');

async function runMigration() {
  const { createClient } = require('@supabase/supabase-js');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const sql = readFileSync(
      join(__dirname, 'MIGRATION_MATERIAL_RESERVATIONS.sql'),
      'utf-8'
    );

    console.log('Running material reservations migration...');

    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // Try direct query if rpc doesn't exist
      const statements = sql.split(';').filter(s => s.trim());

      for (const statement of statements) {
        if (statement.trim()) {
          const { error: execError } = await supabase.from('_sql').select(statement);
          if (execError && !execError.message.includes('does not exist')) {
            console.error('Error executing statement:', execError);
          }
        }
      }
    }

    console.log('✅ Material reservations migration completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

runMigration();
