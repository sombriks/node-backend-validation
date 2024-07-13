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

## Hardware / Scenario / Results

All tests executed with initially empty database.

| Compute             | Scenario        | No Validation | Manual Validation | Joi | TS-Node |
|---------------------|-----------------|---------------|-------------------|-----|---------|
| Mac M1 Air          | 01 / 30s / 10vu | 3447 reqs     | 2684 reqs         |     |         |
| Intel Core i7-1255U | 01 / 30s / 10vu | 1463 reqs     | 1773 reqs         |     |         |

## Noteworthy

- A very interesting effect observed on M1 chip: it was cheaper to let request
  hit the database instead of perform some validation over the payload. I
  suspect it benefited from some form of cache, since we're talking about an
  [experimental database][pglite].

[go]: https://go.dev
[k6]: https://grafana.com/docs/k6/latest/using-k6/http-requests
[pglite]: https://electric-sql.com/docs/integrations/drivers/server/pglite
