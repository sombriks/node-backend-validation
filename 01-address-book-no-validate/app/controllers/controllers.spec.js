import test from 'ava';
import request from 'supertest';
import {prepareDatabase} from '../configs/database.js';
import {prepareAddressesServices} from '../services/addresses.js';
import {preparePeopleServices} from '../services/people.js';
import {preparePhonesServices} from '../services/phones.js';
import {prepareServer} from '../server.js';
import {preparePeopleRequests} from './people.js';
import {prepareAddressesRequests} from './addresses.js';

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

test('should list addresses', async t => {
	const result = await request(t.context.app.callback()).get('/addresses');
	t.truthy(result);
	t.is(result.status, 200);
	t.true(Array.isArray(result.body));
});

test('should find address', async t => {});
test('should create addresses', async t => {});
test('should update addresses', async t => {});
test('should delete addresses', async t => {});

test('should list people', async t => {});
test('should find people', async t => {});
test('should create people', async t => {});
test('should update people', async t => {});
test('should delete people', async t => {});
