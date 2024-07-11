import test from 'ava';
import request from 'supertest';
import {prepareDatabase} from './configs/database.js';
import {prepareAddressesServices} from './services/addresses.js';
import {prepareAddressesRequests} from './controllers/addresses.js';
import {preparePeopleServices} from './services/people.js';
import {preparePhonesServices} from './services/phones.js';
import {preparePeopleRequests} from './controllers/people.js';
import {prepareServer} from './server.js';

test.before(async t => {
	const database = await prepareDatabase();

	const addressesService = await prepareAddressesServices({db: database});
	const addressesRequests = await prepareAddressesRequests({service: addressesService});

	const peopleService = await preparePeopleServices({db: database});
	const phonesService = await preparePhonesServices({db: database});
	const peopleRequests = await preparePeopleRequests({peopleService, phonesService});

	const app = await prepareServer({addressesRequests, peopleRequests});

	t.context.database = database;
	t.context.app = app;
});

test.after.always(async t => {
	await t.context.database.close();
});

test('it should be ONLINE', async t => {
	const result = await request(t.context.app.callback()).get('/health/status');
	t.truthy(result);
	t.is(result.status, 200);
	t.is(result.text, 'ONLINE');
});
