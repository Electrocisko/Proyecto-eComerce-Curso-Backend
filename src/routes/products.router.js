import { Router } from "express";
import ProductsManager from "../managers/product.manager.js";
import { upLoader } from "../utils.js";
import productsService from "../dao/index.js";

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
try {
  let allProducts = await productsService.getAll();
  res.status(200).send(allProducts);
} catch (error) {
  console.log(error);
}
});

router.get("/:pid", checkAdmin, async (req, res) => {
  let productId = req.params.pid;
  let product = await productsService.getById(productId);
  product !== null
    ? res.status(200).send(JSON.stringify(product))
    : res.status(400).send('{ "error" : "non existent product"}');
});

router.post('/',checkAdmin,upLoader.single("thumbnail"), async (req,res) => {
  try {
    let newProduct = req.body;
    newProduct.thumbnail = req.file.filename;
    newProduct.timestamp = Date.now();
    let product = await productsService.save(newProduct);
    res.status(201).send({
      message: "Adhered product",
      Product: product,
    })
  } catch (error) {
    console.log(error);
  }
})

router.delete("/:pid",checkAdmin, async (req, res) => {
  let productID = req.params.pid;
  let productDeleted = await productsService.deleteById(productID);
  res.status(202).send({
    'Product Removed': productDeleted,
  });
});

router.put("/:pid", checkAdmin, upLoader.single("thumbnail"), async (req, res) => {
  let productID = req.params.pid;
  let modifiedProduct = req.body;
  modifiedProduct.thumbnail = req.file.filename;
  modifiedProduct.timestamp = Date.now();
  let existsProduct = productsService.getById;
  if (existsProduct === null) {
    return res.status(400).send("nonexistent product");
  }
  await productsService.deleteById(productID);
  await productsService.save(modifiedProduct, productID);
  res.status(200).send({
    message: "Modified product",
  });
});

export default router;
