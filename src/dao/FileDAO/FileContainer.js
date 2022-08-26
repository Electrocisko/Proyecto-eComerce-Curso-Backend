import fs from "fs";
import __dirname from "../../utils.js";
import { nanoid } from "nanoid"; // nanoid to generate random Ids

let path = __dirname + "/files/products.txt";

export default class FileContainer {
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
      console.log("No se pudo acceder", error);
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
      console.log("no se pudo grabar", error);
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





}
