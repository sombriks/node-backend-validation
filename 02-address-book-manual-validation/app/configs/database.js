// Database.js
import {PGlite} from '@electric-sql/pglite';
import {noRollback} from './no-rollback.js';

/**
 * @type {PGlite} database - ref to connection singleton
 */
let connection;

/**
 * Provision a database connection with {PGLite}
 *
 * @param {*} config config options to prepare the database connection
 * @param {String} config.dataDir path or dsn to database
 *
 * @returns {Promise<PGlite>} valid database connection instance
 */
export const prepareDatabase = async config => {
	// Config fallback
	config ||= {dataDir: process.env.PG_DATA};
	// https://github.com/sombriks/pglite/tree/main?tab=readme-ov-file#limitations
	if (!connection || connection.closed) {
		connection = new PGlite(config.dataDir, {debug: 0});
		const {rows: [{result}]} = await connection.query('select 1 + 1 as result');
		if (result !== 2) {
			throw new Error('database issue');
		}

		const migrate = await noRollback(connection);
		console.log(migrate);
	}

	return connection;
};
