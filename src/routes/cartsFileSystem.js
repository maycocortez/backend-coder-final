import { Router } from "express";
import CartsManager from "../dao/FileSystem/controllers/CartsManager.js";

const normalCartsRouter = Router();
const carts = new CartsManager();

normalCartsRouter
  .post("/", async (req, res) => {
    let carts1 = await carts.addCarts();
    res.send(carts1);
  })
  .get("/:id", async (req, res) => {
    let idCart = await carts.getidCart(req.params.id);
    if (idCart === 404)
      return res.status(404).send({ error: "No existe el carrito" });
    res.send(idCart);
  })
  .post("/:cid/products/:pid", async (req, res) => {
    let cartProducts = await carts.addProductInCart(
      req.params.cid,
      req.params.pid
    );
    if (cartProducts === "error cart")
      return res.status(404).send({error: "No existe el carrito"});
    if (cartProducts === "error product")
      return res.status(404).send({error: "No existe el producto"});
    return res.send(cartProducts);
  });

export default normalCartsRouter;
