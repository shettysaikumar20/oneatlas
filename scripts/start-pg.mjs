import EmbeddedPostgres from 'embedded-postgres';
import fs from 'fs';
import path from 'path';

const dataDir = path.resolve('.data/embedded-pg');
const pg = new EmbeddedPostgres({
  port: 54329,
  databaseDir: dataDir,
  user: 'postgres',
  password: 'password',
  initialDatabase: 'oneatlas',
  persistent: true
});

async function main() {
  if (!fs.existsSync(dataDir)) {
    console.log('[PostgreSQL] Initialising local database cluster...');
    await pg.initialise();
  }
  console.log('[PostgreSQL] Starting PostgreSQL server on port 54329...');
  await pg.start();
  console.log('[PostgreSQL] PostgreSQL is ready and accepting connections at postgresql://postgres:password@127.0.0.1:54329/oneatlas');

  process.on('SIGINT', async () => {
    console.log('[PostgreSQL] Shutting down...');
    await pg.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('[PostgreSQL] Shutting down...');
    await pg.stop();
    process.exit(0);
  });
}

main().catch(err => {
  console.error('[PostgreSQL] Error:', err);
  process.exit(1);
});
