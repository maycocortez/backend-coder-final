import userModel from '../models/UserSchema.js';
import { createHash, validatePassword } from '../../../../utils/bcrypt.js';
import { passportCall } from '../../../../utils/passportCall.js';

class SessionManager {
  getSession = (req, res, next) => {
    try {
      if (req.isAuthenticated() && req.session.login) {
        return res.status(200).redirect('/products');
      } else {
        let register = req.session.register;
        if (register === undefined) {
          register = {
            firstName: '',
            lastName: '',
            age: '',
            emailRegister: '',
          };
        }
        return res.status(200).render('login', {
          title: 'Login',
          noNav: true,
          noFooter: true,
          email: req.session.email,
          messageLogin: req.session.messageErrorLogin,
          signup: req.session.signup,
          messageSignup: req.session.messageErrorSignup,
          firstName: register.firstName,
          lastName: register.lastName,
          age: register.age,
          emailRegister: register.emailRegister,
          messageNewUser: req.session.messageNewUser,
        });
      }
    } catch (err) {
      res.status(500).send('Error', err);
    }
  }

  getCurrentSession = [
    passportCall('jwt'),
    (req, res, next) => {
      if (!req.user) {
        return res.status(401).send({ message: 'No tiene autorización' });
      }
  
      try {
        if (req.session.login) {
          return res.status(200).redirect('/products');
        } else {
          let register = req.session.register;
          if (register === undefined) {
            register = {
              firstName: '',
              lastName: '',
              age: '',
              emailRegister: '',
            };
          }
          return res.status(200).render('login', {
            title: 'Login',
            noNav: true,
            noFooter: true,
            email: req.session.email,
            messageLogin: req.session.messageErrorLogin,
            signup: req.session.signup,
            messageSignup: req.session.messageErrorSignup,
            firstName: register.firstName,
            lastName: register.lastName,
            age: register.age,
            emailRegister: register.emailRegister,
            messageNewUser: req.session.messageNewUser,
          });
        }
      } catch (err) {
        return res.status(500).send('Error', err);
      }
    },
  ];

  testLogin = async (req, res, next) => {
    try {
      const user = await userModel.findOne({ email: req.body.email });
      req.session.messageNewUser = '';
      if (user == null) {
        req.session.messageErrorLogin = 'Email incorrecto';
        req.session.email = '';
        return res.status(200).redirect('/api/session');
      } else if (!validatePassword(req.body.password, user.password)) {
        req.session.messageErrorLogin = 'La contraseña es incorrecta';
        req.session.email = user.email;
        return res.status(200).redirect('/api/session');
      } else {
        req.session.messageErrorLogin = '';
        req.session.email = user.email;
        req.session.login = true;
        return res.status(200).redirect('/products');
      }
    } catch (err) {
      res.status(500).send('Error', err);
    }
  }

  createUser = async (req, res, next) => {
    try {
      const { firstName, lastName, age, email, password, passwordConfirm } = req.body;
      req.session.messageErrorLogin = '';
      req.session.messageNewUser = '';
      req.session.register = {
        firstName,
        lastName,
        age,
        emailRegister: email,
        password,
        passwordConfirm,
      };
      const user = await userModel.findOne({ email });
      if (!firstName || !lastName || !age || !email || !password || !passwordConfirm) {
        req.session.signup = true;
        req.session.messageErrorSignup = 'Por favor completa todos los campos';
        return res.status(200).redirect('/api/session');
      } else if (user != null) {
        req.session.messageErrorSignup = 'Ingresa con tus datos';
        req.session.signup = true;
        req.session.email = email;
        return res.status(200).redirect('/api/session');
      } else if (password !== passwordConfirm) {
        req.session.messageErrorSignup = 'Las contraseñas no coinciden';
        req.session.signup = true;
        req.session.email = email;
        return res.status(200).redirect('/api/session');
      } else {
        const passEncrypted = createHash(password);
        const newUser = {
          firstName,
          lastName,
          age: parseInt(age),
          email,
          password: passEncrypted,
        };
        await userModel.create(newUser);
        req.session.messageErrorSignup = '';
        req.session.signup = false;
        req.session.email = email;
        req.session.messageNewUser = 'Ingresa con tu contraseña';
        return res.status(200).redirect('/api/session');
      }
    } catch (err) {
      res.status(500).send('Error al cerrar sesión', err);
    }
  }

  destroySession = (req, res, next) => {
    try {
      req.session.destroy();
      return res.status(200).redirect('/api/session');
    } catch (err) {
      res.status(500).send('Error al cerrar sesión', err);
    }
  }
}

export default SessionManager;
