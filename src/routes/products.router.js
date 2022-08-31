import { Router } from "express";
import { upLoader } from "../utils.js";
import services from "../dao/index.js";

const router = Router();
let admin = true; // validate the user
let nameFile = "/files/products.txt";

function checkAdmin(req, res, next) {
  if (admin === true) {
    next();
  } else {
    res.status(401).send({
      message: "Does not have authorization",
    });
  }
}

router.get("/", async (req, res) => {
  try {
    let allProducts = await services.productsService.getAll(nameFile);
    res.status(200).send(allProducts);
  } catch (error) {
    res.send({
      message: error,
    });
  }
});

router.get("/:pid", checkAdmin, async (req, res) => {
  try {
    let productId = req.params.pid;
    let product = await services.productsService.getById(productId, nameFile);
    product !== null
      ? res.status(200).send(JSON.stringify(product))
      : res.status(400).send('{ "error" : "non existent product"}');
  } catch (error) {
    res.send({
      message: error,
    });
  }
});

router.post("/", checkAdmin, upLoader.single("thumbnail"), async (req, res) => {
  try {
    let newProduct = req.body;
    newProduct.thumbnail = req.file.filename;
    newProduct.timestamp = Date.now();
    let product = await services.productsService.save(newProduct, nameFile);
    res.status(201).send({
      message: "Adhered product",
      Product: product,
    });
  } catch (error) {
    console.log(error);
    res.send({
      message: "Datos ingresados no validos o incompletos",
    });
  }
});

router.delete("/:pid", checkAdmin, async (req, res) => {
  try {
    let productID = req.params.pid;
    let productDeleted = await services.productsService.deleteById(
      productID,
      nameFile
    );
    res.status(202).send({
      "Product Removed": productDeleted,
    });
  } catch (error) {
    res.send({
      message: error,
    });
  }
});

router.put(
  "/:pid",
  checkAdmin,
  upLoader.single("thumbnail"),
  async (req, res) => {
    try {
      let productID = req.params.pid;
      let modifiedProduct = req.body;
      let results = await services.productsService.update(
        productID,
        nameFile,
        modifiedProduct
      );
      res.status(200).send({
        message: "Modified product",
        status: results,
      });
    } catch (error) {
      res.send({
        message: error,
      });
    }
  }
);

export default router;
