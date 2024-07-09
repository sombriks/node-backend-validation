import Koa from "koa"
import ApiBuilder from "koa-api-builder"

const defaultServerConfig = {}

export const prepareServer = ({ } = defaultServerConfig) => {

  const app = new Koa()

  const router = new ApiBuilder()
    .get("/health/status", ctx => ctx.body = "ONLINE")
    .build()

  app.use(router.routes())
  app.use(router.allowedMethods())

  return app
}