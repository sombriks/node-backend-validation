import {type PGlite} from '@electric-sql/pglite';
import {prepareDatabase} from '../configs/database';
import {type Address} from '../models/address';
import {type Person, type People} from '../models/person';

export type AddressesServicesOptions = {
	db: PGlite;
};

export type AddressesParameters = {
	q?: string;
	id?: number;
	address?: Address;
};

export type ResidentParameters = {
	addresses_id: number;
	people_id?: number;
};

export type AddressesServices = {
	list(p: AddressesParameters): Promise<Address[]>;
	find(p: AddressesParameters): Promise<Address | undefined>;
	create(p: AddressesParameters): Promise<number>;
	update(p: AddressesParameters): Promise<number>;
	del(p: AddressesParameters): Promise<number>;
	people: {
		list(p: ResidentParameters): Promise<People>;
		add(p: ResidentParameters): Promise<number>;
		del(p: ResidentParameters): Promise<number>;
	};
};

export const prepareAddressesServices = async (options: AddressesServicesOptions): Promise<AddressesServices> => {
	options ||= {db: await prepareDatabase()};
	const {db} = options;
	return {
		async list({q = ''}) {
			const {rows} = await db.query<Address>(`
          select *
          from addresses
          where description ilike '%'||$1||'%'
             or complement ilike '%'||$1||'%'`, [q]);
			return rows;
		},
		async find({id = -1}) {
			const {rows} = await db.query<Address>(`
          select *
          from addresses
          where id = $1`, [id]);
			if (!rows || rows.length === 0) {
				return undefined;
			}

			return rows[0];
		},
		async create({address}) {
			const {description, complement} = address!;
			const {rows} = await db.query<Address>(`
          insert into addresses (description, complement)
              values ($1, $2)
                  returning id`, [description, complement]);
			const [{id}] = rows;
			return id ?? -1;
		},
		async update({id = -1, address}) {
			const {description, complement} = address!;
			const {affectedRows} = await db.query(`
          update addresses
          set description = $1,
              complement  = $2,
              updated     = $3
          where id = $4`, [description, complement, new Date(), id]);
			return affectedRows ?? 0;
		},
		async del({id = -1}) {
			const {affectedRows} = await db.query(`delete
                                             from addresses
                                             where id = $1`, [id]);
			return affectedRows ?? 0;
		},
		people: {
			async list({addresses_id = -1}) {
				const {rows} = await db.query<Person>(`
            select *
            from people
            where id in (select people_id
                         from addresses_people
                         where addresses_id = $1)`, [addresses_id]);
				return rows;
			},
			async add({addresses_id = -1, people_id = -1}) {
				const {affectedRows} = await db.query(`
            insert into addresses_people (addresses_id, people_id)
            values ($1, $2)`, [addresses_id, people_id]);
				return affectedRows ?? 0;
			},
			async del({addresses_id = -1, people_id = -1}) {
				const {affectedRows} = await db.query(`
            delete
            from addresses_people
            where addresses_id = $1
              and people_id = $2`, [addresses_id, people_id]);
				return affectedRows ?? 0;
			},
		},
	};
};
