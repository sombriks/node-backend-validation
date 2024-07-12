import test from 'ava';
import {prepareDatabase} from '../configs/database.js';
import {prepareAddressesServices} from './addresses.js';
import {preparePeopleServices} from './people.js';
import {preparePhonesServices} from './phones.js';

test.before(async t => {
	const database = await prepareDatabase();
	t.context.database = database;
	t.context.addressesService = await prepareAddressesServices({db: database});
	t.context.peopleService = await preparePeopleServices({db: database});
	t.context.phoneService = await preparePhonesServices({db: database});
});

test.after.always(async t => {
	await t.context.database.close();
});

// Sampling how to skip a test
test.skip('should list addresses', async t => {
	const result = await t.context.addressesService.list({q: ''});
	t.true(Array.isArray(result));
	t.truthy(result.find(a => a.description.includes('Horses alley')));
});

test('should find address', async t => {
	const result = await t.context.addressesService.find(({id: 2}));
	t.truthy(result);
	t.is(result.description, 'Dead end street');
});

test('should insert address', async t => {
	const address = {description: 'El Dorado Rd 113', complement: ''};
	const id = await t.context.addressesService.create({address});
	t.truthy(id);
	t.false(Number.isNaN(id));
});

test('should update address', async t => {
	const address = {description: 'Dead end street', complement: 'house #2'};
	const affected = await t.context.addressesService.update({id: 2, address});
	t.is(affected, 1);
});

test('should delete address', async t => {
	const affected = await t.context.addressesService.del({id: 5});
	t.is(affected, 1);
});

test('should list people', async t => {
	const result = await t.context.peopleService.list({q: ''});
	t.true(Array.isArray(result));
});

test('should list phones', async t => {
	const result = await t.context.phoneService.list({q: ''});
	t.true(Array.isArray(result));
});
