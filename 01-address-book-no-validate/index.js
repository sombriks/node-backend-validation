import { prepareServer } from "./app/server.js";

const app = prepareServer() // prepare a server with reasonable defaults

const { PORT } = process.env

app.listen(PORT, () => console.log('http://0.0.0.0:' + PORT))
// open to business