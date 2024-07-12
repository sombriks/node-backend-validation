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
			context.body = await peopleServices.find(context.request.params);
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
			async list(context) {},
			async find(context) {},
			async create(context) {},
			async update(context) {},
			async del(context) {},
		},
	};
};
