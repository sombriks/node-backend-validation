import test from 'ava';
import request from 'supertest';
import {testSetup, testTeardown} from './configs/hook-test-context.js';

test.before(testSetup);

test.after.always(testTeardown);

test('it should be ONLINE', async t => {
	const result = await request(t.context.app.callback()).get('/health/status');
	t.truthy(result);
	t.is(result.status, 200);
	t.is(result.text, 'ONLINE');
});
