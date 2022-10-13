import fs from "fs";
import __dirname from "../../utils.js";
import logger from "../../config/winston.config.js";

export default class FileContainer {
  constructor (path) {
    this.path = path
  }

  getAll = async () => {
    try {
      if (fs.existsSync(__dirname + this.path)) {
        let data = await fs.promises.readFile(__dirname + this.path, "utf-8");
        return JSON.parse(data);
      } else {
        let data = [];
        return data;
      }
    } catch (error) {
      logger.log('error', `could not read the file ${error}`);
    }
  };

  save = async (item) => {
    try {
      let list = await this.getAll();
      list.push(item);
      await fs.promises.writeFile(
        __dirname + this.path,
        JSON.stringify(list, null, "\t")
      );
      return item.id;
    } catch (error) {
      logger.log('error', `could not save the file ${error}`);
    }
  };

  getById = async (id) => {
    let list = await this.getAll();
    const foundItem = list.find((element) => element.id === id);
    if (foundItem !== undefined) {
      return foundItem;
    } else {
      return null;
    }
  };

  deleteById = async (id) => {
    let deleteItem;
    let toDelete = await this.getById(id);
    if (toDelete === null) {
      return (deleteItem = false);
    } else {
      let list = await this.getAll();
      let index = await list.findIndex((item) => item.id === id);
      list.splice(index, 1);
      await fs.promises.writeFile(
        __dirname + this.path,
        JSON.stringify(list, null, "\t")
      );
      return (deleteItem = true);
    }
  };

  update = async (id, modifiedItem) => {
    let modified = false;
    let product = await this.getById(id);
    if (product === null) {
      return modified;
    } else {
      modified = true;
      for (const key in product) {
        for (const item in modifiedItem) {
          if (key === item) {
            product[key] = modifiedItem[item];
          }
        }
      }
      let checkDelete = await this.deleteById(id);
      let saveFile = await this.save(product)
      return checkDelete;
    }
  };
}
