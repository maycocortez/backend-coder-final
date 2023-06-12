import { Router } from 'express'
import { verifyUser } from '../middlewares/verificateRoles.js';
const chatRouter = Router()

chatRouter.get("/", verifyUser, (req,res) => {
  res.render('chat', {
    layout: false
});
});


export default chatRouter
