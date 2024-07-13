import {preparePeopleServices} from '../services/people.js';
import {preparePhonesServices} from '../services/phones.js';

export const preparePeopleRequests = async options => {
	options ||= {
		peopleServices: await preparePeopleServices(),
		phonesServices: await preparePhonesServices(),
	};
	const {peopleServices, phonesServices} = options;
	return {
		async list(context) {
			context.body = await peopleServices.list(context.request.query);
		},
		async find(context) {
			const result = await peopleServices.find(context.request.params);
			if (result) {
				context.body = result;
			} else {
				context.throw(404, 'Not Found');
			}
		},
		async create(context) {
			const person = context.request.body;
			const id = await peopleServices.create({person});
			context.status = 201;
			context.set('Location', `/people/${id}`);
			context.body = {message: `#${id} created`};
		},
		async update(context) {
			const {id} = context.request.params;
			const {body: person} = context.request;
			const affected = await peopleServices.update({id, person});
			context.status = 303;
			context.set('Location', `/people/${id}`);
			context.body = {message: `${affected} updated`};
		},
		async del(context) {
			const {id} = context.request.params;
			const affected = await peopleServices.del({id});
			context.status = 303;
			context.set('Location', '/people');
			context.body = {message: `${affected} deleted`};
		},
		phones: {
			async list(context) {
				const {id: people_id} = context.request.params;
				const {q} = context.query;
				context.body = await phonesServices.list({people_id, q});
			},
			async find(context) {
				const {id: people_id, phones_id} = context.request.params;
				const result = await phonesServices.find({people_id, phones_id});
				if (result) {
					context.body = result;
				} else {
					context.throw(404, 'Not Found');
				}
			},
			async create(context) {
				const {id: people_id} = context.request.params;
				const {body: phone} = context.request;
				const phones_id = await phonesServices.create({people_id, phone});
				context.status = 201;
				context.set('Location', `/people/${people_id}/phones/${phones_id}`);
				context.body = {message: `#${phones_id} created`};
			},
			async update(context) {
				const {id: people_id, phones_id} = context.request.params;
				const {body: phone} = context.request;
				const affected = await phonesServices.update({people_id, phones_id, phone});
				context.status = 303;
				context.set('Location', `/people/${people_id}/phones/${phones_id}`);
				context.body = {message: `${affected} updated`};
			},
			async del(context) {
				const {id: people_id, phones_id} = context.request.params;
				const affected = await phonesServices.del({people_id, phones_id});
				context.status = 303;
				context.set('Location', `/people/${people_id}/phones`);
				context.body = {message: `${affected} deleted`};
			},
		},
	};
};
