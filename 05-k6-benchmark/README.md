# K6 benchmark

Small scripts to perform operations against the address book service in all its
variations.

## Dependencies

- [go][go] 1.22
- [k6][k6] 0.49

## How to run

Make sure you have one running service first

```bash
k6 run scenario-01.js
```

Scenario 01 consists in:

- successfully create an address
- successfully list all address. it gets, obviously, slower over te time.
- one address creation failure. here we hit the validation strategy.
- find address failure. another hit in validation strategy, the id is invalid.

## Hardware / Scenario / Results

All tests executed with initially empty database.

| Compute               | Scenario   | No Validation | Manual Validation | Joi       | TS-Node   |
|-----------------------|------------|---------------|-------------------|-----------|-----------|
| Mac M1 Air            | 30s / 10vu | 3447 runs     | 2684 runs         | 2660 runs | 2620 runs |
| Intel Core i7-1255U   | 30s / 10vu | 2470 runs     | 2517 runs         | 2531 runs | 2543 runs |
| AMD Ryzen 7 PRO 5850U | 30s / 10vu | 2123 runs     | 2100 runs         | 2145 runs | 2093 runs |

## Noteworthy

- A very interesting effect observed on M1 chip: it was cheaper to let request
  hit the database instead of perform some validation over the payload. I
  suspect it benefited from some form of cache, since we're talking about an
  [experimental database][pglite] supporting single connection.
- On i7 tests, repeated a few times, there was little variation, showing the IO
  bound nature of the benchmark. But validation-enabled versions show a little
  advantage over no-validation version.
- Same little variation observed on Ryzen 7. This reinforces the IO bound nature
  of this benchmark. A re-run and add disk information along processor would be
  good.

[go]: https://go.dev
[k6]: https://grafana.com/docs/k6/latest/using-k6/http-requests
[pglite]: https://electric-sql.com/docs/integrations/drivers/server/pglite
