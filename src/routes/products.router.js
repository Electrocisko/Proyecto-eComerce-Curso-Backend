import { Router } from "express";
import ProductsManager from "../managers/product.manager.js";
import { upLoader } from "../utils.js";

const router = Router();
let useProductsManager = new ProductsManager();
let admin = true; // validate the user

router.get("/", async (req, res) => {
  let allProducts = JSON.stringify(await useProductsManager.getAll());
  res.end(allProducts);
});

router.get("/:pid", async (req, res) => {
  let productId = req.params.pid;
  let product = await useProductsManager.getById(productId);
  product !== null
    ? res.end(JSON.stringify(product))
    : res.end('{ "error" : "producto inexistente"}');
});

router.post("/", upLoader.single("thumbnail"), async (req, res) => {
  if (admin !== true) {
    return res
      .status(403)
      .send("No tiene los permisos necesario para esta operacion");
  }
  let newProduct = req.body;
  newProduct.thumbnail = req.file.filename;
  newProduct.timestamp = Date.now();
  let productID = await useProductsManager.save(newProduct);
  res.send({
    message: "Producto adherido",
    id: productID,
  });
});

router.delete("/:pid", async (req, res) => {
  if (admin !== true) {
    return res
      .status(403)
      .send("No tiene los permisos necesario para esta operacion");
  }
  let productID = req.params.pid;
  await useProductsManager.deleteById(productID);
  res.send({
    message: "Producto Eliminado",
  });
});

router.put("/:pid", upLoader.single("thumbnail"), async (req, res) => {
  if (admin !== true) {
    return res
      .status(403)
      .send("No tiene los permisos necesario para esta operacion");
  }
  let productID = req.params.pid;
  let modifiedProduct = req.body;
  modifiedProduct.thumbnail = req.file.filename;
  modifiedProduct.timestamp = Date.now();
  let existsProduct = useProductsManager.getById;
  if (existsProduct === null) {
    return res.status(400).send("Producto inexistente");
  }
  await useProductsManager.deleteById(productID);
  await useProductsManager.save(modifiedProduct, productID);
  res.send({
    message: "Producto Modificado con PUT",
  });
});

export default router;
