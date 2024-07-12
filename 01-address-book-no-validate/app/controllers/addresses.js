import {prepareAddressesServices} from '../services/addresses.js';

export const prepareAddressesRequests = async options => {
  options ||= {addressesServices: await prepareAddressesServices()};
  const {addressesServices} = options;
  return {
    async list(context) {
      // Deliberately letting parameters hit the service without care
      context.body = await addressesServices.list(context.request.query);
    },
    async find(context) {
      context.body = await addressesServices.find(context.request.params);
    },
    async create(context) {
      const id = await addressesServices.create({address: context.request.body});
      context.status = 201;
      context.set('Location', `/addresses/${id}`); // Politely guide clients to somewhere else
      context.body = {message: `#${id} created`};
    },
    async update(context) {
      const {id} = context.params;
      const {body: address} = context.request;
      const affected = await addressesServices.update({id, address});
      context.status = 303; // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/303
      context.set('Location', `/addresses/${id}`);
      context.body = {message: `${affected} updated`};
    },
    async del(context) {
      const affected = await addressesServices.del(context.request.params);
      context.status = 303;
      context.set('Location', '/addresses');
      context.body = {message: `${affected} deleted`};
    },
    people: {
      async list(context) {
        const {id: addresses_id} = context.params;
        context.body = await addressesServices.people.list({addresses_id});
      },
      async add(context) {
        const {id: addresses_id, people_id} = context.params;
        const affected = await addressesServices.people.add({addresses_id, people_id});
        context.status = 303;
        context.set('Location', `/addresses/${addresses_id}/people`);
        context.body = {message: `${affected} added`};
      },
      async del(context) {
        const {id: addresses_id, people_id} = context.params;
        const affected = await addressesServices.people.del({addresses_id, people_id});
        context.status = 303;
        context.set('Location', `/addresses/${addresses_id}/people`);
        context.body = {message: `${affected} removed`};
      },
    },
  };
};
