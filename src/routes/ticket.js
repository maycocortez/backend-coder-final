import express, { Router } from 'express'
import __dirname from '../utils.js'
import { findTicket } from '../services/ticket.js'


const ticketRouter = Router()

ticketRouter
  .use('/', express.static(__dirname + '/public'))
  .get('/', async (req, res) => {
    // Buscamos los Datos del Ticket
    const ticket = await findTicket({ code: req.session.ticketCode })
    // Renderizamos el Ticket
    res.render('ticket', {
      title: 'Ticket | Backend',
      nameUser: req.session.nameUser,
      rol: req.session.role,
      emptyCart: true,
      products: ticket[0].products,
      amount: ticket[0].amount,
      namePurchase: ticket[0].namePurchase,
      address: ticket[0].address,
      code: ticket[0].code
    })
  })

export default ticketRouter