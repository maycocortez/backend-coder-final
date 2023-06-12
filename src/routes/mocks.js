import { Router } from 'express'
import { faker } from '@faker-js/faker'

const mocksRouter = Router()

mocksRouter.use('/', (req, res, next) => {
  const products = []

  const random = () => {
    return {
      _id: faker.database.mongodbObjectIds(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      status: faker.datatype.boolean(0.9),
      category: faker.music.genre(),
      thumbnail: faker.image.urlPicsumPhotos(),
      price: faker.commerce.price(),
      code: faker.datatype.string(7),
      stock: faker.datatype.number({ min: 1, max: 10 })
    }
  }
  for (let i = 0; i < 100; i++) {
    products.push(random())
  }

  res.status(200).send(products)
})

export default mocksRouter