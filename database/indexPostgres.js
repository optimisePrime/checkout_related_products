const pg = require('pg');

const connectionString =
  process.env.DATABASE_URL || 'postgres://localhost:5432/';

const client = pg.Client(connectionString);
client.connect();

module.exports = client;
