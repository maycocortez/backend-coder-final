import CustomErrors from '../helpers/customErrors.js'

const errorsHandlers = (err, req, res, next) => {
  if (err instanceof CustomErrors) {
    res.status(err.code).json(err.message)
    return
  }

  
  res.status(500).json('Error')
}

export default errorsHandlers