/* Script to create required tables using the DATABASE_URL.
   Uses SSL with rejectUnauthorized: false to work with providers that use self-signed certs. */
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
  // Relax TLS verification for environments that block self-signed CA chains
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set.');
    process.exit(1);
  }

  const sqlPath = path.resolve(__dirname, '..', 'drizzle', '0000_mixed_wonder_man.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  // Create client with ssl relaxed to avoid self-signed errors
  const client = new Client({ connectionString: databaseUrl, ssl: { require: true, rejectUnauthorized: false } });

  try {
    await client.connect();
    console.log('Connected to database. Applying schema...');
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Tables created successfully.');
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch {}
    console.error('Failed to create tables:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();


