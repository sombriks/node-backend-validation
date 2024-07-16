import {type Context} from 'koa';
import {type PeopleServices, type PersonParameters, preparePeopleServices} from '../services/people';
import {type PhoneServices, preparePhonesServices} from '../services/phones';
import {type Person} from '../models/person';
import {type Phone} from '../models/phone';
import {logger} from '../configs/logging';

const log = logger.scope('controllers', 'people.ts');

export type PeopleRequestsOptions = {
	peopleServices: PeopleServices;
	phonesServices: PhoneServices;
};

export type PeopleRequests = {
	list(context: Context): void;
	find(context: Context): void;
	create(context: Context): void;
	update(context: Context): void;
	del(context: Context): void;
	phones: {
		list(context: Context): void;
		find(context: Context): void;
		create(context: Context): void;
		update(context: Context): void;
		del(context: Context): void;
	};
};

/**
 * Provision a controller for manage people requests
 *
 * @param options config object with services needed by this controller. will
 * fallback to default values if null/undefined
 *
 * @returns {PeopleRequests} collection of requests ready to be configured into
 * an REST API
 */
export const preparePeopleRequests = async (options?: PeopleRequestsOptions) => {
	options ||= {
		peopleServices: await preparePeopleServices(),
		phonesServices: await preparePhonesServices(),
	};
	const {peopleServices, phonesServices} = options;
	return {
		async list(context: Context) {
			log.info('list people');
			context.body = await peopleServices.list(context.request.query);
		},
		async find(context: Context) {
			const result = await peopleServices.find((context.params as PersonParameters));
			if (result) {
				context.body = result;
			} else {
				context.throw(404, 'Not Found');
			}
		},
		async create(context: Context) {
			const person = context.request.body as Person;
			const id: number = await peopleServices.create({person});
			context.status = 201;
			context.set('Location', `/people/${id}`);
			context.body = {message: `#${id} created`};
		},
		async update(context: Context) {
			const {id} = context.params as Person;
			const person = context.request.body as Person;
			const affected: number 							= await peopleServices.update({id, person});
			context.status = 303;
			context.set('Location', `/people/${id}`);
			context.body = {message: `${affected} updated`};
		},
		async del(context: Context) {
			const {id} = context.params as Person;
			const affected = await peopleServices.del({id});
			context.status = 303;
			context.set('Location', '/people');
			context.body = {message: `${affected} deleted`};
		},
		phones: {
			async list(context: Context) {
				const {id: people_id} = context.params;
				const {q} = context.query as {q: string};// Inline types are ugly, reminder to avoid them
				context.body = await phonesServices.list({people_id, q});
			},
			async find(context: Context) {
				const {id: people_id, phones_id} = context.params;
				const result = await phonesServices.find({people_id, phones_id});
				if (result) {
					context.body = result;
				} else {
					context.throw(404, 'Not Found');
				}
			},
			async create(context: Context) {
				const {id: people_id} = context.params;
				const phone = context.request.body as Phone;
				const phones_id = await phonesServices.create({people_id, phone});
				context.status = 201;
				context.set('Location', `/people/${people_id}/phones/${phones_id}`);
				context.body = {message: `#${phones_id} created`};
			},
			async update(context: Context) {
				const {id: people_id, phones_id} = context.params;
				const phone = context.request.body as Phone;
				const affected = await phonesServices.update({people_id, phones_id, phone});
				context.status = 303;
				context.set('Location', `/people/${people_id}/phones/${phones_id}`);
				context.body = {message: `${affected} updated`};
			},
			async del(context: Context) {
				const {id: people_id, phones_id} = context.params;
				const affected = await phonesServices.del({people_id, phones_id});
				context.status = 303;
				context.set('Location', `/people/${people_id}/phones`);
				context.body = {message: `${affected} deleted`};
			},
		},
	};
};
