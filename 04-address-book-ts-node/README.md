# Address book service - static type checking

This example intends to use static type checking on top of everything else
already seen so far about validation.

## Dependencies

- [node][node] 20.14
- [typescript][typescript] 5.5
- [ts-node][ts-node] 10.9

## Development dependencies

## Provisioning

```bash
npm init -y
npm i -D typescript ts-node
npx tsc --init

```

## Build

## Run

## Test

## Noteworthy

- With type checking enabled via ts-node, typescript becomes what it really
  should be: a first-class statically type-checked language with erros at
  compile time and runtime:
  ![static type checking](docs/static-type-checking.png)
- On the other hand, we had to set node module type to "commonjs". All previous
  projects are using modern node module type resolution. But typescript itself
  still uses `import` instead of `require` by default, so the overall DX is the
  same. Not a future-proof solution, but get the job done.
- `tsconfig.json` seems to be entirely optional, but we generated one (with the
  usual `npx tsc --init`) just to make clear that this is a
  [typescript][typescript] project.
- ava requires [special configuration][ts-ava] to proper work with ts-node, but
  besides that everything just works, [c8][c8] coverage tool included.

[node]: https://nodejs.org
[typescript]: https://typescriptlang.org/
[ts-node]: https://typestrong.org/ts-node/
[ts-ava]: https://typestrong.org/ts-node/docs/recipes/ava
