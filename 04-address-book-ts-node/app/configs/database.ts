import {PGlite} from '@electric-sql/pglite';
import {noRollback} from './no-rollback';
import {logger} from './logging';

const log = logger.scope('database.ts');

let connection: PGlite;

export type DatabaseConfig = {
	dataDir?: string;
};

export const prepareDatabase = async (config?: DatabaseConfig): Promise<PGlite> => {
	// Config fallback
	config ||= {dataDir: process.env.PG_DATA};
	// https://github.com/sombriks/pglite/tree/main?tab=readme-ov-file#limitations
	if (!connection || connection.closed) {
		connection = new PGlite(config.dataDir, {debug: 0});
		const {rows: [{result}]} = await connection.query<{result: number}>('select 1 + 1 as result');
		if (result !== 2) {
			log.error('database issue');
			throw new Error('database issue');
		}

		const migrate = await noRollback(connection);
		log.info(migrate);
	}

	return connection;
};
