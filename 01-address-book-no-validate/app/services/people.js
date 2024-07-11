import {prepareDatabase} from '../configs/database.js';

export const preparePeopleServices = async options => {
	options ||= {db: await prepareDatabase()}; // XXX this idiom looks promising
	return {
		async list({q = ''}) {
			const {rows} = await options.db.query(`
				select * from people 
				where name ilike '%'||$1||'%'	`, [q]);
			return rows;
		},
		async find({id = -1}) {},
		async create({ }) {},
		async update({ }) {},
		async del({ }) {},
	};
};
