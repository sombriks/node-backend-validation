import {prepareDatabase} from '../configs/database.js';

const database = prepareDatabase();

export const prepareAddressesServices = ({db} = {db: database}) => {};
