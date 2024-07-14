import {type Person} from './person';

export type Phone = {
	id?: number;
	number?: string;
	person?: Person;
	created?: Date;
	updated?: Date;
};
