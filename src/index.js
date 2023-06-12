import app from "./app.js";
import { Server } from "socket.io";
import { logger } from '../utils/logger.js'


export const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () =>
logger.info(`Conectado al  host ${server.address().port}`)
);
server.on("error", (err) => {
  logger.error(`Error: ${err}`);
});
export const io = new Server(server);

