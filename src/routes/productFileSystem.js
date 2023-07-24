import { Router } from "express";
import ProductManager from "../dao/FileSystem/controllers/ProductManager.js"
import { logger } from '../../utils/logger.js'
const productFSRouter = Router();

const products = new ProductManager();

productFSRouter.get("/", async (req, res) => {
  try {
    res.send(await products.getProducts(req.query.limit));
  } catch (error) {
    logger.error(error);
  }
});
productFSRouter
  .get("/:id", async (req, res) => {
    try {
      let getProductById = await products.getProductsById(req.params.id);
      if (getProductById === "Not found")
        return res
          .status(404)
          .send({ error: "El producto que buscas no existe" });
      return res.send(getProductById);
    } catch (error) {
      logger.error(error);
    }
  })
  .post("/", async (req, res) => {
    let addProduct = await products.addProduct(req.body);
    if (addProduct === "Faltan datos")
      return res.status(400).send({ error: "Faltan Datos" });
    return res.send(addProduct);
  })
  .put("/:id", async (req, res) => {
    const { id } = req.params;
    const modify = req.body;
    let editProducts = await products.updateProducts(id, modify);
    if (editProducts === "No existe el producto")
      return res
        .status(404)
        .send({ error: "No existe el producto" });
    if (editProducts === "Faltan datos")
      return res
        .status(400)
        .send({ error: "Faltan datos" });
    return res.send(editProducts);
  })
  .delete("/:id", async (req, res) => {
    let productDelete = await products.deleteProductById();
  
    res.send(productDelete);
  });

export default productFSRouter;
