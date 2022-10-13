import fs from "fs";
import __dirname from "../utils.js";
import { nanoid } from "nanoid"; // nanoid to generate random Ids
import logger from "../config/winston.config.js";

let path = __dirname + "/files/products.txt";

class ProductsManager {
  getAll = async () => {
    try {
      if (fs.existsSync(path)) {
        let data = await fs.promises.readFile(path, "utf-8");
        return JSON.parse(data);
      } else {
        let data = [];
        return data;
      }
    } catch (error) {
      logger.log('error', `could not access ${error}`);
    }
  };

  getById = async (id) => {
    let productsList = await this.getAll();
    const foundProduct = productsList.find((element) => element.id === id);
    if (foundProduct !== undefined) {
      return foundProduct;
    } else {
      return null;
    }
  };

  save = async (newProduct, idProd) => {
    try {
      let productsList = await this.getAll();
      idProd === undefined
        ? (newProduct.id = nanoid(10))
        : (newProduct.id = idProd);
      productsList.push(newProduct);
      await fs.promises.writeFile(
        path,
        JSON.stringify(productsList, null, "\t")
      );

      return newProduct.id;
    } catch (error) {
      logger.log('error', `could not save ${error}`);
    }
  };

  deleteById = async (id) => {
    let productToDelete = await this.getById(id);
    if (productToDelete === null) {
      logger.log('info', `The product is not in the list`);
    } else {
      let productsList = await this.getAll();
      let indice = await productsList.findIndex((item) => item.id === id);
      productsList.splice(indice, 1);
      await fs.promises.writeFile(
        path,
        JSON.stringify(productsList, null, "\t")
      );
    }
  };
}

export default ProductsManager;
