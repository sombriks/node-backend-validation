# Address book service - no validation at application level

This project demonstrates why we should validate user input by validating no
input received from requests.

All requests hits the database and only then service returns results.

It is meant so serve as benchmark for the other projects when put under stress
test.

## Dependencies

- [node][node] 20.14
- [koa][koa] 2.15
- [koa-jwt][koa-jwt] 4.0
- [@koa/cors][koa-cors] 5.0
- [@koa/router][koa-router] 12.0
- [koa-bodyparser][koa-bodyparser] 4.4
- [koa-api-builder][koa-api-builder] 0.2
- [@electric-sql/pglite][pglite] 0.1
- [cross-env][cross-env] 7.0
- [dotenv-flow][dotenv-flow] 4.1

## Development dependencies

- [nodemon][nodemon] 3.1
- [xo][xo] 0.58
- [ava][ava] 6.1
- [c8][c8] 10.1
- [supertest][supertest] 7.0

```bash
npm init -y 
npm i koa @koa/cors koa-jwt @koa/router koa-api-builder koa-bodyparser
npm i @electric-sql/pglite cross-env dotenv-flow
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

Check out [the][spec-app] [test][spec-service] [suites][spec-controller] for
details.

## Noteworthy

- Setup a Koa service is like build a custom motorbike, you can either end with
  a 55cc toy motorcycle or a real-life Kaneda's bike from Akira movie.
- Ava is blazing fast
- XO makes lint a pleasure, but sometimes the 'fixes' changes meaning.
- Supertest with Koa is a marriage made in heaven, koa exposes a pure node-ish
  callback and supertest handles the rest.
- PGLite is staging here to see if it can replace [sqlite][sqlite] as test
  database. It is in early stages, has [some limitations][limitations] but
  promising so far.
- The configs/controllers/services and provisioning functions is a good portable
  style being experimented here as well. Some stacks has DI containers, others
  doesn't. So it's a good practice keep a sane, straightforward setup phase with
  reasonable configuration functions instead of singleton exports.
- Kind reminder that async/await are contagious. I needed it early, for
  database, then it propagated to services and from services to controllers,
  making server setup async/await land as well.
- In this example project we had tests at service and controller modules. it's
  overengineering for the sake of the example. Unless testing specific scenarios
  narrowing down business details, no need to cover services, since controllers
  will cover them as well, given enough test cases.

[node]: https://nodejs.org
[koa]: https://koajs.com
[koa-jwt]: https://www.npmjs.com/package/koa-jwt
[koa-cors]: https://www.npmjs.com/package/@koa/cors
[koa-router]: https://www.npmjs.com/package/koa-router
[koa-bodyparser]: https://www.npmjs.com/package/koa-bodyparser
[koa-api-builder]: https://www.npmjs.com/package/koa-api-builder
[pglite]: https://www.npmjs.com/package/@electric-sql/pglite
[cross-env]: https://www.npmjs.com/package/cross-env
[dotenv-flow]: https://www.npmjs.com/package/dotenv-flow
[nodemon]: <https://www.npmjs.com/package/nodemon>
[xo]: <https://www.npmjs.com/package/xo>
[ava]: <https://www.npmjs.com/package/ava>
[c8]: <https://www.npmjs.com/package/c8>
[supertest]: <https://www.npmjs.com/package/supertest>
[sqlite]: https://sqlite.org
[limitations]: https://github.com/electric-sql/pglite?tab=readme-ov-file#limitations
[spec-app]: ./app/app.spec.js
[spec-service]: ./app/services/services.spec.js
[spec-controller]: ./app/controllers/controllers.spec.js
