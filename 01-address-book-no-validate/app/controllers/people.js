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
			const {q = ''} = context.request.query;
			context.body = await peopleServices.list(q);
		},
		async find(context) {},
		async insert(context) {},
		async update(context) {},
		async del(context) {},
	};
};
