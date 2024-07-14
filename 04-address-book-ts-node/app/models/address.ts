import {type Person} from './person';

export type Address = {
	id?: number;
	description?: string;
	complement?: string;
	people?: Person[];
	created?: Date;
	updated?: Date;
};
