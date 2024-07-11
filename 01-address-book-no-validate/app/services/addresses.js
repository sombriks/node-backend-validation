import { prepareDatabase } from '../configs/database.js';

export const prepareAddressesServices = async options => {
  options ||= { db: await prepareDatabase() };
  const { db } = options;
  return {
    async list({ q = '' }) {
      const { rows } = await db.query(`
        select * from addresses 
        where description ilike '%'||$1||'%'
        or complement ilike '%'||$1||'%'`, [q]);
      return rows;
    },
    async find({ id = -1 }) {
      const { rows } = await db.query(`
        select * from addresses 
        where id = $1`, [id]);
      if (!rows || rows.length === 0) {
        return undefined;
      }
      return rows[0];
    },
    async create({ address }) {
      const { description, complement } = address;
      const { rows } = await db.query(`
        insert into addresses (description, complement)
        values ($1, $2) 
        returning id`, [description, complement]);
      const [id] = rows;
      return id;
    },
    async update({ id, address }) {
      const { description, complement } = address;
      const result = await db.query(`
        update addresses
        set description = $1, complement = $2
        where id = $3`, [description, complement, id]);
      return result.affectedRows;
    },
    async del({ id = -1 }) {
      const result = await db.query(`delete from addresses
        where id = $1`, [id]);
      return result.affectedRows;
    },
  };
};
