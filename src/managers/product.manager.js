import fs from "fs";
import __dirname from "../utils.js";
import { nanoid } from "nanoid"; // instale nanoid para generar Ids aleatorios

let path = __dirname + "/files/products.txt";

class ProductsManager {
  // Metodo que devuelve todos
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

  // Metodo que devuelve el product por id o null si no hay coincidencia.
  getById = async (id) => {
    let productsList = await this.getAll();
    const foundProduct = productsList.find((element) => element.id === id);
    if (foundProduct !== undefined) {
      return foundProduct;
    } else {
      return null;
    }
  };

  // Metodo que recibe un newProduct y lo graba en el archivo.
  //Modifique el metodo para que reciba un segundo parametro
  //Si recibe el segundo parametro se utiliza este para darle el id.
  save = async (newProduct, idProd) => {
    try {
      let productsList = await this.getAll();
      // Ternario si recibe segundo parametro o no.
      idProd === undefined
        ? (newProduct.id = nanoid(5)) //Utilizo nanoid con 5 caracteres
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

  // Metodo que borra un producto por id
  deleteById = async (id) => {
    let productToDelete = await this.getById(id); // Busco el objeto por id
    if (productToDelete === null) {
      console.log("El producto no esta en la lista");
    } else {
      let productsList = await this.getAll(); // recupero los datos
      let indice = await productsList.findIndex((item) => item.id === id); //Busco el indice del objeto por id
      productsList.splice(indice, 1); // Elimino del array el objeto y actualizo el archivo
      await fs.promises.writeFile(
        path,
        JSON.stringify(productsList, null, "\t")
      );
    }
  };
}

export default ProductsManager;
