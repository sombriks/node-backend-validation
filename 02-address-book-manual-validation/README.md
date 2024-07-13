# Address book service - manual validation

This project samples rudimentary input validation so the database isn't hit by
garbage all the time.

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
- [signale][signale] 1.4

## Development dependencies

- [nodemon][nodemon] 3.1
- [xo][xo] 0.58
- [ava][ava] 6.1
- [c8][c8] 10.1
- [supertest][supertest] 7.0

The following commands can provision the npm project skeleton:

```bash
npm init -y 
npm i koa @koa/cors koa-jwt @koa/router koa-api-builder koa-bodyparser
npm i @electric-sql/pglite cross-env dotenv-flow signale
npm i -D nodemon xo c8 ava supertest
mkdir -p app/{configs/migrations,controllers,services}
touch .env .env.development .env.test index.js app/{app.spec.js,server.js} 
touch app/configs/{cross-origin.js,database.js,security.js,logging.js} 
touch app/configs/{hook-test-context.js,no-rollback.js}
touch app/configs/migrations/{2024-07-13-start-schema.sql,3000-test-data.sql}
touch app/controllers/{controllers.spec.js,addresses.js,people.js}
touch app/services/{services.spec.js,addresses.js,people.js,phones.js}
```

## How to build

Since this project is pure javascript, there is no real build phase except for
dependencies download. This is also why primary folder containing the scripts is
called `app` instead of `src`:

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

- Check same section from [previous project][proj01]. Both uses the same stack
  with little differences.
- In this example we added [signale][signale] for better service logging.
- The disadvantage of explicit validation is the noise introduced in the code:

  ```javascript
  // app/controllers/addresses.js
  // ...
  async create(context) {
    log.info('create address');
    const {description, complement} = context.request.body;
    if (!description) {
      log.warn('invalid address description');
      return context.throw(400, 'invalid address description');
    }

    if (complement === null || complement === undefined) {
      log.warn('invalid address complement');
      return context.throw(400, 'invalid address complement');
    }

    const id = await addressesServices.create({address: {description, complement}});
    context.status = 201;
    context.set('Location', `/addresses/${id}`); // Politely guide clients to somewhere else
    context.body = {message: `#${id} created`};
  }
  // ...
  ```

  We added in-place validation for just two attributes in our controller and it
  more than doubled in size.
- This migration system example tries to go forward and optimize a few things.
  Better logging and a lock strategy during migrations are a few improvements.

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
[signale]: https://www.npmjs.com/package/signale
[nodemon]: <https://www.npmjs.com/package/nodemon>
[xo]: <https://www.npmjs.com/package/xo>
[ava]: <https://www.npmjs.com/package/ava>
[c8]: <https://www.npmjs.com/package/c8>
[supertest]: <https://www.npmjs.com/package/supertest>
[proj01]: ../01-address-book-no-validate/README.md
