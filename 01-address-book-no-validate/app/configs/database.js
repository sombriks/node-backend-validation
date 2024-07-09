// database.js
import { PGlite } from '@electric-sql/pglite';

const defaultDatabaseConfig = { dataDir: process.env.PG_DATA };

export const prepareDatabase = (config = defaultDatabaseConfig) => {
  const database = new PGlite(config.dataDir);
  // ...
  return database;
};
