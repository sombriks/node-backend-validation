import Koa, {type Context} from 'koa';
import bodyParser from 'koa-bodyparser';
import type Router from 'koa-router';
// @ts-expect-error module not declared / does not exists
import ApiBuilder from 'koa-api-builder';
import {type AddressesRequests, prepareAddressesRequests} from './controllers/addresses';
import {type PeopleRequests, preparePeopleRequests} from './controllers/people';
import {logger} from './configs/logging';

const log = logger.scope('server.ts');

export type ServerOptions = {
	addressesRequests: AddressesRequests;
	peopleRequests: PeopleRequests;
};

export const prepareServer = async (options?: ServerOptions): Promise<Koa> => {
	log.info('prepare server');
	// Config fallback
	options ||= {
		addressesRequests: await prepareAddressesRequests(),
		peopleRequests: await preparePeopleRequests(),
	};
	const {addressesRequests, peopleRequests} = options;

	// Design the REST API
	const router: Router = new ApiBuilder()
		.get('/health/status', (context: Context) => context.body = 'ONLINE')
		.path('/addresses', (b: any) => {
			b.get('', addressesRequests.list);
			b.post('', addressesRequests.create);
			b.path('/:id', (b: any) => {
				b.get('', addressesRequests.find);
				b.put('', addressesRequests.update);
				b.del('', addressesRequests.del);
				b.path('/people', (b: any) => {
					b.get('', addressesRequests.people.list);
					b.path('/:people_id', (b: any) => {
						b.put('', addressesRequests.people.add);
						b.del('', addressesRequests.people.del);
					});
				});
			});
		})
		.path('/people', (b: any) => {
			b.get('', peopleRequests.list);
			b.post('', peopleRequests.create);
			b.path('/:id', (b: any) => {
				b.get('', peopleRequests.find);
				b.put('', peopleRequests.update);
				b.del('', peopleRequests.del);
				b.path('/phones', (b: any) => {
					b.get('', peopleRequests.phones.list);
					b.post('', peopleRequests.phones.create);
					b.path('/:phones_id', (b: any) => {
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
	app.use(bodyParser());
	app.use(router.routes());
	app.use(router.allowedMethods());

	log.info('server prepared!');
	return app;
};
