import { prepareServer } from "./app/server.js";

const start = async () => {
  const app = await prepareServer() // prepare a server with defaults

  const { PORT } = process.env

  app.listen(PORT, () => console.log('http://0.0.0.0:' + PORT))
  // open to business
}
start()
