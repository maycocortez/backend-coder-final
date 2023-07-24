import { PORT } from '../../../index.js'
import * as productService from '../../../services/product.js'

class CrudMongoose {
  objectKeys (object) {
    if (
      !object.title ||
      !object.description ||
      !object.price ||
      !object.status ||
      !object.category ||
      !object.code ||
      !object.stock
    ) {
      return 400
    }
  }

  exist = async id => {
    const products = await productService.findProducts()
    return products.find(prod => prod.id === id)
  }

  categorie = async () => {
    const categorie = await productService.findProducts({})
    const selectCategorie = []
    for (const prodCategorie of categorie) {
      selectCategorie.push(prodCategorie.category)
    }
    const single = new Set(selectCategorie)
    const categorieSingle = [...single].sort()
    return categorieSingle
  }

  findProducts = async data => {
    const categorie = await this.categorie()
    if (data) {
      const categorie =
        data.categorie === undefined ? {} : { categorie: data.categorie}
      const limit = parseInt(data.limit, 10) || 4
      const page = parseInt(data.page, 10) || 1
      const skip = limit * page - limit
      const sort = data.sort || 'asc'
      const filter = await productService.findPaginateProducts(categorie, {
        limit,
        page,
        skip,
        sort: { price: sort }
      })
      return [
        {
          ...filter,
          prevLink: `http://localhost:${PORT}/products/${page - 1}`,
          nextlink: `http://localhost:${PORT}/products/${page + 1}`,
          categorie
        }
      ]
    } else {
      const limit = 4
      const page = 1
      const products = await productService.findPaginateProducts(
        {},
        {
          limit,
          page,
          sort: { price: 'asc' }
        }
      )
      return [
        {
          ...products,
          prevLink: `http://localhost:${PORT}/products/${page - 1}`,
          nextlink: `http://localhost:${PORT}/products/${page + 1}`,
          categorie
        }
      ]
    }
  }

  findProductsById = async id => {
    const product = await this.exist(id)
    if (!product) return 'No se encontro el producto'
    return product
  }

  findAllProducts = async () => {
    return productService.findProducts()
  }

  createProducts = async product => {
    if (this.objectKeys(product) === 400) {
      return 'Faltan datos'
    }
    await productService.createProduct(product)
    return 'Producto agregado'
  }

  updateProducts = async (id, productToUpdate) => {
    const product = await this.exist(id)
    if (!product) return 'No se encontro el producto'
    if (this.objectKeys(productToUpdate) === 400) {
      return 'Faltan datos'
    }
    await productService.findByIdAndUpdate(id, productToUpdate)
    return 'Producto editado'
  }

  deleteProductsById = async id => {
    const product = await this.exist(id)
    if (!product) return 'No se encontro el producto'
    const deletedProduct = await productService.findByIdAndDelete(id)
    return `Producto ${deletedProduct.title} eliminado`
  }
}

export default CrudMongoose