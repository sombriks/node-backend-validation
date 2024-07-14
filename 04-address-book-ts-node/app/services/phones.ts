import {type PGlite} from '@electric-sql/pglite';
import {prepareDatabase} from '../configs/database';
import {type Phone} from '../models/phone';

export type PhonesServicesOptions = {
	db: PGlite;
};

// XXX more granular params?
export type PhoneParameters = {
	people_id: number;
	phones_id?: number;
	q?: string;
	phone?: Phone;
};

// This type is mainly consumed here so it dwells here instead of models to keep cohesion
export type PhoneServices = {
	list(p: PhoneParameters): Promise<Phone[]>;
	find(p: PhoneParameters): Promise<Phone | undefined>;
	create(p: PhoneParameters): Promise<number>;
	update(p: PhoneParameters): Promise<number>;
	del(p: PhoneParameters): Promise<number>;
};

export const preparePhonesServices = async (options: PhonesServicesOptions): Promise<PhoneServices> => {
	options ||= {db: await prepareDatabase()};
	const {db} = options;
	return {
		async list({people_id = -1, q = ''}) {
			const {rows} = await db.query<Phone>(`
          select *
          from phones
          where people_id = $1
            and "number" ilike '%' || $2 || '%'
      `, [people_id, q]);
			return rows;
		},
		async find({people_id = -1, phones_id = -1}) {
			const {rows} = await db.query<Phone>(`
          select *
          from phones
          where people_id = $1
            and id = $2`, [people_id, phones_id]);
			if (!rows || rows.length === 0) {
				return undefined;
			}

			return rows[0];
		},
		async create({people_id = -1, phone}) {
			const {number} = phone!;
			const {rows} = await db.query<Phone>(`
          insert into phones (people_id, "number")
          values ($1, $2)
          returning id`, [people_id, number]);
			const [{id}] = rows; // XXX will never be undefined but don't want type gymnastics ~~for now~~
			return id ?? -1;
		},
		async update({people_id = -1, phones_id = -1, phone}) {
			const {number} = phone!;

			const {affectedRows} = await db.query(`
          update phones
          set "number" = $1,
              updated  = $2
          where people_id = $3
            and id = $4`, [number, new Date(), people_id, phones_id]);
			return affectedRows ?? 0;
		},
		async del({people_id = -1, phones_id = -1}) {
			const {affectedRows} = await db.query(`
          delete
          from phones
          where people_id = $1
            and id = $2`, [people_id, phones_id]);
			return affectedRows ?? 0;
		},
	};
};
