import CrudMongoose from "../dao/Mongoose/controllers/ProductManager.js";
import CartMongooseManager from "../dao/Mongoose/controllers/CartsManager.js";
import __dirname from "../utils.js";
import express from "express";
import { Router } from "express";
import { io } from "../index.js";
import UserService from '../services/user.js'

const productsRouter = Router();
const allNewProducts = new CrudMongoose();

const carts = new CartMongooseManager();
const userService = new UserService()

const products = async options => {
  const products = await allNewProducts.findProducts(options)
  
  const data = {
    title: 'E-commerce',
    products: products[0].docs,
    hasPrevPage: products[0].hasPrevPage,
    prevPage: products[0].prevPage,
    prevLink: products[0].prevLink,
    page: products[0].page,
    hasNextPage: products[0].hasNextPage,
    nextPage: products[0].nextPage,
    nextlink: products[0].nextlink,
    category: products[0].category
  }
  return data
}
export const cartProduct = async idCart => {
  const prod = await carts.findCartsById(idCart)
  const productsInCart = []
  for (let i = 0; i < prod.products.length; i++) {
    productsInCart.push({
      id: prod.products[i]._id.id,
      title: prod.products[i]._id.title,
      thumbnail: prod.products[i]._id.thumbnail,
      price: prod.products[i]._id.price,
      totalPrice: prod.products[i].quantity * prod.products[i]._id.price,
      quantity: prod.products[i].quantity
    })
  }
  const totalCart = productsInCart.reduce(
    (accumulator, currentValue) => accumulator + currentValue.totalPrice,
    0
  )
  const countCart = productsInCart.reduce(
    (accumulator, currentValue) => accumulator + currentValue.quantity,
    0
  )
  return { productsInCart, totalCart, countCart }
}

productsRouter
  .use('/', express.static(__dirname + '/public'))
  .get('/:page', async (req, res) => {
    if (req.isAuthenticated()) {
      const data = await products(req.params)
      req.session.login = true
      const user = await userService.findByIdUser(req.session.passport.user)
      req.session.nameUser = `${user.firstName} ${user.lastName}`
      req.session.role = user.roles[0].name
      const productsCart = await cartProduct(user.cart._id.toString())
      let emptyCart = false
      if (productsCart.totalCart === 0) emptyCart = true
      const token = await userService.createToken(user)
      res.cookie('jwtCookie', token)
      res.render('home', {
        ...data,
        nameUser: req.session.nameUser,
        rol: req.session.role,
        cartsProducts: productsCart.productsInCart,
        totalCart: productsCart.totalCart,
        emptyCart,
        countCart: productsCart.countCart,
        buyLink: `/purchase/${user.cart._id.toString()}`
      })
      io.on('connection', socket => {
        const idCart = user.cart._id.toString()
        socket.on('addToCart', async idProduct => {
          const addProduct = await carts.addProductToCart(idCart, idProduct)
          if (addProduct === 'No hay mas stock') {
            io.sockets.emit('noStock')
          } else {
            const products = await cartProduct(idCart)
            io.sockets.emit('addToCart', products)
          }
        })
        socket.on('removeProducts', async idProduct => {
          await carts.deleteProductToCart(idCart, idProduct)
          const products = await cartProduct(idCart)
          io.sockets.emit('removeProducts', products)
        })
        socket.on('deleteProductsInCart', async () => {
          await carts.emptycart(idCart)
          const products = await cartProduct(idCart)
          io.sockets.emit('deleteProductsInCart', products)
        })

        socket.on('purchaserCart', async () => {
          const productInCart = await carts.findCartsById(idCart)
          const productOutOfStock = []
          for (let i = 0; i < productInCart.products.length; i++) {
            const quantityCart = productInCart.products[i].quantity
            const idProduct = productInCart.products[i]._id._id.toString()
            const product = await allNewProducts.findProductsById(idProduct)
            const stockProduct = product.stock
            if (quantityCart > stockProduct) {
              productOutOfStock.push({
                idProduct,
                title: productInCart.products[i]._id.title
              })
            }
          }
          if (!productOutOfStock.length) {
            io.sockets.emit('purchaserCart')
          } else {
            io.sockets.emit('noMoreStock', productOutOfStock)
          }
        })
      })
    } else {
      return res.status(200).redirect('/api/session')
    }


  })

export default productsRouter