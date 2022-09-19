import { Router } from "express";
import { upLoader } from "../utils.js";
import services from "../dao/index.js";
import { nanoid } from "nanoid";

const router = Router();
let admin = true; // validate the user
// let nameFile = "/files/products.txt";

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
    let allProducts = await services.productsService.getAll();
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
    let product = await services.productsService.getById(productId);
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
    newProduct.id = nanoid(10); //for the other persistences that are not mongo
    let product = await services.productsService.save(newProduct);
    res.status(201).send({
      message: "Adhered product",
      Product: product,
    });
  } catch (error) {
    console.log(error);
    res.send({
      message: "Invalid or incomplete data entered",
    });
  }
});

router.delete("/:pid", checkAdmin, async (req, res) => {
  try {
    let productID = req.params.pid;
    let productDeleted = await services.productsService.deleteById(productID);
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
      modifiedProduct.thumbnail = req.file.filename;
      let results = await services.productsService.update(
        productID,
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
