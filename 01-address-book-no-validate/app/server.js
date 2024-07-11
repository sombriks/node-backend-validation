import Koa from 'koa';
import ApiBuilder from 'koa-api-builder';
import {prepareAddressesRequests} from './controllers/addresses.js';
import {preparePeopleRequests} from './controllers/people.js';

export const prepareServer = async options => {
	// Config fallback
	options ||= {
		addressesRequests: await prepareAddressesRequests(),
		peopleRequests: await preparePeopleRequests(),
	};
	const {addressesRequests, peopleRequests} = options;

	// Design the REST API
	const router = new ApiBuilder()
		.get('/health/status', context => context.body = 'ONLINE')
		.path('/addresses', b => {
			b.get('', addressesRequests.list);
			b.post('', addressesRequests.create);
			b.path(':id', b => {
				b.get('', addressesRequests.find);
				b.put('', addressesRequests.update);
				b.del('', addressesRequests.del);
			});
		})
		.path('/people', b => {
			b.get('', peopleRequests.list);
			b.post('', peopleRequests.create);
			b.path(':id', b => {
				b.get('', peopleRequests.find);
				b.put('', peopleRequests.update);
				b.del('', peopleRequests.del);
				b.path('/phones', b => {
					b.get('', peopleRequests.phones.list);
					b.post('', peopleRequests.phones.create);
					b.path(':phones_id', b => {
						b.get('', peopleRequests.phones.find);
						b.put('', peopleRequests.phones.update);
						b.del('', peopleRequests.phones.del);
					});
				});
			});
		})
		.build();

	// Registering middlewares. the order is very important.
	const app = new Koa();
	app.use(router.routes());
	app.use(router.allowedMethods());

	return app;
};
