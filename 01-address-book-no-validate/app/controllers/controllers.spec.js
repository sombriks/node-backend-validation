import test from 'ava';
import request from 'supertest';
import { prepareDatabase } from '../configs/database.js';
import { prepareAddressesServices } from '../services/addresses.js';
import { preparePeopleServices } from '../services/people.js';
import { preparePhonesServices } from '../services/phones.js';
import { prepareServer } from '../server.js';
import { preparePeopleRequests } from './people.js';
import { prepareAddressesRequests } from './addresses.js';

test.before(async t => {
	// TODO setup too similar along specs
	const database = await prepareDatabase();

	const addressesService = await prepareAddressesServices({ db: database });
	const addressesRequests = await prepareAddressesRequests({ service: addressesService });

	const peopleServices = await preparePeopleServices({ db: database });
	const phonesServices = await preparePhonesServices({ db: database });
	const peopleRequests = await preparePeopleRequests({ peopleServices, phonesServices });

	const app = await prepareServer({ addressesRequests, peopleRequests });

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
	t.truthy(result.body.find(a => a.description.includes('Horses alley')));
});

test('should find address', async t => {
	const result = await request(t.context.app.callback()).get('/addresses/1');
	t.truthy(result);
	t.is(result.status, 200);
	t.truthy(result.body);
	t.regex(result.text, /road 01/gi);
});

test('should create addresses', async t => {
	const address = { description: 'El Dorado Rd 113', complement: '' };
	const result = await request(t.context.app.callback()).post('/addresses').send(address);
	t.truthy(result);
	t.is(result.status, 201);
	t.regex(result.headers.location, /\/addresses\/\d+/gi);
	t.regex(result.text, /created/gi);
});

test('should update addresses', async t => {
	const address = { description: 'Dead end street', complement: 'Uphill house' };
	const result = await request(t.context.app.callback()).put('/addresses/2').send(address);
	t.truthy(result);
	t.is(result.status, 303);
	t.regex(result.headers.location, /\/addresses\/\d+/gi);
	t.regex(result.text, /1 updated/gi);
});

test('should delete addresses', async t => {
	const result = await request(t.context.app.callback()).del('/addresses/5');
	t.truthy(result);
	t.is(result.status, 303);
	t.regex(result.headers.location, /\/addresses/);
	t.regex(result.text, /1 deleted/gi);
});

test('should list people', async t => {
	const result = await request(t.context.app.callback()).get('/people');
	t.truthy(result);
	t.is(result.status, 200);
	t.true(Array.isArray(result.body));
	t.truthy(result.body.find(a => a.name.includes('Bob')));
});

test('should find a person', async t => {
	const result = await request(t.context.app.callback()).get('/people/1');
	t.truthy(result);
	t.is(result.status, 200);
	t.truthy(result.body);
	t.regex(result.text, /alice/gi);
});

test('should create people', async t => {
	const person = { name: 'Ferdinand' };
	const result = await request(t.context.app.callback()).post('/people').send(person);
	t.truthy(result);
	t.is(result.status, 201);
	t.regex(result.headers.location, /\/people\/\d+/gi);
	t.regex(result.text, /created/gi);
});

test('should update people', async t => {
	const person = { name: 'Donald' };
	const result = await request(t.context.app.callback()).put('/people/4').send(person);
	t.truthy(result);
	t.is(result.status, 303);
	t.regex(result.headers.location, /\/people\/\d+/gi);
	t.regex(result.text, /1 updated/gi);
});

test('should delete people', async t => {
	const result = await request(t.context.app.callback()).del('/people/5');
	t.truthy(result);
	t.is(result.status, 303);
	t.regex(result.headers.location, /\/people/gi);
	t.regex(result.text, /1 deleted/gi);
});
