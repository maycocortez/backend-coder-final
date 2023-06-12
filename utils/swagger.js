import swaggerJSDoc from 'swagger-jsdoc'
import __dirname from '../src/utils.js'

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce',
      description: 'Proyecto Backend'
    }
  },
  servers: [
    {
      url: 'http://localhost:8000'
    }
  ],
  apis: [`${__dirname}/docs/*.yaml`]
}
export const specs = swaggerJSDoc(swaggerOptions)