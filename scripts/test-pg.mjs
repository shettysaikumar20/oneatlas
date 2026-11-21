import EmbeddedPostgres from 'embedded-postgres';

async function test() {
  const pg = new EmbeddedPostgres({
    port: 54329,
    databaseDir: '.data/embedded-pg',
    user: 'postgres',
    password: 'password',
    initialDatabase: 'oneatlas'
  });
  console.log('Initialising embedded postgres...');
  await pg.initialise();
  console.log('Starting embedded postgres...');
  await pg.start();
  console.log('Embedded postgres started successfully on port 54329!');
  await pg.stop();
  console.log('Stopped.');
}

test().catch(console.error);
