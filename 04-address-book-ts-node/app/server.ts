import Koa from 'koa'
import { Context } from 'koa'

export const app: Koa = new Koa()

app.use(async (ctx: Context) => {
  const {name} = ctx.request.query
  const n1: string = <string>ctx.request.query.n1
  ctx.body = `Hello, ${name}, the number is ${10 - parseInt(n1)}`
})