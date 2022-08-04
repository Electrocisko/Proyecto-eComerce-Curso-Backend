import { Router } from "express";
import ProductsManager from "../managers/product.manager.js";

const router = Router();
let useProductsManager = new ProductsManager();

router.get("/productos", async (req, res) => {
    let allProducts = JSON.stringify(await useProductsManager.getAll());
    res.end(allProducts);
  });

export default router;