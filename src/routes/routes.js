import { Router } from "express";
import productRouter from "./productFileSystem.js";
import socketRouter from "./socket.js";
import productDBrouter from "./productMongoose.js"
import cartsMongooseRouter from "./cartsMongoose.js";
import productsRouter from "./productsNew.js";
import sessionRouter from "./session.js";
import usersRouter from "./user.js";
import githubRouter from "./github.js";
import error404Router from "./error404.js";
import routerEmail from './mail.js'
import ticketRouter from './ticket.js'
import purchaseRouter from './purchase.js'
import chatRouter from "./chat.js";
import mocksRouter from './mocks.js'
import { developmentLogger,productionLogger } from "../../utils/logger.js";
import swaggerUiExpress from 'swagger-ui-express'
import { specs } from "../../utils/swagger.js";

const router = Router();

router
  .use("/api/products", productRouter)
  .use("/api/session", sessionRouter)
  .use("/realTimeProducts", socketRouter)
  .use("/mongoose/products", productDBrouter)
  .use("/mongoose/carts", cartsMongooseRouter)
  .use("/products", productsRouter)
  .use("/users", usersRouter)
  .use("/session", githubRouter)
  .use('/mail', routerEmail)
  .use('/chat', chatRouter)
  .use('/purchase', purchaseRouter)
  .use('/ticket', ticketRouter)
  .use('/mockingProducts', mocksRouter)
  .use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))
  .use('/logger', (req, res) => {
    developmentLogger.debug('Mensaje de debug desde el endpoint');
    developmentLogger.info('Mensaje de info desde el endpoint');
    developmentLogger.warning('Mensaje de warning desde el endpoint');
    developmentLogger.error('Mensaje de error desde el endpoint');

    productionLogger.info('Mensaje de info desde el endpoin (producción)');
    productionLogger.warning('Mensaje de warning desde el endpoin (producción)');
    productionLogger.error('Mensaje de error desde el endpoin (producción)');

    res.send('Test.');
  })
  .use("*", error404Router);


export default router;