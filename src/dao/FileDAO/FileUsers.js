import logger from "../../config/winston.config.js";
import FileContainer from "./FileContainer.js";


export default class FileUser extends FileContainer{
        constructor() {
            super("/files/users.txt")
        }

        getByMail = async (email) => {
            let list = await this.getAll();
            const foundItem = list.find((element) => element.email === email);
            if (foundItem !== undefined) {
                logger.log('debug',`getbymail ${JSON.stringify(foundItem)}`)
              return foundItem;
            } else {
              return null;
            }
          };
};

