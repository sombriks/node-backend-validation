# Address book service - no validation at application level

This project demonstrates why we should validate user input.

## Dependencies

- node 20.14
- koa 2.15
- koa-jwt 4.0
- @koa/cors 5.0
- @koa/router 12.0
- koa-bodyparser 4.4
- koa-api-builder 0.2
- @electric-sql/pglite 0.1
- cross-env 7.0
- dotenv-flow 4.1

## Development dependencies

- nodemon 3.1
- xo 0.17
- ava 6.1
- c8 10.1
- supertest 7.0

```bash
npm init -y 
npm i koa @koa/cors @koa/router koa-bodyparser koa-api-builder \
      @electric-sql/pglite cross-env dotenv-flow
npm i -D nodemon xo c8 ava supertest
mkdir -p app/{configs,requests,services}
touch .env .env.development .env.test index.js app/server.js 
touch app/configs/{database.js,cross-origin.js,security.js}
touch app/requests/{addresses.js,people.js}
touch app/services/{addresses.js,people.js,phones.js}
```

## How to build

```bash
npm i
```

## How to run

```bash
npm run dev
```

## How to test

```bash
npm run test:coverage
```

## Noteworthy

- Setup a Koa service is like build a custom motorbike, you can either end with
  a 55cc toy motorcycle or a real-life Kaneda's bike from Akira movie.
- Ava is blazing fast
- XO makes lint a pleasure
- Supertest for Koa middleware is a marriage in heaven
- PGLite is staging here to see if it can replace sqlite as test database.
- The configs/requests/services and provisioning functions is a portable style
  being experimented here as well. Some stacks offers DI containers, others
  doesn't. So it's a good practice keep a sane, straightforward setup phase with
  reasonable configuration functions instead of singleton exports.
