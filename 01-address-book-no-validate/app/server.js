import Koa from 'koa';
import ApiBuilder from 'koa-api-builder';
import { prepareAddressesRequests } from './controllers/addresses.js';
import { preparePeopleRequests } from './controllers/people.js';

const defaultControllers = {
	addressesRequests: prepareAddressesRequests(),
	peopleRequests: preparePeopleRequests(),
};

export const prepareServer = ({ controllers } = { controllers: defaultControllers }) => {
	const app = new Koa();

	const router = new ApiBuilder()
		.get('/health/status', context => context.body = 'ONLINE')
		.build();

	// Registering middlewares. the order is very important.
	app.use(router.routes());
	app.use(router.allowedMethods());

	return app;
};
