import { nanoid } from "nanoid";
import __dirname from "../utils.js";
import fs from "fs";

let path = __dirname + "/files/carts.txt";

// El carrito tiene que tener id, timestamp, un array de productos(solo el id)

class CartManager {
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

  save = async (newCart, idCart) => {
    try {
      let cartsList = await this.getAll();
      idCart === undefined ? (newCart.id = nanoid(6)) : (newCart.id = idCart);
      cartsList.push(newCart);
      await fs.promises.writeFile(path, JSON.stringify(cartsList, null, "\t"));
      return newCart.id;
    } catch (error) {
      console.log("no se pudo grabar", error);
    }
  };

  // Metodo que devuelve el cart por id o null si no hay coincidencia.
  getById = async (id) => {
    let cartsList = await this.getAll();
    let cart = cartsList.find((item) => item.id === id);
    if (cart !== undefined) {
      return cart;
    } else {
      return null;
    }
  };

  deleteById = async (id) => {
    let cartToDelete = await this.getById(id); // Busco el cart por id
    if (cartToDelete === null) {
      console.log("El producto no esta en la lista");
    } else {
      let cartsList = await this.getAll(); // recupero los datos
      let indice = await cartsList.findIndex((item) => item.id === id); //Busco el indice del objeto por id
      cartsList.splice(indice, 1); // Elimino del array el objeto y actualizo el archivo
      await fs.promises.writeFile(path, JSON.stringify(cartsList, null, "\t"));
    }
  };
}

export default CartManager;
