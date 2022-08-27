import fs from "fs";
import __dirname from "../../utils.js";
import { nanoid } from "nanoid"; // nanoid to generate random Ids



export default class FileContainer {
  getAll = async (path) => { // I send the path now by parameter
    try {
      if (fs.existsSync(__dirname+path)) {
        let data = await fs.promises.readFile(__dirname+path, "utf-8");
        return JSON.parse(data);
      } else {
        let data = [];
        console.log('Entra aca?')
        return data;
      }
    } catch (error) {
      console.log("No se pudo acceder", error);
    }
  };

  save = async (item, path, id) => {
    try {
      let list = await this.getAll(path);
      id === undefined ? (item.id = nanoid(10)) : (item.id = id);
      console.log('item',item);
      console.log('list',list);
      console.log('TYPEOF',typeof list)
      list.push(item);
      console.log(list)
      await fs.promises.writeFile(__dirname+path, JSON.stringify(list, null, "\t"));
      return item.id;
    } catch (error) {
      console.log("no se pudo grabar", error);
    }
  };

  getById = async (id,path) => {
    let list = await this.getAll(path);
    const foundItem = list.find((element) => element.id === id);
    if (foundItem !== undefined) {
      return foundItem;
    } else {
      return null;
    }
  };

  deleteById = async (id,path) => {
    let deleteItem;
    let toDelete = await this.getById(id,path);
    if (toDelete === null) {
      return (deleteItem = false);
    } else {
      let list = await this.getAll(path);
      let index = await list.findIndex((item) => item.id === id);
      list.splice(index, 1);
      await fs.promises.writeFile(__dirname+path, JSON.stringify(list, null, "\t"));
      return (deleteItem = true);
    }
  };
}
