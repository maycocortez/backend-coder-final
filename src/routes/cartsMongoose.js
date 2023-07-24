import { Router } from "express";
import CartMongooseManager from "../dao/Mongoose/controllers/CartsManager.js";

const dinamicCartsRouter = Router();
const dinamicCarts = new CartMongooseManager();

dinamicCartsRouter
  .get("/", async (req, res) => {
    try {
      res.status(200).send(await dinamicCarts.findCarts());
    } catch (err) {
      res.status(404).send("Error en la consulta", err);
    }
  })
  .get("/:id", async (req, res) => {
    try {
      res.status(200).send(await dinamicCarts.findCartsById(req.params.id));
    } catch (err) {
      res.status(404).send("Error en la consulta", err);
    }
  })
  .post("/", async (req, res) => {
    try {
      res.status(200).send(await dinamicCarts.createCarts());
    } catch (err) {
      res.status(404).send("Error al crear", err);
    }
  })
  .post("/:idc/product/:idp", async (req, res) => {
    try {
      res
        .status(200)
        .send(
          await dinamicCarts.addProductToCart(req.params.idc, req.params.idp)
        );
    } catch (err) {
      res.status(404).send("Error al agregar", err);
    }
  })
  .put("/:idc/product/:idp", async (req, res) => {
    try {
      res
        .status(200)
        .send(
          await dinamicCarts.updateProductToCart(
            req.params.idc,
            req.params.idp,
            parseInt(req.body.quantity)
          )
        );
    } catch (err) {
      res.status(404).send("No se pudo actualizar", err);
    }
  })
  .put("/:idc/product/:idp/update-products", async (req, res) => {
    try {
      const result = await dinamicCarts.updateCartsProducts();
      res.status(200).send(result);
    } catch (err) {
      res
        .status(404)
        .send("Error al actualizar los productos de los carritos", err);
    }
  })
  .delete("/:id", async (req, res) => {
    try {
      res.status(200).send(await dinamicCarts.deleteCarts(req.params.id));
    } catch (err) {
      res.status(404).send("Error al eliminar", err);
    }
  })
  .delete("/:idc/product/:idp", async (req, res) => {
    try {
      res
        .status(200)
        .send(
          await dinamicCarts.deleteProductToCart(
            req.params.idc,
            req.params.idp
          )
        );
    } catch (err) {
      res.status(404).send("Error", err);
    }
  })

  .delete("/:idc/products", async (req, res) => {
    try {
      res.status(200).send(await dinamicCarts.deleteAllProductsFromCart(req.params.idc));
    } catch (err) {
      res.status(404).send("Error", err);
    }
  });

export default dinamicCartsRouter;
