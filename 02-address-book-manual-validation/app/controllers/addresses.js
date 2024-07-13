import {prepareAddressesServices} from '../services/addresses.js';
import {logger} from '../configs/logging.js';

const log = logger.scope('controllers', 'addresses.js');

export const prepareAddressesRequests = async options => {
	options ||= {addressesServices: await prepareAddressesServices()};
	const {addressesServices} = options;
	return {
		async list(context) {
			log.info('list addresses');
			const {q = ''} = context.request.query;
			// Deliberately letting parameters hit the service without care
			context.body = await addressesServices.list({q});
		},
		async find(context) {
			log.info('find address');
			const result = await addressesServices.find(context.request.params);
			if (result) {
				context.body = result;
			} else {
				log.warn('No address found');
				context.throw(404, 'Not Found');
			}
		},
		async create(context) {
			log.info('create address');
			const {description, complement} = context.request.body;
			if (!description) {
				log.warn('invalid address description');
				return context.throw(400, 'invalid address description');
			}

			if (complement === null || complement === undefined) {
				log.warn('invalid address complement');
				return context.throw(400, 'invalid address complement');
			}

			const id = await addressesServices.create({address: {description, complement}});
			context.status = 201;
			context.set('Location', `/addresses/${id}`); // Politely guide clients to somewhere else
			context.body = {message: `#${id} created`};
		},
		async update(context) {
			log.info('update address');
			const {id} = context.params;
			const {body: address} = context.request;
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
			const affected = await addressesServices.del(context.request.params);
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
				if (addresses_id <= 0) {
					log.error(`id ${addresses_id} is invalid`);
					return context.throw(400, `id ${addresses_id} is invalid`);
				}

				context.body = await addressesServices.people.list({addresses_id});
			},
			async add(context) {
				log.info('add people into address');
				const {id: addresses_id, people_id} = context.params;
				const affected = await addressesServices.people.add({addresses_id, people_id});
				if (!affected) {
					log.warn('No people added into address #' + addresses_id);
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
					log.warn('No people removed from address #' + addresses_id);
				}

				context.status = 303;
				context.set('Location', `/addresses/${addresses_id}/people`);
				context.body = {message: `${affected} removed`};
			},
		},
	};
};
