import Koa from 'koa';
import ApiBuilder from 'koa-api-builder';
import {prepareAddressesRequests} from './controllers/addresses.js';
import {preparePeopleRequests} from './controllers/people.js';

export const prepareServer = async options => {
	options ||= {
		addressesRequests: await prepareAddressesRequests(),
		peopleRequests: await preparePeopleRequests(),
	};
	const app = new Koa();
	const {addressesRequests, peopleRequests} = options;
	const router = new ApiBuilder()
		.get('/health/status', context => context.body = 'ONLINE')
		.path('/addresses', b => {
			b.get('', addressesRequests.list);
		})
		.path('/people', b => {
			b.get('', peopleRequests.list);
		})
		.build();

	// Registering middlewares. the order is very important.
	app.use(router.routes());
	app.use(router.allowedMethods());

	return app;
};
