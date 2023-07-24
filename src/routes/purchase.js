import express from 'express';
import { Router } from 'express';
import { cartProduct } from './productsNew.js';
import { createTicket } from '../services/ticket.js';
import { findCartByIdAndUpdate } from '../services/cart.js';
import CrudMongoose from '../dao/Mongoose/controllers/ProductManager.js';
import CustomErrors from '../helpers/customErrors.js';
import __dirname from '../utils.js'

const purchaseRouter = Router()
const Products = new CrudMongoose()


const customErrors = new CustomErrors()

const data = async idProduct => {
  const product = await Products.findProductsById(idProduct)
  const { title,description,price,status,category,thumbnail,code,stock} = product
  return { title, description,price,status,category,thumbnail,code,stock}
}

purchaseRouter
  .use('/', express.static(__dirname + '/public'))
  .get('/:id', async (req, res, next) => {
    if (req.isAuthenticated()) {
      try {
        const cart = await cartProduct(req.params.id)
        req.session.cartId = req.params.id
        res.render('purchase', {
          title: 'Datos de compra',
          nameUser: req.session.nameUser,
          rol: req.session.role,
          countCart: cart.countCart,
          cartsProducts: cart.productsInCart,
          totalCart: cart.totalCart
        })
      } catch (error) {
        next(customErrors.internal('Error'))
      }
    } else {
      return res.status(200).redirect('/api/session')
    }
  })
  .post('/', async (req, res, next) => {
    try {
      const cart = await cartProduct(req.session.cartId)
      for (let i = 0; i < cart.productsInCart.length; i++) {
        const idProduct = cart.productsInCart[i].id
        const dataProduct = await data(idProduct)
        dataProduct.stock = dataProduct.stock - cart.productsInCart[i].quantity
        await Products.updateProducts(idProduct, dataProduct)
      }
      const productsInCart = []
      for (let i = 0; i < cart.productsInCart.length; i++) {
        const product = {
          _id: cart.productsInCart[i].id,
          name: cart.productsInCart[i].title,
          price: cart.productsInCart[i].price,
          totalPrice: cart.productsInCart[i].totalPrice,
          quantity: cart.productsInCart[i].quantity
        }
        productsInCart.push(product)
      }
      const code = Math.random().toString()
      const dataTicket = {
        code,
        amount: cart.totalCart,
        namePurchase: req.body.name,
        address: `${req.body.address} ${req.body.addressNumber}`,
        products: productsInCart,
        purchaser: req.session.passport.user
      }
      await createTicket(dataTicket)
      req.session.ticketCode = code

      await findCartByIdAndUpdate(req.session.cartId, { products: [] })
      return res.status(200).redirect('/ticket')
    } catch (error) {
      next(customErrors.internal('Error'))
    }
  })

export default purchaseRouter