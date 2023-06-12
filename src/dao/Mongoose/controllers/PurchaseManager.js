import * as cartService from '../../../services/cart.js'

export const purchaseCart = async id => {
  const cart = await cartService.findCartsById(id)
  return cart
}