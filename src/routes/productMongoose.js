
import { Router } from "express";
import CrudMongoose from "../dao/Mongoose/controllers/ProductManager.js";
import { verifyAdmin } from "../middlewares/verificateRoles.js";

const productDBrouter = Router();
const mongooseProducts = new CrudMongoose();


productDBrouter.get("/", async (req, res) => {
  try {
    res.status(200).send(await mongooseProducts.findProducts(req.query));
  } catch (err) {
    res.status(404).send("Error en la consulta", err);
  }
});
productDBrouter.get("/:id", async (req, res) => {
  try {
    res
      .status(200)
      .send(await mongooseProducts.findProductsById(req.params.id));
  } catch (err) {
    res.status(404).send("Not found", err);
  }
});

productDBrouter.put("/:id",verifyAdmin, async (req, res) => {
  try {
    res
      .status(200)
      .send(await mongooseProducts.updateProducts(req.params.id, req.body));
  } catch (err) {
    res.status(400).send("Error", err);
  }
});
productDBrouter.delete("/:id",verifyAdmin, async (req, res) => {
  console.log(req.params.id);
  try {
    res
      .status(200)
      .send(await mongooseProducts.deleteProductsById(req.params.id));
  } catch (err) {
    res.status(400).send("Error", err);
  }
});

export default productDBrouter;



