import userModel from "../dao/Mongoose/models/UserSchema.js";
import { roleModel } from "../dao/Mongoose/models/RoleSchema.js";


export const verifyAdmin = async (req, res, next) => {
  let user = await userModel.findById(req.session.passport.user);
  let roles = await roleModel.find({ _id: { $in: user.roles } });

  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === "admin") {
      next();
      return;
    }
  }
  res.status(403).send({ error: "No posees el rol de admin" });
};

export const verifyUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.session.passport.user);
    const roles = await roleModel.find({ _id: { $in: user.roles } });

    let isUser = false;

    roles.forEach((role) => {
      if (role.name === "user") {
        isUser = true;
      }
    });

    if (isUser) {
      next();
    } else {
      res.status(403).send({ error: "No tienes acceso al chat" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error en el servidor" });
  }
};
