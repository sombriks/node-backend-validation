import {type ExecutionContext} from 'ava';
import {prepareAddressesServices} from '../services/addresses';
import {prepareAddressesRequests} from '../controllers/addresses';
import {preparePeopleServices} from '../services/people';
import {preparePhonesServices} from '../services/phones';
import {preparePeopleRequests} from '../controllers/people';
import {prepareServer} from '../server';
import {prepareDatabase} from './database';

export const testSetup = async (t: ExecutionContext) => {
	const database = await prepareDatabase();

	const addressesServices = await prepareAddressesServices({db: database});
	const addressesRequests = await prepareAddressesRequests({addressesServices});

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

export const testTeardown = async (t: ExecutionContext) => {
	await t.context.database.close();
};
