// database.js
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'fs';

const defaultDatabaseConfig = { dataDir: process.env.PG_DATA };

let database

export const prepareDatabase = async (config = defaultDatabaseConfig) => {
  // https://github.com/sombriks/pglite/tree/main?tab=readme-ov-file#limitations
  if (!database || database.closed) {
    database = new PGlite(config.dataDir);
    const { rows: [{ result }] } = await database.query("select 1 + 1 as result")
    if (result != '2') throw new Error("database issue")
    await noRollback(database)
  }
  return database;
};

/**
 * 
 * @param {PGlite} db 
 */
const noRollback = async (db) => {
  const metadata = `
    create table if not exists no_rollback_from_here(
      created timestamp default now(),
      path text unique not null,
      primary key (created, path)
    );
  `
  await db.exec(metadata)
  // add new migrate files here, in this array.
  const files = ['app/configs/migrations/2024-07-09-start-schema.sql']
  for await (const file of files) {
    await db.transaction(async tx => {
      const migrate = readFileSync(file, 'utf8')
      const skip = await tx.query(`
        select created, path 
        from no_rollback_from_here
        where path = $1  
      `, [file])
      if (skip.rows.length) {
        const { created, path } = skip.rows[0]
        console.log(`already executed: [${created.toISOString()}] [${path}]`)
      } else {
        console.log(`prepare to execute [${file}]`)
        await tx.exec(migrate)
        console.log("done!")
        await tx.query(`insert into no_rollback_from_here (path) values ($1)`, [file])
      }
    })
  }
}