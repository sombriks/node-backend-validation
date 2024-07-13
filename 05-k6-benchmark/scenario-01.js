import http from 'k6/http';
import {check} from 'k6';

// See https://grafana.com/docs/k6/latest/examples/get-started-with-k6/
export const options = {
  duration: '30s',
  vus: 10,
};

/**
 * scenario 01, simple addresses operations
 */
export default function () {
  // create address
  const payload = {
    description: `Addr no. ${new Date().getTime()}`,
    complement: `any ${100 * Math.random()}`
  }

  // success creating.
  const r1 = http.post('http://0.0.0.0:3000/addresses', payload);
  check(r1, {
    '201 created': r => r.status === 201,
  })

  // success listing. this one grows slower over the time. on purpose.
  const r2 = http.get('http://0.0.0.0:3000/addresses');
  check(r2, {
    '200 list ok': r => r.status === 200,
  })

  // creation failure, missing complement.
  delete payload.complement
  const r3 = http.post('http://0.0.0.0:3000/addresses', payload);
  check(r3, {
    '500 did not create': r => r.status === 500,
  })

  // find failure.
  const r4 = http.get('http://0.0.0.0:3000/addresses/-1');
  check(r4, {
    '404 not found': r => r.status === 404,
  })
}
