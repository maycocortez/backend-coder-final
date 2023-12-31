import __dirname from "../utils.js";
import express, { Router } from "express";

const errorRouter = Router();

errorRouter
  .use("/", express.static(__dirname + "/public"))
  .use("/", (req, res, next) => {
    res.status(404).render("404", {
      title: "404",
      error: "La direccion ingresada no existe",
    });
  });

  export default errorRouter