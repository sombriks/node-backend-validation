# [node-backend-validation][repo]

Samples on how to validate user data in node

## Why validate input

For some of you, the question might seems absurd, but it's a valid question for
anyone without any background, so:

- Data should be adherent to our domain.
- Core principle of communication is meaning.
- The early we validate, early we handle problems.
- No backend service should blindly trust data received.

## Samples

We showcase a few [Node.js][node] node projects passing through approaches to
validation and which one is better given some constraints.

### [No validation at all][01]

What if we let data hit the database freely? this sample answers this question.

### [Some verification of presence and type][02]

This project is meant to present the struggle of explicit validation.

### [Validation frameworks][03]

Here we use [joi][joi], a validation framework for node.

### [Static type checking][04]

In this project we leap from javascript to [typescript][ts] and make use of
types to help input data validation at compile time.

## Noteworthy

- There is also a small benchmark project using [k6][k6] putting the API under
  performance stress test so we can observe the consequences of each approach.
-

[repo]: https://github.com/sombriks/node-backend-validation
[node]: https://nodejs.org
[01]: ./01-address-book-no-validate/README.md
[02]: ./02-address-book-manual-validation/README.md
[03]: ./03-address-book-joi/README.md
[joi]: https://joi.dev/
[04]: ./04-address-book-ts-node/README.md
[ts]: https://www.typescriptlang.org/
[k6]: <https://k6.io/>
