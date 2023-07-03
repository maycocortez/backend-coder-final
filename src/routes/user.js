import { Router } from "express";
import passport from "passport";
import multer from "multer";
import path from "path";
import UserService from '../services/user.js';
import __dirname from '../utils.js'

const usersRouter = Router();
const userService = new UserService();

// Configuración de multer para almacenar los archivos en diferentes carpetas
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { uid } = req.params;
    const { fieldname } = file;
    let uploadPath = "";

    if (fieldname === "profileImage") {
      uploadPath = path.join(__dirname, "../uploads/profiles");
    } else if (fieldname === "productImage") {
      uploadPath = path.join(__dirname, "../uploads/products");
    } else if (fieldname === "document") {
      uploadPath = path.join(__dirname, "../uploads/documents");
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

usersRouter
  .get('/', async (req, res) => {
    const users = await userService.findAllUsers();
    return res.status(200).send(users);
  })
  .post('/register', passport.authenticate('register'), async (req, res) => {
    res.status(200).send({
      status: 'success',
      message: 'Usuario creado'
    });
  })
  .post('/login', passport.authenticate('login'), async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).send({
          status: 'error',
          error: 'Usuario incorrecto'
        });
      }
      req.session.login = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        age: req.user.age,
        email: req.user.email
      };
      return res.status(200).send({
        status: 'success',
        payload: req.user
      });
    } catch (error) {
      res.status(500).send(error);
    }
  })
  .post('/:uid/documents', upload.array("documents"), async (req, res) => {
    try {
      const { uid } = req.params;
      const { files } = req;

      // Actualizar el usuario con el status de los documentos subidos
      await userService.updateUserDocumentsStatus(uid, files);

      res.status(200).send({
        status: 'success',
        message: 'Documentos subidos correctamente'
      });
    } catch (error) {
      res.status(500).send(error);
    }
  });

export default usersRouter;