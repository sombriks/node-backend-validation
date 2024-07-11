import {prepareAddressesServices} from '../services/addresses.js';

export const prepareAddressesRequests = async options => {
	options ||= {service: await prepareAddressesServices()};
	const {service} = options;
	return {
		async list(context) {
			// Deliberately letting parameters hit the service without care
			context.body = await service.list(context.request.query.q);
		},
		async find(context) {
			context.body = await service.find(context.request.params.id);
		},
		async insert(context) {
			const id = await service.insert(context.request.body);
			context.status(201);
			context.location = `/addresses/${id}`;
			context.body = {message: 'created'};
		},
		async update(context) {},
		async del(context) {},
	};
};
