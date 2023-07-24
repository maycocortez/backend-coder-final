import { roleModel } from "../dao/Mongoose/models/RoleSchema.js";
import { logger } from '../../utils/logger.js'
export const createRoles = async () => {
  try {
    const count = await roleModel.estimatedDocumentCount();
    if (count > 0) return;

    const result = await Promise.all([
      roleModel.create({ name: "admin" }),
      roleModel.create({ name: "user" }),
    ])
    logger.info(result)
  } catch (error) {
    logger.error(error)
  }
};