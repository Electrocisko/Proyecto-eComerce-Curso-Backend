import { nanoid } from "nanoid";
import __dirname from "../utils.js";
import fs from "fs";
import logger from "../config/winston.config.js";

let path = __dirname + "/files/carts.txt";

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
      logger.log('error', `could not access ${error}`);
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
      logger.log('error', `could not record ${error}`);
    }
  };

  // Method that returns the cart by id or null if there is no match.
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
    let cartToDelete = await this.getById(id); // I look for the cart by id
    if (cartToDelete === null) {
      logger.log('info', `The product is not in the list`);
    } else {
      let cartsList = await this.getAll(); // I recover the data
      let indice = await cartsList.findIndex((item) => item.id === id); //I look for the index of the object by id
      cartsList.splice(indice, 1); // I remove the object from the array and update the file
      await fs.promises.writeFile(path, JSON.stringify(cartsList, null, "\t"));
    }
  };
}

export default CartManager;
