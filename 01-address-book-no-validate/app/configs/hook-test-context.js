import {prepareAddressesServices} from '../services/addresses.js';
import {prepareAddressesRequests} from '../controllers/addresses.js';
import {preparePeopleServices} from '../services/people.js';
import {preparePhonesServices} from '../services/phones.js';
import {preparePeopleRequests} from '../controllers/people.js';
import {prepareServer} from '../server.js';
import {prepareDatabase} from './database.js';

export const testSetup = async t => {
	const database = await prepareDatabase();

	const addressesServices = await prepareAddressesServices({db: database});
	const addressesRequests = await prepareAddressesRequests({service: addressesServices});

	const peopleServices = await preparePeopleServices({db: database});
	const phonesServices = await preparePhonesServices({db: database});
	const peopleRequests = await preparePeopleRequests({peopleServices, phonesServices});

	const app = await prepareServer({addressesRequests, peopleRequests});

	t.context.addressesService = addressesServices;
	t.context.peopleServices = peopleServices;
	t.context.phonesServices = phonesServices;
	t.context.database = database;
	t.context.app = app;
};

export const testTeardown = async t => {
	await t.context.database.close();
};
