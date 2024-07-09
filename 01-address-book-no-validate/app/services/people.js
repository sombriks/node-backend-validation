import {prepareDatabase} from '../configs/database.js';

const database = prepareDatabase();

export const preparePeopleServices = ({db} = {db: database}) => {};
