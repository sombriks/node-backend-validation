import {PGlite} from '@electric-sql/pglite';
import {prepareDatabase} from '../configs/database.js';

/**
 * Provision service calls to manage phone numbers
 *
 * @param {*} options
 * @param {PGlite} options.db database connection instance
 * @returns a set of functions to manage phones
 */
export const preparePhonesServices = async options => {
	options ||= {db: await prepareDatabase()};
	return {
		async list({q = ''}) {
			const {rows} = await options.db.query(`
				select * from phones 
				where "number" ilike '%'||$1||'%'`, [q]);
			return rows;
		},
		async find({id = -1}) {},
		async create({phone}) {},
		async update({id, phone}) {},
		async del({id}) {},
	};
};
