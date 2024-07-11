import test from 'ava';
import {prepareDatabase} from '../configs/database.js';
import {prepareAddressesServices} from '../services/addresses.js';
import {prepareAddressesRequests} from './addresses.js';
import {preparePeopleServices} from "../services/people.js";
import {preparePhonesServices} from "../services/phones.js";
import {preparePeopleRequests} from "./people.js";

test.before(async t => {
  const database = await prepareDatabase();

  const addressesService = await prepareAddressesServices({db: database});
  const addressesController = await prepareAddressesRequests({service: addressesService});

  const peopleService = await preparePeopleServices({db: database});
  const phonesService = await preparePhonesServices({db: database});
  const peopleController = await preparePeopleRequests({peopleService, phonesService});

  t.context.database = database;
  t.context.addressesController = addressesController;
  t.context.peopleController = peopleController;
});

test.after.always(async t => {
  await t.context.database.close();
});

test('should list addresses', async t => {
})
test('should find address', async t => {
})
test('should create addresses', async t => {
})
test('should update addresses', async t => {
})
test('should delete addresses', async t => {
})

test('should list people', async t => {
})
test('should find people', async t => {
})
test('should create people', async t => {
})
test('should update people', async t => {
})
test('should delete people', async t => {
})
