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

	// @ts-expect-error properly type context later
	t.context.addressesService = addressesServices;
	// @ts-expect-error properly type context later
	t.context.peopleServices = peopleServices;
	// @ts-expect-error properly type context later
	t.context.phonesServices = phonesServices;
	// @ts-expect-error properly type context later
	t.context.database = database;
	// @ts-expect-error properly type context later
	t.context.app = app;
};

export const testTeardown = async (t: ExecutionContext) => {
	// @ts-expect-error properly type context later
	await t.context.database.close();
};
