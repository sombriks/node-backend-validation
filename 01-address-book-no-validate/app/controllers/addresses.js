import {prepareAddressesServices} from '../services/addresses.js';

export const prepareAddressesRequests = async options => {
	options ||= {service: await prepareAddressesServices()};
	const {service} = options;
	return {
		async list(context) {
			// Deliberately letting parameters hit the service without care
			context.body = await service.list(context.request.query);
		},
		async find(context) {
			context.body = await service.find(context.request.params);
		},
		async create(context) {
			const id = await service.create({address: context.request.body});
			context.status(201);
			context.location = `/addresses/${id}`;
			context.body = {message: 'created'};
		},
		async update(context) {
			const {id} = context.params;
			const {body: address} = context.request;
			const affected = await service.update({id, address});
			context.status(303);
			context.location = `/addresses/${id}`;
			context.body = {message: `${affected} updated`};
		},
		async del(context) {
			const affected = await service.del(context.request.params);
			context.status(303);
			context.location = '/addresses';
			context.body = {message: `${affected} updated`};
		},
	};
};
