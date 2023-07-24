import userModel from '../dao/Mongoose/models/UserSchema.js'

class UserService {
  constructor () {
    this.model = userModel
  }

  findAllUsers = async () => {
    return await this.model.find({}).populate('roles').populate('cart', 'products')
  }

  findOneUser = async email => {
    return await this.model.findOne({ email }).populate('roles')
  }

  findByIdUser = async id => {
    return await userModel.findById(id).populate('roles')
  }

  createUser = async newUser => {
    return await userModel.create(newUser)
  }

  addCartToUser = async () => {
    return await userModel.addCartToUser()
  }

  encryptPassword = async password => {
    return this.model.encryptPassword(password)
  }

  comparePassword = async (password, passwordReciebed) => {
    return this.model.comparePassword(password, passwordReciebed)
  }

  createToken = async user => {
    return await userModel.createToken(user)
  }

  verifyToken = async token => {
    return await userModel.verifyToken(token)
  }

  updateUserDocumentsStatus = async (userId, files) => {
    try {
      const user = await this.model.findByIdUser(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      const documents = files.map(file => ({
        name: file.originalname,
        reference: file.filename
      }));

      user.documents = documents;
      await user.save();

      return user;
    } catch (error) {
      throw new Error(`Error al actualizar el estado de los documentos del usuario: ${error.message}`);
    }
  }



}

export default UserService