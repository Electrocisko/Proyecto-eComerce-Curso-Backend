import MemoryContainer from "./MemoryContainer.js";

let id = 0;
export default class ProductsDAO extends MemoryContainer{

    save = (element) =>{
        id++;
        element.id = id;
        this.data.push(element);
        return element;
    }
};



