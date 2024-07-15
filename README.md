# [node-backend-validation][repo]

[![CI tests](https://github.com/sombriks/node-backend-validation/actions/workflows/ci.yml/badge.svg)](https://github.com/sombriks/node-backend-validation/actions/workflows/ci.yml)

Samples on how to validate user data in node

## Why validate input

For some of you, the question might seems absurd, but it's a valid question for
anyone without any background, so:

Why validate data received from user or external service? Because:

- No useful system can rely on random input.
- Core principle of communication is meaning.
- Data should be adherent to the system domain.
- The early we validate, early we handle problems.
- No backend service should blindly trust data received.

## Samples

We showcase a few [Node.js][node] projects passing through distinct approaches
to validation given certain constraints.

All projects offer the same REST API with a few differences regarding the
validation strategy being experimented:

    HTTP verb      Resource path                      Query parameters

    GET,POST       /addresses                         q: string
    GET,PUT,DELETE /addresses/{id}
    GET            /addresses/{id}/people
    PUT,DELETE     /addresses/{id}/people/{person_id}
    GET,POST       /people                            q: string
    GET,PUT,DELETE /people/{id}
    GET            /people/{id}/phones                q: string
    PUT,DELETE     /people/{id}/phones/{phone_id}

See each project for response codes and payload details.

### [No validation at all][01]

What if we let data hit the database freely?
This sample answers this question.

### [Some verification of presence and type][02]

This project is meant to present the struggle of explicit validation.

### [Validation frameworks][03]

Here we use [joi][joi], a validation framework for node.

### [Static type checking][04]

In this project we leap from javascript to [typescript][ts] and make use of
static type check to help input data validation and development as well, thanks
to type hints.

## Noteworthy

- There is also a [small benchmark project][05] using [k6][k6], putting the API
  under stress test, so we can observe the consequences of each approach.
- There is coverage for all projects, but for some reason some of them report
  wrong line numbers.

[repo]: https://github.com/sombriks/node-backend-validation
[node]: https://nodejs.org
[01]: ./01-address-book-no-validate/README.md
[02]: ./02-address-book-manual-validation/README.md
[03]: ./03-address-book-joi/README.md
[joi]: https://joi.dev/
[04]: ./04-address-book-ts-node/README.md
[ts]: https://www.typescriptlang.org/
[05]: ./05-k6-benchmark/README.md
[k6]: <https://k6.io/>
