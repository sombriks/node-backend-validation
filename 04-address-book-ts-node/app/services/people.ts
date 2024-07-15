import {type PGlite} from '@electric-sql/pglite';
import {prepareDatabase} from '../configs/database';
import {type People, type Person} from '../models/person';

export type PeopleServicesOptions = {
	db: PGlite;
};

export type PersonParameters = {
	q?: string;
	id?: number;
	person?: Person;
};

export type PeopleServices = {
	list(p: PersonParameters): Promise<People>;
	find(p: PersonParameters): Promise<Person | undefined>;
	create(p: PersonParameters): Promise<number>;
	update(p: PersonParameters): Promise<number>;
	del(p: PersonParameters): Promise<number>;
};

export const preparePeopleServices = async (options?: PeopleServicesOptions): Promise<PeopleServices> => {
	options ||= {db: await prepareDatabase()}; // XXX this idiom looks promising
	const {db} = options;
	return {
		async list({q = ''}) {
			const {rows} = await db.query<Person>(`
				select * from people 
				where name ilike '%'||$1||'%'`, [q]);
			return rows;
		},
		async find({id = -1}) {
			const {rows} = await db.query<Person>(`
				select * from people 
				where id = $1`, [id]);
			if (!rows || rows.length === 0) {
				return undefined;
			}

			return rows[0];
		},
		async create({person}) {
			const {name} = person!;
			const {rows} = await db.query<Person>(`
				insert into people(name)
				values ($1)
				returning id`, [name]);
			const [{id}] = rows;
			return id ?? -1;
		},
		async update({id = -1, person}) {
			const {name} = person!;
			const {affectedRows} = await db.query(`
				update people
				set name = $1, updated = $2
				where id = $3`, [name, new Date(), id]);
			return affectedRows ?? 0;
		},
		async del({id = -1}) {
			const {affectedRows} = await db.query(`
				delete from people
				where id = $1`, [id]);
			return affectedRows ?? 0;
		},
	};
};
