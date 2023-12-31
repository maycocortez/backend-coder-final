import { Router } from 'express'
import CrudMongoose from '../dao/Mongoose/controllers/ProductManager.js'
import { io } from '../index.js'
import { logger } from '../../utils/logger.js'

const socketRouter = Router()
const Products = new CrudMongoose()

socketRouter.get('/', async (req, res) => {
  const products = await Products.findAllProducts()
  io.on('connection', socket => {
    socket.on('messaje', data => {
      logger.info(data)
      io.sockets.emit('estado', 'Conectado con el Servidor por Sockets')
    })

    socket.on('getProduct', async data => {
      const byIdProducts = await Products.findProductsById(data)
      if (data === '') {
        io.sockets.emit('getProduct', {
          messaje: 'Se consultaron todos los Productos',
          products
        })
      } else if (byIdProducts === 'Producto no Encontrado') {
        io.sockets.emit('getProduct', {
          messaje: byIdProducts,
          products: []
        })
      } else {
        io.sockets.emit('getProduct', {
          messaje: 'Consulta Exitosa',
          products: [byIdProducts]
        })
      }
    })

    socket.on('addProduct', async data => {
      const addProduct = await Products.createProducts(JSON.parse(data))
      io.sockets.emit('addProduct', {
        messaje: addProduct,
        products
      })
    })

    socket.on('putProduct', async data => {
      const updateProduct = await Products.updateProducts(
        data.id,
        JSON.parse(data.info)
      )
      io.sockets.emit('putProduct', {
        messaje: updateProduct,
        products
      })
    })

    socket.on('deleteProduct', async data => {
      const deleteProduct = await Products.deleteProductsById(data)
      io.sockets.emit('deleteProduct', {
        messaje: deleteProduct,
        products
      })
    })
  })

  res.render('realTimeProducts', {
    title: 'Prueba con express',
    noNav: true,
    noFooter: true,
    products
  })
})

export default socketRouter