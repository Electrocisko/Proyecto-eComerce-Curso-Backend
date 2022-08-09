import { Router } from "express";
import ProductsManager from "../managers/product.manager.js";
import { upLoader } from "../utils.js";

const router = Router();
let useProductsManager = new ProductsManager();
let admin = true; // validate the user

function checkAdmin(req, res, next) {
  if (admin === true) {
    next();
  } else {
    res.status(401).send({
      message: "Does not have authorization"
    });
  }
}

router.get("/", async (req, res) => {
  let allProducts = JSON.stringify(await useProductsManager.getAll());
  res.status(200).send(allProducts);
});

router.get("/:pid", checkAdmin, async (req, res) => {
  let productId = req.params.pid;
  let product = await useProductsManager.getById(productId);
  product !== null
    ? res.status(200).send(JSON.stringify(product))
    : res.status(400).send('{ "error" : "nonexistent product"}');
});

router.post("/", checkAdmin,upLoader.single("thumbnail"), async (req, res) => {
  let newProduct = req.body;
  newProduct.thumbnail = req.file.filename;
  newProduct.timestamp = Date.now();
  let productID = await useProductsManager.save(newProduct);
  res.status(201).send({
    message: "Adhered product",
    id: productID,
  });
});

router.delete("/:pid",checkAdmin, async (req, res) => {
  let productID = req.params.pid;
  await useProductsManager.deleteById(productID);
  res.status(202).send({
    message: "Removed product",
  });
});

router.put("/:pid", checkAdmin, upLoader.single("thumbnail"), async (req, res) => {
  let productID = req.params.pid;
  let modifiedProduct = req.body;
  modifiedProduct.thumbnail = req.file.filename;
  modifiedProduct.timestamp = Date.now();
  let existsProduct = useProductsManager.getById;
  if (existsProduct === null) {
    return res.status(400).send("nonexistent product");
  }
  await useProductsManager.deleteById(productID);
  await useProductsManager.save(modifiedProduct, productID);
  res.status(200).send({
    message: "Modified product",
  });
});

export default router;
