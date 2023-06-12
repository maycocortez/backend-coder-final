import { Router } from 'express'
import nodemailer from 'nodemailer'

const routerEmail = Router()

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'coder@gmail.com',
    pass: '...'
  }
})

routerEmail.get('/', async (req, res) => {
  try {
    await transporter.sendMail({
      from: '<coder@gmail.com>',
      to: 'coder123@gmail.com',
      subject: 'Test',
      html: `
          <p>Test<p>

        `,
      attachments: []
    })
    res.status(200).send('Test finalizado')
  } catch (error) {
    res.status(500).send(error)
  }
})

export default routerEmail