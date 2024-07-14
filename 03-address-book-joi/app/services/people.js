import {prepareDatabase} from '../configs/database.js';

export const preparePeopleServices = async options => {
	options ||= {db: await prepareDatabase()}; // XXX this idiom looks promising
	const {db} = options;
	return {
		async list({q = ''}) {
			const {rows} = await db.query(`
				select * from people 
				where name ilike '%'||$1||'%'`, [q]);
			return rows;
		},
		async find({id = -1}) {
			const {rows} = await db.query(`
				select * from people 
				where id = $1`, [id]);
			if (!rows || rows.length === 0) {
				return null;
			}

			return rows[0];
		},
		async create({person}) {
			const {name} = person;
			const {rows} = await db.query(`
				insert into people(name)
				values ($1)
				returning id`, [name]);
			const [{id}] = rows;
			return id;
		},
		async update({id = -1, person}) {
			const {name} = person;
			const {affectedRows} = await db.query(`
				update people
				set name = $1, updated = $2
				where id = $3`, [name, new Date(), id]);
			return affectedRows;
		},
		async del({id = -1}) {
			const {affectedRows} = await db.query(`
				delete from people
				where id = $1`, [id]);
			return affectedRows;
		},
	};
};
