import { PGlite } from '@electric-sql/pglite';
import { createServer } from 'pg-gateway';
import fs from 'fs';
import path from 'path';

const dataDir = path.resolve('.data/pgdata');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new PGlite(dataDir);
await db.waitReady;

const server = createServer(async () => db);

const PORT = process.env.PG_PORT ? parseInt(process.env.PG_PORT) : 5432;

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[PG-Gateway] Embedded PostgreSQL running at 127.0.0.1:${PORT}`);
});
