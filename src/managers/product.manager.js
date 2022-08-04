import fs from 'fs';
import __dirname from '../utils.js';

let path = __dirname+'/files/products.txt';

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
};

export default ProductsManager;