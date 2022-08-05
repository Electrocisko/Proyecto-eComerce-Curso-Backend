import { Router } from "express";
import ProductsManager from "../managers/product.manager.js";
import { upLoader } from "../utils.js";

const router = Router();
let useProductsManager = new ProductsManager();

router.get("/products", async (req, res) => {
  let allProducts = JSON.stringify(await useProductsManager.getAll());
  res.end(allProducts);
});

router.get("/products/:prodId", async (req, res) => {
  let productId = req.params.prodId;
  if (isNaN(productId))
    return res.status(400).send("El id tiene que ser numerico");
  let product = await useProductsManager.getById(parseInt(productId));
  product !== null
    ? res.end(JSON.stringify(product))
    : res.end('{ "error" : "producto inexistente"}');
});

router.post("/products", upLoader.single("file"), async (req, res) => {
  let newProduct = req.body;
  newProduct.thumbnail = req.file.filename;
  let productID = await useProductsManager.save(newProduct);
  res.send({
    message: "Producto adherido",
    id: productID,
  });
});

router.delete("/products/:prodId", async (req, res) => {
    let productID = req.params.prodId;
    if (isNaN(productID))
      return res.status(400).send("El id tiene que ser numerico");
    await useProductsManager.deleteById(parseInt(productID));
    res.send({
      message: "Producto Eliminado",
    });
  });


router.put("/products/:prodId",upLoader.single("file"), async (req, res) => {
    let productID = req.params.prodId;
    if (isNaN(productID))
      return res.status(400).send("El id tiene que ser numerico");
      let modifiedProduct = req.body;
      modifiedProduct.thumbnail = req.file.filename;
    let existsProduct = useProductsManager.getById;
    if (existsProduct === null ) {return res.status(400).send("Producto inexistente")};
    await useProductsManager.deleteById(parseInt(productID));
    await useProductsManager.save(modifiedProduct,parseInt(productID));
    res.send({
      message: "Producto Modificado con PUT",
    });
  });







export default router;
