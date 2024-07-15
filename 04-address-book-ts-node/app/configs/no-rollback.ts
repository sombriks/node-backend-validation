import {readFileSync} from 'node:fs';
import {type PGlite} from '@electric-sql/pglite';
import {logger} from './logging';

const log = logger.scope('no-rollback.ts');

export type MigrateResults = {
	executed: string[];
	status: string;
	total: number;
};

type MigrateTuple = {
	created: Date;
	path: string;
};

export const noRollback = async (database: PGlite): Promise<MigrateResults> => {
	log.info('check database desired state/migrations...');
	const metadata = `
	  -- store script names already executed
    create table if not exists no_rollback_from_here(
      created timestamp default now(),
      path text unique not null,
      primary key (created, path)
    );
		-- lock while applying migrates to avoid possible concurrent executions
		create table if not exists lock_no_rollback(
			locked integer not null default 1 check (locked = 1),
			created timestamp default now(),
			primary key (locked)
		);
  `;
	await database.exec(metadata);
	// Lock table to avoid concurrent migrations
	try {
		await database.exec('insert into lock_no_rollback default values');
	} catch (error) {
		log.error(`
    =====
    failed to lock for migration.
    either something went wrong or there is a migration happening.
    bailing out. 
    =====
    `);
		throw error;
	}

	// Add new migrate files here, in this array.
	const files = ['app/configs/migrations/2024-07-14-start-schema.sql'];
	// Desired state for test suite
	if (process.env.NODE_ENV === 'test') {
		files.push('app/configs/migrations/3000-test-data.sql');
	}

	const result: MigrateResults = {executed: [], status: 'success', total: files.length};
	for await (const file of files) {
		await database.transaction(async tx => {
			const migrate = readFileSync(file, 'utf8');

			const skip = await tx.query<MigrateTuple>(`
        select created, path 
        from no_rollback_from_here
        where path = $1  
      `, [file]);
			if (skip.rows.length > 0) {
				const {created, path} = skip.rows[0];
				log.debug(`already executed: [${created.toISOString()}] [${path}]`);
			} else {
				log.debug(`prepare to execute [${file}]`);
				await tx.exec(migrate);
				log.debug('done!');
				await tx.query('insert into no_rollback_from_here (path) values ($1)', [file]);
				result.executed.push(file);
			}
		});
	}

	await database.exec('delete from lock_no_rollback');
	log.info('done with database migration!');
	return result;
};
