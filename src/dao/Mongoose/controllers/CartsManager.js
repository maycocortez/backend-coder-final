import { findProducts } from '../../../services/product.js'
import * as cartService from '../../../services/cart.js'

class CartMongooseManager {
  existCarts = async id => {
    const carts = await cartService.findCarts()
    return carts.find(cart => cart.id === id)
  }

  existProduct = async id => {
    const products = await findProducts()
    return products.find(product => product.id === id)
  }

  findCarts = async () => {
    const carts = await cartService.findCarts()
    return carts
  }

  findCartsById = async id => {
    const cart = await this.existCarts(id)
    if (!cart) return 'No se encontro el carrito'
    return await cartService.findCartsById(id)
  }

  createCarts = async () => {
    await cartService.createCart()
    return 'Carrito creado'
  }

  addProductToCart = async (idCart, idProduct) => {
    const cart = await this.existCarts(idCart)
    if (!cart) return 'No se encontro el carrito'

    const product = await this.existProduct(idProduct)
    if (!product) return 'No se encontro el producto'

    const purchaseProduct = cart.products.some(
      product => product.id === idProduct
    )
    if (!purchaseProduct) {
      const addProduct = [{ _id: product.id, quantity: 1 }, ...cart.products]
      await cartService.findCartByIdAndUpdate(idCart, { products: addProduct })
      return `Producto ${product.title} agregado . Cantidad: 1`
    } else {
      const indexProduct = cart.products.findIndex(
        product => product.id === idProduct
      )

      if (cart.products[indexProduct].quantity === product.stock) {
        return 'No hay mas stock'
      } else {
      cart.products[indexProduct].quantity++
      const quantityOfProducts = cart.products[indexProduct].quantity
      await cartService.findCartByIdAndUpdate(idCart, {
        products: cart.products
      })
      return `Producto ${product.title} agregado. Cantidad: ${quantityOfProducts}`
    }
  }
  }
  updateProductToCart = async (idCart, idProduct, newQuantity) => {
    const cart = await this.existCarts(idCart)
    if (!cart) return 'No se encontro el carrito'

    const purchaseProduct = cart.products.some(
      product => product.id === idProduct
    )
    if (!purchaseProduct) {
      return 'No se encontro el producto'
    } else {
      const indexProduct = cart.products.findIndex(
        product => product.id === idProduct
      )
      cart.products[indexProduct].quantity = newQuantity
      await cartService.findCartByIdAndUpdate(idCart, {
        products: cart.products
      })
      return `Producto actualizado. Cantidad: ${newQuantity}`
    }
  }
  updateCartsProducts = async () => {
    try {
      const carts = await cartService.findCarts();
      for (const cart of carts) {
        const products = cart.products;
        for (const product of products) {
          const existingProduct = await this.existProduct(product._id);
          if (existingProduct) {
            product.title = existingProduct.title;
            product.price = existingProduct.price;
            await cartService.findCartByIdAndUpdate(cart._id, { products });
          }
        }
      }
  
      return 'Productos de los carritos actualizados correctamente';
    } catch (err) {
      return 'Error al actualizar los productos de los carritos';
    }
  }

  deleteCarts = async id => {
    const cart = await this.existCarts(id)
    if (!cart) return 'No se encontro el carrito'
    await cartService.findCartByIdAndDelete(id)
    return 'Se elimino el carrito'
  }

  deleteProductToCart = async (idCart, idProduct) => {
    const cart = await this.existCarts(idCart)
    if (!cart) return 'No se encontro el carrito'

    const purchaseProduct = cart.products.some(
      product => product.id === idProduct
    )
    if (!purchaseProduct) {
      return 'No se encontro el producto'
    } else {
      const productsUpdate = cart.products.filter(
        product => product.id !== idProduct
      )
      await cartService.findCartByIdAndUpdate(idCart, {
        products: productsUpdate
      })
      return 'Producto eliminado.'
    }
  }



  deleteAllProductsFromCart = async (idCart) => {
    const cart = await this.existCarts(idCart);
    if (!cart) return 'No se encontro el carrito';
  
    await cartService.findCartByIdAndUpdate(idCart, { products: [] });
    return 'Se eliminaron todos los productos del carrito.';
  };
}

export default CartMongooseManager


