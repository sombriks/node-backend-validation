import {prepareAddressesServices} from '../services/addresses.js';

const addressesServices = prepareAddressesServices();

export const prepareAddressesRequests = ({services} = {services: addressesServices}) => {};
