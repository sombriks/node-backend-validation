import {prepareDatabase} from '../configs/database.js';

/**
 * Provision service calls to manage phone numbers
 *
 * @param {*} options
 * @param {import('@electric-sql/pglite')} options.db database connection instance
 * @returns a set of functions to manage phones
 */
export const preparePhonesServices = async options => {
	options ||= {db: await prepareDatabase()};
	const {db} = options;
	return {
		async list({people_id = -1, q = ''}) {
			const {rows} = await db.query(`
          select *
          from phones
          where people_id = $1
            and "number" ilike '%' || $2 || '%'
      `, [people_id, q]);
			return rows;
		},
		async find({people_id = -1, phones_id = -1}) {
			const {rows} = await db.query(`
          select *
          from phones
          where people_id = $1
            and id = $2`, [people_id, phones_id]);
			if (!rows || rows.length === 0) {
				return null;
			}

			return rows[0];
		},
		async create({people_id = -1, phone}) {
			const {number} = phone;
			const {rows} = await db.query(`
          insert into phones (people_id, "number")
          values ($1, $2)
          returning id`, [people_id, number]);
			const [{id}] = rows;
			return id;
		},
		async update({people_id = -1, phones_id = -1, phone}) {
			const {number} = phone;

			const {affectedRows} = await db.query(`
          update phones
          set "number" = $1,
              updated  = $2
          where people_id = $3
            and id = $4`, [number, new Date(), people_id, phones_id]);
			return affectedRows;
		},
		async del({people_id = -1, phones_id = -1}) {
			const {affectedRows} = await db.query(`
          delete
          from phones
          where people_id = $1
            and id = $2`, [people_id, phones_id]);
			return affectedRows;
		},
	};
};
