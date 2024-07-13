import { prepareServer } from "./app/server.js";
import { logger } from './app/configs/logging.js';

const log = logger.scope('index.js');

const start = async () => {
  const app = await prepareServer() // prepare a server with defaults

  const { PORT } = process.env

  log.info(`NODE_ENV is ${process.env.NODE_ENV || 'production'}`)
  app.listen(PORT, () => log.info('http://0.0.0.0:' + PORT))
  // open to business
}
start()
