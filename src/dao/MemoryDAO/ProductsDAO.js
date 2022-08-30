import MemoryContainer from "./MemoryContainer.js";
import { nanoid } from "nanoid"; // nanoid to generate random Ids

export default class ProductsDAO extends MemoryContainer{

    save = (element,path,id) =>{
        id === undefined ? (element.id = nanoid(10)) : (element.id = id);
        this.data.push(element);
        return element;
    }
};



