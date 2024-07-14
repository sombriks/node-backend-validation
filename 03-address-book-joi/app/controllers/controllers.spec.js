import test from 'ava';
import request from 'supertest';
import { testSetup, testTeardown } from '../configs/hook-test-context.js';

test.before(testSetup);

test.after.always(testTeardown);

test('should list addresses', async t => {
	const result = await request(t.context.app.callback()).get('/addresses');
	t.truthy(result);
	t.is(result.status, 200);
	t.true(Array.isArray(result.body));
	t.truthy(result.body.find(a => a.description.includes('Horses alley')));
});

test('should search addresses - single result', async t => {
	const result = await request(t.context.app.callback()).get('/addresses?q=horse');
	t.truthy(result);
	t.is(result.status, 200);
	t.true(Array.isArray(result.body));
	t.is(result.body.length, 1);
	t.truthy(result.body.find(a => a.description.includes('Horses alley')));
});

test('should search addresses - empty list', async t => {
	const result = await request(t.context.app.callback()).get('/addresses?q=route%2066');
	t.truthy(result);
	t.is(result.status, 200);
	t.true(Array.isArray(result.body));
	t.is(result.body.length, 0);
});

test('should find address', async t => {
	const result = await request(t.context.app.callback()).get('/addresses/1');
	t.truthy(result);
	t.is(result.status, 200);
	t.truthy(result.body);
	t.regex(result.text, /road 01/gi);
});

test('should NOT find address', async t => {
	const result = await request(t.context.app.callback()).get('/addresses/-1');
	t.truthy(result);
	t.is(result.status, 404);
});

test('should create address', async t => {
	const address = { description: 'El Dorado Rd 113', complement: '' };
	const result = await request(t.context.app.callback()).post('/addresses').send(address);
	t.truthy(result);
	t.is(result.status, 201);
	t.regex(result.headers.location, /\/addresses\/\d+/gi);
	t.regex(result.text, /created/gi);
});

test('should NOT create address due to invalid complement', async t => {
	const address = { description: 'El Dorado Rd 113' /* complement: '' */ };
	const result = await request(t.context.app.callback()).post('/addresses').send(address);
	t.truthy(result);
	t.is(result.status, 400);
	t.regex(result.text, /"complement" is required/gi);
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

test('should list people living in address', async t => {
	const result = await request(t.context.app.callback()).get('/addresses/1/people');
	t.truthy(result);
	t.is(result.status, 200);
	t.true(Array.isArray(result.body));
	t.is(result.body.length, 2);
});

test('should NOT list people due to invalid address', async t => {
	const result = await request(t.context.app.callback()).get('/addresses/-1/people');
	t.truthy(result);
	t.is(result.status, 400);
	t.regex(result.text, /id is invalid/gi);
});

test('should add people into address', async t => {
	const result = await request(t.context.app.callback()).put('/addresses/4/people/1');
	t.truthy(result);
	t.is(result.status, 303);
	t.regex(result.headers.location, /\/addresses\/4\/people/);
	t.regex(result.text, /1 added/gi);
});

test('should remove people from address', async t => {
	const result = await request(t.context.app.callback()).del('/addresses/2/people/3');
	t.truthy(result);
	t.is(result.status, 303);
	t.regex(result.headers.location, /\/addresses\/2\/people/);
	t.regex(result.text, /1 removed/gi);
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
	const result = await request(t.context.app.callback()).del('/people/4');
	t.truthy(result);
	t.is(result.status, 303);
	t.regex(result.headers.location, /\/people/gi);
	t.regex(result.text, /1 deleted/gi);
});

test('should list people\'s phones', async t => {
	const result = await request(t.context.app.callback()).get('/people/5/phones');
	t.truthy(result);
	t.is(result.status, 200);
	t.true(Array.isArray(result.body));
	t.truthy(result.body.find(a => a.number === '9101112'));
});

test('should find people\'s phones', async t => {
	const result = await request(t.context.app.callback()).get('/people/5/phones/3');
	t.truthy(result);
	t.is(result.status, 200);
	t.truthy(result.body);
	t.regex(result.text, /9101112/gi);
});

test('should create people\'s phone', async t => {
	const phone = { number: '55555' };
	const result = await request(t.context.app.callback()).post('/people/5/phones').send(phone);
	t.truthy(result);
	t.is(result.status, 201);
	t.regex(result.headers.location, /\/people\/\d+/gi);
	t.regex(result.headers.location, /\/phones\/\d+/gi);
	t.regex(result.text, /#\d+ created/gi);
});

test('should update people\'s phone', async t => {
	const phone = { number: '77771111' };
	const result = await request(t.context.app.callback()).put('/people/5/phones/3').send(phone);
	t.truthy(result);
	t.is(result.status, 303);
	t.regex(result.headers.location, /\/people\/5\/phones\/3/gi);
	t.regex(result.text, /1 updated/gi);
});

test('should delete people\'s phone', async t => {
	const phone = { number: '77771111' };
	const result = await request(t.context.app.callback()).del('/people/2/phones/2').send(phone);
	t.truthy(result);
	t.is(result.status, 303);
	t.regex(result.headers.location, /\/people\/2\/phones/gi);
	t.regex(result.text, /1 deleted/gi);
});
