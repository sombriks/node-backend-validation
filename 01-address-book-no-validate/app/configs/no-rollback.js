import {readFileSync} from 'node:fs';

/**
 * Apply database migrations
 *
 * @param {import('@electric-sql/pglite')} database database connection instance
 */
export const noRollback = async database => {
	console.log('check database desired state/migrations...');
	const metadata = `
    create table if not exists no_rollback_from_here(
      created timestamp default now(),
      path text unique not null,
      primary key (created, path)
    );
  `;
	await database.exec(metadata);
	// Add new migrate files here, in this array.
	const files = ['app/configs/migrations/2024-07-09-start-schema.sql'];
	if (process.env.NODE_ENV === 'test') {
		files.push('app/configs/migrations/3000-test-data.sql');
	}

	const result = {executed: [], status: 'success'};
	for await (const file of files) {
		await database.transaction(async tx => {
			const migrate = readFileSync(file, 'utf8');
			const skip = await tx.query(`
        select created, path 
        from no_rollback_from_here
        where path = $1  
      `, [file]);
			if (skip.rows.length > 0) {
				const {created, path} = skip.rows[0];
				console.log(`already executed: [${created.toISOString()}] [${path}]`);
			} else {
				console.log(`prepare to execute [${file}]`);
				await tx.exec(migrate);
				console.log('done!');
				await tx.query('insert into no_rollback_from_here (path) values ($1)', [file]);
				result.executed.push(file);
			}
		});
	}

	console.log('done with database checking!');
	return result;
};
