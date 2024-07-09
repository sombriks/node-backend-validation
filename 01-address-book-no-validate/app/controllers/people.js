import { preparePeopleServices } from '../services/people.js';
import { preparePhonesServices } from '../services/phones.js';

const defaultPeopleServices = preparePeopleServices();
const defaultPhonesServices = preparePhonesServices();

export const preparePeopleRequests = ({ peopleServices, phonesServices } = { peopleServices: defaultPeopleServices, phonesServices: defaultPhonesServices }) => { };
