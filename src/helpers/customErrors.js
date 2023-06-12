class CustomErrors {
    constructor (code, message) {
      this.code = code
      this.message = message
    }
  
    badRequest (msg) {
      return new CustomErrors(400, msg)
    }

  forbidden(msg) {
    return new CustomErrors(403, msg);
  }

  notFound(msg) {
    return new CustomErrors(404, msg);
  }
  
    internal (msg) {
      return new CustomErrors(500, msg)
    }
  }
  
  export default CustomErrors