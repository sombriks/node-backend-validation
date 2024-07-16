import {type Context} from 'koa';
import {type AddressesParameters, type AddressesServices, prepareAddressesServices} from '../services/addresses';
import {logger} from '../configs/logging';
import {type Address} from '../models/address';

// Define a scope so you can better track from where the log message came from
const log = logger.scope('controllers', 'addresses.ts');

export type AddressesRequestsOptions = {
	addressesServices: AddressesServices;
};

export type AddressesRequests = {
	list(context: Context): void;
	find(context: Context): void;
	create(context: Context): void;
	update(context: Context): void;
	del(context: Context): void;
	people: {
		list(context: Context): void;
		add(context: Context): void;
		del(context: Context): void;
	};
};

export const prepareAddressesRequests = async (options?: AddressesRequestsOptions): Promise<AddressesRequests> => {
	options ||= {addressesServices: await prepareAddressesServices()};
	const {addressesServices} = options;
	return {
		async list(context) {
			log.info('list addresses');
			const {q = ''} = context.request.query as AddressesParameters;
			context.body = await addressesServices.list({q});
		},
		async find(context) {
			log.info('find address');
			const result = await addressesServices.find(context.params as AddressesParameters);
			if (result) {
				context.body = result;
			} else {
				log.warn('No address found');
				context.throw(404, 'Not Found');
			}
		},
		async create(context) {
			log.info('create address');
			const {description, complement} = context.request.body as Address;
			if (complement == undefined) {
				return context.throw(400, '"complement" is required');
			}

			const id = await addressesServices.create({address: {description, complement}});
			context.status = 201;
			context.set('Location', `/addresses/${id}`); // Politely guide clients to somewhere else
			context.body = {message: `#${id} created`};
		},
		async update(context) {
			log.info('update address');
			const {id} = context.params;
			const address = context.request.body as Address;
			const affected = await addressesServices.update({id, address});
			if (!affected) {
				log.warn('No address updated');
			}

			context.status = 303; // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/303
			context.set('Location', `/addresses/${id}`);
			context.body = {message: `${affected} updated`};
		},
		async del(context) {
			log.info('delete address');
			const affected = await addressesServices.del(context.params as AddressesParameters);
			if (!affected) {
				log.warn('No address removed');
			}

			context.status = 303;
			context.set('Location', '/addresses');
			context.body = {message: `${affected} deleted`};
		},
		people: {
			async list(context) {
				log.info('list people from address');
				const {id: addresses_id} = context.params;
				// TODO can type gymnastics solve this?
				if (addresses_id < 0) {
					return context.throw(400, 'id is invalid');
				}

				context.body = await addressesServices.people.list({addresses_id});
			},
			async add(context) {
				log.info('add people into address');
				const {id: addresses_id, people_id} = context.params;
				const affected = await addressesServices.people.add({addresses_id, people_id});
				if (!affected) {
					log.warn('No people added into address #' + (addresses_id as number));
				}

				context.status = 303;
				context.set('Location', `/addresses/${addresses_id}/people`);
				context.body = {message: `${affected} added`};
			},
			async del(context) {
				log.info('remove people from address');
				const {id: addresses_id, people_id} = context.params;
				const affected = await addressesServices.people.del({addresses_id, people_id});
				if (!affected) {
					log.warn('No people removed from address #' + (addresses_id as number));
				}

				context.status = 303;
				context.set('Location', `/addresses/${addresses_id}/people`);
				context.body = {message: `${affected} removed`};
			},
		},
	};
};
